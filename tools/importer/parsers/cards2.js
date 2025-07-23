/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards2)'];
  const cells = [headerRow];

  // Get all direct child columns
  const columns = element.querySelectorAll(':scope > div.column');

  columns.forEach((col) => {
    // Card container
    const banner = col.querySelector('.sc-Banner');
    if (!banner) return;

    // First cell: Find the FIRST <img> descendant of the banner
    const imgEl = banner.querySelector('img');

    // Second cell: Collect all content from .sc-Banner-content
    const contentDiv = banner.querySelector('.sc-Banner-content');
    const textElements = [];
    if (contentDiv) {
      // For each child, push the actual node (NOT clone), including text and links
      Array.from(contentDiv.childNodes).forEach((node) => {
        // Only append nodes that are not just whitespace
        if (
          (node.nodeType === 1 && node.textContent && node.textContent.trim()) ||
          (node.nodeType === 3 && node.textContent.trim())
        ) {
          textElements.push(node);
        }
      });
    }

    // Only add the row if we have both an image and text content
    if (imgEl && textElements.length) {
      cells.push([
        imgEl,
        textElements.length === 1 ? textElements[0] : textElements
      ]);
    }
  });

  // Only replace if we have a header and at least one card
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
