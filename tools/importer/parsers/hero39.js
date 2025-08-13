/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header: must match example exactly
  const headerRow = ['Hero (hero39)'];

  // 2. Background image: get the main visible image element
  let imageCell = '';
  // Find the first immediate img (background) in the block structure
  let image = null;
  // Try common structure: immediate child divs
  const gridContainers = element.querySelectorAll(':scope > .w-layout-grid > div');
  if (gridContainers.length > 0) {
    image = gridContainers[0].querySelector('img');
  }
  // Fallback: find cover/background img anywhere in header
  if (!image) {
    image = element.querySelector('img.cover-image, img');
  }
  if (image) {
    imageCell = image;
  }

  // 3. Content cell: headline, paragraph, CTA
  let contentCell = '';
  let contentParts = [];
  // Try common structure: content in second grid column
  let contentDiv = null;
  if (gridContainers.length > 1) {
    contentDiv = gridContainers[1];
  } else {
    // Fallback: search for highest-level heading's parent div
    const fallbackHeading = element.querySelector('h1, h2, h3');
    if (fallbackHeading) {
      contentDiv = fallbackHeading.closest('div');
    }
  }
  // Extract heading(s)
  if (contentDiv) {
    const headings = contentDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(h => contentParts.push(h));
    // Extract paragraph(s)
    const paragraphs = contentDiv.querySelectorAll('p');
    paragraphs.forEach(p => contentParts.push(p));
    // Extract CTAs (buttons/links)
    const buttons = contentDiv.querySelectorAll('a.button, a.w-button, .button-group a');
    buttons.forEach(btn => contentParts.push(btn));

    // If nothing was found, use the contentDiv itself
    if (contentParts.length === 0) {
      contentParts = [contentDiv];
    }
    contentCell = contentParts;
  } else {
    // If nothing was found at all, use the entire element as fallback
    contentCell = element;
  }

  // 4. Build the table matching the example structure (1 col, 3 rows)
  const cells = [
    headerRow,
    [imageCell],
    [contentCell]
  ];

  // 5. Replace the original element with the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
