/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion header row, keep exactly as specified
  const headerRow = ['Accordion (accordion34)'];

  // Find all immediate children that are accordion blocks
  const accordionEls = Array.from(element.querySelectorAll(':scope > .accordion'));
  const rows = [];

  accordionEls.forEach(acc => {
    // Title cell: Find the .w-dropdown-toggle and get the title element
    let titleCell = null;
    const toggle = acc.querySelector('.w-dropdown-toggle');
    if (toggle) {
      // The visible title is inside a div with class 'paragraph-lg', fallback to toggle if not found
      titleCell = toggle.querySelector('.paragraph-lg') || toggle;
    }
    // Content cell: Find the nav (accordion-content), get the innermost content
    let contentCell = null;
    const nav = acc.querySelector('nav.accordion-content');
    if (nav) {
      // Usually: nav > div > div.rich-text
      const padDiv = nav.querySelector('.utility-padding-all-1rem');
      if (padDiv) {
        const rich = padDiv.querySelector('.rich-text');
        if (rich) {
          contentCell = rich;
        } else {
          // fallback to padded div itself
          contentCell = padDiv;
        }
      } else {
        // fallback to nav
        contentCell = nav;
      }
    }
    // If either is missing, still create a row to preserve order/structure
    rows.push([titleCell, contentCell]);
  });

  // Compose the table structure
  const tableCells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
