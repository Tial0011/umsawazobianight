/* =========================================================
   Section 7 — The Afro Wall
   ---------------------------------------------------------
   A community photo wall: people send in their Afro looks and
   they go up here. The wall is rendered from the data array
   below, so growing it means adding objects — never touching
   the layout, the CSS or the lightbox. Photos and short video
   clips both work.

   TO ADD A PHOTO
   1. Prepare the files:
        python3 tools/optimise-afro-photos.py afro-10 photo.jpg
      It writes assets/images/afro-wall/afro-10-*.webp/.jpg and
      prints the entry below.
   2. Add it to afroWallImages:
        {
          name: 'afro-10',
          widths: [400, 800, 1200],   // widths that actually exist
          width: 960, height: 1280,   // intrinsic size, stops layout shift
          alt: 'Short, factual description of the photo.',
          focus: '50% 30%',           // optional: crop focus, defaults to 50% 32%
        }

   TO ADD A VIDEO CLIP
   1. Put an MP4 (faststart, h264/aac) in assets/video/afro-wall/,
      and a poster frame in assets/images/afro-wall/ following the
      same <name>-poster-400/-800.webp/.jpg naming as photos.
   2. Add it with type: 'video':
        {
          type: 'video',
          name: 'afro-10',
          widths: [400, 800],         // poster widths that exist
          width: 464, height: 832,
          video: 'assets/video/afro-wall/afro-10',   // no extension — .mp4 and .webm are both served
          alt: 'Short, factual description of the clip.',
        }
   The wall handles any number of items — 2, 20 or 50+ — and varies
   the tile shapes automatically.
   ========================================================= */

import { eventConfig } from './config.js';

/** @typedef {{
 *   type?: 'photo'|'video', name:string, widths:number[],
 *   width:number, height:number, alt:string, focus?:string, video?:string,
 * }} AfroWallItem */

/** @type {AfroWallItem[]} */
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

/* Removed: afro-06 (the four-photo-grid tile) and the two video clips
   (afro-10, afro-11) — everything else from the original wall is back.
   Add new entries here in the same shape (see TO ADD A PHOTO / TO ADD A
   VIDEO CLIP above) whenever you want to grow the wall again. */

/* Where "Join the wall" should send people. Set it in scripts/config.js
   (eventConfig.afroWallSubmissionUrl). While it is empty the CTA stays
   hidden rather than linking to an invented destination. */
const afroWallSubmissionUrl = eventConfig.afroWallSubmissionUrl || '';

const DIR = 'assets/images/afro-wall';
const SIZES =
  '(min-width: 1280px) 22vw, (min-width: 768px) 30vw, (min-width: 480px) 30vw, 42vw';

const isVideo = (item) => item.type === 'video';

/* Videos use the same "<name>-poster-<width>.<ext>" pattern as photos
   use "<name>-<width>.<ext>", so both share one srcset builder. */
const stem = (item) => (isVideo(item) ? `${item.name}-poster` : item.name);

const srcset = (item, ext) =>
  item.widths.map((w) => `${DIR}/${stem(item)}-${w}.${ext} ${w}w`).join(', ');

const fallbackSrc = (item, ext = 'jpg') =>
  `${DIR}/${stem(item)}-${item.widths[item.widths.length - 1]}.${ext}`;

function tileMarkup(item, index, total) {
  const eager = index < 4; // first screenful loads immediately
  const label = isVideo(item)
    ? `Play video ${index + 1} of ${total}: ${escapeAttr(item.alt)}`
    : `View photo ${index + 1} of ${total}: ${escapeAttr(item.alt)}`;
  return `
    <li class="afro-wall__item"${item.focus ? ` style="--focus:${escapeAttr(item.focus)}"` : ''}>
      <button class="afro-wall__tile${isVideo(item) ? ' afro-wall__tile--video' : ''}" type="button"
              data-afro-open="${index}" aria-label="${label}">
        <picture>
          <source type="image/webp" srcset="${srcset(item, 'webp')}" sizes="${SIZES}">
          <img src="${fallbackSrc(item)}" srcset="${srcset(item, 'jpg')}" sizes="${SIZES}"
               width="${item.width}" height="${item.height}"
               loading="${eager ? 'eager' : 'lazy'}" decoding="async"
               ${eager ? 'fetchpriority="high"' : ''}
               alt="${escapeAttr(item.alt)}">
        </picture>
        ${isVideo(item) ? '<span class="afro-wall__play" aria-hidden="true"></span>' : ''}
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
   Lightbox — no dependencies, ~2kb of behaviour. Shows a photo
   or plays a video depending on the item that was opened.
   --------------------------------------------------------- */
function initLightbox(section) {
  const lb = document.querySelector('[data-afro-lightbox]');
  if (!lb) return;

  const stage = lb.querySelector('[data-afro-lb-stage]');
  const pictureEl = lb.querySelector('[data-afro-lb-picture]');
  const imgEl = lb.querySelector('[data-afro-lb-img]');
  const srcEl = lb.querySelector('[data-afro-lb-source]');
  const videoEl = lb.querySelector('[data-afro-lb-video]');
  const videoMp4 = lb.querySelector('[data-afro-lb-video-mp4]');
  const videoWebm = lb.querySelector('[data-afro-lb-video-webm]');
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

  const stopVideo = () => {
    videoEl.pause();
    videoMp4.removeAttribute('src');
    videoWebm.removeAttribute('src');
    videoEl.load();
  };

  const show = (i) => {
    stopVideo();
    index = (i + total) % total;
    const item = afroWallImages[index];

    if (isVideo(item)) {
      pictureEl.hidden = true;
      videoEl.hidden = false;
      videoEl.poster = fallbackSrc(item);
      videoMp4.src = `${item.video}.mp4`;
      videoWebm.src = `${item.video}.webm`;
      videoEl.load();
      videoEl.play().catch(() => { /* autoplay may be blocked; controls remain available */ });
    } else {
      videoEl.hidden = true;
      pictureEl.hidden = false;
      srcEl.srcset = `${DIR}/${item.name}-full.webp`;
      imgEl.src = `${DIR}/${item.name}-full.jpg`;
      imgEl.width = item.width;
      imgEl.height = item.height;
      imgEl.alt = item.alt;
    }
    capEl.textContent = item.alt;
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
    stopVideo();
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
      lb.querySelectorAll('button:not([hidden]):not([disabled]), video:not([hidden])')
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  // Swipe between items on touch devices (ignored while a video has focus
  // so a horizontal seek-drag on the scrubber isn't mistaken for a swipe).
  let startX = null;
  stage.addEventListener('touchstart', (e) => {
    if (e.target === videoEl) return;
    startX = e.touches[0].clientX;
  }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (startX === null || !multiple) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(dx < 0 ? index + 1 : index - 1);
    startX = null;
  }, { passive: true });
}
