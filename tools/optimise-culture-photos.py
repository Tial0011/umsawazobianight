#!/usr/bin/env python3
"""Prepare a photo for Section 3 — the Yoruba · Hausa · Igbo slide.

    python3 tools/optimise-culture-photos.py culture-01 ~/Downloads/photo.jpg

Writes responsive WebP + JPEG derivatives into assets/images/culture-slide/
and prints the entry to paste into `cultureSlideImages` in
scripts/culture-slide.js.

The photo is only resized and re-encoded: no filters, no retouching, no
cropping, no alteration of the people in it. Cropping is done by the layout
at display time (and is adjustable per photo via the `focus` field).

Do not name a tribe in the file name or the alt text you write afterwards —
this slide shows people's culture, not a label of which tribe each photo
belongs to.

Requires Pillow:  pip install Pillow
"""
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is required:  pip install Pillow")

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "images" / "culture-slide"
WIDTHS = [400, 800, 1200]


def main(name: str, source: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    im = ImageOps.exif_transpose(Image.open(source)).convert("RGB")
    w0, h0 = im.size

    written = []
    for target in WIDTHS:
        w = min(target, w0)
        if w in written:
            continue
        h = round(h0 * w / w0)
        r = im if w == w0 else im.resize((w, h), Image.LANCZOS)
        r.save(OUT / f"{name}-{w}.webp", "WEBP", quality=82, method=6)
        r.save(OUT / f"{name}-{w}.jpg", "JPEG", quality=82, optimize=True, progressive=True)
        written.append(w)

    print(f"\nWrote {len(written) * 2} files to {OUT.relative_to(ROOT)}\n")
    print("Paste this into cultureSlideImages in scripts/culture-slide.js")
    print("(replace the alt text with a real description — no tribe name):\n")
    print(f"""  {{
    name: '{name}',
    widths: {written},
    width: {w0},
    height: {h0},
    alt: 'TODO: short, factual description of the photo — no tribe name.',
  }},""")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
