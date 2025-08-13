/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header matches example exactly
  const headerRow = ['Hero (hero12)'];

  // 2. Find background image - first grid column, should be immediate child (div) containing the background <img>
  let backgroundImg = null;
  const gridCols = element.querySelectorAll(':scope > div > div');
  if (gridCols[0]) {
    backgroundImg = gridCols[0].querySelector('img');
  }

  // 3. Find the content (headline, subheadings, CTA, etc.)
  let contentCell = null;
  if (gridCols[1]) {
    // Find .card-body (should be only one)
    const cardBody = gridCols[1].querySelector('.card-body');
    if (cardBody) {
      // Find the inner grid (which has two children: left img, right text content)
      const grid = cardBody.querySelector('.grid-layout');
      if (grid) {
        // Compose a container holding all content (image + text content)
        const contentContainer = document.createElement('div');
        Array.from(grid.children).forEach(child => {
          contentContainer.appendChild(child);
        });
        contentCell = contentContainer;
      } else {
        // fallback: use cardBody as is
        contentCell = cardBody;
      }
    } else {
      // fallback: use gridCols[1] as is
      contentCell = gridCols[1];
    }
  }

  // 4. Build cells for createTable (always 1 col, 3 rows)
  const cells = [
    headerRow,
    [backgroundImg],
    [contentCell],
  ];
  
  // 5. Replace original element with the new table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
