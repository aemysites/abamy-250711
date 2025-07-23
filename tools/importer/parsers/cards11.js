/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Cards (cards11)'];
  const rows = [];

  // Get all immediate card columns
  const columns = element.querySelectorAll(':scope > div');
  columns.forEach((col) => {
    const card = col.querySelector('figure.sc-Card');
    if (!card) return;
    // Image cell: find the first <img> inside <picture>
    let imageEl = null;
    const img = card.querySelector('picture img');
    if (img) imageEl = img;
    // Text cell: use the <figcaption>'s content (keep its structure)
    let textCell = null;
    const figcaption = card.querySelector('figcaption');
    if (figcaption && figcaption.childNodes.length) {
      // Use all childNodes (to preserve <div>s, <p>, <strong>, etc)
      textCell = Array.from(figcaption.childNodes);
    } else {
      // fallback: use empty string
      textCell = '';
    }
    // Only add row if both img and text are present
    if (imageEl && textCell) {
      rows.push([imageEl, textCell]);
    }
  });
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
