#!/usr/bin/env python3
"""Generate animated pain/problem/transition frame sequences (visual, minimal text)."""

import math
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance
except ImportError:
    import subprocess
    subprocess.check_call(["pip3", "install", "pillow", "-q"])
    from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance

ROOT = Path(__file__).parent
ASSETS = ROOT / "assets"
W, H = 1080, 1920

BG = (8, 9, 12)
BG2 = (14, 16, 22)
GOLD = (201, 169, 98)
GOLD_LIGHT = (232, 213, 168)
TEAL = (74, 149, 149)
TEAL_GLOW = (90, 180, 175)
RED = (220, 70, 70)
RED_DARK = (120, 30, 35)
WHITE = (240, 242, 245)
MUTED = (110, 118, 130)
GREEN = (76, 175, 120)
BLUE_COLD = (80, 130, 190)


def load_font(size: int, bold: bool = False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()


def lerp(a, b, t):
    return int(a + (b - a) * max(0, min(1, t)))


def lerp_color(c1, c2, t):
    return tuple(lerp(c1[i], c2[i], t) for i in range(3))


def add_vignette(img, strength=0.55, red_tint=0.0):
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    cx, cy = W // 2, H // 2
    max_r = math.hypot(cx, cy)
    for step in range(0, 100, 4):
        r = max_r * (step / 100)
        alpha = int(255 * strength * (step / 100) ** 1.6)
        tint = (lerp(0, RED[0], red_tint), lerp(0, 20, red_tint), lerp(0, 30, red_tint), alpha)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=tint)
    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")


