#!/usr/bin/env python3
"""
Generate narrative ad scenes (1080x1920) — clear story arc:
  1. Kunde wartet     — customer messages, no reply
  2. Lead verloren    — hot lead cools, revenue lost
  3. Lösung           — AIONEX bot answers instantly
  4. (demo.webm)      — screen recording, built separately
  5. Ergebnis + CTA   — lead in inbox, price, URL
"""

import math
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont, ImageEnhance
except ImportError:
    import subprocess
    subprocess.check_call(["pip3", "install", "pillow", "-q"])
    from PIL import Image, ImageDraw, ImageFont, ImageEnhance

ROOT = Path(__file__).parent
ASSETS = ROOT / "assets"
SCENES = ASSETS / "scenes"
W, H = 1080, 1920

BG = (8, 9, 12)
CARD = (18, 20, 28)
GOLD = (201, 169, 98)
GOLD_L = (232, 213, 168)
TEAL = (74, 149, 149)
TEAL_L = (100, 190, 185)
RED = (220, 75, 75)
GREEN = (72, 175, 120)
WHITE = (240, 242, 245)
MUTED = (120, 128, 142)

LOGO = ROOT.parent.parent / "frontend" / "public" / "aionex-wordmark.png"


def font(size, bold=False):
    paths = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial.ttf",
    ]
    for p in paths:
        if Path(p).exists():
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()


def lerp(a, b, t):
    return int(a + (b - a) * max(0, min(1, t)))


def lerp_c(c1, c2, t):
    return tuple(lerp(c1[i], c2[i], t) for i in range(3))


def caption_bar(draw, text, sub=None, accent=GOLD):
    f = font(34, bold=True)
    sf = font(24)
    bbox = draw.textbbox((0, 0), text, font=f)
    tw = bbox[2] - bbox[0]
    y = 150
    draw.rounded_rectangle([60, y - 16, W - 60, y + 56 + (28 if sub else 0)], radius=18, fill=(12, 14, 20), outline=accent, width=2)
    draw.text(((W - tw) / 2, y), text, font=f, fill=WHITE)
    if sub:
        sb = draw.textbbox((0, 0), sub, font=sf)
        draw.text(((W - (sb[2] - sb[0])) / 2, y + 38), sub, font=sf, fill=MUTED)


def phone_shell(draw, cx, cy, pw=500, ph=880):
    x, y = cx - pw // 2, cy - ph // 2
    draw.rounded_rectangle([x - 12, y - 12, x + pw + 12, y + ph + 12], radius=44, fill=(30, 32, 40), outline=(70, 74, 86), width=3)
    draw.rounded_rectangle([x, y, x + pw, y + ph], radius=34, fill=(11, 12, 16))
    draw.rounded_rectangle([cx - 55, y + 6, cx + 55, y + 28], radius=12, fill=(11, 12, 16))
    return x, y, pw, ph


def chat_bubble(draw, x, y, w, h, side="left", read=False):
    col = (26, 30, 40) if side == "left" else (32, 36, 48)
    outline = TEAL if side == "right" else (50, 54, 64)
    draw.rounded_rectangle([x, y, x + w, y + h], radius=16, fill=col, outline=outline, width=2 if side == "right" else 1)
    if side == "right":
        checks = "✓✓" if read else "✓"
        draw.text((x + w - 36, y + h - 22), checks, font=font(16), fill=MUTED if not read else TEAL_L)


def scene_label(draw, step, title):
    draw.rounded_rectangle([40, H - 130, 140, H - 70], radius=12, fill=GOLD)
    draw.text((58, H - 118), step, font=font(28, bold=True), fill=BG)
    draw.text((160, H - 118), title, font=font(28, bold=True), fill=GOLD_L)


# ── Scene 1: Customer waits ─────────────────────────────────────────────
def scene1_customer_waits(i, n):
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    t = i / max(1, n - 1)

    caption_bar(draw, "Szene 1 · Das Problem", "Kunde schreibt — niemand antwortet")

    cx, cy = W // 2, H // 2 + 60
    sx, sy, sw, sh = phone_shell(draw, cx, cy)
    draw.text((sx + 24, sy + 44), f"{18 + int(t * 8):02d}:{int((t * 47) % 60):02d}", font=font(22, bold=True), fill=WHITE)

    msgs = [
        ("right", "Guten Tag! Interesse an Ihrem Angebot.", 0.0),
        ("right", "Können Sie mir einen Preis nennen?", 0.18),
        ("right", "Hallo, ist jemand da?", 0.42),
        ("right", "Ich warte schon seit Stunden…", 0.68),
    ]
    y0 = sy + 100
    for side, text, start in msgs:
        if t < start:
            continue
        slide = min(1, (t - start) / 0.12)
        mi = msgs.index((side, text, start))
        by = y0 + mi * 130 + int((1 - slide) * 40)
        lines = text.split()
        line1 = " ".join(lines[:4])
        line2 = " ".join(lines[4:]) if len(lines) > 4 else ""
        bw, bh = sw - 80, 72 if line2 else 52
        bx = sx + 40 if side == "right" else sx + 20
        if side == "right":
            bx = sx + sw - bw - 30
        chat_bubble(draw, bx, by, bw, bh, side, read=False)
        draw.text((bx + 16, by + 12), line1, font=font(22), fill=WHITE)
        if line2:
            draw.text((bx + 16, by + 36), line2, font=font(22), fill=WHITE)

    wait_h = int(6 + t * 14)
    draw.rounded_rectangle([sx + 30, sy + sh - 110, sx + sw - 30, sy + sh - 50], radius=14, fill=(40, 25, 25), outline=RED, width=2)
    draw.text((sx + 50, sy + sh - 98), f"Keine Antwort · {wait_h} Std.", font=font(24, bold=True), fill=RED)

    scene_label(draw, "1/5", "Kunde wartet")
    return img


