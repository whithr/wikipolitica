/**
 * Cleans the HTML string by:
 * - Replacing non-breaking spaces (&nbsp;, &#160;) with regular spaces.
 * - Collapsing multiple whitespace characters into a single space.
 * - Removing leading and trailing spaces.
 * - Optionally, handling specific cases where &nbsp; is adjacent to punctuation.
 *
 * @param htmlString - The raw HTML string to clean.
 * @returns The cleaned HTML string.
 */
// export function cleanHTML(htmlString: string): string {
//   if (!htmlString) return "";

//   // 1. Replace &nbsp; and &#160; with regular spaces (case-insensitive for &nbsp;)
//   let cleaned = htmlString.replace(/&nbsp;/gi, "").replace(/&#160;/g, "");

//   // 2. Replace multiple whitespace characters (including newlines, tabs) with a single space
//   cleaned = cleaned.replace(/\s{2,}/g, " ");

//   // 3. Optionally, handle specific cases where a space is before punctuation
//   // For example, replace " (a)" with "(a)"
//   cleaned = cleaned.replace(/\s+([,.;:!?])/g, "$1");

//   // 4. Trim leading and trailing spaces
//   cleaned = cleaned.trim();

//   return cleaned;
// }

export function cleanHTML(htmlString: string): string {
  if (!htmlString) return "";

  // Create a temporary DOM element to manipulate the HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;

  // Replace &nbsp; with regular spaces in text nodes
  const walker = document.createTreeWalker(
    tempDiv,
    NodeFilter.SHOW_TEXT,
    null,
  );

  let node: Node | null = walker.nextNode();
  while (node) {
    // Replace &nbsp; and &#160; with space
    node.nodeValue = node.nodeValue
      ? node.nodeValue.replace(/&nbsp;/gi, " ").replace(/&#160;/g, " ")
      : node.nodeValue;

    // Replace multiple spaces with a single space
    node.nodeValue = node.nodeValue
      ? node.nodeValue.replace(/\s{2,}/g, " ").trim()
      : node.nodeValue;

    node = walker.nextNode();
  }

  // Optionally, handle spaces before punctuation globally
  const cleaned = tempDiv.innerHTML.replace(/\s+([,.;:!?])/g, "$1");

  return cleaned;
}
