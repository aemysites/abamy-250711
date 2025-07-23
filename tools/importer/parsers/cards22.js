/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards22)'];
  const rows = [];
  // Select all <li> that contain an <a>
  const items = element.querySelectorAll('ul.sc-navigationMenu-list > li');
  items.forEach(li => {
    const a = li.querySelector('a');
    if (!a) return;
    // First cell: the icon element if present, else a blank span
    const icon = a.querySelector('em.icon') || document.createElement('span');
    // Second cell: gather ALL text content from the link (label and any additional text)
    const textCell = document.createElement('div');
    // Find the label
    const label = a.querySelector('.sc-navigationMenu-listItemLabel');
    if (label) {
      const strong = document.createElement('strong');
      strong.textContent = label.textContent;
      textCell.appendChild(strong);
    }
    // Now get the rest of the text nodes (outside of label and icon)
    // Remove label and icon from a for clean description extraction
    const aClone = a.cloneNode(true);
    const remIcon = aClone.querySelector('em.icon');
    if (remIcon) remIcon.remove();
    const remLabel = aClone.querySelector('.sc-navigationMenu-listItemLabel');
    if (remLabel) remLabel.remove();
    const description = aClone.textContent.trim();
    if (description) {
      const descDiv = document.createElement('div');
      descDiv.textContent = description;
      textCell.appendChild(descDiv);
    }
    // For cards block, CTA (the link) is usually already covered by label, so skip re-adding.
    rows.push([icon, textCell]);
  });
  if (rows.length) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      ...rows
    ], document);
    element.replaceWith(table);
  }
}
