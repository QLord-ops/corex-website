# AIONEX AI Bot — 15s Ad (DE)

Vertical **1080×1920 (9:16)** · **15 seconds** · TikTok / Instagram Reels / Facebook Stories

## Concept

| Phase | Message |
|-------|---------|
| Pain | Kunden schreiben — Sie antworten erst morgen |
| Problem | Leads kalt, Umsatz weg |
| Solution | AIONEX KI-Chatbot antwortet in Sekunden, 24/7 |
| Result | Lead erfasst, Bestätigung automatisch |
| CTA | KI-Chatbot ab €990 · aionex.de |

---

## Timeline (v2 — visual pain + effects)

| Time | Visual | On-screen text | Audio |
|------|--------|----------------|-------|
| 0:00–0:02.5 | Animated phone: messages pile up, badge 47, clock ticks, red vignette | — (visual only) | Music fade in |
| 0:02.5–0:04 | Leads fall away, € fades, thermometer drops, cold particles | — (visual only) | — |
| 0:04–0:05 | Red flash → gold bot icon zoom (transition) | — | Whoosh (visual) |
| 0:05–0:11.4 | Screen demo: ChatWidget in phone frame, pricing + lead | Antwort in Sekunden — 24/7 · Lead erfasst. Automatisch. | Full music |
| 0:11.4–0:15 | AIONEX logo + CTA (slow zoom) | KI-Chatbot für Ihr Business · ab €990 · aionex.de | Music fade out |

**Effects:** Ken Burns zoom, shake, crossfade (fadeblack / wipeleft / circleopen), vignette, gold phone frame.

**Music:** SoundHelix Song 8 (CC BY 4.0) — `assets/music-bg.mp3`

---

## Screen demo script (ChatWidget)

Run at `http://localhost:3000/de` in viewport **390×844**.

1. Page loads — chat launcher visible (bottom-right)
2. Tap launcher — chat opens
3. Tap quick starter: **Was kostet ein Projekt?**
4. Wait for bot streaming response (pricing ranges)
5. Type: `Ja, bitte Rückruf. max@firma.de, +49 170 1234567`
6. Send — wait for bot reply
7. Close chat — confirmation notice appears briefly

---

## Social captions (DE)

**Primary caption:**
> Kunden warten stundenlang auf Antworten? Unser KI-Chatbot antwortet in Sekunden — 24/7, sammelt Leads und sendet Bestätigungen automatisch. Ab €990. Link in Bio.

**Short (Stories):**
> KI-Chatbot 24/7 · Antwort in Sekunden · ab €990

**Hashtags:**
`#KI #Chatbot #Automatisierung #B2B #Startup #Mittelstand #AIONEX #Digitalisierung #Kundenservice`

---

## Export specs

- File: `ad-bot-15s-de.mp4`
- Resolution: 1080×1920
- Duration: 15s
- Codec: H.264, yuv420p
- FPS: 30
- No watermark

---

## Production files

| File | Purpose |
|------|---------|
| `SCRIPT.md` | This script + social captions |
| `STORYBOARD.md` | Frame-by-frame storyboard |
| `generate_pain_animation.py` | Animated pain/problem/transition frame sequences |
| `record_demo.mjs` | Playwright screen recording (390×844) |
| `assemble.sh` | ffmpeg pipeline → final MP4 |
| `ad-bot-15s-de.srt` | Subtitle reference (timings) |
| `assets/intro-pain.png` | Hook card 0–2s |
| `assets/intro-problem.png` | Problem card 2–3s |
| `assets/intro-transition.png` | Transition 3–4s |
| `assets/demo.webm` | Raw ChatWidget screen recording |
| `assets/outro-cta.png` | CTA card 11–15s |
| `ad-bot-15s-de.mp4` | **Final export** — ready for TikTok / Reels / Stories |

### Rebuild

```bash
cd marketing/ad-bot-15s
python3 generate_assets.py
# Ensure frontend (:3000) + backend (:8000) are running
npm install && node record_demo.mjs
./assemble.sh
```
