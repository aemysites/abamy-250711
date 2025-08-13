/* global WebImporter */
export default function parse(element, { document }) {
  // The grid containing the slides is inside the section
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Each direct child of the grid is a slide
  const slideDivs = Array.from(grid.children);

  // Build the rows for the Carousel block
  const rows = [];
  // Header row: block name exactly as in example
  rows.push(['Carousel']);

  // For each slide, put the image in col 1, any text in col 2 (if available)
  slideDivs.forEach(slideDiv => {
    const img = slideDiv.querySelector('img');
    let contentCell = '';
    // Look for any text content outside the image in this slideDiv
    // We'll collect all non-img nodes in the slideDiv (excluding whitespace)
    const contentNodes = [];
    slideDiv.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() !== 'img') {
        // Exclude the image, but check for any text/other elements
        // If the node contains only another wrapper with the img, skip it
        if (!node.querySelector('img')) contentNodes.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        contentNodes.push(document.createTextNode(node.textContent));
      }
    });
    // If we didn't find direct content on slideDiv, attempt to look deeper
    if (contentNodes.length === 0) {
      // Typical: text or content is inside wrappers (not direct children)
      // Grab all elements that are not or do not contain an image
      const descendants = slideDiv.querySelectorAll('*');
      descendants.forEach(d => {
        if (d.tagName.toLowerCase() !== 'img' && !d.querySelector('img')) {
          // Only add if it contains non-empty text
          if (d.textContent && d.textContent.trim()) {
            contentNodes.push(d);
          }
        }
      });
    }
    if (contentNodes.length > 0) {
      contentCell = contentNodes;
    } else {
      contentCell = '';
    }
    if (img) {
      rows.push([img, contentCell]);
    }
  });

  // Create the carousel table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}