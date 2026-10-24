"""
Regenerates every optimized asset of the site from the originals in `assets-source/`.

Requirements (install in a virtualenv): pip install pymupdf pillow
Usage (from the project root):    python scripts/prepare-assets.py

Outputs
- static/itinerari/*.pdf          compressed PDFs offered for download (text, links and layout untouched)
- src/lib/assets/img/*.webp       responsive photos extracted from the PDFs + brand images
- static/og/*.jpg                 1200x630 Open Graph images
- static/*.png|ico, favicon.svg   favicon set + web app manifest icons
"""

import io
import os
import shutil
from pathlib import Path

import pymupdf
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets-source"
STATIC = ROOT / "static"
IMG_OUT = ROOT / "src" / "lib" / "assets" / "img"

# slug -> (source pdf, public pdf name, cover page index, wide page index)
ITINERARIES = {
    "roma-3-giorni": ("roma-3-giorni.pdf", "perdove-itinerario-roma-3-giorni.pdf", 0, 1),
    "vienna-4-giorni": ("vienna-4-giorni.pdf", "perdove-itinerario-vienna-4-giorni.pdf", 0, 1),
    "new-york-6-giorni": ("new-york-6-giorni.pdf", "perdove-itinerario-new-york-6-giorni.pdf", 0, 1),
}

CREAM = (247, 240, 231)


def largest_image(doc: pymupdf.Document, page_index: int) -> Image.Image:
    images = doc[page_index].get_images(full=True)
    xref = max(images, key=lambda i: i[2] * i[3])[0]
    pix = pymupdf.Pixmap(doc, xref)
    if pix.n - pix.alpha >= 4 or pix.alpha:
        pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
    return Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")


def save_webp(img: Image.Image, name: str, widths: list[int], quality: int = 72) -> None:
    for w in widths:
        w = min(w, img.width)
        h = round(img.height * w / img.width)
        img.resize((w, h), Image.LANCZOS).save(IMG_OUT / f"{name}-{w}.webp", "WEBP", quality=quality, method=6)


def save_og(img: Image.Image, path: Path) -> None:
    ImageOps.fit(img, (1200, 630), Image.LANCZOS, centering=(0.5, 0.45)).save(
        path, "JPEG", quality=82, optimize=True, progressive=True
    )


def _xref_image(doc: pymupdf.Document, xref: int, mode: str) -> Image.Image:
    pix = pymupdf.Pixmap(doc, xref)
    if pix.alpha:
        pix = pymupdf.Pixmap(pix, 0)  # drop alpha: soft masks stay separate objects
    if mode == "RGB" and pix.n != 3:
        pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
    return Image.open(io.BytesIO(pix.tobytes("png"))).convert(mode)


def _replace_stream(doc: pymupdf.Document, xref: int, img: Image.Image, jpeg_quality: int | None) -> None:
    """Swaps an image stream in place so every reference (including nested XObjects) follows."""
    if jpeg_quality:
        buf = io.BytesIO()
        img.save(buf, "JPEG", quality=jpeg_quality, optimize=True, progressive=True)
        doc.update_stream(xref, buf.getvalue(), compress=False)
        doc.xref_set_key(xref, "Filter", "/DCTDecode")
    else:  # raw pixels, Flate-compressed by update_stream
        doc.update_stream(xref, img.tobytes(), compress=True)
    for key, value in (
        ("Width", str(img.width)),
        ("Height", str(img.height)),
        ("ColorSpace", "/DeviceRGB" if img.mode == "RGB" else "/DeviceGray"),
        ("BitsPerComponent", "8"),
        ("DecodeParms", "null"),
        ("Decode", "null"),
    ):
        doc.xref_set_key(xref, key, value)


