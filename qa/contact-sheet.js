'use strict';
(() => {
  const body = Number(new URLSearchParams(location.search).get('sheet'));
  if (!Number.isInteger(body) || body < 0 || body > 5) return;
  let cells = '', index = 0;
  for (let face = 0; face < 6; face++) for (let limbs = 0; limbs < 4; limbs++) for (let deco = 0; deco < 6; deco++) {
    const x = (index % 12) * 128, y = Math.floor(index / 12) * 150;
    cells += '<g transform="translate(' + x + ',' + y + ')"><rect width="126" height="148" rx="8" fill="#f5f4fb"/><svg x="0" y="0" width="128" height="128" viewBox="0 0 512 512">' + OddlingsQA.creatureArt({ body, face, limbs, deco, color: '#ad8bfa', name: '' }) + '</svg><text x="64" y="142" text-anchor="middle" font-family="Arial" font-size="11" fill="#292638">F' + face + ' · L' + limbs + ' · D' + deco + '</text></g>';
    index++;
  }
  document.body.className = 'qa-grid-page';
  const heading = document.createElement('h1'); heading.textContent = 'Body ' + body + ' / 144 combinations / Face · Limbs · Extra';
  document.body.replaceChildren(heading);
  document.body.insertAdjacentHTML('beforeend', '<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1800" viewBox="0 0 1536 1800" role="img" aria-label="All 144 combinations for body ' + body + '">' + cells + '</svg>');
})();
