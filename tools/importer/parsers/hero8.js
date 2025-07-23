/* global WebImporter */
export default function parse(element, { document }) {
  // Hero block: expects 1-column, 3-row table: header, background image (picture), content (heading, subheading, cta, etc.)

  // 1. Find the 'picture' element (the element itself)
  // 2. Collect all relevant text content elements immediately after the picture (headings, paragraphs, links, etc.)
  //    - This makes the function more robust and ensures no content is missed.

  const contentElems = [];
  let sibling = element.nextElementSibling;
  while (sibling) {
    const tag = sibling.tagName && sibling.tagName.toLowerCase();
    // Accept typical hero text content tags
    if (["h1","h2","h3","h4","h5","h6","p","a","button","div"].includes(tag)) {
      contentElems.push(sibling);
      sibling = sibling.nextElementSibling;
    } else {
      break;
    }
  }

  // If no text content found, leave the cell empty
  const textContentCell = contentElems.length > 0 ? contentElems : '';

  // Compose table: header, image, content
  const cells = [
    ['Hero (hero8)'],
    [element],
    [textContentCell],
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}