def compress_pdf(src: Path, dst: Path, max_side: int = 1500, quality: int = 74) -> None:
    """Re-encodes oversized photos as JPEG and downsamples their soft masks. Canva exports
    images inside form XObjects, where PyMuPDF's rewrite_images() cannot compute a DPI."""
    doc = pymupdf.open(src)
    done: set[int] = set()
    for page in doc:
        for info in page.get_images(full=True):
            xref, smask, w, h = info[0], info[1], info[2], info[3]
            if xref in done or max(w, h) <= 900:
                continue
            done.add(xref)
            img = _xref_image(doc, xref, "RGB")
            # Semi-transparent overlays (soft-masked) are flat panels: they survive a stronger downscale.
            img.thumbnail((1000, 1000) if smask else (max_side, max_side), Image.LANCZOS)
            _replace_stream(doc, xref, img, quality)
            if smask and smask not in done:
                done.add(smask)
                mask = _xref_image(doc, smask, "L").resize(img.size, Image.LANCZOS)
                _replace_stream(doc, smask, mask, None)
    doc.set_metadata({**doc.metadata, "author": "PerDove", "creator": "PerDove - perdove.com"})
    doc.save(dst, garbage=4, deflate=True, clean=True)
    print(f"  {dst.name}: {src.stat().st_size / 1e6:.1f} MB -> {dst.stat().st_size / 1e6:.1f} MB")


def render_svg(svg: Path, size: int) -> Image.Image:
    page = pymupdf.open(svg)[0]
    zoom = size / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=True)
    return Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGBA")


def on_background(icon: Image.Image, size: int, pad: float, bg=CREAM) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), bg + (255,))
    inner = round(size * (1 - 2 * pad))
    canvas.alpha_composite(icon.resize((inner, inner), Image.LANCZOS), ((size - inner) // 2,) * 2)
    return canvas.convert("RGB")


def main() -> None:
    IMG_OUT.mkdir(parents=True, exist_ok=True)
    (STATIC / "itinerari").mkdir(parents=True, exist_ok=True)
    (STATIC / "og").mkdir(parents=True, exist_ok=True)

    print("Itineraries")
    for slug, (src_name, public_name, cover_page, wide_page) in ITINERARIES.items():
        src = SRC / "pdf" / src_name
        compress_pdf(src, STATIC / "itinerari" / public_name)
        doc = pymupdf.open(src)
        cover = largest_image(doc, cover_page)
        wide = largest_image(doc, wide_page)
        save_webp(ImageOps.fit(cover, (cover.width, round(cover.width * 4 / 3))), f"{slug}-cover", [480, 800])
        save_webp(ImageOps.fit(wide, (wide.width, round(wide.width * 9 / 16))), f"{slug}-wide", [800, 1400, 2000])
        save_og(wide, STATIC / "og" / f"{slug}.jpg")

    print("Brand")
    hero = Image.open(SRC / "images" / "hero-bg.png").convert("RGB")
    save_webp(hero, "brand-banner", [900, 1600])
    # Default social card: banner centered on a canvas sampled from its own background colour.
    bg = hero.getpixel((hero.width // 2, 8))
    og = Image.new("RGB", (1200, 630), bg)
    scaled = hero.resize((1200, round(hero.height * 1200 / hero.width)), Image.LANCZOS)
    og.paste(scaled, (0, (630 - scaled.height) // 2))
    og.save(STATIC / "og" / "perdove.jpg", "JPEG", quality=85, optimize=True, progressive=True)

    logo = Image.open(SRC / "images" / "logo.jpg").convert("RGB")
    save_webp(logo, "logo", [320, 640], quality=80)
    logo.resize((512, 512), Image.LANCZOS).save(STATIC / "logo-perdove.png", optimize=True)

    print("Favicons")
    mark_svg = SRC / "brand" / "mark.svg"
    shutil.copy(mark_svg, STATIC / "favicon.svg")
    mark = render_svg(mark_svg, 1024)
    on_background(mark, 180, 0.1).save(STATIC / "apple-touch-icon.png", optimize=True)
    on_background(mark, 192, 0.12).save(STATIC / "icon-192.png", optimize=True)
    on_background(mark, 512, 0.12).save(STATIC / "icon-512.png", optimize=True)
    on_background(mark, 512, 0.2).save(STATIC / "icon-maskable-512.png", optimize=True)
    mark.resize((48, 48), Image.LANCZOS).save(STATIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    print("Done")


if __name__ == "__main__":
    main()
