#!/usr/bin/env bash
# Premium 15s AIONEX ad: animated pain visuals + effects + royalty-free music
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
ASSETS="$DIR/assets"
BUILD="$DIR/build"
OUT="$DIR/ad-bot-15s-de.mp4"
FPS=30
BG="0x08090c"
XFD=0.35

rm -rf "$BUILD"
mkdir -p "$BUILD"

echo "→ Generating visual assets..."
python3 "$DIR/generate_pain_animation.py"
python3 "$DIR/generate_assets.py"

echo "→ Downloading background music (SoundHelix, CC BY)..."
MUSIC_SRC="$ASSETS/music-bg.mp3"
if [ ! -f "$MUSIC_SRC" ]; then
  curl -fsSL -o "$MUSIC_SRC" "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
fi

ffmpeg -y -hide_banner -loglevel error \
  -ss 45 -i "$MUSIC_SRC" -t 16 \
  -af "highpass=f=120,lowpass=f=12000,volume=0.42,afade=t=in:st=0:d=1.2,afade=t=out:st=12.5:d=3.5" \
  "$BUILD/music.wav"

echo "→ Pain sequence (2.5s, zoom + shake)..."
ffmpeg -y -hide_banner -loglevel error \
  -framerate "$FPS" -i "$ASSETS/pain/frame_%04d.png" \
  -vf "scale=1080:1920:flags=lanczos,format=yuv420p,zoompan=z='min(zoom+0.0008,1.12)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=75:s=1080x1920:fps=$FPS" \
  -t 2.5 -r "$FPS" -pix_fmt yuv420p "$BUILD/pain.mp4"

echo "→ Problem sequence (1.5s)..."
ffmpeg -y -hide_banner -loglevel error \
  -framerate "$FPS" -i "$ASSETS/problem/frame_%04d.png" \
  -vf "scale=1080:1920:flags=lanczos,format=yuv420p,eq=contrast=1.08:saturation=1.1" \
  -t 1.5 -r "$FPS" -pix_fmt yuv420p "$BUILD/problem.mp4"

echo "→ Transition (1s, flash to bot)..."
ffmpeg -y -hide_banner -loglevel error \
  -framerate "$FPS" -i "$ASSETS/transition/frame_%04d.png" \
  -vf "scale=1080:1920:flags=lanczos,format=yuv420p" \
  -t 1.0 -r "$FPS" -pix_fmt yuv420p "$BUILD/transition.mp4"

echo "→ Screen demo (7.4s, phone frame + glow)..."
ffmpeg -y -hide_banner -loglevel error \
  -ss 2.0 -i "$ASSETS/demo.webm" -t 7.4 \
  -i "$ASSETS/phone-frame.png" \
  -filter_complex "\
[0:v]scale=900:1600:force_original_aspect_ratio=decrease,\
pad=900:1600:(ow-iw)/2:(oh-ih)/2:color=${BG},\
eq=brightness=0.03:contrast=1.06:saturation=1.08,\
vignette=PI/5,\
pad=1080:1920:(1080-iw)/2:(1920-ih)/2:color=${BG}[padded];\
[padded][1:v]overlay=0:0:format=auto[vout]" \
  -map "[vout]" -an -r "$FPS" -pix_fmt yuv420p "$BUILD/demo.mp4"

echo "→ Outro (4s, slow zoom)..."
ffmpeg -y -hide_banner -loglevel error \
  -loop 1 -i "$ASSETS/outro-cta.png" -t 4.0 \
  -vf "scale=1080:1920:flags=lanczos,format=yuv420p,\
zoompan=z='min(zoom+0.0006,1.08)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=120:s=1080x1920:fps=$FPS" \
  -r "$FPS" -pix_fmt yuv420p "$BUILD/outro.mp4"

echo "→ Crossfade montage..."
# Durations: 2.5 + 1.5 + 1 + 7.4 + 4 = 16.4; minus 4*0.35 = 15.0
O1=$(echo "2.5 - $XFD" | bc)
O2=$(echo "2.5 + 1.5 - $XFD - $XFD" | bc)
O3=$(echo "2.5 + 1.5 + 1 - 2*$XFD - $XFD" | bc)
O4=$(echo "2.5 + 1.5 + 1 + 7.4 - 3*$XFD - $XFD" | bc)

ffmpeg -y -hide_banner -loglevel error \
  -i "$BUILD/pain.mp4" \
  -i "$BUILD/problem.mp4" \
  -i "$BUILD/transition.mp4" \
  -i "$BUILD/demo.mp4" \
  -i "$BUILD/outro.mp4" \
  -filter_complex "\
[0:v][1:v]xfade=transition=fadeblack:duration=${XFD}:offset=${O1}[v01];\
[v01][2:v]xfade=transition=wipeleft:duration=${XFD}:offset=${O2}[v02];\
[v02][3:v]xfade=transition=circleopen:duration=${XFD}:offset=${O3}[v03];\
[v03][4:v]xfade=transition=fade:duration=${XFD}:offset=${O4}[vout]" \
  -map "[vout]" -t 15 -r "$FPS" -pix_fmt yuv420p "$BUILD/montage.mp4"

echo "→ Caption overlays + music mix..."
ffmpeg -y -hide_banner -loglevel warning \
  -i "$BUILD/montage.mp4" \
  -i "$ASSETS/overlay-demo1.png" \
  -i "$ASSETS/overlay-demo2.png" \
  -i "$BUILD/music.wav" \
  -filter_complex "\
[0:v][1:v]overlay=0:0:enable='between(t,4.0,10.0)'[v1];\
[v1][2:v]overlay=0:0:enable='between(t,10.0,11.0)'[v2];\
[v2]fade=t=in:st=0:d=0.3,fade=t=out:st=14.2:d=0.8[vout];\
[3:a]volume=0.9[aout]" \
  -map "[vout]" -map "[aout]" \
  -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -ar 44100 \
  -t 15 -r "$FPS" \
  "$OUT"

echo "✓ Done: $OUT"
ffprobe -v error -show_entries format=duration,size -show_entries stream=width,height,codec_name -of default=noprint_wrappers=1 "$OUT"
