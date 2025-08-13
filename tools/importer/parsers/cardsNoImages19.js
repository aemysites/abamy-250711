/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example exactly
  const headerRow = ['Cards'];
  // Each direct child div within grid is a card
  const cardDivs = element.querySelectorAll(':scope > div');
  const rows = Array.from(cardDivs).map(cardDiv => {
    // For each card, text is inside the first <p>
    const p = cardDiv.querySelector('p');
    // Edge case: If no <p> found, create empty cell
    return [p ? p : document.createElement('span')];
  });
  // Create table per spec
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  // Replace original element with block table
  element.replaceWith(table);
}
