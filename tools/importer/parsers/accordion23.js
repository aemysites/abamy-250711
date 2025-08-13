/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must exactly match the example
  const headerRow = ['Accordion (accordion23)'];

  // Each accordion item is a direct child .divider of the root element
  const accordionDividers = Array.from(element.querySelectorAll(':scope > .divider'));
  const rows = [];

  accordionDividers.forEach(divider => {
    // Each divider should contain a .w-layout-grid (the two-column grid)
    const grid = divider.querySelector('.w-layout-grid');
    if (!grid) return; // Skip if no grid found

    // The immediate children of the grid: [title, content]
    const children = Array.from(grid.querySelectorAll(':scope > div'));
    if (children.length < 2) return; // Skip if not enough children

    // Reference existing elements directly
    const title = children[0];
    const content = children[1];
    rows.push([title, content]);
  });

  // Compose the complete table data (header + rows)
  const tableData = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  // Replace the original element with the new block
  element.replaceWith(block);
}