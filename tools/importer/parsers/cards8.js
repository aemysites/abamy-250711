/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards8)'];
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));
  const rows = cardDivs.map(cardDiv => {
    // Find the image
    const img = cardDiv.querySelector('img');
    // Attempt to find any text content paired with the image (direct siblings or descendants)
    // In provided HTML, there is no text, so fallback is empty string
    let textContent = '';
    // If real world HTML includes text, try to get it
    // Get all non-img children
    const nonImgNodes = Array.from(cardDiv.childNodes).filter(n => n.nodeType === 1 && n !== img);
    if (nonImgNodes.length > 0) {
      // Combine all text from non-img nodes
      textContent = nonImgNodes.map(el => el.textContent.trim()).filter(t => t).join(' ');
      // If we want to preserve formatting, could put whole node(s) in cell
      if (textContent) {
        textContent = document.createTextNode(textContent);
      }
    }
    // If no text found, set to empty string
    if (!textContent) textContent = '';
    return [img, textContent];
  });
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
