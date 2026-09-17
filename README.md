# Wazobia Night 2026 — UMSA, UNIMED Ondo

Official event site. Built so far:

1. Hero — Wazobia Night, date, time, venue, ticket prices, CTAs
2. What is Wazobia? — Wa / Zo / Bia
3. Yoruba · Hausa · Igbo — culture panels
4. And beyond. — the wider cultural picture
5. The cultural experience — video placeholder + feature tags
6. Come as your culture — emotional/participatory statement + placeholder art
7. The Afro Wall — community photo wall, data-driven, with a lightbox
8. What's waiting for you? — editorial list of experiences
9. The night / programme — event timeline, data-driven
10. Live countdown — real-time countdown to doors-open, WAT-correct
11. Get your ticket — pricing, how-to-pay steps, payment panel (config-driven)
12. Share the night — WhatsApp/X/Facebook/copy-link, native share on mobile
13. Wazobia awaits — final CTA
14. Footer — event details, quick links, socials (config-driven)

## Running it

No build step, no dependencies. Serve the folder over HTTP (the JavaScript uses
ES modules, so opening `index.html` directly from the file system will not work):

```bash
npm start            # npx serve . -l 3000
# or
python3 -m http.server 3000
```

Then open <http://localhost:3000>.

### Why plain HTML/CSS/JS instead of Next.js

The brief asked for a fast site for visitors on Nigerian mobile networks. The
page has no client-side routing, no data fetching and no app state, so a React
build would add a toolchain and a JS bundle without changing what ships. Every
file here is static: it deploys to Netlify, Vercel, GitHub Pages or cPanel by
uploading the folder.

The structure is componentised (one CSS file and one JS module per component),
so moving into Next.js later is mostly copy-and-paste: each block in
`index.html` maps 1:1 to a component file listed below.

## Structure

```
index.html                  page markup — sections are self-contained blocks
styles/
  tokens.css                colour, type scale, spacing, motion — edit here first
  base.css                  reset, shell, section rhythm, reveal animation
  components/
    navbar.css  hero.css  wazobia-intro.css  culture-cards.css
    beyond.css  cultural-experience.css  culture-call.css  waiting.css
    programme.css  countdown.css  button.css  pattern.css  footer.css
scripts/
  main.js                   boots the modules
  nav.js                    sticky navbar + mobile menu (focus, Escape, scroll lock)
  reveal.js                 IntersectionObserver entrance animation (hero only)
  carousel.js               snap-scroll rail for the culture cards
  ticker.js                 slow marquee in "And beyond"
  video-sound.js            unmute prompt for the section 5 video
  programme.js              programme DATA + renderer for section 9 (edit here)
  countdown.js              live countdown target + tick logic for section 10
assets/
  images/                   flyer, Open Graph image, pattern tile, placeholder art
  video/                    drop the section 5 video here
tools/build-single.py       bundles everything into dist/index.html (one file)
```

## Adding a new section

Append a new `<section class="… section" id="…">` inside `<main>`, add a
matching file in `styles/components/`, link it in `<head>`. Nothing in
sections 1–5 needs to change. Existing patterns to reuse:

