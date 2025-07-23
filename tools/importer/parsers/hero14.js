/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main banner container
  const banner = element.querySelector('.sc-Banner');
  if (!banner) return;

  // Find the image (background/decorative)
  let imgEl = null;
  // The image is typically in the last div inside .sc-Banner
  const allDivs = banner.querySelectorAll(':scope > div');
  if (allDivs.length > 1) {
    imgEl = allDivs[allDivs.length - 1].querySelector('img');
  }

  // Find the content section
  const content = banner.querySelector('.sc-Banner-content');
  const contentParts = [];
  if (content) {
    // Title (as heading)
    const title = content.querySelector('.sc-Banner-title');
    if (title && title.textContent.trim()) {
      const heading = document.createElement('h1');
      heading.innerHTML = title.innerHTML;
      contentParts.push(heading);
    }
    // CTA button (may be absent)
    const cta = content.querySelector('a');
    if (cta) {
      contentParts.push(cta);
    }
  }

  // Prepare the table rows according to block spec
  const rows = [
    ['Hero (hero14)'],
    [imgEl ? imgEl : ''],
    [contentParts.length ? contentParts : '']
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
