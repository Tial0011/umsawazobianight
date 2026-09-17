/* =========================================================
   Section 7 — The Afro Wall
   ---------------------------------------------------------
   A community photo wall: people send in their Afro looks and
   they go up here. The wall is rendered from the data array
   below, so growing it means adding objects — never touching
   the layout, the CSS or the lightbox.

   TO ADD A PHOTO
   1. Drop the optimised files in assets/images/afro-wall/.
      Naming convention (see tools/optimise-afro-photos.py):
        <name>-400.webp / .jpg
        <name>-800.webp / .jpg      (and any larger widths)
        <name>-full.webp / .jpg     (shown in the lightbox)
   2. Add one entry to afroWallImages:
        {
          name: 'afro-03',
          widths: [400, 800, 1200],   // widths that actually exist
          width: 960, height: 1280,   // intrinsic size, stops layout shift
          alt: 'Short, factual description of the photo.',
          focus: '50% 30%',           // optional: crop focus, defaults to 50% 32%
        }
   The wall handles any number of photos — 2, 20 or 50+ — and
   varies the tile shapes automatically.
   ========================================================= */

import { eventConfig } from './config.js';

/** @typedef {{name:string,widths:number[],width:number,height:number,alt:string,focus?:string}} AfroWallImage */

/** @type {AfroWallImage[]} */
export const afroWallImages = [
  {
    name: 'afro-01',
    widths: [400, 800, 961],
    width: 961,
    height: 1280,
    alt: 'A smiling young man with a full, rounded Afro, wearing a striped rugby shirt.',
  },
  {
    name: 'afro-02',
    widths: [400, 759],
    width: 759,
    height: 1080,
    alt: 'A young person resting their chin on their hand, wearing a wide, voluminous Afro and gold chains.',
    focus: '50% 42%',
  },
  {
    name: 'afro-03',
    widths: [400, 800, 960],
    width: 960,
    height: 1280,
    alt: 'Someone photographed from above on a grass field, hands covering their face, wearing a beige outfit and a twisted Afro.',
    focus: '50% 45%',
  },
  {
    name: 'afro-04',
    widths: [400, 800, 810],
    width: 810,
    height: 1080,
    alt: 'A young woman with shoulder-length locs, wearing a striped tank top and a necklace shaped like the map of Africa.',
    focus: '50% 30%',
  },
  {
    name: 'afro-05',
    widths: [400, 800, 1200],
    width: 1254,
    height: 1254,
    alt: 'A young man with a large, perfectly round Afro, in a black tee and a gold nameplate chain.',
    focus: '50% 42%',
  },
  {
    name: 'afro-06',
    widths: [400, 800, 1080],
    width: 1080,
    height: 1080,
    alt: 'A four-photo grid of a young woman with a full Afro in a yellow striped top.',
    focus: '50% 40%',
  },
  {
    name: 'afro-07',
    widths: [400, 608],
    width: 608,
    height: 1080,
    alt: 'A collage of Afro selfies alongside the UMSA Afro Hair celebration poster.',
    focus: '50% 40%',
  },
  {
    name: 'afro-08',
    widths: [400, 720],
    width: 720,
    height: 1280,
    alt: 'A mirror selfie, phone raised in front of the face, showing a neat rounded Afro.',
    focus: '50% 60%',
  },
  {
    name: 'afro-09',
    widths: [400, 800, 810],
    width: 810,
    height: 1080,
    alt: 'A warm, vintage-toned portrait of a young man with an Afro, wearing a white vest.',
    focus: '50% 32%',
  },
];

/* Where "Join the wall" should send people. Set it in scripts/config.js
   (eventConfig.afroWallSubmissionUrl). While it is empty the CTA stays
   hidden rather than linking to an invented destination. */
const afroWallSubmissionUrl = eventConfig.afroWallSubmissionUrl || '';

const DIR = 'assets/images/afro-wall';
const SIZES =
  '(min-width: 1280px) 22vw, (min-width: 768px) 30vw, (min-width: 480px) 44vw, 45vw';

const srcset = (img, ext) =>
  img.widths.map((w) => `${DIR}/${img.name}-${w}.${ext} ${w}w`).join(', ');

const fallbackSrc = (img) =>
  `${DIR}/${img.name}-${img.widths[img.widths.length - 1]}.jpg`;

