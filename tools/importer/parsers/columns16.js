/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main grid with two columns (left: heading, right: description, author, button)
  const mainGrid = element.querySelector('.w-layout-grid.grid-layout.tablet-1-column.grid-gap-lg');
  const mainColumns = mainGrid ? mainGrid.querySelectorAll(':scope > div') : [];
  
  // Left column: Heading and eyebrow
  const leftColumn = mainColumns[0];
  // Right column: Description, author, button
  const rightColumn = mainColumns[1];

  // Get the bottom images grid
  const imagesGrid = element.querySelector('.w-layout-grid.grid-layout.mobile-portrait-1-column.grid-gap-md');
  const imageCells = imagesGrid ? imagesGrid.querySelectorAll(':scope > div') : [];

  // Compose the top row: Header
  const headerRow = ['Columns (columns16)'];

  // Compose the second row: left and right main columns
  // Reference the actual DOM elements
  const contentRow = [leftColumn, rightColumn];

  // Compose the third row: two images, each as their own cell
  const imagesRow = Array.from(imageCells).map(cell => {
    const img = cell.querySelector('img');
    return img || '';
  });

  // Build the block table
  const cells = [
    headerRow,
    contentRow,
    imagesRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
