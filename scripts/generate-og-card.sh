#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
output_path="$root_dir/assets/og-card.png"

mkdir -p "$root_dir/assets"

convert -size 1200x630 xc:'#080d14' \
  -fill '#0d151f' -draw 'roundrectangle 54,54 1146,576 28,28' \
  -fill '#ff7a1a' -draw 'roundrectangle 54,54 68,576 7,7' \
  -fill '#141f2c' -draw 'circle 973,315 973,182' \
  -stroke '#ff7a1a' -strokewidth 3 -fill none -draw 'circle 973,315 973,182' \
  -stroke none -fill '#ff7a1a' -draw 'circle 1098,188 1098,180' \
  -fill '#ff7a1a' -font DejaVu-Sans-Bold -pointsize 27 -gravity northwest -annotate +108+112 'AI ENGINEER  /  PORTFOLIO' \
  -fill '#f6f3ee' -font DejaVu-Sans-Bold -pointsize 72 -gravity northwest -annotate +102+205 'Mike Eliovits' \
  -fill '#9eabb9' -font DejaVu-Sans -pointsize 31 -gravity northwest -annotate +108+322 'Practical AI systems. Reliable engineering.' \
  -fill '#ffb276' -font DejaVu-Sans -pointsize 21 -gravity northwest -annotate +108+430 'LLM Applications   /   NLP   /   Computer Vision   /   Backend AI' \
  -fill '#ff7a1a' -font DejaVu-Sans-Bold -pointsize 78 -gravity center -annotate +373+1 'ME' \
  -fill '#647283' -font DejaVu-Sans -pointsize 18 -gravity southwest -annotate +108+88 'mike-elio.github.io' \
  -define png:compression-level=9 \
  "$output_path"

identify -format '%wx%h\n' "$output_path"