function tileMarkup(img, index, total) {
  const eager = index < 4; // first screenful loads immediately
  return `
    <li class="afro-wall__item"${img.focus ? ` style="--focus:${escapeAttr(img.focus)}"` : ''}>
      <button class="afro-wall__tile" type="button" data-afro-open="${index}"
              aria-label="View photo ${index + 1} of ${total}: ${escapeAttr(img.alt)}">
        <picture>
          <source type="image/webp" srcset="${srcset(img, 'webp')}" sizes="${SIZES}">
          <img src="${fallbackSrc(img)}" srcset="${srcset(img, 'jpg')}" sizes="${SIZES}"
               width="${img.width}" height="${img.height}"
               loading="${eager ? 'eager' : 'lazy'}" decoding="async"
               ${eager ? 'fetchpriority="high"' : ''}
               alt="${escapeAttr(img.alt)}">
        </picture>
      </button>
    </li>`;
}

function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

export function initAfroWall() {
  const section = document.querySelector('[data-afro-wall]');
  if (!section) return;

  const grid = section.querySelector('[data-afro-grid]');
  const empty = section.querySelector('[data-afro-empty]');
  const cta = section.querySelector('[data-afro-cta]');
  const ctaLink = section.querySelector('[data-afro-cta-link]');
  const total = afroWallImages.length;

  if (!total) {
    grid?.setAttribute('hidden', '');
    empty?.removeAttribute('hidden');
  } else {
    grid.innerHTML = afroWallImages.map((img, i) => tileMarkup(img, i, total)).join('');
    // Lets the CSS hold the wall back to fewer columns while it is still
    // small; from four photos up it uses the full column count.
    if (total < 4) grid.dataset.count = String(total);
    else grid.removeAttribute('data-count');
    empty?.setAttribute('hidden', '');
  }

  // CTA only appears once a real destination exists (config.js).
  if (afroWallSubmissionUrl && ctaLink) {
    ctaLink.href = afroWallSubmissionUrl;
    ctaLink.removeAttribute('aria-disabled');
    cta?.removeAttribute('hidden');
  } else {
    cta?.setAttribute('hidden', '');
  }

  if (total) initLightbox(section);
}

/* ---------------------------------------------------------
   Lightbox — no dependencies, ~2kb of behaviour
   --------------------------------------------------------- */
function initLightbox(section) {
  const lb = document.querySelector('[data-afro-lightbox]');
  if (!lb) return;

  const imgEl = lb.querySelector('[data-afro-lb-img]');
  const srcEl = lb.querySelector('[data-afro-lb-source]');
  const capEl = lb.querySelector('[data-afro-lb-caption]');
  const countEl = lb.querySelector('[data-afro-lb-count]');
  const closeBtn = lb.querySelector('[data-afro-close]');
  const prevBtn = lb.querySelector('[data-afro-prev]');
  const nextBtn = lb.querySelector('[data-afro-next]');
  const total = afroWallImages.length;

  let index = 0;
  let opener = null;
  let scrollY = 0;

  const multiple = total > 1;
  prevBtn.hidden = !multiple;
  nextBtn.hidden = !multiple;

  const show = (i) => {
    index = (i + total) % total;
    const img = afroWallImages[index];
    srcEl.srcset = `${DIR}/${img.name}-full.webp`;
    imgEl.src = `${DIR}/${img.name}-full.jpg`;
    imgEl.width = img.width;
    imgEl.height = img.height;
    imgEl.alt = img.alt;
    capEl.textContent = img.alt;
    countEl.textContent = `${index + 1} / ${total}`;
  };

  const lockScroll = () => {
    scrollY = window.scrollY;
    const bar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (bar > 0) document.body.style.paddingRight = `${bar}px`;
  };
  const unlockScroll = () => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    window.scrollTo({ top: scrollY, behavior: 'auto' });
  };

  const open = (i, trigger) => {
    opener = trigger || null;
    show(i);
    lb.hidden = false;
    lockScroll();
    requestAnimationFrame(() => lb.classList.add('is-open'));
    closeBtn.focus({ preventScroll: true });
  };

  const close = () => {
    lb.classList.remove('is-open');
    unlockScroll();
    const hide = () => { lb.hidden = true; };
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? hide()
      : window.setTimeout(hide, 200);
    opener?.focus({ preventScroll: true });
    opener = null;
  };

  section.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-afro-open]');
    if (!trigger) return;
    open(Number(trigger.dataset.afroOpen), trigger);
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(index - 1));
  nextBtn.addEventListener('click', () => show(index + 1));
  lb.addEventListener('click', (e) => { if (e.target.hasAttribute('data-afro-backdrop')) close(); });

  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (multiple && e.key === 'ArrowLeft') show(index - 1);
    else if (multiple && e.key === 'ArrowRight') show(index + 1);
    else if (e.key === 'Tab') trapFocus(e);
  });

  function trapFocus(e) {
    const focusables = Array.from(
      lb.querySelectorAll('button:not([hidden]):not([disabled])')
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  // Swipe between photos on touch devices
  let startX = null;
  lb.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (startX === null || !multiple) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(dx < 0 ? index + 1 : index - 1);
    startX = null;
  }, { passive: true });
}
