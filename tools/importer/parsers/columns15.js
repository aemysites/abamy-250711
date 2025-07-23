/* global WebImporter */
export default function parse(element, { document }) {
  // Get .sc-notToMiss-container
  const container = element.querySelector('.sc-notToMiss-container');
  if (!container) return;

  // Get carousel elements
  const carrousel = container.querySelector('.sc-miniCarrousel');
  if (!carrousel) return;
  const carrouselWrapper = carrousel.querySelector('.swiper-wrapper');
  if (!carrouselWrapper) return;
  const items = Array.from(carrouselWrapper.querySelectorAll(':scope > .sc-miniCarrousel-element'));

  // Prepare columns
  const leftCol = items[0] || '';
  const rightCol = document.createElement('div');
  // Heading (preserve tag)
  const heading = container.querySelector('h2,h3,h4,h5,h6');
  if (heading) rightCol.appendChild(heading);
  items.slice(1).forEach(item => rightCol.appendChild(item));

  // The header row must be a SINGLE CELL array (one column), even if second row has more columns
  const cells = [
    ['Columns (columns15)'],
    [leftCol, rightCol],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}