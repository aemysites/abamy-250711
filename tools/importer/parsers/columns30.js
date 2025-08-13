/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid layout (should match .grid-layout)
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Each direct child of .grid-layout is a column
  const columns = Array.from(grid.children);

  // Compose the table
  // Header row: single cell (per the markdown example)
  const headerRow = ['Columns (columns30)'];

  // Content row: one cell per column in the grid
  const contentRow = columns.map(col => col);

  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
