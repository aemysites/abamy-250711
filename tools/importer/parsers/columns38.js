/* global WebImporter */
export default function parse(element, { document }) {
  // Find all immediate child divs (columns)
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Each div contains an <img> representing the column's content
  const rowCells = columnDivs.map(div => {
    const img = div.querySelector('img');
    return img ? img : div;
  });

  // Header row: must be a single cell
  const cells = [
    ['Columns (columns38)'], // Header is a single cell only
    rowCells               // Second row: one cell per column
  ];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Fix: Set colspan on the header cell so it spans all columns
  const headerRow = block.querySelector('tr:first-child');
  if (headerRow && headerRow.children.length === 1) {
    headerRow.children[0].setAttribute('colspan', rowCells.length);
  }

  element.replaceWith(block);
}
