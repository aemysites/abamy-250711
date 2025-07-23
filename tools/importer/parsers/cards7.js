/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the social block wrapper inside element
  const socialBlock = element.querySelector('.sc-Footer-social');
  if (!socialBlock) return;

  // Extract the title text (e.g. 'Nous suivre')
  const title = socialBlock.querySelector('.sc-Footer-socialTitle');

  // Extract the social link list (ul.sc-Footer-socialList)
  const list = socialBlock.querySelector('.sc-Footer-socialList');
  if (!list) return;

  // Get all <a> links from the list
  const anchors = Array.from(list.querySelectorAll('a'));

  // Compose a single cell for the card: title (bold, as in example) + links (as elements, spaced)
  const cardContent = document.createElement('div');
  if (title) {
    const strong = document.createElement('strong');
    strong.textContent = title.textContent.trim();
    cardContent.appendChild(strong);
    cardContent.appendChild(document.createElement('br'));
  }
  // Add all anchors, spaced
  anchors.forEach((a, i) => {
    cardContent.appendChild(a);
    if (i < anchors.length - 1) {
      cardContent.appendChild(document.createTextNode(' '));
    }
  });

  // Build table structure: header then single card row
  const tableRows = [
    ['Cards (cards7)'],
    [cardContent]
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
