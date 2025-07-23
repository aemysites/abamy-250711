/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel container
  const carouselRoot = element.querySelector('.sc-Carrousel, .js-Carrousel');
  if (!carouselRoot) return;

  // Get all unique slides by data-swiper-slide-index to avoid duplicates
  const seenIndexes = new Set();
  const slides = [];
  carouselRoot.querySelectorAll('.sc-Carrousel-slide').forEach((slide) => {
    const idx = slide.getAttribute('data-swiper-slide-index');
    if (!seenIndexes.has(idx)) {
      seenIndexes.add(idx);
      slides.push(slide);
    }
  });

  // Prepare the slide rows: each is [image, text]
  const rows = slides.map((slide) => {
    let imageCell = null;
    let textCell = [];
    const anchor = slide.querySelector('a');
    if (anchor) {
      imageCell = anchor.querySelector('img');
      // Get label (heading)
      const labelDiv = anchor.querySelector('div[style*="background-color: white"]');
      if (labelDiv) {
        const labelText = labelDiv.textContent.trim();
        if (labelText) {
          const heading = document.createElement('h3');
          if (anchor.href) {
            const link = document.createElement('a');
            link.href = anchor.href;
            link.textContent = labelText;
            heading.appendChild(link);
          } else {
            heading.textContent = labelText;
          }
          textCell.push(heading);
        }
      }
      // Remove image and labelDiv from anchor clone to check for extra text
      const anchorClone = anchor.cloneNode(true);
      anchorClone.querySelectorAll('img').forEach(img => img.remove());
      if (labelDiv) {
        anchorClone.querySelectorAll('div[style*="background-color: white"]').forEach(d => d.remove());
      }
      anchorClone.querySelectorAll('svg').forEach(svg => svg.remove());
      const extraText = anchorClone.textContent.replace(/\s+/g, ' ').trim();
      if (extraText && (!labelDiv || extraText !== labelDiv.textContent.trim())) {
        const p = document.createElement('p');
        p.textContent = extraText;
        textCell.push(p);
      }
      if (textCell.length === 0) {
        textCell = '';
      }
    }
    if (imageCell) {
      return [imageCell, textCell];
    }
    return null;
  }).filter(Boolean);

  // Manually create table with correct header structure (colspan=2)
  const table = document.createElement('table');
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.textContent = 'Carousel';
  headerTh.setAttribute('colspan', '2'); // Ensure colspan is set correctly so header is one cell spanning both columns
  headerTr.appendChild(headerTh);
  table.appendChild(headerTr);

  rows.forEach(([img, text]) => {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    if (img) td1.appendChild(img);
    tr.appendChild(td1);
    const td2 = document.createElement('td');
    if (Array.isArray(text)) {
      text.forEach(t => {
        if (t) td2.appendChild(t);
      });
    } else if (text) {
      td2.appendChild(text);
    }
    tr.appendChild(td2);
    table.appendChild(tr);
  });

  element.replaceWith(table);
}
