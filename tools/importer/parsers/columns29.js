/* global WebImporter */
export default function parse(element, { document }) {
  // Find all direct column divs
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // Content cells: each direct column div referenced as-is
  const contentCells = columns.map((col) => col);
  // Header row: block name, then empty cells to match column count
  const headerRow = ['Columns (columns29)', ...Array(Math.max(0, columns.length - 1)).fill('')];
  // Compose block table
  const rows = [
    headerRow,
    contentCells
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
