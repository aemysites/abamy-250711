/* global WebImporter */
export default function parse(element, { document }) {
  // The block name header, as in the example
  const headerRow = ['Cards (cards28)'];
  // We'll collect all cards from all tab panes
  const rows = [];
  // Find all tab panes inside the element
  const tabPanes = element.querySelectorAll('.w-tab-pane');
  tabPanes.forEach(tabPane => {
    // Find the grid containing the cards
    const grid = tabPane.querySelector('.w-layout-grid');
    if (!grid) return;
    // Each card is an <a> direct child of the grid
    const cardLinks = grid.querySelectorAll(':scope > a');
    cardLinks.forEach(card => {
      // 1st cell: image (mandatory if present)
      let imgEl = card.querySelector('img');
      // 2nd cell: text content
      // Find heading
      let heading = card.querySelector('h3, h4, h5, h6');
      // Find paragraph
      let para = card.querySelector('div.paragraph-sm, p');
      // Some cards have nested div structure for text
      if ((!heading || !para)) {
        // Check for nested text container
        let textContainer = card.querySelector('.utility-text-align-center');
        if (textContainer) {
          heading = textContainer.querySelector('h3, h4, h5, h6');
          para = textContainer.querySelector('div.paragraph-sm, p');
        }
      }
      // Compose cell values, referencing real elements
      const imageCell = imgEl ? imgEl : '';
      const textCell = [heading, para].filter(Boolean);
      rows.push([imageCell, textCell.length ? textCell : '']);
    });
  });
  // Compose the full table structure
  const cells = [headerRow, ...rows];
  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
