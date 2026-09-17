#!/usr/bin/env python3
"""
Bundle the site into one self-contained HTML file (dist/index.html).

Used for previewing/hosting the page as a single file. The normal project in
the repository root is the source of truth — edit that, then re-run:

    python3 tools/build-single.py
"""
import base64
import mimetypes
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
DIST.mkdir(exist_ok=True)

html = (ROOT / "index.html").read_text()


def data_uri(path: pathlib.Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


# ---- CSS: inline every stylesheet, resolving url() references ----------------
css_parts = []
for match in re.finditer(r'<link rel="stylesheet" href="(styles/[^"]+)">', html):
    href = match.group(1)
    path = ROOT / href
    css = path.read_text()

    def fix(m, base=path.parent):
        ref = m.group(1).strip("\"'")
        if ref.startswith(("data:", "http")):
            return m.group(0)
        return f'url("{data_uri((base / ref).resolve())}")'

    css_parts.append(re.sub(r'url\(([^)]+)\)', fix, css))

html = re.sub(r'\s*<link rel="stylesheet" href="styles/[^"]+">', "", html)
html = html.replace("</head>", "<style>\n" + "\n".join(css_parts) + "\n</style>\n</head>")

# ---- JS: flatten the ES modules into one classic script ---------------------
order = [
    "config.js", "nav.js", "reveal.js", "afro-wall.js", "carousel.js",
    "ticker.js", "video-sound.js", "programme.js", "countdown.js",
    "tickets.js", "share.js", "footer.js", "main.js",
]
js = []
for name in order:
    src = (ROOT / "scripts" / name).read_text()
    src = re.sub(r'^\s*import .*?;\s*$', "", src, flags=re.M)
    # Strip the "export " keyword from any export (function/const/let/var),
    # since the bundled output is a plain classic script, not a module.
    src = re.sub(r'^export\s+', "", src, flags=re.M)
    js.append(src)
html = html.replace(
    '<script type="module" src="scripts/main.js"></script>',
    "<script>\n(function(){\n" + "\n".join(js) + "\n})();\n</script>",
)

# ---- Images: inline <img src>, <source srcset> and preload ------------------
def inline_asset(m):
    attr, ref = m.group(1), m.group(2)
    path = (ROOT / ref).resolve()
    if not path.exists():
        return m.group(0)
    return f'{attr}="{data_uri(path)}"'


html = re.sub(r'\b(src|srcset|href)="(assets/images/[^"]+)"', inline_asset, html)
html = re.sub(r'\s*<link rel="preload"[^>]*>', "", html)

(DIST / "index.html").write_text(html)
print("wrote", DIST / "index.html", f"({(DIST / 'index.html').stat().st_size/1024:.0f} KB)")
