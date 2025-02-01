import { DOMParser } from "xmldom";

// Define node type constants.
const ELEMENT_NODE = 1;
const TEXT_NODE = 3;

/**
 * Converts an XML string into a Markdown string.
 * - Skips any <TITLE3> elements.
 * - Renders <EXECORDR> as a level-1 header, <HD> as level-2, and paragraphs for <FP> and <P>.
 * - Processes inline <E> elements: T="04" becomes bold, T="03" becomes italic.
 *
 * @param xml - The XML string to convert.
 * @returns The resulting Markdown string.
 */
export function convertXmlToMarkdown(xml: string): string {
  // Parse the XML string into a DOM document.
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");

  /**
   * Recursively process a node and return its Markdown representation.
   */
  function processNode(node: any): string {
    // Process text nodes.
    if (node.nodeType === TEXT_NODE) {
      return node.nodeValue ? node.nodeValue.replace(/\s+/g, " ") : "";
    }

    // Process element nodes.
    if (node.nodeType === ELEMENT_NODE) {
      const el = node as Element;
      const tag = el.tagName.toLowerCase();
      let content = processChildren(el); // Process child nodes.

      switch (tag) {
        case "title3":
          // Skip this element.
          return "";

        case "execordr":
          // Render as a level-1 header.
          return `# ${content.trim()}\n\n`;

        case "hd":
          // Render as a level-2 header.
          return `## ${content.trim()}\n\n`;

        case "pres":
          // Render as a paragraph.
          return `${content.trim()}\n\n`;

        case "fp":
          // Render as a paragraph.
          return `${content.trim()}\n\n`;

        case "p":
          // Render as a paragraph.
          return `${content.trim()}\n\n`;

        case "e": {
          // Inline formatting for <E> elements.
          const tAttr = el.getAttribute("T");
          const trimmed = content.trim();
          if (tAttr === "04") {
            return `**${trimmed}**`;
          } else if (tAttr === "03") {
            return `*${trimmed}*`;
          }
          return trimmed;
        }

        case "prtpage":
          // Skip page markers.
          return "";

        case "gph": {
          // For graphics, look for a <GID> child.
          const gidEl = el.getElementsByTagName("gid")[0];
          if (gidEl) {
            const gidText = gidEl.textContent ? gidEl.textContent.trim() : "";
            return `![Graphic: ${gidText}]\n\n`;
          }
          return "";
        }

        // For these elements, simply output their text.
        case "psig":
        case "place":
        case "date":
        case "frdoc":
        case "filed":
        case "bilcod":
          return `${content.trim()}\n\n`;

        default:
          // For any unknown element, process its children.
          return content;
      }
    }

    return "";
  }

  /**
   * Process all child nodes of a given node.
   */
  function processChildren(node: any): string {
    let result = "";
    for (let i = 0; i < node.childNodes.length; i++) {
      result += processNode(node.childNodes[i]);
    }
    return result;
  }

  // Start processing from the document's root element.
  const markdown = processNode(doc.documentElement);
  return markdown.trim();
}
