/* global WebImporter */
export default function parse(element, { document }) {
  // Block table header, exactly as in the example
  const headerRow = ['Columns (columns36)'];

  // Find the main 2-column grid layout inside the header
  const grid = element.querySelector('.w-layout-grid.grid-layout.tablet-1-column.grid-gap-xxl');
  if (!grid) return;

  // The left column contains heading, subheading, and buttons
  const colLeft = grid.children[0];
  // The right column contains a grid of images (3 images)
  const colRight = grid.children[1];

  // LEFT CONTENT: Collect heading, subheading, and button group into one cell
  const leftContent = [];
  const heading = colLeft.querySelector('h1');
  if (heading) leftContent.push(heading);
  const subheading = colLeft.querySelector('p');
  if (subheading) leftContent.push(subheading);
  const buttonGroup = colLeft.querySelector('.button-group');
  if (buttonGroup) leftContent.push(buttonGroup);

  // RIGHT CONTENT: Gather all immediate <img> elements from the nested grid
  const imagesGrid = colRight.querySelector('.w-layout-grid');
  let rightContent = [];
  if (imagesGrid) {
    rightContent = Array.from(imagesGrid.querySelectorAll('img'));
  }

  // Build the block table cells
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the table block and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
