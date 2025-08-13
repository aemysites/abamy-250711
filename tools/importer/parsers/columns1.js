/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container with columns
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get all immediate children of the grid (each column)
  const columns = Array.from(grid.children);

  // Compose the header row, exactly as required
  const headerRow = ['Columns (columns1)'];

  // Compose the content row with all columns (each is a cell)
  const contentRow = columns;

  // Build the cells table
  const cells = [
    headerRow,
    contentRow
  ];

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
