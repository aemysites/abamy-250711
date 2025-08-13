/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matching example
  const headerRow = ['Hero (hero14)'];

  // Get immediate children of the top-level 'element' (should be div.w-layout-grid)
  let grid = element.querySelector(':scope > .w-layout-grid');
  if (!grid) {
    // fallback if grid not found
    grid = element;
  }
  const gridChildren = grid.querySelectorAll(':scope > div');

  // 2nd level: Locate the background image cell (first grid child)
  let bgImg = '';
  if (gridChildren.length > 0) {
    const bgDiv = gridChildren[0];
    const foundImg = bgDiv.querySelector('img');
    if (foundImg) {
      bgImg = foundImg;
    }
  }

  // 3rd level: Locate the content cell (headline, subheadline, cta)
  let contentCell = '';
  if (gridChildren.length > 1) {
    const contentDiv = gridChildren[1];
    // This block's content is inside the .utility-margin-bottom-6rem div
    const mainContent = contentDiv.querySelector('.utility-margin-bottom-6rem');
    if (mainContent) {
      contentCell = mainContent;
    }
  }

  // Compose the block table: 1 column, 3 rows
  const rows = [
    headerRow,
    [bgImg],
    [contentCell],
  ];

  // Replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
