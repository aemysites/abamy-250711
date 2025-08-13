/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to safely get first child by selector
  function getFirst(el, sel) {
    const found = el.querySelector(sel);
    return found || null;
  }
  const headerRow = ['Cards (cards24)'];
  // Get all direct card anchors
  const cards = Array.from(element.querySelectorAll(':scope > a'));
  const rows = cards.map(card => {
    // First column: Image element (reference directly)
    const imgWrapper = getFirst(card, '.utility-aspect-2x3');
    const img = imgWrapper ? getFirst(imgWrapper, 'img') : null;
    // Second column: text content
    const textParts = [];
    // Tag and date row, if present
    const metaRow = getFirst(card, '.flex-horizontal');
    if (metaRow) {
      // Combine tags and date in one horizontal group
      Array.from(metaRow.children).forEach(child => {
        textParts.push(child);
      });
    }
    // Heading (h3 or element with h4-heading class)
    const heading = getFirst(card, 'h3') || getFirst(card, '.h4-heading');
    if (heading) {
      textParts.push(heading);
    }
    // Only add non-empty image and text cell
    return [img, textParts.length ? textParts : ''];
  });
  const tableArray = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableArray, document);
  element.replaceWith(block);
}
