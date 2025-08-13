/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as specified
  const headerRow = ['Cards (cards37)'];
  const cells = [headerRow];

  // Get main grid containing all cards
  // Find .grid-layout with card children
  let cardsGrid = element.querySelector('.grid-layout');
  if (cardsGrid && cardsGrid.querySelectorAll('.utility-link-content-block').length === 0) {
    // In case of nested grid-layouts, find deeper
    cardsGrid = cardsGrid.querySelector('.grid-layout');
  }

  const cardNodes = cardsGrid.querySelectorAll('.utility-link-content-block');
  cardNodes.forEach((card) => {
    // CARD IMAGE/ICON, always first cell
    let img;
    // Try aspect ratio container first, fallback to any img
    const aspectContainer = card.querySelector('.utility-aspect-2x3, .utility-aspect-1x1');
    if (aspectContainer && aspectContainer.querySelector('img')) {
      img = aspectContainer.querySelector('img');
    } else {
      img = card.querySelector('img');
    }

    // CARD TEXT: Heading, Description, CTA (all in second cell)
    const textCell = [];
    // Use heading (h3 or h4)
    const heading = card.querySelector('h3, h4');
    if (heading) textCell.push(heading);
    // Use description paragraph
    const para = card.querySelector('p');
    if (para) textCell.push(para);
    // Use call-to-action only if it is present
    const cta = card.querySelector('.button, .cta, a.button, button');
    if (cta) textCell.push(cta);

    // Push this card row
    cells.push([
      img,
      textCell
    ]);
  });

  // Create and replace block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
