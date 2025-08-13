/* global WebImporter */
export default function parse(element, { document }) {
  // Block header
  const headerRow = ['Hero (hero35)'];

  // Row 2: Background image (optional)
  // In the provided HTML, there is no background image, so leave blank
  const backgroundRow = [''];

  // Row 3: Content: Heading, Subheading, CTA
  // Find the main content container
  const container = element.querySelector('.container');
  // Grid might be missing, so fallback to container if not present
  let grid = container ? container.querySelector('.grid-layout') : container;
  // Find all direct children of grid
  const gridChildren = grid ? grid.querySelectorAll(':scope > *') : [];

  // Typically, first child is text block, second is CTA
  let textContentDiv = null;
  let ctaElement = null;
  if (gridChildren.length > 0) {
    textContentDiv = gridChildren[0];
    if (gridChildren.length > 1) {
      ctaElement = gridChildren[1];
    }
  }

  // Gather block content: Heading, Subheading, CTA
  const blockContent = [];

  if (textContentDiv) {
    // Heading and subheading
    const headings = textContentDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(h => blockContent.push(h));
    // Subheading/paragraph
    textContentDiv.querySelectorAll('p').forEach(p => blockContent.push(p));
  }
  if (ctaElement) {
    blockContent.push(ctaElement);
  }

  // Compose the table
  const cells = [
    headerRow,
    backgroundRow,
    [blockContent]
  ];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
