/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row - must match example exactly
  const headerRow = ['Columns (columns2)'];

  // Defensive: find the primary .container
  const container = element.querySelector('.container');
  if (!container) return;

  // Find the grid layout (left column block)
  const gridLayout = container.querySelector('.grid-layout');
  if (!gridLayout) return;

  // Find the right column block
  const rightColumn = container.querySelector(
    '.flex-horizontal.flex-vertical.flex-gap-sm.w-node-f71f504d-ed02-fbe1-5974-4ebc66911f34-86a1a9b3'
  );
  if (!rightColumn) return;

  // Get gridLayout children:
  const gridChildren = Array.from(gridLayout.children);

  // Left: main feature block (first grid child)
  const mainBlock = gridChildren[0];
  if (!mainBlock) return;

  // Left: vertical blocks (second grid child)
  const verticalBlocksContainer = gridChildren[1];
  const verticalBlocks = verticalBlocksContainer
    ? Array.from(verticalBlocksContainer.querySelectorAll(':scope > a'))
    : [];

  // Compose left cell: main block and two vertical blocks
  // Reference elements directly
  const leftColumnCell = [mainBlock, ...verticalBlocks];

  // Compose right cell: all <a> direct children of right column
  const rightBlocks = Array.from(rightColumn.querySelectorAll(':scope > a'));
  const rightColumnCell = rightBlocks;

  // Table must have two columns, one row for content
  const bodyRow = [leftColumnCell, rightColumnCell];

  // Assemble final table structure
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bodyRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
