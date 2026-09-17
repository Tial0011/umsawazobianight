/* =========================================================
   Section 3 — Yoruba · Hausa · Igbo
   ---------------------------------------------------------
   A slide of real photos of people in their cultural outfits.
   No tribe is named on any individual photo — the three words
   above the slide are the Wazobia name itself (see Section 2),
   not a label on who is in which picture.

   Rendered from the data array below, exactly like the Afro
   Wall in scripts/afro-wall.js: growing it means adding objects
   to cultureSlideImages — never touching the layout or the CSS.
   See ADDING-PHOTOS.md in the project root for the full,
   no-code steps.
   ========================================================= */

/** @typedef {{
 *   name:string, widths:number[], width:number, height:number,
 *   alt:string, focus?:string, ratio?:string,
 * }} CultureSlideItem */

/** @type {CultureSlideItem[]} */
export const cultureSlideImages = [
  {
    name: 'culture-01',
    widths: [400, 800, 1200],
    width: 3024,
    height: 4032,
    alt: 'A smiling woman in a red beaded outfit and matching coral headpiece, holding a pale hair-fan and a white handkerchief.',
    ratio: '3/4',
  },
  {
    name: 'culture-02',
    widths: [400, 800, 1200],
    width: 2048,
    height: 2560,
    alt: 'A woman in a royal blue lace dress and matching wrapped headscarf, wearing a layered red and gold beaded necklace.',
    ratio: '4/5',
  },
  {
    name: 'culture-03',
    widths: [400, 800, 1200],
    width: 2048,
    height: 2560,
    alt: 'A smiling woman in a pink sequined outfit with a corset bodice and a matching wrapped headscarf, wearing an orange beaded necklace.',
    ratio: '4/5',
  },
  {
    name: 'culture-04',
    widths: [400, 800, 1200],
    width: 2047,
    height: 2560,
    alt: 'A man in a white top and red wrap skirt, with a matching red cap, sunglasses and a coral beaded necklace.',
    ratio: '4/5',
  },
  {
    name: 'culture-05',
    widths: [400, 800, 1200],
    width: 3648,
    height: 5472,
    alt: 'A young man in a patterned cap and a cream embroidered top, wearing a gold cross necklace, under strings of hanging lights.',
    ratio: '2/3',
  },
  {
    name: 'culture-06',
    widths: [400, 736],
    width: 736,
    height: 1104,
    alt: 'A close-up of a woman in a large orange head wrap and layered gold jewellery, laughing while holding a drink to her mouth.',
    ratio: '2/3',
  },
  {
    name: 'culture-07',
    widths: [400, 736],
    width: 736,
    height: 608,
    alt: 'Three women in gold head wraps and colourful outfits — navy, blush and orange — posing together against a plain background.',
    ratio: '6/5',
  },
  {
    name: 'culture-08',
    widths: [400, 800, 1200],
    width: 1920,
    height: 2560,
    alt: 'A woman in a black sequined top and a mustard wrap skirt with a matching head wrap, wearing sunglasses and a red beaded necklace.',
    ratio: '3/4',
  },
  {
    name: 'culture-09',
    widths: [400, 735],
    width: 735,
    height: 1084,
    alt: 'Three women outdoors in oversized colourful head wraps and patterned outfits, each holding money in hand.',
    ratio: '2/3',
  },
  {
    name: 'culture-10',
    widths: [400, 736],
    width: 736,
    height: 981,
    alt: 'A man in a cream embroidered top and a dark green sequined wrap skirt, wearing coral beads and holding a walking cane.',
    ratio: '3/4',
  },
  {
    name: 'culture-11',
    widths: [400, 736],
    width: 736,
    height: 1308,
    alt: 'A smiling woman in a floral veil and matching outfit, wearing a gold beaded necklace and holding a carved wooden bowl.',
    ratio: '9/16',
  },
  {
    name: 'culture-12',
    widths: [400, 736],
    width: 736,
    height: 920,
    alt: 'A woman in a tall, structured green head wrap and a striped outfit, wearing layered pearl and gold necklaces.',
    ratio: '4/5',
  },
  {
    name: 'culture-13',
    widths: [400, 600],
    width: 600,
    height: 900,
    alt: 'Two men on horseback in elaborate turbans, one holding a sword, in front of a tall red tower.',
    ratio: '2/3',
  },
];

const DIR = 'assets/images/culture-slide';
const SIZES = '(min-width: 900px) 32vw, 78vw';

const srcset = (item, ext) =>
  item.widths.map((w) => `${DIR}/${item.name}-${w}.${ext} ${w}w`).join(', ');

const fallbackSrc = (item, ext = 'jpg') =>
  `${DIR}/${item.name}-${item.widths[item.widths.length - 1]}.${ext}`;

function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function styleAttr(item) {
  const vars = [];
  if (item.ratio) vars.push(`--ar:${item.ratio}`);
  if (item.focus) vars.push(`--focus:${escapeAttr(item.focus)}`);
  return vars.length ? ` style="${vars.join(';')}"` : '';
}

function slideMarkup(item, index) {
  return `
    <li class="culture-card" data-card${styleAttr(item)}>
      <div class="culture-card__media">
        <picture>
          <source type="image/webp" srcset="${srcset(item, 'webp')}" sizes="${SIZES}">
          <img src="${fallbackSrc(item)}" srcset="${srcset(item, 'jpg')}" sizes="${SIZES}"
               width="${item.width}" height="${item.height}"
               loading="${index < 3 ? 'eager' : 'lazy'}" decoding="async"
               alt="${escapeAttr(item.alt)}">
        </picture>
      </div>
    </li>`;
}

export function initCultureSlide() {
  const grid = document.querySelector('[data-culture-grid]');
  const empty = document.querySelector('[data-culture-empty]');
  if (!grid) return;

  if (!cultureSlideImages.length) {
    grid.setAttribute('hidden', '');
    empty?.removeAttribute('hidden');
    return;
  }

  grid.innerHTML = cultureSlideImages.map((img, i) => slideMarkup(img, i)).join('');
  grid.removeAttribute('hidden');
  empty?.setAttribute('hidden', '');
}
