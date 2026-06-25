#!/usr/bin/env bash
# Export each ad scene as a separate MP4 + preview JPG for review
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
ASSETS="$DIR/assets"
SCENES="$ASSETS/scenes"
EXPORT="$DIR/scenes"
PREVIEW="$DIR/scenes/preview"
FPS=30
BG="0x08090c"

mkdir -p "$EXPORT" "$PREVIEW"

echo "→ Generating scene frames..."
python3 "$DIR/generate_scenes.py"
python3 "$DIR/generate_assets.py" 2>/dev/null || true

scene_from_frames() {
  local id="$1" name="$2" seconds="$3" extra_vf="${4:-}"
  local frames="$SCENES/$id"
  local out="$EXPORT/${id}.mp4"

  echo "→ Scene: $name (${seconds}s)"
  ffmpeg -y -hide_banner -loglevel error \
    -framerate "$FPS" -i "$frames/frame_%04d.png" \
    -vf "scale=1080:1920:flags=lanczos,format=yuv420p${extra_vf:+,${extra_vf}}" \
    -t "$seconds" -r "$FPS" -pix_fmt yuv420p "$out"

  ffmpeg -y -hide_banner -loglevel error \
    -ss "$(echo "$seconds / 2" | bc -l | xargs printf '%.1f')" \
    -i "$out" -frames:v 1 -vf "scale=540:-1" \
    "$PREVIEW/${id}.jpg"
  echo "   saved: $out"
}

echo ""
echo "═══ Exporting scenes separately ═══"
scene_from_frames "01-kunde-wartet"   "Kunde wartet (Problem)"     2.5 "zoompan=z='min(zoom+0.0006,1.06)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=75:s=1080x1920:fps=30"
scene_from_frames "02-lead-verloren"  "Lead verloren (Folge)"      1.5
scene_from_frames "03-loesung-bot"     "AIONEX Bot (Lösung)"        2.0

echo "→ Scene: 04-demo-chat (Screen recording)"
DEMO_OUT="$EXPORT/04-demo-chat.mp4"
if [ -f "$ASSETS/demo.webm" ]; then
  ffmpeg -y -hide_banner -loglevel error \
    -ss 1.5 -i "$ASSETS/demo.webm" -t 7.5 \
    -i "$ASSETS/phone-frame.png" \
    -filter_complex "\
[0:v]scale=900:1600:force_original_aspect_ratio=decrease,\
pad=900:1600:(ow-iw)/2:(oh-ih)/2:color=${BG},eq=contrast=1.05,\
pad=1080:1920:(1080-iw)/2:(1920-ih)/2:color=${BG}[v];\
[v][1:v]overlay=0:0[vout]" \
    -map "[vout]" -an -r "$FPS" -pix_fmt yuv420p "$DEMO_OUT"
  ffmpeg -y -hide_banner -loglevel error -ss 3 -i "$DEMO_OUT" -frames:v 1 -vf "scale=540:-1" "$PREVIEW/04-demo-chat.jpg"
  echo "   saved: $DEMO_OUT"
else
  echo "   ⚠ demo.webm missing — run: node record_demo.mjs"
fi

scene_from_frames "05-ergebnis-cta"   "Ergebnis + CTA"             3.0 "zoompan=z='min(zoom+0.0004,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=90:s=1080x1920:fps=30"

echo ""
echo "═══ Storyboard index ═══"
cat > "$EXPORT/STORY.md" <<'EOF'
# Ad Storyboard — 5 Szenen

| # | Datei | Geschichte | Dauer |
|---|-------|------------|-------|
| 1 | `01-kunde-wartet.mp4` | **Problem:** Kunde schreibt mehrfach — keine Antwort, Stunden vergehen | 2.5s |
| 2 | `02-lead-verloren.mp4` | **Folge:** Heißer Lead wird kalt, Umsatz geht verloren | 1.5s |
| 3 | `03-loesung-bot.mp4` | **Lösung:** AIONEX Bot antwortet in Sekunden mit Preisen | 2.0s |
| 4 | `04-demo-chat.mp4` | **Beweis:** Echter ChatWidget — Frage, Antwort, Lead erfasst | 7.5s |
| 5 | `05-ergebnis-cta.mp4` | **Ergebnis:** Lead in Inbox + Bestätigung + CTA ab €990 | 3.0s |

**Logik:** Problem → Folge → Lösung → Beweis → Ergebnis
EOF

echo "✓ All scenes in: $EXPORT/"
ls -lh "$EXPORT"/*.mp4 2>/dev/null || true
ls -lh "$PREVIEW"/*.jpg 2>/dev/null || true