- `.shell` for the max-width container and side padding
- `.section` for vertical rhythm
- `.btn .btn--primary` / `.btn--ghost` for actions
- `data-reveal="1..7"` on an element to give it an entrance animation (used
  only in the hero, deliberately — see the design notes in section 6–10's
  brief; don't scatter it onto every section)

Note: the nav (desktop list + mobile panel) currently links only sections
1–5. Sections 6–10 were intentionally left out of the nav for this pass, since
adding five more links risked crowding the existing navbar layout, which the
brief asked not to redesign. Add entries there yourself if you want them
directly reachable from the menu — the pattern to copy is already in
`index.html` (`.nav__list` and `.nav__panel-list`).

## Section 9 — editing the programme

The running order lives entirely in `scripts/programme.js`, as a plain array:

```js
export const programme = [
  { time: '04:00 PM', title: 'Doors Open', description: '…' },
  { time: '', title: 'Coming Soon', description: '…', placeholder: true },
];
```

- `time` — shown as the row's time label; leave it `''` for a slot with no
  confirmed time yet (it renders as a blank spacer instead of "undefined").
- `placeholder: true` — dims the row and hollows out its timeline dot, so
  unconfirmed slots read visually as "TBA" rather than as a real item.
- The list is rendered into `<ol data-programme-list>` by `initProgramme()` in
  the same file. There's a static `<noscript>` fallback right after it in
  `index.html` — update that too if you change the first few entries, so
  visitors without JavaScript still see accurate placeholder text.

## Section 10 — changing the countdown date/time

Open `scripts/countdown.js` and edit one line:

```js
const TARGET_UTC_MS = Date.UTC(2026, 9, 1, 15, 0, 0); // year, month (0-based!), day, hour, minute, second — in UTC
```

The countdown is deliberately written in **UTC**, not the browser's local
time, so it counts down correctly for every visitor regardless of their
device's timezone. Nigeria (WAT) is UTC+1 with no daylight saving, so convert
any new WAT time by subtracting one hour: 4:00 PM WAT → 15:00 UTC. Remember
`Date.UTC`'s month argument is zero-based (`9` = October).

If you also change the date/time, update the matching `startDate` in the
`Event` JSON-LD block near the top of `index.html`, and the `.countdown__meta`
and `.hero__band` text, so the page doesn't contradict itself.

## Section 7 — The Afro Wall

The wall is rendered from one array, `afroWallImages` in
`scripts/afro-wall.js`. Nothing else has to change as it grows — the layout,
the lightbox and the shape rhythm all adapt to however many photos are in the
array (2, 20 or 50+).

### Adding photos

1. Optimise the originals:

   ```bash
   python3 tools/optimise-afro-photos.py afro-03 ~/Downloads/whatsapp-photo.jpg
   ```

   That writes `afro-03-400/-800/-1200.webp` + `.jpg` and `afro-03-full.webp`
   + `.jpg` into `assets/images/afro-wall/`, and prints the array entry to
   paste. Photos are only resized and re-encoded — no filters, retouching or
   any other alteration of the people in them.

2. Paste the printed entry into `afroWallImages`:

   ```js
   {
     name: 'afro-03',
     widths: [400, 800, 1200],
     width: 1080, height: 1440,   // intrinsic size — prevents layout shift
     alt: 'Short, factual description of the photo.',
     focus: '50% 32%',            // optional crop focus
   }
   ```

   Write the `alt` text by hand: it is what screen-reader users and anyone on
   a failed image load get.

### How the layout stays varied

Tiles flow in a CSS column masonry (2 columns on mobile, 3 from 768px,
4 from 1280px). Tile proportions cycle every 7 items and tilts every 5, two
lengths that rarely line up with the number of tiles per column, so the wall
keeps staggering instead of settling into a rigid grid at any photo count.
Every ratio is portrait or square, because submissions are phone selfies and a
landscape crop would cut the crown out of frame.

The first four images load eagerly; the rest are `loading="lazy"`. Every tile
carries intrinsic `width`/`height` plus a CSS `aspect-ratio`, so nothing
shifts as images arrive.

### The lightbox

Plain JS, no library: click or tap a photo to open it, `Escape` or the Close
button to leave, arrow keys or the on-screen arrows (or a swipe) to move
between photos. Focus is trapped while open, returns to the tile that opened
it on close, and background scrolling is locked.

### "Join the wall" CTA

Hidden until `eventConfig.afroWallSubmissionUrl` in `scripts/config.js` is
set. Put the real WhatsApp link, form URL or `mailto:` address there and the
CTA appears and points at it. No placeholder destination is invented.

## Sections 11–14 — event config, payment, sharing, footer

All editable facts for these four sections live in one place:
`scripts/config.js`, exported as `eventConfig`. Nothing else needs to change
when any of the following arrive:

- **`eventConfig.payment.paymentLink`** — once set, every "Get your ticket"
  button on the site (navbar, hero, Section 11, Section 13) automatically
  points at it and opens in a new tab. Until then they all point at safe,
  real in-page anchors (`#tickets`, `#payment-instructions`) — never a bare
  `#` and never a fake checkout.
- **`eventConfig.payment.bankName`** — currently empty, so the Section 11
  payment panel shows "Coming soon" for just this one field while account
  number and account name (already confirmed) render normally. Each of the
  three fields renders independently — none of them wait on the others.
- **`eventConfig.payment.contacts`** — the people to contact for payment
  enquiries and for sending proof of payment, rendered with tap-to-call and
  tap-to-WhatsApp links. Add, remove or edit entries here; the panel
  re-renders the whole list from this array.
- **`eventConfig.confirmation.instructions`** — the copy shown for step 04,
  "Confirm your ticket". Currently points people at the contacts above.
- **`eventConfig.siteUrl`** — the canonical domain used by Section 12's
  share links. Left empty, sharing falls back to the visitor's current
  browser URL, so Copy Link/WhatsApp/X/Facebook all work correctly today.
- **`eventConfig.socials.*`** — the footer only ever renders a social link
  that has a real URL here; empty values stay hidden completely (icon and
  list item), never a placeholder link to a fake profile.

Relevant files: `scripts/config.js` (data), `scripts/tickets.js` (Section 11
logic), `scripts/share.js` (Section 12 logic), `scripts/footer.js` (Section 14
logic), `styles/components/tickets.css`, `share.css`, `final-cta.css`.

The footer also carries three brand marks —
`assets/images/logo-umsa.png`, `logo-unimed.png` and `logo-tla.png` — cropped
from official artwork with transparent backgrounds. Swap the files (same
names) to update any of the three without touching `index.html`.

## Replacing the video placeholder

Put the files in `assets/video/`, then in section 5 of `index.html` replace the
contents of `.video-frame__inner` with:

```html
<video
  src="assets/video/cultural-experience.mp4"
  poster="assets/video/cultural-experience-poster.jpg"
  width="640" height="480"
  muted loop playsinline preload="metadata"
  controls
  aria-label="Cultural experience video">
  <source src="assets/video/cultural-experience.webm" type="video/webm">
  <source src="assets/video/cultural-experience.mp4" type="video/mp4">
</video>
```

Also delete the `.video-frame__poster`, `.video-frame__play` and
`.video-frame__label` elements, and remove the `data-video-placeholder`
attribute. The frame is locked to 4:3 (`aspect-ratio: 4 / 3` in
`styles/components/cultural-experience.css`) to match the 640×480 source —
change that one value if the final video has a different ratio.

Autoplay is deliberately not set. If you want it, add `autoplay` alongside
`muted playsinline`, and keep the file under about 3 MB so it does not punish
mobile data.

## Replacing the image placeholders

| File | What it is | Replace with |
| --- | --- | --- |
| `assets/images/flyer-full.jpg` / `.webp` | the official flyer, shown as the hero poster | a higher-resolution export if you have one; keep the 870×1080 ratio or update `aspect-ratio` in `hero.css` |
| `assets/images/culture-yoruba.svg`, `culture-hausa.svg`, `culture-igbo.svg` | geometric placeholders in the culture cards | photographs at 4:3, ideally 1200×900, `.webp` or `.jpg`. Update the `src`, `width`, `height` and `alt` in `index.html` |
| `assets/images/og-wazobia-night-2026.jpg` | social share image, 1200×630 | a purpose-made share graphic |
| `assets/images/favicon.svg` | placeholder mark — **not** an official logo | the real UMSA/Wazobia mark |

When you swap in real photos, delete the `.culture-card__media::after` rule in
`styles/components/culture-cards.css` — it draws the "Photo placeholder" tag.

Favicon: add `favicon.ico` (32×32) and `assets/images/apple-touch-icon.png`
(180×180) to match the `<link>` tags already in `index.html`, and list the PNG
icons in `site.webmanifest`.

## Before launch

- Replace `https://example.com/` in `index.html` (canonical, Open Graph, Twitter,
  JSON-LD) and in `robots.txt` with the real domain.
- Point the two "Get your ticket" buttons (`href="#tickets"`) at the real ticket
  flow once it exists. They currently jump to the event detail band.
- No performers, sponsors, programme, payment details, phone numbers or social
  handles have been invented. Nothing on the page claims information that was
  not supplied.
- Fill in `scripts/config.js` (`eventConfig.payment`, `.confirmation`,
  `.siteUrl`, `.socials`) as each of those becomes available — see
  "Sections 11–14" below for what each field controls.

## Accessibility and performance notes

- One `<h1>`; sections use `<h2>`, cards `<h3>`.
- Skip link, visible focus rings, `aria-expanded` on the menu button, Escape
  closes the menu, body scroll is locked while it is open.
- `prefers-reduced-motion: reduce` disables the entrance animations, the
  marquee and smooth scrolling.
- The culture rail and the marquee are the only horizontal scrollers; the page
  itself has no horizontal overflow from 320px upward.
- Images below the fold use `loading="lazy"`; the hero flyer is preloaded.
- Fonts (Anton, Manrope) come from Google Fonts with `display=swap`. To go fully
  self-hosted, download the two families into `assets/fonts/` and swap the
  `<link>` for `@font-face` rules in `styles/base.css`.
