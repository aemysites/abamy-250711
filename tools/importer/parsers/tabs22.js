/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Get the tab menu container by role="tablist"
  const tabMenu = element.querySelector('[role="tablist"]');
  // Get all tab links (assume tabs are direct children of menu)
  const tabLinks = tabMenu ? Array.from(tabMenu.children) : [];
  // Extract tab labels from <div> inside each tab link, fallback to textContent
  const tabLabels = tabLinks.map((tab) => {
    const div = tab.querySelector('div');
    return div ? div.textContent.trim() : tab.textContent.trim();
  });

  // 2. Get tab contents: find all tab panes via role="tabpanel" in tab content container
  const tabContentContainer = element.querySelector('.w-tab-content') || element;
  const tabPanes = Array.from(tabContentContainer.querySelectorAll('[role="tabpanel"]'));

  // 3. Compose the table rows: header, then [label, content] for each tab
  const tableRows = [['Tabs']]; // Table header must exactly match the block name
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const pane = tabPanes[i];
    // Defensive: if pane is missing, skip this tab
    if (!label || !pane) continue;
    // For tab content, reference the grid layout if it exists, else the pane itself
    const grid = pane.querySelector('.w-layout-grid') || pane;
    tableRows.push([label, grid]);
  }

  // 4. Create and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
