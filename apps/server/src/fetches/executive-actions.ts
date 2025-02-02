import "dotenv/config.js";
import RSSParser from "rss-parser";
import schedule from "node-schedule";
import { createClient } from "@supabase/supabase-js";
import { updateJobStatus } from "../lib/status.utils";

// ==========================================
// 1) ENV variables for Supabase
// ==========================================
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ==========================================
// 2) Type definitions (TypeScript only)
//    If using plain JavaScript, ignore the interfaces.
// ==========================================
interface WhiteHouseRssItem {
  title: string;
  link: string;
  pubDate: string; // e.g. "Wed, 29 Jan 2025 22:38:41 +0000"
  guid: string;
  isoDate: string; // e.g. "2025-01-29T22:38:41.000Z"
  categories?: string[]; // e.g. ["Presidential Actions"]
  contentSnippet?: string; // short snippet
  content?: string; // might be partial/truncated
  // Access the full HTML from content:encoded
  // Note: rss-parser puts it here if found
  "content:encoded"?: string;
}

interface ExecutiveActionRecord {
  title: string;
  link: string;
  pub_date: string; // We'll store an ISO date string
  description_html: string; // The short snippet or <description> HTML
  full_html: string; // The entire <content:encoded> HTML
  guid: string;
  categories: string[];
}

// ==========================================
// 3) Main function: fetch & store Exec Actions
// ==========================================
async function fetchAndStoreExecutiveActions(): Promise<number> {
  try {
    const parser = new RSSParser({
      // You can also set parser options here if needed
    });

    // 3a) Parse White House RSS feed
    const rssFeed = await parser.parseURL(
      "https://www.whitehouse.gov/news/feed/",
    );

    if (!rssFeed.items || rssFeed.items.length === 0) {
      console.log("[Info] No RSS items found. Exiting.");
      return 0;
    }

    // 3b) Filter only "Presidential Actions" category
    const presidentialActions = rssFeed.items.filter((item) => {
      const whItem = item as WhiteHouseRssItem;
      if (!whItem.categories) return false;
      return whItem.categories.includes("Presidential Actions");
    }) as WhiteHouseRssItem[];

    if (presidentialActions.length === 0) {
      console.log("[Info] No 'Presidential Actions' found in feed. Exiting.");
      return 0;
    }

    // 3c) Map each item to your DB structure
    const records: ExecutiveActionRecord[] = presidentialActions.map(
      (whItem) => {
        return {
          title: whItem.title,
          link: whItem.link,
          // `isoDate` is already a nice ISO string, fallback to new Date().toISOString() if missing
          pub_date: whItem.isoDate || new Date().toISOString(),
          // The short snippet or <description> can be item.contentSnippet
          description_html: whItem.contentSnippet || "",
          // The *full* HTML is in item["content:encoded"]
          full_html: whItem["content:encoded"] || "",
          guid: whItem.guid,
          categories: whItem.categories || [],
        };
      },
    );

    console.log(
      `[Info] Found ${records.length} Presidential Actions to insert.`,
    );

    // 3d) Insert or upsert the data into Supabase
    const { data, error } = await supabase
      .from("executive_actions") // <-- your actual table name
      .upsert(records, { onConflict: "guid" }).select();

    if (error) {
      console.error("[Error] Upserting executive actions:", error);
      return 0;
    } else {
      const count = data ? data.length : 0;
      console.log(`[Info] Successfully upserted ${count} records.`);
      return count;
    }
  } catch (err) {
    console.error("[Error] fetchAndStoreExecutiveActions:", err);
    return 0;
  }
}

// ==========================================
// 4) Schedule job: run every 10 minutes
// ==========================================
schedule.scheduleJob("*/10 * * * *", async () => {
  const jobName = "WhiteHouse_RSS_Fetch";
  try {
    console.log(
      "[Scheduled Task] Fetching White House RSS for Presidential Actions...",
    );
    const affectedCount = await fetchAndStoreExecutiveActions();
    console.log("[Scheduled Task] Done.");
    const rowChanged = affectedCount > 0;

    await updateJobStatus(jobName, { rowChanged }, supabase);
  } catch (err) {
    console.error(`[Scheduled Task] ${jobName} error:`, err);
    await updateJobStatus(jobName, {
      errorMsg: "error fetching executive actions",
    }, supabase);
  }
});

// ==========================================
// 5) Optionally run once on startup
// ==========================================
// (async () => {
//   console.log("[Startup] Running initial fetch of Presidential Actions...");
//   await fetchAndStoreExecutiveActions();
//   console.log("[Startup] Done initial fetch.");
// })();
