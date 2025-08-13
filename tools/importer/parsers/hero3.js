/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Hero (hero3)'];

  // Find the grid containers
  const gridLayouts = element.querySelectorAll(':scope > div.w-layout-grid > div');

  // Find background image (first img child in first grid div)
  let bgImg = null;
  if (gridLayouts.length > 0) {
    const img = gridLayouts[0].querySelector('img');
    if (img) bgImg = img;
  }

  // Find card content (in second grid div)
  let contentElements = [];
  if (gridLayouts.length > 1) {
    // There may be more nesting, so search for .card recursively
    const card = gridLayouts[1].querySelector('.card');
    if (card) {
      // Title (h1)
      const h1 = card.querySelector('h1');
      if (h1) contentElements.push(h1);
      // Subheading (p.subheading)
      const subheading = card.querySelector('p');
      if (subheading) contentElements.push(subheading);
      // Button group (div.button-group)
      const btnGroup = card.querySelector('.button-group');
      if (btnGroup) contentElements.push(btnGroup);
    }
  } else if (gridLayouts.length > 0) {
    // Fallback: check all grid divs for .card
    const card = gridLayouts[0].querySelector('.card');
    if (card) {
      const h1 = card.querySelector('h1');
      if (h1) contentElements.push(h1);
      const subheading = card.querySelector('p');
      if (subheading) contentElements.push(subheading);
      const btnGroup = card.querySelector('.button-group');
      if (btnGroup) contentElements.push(btnGroup);
    }
  }

  // Ensure empty cell if no background image or no content
  const bgImgCell = bgImg ? bgImg : '';
  const contentCell = contentElements.length > 0 ? contentElements : '';

  const cells = [
    headerRow,
    [bgImgCell],
    [contentCell]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