def draw_phone(draw, cx, cy, pw, ph, shake_x=0):
    x = cx - pw // 2 + shake_x
    y = cy - ph // 2
    draw.rounded_rectangle([x - 14, y - 14, x + pw + 14, y + ph + 14], radius=48, fill=(28, 30, 38), outline=(55, 58, 68), width=3)
    draw.rounded_rectangle([x, y, x + pw, y + ph], radius=36, fill=(12, 13, 18))
    notch_w, notch_h = 120, 28
    draw.rounded_rectangle([cx - notch_w // 2, y + 8, cx + notch_w // 2, y + 8 + notch_h], radius=14, fill=(12, 13, 18))
    return x, y, pw, ph


def draw_status_bar(draw, x, y, pw, hour, minute, badge):
    font = load_font(22, bold=True)
    draw.text((x + 24, y + 44), f"{hour:02d}:{minute:02d}", font=font, fill=WHITE)
    draw.text((x + pw - 90, y + 44), "●●●", font=font, fill=MUTED)
    if badge > 0:
        bw = max(44, 18 + len(str(badge)) * 12)
        bx, by = x + pw - bw - 20, y + 78
        draw.rounded_rectangle([bx, by, bx + bw, by + 34], radius=17, fill=RED)
        draw.text((bx + 10, by + 4), str(badge), font=font, fill=WHITE)


def draw_message_bubble(draw, bx, by, bw, bh, color, align="left", unread=False):
    draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=18, fill=color, outline=(50, 54, 64) if align == "left" else None)
    if unread:
        draw.ellipse([bx + bw - 16, by + 8, bx + bw - 4, by + 20], fill=RED)


def draw_avatar(draw, ax, ay, color, letter):
    draw.ellipse([ax, ay, ax + 44, ay + 44], fill=color)
    font = load_font(20, bold=True)
    bbox = draw.textbbox((0, 0), letter, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text((ax + (44 - tw) / 2, ay + (44 - th) / 2 - 2), letter, font=font, fill=WHITE)


def render_pain_frame(frame_idx, total_frames):
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    t = frame_idx / max(1, total_frames - 1)

    shake = int(math.sin(frame_idx * 0.9) * 6 * t) if t > 0.5 else 0
    cx, cy = W // 2, H // 2 - 40
    pw, ph = 520, 920
    sx, sy, sw, sh = draw_phone(draw, cx, cy, pw, ph, shake)

    hour = 18 + int(t * 10)
    minute = int((t * 60 * 3) % 60)
    badge = min(47, int(t * 47) + (1 if frame_idx > 5 else 0))
    draw_status_bar(draw, sx, sy, sw, hour, minute, badge)

    customers = [
        ("M", (180, 100, 120), "Anfrage: Preis?"),
        ("K", (90, 130, 160), "Noch jemand da?"),
        ("S", (160, 120, 90), "Rückruf bitte!"),
        ("L", (120, 160, 110), "Interesse an Bot"),
        ("T", (140, 110, 170), "Termin möglich?"),
        ("A", (170, 140, 100), "Hallo??"),
        ("P", (100, 150, 140), "Dringend!"),
        ("J", (150, 100, 130), "Warten seit 2h"),
    ]
    visible = min(len(customers), 2 + int(t * 7))
    y_msg = sy + 130
    for i in range(visible):
        letter, col, _ = customers[i]
        slide = max(0, min(1, (t * 8) - i + 0.2))
        if slide <= 0:
            continue
        offset_y = int((1 - slide) * 80)
        ax = sx + 20
        ay = y_msg + offset_y + i * 92
        draw_avatar(draw, ax, ay, col, letter)
        bw = sw - 90
        bh = 58
        draw_message_bubble(draw, ax + 54, ay + 4, bw, bh, (28, 32, 42), unread=i >= 2)
        draw.rounded_rectangle([ax + 70, ay + 18, ax + 70 + min(bw - 40, 220 + i * 18), ay + 30], radius=4, fill=(55, 60, 72))
        draw.rounded_rectangle([ax + 70, ay + 36, ax + 70 + min(bw - 80, 140), ay + 46], radius=4, fill=(45, 50, 60))

    if t > 0.35:
        typing_y = sy + 130 + visible * 92 + 10
        dots = "." * (1 + (frame_idx // 8) % 3)
        draw.rounded_rectangle([sx + 20, typing_y, sx + sw - 20, typing_y + 52], radius=16, fill=(24, 28, 36))
        font = load_font(28, bold=True)
        draw.text((sx + 40, typing_y + 10), dots, font=font, fill=MUTED)

    clock_cx, clock_cy = sx + sw - 70, sy + sh - 90
    draw.ellipse([clock_cx - 34, clock_cy - 34, clock_cx + 34, clock_cy + 34], outline=RED, width=4)
    ang = -math.pi / 2 + t * math.pi * 1.5
    draw.line([clock_cx, clock_cy, clock_cx + int(22 * math.cos(ang)), clock_cy + int(22 * math.sin(ang))], fill=RED, width=4)

    img = add_vignette(img, strength=0.35 + t * 0.35, red_tint=t * 0.6)
    return img


def render_problem_frame(frame_idx, total_frames):
    img = Image.new("RGB", (W, H), BG2)
    draw = ImageDraw.Draw(img)
    t = frame_idx / max(1, total_frames - 1)

    # subtle grid
    for gx in range(0, W, 80):
        draw.line([(gx, 200), (gx, 1300)], fill=(22, 24, 32), width=1)
    for gy in range(200, 1300, 80):
        draw.line([(120, gy), (W - 120, gy)], fill=(22, 24, 32), width=1)

    funnel_top, funnel_bot = 260, 500
    draw.polygon([(W // 2, funnel_top), (200, funnel_bot), (W - 200, funnel_bot)], outline=GOLD, fill=(20, 22, 30))

    for i in range(5):
        px = 190 + i * 175
        py = 620 + int(t * 120)
        fade = max(0, 1 - t * 1.2 - i * 0.05)
        if fade <= 0:
            continue
        col = lerp_color(GOLD, BLUE_COLD, t)
        col = tuple(int(c * fade) for c in col)
        draw.rounded_rectangle([px, py, px + 90, py + 110], radius=14, fill=(22, 25, 32), outline=col, width=3)
        draw.ellipse([px + 20, py + 16, px + 70, py + 58], fill=col)
        draw.rounded_rectangle([px + 12, py + 72, px + 78, py + 86], radius=4, fill=col)
        draw.rounded_rectangle([px + 12, py + 92, px + 58, py + 100], radius=4, fill=col)

    for i in range(6):
        ex = 160 + i * 140 + int(math.sin(frame_idx * 0.2 + i) * 8)
        ey = 980 + int(t * 200)
        alpha_f = max(0, 1 - t * 1.3 - i * 0.08)
        if alpha_f <= 0:
            continue
        col = lerp_color(GOLD, (60, 60, 70), t)
        draw.ellipse([ex, ey, ex + 56, ey + 56], fill=col, outline=(80, 70, 50))
        font = load_font(30, bold=True)
        draw.text((ex + 16, ey + 10), "€", font=font, fill=(20, 20, 24))

    bar_x, bar_y, bar_w, bar_h = W // 2 - 30, 1180, 60, 260
    draw.rounded_rectangle([bar_x - 8, bar_y, bar_x + bar_w + 8, bar_y + bar_h], radius=12, fill=(30, 32, 40), outline=(60, 64, 74))
    fill_h = int(bar_h * (1 - t * 0.85))
    temp_col = lerp_color(RED, BLUE_COLD, t)
    draw.rounded_rectangle([bar_x, bar_y + bar_h - fill_h, bar_x + bar_w, bar_y + bar_h], radius=8, fill=temp_col)

    for i in range(int(t * 18)):
        sx = 120 + (i * 97 + frame_idx * 13) % (W - 240)
        sy = 1050 + (i * 53) % 300
        draw.ellipse([sx, sy, sx + 8, sy + 8], fill=lerp_color(WHITE, BLUE_COLD, t))

    img = add_vignette(img, strength=0.25, red_tint=t * 0.25)
    img = ImageEnhance.Brightness(img).enhance(1.15)
    return img


def render_transition_frame(frame_idx, total_frames):
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    t = frame_idx / max(1, total_frames - 1)

    if t < 0.35:
        flash = int(255 * (1 - t / 0.35))
        overlay = Image.new("RGBA", (W, H), (RED[0], RED[1], RED[2], flash))
        img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
        draw = ImageDraw.Draw(img)

    scale = 0.2 + t * 1.1
    r = int(90 * scale)
    cx, cy = W // 2, H // 2
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for gr, a in [(r + 80, 30), (r + 50, 50), (r + 20, 80)]:
        gdraw.ellipse([cx - gr, cy - gr, cx + gr, cy + gr], fill=(TEAL[0], TEAL[1], TEAL[2], a))
    img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
    draw = ImageDraw.Draw(img)

    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(18, 20, 26), outline=GOLD, width=4)
    bot_r = max(28, int(r * 0.45))
    draw.rounded_rectangle([cx - bot_r, cy - bot_r - 10, cx + bot_r, cy + bot_r + 20], radius=12, fill=(22, 24, 30), outline=GOLD_LIGHT, width=2)
    eye_size = max(8, bot_r // 3)
    draw.ellipse([cx - bot_r + 8, cy - bot_r - 2, cx - bot_r + 8 + eye_size, cy - bot_r - 2 + eye_size], fill=TEAL_GLOW)
    draw.ellipse([cx + bot_r - 8 - eye_size, cy - bot_r - 2, cx + bot_r - 8, cy - bot_r - 2 + eye_size], fill=TEAL_GLOW)
    mouth_w = max(12, bot_r - 10)
    draw.rounded_rectangle([cx - mouth_w // 2, cy - 4, cx + mouth_w // 2, cy + 14], radius=6, fill=(40, 44, 52))

    sweep_x = int(-200 + t * (W + 400))
    sweep = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(sweep)
    sdraw.rectangle([sweep_x, 0, sweep_x + 120, H], fill=(232, 213, 168, int(80 * (1 - abs(t - 0.5) * 2))))
    img = Image.alpha_composite(img.convert("RGBA"), sweep).convert("RGB")
    return img


def write_sequence(name, renderer, count):
    out_dir = ASSETS / name
    out_dir.mkdir(parents=True, exist_ok=True)
    for i in range(count):
        frame = renderer(i, count)
        frame.save(out_dir / f"frame_{i:04d}.png", quality=92)
    print(f"Created {count} frames in {name}/")


if __name__ == "__main__":
    write_sequence("pain", render_pain_frame, 75)
    write_sequence("problem", render_problem_frame, 45)
    write_sequence("transition", render_transition_frame, 30)
