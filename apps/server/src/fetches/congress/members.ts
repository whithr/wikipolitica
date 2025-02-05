import "dotenv/config.js";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../lib/database.types";

// ==========================================
// 1) ENV variables & setup
// ==========================================
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const CONGRESS_GOV_API_KEY = process.env.CONGRESS_GOV_API_KEY || "";

const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
);

// ==========================================
// 2) Types for the API responses
// ==========================================
interface ApiMembersResponse {
  members?: ApiMemberItem[];
  count?: number; // total # of results
}

interface ApiMemberItem {
  bioguideId: string;
  depiction?: {
    attribution?: string;
    imageUrl?: string;
  };
  name: string; // e.g. "Leahy, Patrick J."
  partyName: string; // e.g. "Democratic"
  state?: string; // e.g. "Vermont"
  district?: number; // e.g. 32 if House
  terms?: {
    item: Array<{
      chamber?: string; // "Senate" or "House of Representatives"
      startYear?: number; // e.g. 2023
    }>;
  };
  updateDate?: string; // e.g. "2024-04-09T15:54:25Z"
  url: string; // link to the detail endpoint
}

interface ApiMemberDetailResponse {
  member: {
    bioguideId: string;
    birthYear?: string; // e.g. "1940"
    depiction?: {
      attribution?: string;
      imageUrl?: string;
    };
    directOrderName?: string; // e.g. "Patrick J. Leahy"
    firstName?: string; // e.g. "Patrick"
    honorificName?: string; // e.g. "Mr."
    invertedOrderName?: string; // e.g. "Leahy, Patrick J."
    lastName?: string; // e.g. "Leahy"
    middleName?: string; // if any
    partyHistory?: Array<{
      partyName?: string; // e.g. "Democrat"
      startYear?: number;
      partyAbbreviation?: string; // e.g. "D"
    }>;
    state?: string; // e.g. "Vermont"
    terms?: Array<{
      congress?: number; // e.g. 117
      chamber?: string;
      startYear?: number;
      endYear?: number;
      memberType?: string; // "Senator"
      stateCode?: string; // "VT"
      stateName?: string; // "Vermont"
    }>;
    updateDate?: string; // e.g. "2022-11-07T13:42:19Z"
    birthDate?: string; // if available
    // etc. if needed
  };
  request?: {
    // fields about request
  };
}

// ==========================================
// 3) Helper: Fetch detail by bioguideId
// ==========================================
async function fetchMemberDetails(
  bioguideId: string,
): Promise<ApiMemberDetailResponse | null> {
  const url =
    `https://api.congress.gov/v3/member/${bioguideId}?api_key=${CONGRESS_GOV_API_KEY}&format=json`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      console.error(
        `fetchMemberDetails: Failed to fetch detail for ${bioguideId}`,
        resp.statusText,
      );
      return null;
    }
    return await resp.json();
  } catch (err) {
    console.error(
      `fetchMemberDetails: Error fetching detail for ${bioguideId}`,
      err,
    );
    return null;
  }
}

// ==========================================
// 4) Upsert logic for "members" table
// ==========================================
async function upsertMember(detail: ApiMemberDetailResponse["member"]) {
  const birthYearNum = detail.birthYear ? parseInt(detail.birthYear, 10) : null;

  const memberRecord = {
    bioguide_id: detail.bioguideId,
    birth_year: birthYearNum || null,
    depiction_image_url: detail.depiction?.imageUrl || null,
    depiction_attribution: detail.depiction?.attribution || null,

    direct_order_name: detail.directOrderName || null,
    first_name: detail.firstName || null,
    middle_name: detail.middleName || null,
    last_name: detail.lastName || null,
    honorific_name: detail.honorificName || null,
    inverted_order_name: detail.invertedOrderName || null,
    // update_date: detail.updateDate ? new Date(detail.updateDate) : null,
  };

  // We rely on a unique constraint for "bioguide_id".
  const { data, error } = await supabase
    .from("members")
    .upsert(memberRecord, {
      onConflict: "bioguide_id",
    })
    .select();

  if (error) {
    console.error("upsertMember: Error upserting member", error);
    return null;
  }

  const updatedRow = data?.[0];
  return updatedRow || null;
}

