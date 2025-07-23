/* global WebImporter */
export default function parse(element, { document }) {
  // Find all direct children that are columns
  const columns = Array.from(element.querySelectorAll(':scope > .column'));

  // Build each cell as an array of content from each column
  const columnCells = columns.map((col) => {
    // Grab the first child div if present, else all children
    let contentContainer = col.querySelector(':scope > div');
    let nodes;
    if (contentContainer) {
      nodes = Array.from(contentContainer.childNodes).filter(n => {
        if (n.nodeType === Node.ELEMENT_NODE) return true;
        if (n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0) return true;
        return false;
      });
      // If just one node, use node, else array
      return nodes.length === 1 ? nodes[0] : nodes;
    } else {
      nodes = Array.from(col.childNodes).filter(n => {
        if (n.nodeType === Node.ELEMENT_NODE) return true;
        if (n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0) return true;
        return false;
      });
      return nodes.length === 1 ? nodes[0] : nodes;
    }
  });

  // The header row should be a single cell (array with one item)
  const tableCells = [
    ['Columns (columns6)'],
    columnCells
  ];

  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
