import "dotenv/config.js";
import { createClient } from "@supabase/supabase-js";

// ==========================================
// 1) ENV variables for Supabase
// ==========================================
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const CONGRESS_GOV_API_KEY = process.env.CONGRESS_GOV_API_KEY || "";
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface ApiCongressItem {
  endYear: number; // e.g. 2022
  name: string; // e.g. "117th Congress"
  startYear: number; // e.g. 2021
  number: number;
  sessions: ApiSessionItem[];
}

interface ApiSessionItem {
  chamber: string; // e.g. "House of Representatives", "Senate"
  endDate: string | null; // e.g. "2022-01-03" or null
  number: number; // Session number
  startDate: string | null; // e.g. "2021-01-03" or null
  type: string | null; // e.g. "R"
}

async function upsertCongressAndSessions(congress: ApiCongressItem) {
  if (!congress.number) {
    console.warn(
      `Skipping invalid entry, could not parse congress number from "${congress.name}".`,
    );
    return;
  }

  // 2) Upsert into "congress" table
  const { data: upserted, error: upsertError } = await supabase
    .from("congress")
    .insert<{
      congress_number: number;
      name: string;
      start_year: number | null;
      end_year: number | null;
      update_date: Date;
    }>({
      congress_number: congress.number,
      name: congress.name,
      start_year: congress.startYear,
      end_year: congress.endYear,
      update_date: new Date(),
    }).select();

  if (upsertError) {
    console.error(
      `Error upserting congress "${congress.name}" (#${congress.number}):`,
      upsertError,
    );
    return;
  }

  // 3) Extract the ID of the upserted or existing row
  const congressRow = upserted?.[0];
  if (!congressRow) {
    console.warn(
      `No data returned from upsert for congress "${congress.name}". Skipping its sessions.`,
    );
    return;
  }

  // 4) For each session, upsert into "congress_sessions"
  for (const session of congress.sessions) {
    const sessionRecord = {
      chamber: session.chamber,
      congress_id: congressRow.id,
      end_date: session.endDate,
      session_number: session.number,
      start_date: session.startDate,
      type: session.type,
    };

    const { error: sessionUpsertError } = await supabase
      .from("congress_sessions")
      .insert(sessionRecord);

    if (sessionUpsertError) {
      console.error(
        `Error upserting session #${session.number} for congress_id=${congressRow.id}:`,
        sessionUpsertError,
      );
    } else {
      console.log(
        `Upserted session #${session.number} - chamber=${session.chamber} for Congress #${congress.number}`,
      );
    }
  }
}

// ==========================================
// 4) Fetch from Congress.gov API, then store
// ==========================================
export async function fetchAndStoreCongress(): Promise<void> {
  try {
    // Hardcoded for 119 for now - just want to test the data flow for a single congress session, and see how much data this is.
    const url =
      `https://api.congress.gov/v3/congress/119?api_key=${CONGRESS_GOV_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch from Congress.gov: ${response.statusText}`,
      );
    }

    const data = await response.json();
    if (!data.congress) {
      console.log("[Info] No congress data returned from API.");
      return;
    }

    console.log(`[Info] Fetched ${data.congress} congress records.`);
    await upsertCongressAndSessions(data.congress);

    console.log("[Info] Done fetching & storing Congress data.");
  } catch (error) {
    console.error("[Error] fetchAndStoreCongress:", error);
  }
}

// fetchAndStoreCongress();
