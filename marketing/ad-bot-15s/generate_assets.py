#!/usr/bin/env python3
"""Generate outro, demo overlays, and phone frame for ad assembly."""

from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    import subprocess
    subprocess.check_call(["pip3", "install", "pillow", "-q"])
    from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).parent
ASSETS = ROOT / "assets"
ASSETS.mkdir(exist_ok=True)

W, H = 1080, 1920
BG = (8, 9, 12)
GOLD = (201, 169, 98)
GOLD_LIGHT = (232, 213, 168)
TEAL = (74, 149, 149)
WHITE = (235, 238, 242)

LOGO_PATH = ROOT.parent.parent / "frontend" / "public" / "aionex-wordmark.png"


def load_font(size: int, bold: bool = False):
    for path in [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial.ttf",
    ]:
        if Path(path).exists():
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                pass
    return ImageFont.load_default()


def draw_centered_text(draw, lines, y_start, font, fill, spacing=16):
    y = y_start
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        tw = bbox[2] - bbox[0]
        draw.text(((W - tw) / 2, y), line, font=font, fill=fill)
        y += (bbox[3] - bbox[1]) + spacing
    return y


def create_outro_cta():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    for r, a in [(420, 12), (340, 20), (260, 35)]:
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        odraw = ImageDraw.Draw(overlay)
        odraw.ellipse([W // 2 - r, 380 - r // 2, W // 2 + r, 380 + r // 2 + r], fill=(TEAL[0], TEAL[1], TEAL[2], a))
        img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
        draw = ImageDraw.Draw(img)

    if LOGO_PATH.exists():
        logo = Image.open(LOGO_PATH).convert("RGBA")
        target_w = 460
        ratio = target_w / logo.width
        logo = logo.resize((target_w, int(logo.height * ratio)), Image.LANCZOS)
        img.paste(logo, ((W - logo.width) // 2, 360), logo)
        draw = ImageDraw.Draw(img)

    title_font = load_font(52, bold=True)
    price_font = load_font(62, bold=True)
    url_font = load_font(46)
    draw_centered_text(draw, ["KI-Chatbot für Ihr Business"], 700, title_font, WHITE, spacing=24)
    draw_centered_text(draw, ["ab €990"], 840, price_font, GOLD, spacing=20)
    draw_centered_text(draw, ["aionex.de"], 960, url_font, TEAL, spacing=20)
    draw.rectangle([100, 1100, W - 100, 1106], fill=GOLD)
    img.save(ASSETS / "outro-cta.png", quality=95)
    print("Created outro-cta.png")


def create_phone_frame():
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    pw, ph = 600, 1280
    cx, cy = W // 2, H // 2
    x, y = cx - pw // 2, cy - ph // 2
    draw.rounded_rectangle([x - 18, y - 18, x + pw + 18, y + ph + 18], radius=54, fill=(0, 0, 0, 0), outline=(201, 169, 98, 180), width=5)
    draw.rounded_rectangle([x - 8, y - 8, x + pw + 8, y + ph + 8], radius=44, outline=(74, 149, 149, 60), width=2)
    notch_w = 140
    draw.rounded_rectangle([cx - notch_w // 2, y + 4, cx + notch_w // 2, y + 30], radius=12, fill=(201, 169, 98, 40))
    img.save(ASSETS / "phone-frame.png")
    print("Created phone-frame.png")


def create_overlay_caption(text, filename, y=1560):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    font = load_font(40, bold=True)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    pad_x, pad_y = 36, 18
    bx = (W - tw) // 2 - pad_x
    by = y - pad_y
    draw.rounded_rectangle(
        [bx, by, bx + tw + pad_x * 2, by + th + pad_y * 2],
        radius=18,
        fill=(8, 9, 12, 210),
        outline=(201, 169, 98, 160),
        width=2,
    )
    draw.text(((W - tw) / 2, y), text, font=font, fill=GOLD_LIGHT)
    img.save(ASSETS / filename)
    print(f"Created {filename}")


if __name__ == "__main__":
    create_outro_cta()
    create_phone_frame()
    create_overlay_caption("Antwort in Sekunden — 24/7", "overlay-demo1.png")
    create_overlay_caption("Lead erfasst. Automatisch.", "overlay-demo2.png")
