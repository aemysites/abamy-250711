/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row (exact match)
  const headerRow = ['Hero (hero10)'];

  // 2. Extract background image from section style
  let backgroundImg = null;
  const style = element.getAttribute('style') || '';
  const bgMatch = style.match(/background-image:\s*url\((['"]?)([^'"]+)\1\)/);
  if (bgMatch && bgMatch[2]) {
    backgroundImg = document.createElement('img');
    backgroundImg.src = bgMatch[2];
    backgroundImg.alt = '';
  }

  // 3. Extract the main content card (contains all visible text, headings, CTA)
  // Try to get the first box with white background (desktop prioritized over mobile)
  let contentCard = null;
  // Search within all columns and their children for white background
  const allColumns = element.querySelectorAll('.columns .column, .columns > .column');
  for (const col of allColumns) {
    if (col.getAttribute('style') && col.getAttribute('style').includes('background-color: white')) {
      // Use this column as the content card
      contentCard = col;
      break;
    }
  }
  // If none found, fallback to .sc-RichText inner content
  if (!contentCard) {
    const richText = element.querySelector('.sc-RichText');
    if (richText) {
      contentCard = richText;
    } else {
      // fallback: use the entire section
      contentCard = element;
    }
  }

  // 4. Prepare table rows (header, bg, content)
  const cells = [
    headerRow,
    backgroundImg ? [backgroundImg] : null,
    [contentCard]
  ].filter(Boolean); // Remove background row if there's no image

  // 5. Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
