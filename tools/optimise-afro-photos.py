#!/usr/bin/env python3
"""Prepare a photo for Section 7 — The Afro Wall.

    python3 tools/optimise-afro-photos.py afro-03 ~/Downloads/photo.jpg

Writes responsive WebP + JPEG derivatives into assets/images/afro-wall/ and
prints the entry to paste into `afroWallImages` in scripts/afro-wall.js.

The photo is only resized and re-encoded: no filters, no retouching, no
cropping, no alteration of the person in it. Cropping is done by the layout
at display time (and is adjustable per photo via the `focus` field).

Requires Pillow:  pip install Pillow
"""
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is required:  pip install Pillow")

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "images" / "afro-wall"
WIDTHS = [400, 800, 1200]
LIGHTBOX_MAX = 1600


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

    big = im if w0 <= LIGHTBOX_MAX else im.resize(
        (LIGHTBOX_MAX, round(h0 * LIGHTBOX_MAX / w0)), Image.LANCZOS
    )
    big.save(OUT / f"{name}-full.webp", "WEBP", quality=86, method=6)
    big.save(OUT / f"{name}-full.jpg", "JPEG", quality=86, optimize=True, progressive=True)

    print(f"\nWrote {len(written) * 2 + 2} files to {OUT.relative_to(ROOT)}\n")
    print("Paste this into afroWallImages in scripts/afro-wall.js")
    print("(replace the alt text with a real description):\n")
    print(f"""  {{
    name: '{name}',
    widths: {written},
    width: {w0},
    height: {h0},
    alt: 'TODO: short, factual description of the photo.',
  }},""")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
