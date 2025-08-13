/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid that contains the columns
  let grid = element.querySelector('.grid-layout');
  if (!grid) {
    const container = element.querySelector('.container');
    if (container) {
      grid = container.querySelector('.grid-layout');
    }
  }

  let leftContent, rightContent;
  if (grid) {
    const children = Array.from(grid.children);
    leftContent = children.find(child => child.querySelector('h1, h2, h3, h4, h5, h6, p, a, .button, .button-group'));
    rightContent = children.find(child => child.querySelector('img'));
    if (!rightContent) {
      rightContent = children.find(child => child.tagName === 'IMG');
    }
    if (!leftContent && children.length > 0) leftContent = children[0];
    if (!rightContent && children.length > 1) rightContent = children[1];
  } else {
    const possibleDivs = Array.from(element.querySelectorAll(':scope > div'));
    leftContent = possibleDivs.find(child => child.querySelector('h1, h2, h3, h4, h5, h6, p, a, .button, .button-group'));
    rightContent = possibleDivs.find(child => child.querySelector('img'));
    if (!leftContent && possibleDivs.length > 0) leftContent = possibleDivs[0];
    if (!rightContent && possibleDivs.length > 1) rightContent = possibleDivs[1];
  }

  if (!leftContent && !rightContent) {
    leftContent = element;
    rightContent = '';
  }

  // Header row must be exactly one cell: ['Columns (columns15)']
  const headerRow = ['Columns (columns15)'];
  const contentRow = [leftContent, rightContent];

  // Custom table creation to ensure header row is one cell that spans all columns
  const table = document.createElement('table');
  const headerTr = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = headerRow[0];
  th.setAttribute('colspan', contentRow.length);
  headerTr.appendChild(th);
  table.appendChild(headerTr);

  const tr = document.createElement('tr');
  contentRow.forEach(cell => {
    const td = document.createElement('td');
    if (typeof cell === 'string') {
      td.innerHTML = cell;
    } else if (Array.isArray(cell)) {
      td.append(...cell);
    } else if (cell) {
      td.append(cell);
    }
    tr.appendChild(td);
  });
  table.appendChild(tr);

  element.replaceWith(table);
}
