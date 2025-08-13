/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell
  const headerRow = ['Columns (columns31)'];

  // Find the grid container (contains the columns)
  let gridContainer = element.querySelector('.grid-layout');
  if (!gridContainer) gridContainer = element;

  // Get each direct child of the grid as a column
  const columns = Array.from(gridContainer.children);

  // The second row contains all columns (each as a cell)
  const secondRow = columns;

  // Compose the table as [single-cell header], [columns as cells]
  const tableCells = [headerRow, secondRow];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);

  element.replaceWith(table);
}
