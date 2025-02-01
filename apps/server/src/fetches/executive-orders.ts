import "dotenv/config.js";
import schedule from "node-schedule";
import { createClient } from "@supabase/supabase-js";
import { convertXmlToMarkdown } from "../lib/xml-to-markdown.utils";

// ==========================================
// 1) ENV variables for Supabase
// ==========================================
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ==========================================
// 2) Type definitions (optional)
// ==========================================
// (Interfaces omitted for brevity if you're not using TypeScript)

// ==========================================
// 3) Main function: fetch & store Executive Orders with Pagination
// ==========================================
async function fetchAndStoreExecutiveOrders() {
  try {
    console.log(
      "[Info] Fetching executive orders from Federal Register API...",
    );

    //@ts-expect-error any
    let allResults = [];
    let page = 1;
    const perPage = 100; // Use a value allowed by the API (the API default might be 20)
    let morePages = true;

    // Loop through pages until no more records are returned.
    while (morePages) {
      const FEDERAL_REGISTER_API_URL =
        `https://www.federalregister.gov/api/v1/documents?` +
        `conditions%5Bcorrection%5D=0&` +
        `conditions%5Bpresident%5D=donald-trump&` +
        `conditions%5Bpresidential_document_type%5D=executive_order&` +
        `conditions%5Bsigning_date%5D%5Bgte%5D=01%2F20%2F2025&` +
        `conditions%5Bsigning_date%5D%5Blte%5D=02%2F01%2F2025&` +
        `conditions%5Btype%5D%5B%5D=PRESDOCU&` +
        `fields%5B%5D=citation&` +
        `fields%5B%5D=document_number&` +
        `fields%5B%5D=end_page&` +
        `fields%5B%5D=html_url&` +
        `fields%5B%5D=pdf_url&` +
        `fields%5B%5D=type&` +
        `fields%5B%5D=subtype&` +
        `fields%5B%5D=publication_date&` +
        `fields%5B%5D=signing_date&` +
        `fields%5B%5D=start_page&` +
        `fields%5B%5D=title&` +
        `fields%5B%5D=disposition_notes&` +
        `fields%5B%5D=executive_order_number&` +
        `fields%5B%5D=not_received_for_publication&` +
        `fields%5B%5D=full_text_xml_url&` +
        `fields%5B%5D=body_html_url&` +
        `fields%5B%5D=json_url&` +
        `format=json&` +
        `include_pre_1994_docs=true&` +
        `order=executive_order&` +
        `per_page=${perPage}&page=${page}`;

      const response = await fetch(FEDERAL_REGISTER_API_URL);
      if (!response.ok) {
        console.error(
          "[Error] Failed to fetch executive orders:",
          response.statusText,
        );
        return;
      }

      const jsonData = await response.json();
      if (!jsonData.results || !Array.isArray(jsonData.results)) {
        console.log("[Info] No executive orders found on page", page);
        break;
      }

      if (jsonData.results.length === 0) {
        morePages = false;
      } else {
        //@ts-expect-error any
        allResults = allResults.concat(jsonData.results);
        // If the number of results is less than our perPage value,
        // we have reached the last page.
        if (jsonData.results.length < perPage) {
          morePages = false;
        } else {
          page++;
        }
      }
    }

    console.log(
      `[Info] Fetched a total of ${allResults.length} executive orders.`,
    );

    // Optional: Query Supabase to get already stored document numbers so you
    // don't re-fetch and process records you already have.
    const { data: existingOrders, error: existingError } = await supabase
      .from("executive_orders")
      .select("document_number");
    if (existingError) {
      console.error("[Error] Fetching existing orders:", existingError);
    }
    const existingDocNumbers = new Set(
      existingOrders ? existingOrders.map((o) => o.document_number) : [],
    );

    // Process each executive order:
    const records = await Promise.all(
      allResults.map(async (item) => {
        // If you want to skip processing of existing records, do so here:
        // (Comment out the following two lines if you want to reprocess every record.)
        if (existingDocNumbers.has(item.document_number)) {
          return null; // Skip this record
        }

        let xmlContent = "";
        try {
          const xmlResponse = await fetch(item.full_text_xml_url);
          if (xmlResponse.ok) {
            xmlContent = await xmlResponse.text();
          } else {
            console.error(
              `[Error] Failed to fetch XML for document ${item.document_number}: ${xmlResponse.statusText}`,
            );
          }
        } catch (xmlError) {
          console.error(
            `[Error] Exception while fetching XML for document ${item.document_number}:`,
            xmlError,
          );
        }

        const markdownContent = xmlContent
          ? convertXmlToMarkdown(xmlContent)
          : "";

        return {
          citation: item.citation,
          document_number: item.document_number,
          end_page: item.end_page,
          html_url: item.html_url,
          pdf_url: item.pdf_url,
          type: item.type,
          subtype: item.subtype,
          publication_date: item.publication_date,
          signing_date: item.signing_date,
          start_page: item.start_page,
          title: item.title,
          disposition_notes: item.disposition_notes,
          executive_order_number: item.executive_order_number,
          not_received_for_publication: item.not_received_for_publication,
          full_text_xml_url: item.full_text_xml_url,
          body_html_url: item.body_html_url,
          json_url: item.json_url,
          full_text_xml: xmlContent,
          full_text_markdown: markdownContent, // New field with the Markdown conversion
        };
      }),
    );

    // Filter out any records that were skipped (returned as null)
    const newRecords = records.filter((record) => record !== null);

    if (newRecords.length === 0) {
      console.log("[Info] No new executive orders to upsert.");
    } else {
      console.log(
        `[Info] Upserting ${newRecords.length} new executive orders into Supabase...`,
      );
      // Upsert the records into Supabase.
      // The onConflict field here is set to "document_number"
      const { error } = await supabase
        .from("executive_orders")
        .upsert(newRecords, { onConflict: "document_number" });
      if (error) {
        console.error("[Error] Upserting executive orders:", error);
      } else {
        console.log(
          `[Info] Successfully upserted ${newRecords.length} new executive orders.`,
        );
      }
    }
  } catch (err) {
    console.error("[Error] fetchAndStoreExecutiveOrders:", err);
  }
}

// ==========================================
// 4) Schedule job: run every 10 minutes
// ==========================================
schedule.scheduleJob("*/10 * * * *", async () => {
  console.log(
    "[Scheduled Task] Fetching executive orders from Federal Register API...",
  );
  await fetchAndStoreExecutiveOrders();
  console.log("[Scheduled Task] Done fetching executive orders.");
});

// ==========================================
// 5) (Optional) Run once on startup
//    Remove or comment out the following block if you want the job to run only on schedule.
// ==========================================
(async () => {
  console.log("[Startup] Running initial fetch of executive orders...");
  await fetchAndStoreExecutiveOrders();
  console.log("[Startup] Done initial fetch.");
})();
