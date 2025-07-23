/* global WebImporter */
export default function parse(element, { document }) {
  const allArticles = element.querySelector('#allArticles');
  if (!allArticles) return;

  // Select columns for each card
  const cardColumns = allArticles.querySelectorAll('.columns > .column');
  const headerRow = ['Cards (cards1)'];
  const rows = [headerRow];

  cardColumns.forEach(col => {
    const figure = col.querySelector('figure.sc-Card');
    if (!figure) return;

    // Image (mandatory)
    let imgEl = null;
    const img = figure.querySelector('.sc-Card-img img');
    if (img) imgEl = img;

    // Text content (mandatory)
    const textCell = [];
    // Author & date
    const author = figure.querySelector('.sc-Card-author');
    if (author) textCell.push(author);
    // Categories/tags (above title)
    const catList = figure.querySelector('.sc-Card-catList');
    if (catList) textCell.push(catList);
    // Title (as <p> with <a><strong>)
    const titleP = Array.from(figure.querySelectorAll('.sc-Card-text > p')).find(p => p.querySelector('a > strong'));
    if (titleP) textCell.push(titleP);
    // Description (first <p> after title)
    const textPs = Array.from(figure.querySelectorAll('.sc-Card-text > p'));
    if (textPs.length > 1) {
      // Ensure not to duplicate title
      textPs.forEach((p, idx) => {
        if (
          (idx === 0 && p !== titleP) ||
          (idx > 0)
        ) textCell.push(p);
      });
    } else if (textPs.length === 1 && textPs[0] !== titleP) {
      textCell.push(textPs[0]);
    }
    // Hash tags (ul.sc-Card-hashList)
    const hashList = figure.querySelector('.sc-Card-hashList');
    if (hashList) textCell.push(hashList);
    // CTA
    const cta = figure.querySelector('a.sc-Card-articleSeeMoreLink');
    if (cta) textCell.push(cta);

    // Only add the row if both cells have content, as per strict block pattern
    if (imgEl && textCell.length) {
      rows.push([
        imgEl,
        textCell
      ]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
