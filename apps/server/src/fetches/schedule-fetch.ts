import { createClient } from "@supabase/supabase-js";
import schedule from "node-schedule";
import nodeGeocoder from "node-geocoder";
import "dotenv/config.js";

// ==========================================
// 1) ENV variables for Supabase & Google
// ==========================================
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const GOOGLE_GEOCODE_API_KEY = process.env.GOOGLE_GEOCODE_API_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const geocoder = nodeGeocoder({
  provider: "google",
  apiKey: GOOGLE_GEOCODE_API_KEY,
});

// ==========================================
// 2) Types
// ==========================================
interface PoolReportSchedule {
  date: string; // e.g. "2025-01-10"
  time?: string | null; // e.g. "13:00:00+00"
  time_formatted?: string | null;
  details: string;
  year: number;
  month: string;
  day: number;
  day_of_week: string;
  type: string;
  location: string;
  coverage: string;
  daily_text: string;
  url?: string | null;
  video_url?: string | null;
  day_summary?: Record<string, unknown> | null;
  newmonth?: boolean;
  daycount?: number | null;
  lastdaily?: boolean;
  coords?: [number, number]; // We'll store geocoded [lat, lon]
}

// ==========================================
// 3) Fetch the entire Trump schedule
// ==========================================
async function fetchTrumpCalendar(): Promise<PoolReportSchedule[]> {
  const response = await fetch(
    "https://media-cdn.factba.se/rss/json/trump/calendar-full.json",
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch calendar data. Status: ${response.status}`,
    );
  }
  return response.json() as Promise<PoolReportSchedule[]>;
}

// ==========================================
// 4) (Optional) Geocode a location
// ==========================================
async function geocodeLocation(
  location: string,
): Promise<[number, number] | [null, null]> {
  if (!location) return [null, null];
  try {
    const normalizedLocation = normalizeLocation(location);
    const results = await geocoder.geocode(normalizedLocation);
    if (results && results.length > 0) {
      const { latitude, longitude } = results[0];
      if (!latitude || !longitude) return [null, null];
      return [latitude, longitude];
    }
    return [null, null];
  } catch (err) {
    console.error("Geocoding error:", err);
    return [null, null];
  }
}

// ==========================================
// 5) Insert (NOT upsert) into Supabase
// ==========================================
async function insertScheduleEvent(evt: PoolReportSchedule): Promise<void> {
  const [latitude, longitude] = evt.coords ?? [null, null];

  const { error } = await supabase
    .from("president_schedule")
    .insert({
      date: evt.date,
      time: evt.time,
      time_formatted: evt.time_formatted,
      details: evt.details,
      year: evt.year,
      month: evt.month,
      day: evt.day,
      day_of_week: evt.day_of_week,
      type: evt.type,
      location: evt.location,
      coverage: evt.coverage,
      daily_text: evt.daily_text,
      url: evt.url,
      video_url: evt.video_url,
      day_summary: evt.day_summary ?? null,
      newmonth: evt.newmonth ?? null,
      daycount: evt.daycount ?? null,
      lastdaily: evt.lastdaily ?? false,
      latitude,
      longitude,
    });

  if (error) {
    console.error("Error inserting schedule event:", error);
  }
}

// ==========================================
// 6) Main refresh: last 3 days + any future
// ==========================================
export async function refreshRecentAndFuture(
  allEvents: PoolReportSchedule[],
): Promise<void> {
  try {
    const totalFetched = allEvents.length;
    console.log(`[Info] Fetched ${totalFetched} total events.`);

    // 1) Build sets: last 2 days + future
    const last3Days = getLastNDays(2);
    const futureDates = getFutureDates(allEvents);

    const datesToRefresh = new Set<string>([...last3Days, ...futureDates]);
    console.log(`[Info] # of dates to refresh: ${datesToRefresh.size}`);

    // 2) Delete existing rows for those dates
    const { error: deleteError } = await supabase
      .from("president_schedule")
      .delete()
      .in("date", Array.from(datesToRefresh));

    if (deleteError) {
      console.error("[Error] Deleting rows in refresh range:", deleteError);
    } else {
      console.log("[Info] Successfully deleted rows in refresh range.");
    }

    // 3) Filter all events for those specific dates
    const eventsToReinsert = allEvents.filter((evt) =>
      datesToRefresh.has(evt.date)
    );

    // 4) (Optional) geocode & insert
    let insertedCount = 0;
    for (const evt of eventsToReinsert) {
      const [lat, lng] = await geocodeLocation(evt.location);
      if (lat && lng) {
        evt.coords = [lat, lng];
      } else {
        console.warn(`[Warning] Could not geocode "${evt.location}"`);
      }
      await insertScheduleEvent(evt);
      insertedCount++;
    }
    console.log(
      `[Info] Reinserted ${insertedCount} events for last 3 days + future.`,
    );
  } catch (err) {
    console.error("[Error] refreshRecentAndFuture:", err);
  }
}

