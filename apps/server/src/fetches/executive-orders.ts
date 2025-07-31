import "dotenv/config.js";
import schedule from "node-schedule";
import { createClient } from "@supabase/supabase-js";
import { convertXmlToMarkdown } from "../lib/xml-to-markdown.utils";
import axios from "axios";
import * as cheerio from "cheerio";
import { updateJobStatus } from "../lib/status.utils";

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
  presidency_project_title: string;
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
  // Strip leading "Executive Order" + optional digits and dash
  let stripped = title.replace(/^executive orders?\s*\d*\s*(—|-|–)?\s*/i, "");
  return stripped.trim();
}

// Helper to remove spaces and force lowercase
function normalize(str: string): string {
  return str?.toLowerCase()?.replace(/\s+/g, "");
}

// ==========================================
// 4) Upsert Presidency Project records
// ==========================================

async function upsertPresidencyProjectRecords(records: DocumentData[]) {
  // 1) Fetch all rows (or at least the columns you need: "id", "title")
  const { data: allExecOrders, error: fetchError } = await supabase
    .from("executive_orders")
    .select("id, title, presidency_project_title");

  if (fetchError) {
    console.error("Error fetching executive_orders:", fetchError);
    return;
  }

  // 2) Build an array or map of normalized titles -> record
  //    For large DBs, you may want a more efficient structure,
  //    but for smaller sets, this is fine.
  const localList = allExecOrders || [];

  for (const record of records) {
    const coreTitle = extractCoreTitle(record.title);
    const normalizedCore = normalize(coreTitle);

    // 3) Try to find an existing row whose normalized DB title “contains” or “equals” that core
    //    (Choose whichever logic suits you best: `.includes()` or exact `===`)
    const match = localList.find((eo) => {
      const normalizedDbTitle = normalize(eo.title || "");
      return normalizedDbTitle?.includes(normalizedCore);
    });

    const matchWithItself = localList.find((eo) => {
      const normalizedDbTitle = normalize(eo.presidency_project_title);
      return normalizedDbTitle?.includes(
        normalize(record.presidency_project_title),
      );
    });

    if (matchWithItself) {
      continue;
    }

    if (match) {
      // 4) We have a match → update this row
      const { error: updateError } = await supabase
        .from("executive_orders")
        .update({
          presidency_project_title: record.title,
          presidency_project_date: record.date,
          presidency_project_url: record.url,
        })
        .eq("id", match.id);

      if (updateError) {
        console.error(`Error updating record #${match.id}`, updateError);
      } else {
        console.log(
          `Updated record #${match.id} with PP title: ${record.title}`,
        );
      }
    } else {
      // 5) No match → insert new row
      const { error: insertError } = await supabase
        .from("executive_orders")
        .insert({
          presidency_project_title: record.title,
          presidency_project_date: record.date,
          presidency_project_url: record.url,
        });
      if (insertError) {
        console.error(
          `Error inserting new record for: ${record.title}`,
          insertError,
        );
      } else {
        console.log(`Inserted new record with PP title: ${record.title}`);
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

    // 1) Fetch all existing orders with all columns we care about, not just document_number:
    const { data: existingOrders, error: existingError } = await supabase
      .from("executive_orders")
      .select("*"); // or select("id, document_number, presidency_project_html, ...")
    if (existingError) {
      console.error("[Error] Fetching existing orders:", existingError);
      return;
    }

    // Build a Map keyed by document_number for quick lookup:
    const existingMap = new Map<string, any>();
    if (existingOrders) {
      existingOrders.forEach((eo: any) => {
        existingMap.set(eo.document_number, eo);
      });
    }

    // We'll keep track of newly inserted records (just for logging)
    let insertCount = 0;
    let updateCount = 0;

    for (const item of allResults) {
      // 2) Fetch the full_text_xml and convert to markdown (same as before).
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

      // This is the new data from Federal Register
      const newData: ExecutiveOrder = {
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

      // 3) Check if we already have a row with this document_number:
      const existingRow = existingMap.get(item.document_number);

      if (!existingRow) {
        // No existing row, so do an INSERT
        const { error: insertError } = await supabase
          .from("executive_orders")
          .insert(newData);

        if (insertError) {
          console.error(
            `[Error] Inserting new record for doc #${item.document_number}:`,
            insertError,
          );
        } else {
          insertCount++;
        }
      } else {
        // We have an existing row. Let's do a PARTIAL UPDATE to avoid overwriting non-null fields with null.
        // Make an object to update only non-null fields in newData:
        const updatePayload: any = {};
        for (const key of Object.keys(newData)) {
          const value = (newData as any)[key];
          // Only update if the new value is NOT null/undefined
          // That way we won't overwrite existing data with null.
          if (value !== null && value !== undefined) {
            updatePayload[key] = value;
          }
        }

        // If updatePayload is empty, there's nothing to update.
        if (Object.keys(updatePayload).length > 0) {
          const { error: updateError } = await supabase
            .from("executive_orders")
            .update(updatePayload)
            .eq("id", existingRow.id); // match on primary key or doc_number

          if (updateError) {
            console.error(
              `[Error] Updating record for doc #${item.document_number}:`,
              updateError,
            );
          } else {
            updateCount++;
          }
        }
      }
    }

    console.log(
      `[Info] Done processing Federal Register EOs: ${insertCount} inserted, ${updateCount} updated.`,
    );
  } catch (err) {
    console.error("[Error] fetchAndStoreExecutiveOrders:", err);
  }
}

// ==========================================
// 6) Fetch & store Presidency Project executive orders
// ==========================================
async function fetchAndStorePresidencyProjectOrders() {
  try {
    const allRecords: DocumentData[] = [];
    let page = 0;
    const itemsPerPage = 50;
    let hasMorePages = true;

    while (hasMorePages) {
      const url =
        `https://www.presidency.ucsb.edu/advanced-search?field-keywords=&field-keywords2=&field-keywords3=&from%5Bdate%5D=&to%5Bdate%5D=&person2=375125&category2%5B0%5D=58&items_per_page=${itemsPerPage}&page=${page}&order=field_docs_start_date_time_value&sort=desc`;

      console.log(`[Info] Fetching Presidency Project page ${page + 1}...`);

      const response = await fetch(url);
      if (!response.ok) {
        console.error(
          `[Error] Failed to fetch Presidency Project page ${page + 1}:`,
          response.statusText,
        );
        break;
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      const pageRecords: DocumentData[] = [];

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
          pageRecords.push({
            date,
            title,
            url: docUrl,
            presidency_project_title: title,
          });
        }
      });

      if (pageRecords.length === 0) {
        // No records found on this page, we've reached the end
        hasMorePages = false;
      } else {
        allRecords.push(...pageRecords);
        console.log(
          `[Info] Found ${pageRecords.length} records on page ${page + 1}`,
        );

        // Check if there's a next page link
        const nextPageLink = $('a[title="Go to next page"]').length > 0;
        if (!nextPageLink || pageRecords.length < itemsPerPage) {
          hasMorePages = false;
        } else {
          page++;
        }
      }
    }

    console.log(
      `[Info] Fetched a total of ${allRecords.length} records from Presidency Project.`,
    );
    await upsertPresidencyProjectRecords(allRecords);
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
  const jobName = "executive_orders_metadata_fetcher";
  try {
    console.log(
      `[Scheduled Task: ${jobName}] Fetching executive orders from Federal Register API...`,
    );
    await fetchAndStoreExecutiveOrders();
    console.log(`[Scheduled Task: ${jobName}] Done fetching executive orders.`);

    console.log(
      `[Scheduled Task: ${jobName}] Fetching Presidency Project orders...`,
    );
    await fetchAndStorePresidencyProjectOrders();
    console.log(
      `[Scheduled Task: ${jobName}] Done fetching Presidency Project orders.`,
    );

    // This job is always overwritting, so we need to figure out a better way here.
    await updateJobStatus(jobName, { rowChanged: true }, supabase);
  } catch (err) {
    console.error(`[Scheduled Task: ${jobName}] Error:`, err);
    await updateJobStatus(
      jobName,
      { rowChanged: false, errorMsg: "error fetching executive orders" },
      supabase,
    );
  }
});

// Schedule the HTML scraper separately.
// (It will process one record every 10 seconds; adjust the schedule frequency as needed.)
schedule.scheduleJob("5/30 * * * *", async () => {
  const jobName = "executive_orders_document_fetcher";
  try {
    console.log(
      `[Scheduled Task: ${jobName}] Scraping missing presidency_project_html...`,
    );
    await scrapeMissingPresidencyProjectHtml();
    console.log(
      `[Scheduled Task: ${jobName}] Done scraping missing presidency_project_html.`,
    );
    // This job is always overwritting, so we need to figure out a better way here.
    await updateJobStatus(jobName, { rowChanged: true }, supabase);
  } catch (err) {
    console.error(`[Scheduled Task: ${jobName}] Error:`, err);
    await updateJobStatus(jobName, {
      rowChanged: false,
      errorMsg: "error scraping executive orders",
    }, supabase);
  }
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
