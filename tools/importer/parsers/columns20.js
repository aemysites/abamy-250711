/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main rich text container
  const richText = element.querySelector('.sc-RichText');
  if (!richText) return;

  // Get heading (prefer desktop)
  let headingDiv = richText.querySelector('.mobile-hide > div');
  if (!headingDiv) headingDiv = richText.querySelector('.mobile-show > div');
  if (!headingDiv) headingDiv = richText.querySelector('strong');

  // Find columns row (actual columns)
  let columnsRow = null;
  const outerColumns = richText.querySelector('.columns.columns--center.mobile-hide');
  if (outerColumns) {
    columnsRow = outerColumns.querySelector('.columns.columns--center');
  } else {
    columnsRow = richText.querySelector('.columns.columns--center');
  }
  if (!columnsRow) return;

  // Get all direct column divs
  const columnDivs = Array.from(columnsRow.querySelectorAll(':scope > .column'));

  // Each column: image + text
  const columnCells = columnDivs.map(col => {
    const content = [];
    const img = col.querySelector('img');
    if (img) content.push(img);
    const textDiv = Array.from(col.querySelectorAll('div'))
      .find(d => d.textContent && d.textContent.replace(/\s/g, '').length > 0);
    if (textDiv) content.push(textDiv);
    return content;
  });

  // Build cells: header, then a row with [heading], then a row with columns
  const cells = [];
  cells.push(['Columns (columns20)']);
  if (headingDiv) {
    cells.push([headingDiv]); // single cell (spanned heading row)
  }
  if (columnCells.length) {
    cells.push(columnCells); // one cell per column (next row)
  }

  // Create table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
