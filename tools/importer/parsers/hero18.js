/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image from style attribute
  function extractBgUrl(style) {
    if (!style) return null;
    const match = style.match(/url\((?:'|")?(.*?)(?:'|")?\)/);
    return match ? match[1] : null;
  }

  // Find the first .columns with a background image
  let bgImgEl = null;
  const columns = element.querySelectorAll('.columns');
  let columnsWithBg = null;
  for (const col of columns) {
    const bgUrl = extractBgUrl(col.getAttribute('style'));
    if (bgUrl) {
      columnsWithBg = col;
      bgImgEl = document.createElement('img');
      bgImgEl.src = bgUrl;
      bgImgEl.alt = '';
      break;
    }
  }

  // Fallback: If not found, leave bgImgEl null

  // Extract the content block (title, subheading, CTA)
  // Reference the inner content block directly for maximum robustness
  let contentCell = '';
  if (columnsWithBg) {
    // Usually the .column element is the major container of text/button
    const column = columnsWithBg.querySelector('.column');
    if (column) {
      // Find the innermost content div, or just use the column
      let contentDiv = column;
      // Drill down to the deepest single-child div (but not too far)
      while (contentDiv.children.length === 1 && contentDiv.children[0].tagName.toLowerCase() === 'div') {
        contentDiv = contentDiv.children[0];
      }
      // Reference all children (paragraphs, links, etc) in this div
      // This ensures we include all text content and CTA(s)
      const children = Array.from(contentDiv.childNodes).filter(node => {
        if (node.nodeType === 3) return node.textContent.trim().length > 0; // text
        if (node.nodeType === 1) return true; // elements
        return false;
      });
      // Place all elements and text in an array (preserves order)
      contentCell = children.length > 0 ? children : contentDiv;
    }
  }

  // Compose the block table as per requirements
  const cells = [
    ['Hero (hero18)'],
    [bgImgEl ? bgImgEl : ''],
    [contentCell ? contentCell : ''],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
