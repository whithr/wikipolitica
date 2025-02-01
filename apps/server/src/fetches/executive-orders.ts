import "dotenv/config.js";
import schedule from "node-schedule";
import { createClient } from "@supabase/supabase-js";
import { convertXmlToMarkdown } from "../lib/xml-to-markdown.utils";
import axios from "axios";
import * as cheerio from "cheerio";

// ==========================================
// 1) ENV variables for Supabase
// ==========================================
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ==========================================
// 2) Type definitions
// ==========================================
interface DocumentData {
  date: string;
  title: string;
  url: string;
}

interface ExecutiveOrder {
  // Existing Federal Register fields...
  citation?: string;
  document_number?: string;
  end_page?: number;
  html_url?: string;
  pdf_url?: string;
  type?: string;
  subtype?: string;
  publication_date?: string;
  signing_date?: string;
  start_page?: number;
  title?: string;
  disposition_notes?: string;
  executive_order_number?: string;
  not_received_for_publication?: string;
  full_text_xml_url?: string;
  body_html_url?: string;
  json_url?: string;
  full_text_xml?: string;
  full_text_markdown?: string;

  // New fields for Presidency Project data:
  presidency_project_title?: string;
  presidency_project_date?: string;
  presidency_project_url?: string;
  presidency_project_html?: string;
}

// ==========================================
// 3) Utility: Extract “core” title from scraped title
// ==========================================
function extractCoreTitle(title: string): string {
  // Assumes titles from the Presidency Project are formatted like:
  // "Executive Order 14182—Enforcing the Hyde Amendment"
  const parts = title.split("—");
  if (parts.length > 1) {
    return parts.slice(1).join("—").trim();
  }
  return title.trim();
}

// ==========================================
// 4) Upsert Presidency Project records
// ==========================================
async function upsertPresidencyProjectRecords(records: DocumentData[]) {
  for (const record of records) {
    const coreTitle = extractCoreTitle(record.title);

    // Query for an existing executive order whose title contains the core title.
    const { data: existingRecords, error: queryError } = await supabase
      .from("executive_orders")
      .select("id, title")
      .ilike("title", `%${coreTitle}%`);

    if (queryError) {
      console.error("Error querying Supabase:", queryError);
      continue;
    }

    if (existingRecords && existingRecords.length > 0) {
      // Update the matched record with Presidency Project–specific fields.
      const existingId = existingRecords[0].id;
      const { error: updateError } = await supabase
        .from("executive_orders")
        .update({
          presidency_project_title: record.title,
          presidency_project_date: record.date, // Adjust format as needed.
          presidency_project_url: record.url,
        })
        .eq("id", existingId);
      if (updateError) {
        console.error(
          `Error updating record with id ${existingId}:`,
          updateError,
        );
      } else {
        console.log(
          `Updated record with id ${existingId} using title: ${record.title}`,
        );
      }
    } else {
      // No matching record found: insert a new row with the Presidency Project data.
      const { error: insertError } = await supabase
        .from("executive_orders")
        .insert({
          presidency_project_title: record.title,
          presidency_project_date: record.date,
          presidency_project_url: record.url,
        });
      if (insertError) {
        console.error("Error inserting new record:", insertError);
      } else {
        console.log(`Inserted new record with title: ${record.title}`);
      }
    }
  }
}

// ==========================================
// 5) Fetch & store Federal Register executive orders (existing code)
// ==========================================
async function fetchAndStoreExecutiveOrders() {
  try {
    console.log(
      "[Info] Fetching executive orders from Federal Register API...",
    );

    let allResults: any[] = [];
    let page = 1;
    const perPage = 100;
    let morePages = true;

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
        allResults = allResults.concat(jsonData.results);
        if (jsonData.results.length < perPage) {
          morePages = false;
        } else {
          page++;
        }
      }
    }

    console.log(
      `[Info] Fetched a total of ${allResults.length} executive orders from Federal Register.`,
    );

    const { data: existingOrders, error: existingError } = await supabase
      .from("executive_orders")
      .select("document_number");
    if (existingError) {
      console.error("[Error] Fetching existing orders:", existingError);
    }
    const existingDocNumbers = new Set(
      existingOrders ? existingOrders.map((o: any) => o.document_number) : [],
    );

    const records = await Promise.all(
      allResults.map(async (item: any) => {
        if (existingDocNumbers.has(item.document_number)) {
          return null; // Skip this record if already stored.
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
          full_text_markdown: markdownContent,
        };
      }),
    );

    const newRecords = records.filter((record) => record !== null);

    if (newRecords.length === 0) {
      console.log(
        "[Info] No new executive orders to upsert from Federal Register.",
      );
    } else {
      console.log(
        `[Info] Upserting ${newRecords.length} new executive orders from Federal Register into Supabase...`,
      );
      const { error } = await supabase
        .from("executive_orders")
        .upsert(newRecords, { onConflict: "document_number" });
      if (error) {
        console.error(
          "[Error] Upserting executive orders from Federal Register:",
          error,
        );
      } else {
        console.log(
          `[Info] Successfully upserted ${newRecords.length} new executive orders from Federal Register.`,
        );
      }
    }
  } catch (err) {
    console.error("[Error] fetchAndStoreExecutiveOrders:", err);
  }
}

