/* global WebImporter */
export default function parse(element, { document }) {
  // Locate grid columns (usually 2 columns for this block)
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  const gridChildren = Array.from(grid.children);
  if (gridChildren.length < 2) return;

  // Column 1: Image
  const imageCol = gridChildren.find((child) => child.tagName === 'IMG');
  // Column 2: Content block
  const contentCol = gridChildren.find((child) => child !== imageCol);

  // If for some reason columns are missing, handle gracefully
  if (!imageCol || !contentCol) return;

  // Table header matches example: 'Columns (columns32)'
  const headerRow = ['Columns (columns32)'];
  // Second row: [image, content]
  const dataRow = [imageCol, contentCol];

  const cells = [headerRow, dataRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}