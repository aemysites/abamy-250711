/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example precisely
  const headerRow = ['Hero (hero5)'];

  // 2nd row: background image (if present)
  let imageCell = [];
  const lastDiv = element.querySelector(':scope > div:last-child');
  if (lastDiv) {
    const img = lastDiv.querySelector('img');
    if (img) {
      imageCell = [img];
    }
  }

  // 3rd row: content (headline, cta)
  let contentCell = [];
  const contentDiv = element.querySelector(':scope > div.sc-Banner-content');
  if (contentDiv) {
    // Title (as heading)
    const title = contentDiv.querySelector('.sc-Banner-title');
    if (title) {
      // Use <h1> for main heading
      const h1 = document.createElement('h1');
      h1.innerHTML = title.innerHTML;
      contentCell.push(h1);
    }
    // CTA button (as provided in the DOM)
    const cta = contentDiv.querySelector('a.Button--arrow');
    if (cta) {
      contentCell.push(cta);
    }
  }

  // Assemble table rows (1 col, 3 rows)
  const rows = [
    headerRow,
    [imageCell],
    [contentCell],
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
