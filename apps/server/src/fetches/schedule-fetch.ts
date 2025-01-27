import { createClient } from "@supabase/supabase-js";
import schedule from "node-schedule";
import nodeGeocoder from "node-geocoder";
import "dotenv/config.js";

// 1) ENV variables for Supabase & Google
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const GOOGLE_GEOCODE_API_KEY = process.env.GOOGLE_GEOCODE_API_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const geocoder = nodeGeocoder({
  provider: "google",
  apiKey: GOOGLE_GEOCODE_API_KEY,
});

// Type for each schedule item from the JSON
interface PoolReportSchedule {
  date: string;
  time?: string | null;
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
  // We'll fill coords from the geocoding result
  coords?: [number, number];
}

// 2) Fetch the entire Trump schedule from remote JSON
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

/**
 * (Optional) Geocode a location string -> [lat, lon] using Google Geocoding via node-geocoder.
 * Returns [lat, lon] or [null, null] if not found or error.
 */
async function geocodeLocation(
  location: string,
): Promise<[number, number] | [null, null]> {
  if (!location) return [null, null];
  try {
    const results = await geocoder.geocode(location);
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

// 3) Insert (NOT upsert) events into Supabase
//    We already removed them from the table, so we can safely insert them.
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

// 4) Main function: fetch entire schedule, filter, delete old, re-insert
export async function refreshLast3DaysOfSchedule(): Promise<void> {
  try {
    const data = await fetchTrumpCalendar();
    console.log(
      `[Info] Fetched ${data.length} total events from Trump Calendar.`,
    );

    // A) Figure out which dates we want to refresh
    const last3days = getLastNDays(3); // returns a Set of the last 3 "YYYY-MM-DD"

    // B) Filter events that fall in the last 3 days
    const recentEvents = data.filter((evt) => last3days.has(evt.date));

    console.log(
      `[Info] Found ${recentEvents.length} events in the last 3 days.`,
    );

    // C) Delete rows in those dates from the table
    //    We'll do a single .delete() call using .in('date', [...last3days])
    const { error: deleteError } = await supabase
      .from("president_schedule")
      .delete()
      .in("date", Array.from(last3days));

    if (deleteError) {
      console.error(
        "[Error] Deleting existing rows from the last 3 days:",
        deleteError,
      );
    } else {
      console.log("[Info] Successfully deleted rows for the last 3 days.");
    }

    // D) For each event in that 3-day window, optionally geocode location, then insert
    for (const evt of recentEvents) {
      // Optional geocoding
      const [lat, lng] = await geocodeLocation(evt.location);
      if (!lat || !lng) {
        console.warn(`[Warning] Could not geocode ${evt.location}`);
        continue;
      }
      evt.coords = [lat, lng];

      await insertScheduleEvent(evt);
    }

    console.log(
      `[Info] Successfully replaced ${recentEvents.length} events for last 3 days.`,
    );
  } catch (err) {
    console.error("[Error] refreshLast3DaysOfSchedule:", err);
  }
}

// 5) Optionally schedule the job, e.g. daily at midnight
// Schedule to run shortly past midnight (e.g., 12:01 AM)
schedule.scheduleJob("1 0 * * *", async () => {
  console.log(
    "[Scheduled Task] Running refreshLast3DaysOfSchedule shortly past midnight.",
  );
  await refreshLast3DaysOfSchedule();
});

// Schedule to run in the middle of the day (e.g., 12:00 PM)
schedule.scheduleJob("0 12 * * *", async () => {
  console.log("[Scheduled Task] Running refreshLast3DaysOfSchedule at midday.");
  await refreshLast3DaysOfSchedule();
});

// Schedule to run in the evening (e.g., 6:00 PM)
schedule.scheduleJob("0 18 * * *", async () => {
  console.log(
    "[Scheduled Task] Running refreshLast3DaysOfSchedule in the evening.",
  );
  await refreshLast3DaysOfSchedule();
});

// 6) Optionally run once immediately on startup (for testing)
// refreshLast3DaysOfSchedule().then(() => {
//   console.log("[Startup] Done refreshing last 3 days of schedule.");
// });

// =============== Helper Functions ===============
function formatYmd(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getLastNDays(numDays: number): Set<string> {
  const dates = new Set<string>();
  const now = new Date();
  for (let i = 0; i < numDays; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.add(formatYmd(d));
  }
  return dates;
}
