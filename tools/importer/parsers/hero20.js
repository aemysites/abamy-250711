/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row exactly matches example
  const headerRow = ['Hero (hero20)'];

  // 2. Background images: find all imgs in the collage grid
  let imagesRow;
  const collageGrid = element.querySelector('.grid-layout.desktop-3-column');
  if (collageGrid) {
    const imgs = Array.from(collageGrid.querySelectorAll('img'));
    if (imgs.length > 0) {
      imagesRow = [imgs]; // single cell with all images array
    } else {
      imagesRow = ['']; // handle missing images
    }
  } else {
    imagesRow = ['']; // handle missing grid
  }

  // 3. Content: heading, subheading, CTAs (all should be referenced, not cloned)
  let contentRow;
  const contentContainer = element.querySelector('.ix-hero-scale-3x-to-1x-content .container');
  if (contentContainer) {
    // Heading (h1) reference
    const heading = contentContainer.querySelector('h1');
    // Subheading (p) reference
    const subheading = contentContainer.querySelector('p');
    // CTAs (all immediate a's in the button group)
    const ctaGroup = contentContainer.querySelector('.button-group');
    let ctas = [];
    if (ctaGroup) {
      ctas = Array.from(ctaGroup.querySelectorAll('a'));
    }
    // Compose cell contents: preserve order
    const cellContent = [];
    if (heading) cellContent.push(heading);
    if (subheading) cellContent.push(subheading);
    if (ctas.length > 0) cellContent.push(...ctas);
    contentRow = [cellContent];
  } else {
    contentRow = ['']; // Handle missing content gracefully
  }

  // 4. Compose table: 1 column, 3 rows
  const cells = [
    headerRow,   // row 1: block name
    imagesRow,   // row 2: images array (single cell)
    contentRow   // row 3: heading, subheading, CTA(s) (single cell)
  ];

  // 5. Create table and replace element (reference elements, preserve semantic meaning)
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
