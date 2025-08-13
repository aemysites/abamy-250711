/* global WebImporter */
export default function parse(element, { document }) {
  // Header row per spec
  const headerRow = ['Hero (hero11)'];

  // Find the main grid in the section
  const mainGrid = element.querySelector(':scope > div');
  if (!mainGrid) {
    // Defensive: If structure changes drastically
    return;
  }
  // Find all direct children of the main grid (should be two: content grid and image)
  const gridChildren = mainGrid.children;

  // Prepare variables for content and image
  let imageEl = null;
  let contentEl = null;
  // Loop to find the image and the content block
  for (let i = 0; i < gridChildren.length; i++) {
    const child = gridChildren[i];
    if (child.tagName.toLowerCase() === 'img' && !imageEl) {
      imageEl = child;
    } else if (child.classList.contains('w-layout-grid') && !contentEl) {
      // The content is inside a nested grid
      // Look for the .section inside this grid
      const section = child.querySelector('.section');
      if (section) {
        contentEl = section;
      }
    }
  }
  // Fallback: if image/content wasn't found, attempt again directly
  if (!imageEl) {
    imageEl = mainGrid.querySelector('img');
  }
  if (!contentEl) {
    contentEl = mainGrid.querySelector('.section');
  }

  // Second row: image (background)
  const secondRow = [imageEl ? imageEl : ''];

  // Third row: headline, paragraph, CTAs
  let contentParts = [];
  if (contentEl) {
    // Heading (any h1-h3)
    const heading = contentEl.querySelector('h1, h2, h3');
    if (heading) contentParts.push(heading);
    // Paragraph block (rich text)
    const paragraph = contentEl.querySelector('.rich-text, .w-richtext, .paragraph-lg');
    if (paragraph) contentParts.push(paragraph);
    // Button group (CTAs)
    const buttonGroup = contentEl.querySelector('.button-group');
    if (buttonGroup) contentParts.push(buttonGroup);
  }
  const thirdRow = [contentParts.length > 0 ? contentParts : ''];

  // Build the block table
  const cells = [
    headerRow,
    secondRow,
    thirdRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