# ── Scene 2: Lead lost ──────────────────────────────────────────────────
def scene2_lead_lost(i, n):
    img = Image.new("RGB", (W, H), (12, 10, 14))
    draw = ImageDraw.Draw(img)
    t = i / max(1, n - 1)

    caption_bar(draw, "Szene 2 · Die Folge", "Ohne Antwort verlieren Sie den Auftrag", accent=RED)

    card_w, card_h = 680, 420
    cx, cy = W // 2, H // 2 + 20
    x, y = cx - card_w // 2, cy - card_h // 2
    heat = max(0, 1 - t * 1.1)
    border = lerp_c(RED, BLUE_COLD := (80, 130, 190), t)
    draw.rounded_rectangle([x, y, x + card_w, y + card_h], radius=24, fill=CARD, outline=border, width=4)

    icon_r = 70
    icx, icy = cx, y + 100
    draw.ellipse([icx - icon_r, icy - icon_r, icx + icon_r, icy + icon_r], fill=lerp_c((180, 60, 50), (60, 90, 130), t))
    if heat > 0.4:
        draw.text((icx - 28, icy - 30), "HOT", font=font(28, bold=True), fill=WHITE)
    else:
        draw.text((icx - 24, icy - 30), "COLD", font=font(24, bold=True), fill=WHITE)

    status = "HEISSER LEAD" if heat > 0.5 else ("WIRD KALT…" if heat > 0.2 else "LEAD VERLOREN")
    col = lerp_c(RED, MUTED, 1 - heat)
    stf = font(38, bold=True)
    sb = draw.textbbox((0, 0), status, font=stf)
    draw.text((cx - (sb[2] - sb[0]) / 2, y + 190), status, font=stf, fill=col)

    draw.text((cx - 180, y + 260), "Interessent: Max M.", font=font(28), fill=WHITE)
    draw.text((cx - 180, y + 300), "Status: geht zur Konkurrenz", font=font(26), fill=MUTED)

    for j in range(4):
        ex = x + 80 + j * 140
        ey = y + 340 + int(t * 80)
        fade = max(0, 1 - t * 1.2 - j * 0.1)
        if fade <= 0:
            continue
        c = lerp_c(GOLD, (50, 50, 55), t)
        draw.ellipse([ex, ey, ex + 50, ey + 50], fill=c)
        draw.text((ex + 14, ey + 10), "€", font=font(26, bold=True), fill=BG)

    scene_label(draw, "2/5", "Umsatz weg")
    return ImageEnhance.Brightness(img).enhance(1.1)


