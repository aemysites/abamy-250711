/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards10)'];
  // Find all direct card links (cards)
  const cardNodes = Array.from(element.querySelectorAll('a.card-link'));
  const rows = cardNodes.map(card => {
    // First column: image (mandatory)
    const imgContainer = card.querySelector('.utility-aspect-3x2');
    const imgEl = imgContainer ? imgContainer.querySelector('img') : null;

    // Second column: text content
    const content = card.querySelector('.utility-padding-all-1rem');
    const cellContent = [];
    // Tag as first line (if present)
    const tagEl = content.querySelector('.tag');
    if (tagEl) {
      cellContent.push(tagEl);
    }
    // Heading (h3)
    const headingEl = content.querySelector('h3');
    if (headingEl) {
      cellContent.push(headingEl);
    }
    // Paragraph
    const paraEl = content.querySelector('p');
    if (paraEl) {
      cellContent.push(paraEl);
    }
    // If no tag, heading or paragraph, cellContent will be empty but that's an edge case
    return [imgEl, cellContent];
  });
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
