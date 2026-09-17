# Adding photos — Afro Wall & the culture slide

Both photo sections on the site work the same way: there is one list of
photos per section, and you add a new photo by adding one entry to that
list. You never have to touch the layout, the CSS, or how the page looks —
it re-arranges itself automatically for however many photos are in the list.

- **The Afro Wall** (Section 7) → list lives in `scripts/afro-wall.js`,
  photos live in `assets/images/afro-wall/`
- **The culture slide** (Section 3, Yoruba · Hausa · Igbo) → list lives in
  `scripts/culture-slide.js`, photos live in `assets/images/culture-slide/`

For the culture slide specifically: **do not add a tribe name anywhere** —
not in the file name, not in the description you write for a photo. The
slide shows people's culture; it does not label anyone's tribe.

The list in each file looks like plain JSON — a set of `{ }` entries inside
`[ ]` — so adding a photo is: run one command, copy the entry it prints,
paste it into the list, save. That's it.

## Step by step

### 1. Get the picture ready (resizes it, makes web-friendly copies)

You need Python and Pillow installed once:

```bash
pip install Pillow
```

Then, from the project folder, run the matching tool for the section you're
adding to:

**Afro Wall:**
```bash
python3 tools/optimise-afro-photos.py afro-12 ~/Downloads/whatsapp-photo.jpg
```

**Culture slide:**
```bash
python3 tools/optimise-culture-photos.py culture-01 ~/Downloads/photo.jpg
```

- The first word after the script name (`afro-12`, `culture-01`) is just a
  short ID you're giving this photo — pick the next free number in that
  series so you don't overwrite an existing photo.
- The last part is the path to the original photo on your computer.

The tool resizes the photo into a few sizes, saves them into the right
`assets/images/...` folder, and then prints something like this in your
terminal:

```js
  {
    name: 'afro-12',
    widths: [400, 800, 1200],
    width: 1080,
    height: 1440,
    alt: 'TODO: short, factual description of the photo.',
  },
```

That printed block is the entry you'll paste in step 2 — leave it exactly
as printed except for the `alt` text.

### 2. Paste the entry into the list

Open the matching file:

- Afro Wall → `scripts/afro-wall.js`, find `afroWallImages = [ ... ]`
- Culture slide → `scripts/culture-slide.js`, find `cultureSlideImages = [ ... ]`

Paste the entry the tool printed as a new item inside the `[ ]` list (right
after the last one, or wherever you like — order doesn't matter, they just
land in the wall/slide in list order). Then replace the `alt:` line with a
short, honest description of what's in the photo.

- **Afro Wall `alt` text**: just describe the photo (e.g. what the person is
  wearing, doing).
- **Culture slide `alt` text**: describe the photo the same way, but never
  name a tribe.

Save the file. That's the whole change — refresh the page and the new photo
is on the wall/slide.

### Example: a real afro-wall.js entry before and after

Before:
```js
export const afroWallImages = [
  { name: 'afro-01', widths: [400, 800, 961], width: 961, height: 1280, alt: '…' },
];
```

After adding one more:
```js
export const afroWallImages = [
  { name: 'afro-01', widths: [400, 800, 961], width: 961, height: 1280, alt: '…' },
  {
    name: 'afro-12',
    widths: [400, 800, 1200],
    width: 1080,
    height: 1440,
    alt: 'A young woman in a wide-brimmed hat, smiling at the camera.',
  },
];
```

## A few things to know

- **No photo edits beyond resizing.** The tool only resizes and re-encodes —
  it doesn't crop, filter, or retouch anyone. If a photo is cropped too
  tight or loose once it's live, add an optional `focus:` line (e.g.
  `focus: '50% 30%',`) to nudge which part of the photo stays visible,
  rather than re-cropping the file itself.
- **Removing a photo** is the reverse: delete its entry from the list, and
  optionally delete its files from the matching `assets/images/...` folder.
- **The Afro Wall can still take short video clips** if that's ever wanted
  again — ask, and the steps for that are commented at the top of
  `scripts/afro-wall.js`. The culture slide is photos only.
- If the list in either file is empty, that section shows a small "coming
  soon" message on the site instead of an empty gap — so it's safe to leave
  either one empty until photos come in.
