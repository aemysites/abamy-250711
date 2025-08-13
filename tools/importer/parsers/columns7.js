/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid container (should have class grid-layout)
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get all immediate children of the grid (should be columns)
  const cols = Array.from(grid.children);
  // Defensive: Only use the first two columns if more exist
  const columnsRow = cols.length >= 2 ? [cols[0], cols[1]] : cols;

  // Table cells array
  const cells = [
    ['Columns (columns7)'], // exact header as required
    columnsRow
  ];

  // Create block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element with block table
  element.replaceWith(table);
}