// ==========================================
// 5) Upsert logic for "member_congress" table
// ==========================================
async function upsertMemberCongress(
  memberId: string,
  congressId: string,
  chamber: string,
  startYear: number | null,
  state: string | null,
  district: number | null,
  partyName: string | null,
) {
  const mcRecord = {
    member_id: memberId,
    congress_id: congressId,
    chamber,
    start_year: startYear,
    state,
    district,
    party_name: partyName,
  };

  // needs a unique composite index,
  // e.g.: (member_id, congress_id, chamber).
  const { error } = await supabase
    .from("member_congress")
    .upsert(mcRecord, {
      onConflict: "member_id,congress_id,chamber",
    });

  if (error) {
    console.error(
      `upsertMemberCongress: Error upserting memberId=${memberId} congressId=${congressId} chamber=${chamber}`,
      error,
    );
  } else {
    console.log(
      `Upserted member_congress for memberId=${memberId}, congressId=${congressId}, chamber=${chamber}`,
    );
  }
}

// ==========================================
// 6) Main function: fetch members for a given Congress
//    then fetch each member's details, then upsert
// ==========================================
export async function fetchAndStoreMembersForCongress(
  congressNumber: number,
): Promise<void> {
  try {
    console.log(`[Info] Fetching members for Congress #${congressNumber}...`);

    const { data: matchingCongress, error: cError } = await supabase
      .from("congress")
      .select("id")
      .eq("congress_number", congressNumber)
      .single();
    if (cError || !matchingCongress) {
      console.error(
        `No matching "congress" found for #${congressNumber}. Make sure it's in the DB.`,
        cError,
      );
      return;
    }
    const congressId = matchingCongress.id;

    // B) We'll paginate the /member/congress/{congress} endpoint
    //    until we've fetched all results (or no more).
    let offset = 0;
    const limit = 50;
    let fetchedCount = 0;
    let totalCount = 0;

    while (true) {
      const url =
        `https://api.congress.gov/v3/member/congress/${congressNumber}?` +
        `api_key=${CONGRESS_GOV_API_KEY}&format=json` +
        `&limit=${limit}&offset=${offset}`;

      console.log(
        `[Info] Fetching members from Congress #${congressNumber} offset=${offset} limit=${limit}`,
      );
      const resp = await fetch(url);
      if (!resp.ok) {
        console.error(
          `Failed to fetch from Congress.gov (offset=${offset}):`,
          resp.statusText,
        );
        break;
      }

      const data = (await resp.json()) as ApiMembersResponse;

      //a 'count' (total results) of what we got
      if (data.count !== undefined) {
        totalCount = data.count;
      }

      // If no members returned or it's empty, we're done.
      if (!data.members || data.members.length === 0) {
        console.log("[Info] No more members returned; stopping pagination.");
        break;
      }

      console.log(
        `[Info] Received ${data.members.length} members. Total so far: ${fetchedCount} / ${
          totalCount || "?"
        }`,
      );

      // C) For each partial member, fetch detail & upsert
      for (const partialMem of data.members) {
        // 1) Get full detail
        const detailResp = await fetchMemberDetails(partialMem.bioguideId);
        if (!detailResp || !detailResp.member) {
          console.warn(
            `No detail found for bioguideId=${partialMem.bioguideId}. Skipping.`,
          );
          continue;
        }

        // 2) Upsert into "members" table
        const updatedMember = await upsertMember(detailResp.member);
        if (!updatedMember) {
          console.warn(
            `Could not upsert member with bioguideId=${partialMem.bioguideId}. Skipping member_congress.`,
          );
          continue;
        }

        // 3) Upsert into "member_congress"
        const chamberFromList = partialMem.terms?.item[0]?.chamber || null; // or handle multiple terms
        const startYearFromList = partialMem.terms?.item[0]?.startYear || null;

        // District, partyName, state from partialMem:
        const district = partialMem.district ?? null;
        const partyName = partialMem.partyName ?? null;
        const state = partialMem.state ?? null;

        await upsertMemberCongress(
          updatedMember.id, // from "members"
          congressId, // from "congress"
          chamberFromList || "",
          startYearFromList,
          state,
          district,
          partyName,
        );
      }

      // Update counters, move to next page
      fetchedCount += data.members.length;
      offset += limit;

      // If we've fetched everything (i.e., offset >= totalCount),
      // or if totalCount is unknown, continue until we get no results.
      if (totalCount && fetchedCount >= totalCount) {
        console.log("[Info] Fetched all known results; stopping.");
        break;
      }
    }

    console.log(
      `[Info] Finished storing members for Congress #${congressNumber}. Total fetched: ${fetchedCount}`,
    );
  } catch (err) {
    console.error("fetchAndStoreMembersForCongress: Error:", err);
  }
}

// fetchAndStoreMembersForCongress(119)
//   .then(() => console.log("Done!"))
//   .catch(console.error);
