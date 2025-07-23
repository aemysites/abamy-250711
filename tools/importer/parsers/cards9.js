/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the spec
  const headerRow = ['Cards (cards9)'];
  const cardRows = [];

  // Select all direct columns (cards)
  const cardColumns = Array.from(element.querySelectorAll(':scope .columns > .column'));
  for (const col of cardColumns) {
    // Card IMAGE: first <picture> or <img> in column (reference the real DOM node)
    let imageEl = col.querySelector('picture, img');

    // Card TEXT: prefer full .sc-Banner-content as it may contain all card text
    let contentEl = col.querySelector('.sc-Banner-content');
    // If .sc-Banner-content is absent or empty, fall back to first <p>, <h1>-<h6> with text
    if (!contentEl || !contentEl.textContent.trim()) {
      contentEl = col.querySelector('p, h1, h2, h3, h4, h5, h6');
    }
    // If still empty, skip this card
    if (!imageEl && (!contentEl || !contentEl.textContent.trim())) continue;

    // Use '' as cell if imageEl/contentEl missing
    cardRows.push([imageEl || '', contentEl || '']);
  }

  if (cardRows.length) {
    const rows = [headerRow, ...cardRows];
    const table = WebImporter.DOMUtils.createTable(rows, document);
    // Fix header colspan if needed
    if (table.rows.length > 0 && table.rows[0].cells.length === 1 && cardRows[0].length > 1) {
      table.rows[0].cells[0].setAttribute('colspan', cardRows[0].length);
    }
    element.replaceWith(table);
  }
}
