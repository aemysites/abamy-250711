/* global WebImporter */
export default function parse(element, { document }) {
  // The header row should be exactly one cell
  const headerRow = ['Columns (columns5)'];

  // The second row should contain the main visible content from each column
  // In this HTML, each column div has one img as its main content
  // If future HTML includes more content (text, buttons, etc), this logic should include all children
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  const contentRow = columns.map((col) => {
    // For robustness: use all children of each column as cell content (not just img)
    // But for this HTML, each div only has an img
    if (col.children.length === 1) {
      return col.children[0]; // Reference the img directly
    } else {
      // If there are multiple children, return them all
      return Array.from(col.children);
    }
  });

  const tableArray = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(tableArray, document);
  element.replaceWith(block);
}