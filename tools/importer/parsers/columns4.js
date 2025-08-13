/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified by guidelines
  const headerRow = ['Columns (columns4)'];

  // Find the 4-column grid block
  const grid = element.querySelector('.grid-layout');
  let columns = [];

  if (grid) {
    // For each column, collect its entire content
    const colDivs = grid.querySelectorAll(':scope > div');
    columns = Array.from(colDivs).map((colDiv) => {
      // Avoid empty columns: only reference if there's actual content
      const nodes = Array.from(colDiv.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Keep all elements
          return true;
        }
        return false;
      });
      // Reference all content, preserving semantic structure
      if (nodes.length === 1) return nodes[0];
      if (nodes.length > 1) return nodes;
      // For an empty column, insert an empty span (could also insert '' but span is more robust)
      const emptySpan = document.createElement('span');
      return emptySpan;
    });
  }

  // Only create block if there are columns
  if (columns.length > 0) {
    const rows = [headerRow, columns];
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
  // If grid not found or no columns, do nothing (to avoid errors)
}
