/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as in the example
  const headerRow = ['Cards (cards13)'];
  const rows = [headerRow];

  // Find all columns that contain a card structure
  // Only those with .sc-QuizAccessImage are cards
  const cardColumns = Array.from(element.querySelectorAll(':scope > div'))
    .filter(col => col.querySelector('.sc-QuizAccessImage'));

  cardColumns.forEach(col => {
    const card = col.querySelector('.sc-QuizAccessImage');
    if (!card) return;

    // IMAGE cell (use <picture> if present, else <img>)
    let imageCell = null;
    const imageContainer = card.querySelector('.sc-QuizAccessImage-image');
    if (imageContainer) {
      let picture = imageContainer.querySelector('picture');
      let img = imageContainer.querySelector('img');
      if (picture) {
        imageCell = picture;
      } else if (img) {
        imageCell = img;
      }
    }

    // TEXT cell: Heading, description, CTA (in order, if present)
    const textCellElements = [];
    const contentContainer = card.querySelector('.sc-QuizAccessImage-content');
    if (contentContainer) {
      // Heading
      const heading = contentContainer.querySelector('h2');
      if (heading) textCellElements.push(heading);
      // Description (first p)
      const desc = contentContainer.querySelector('p');
      if (desc) textCellElements.push(desc);
      // CTA (first a)
      const cta = contentContainer.querySelector('a');
      if (cta) textCellElements.push(cta);
    }

    rows.push([
      imageCell,
      textCellElements
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
