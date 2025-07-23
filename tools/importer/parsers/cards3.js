/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in example
  const headerRow = ['Cards (cards3)'];

  // Find the card container (swiper-wrapper)
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Each card is a .swiper-slide
  const slides = Array.from(swiperWrapper.children).filter(child => child.classList.contains('swiper-slide'));
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Each card root is <figure class="sc-Card">
    const figure = slide.querySelector('figure.sc-Card');
    if (!figure) return;

    // --- IMAGE: get the <img> inside .sc-Card-img (always present)
    let imageEl = null;
    const imgWrap = figure.querySelector('.sc-Card-img');
    if (imgWrap) {
      const img = imgWrap.querySelector('img');
      if (img) {
        imageEl = img;
      }
    }

    // --- TEXT CONTENT (second cell)
    // Frag is not necessary, use an array to reference existing elements
    const cellContent = [];
    const cardText = figure.querySelector('.sc-Card-text');
    if (cardText) {
      // 1. Add tag/category if present
      const tagList = cardText.querySelector('.sc-Card-catList');
      if (tagList) cellContent.push(tagList);

      // 2. Title: <p><a><strong>... (as <strong> or <b> in example)
      const titleA = cardText.querySelector('p a strong, p a b');
      if (titleA) {
        // Use original <strong> or <b> element
        cellContent.push(titleA);
      }

      // 3. Description: the next <p> after title
      // Find all <p> children of .sc-Card-text
      const allPs = Array.from(cardText.querySelectorAll('p'));
      if (allPs.length > 1) {
        // The second <p> is the description
        cellContent.push(allPs[1]);
      }
    }

    // 4. CTA: last <a> in figcaption ("Voir l'article")
    const figcaption = figure.querySelector('figcaption');
    let cta = null;
    if (figcaption) {
      // "Voir l'article" sometimes in .sc-Card-text, usually direct child of figcaption
      const links = Array.from(figcaption.querySelectorAll('a[href]'));
      // Use the last <a> (CTA)
      if (links.length) {
        cta = links[links.length - 1];
        // Only add if not already present in the text content array
        if (!cellContent.includes(cta)) cellContent.push(cta);
      }
    }

    rows.push([imageEl, cellContent]);
  });
  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
