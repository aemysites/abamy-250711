/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container inside the section
  const container = element.querySelector(':scope > .container');
  if (!container) return;

  // Find the grid layout inside the container
  const grid = container.querySelector('.grid-layout');
  if (!grid) return;

  // Get all direct children of the grid
  const gridChildren = Array.from(grid.children);

  // The HTML structure has two left columns: one for headings, one for contact methods; and one right column: the image
  let leftContent = null; // Headings and description
  let contactList = null; // Contact list ul
  let rightImage = null; // The img

  // Identify each block by tagName and class patterns
  for (let child of gridChildren) {
    if (!leftContent && child.tagName === 'DIV') {
      leftContent = child;
    } else if (!contactList && child.tagName === 'UL') {
      contactList = child;
    } else if (!rightImage && child.tagName === 'IMG') {
      rightImage = child;
    }
  }

  // If all pieces are missing, abort
  if (!leftContent && !contactList && !rightImage) return;

  // Compose the left column: keep leftContent and contactList together if present
  const leftCol = document.createElement('div');
  if (leftContent) leftCol.appendChild(leftContent);
  if (contactList) leftCol.appendChild(contactList);

  // Compose the cells for the columns block
  const headerRow = ['Columns (columns18)'];
  const row = [leftCol, rightImage].filter(Boolean); // Only include non-null columns

  // Only add row if there's at least 1 column (should always be true in this layout)
  const cells = [headerRow, row];

  // Create and replace with the new table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
