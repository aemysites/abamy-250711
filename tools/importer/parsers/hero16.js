/* global WebImporter */
export default function parse(element, { document }) {
  // Header row - Must match example exactly
  const headerRow = ['Hero (hero16)'];

  // Find the background image (from the .sc-Banner-picture picture > img)
  let imgEl = null;
  const bannerPicture = element.querySelector('.sc-Banner-picture');
  if (bannerPicture) {
    const picture = bannerPicture.querySelector('picture');
    if (picture) {
      imgEl = picture.querySelector('img');
    }
  }
  // Second row: Background Image, or blank if none
  const imageRow = [imgEl ? imgEl : ''];

  // Third row: Title, subheading, CTA, etc
  // In the source, everything is in .sc-Banner-content. We include all non-empty children.
  let contentCell = [];
  const bannerContent = element.querySelector('.sc-Banner-content');
  if (bannerContent) {
    // Filter out empty <p> tags
    const children = Array.from(bannerContent.children).filter(el => {
      if (el.tagName === 'P' && el.textContent.trim() === '') return false;
      return true;
    });
    if (children.length > 0) {
      contentCell = children;
    }
  }
  const contentRow = [contentCell.length > 0 ? contentCell : ''];

  // Assemble rows in correct order: header, background image, then content.
  const rows = [headerRow, imageRow, contentRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}