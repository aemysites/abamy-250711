/* global WebImporter */
export default function parse(element, { document }) {
  // Compose rows: header, then a row per card (image, empty cell as no text)
  const headerRow = ['Cards (cards6)'];
  const rows = [headerRow];

  // Get all immediate children (cards)
  const cards = Array.from(element.querySelectorAll(':scope > div'));
  cards.forEach(card => {
    // Try to find an image inside each card
    const img = card.querySelector('img');
    // Always reference existing element, if present
    rows.push([img || '', '']);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