# ── Scene 3: Solution — bot answers ───────────────────────────────────
def scene3_solution(i, n):
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    t = i / max(1, n - 1)

    caption_bar(draw, "Szene 3 · Die Lösung", "AIONEX KI-Chat antwortet sofort — 24/7", accent=TEAL)

    cx, cy = W // 2, H // 2 + 40
    sx, sy, sw, sh = phone_shell(draw, cx, cy)

    # Customer question
    chat_bubble(draw, sx + sw - 360, sy + 100, 320, 52, "right", read=True)
    draw.text((sx + sw - 344, sy + 114), "Was kostet ein Projekt?", font=font(24), fill=WHITE)

    # Bot answer appears progressively
    answer_lines = [
        "Gerne! Landing Pages ab 990 €,",
        "AI Chatbots ab 990 €, CRM ab",
        "1.990 €. Darf ich Sie zurückrufen?",
    ]
    visible_lines = int(t * 4) + 1
    bh = 30 + visible_lines * 34
    chat_bubble(draw, sx + 30, sy + 190, sw - 80, min(bh, 160), "left", read=True)
    draw.ellipse([sx + 44, sy + 204, sx + 84, sy + 244], fill=GOLD)
    draw.text((sx + 56, sy + 212), "AI", font=font(18, bold=True), fill=BG)
    for li, line in enumerate(answer_lines[: min(visible_lines, 3)]):
        draw.text((sx + 100, sy + 204 + li * 34), line, font=font(22), fill=WHITE)

    pulse = 0.5 + 0.5 * math.sin(i * 0.4)
    br = int(50 + pulse * 12)
    bx, by = sx + sw - 80, sy + sh - 100
    draw.ellipse([bx - br - 8, by - br - 8, bx + br + 8, by + br + 8], fill=(TEAL[0], TEAL[1], TEAL[2], 40))
    draw.ellipse([bx - br, by - br, bx + br, by + br], fill=(18, 20, 26), outline=GOLD, width=3)
    draw.text((bx - 14, by - 14), "AI", font=font(22, bold=True), fill=GOLD_L)

    elapsed = max(1, int(3 - t * 2.8))
    draw.rounded_rectangle([sx + 40, sy + sh - 170, sx + sw - 40, sy + sh - 120], radius=12, fill=(TEAL[0] // 6, TEAL[1] // 6, TEAL[2] // 6), outline=TEAL, width=2)
    draw.text((sx + 60, sy + sh - 158), f"Antwort in {elapsed} Sek.", font=font(26, bold=True), fill=TEAL_L)

    scene_label(draw, "3/5", "Sofort antworten")
    return img


# ── Scene 5: Result + CTA ─────────────────────────────────────────────
def scene5_result(i, n):
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    t = i / max(1, n - 1)

    caption_bar(draw, "Szene 5 · Das Ergebnis", "Lead erfasst — Bestätigung automatisch", accent=GREEN)

    # Email notification card
    card_w = 760
    x, y = (W - card_w) // 2, 380
    slide = min(1, t * 2)
    y += int((1 - slide) * 60)
    draw.rounded_rectangle([x, y, x + card_w, y + 280], radius=20, fill=CARD, outline=GREEN, width=3)
    draw.ellipse([x + 28, y + 28, x + 68, y + 68], fill=GREEN)
    draw.text((x + 38, y + 36), "@", font=font(28, bold=True), fill=WHITE)
    draw.text((x + 88, y + 32), "Neuer Lead!", font=font(32, bold=True), fill=GREEN)
    draw.text((x + 88, y + 72), "max@firma.de · +49 170 1234567", font=font(26), fill=WHITE)
    draw.text((x + 88, y + 112), "Anfrage: KI-Chatbot · Rückruf gewünscht", font=font(24), fill=MUTED)
    draw.rounded_rectangle([x + 28, y + 170, x + card_w - 28, y + 230], radius=12, fill=(20, 40, 30), outline=GREEN, width=1)
    draw.text((x + 44, y + 188), "Bestätigung an Kunde gesendet", font=font(24, bold=True), fill=GREEN)

    if LOGO.exists() and t > 0.25:
        logo = Image.open(LOGO).convert("RGBA")
        logo = logo.resize((380, int(380 * logo.height / logo.width)), Image.LANCZOS)
        img_rgba = img.convert("RGBA")
        img_rgba.paste(logo, ((W - logo.width) // 2, 720), logo)
        img = img_rgba.convert("RGB")
        draw = ImageDraw.Draw(img)

    alpha = min(1, (t - 0.3) * 2)
    if alpha > 0:
        cta_f = font(44, bold=True)
        lines = ["KI-Chatbot für Ihr Business", "ab €990 · aionex.de"]
        colors = [WHITE, GOLD]
        for li, (line, col) in enumerate(zip(lines, colors)):
            bb = draw.textbbox((0, 0), line, font=cta_f if li == 0 else font(50, bold=True))
            tw = bb[2] - bb[0]
            c = lerp_c(BG, col, alpha)
            draw.text(((W - tw) / 2, 980 + li * 60), line, font=cta_f if li == 0 else font(50, bold=True), fill=c)

    scene_label(draw, "5/5", "Mehr Leads")
    return img


SCENE_DEFS = [
    ("01-kunde-wartet", scene1_customer_waits, 75),
    ("02-lead-verloren", scene2_lead_lost, 45),
    ("03-loesung-bot", scene3_solution, 60),
    ("05-ergebnis-cta", scene5_result, 90),
]


def write_scene(name, renderer, count):
    out = SCENES / name
    out.mkdir(parents=True, exist_ok=True)
    for i in range(count):
        renderer(i, count).save(out / f"frame_{i:04d}.png", quality=92)
    print(f"  ✓ {name}: {count} frames")


if __name__ == "__main__":
    SCENES.mkdir(parents=True, exist_ok=True)
    print("Generating narrative scenes...")
    for name, fn, count in SCENE_DEFS:
        write_scene(name, fn, count)
    print("Done.")
