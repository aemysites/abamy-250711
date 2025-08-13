/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the columns for the footer
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  // Get immediate children of the grid, which represent the columns
  const columns = Array.from(grid.children);
  if (!columns.length) return;

  // Header row must be a single cell, exactly matching example
  const headerRow = ['Columns (columns9)'];

  // Second row: each column's content in its own cell
  const contentRow = columns;

  // Compose cells array: first row is header, second row is content columns
  const cells = [headerRow, contentRow];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}
