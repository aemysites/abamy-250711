/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example
  const headerRow = ['Cards (cards33)'];
  const rows = [headerRow];

  // Get all direct card anchors (each card)
  const cardLinks = element.querySelectorAll(':scope > a');

  cardLinks.forEach((cardLink) => {
    // Get the image for the card (first img descendant)
    const img = cardLink.querySelector('img');
    // Find the content container (contains heading, text, etc)
    // The structure is: <a> -> <div> -> <div> (content)
    // So we want the div after the img
    let contentDiv = null;
    const gridDivs = Array.from(cardLink.querySelectorAll(':scope > div'));
    if (gridDivs.length === 1) {
      // If there is only one div, use it
      contentDiv = gridDivs[0];
    } else {
      // Find the div that contains a heading (h3) or paragraph (p)
      for (const d of gridDivs) {
        if (d.querySelector('h3, p')) {
          contentDiv = d;
          break;
        }
      }
    }
    // Fallback: If we don't find it, try to get the next sibling after img
    if (!contentDiv && img && img.nextElementSibling && img.nextElementSibling.tagName === 'DIV') {
      contentDiv = img.nextElementSibling;
    }

    // Defensive: Only add if both image and content are found
    if (img && contentDiv) {
      rows.push([img, contentDiv]);
    }
  });

  // Create and replace with the cards block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
