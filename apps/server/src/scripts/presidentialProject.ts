import axios from "axios";
import * as cheerio from "cheerio";

interface DocumentData {
  date: string;
  title: string;
  url: string;
}

const BASE_URL = "https://www.presidency.ucsb.edu";

export async function fetchDocuments(): Promise<DocumentData[]> {
  // URL of the page to parse
  const searchUrl =
    `${BASE_URL}/advanced-search?field-keywords=&field-keywords2=&field-keywords3=&from%5Bdate%5D=&to%5Bdate%5D=&person2=375125&category2%5B0%5D=58&items_per_page=50&order=field_docs_start_date_time_value&sort=desc`;

  try {
    const response = await axios.get(searchUrl);
    const html = response.data;
    const $ = cheerio.load(html);
    const documents: DocumentData[] = [];
    console.log($.html);

    // Look for table rows with the class "views-row"
    $("tbody tr").each((index, element) => {
      const dateText = $(element)
        .find("td.views-field-field-docs-start-date-time-value")
        .text()
        .trim();

      const titleAnchor = $(element).find("td.views-field-title a");
      const titleText = titleAnchor.text().trim();
      let docUrl = titleAnchor.attr("href") || "";

      if (docUrl && !docUrl.startsWith("http")) {
        docUrl = `${BASE_URL}${docUrl}`;
      }

      if (dateText && titleText && docUrl) {
        documents.push({
          date: dateText,
          title: titleText,
          url: docUrl,
        });
      }
    });
    console.log(documents);

    return documents;
  } catch (error) {
    console.error("Error fetching or parsing the page:", error);
    return [];
  }
}

// Example usage:
(async () => {
  const docs = await fetchDocuments();
  console.log(docs);
})();