// ==========================================
// 6) Fetch & store Presidency Project executive orders
// ==========================================
async function fetchAndStorePresidencyProjectOrders() {
  try {
    const url =
      "https://www.presidency.ucsb.edu/advanced-search?field-keywords=&field-keywords2=&field-keywords3=&from%5Bdate%5D=&to%5Bdate%5D=&person2=375125&category2%5B0%5D=58&items_per_page=50&order=field_docs_start_date_time_value&sort=desc";
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        "[Error] Failed to fetch Presidency Project page:",
        response.statusText,
      );
      return;
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    const records: DocumentData[] = [];

    $("tbody tr").each((index, element) => {
      const date = $(element)
        .find("td.views-field-field-docs-start-date-time-value")
        .text()
        .trim();
      const titleAnchor = $(element).find("td.views-field-title a");
      const title = titleAnchor.text().trim();
      let docUrl = titleAnchor.attr("href") || "";
      if (docUrl && !docUrl.startsWith("http")) {
        docUrl = `https://www.presidency.ucsb.edu${docUrl}`;
      }
      if (date && title && docUrl) {
        records.push({ date, title, url: docUrl });
      }
    });

    console.log(
      `[Info] Fetched ${records.length} records from Presidency Project.`,
    );
    await upsertPresidencyProjectRecords(records);
  } catch (error) {
    console.error("[Error] fetchAndStorePresidencyProjectOrders:", error);
  }
}

// ==========================================
// 7) Scrape missing presidency_project_html for records that have a URL but no HTML
// ==========================================
async function scrapeMissingPresidencyProjectHtml() {
  try {
    // Query for rows where a presidency_project_url exists but presidency_project_html is null.
    const { data: missingRecords, error } = await supabase
      .from("executive_orders")
      .select("id, presidency_project_url")
      .not("presidency_project_url", "is", null)
      .is("presidency_project_html", null);

    if (error) {
      console.error(
        "Error querying records missing presidency_project_html:",
        error,
      );
      return;
    }

    if (!missingRecords || missingRecords.length === 0) {
      console.log("No records missing presidency_project_html found.");
      return;
    }

    console.log(
      `Found ${missingRecords.length} record(s) missing presidency_project_html.`,
    );

    // Process each record sequentially.
    for (const record of missingRecords) {
      if (!record.presidency_project_url) continue;

      console.log(
        `Scraping HTML for record ID ${record.id} from ${record.presidency_project_url}`,
      );
      try {
        const htmlResponse = await axios.get(record.presidency_project_url);
        if (htmlResponse.status === 200) {
          const pageHtml = htmlResponse.data;
          const $ = cheerio.load(pageHtml);
          // Extract the entire HTML of the div under class "field-docs-content"
          const contentHtml = $("div.field-docs-content").html() || null;
          if (contentHtml) {
            const wrappedContentHtml =
              `<div class="presidency-project-wrapper">${contentHtml}</div>`;

            const { error: updateError } = await supabase
              .from("executive_orders")
              .update({ presidency_project_html: wrappedContentHtml })
              .eq("id", record.id);
            if (updateError) {
              console.error(`Error updating record ${record.id}:`, updateError);
            } else {
              console.log(
                `Successfully updated record ${record.id} with scraped HTML.`,
              );
            }
          } else {
            console.warn(
              `No content found for record ${record.id} at ${record.presidency_project_url}`,
            );
          }
        } else {
          console.error(
            `Failed to fetch ${record.presidency_project_url}: status ${htmlResponse.status}`,
          );
        }
      } catch (fetchError) {
        console.error(
          `Error fetching ${record.presidency_project_url}:`,
          fetchError,
        );
      }

      // Wait 10 seconds before processing the next record.
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  } catch (err) {
    console.error("Error in scrapeMissingPresidencyProjectHtml:", err);
  }
}

// ==========================================
// 8) Schedule jobs: run every 30 minutes for Federal Register & Presidency Project orders,
//     and schedule the HTML scraper to run (for missing HTML) separately.
// ==========================================
schedule.scheduleJob("*/30 * * * *", async () => {
  console.log(
    "[Scheduled Task] Fetching executive orders from Federal Register API...",
  );
  await fetchAndStoreExecutiveOrders();
  console.log(
    "[Scheduled Task] Done fetching executive orders from Federal Register.",
  );

  console.log(
    "[Scheduled Task] Fetching executive orders from Presidency Project...",
  );
  await fetchAndStorePresidencyProjectOrders();
  console.log(
    "[Scheduled Task] Done fetching executive orders from Presidency Project.",
  );
});

// Schedule the HTML scraper separately.
// (It will process one record every 10 seconds; adjust the schedule frequency as needed.)
schedule.scheduleJob("*/30 * * * *", async () => {
  console.log("[Scheduled Task] Scraping missing presidency_project_html...");
  await scrapeMissingPresidencyProjectHtml();
  console.log(
    "[Scheduled Task] Done scraping missing presidency_project_html.",
  );
});

// ==========================================
// 9) Run once on startup
// ==========================================
// (async () => {
//   console.log("[Startup] Running initial fetch of executive orders...");
//   await fetchAndStoreExecutiveOrders();
//   await fetchAndStorePresidencyProjectOrders();
//   console.log("[Startup] Done initial fetch.");

//   console.log(
//     "[Startup] Running initial scrape for missing presidency_project_html...",
//   );
//   await scrapeMissingPresidencyProjectHtml();
//   console.log("[Startup] Done initial HTML scrape.");
// })();
