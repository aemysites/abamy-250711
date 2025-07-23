/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches the spec
  const headerRow = ['Cards (cards17)'];
  const rows = [headerRow];

  // Get all card columns
  const cardColumns = element.querySelectorAll(':scope > div');

  cardColumns.forEach((column) => {
    const productContainer = column.querySelector('.sc-ProductContainer');
    if (!productContainer) return;
    const card = productContainer.querySelector('figure.sc-Card');
    if (!card) return;

    // First cell: image (the <picture> element)
    let imageCell = null;
    const pic = card.querySelector('.sc-Card-img picture');
    if (pic) {
      imageCell = pic;
    }

    // Second cell: text content
    const textCell = document.createElement('div');
    // 1. Optional badge (e.g. "Nouveauté", "Coup de Cœur")
    const productHeader = card.querySelector('.sc-Card-productHeader');
    if (productHeader) {
      // If there's a badge span
      const badge = productHeader.querySelector('span.sc-Hash');
      if (badge) {
        textCell.appendChild(badge);
        textCell.appendChild(document.createElement('br'));
      }
      // If the productHeader has a visible text (not just an empty link)
      const phLink = productHeader.querySelector('p > a');
      if (phLink && phLink.textContent.trim()) {
        const phP = document.createElement('p');
        phP.textContent = phLink.textContent.trim();
        textCell.appendChild(phP);
      }
    }
    // 2. Title (strong text inside a link)
    const strongLink = card.querySelector('p > a.js-notCrawlableLinks strong');
    if (strongLink) {
      const titleStrong = document.createElement('strong');
      titleStrong.textContent = strongLink.textContent;
      textCell.appendChild(titleStrong);
    }
    // 3. Description (the product description link)
    const desc = card.querySelector('a.sc-Card-productDescription');
    if (desc) {
      const descP = document.createElement('p');
      descP.textContent = desc.textContent;
      textCell.appendChild(descP);
    }
    rows.push([
      imageCell,
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
