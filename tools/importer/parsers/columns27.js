/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout containing the columns
  const grid = element.querySelector('.grid-layout');
  // Get the immediate children of the grid (the columns)
  const columns = grid ? Array.from(grid.children) : [];
  // We expect two columns: left (text) and right (image)
  let leftColContent = [];
  let rightColContent = [];

  if (columns.length > 0) {
    // Left column: all its child elements (text, headings, buttons)
    leftColContent = Array.from(columns[0].children);
  }

  if (columns.length > 1) {
    // Right column: image
    if (columns[1].tagName === 'IMG') {
      rightColContent = [columns[1]];
    } else {
      // If not img itself, look for an img inside
      const img = columns[1].querySelector('img');
      if (img) rightColContent = [img];
    }
  }

  // Build the table: header row, then content row with two columns
  const headerRow = ['Columns (columns27)'];
  const contentRow = [leftColContent, rightColContent];
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  element.replaceWith(table);
}
