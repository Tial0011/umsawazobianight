# Wazobia Night 2026 — UMSA, UNIMED Ondo

Official event site. Sections 1–5 are built:

1. Hero — Wazobia Night, date, time, venue, ticket prices, CTAs
2. What is Wazobia? — Wa / Zo / Bia
3. Yoruba · Hausa · Igbo — culture panels
4. And beyond. — the wider cultural picture
5. The cultural experience — video placeholder + feature tags

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
    beyond.css  cultural-experience.css  button.css  pattern.css  footer.css
scripts/
  main.js                   boots the modules
  nav.js                    sticky navbar + mobile menu (focus, Escape, scroll lock)
  reveal.js                 IntersectionObserver entrance animation
  carousel.js               snap-scroll rail for the culture cards
  ticker.js                 slow marquee in "And beyond"
assets/
  images/                   flyer, Open Graph image, pattern tile, placeholder art
  video/                    drop the section 5 video here
tools/build-single.py       bundles everything into dist/index.html (one file)
```

## Adding the remaining sections

Append a new `<section class="… section" id="…">` inside `<main>`, add a
matching file in `styles/components/`, link it in `<head>`, and add the nav
entry in both the desktop list and the mobile panel in `index.html`. Nothing in
sections 1–5 needs to change. Existing patterns to reuse:

- `.shell` for the max-width container and side padding
- `.section` for vertical rhythm
- `.btn .btn--primary` / `.btn--ghost` for actions
- `data-reveal="1..7"` on an element to give it an entrance animation

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
- **Venue check:** the brief says *NIPER Field* and the flyer artwork reads
  *NIEPA Field*. The site uses NIPER Field in the HTML, the JSON-LD and the
  nav panel. Confirm the correct spelling and update those three places.
- No performers, sponsors, programme, payment details, phone numbers or social
  handles have been invented. Nothing on the page claims information that was
  not supplied.

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
