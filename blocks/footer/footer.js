/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */


import { decorateIcons, getMetadata, readBlockConfig } from '../../scripts/lib-franklin.js';

function createMenu(footer) {
  const mf = document.createElement('div');
  // mf.classList.add('natgeo-footer-compressed');
  const menuItems = footer.querySelectorAll('h3');
  menuItems.forEach((menu, idx, arr) => {
    mf.append(menu.cloneNode(true).firstChild);
    if (idx !== (arr.length - 1)) {
      mf.append(' | ');
    }
  });
  //loop through and find the last div and inject copyright footer
  const footerdivs = footer.querySelectorAll('div');
  footerdivs.forEach((fd, idx, arr) => {
   if (idx === (arr.length - 1)) {
     fd.insertAdjacentHTML('beforebegin', mf.outerHTML);
     fd.classList.add('copyright');
   }
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});
  if (resp.ok) {
    const html = await resp.text();
    const footer = document.createElement('div');
    footer.classList.add('natgeo-footer');
    footer.innerHTML = html;
    await decorateIcons(footer);
    createMenu(footer);
    block.append(footer);
    // TODO: append the copyrihgt image and text (div.copyright) or is it after the append of chidren in the document fragment
  }

  const [legalDiv, oursitesDiv, joinusDiv, followusDiv] = document.querySelectorAll('div.natgeo-footer>div');
  legalDiv.classList.add('legal');
  oursitesDiv.classList.add('oursites');
  joinusDiv.classList.add('joinus');
  followusDiv.classList.add('followus');
  const el = document.querySelector('div.legal');
  const parent = el.parentNode;
  const sibling = el.previousSibling;
  const frag = document.createDocumentFragment();
  document.querySelectorAll('div.legal,div.oursites,div.joinus,div.followus,div.copyright').forEach((child) => {
    frag.appendChild(child);
  });
  const wrapper = document.createElement('div');
  wrapper.className = 'footer-elements-wrapper';
  wrapper.appendChild(frag);
  parent.insertBefore(wrapper, sibling);
}

