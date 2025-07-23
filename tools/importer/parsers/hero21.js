/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match exactly
  const headerRow = ['Hero (hero21)'];

  // Second row: Background image (none present in source), so empty string
  const bgRow = [''];

  // Third row: All text content from the block
  // To ensure we never miss text, we will take all children of .sc-RichText (if present),
  // otherwise fallback to the element itself.
  let textBlocks = [];
  const richText = element.querySelector('.sc-RichText');
  if (richText) {
    // If there are any children (e.g., .mobile-hide, .mobile-show)
    if (richText.children.length > 0) {
      textBlocks = Array.from(richText.children);
    } else {
      // If no children but inner text exists
      textBlocks = [richText];
    }
  } else {
    textBlocks = [element];
  }
  // Ensure we are not passing empty array
  if (textBlocks.length === 0) {
    textBlocks = [''];
  }

  const textRow = [textBlocks];

  const cells = [
    headerRow,
    bgRow,
    textRow
  ];

  // Create and insert the new table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
