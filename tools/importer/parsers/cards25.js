/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards25)'];
  const rows = [];
  // Get all immediate child divs of the grid
  const cards = Array.from(element.querySelectorAll(':scope > div'));
  cards.forEach((cardDiv) => {
    const img = cardDiv.querySelector('img');
    // Find text content
    const textWrap = cardDiv.querySelector('.utility-padding-all-2rem');
    let textCell = '';
    if (textWrap) {
      const nodes = [];
      // Heading and paragraph if present, preserve their original elements
      const heading = textWrap.querySelector('h3, h2, h4, h1');
      if (heading) nodes.push(heading);
      const p = textWrap.querySelector('p');
      if (p) nodes.push(p);
      // If both, combine; otherwise, single
      textCell = nodes.length === 0 ? '' : (nodes.length === 1 ? nodes[0] : nodes);
    }
    // Only add rows where both image and text content present (true card)
    if (img && textCell) {
      rows.push([img, textCell]);
    }
  });
  const tableData = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(blockTable);
}