// ==========================================
// 7) "Check & Refresh" logic
//    - runs every 30 mins
//    - only refreshes if there's a newer
//      date+time in remote than what's in DB
// ==========================================
async function checkAndRefresh(): Promise<void> {
  try {
    // 1) Fetch remote schedule data
    const allEvents = await fetchTrumpCalendar();

    // 2) Find the max date+time from remote
    const remoteMaxDateTime = findMaxDateTime(allEvents);
    if (!remoteMaxDateTime) {
      console.log("[Info] No events found in remote data. Skipping refresh.");
      return;
    }

    // 3) Find the max date+time from DB
    // We'll order by date DESC, time DESC and pick the first row
    const { data: maxRow, error } = await supabase
      .from("president_schedule")
      .select("date, time")
      .order("date", { ascending: false })
      .order("time", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // If there's an error or no data in DB, we can proceed with refresh
      console.warn(
        "[Warning] Could not fetch max date+time from DB. Refreshing...",
      );
      await refreshRecentAndFuture(allEvents);
      return;
    }

    if (!maxRow) {
      // If DB is empty, definitely refresh
      console.log("[Info] DB is empty. Refreshing everything...");
      await refreshRecentAndFuture(allEvents);
      return;
    }

    // Combine DB date + time into a single ISO string, or fallback if time is null
    const dbMaxDateTime = combineDateTime(maxRow.date, maxRow.time);

    // 4) Compare date+time
    if (new Date(remoteMaxDateTime) > new Date(dbMaxDateTime)) {
      console.log(
        `[Info] Found newer data (remote max: ${remoteMaxDateTime}, DB max: ${dbMaxDateTime}). Refreshing...`,
      );
      await refreshRecentAndFuture(allEvents);
    } else {
      console.log(
        `[Info] No new data detected (remote max: ${remoteMaxDateTime}, DB max: ${dbMaxDateTime}). Skipping refresh.`,
      );
    }
  } catch (err) {
    console.error("[Error] checkAndRefresh:", err);
  }
}

// ==========================================
// 8) Schedule job: every 30 minutes
//    e.g. "*/30 * * * *" => run at minute 0,30
// ==========================================
schedule.scheduleJob("*/30 * * * *", async () => {
  console.log("[Scheduled Task] Checking for new events...");
  await checkAndRefresh();
});

// (Optional) Run once on startup for testing
// checkAndRefresh().then(() => {
//   console.log("[Startup] Done checking/refreshing schedule.");
// });

// ==========================================
// ============ Helper Functions ============
// ==========================================
function formatYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Returns a Set of strings for the last N calendar days,
 * in YYYY-MM-DD format, including "today".
 */
function getLastNDays(numDays: number): Set<string> {
  const dates = new Set<string>();
  const now = new Date();
  for (let i = 0; i < numDays; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.add(formatYMD(d));
  }
  return dates;
}

/**
 * Returns a Set of all dates in the data that are >= today's date.
 */
function getFutureDates(data: PoolReportSchedule[]): Set<string> {
  const todayStr = formatYMD(new Date());
  const futureDates = new Set<string>();
  for (const evt of data) {
    if (evt.date >= todayStr) {
      futureDates.add(evt.date);
    }
  }
  return futureDates;
}

/**
 * Normalizes location for geocoding, e.g. if location is "South Lawn", we expand it.
 * We do this because some locations given to us don't mesh well with the geocode api
 */
function normalizeLocation(location: string): string {
  if (location.toLowerCase() === "south lawn") {
    return "South Lawn, The White House, Washington, DC 20500";
  } else if (location.toLowerCase() === "east room") {
    return "East Room, The White House, Washington, DC 20500";
  }
  return location;
}

/**
 * Finds the maximum date-time from a list of events by:
 *  - Combining `date` + `time` into an ISO-like string
 *  - Sorting or reducing to find the latest
 *
 * Returns a string in ISO form (e.g. "2025-01-10T13:00:00Z") or null if empty.
 */
function findMaxDateTime(events: PoolReportSchedule[]): string | null {
  if (!events || events.length === 0) return null;

  const dateTimeList = events.map((evt) => {
    return combineDateTime(evt.date, evt.time);
  });

  // Sort descending
  dateTimeList.sort((a, b) => (a < b ? 1 : -1));
  return dateTimeList[0] || null;
}

/**
 * Combine date ("YYYY-MM-DD") and time ("HH:mm:ss+00" or maybe null)
 * into a full ISO-like string for comparison, e.g. "2025-01-10T13:00:00Z".
 */
function combineDateTime(dateStr: string, timeStr?: string | null): string {
  // If time is missing, assume midnight (00:00:00Z) or something default
  let hhmmss = "00:00:00";
  if (timeStr) {
    // The remote time might be "13:00:00+00"
    // Remove the +00 if present
    hhmmss = timeStr.replace(/\+.+$/, ""); // remove "+00" or any timezone portion
  }
  return `${dateStr}T${hhmmss}Z`;
}
