/* global WebImporter */
export default function parse(element, { document }) {
  // Block header exactly as in the example
  const headerRow = ['Cards (cards21)'];

  // Find the card body container
  let cardBody = element.querySelector('.card-body');
  if (!cardBody) cardBody = element;

  // Image extraction: mandatory
  const img = cardBody.querySelector('img');

  // Title: look for h4-heading or similar
  const titleEl = cardBody.querySelector('.h4-heading, h4, .heading, .card-title, .title');

  // Description: find additional non-title text nodes or elements
  // For robustness, find all children except the image and heading
  const textEls = [];
  if (titleEl) textEls.push(titleEl);

  // Find all child nodes of cardBody that are not the image or the heading
  Array.from(cardBody.childNodes).forEach((node) => {
    if (node === img || node === titleEl) return;
    // Only include non-empty text nodes or elements
    if (node.nodeType === Node.ELEMENT_NODE) {
      // Exclude the image again if found
      if (node !== img && node !== titleEl && node.textContent.trim()) {
        textEls.push(node);
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.trim()) {
        textEls.push(document.createTextNode(node.textContent));
      }
    }
  });

  // If there is no text content, leave second cell empty
  const textCell = textEls.length > 0 ? textEls : [''];

  // Build row for this card: image in first column, text in second
  const cardRow = [img, textCell];

  // Final block table
  const cells = [headerRow, cardRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block table
  element.replaceWith(table);
}
