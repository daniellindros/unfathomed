#!/usr/bin/env bash
# Fetch auto-generated transcripts for Playdead's INSIDE talks.
# Run locally — YouTube blocks cloud/datacentre IPs.
#   pip install youtube-transcript-api
set -euo pipefail

cd "$(dirname "$0")"
mkdir -p transcripts

declare -A TALKS=(
  [game-that-listens]=Dnd74MQMQ-E
  [unbreaking-immersion-1]=1yzj2ZinN5M
  [unbreaking-immersion-2]=gRF8Gt5hys4
  [unbreaking-immersion-3]=TcSuVzUjmLw
  [turn-it-down-90-vfx]=vA3uFC2p8eo
  [rendering-gdce2016]=RdN06E6Xn9E
  [stutter-free-60fps]=mQ2KTRn4BMI
  [huddle-up]=gFkYjAKuUCE
  [subtleties-konsoll2017]=3pzgnN3pK_8
)

for name in "${!TALKS[@]}"; do
  out="transcripts/$name.txt"
  if [[ -f "$out" ]]; then
    echo "skip   $name"
    continue
  fi
  echo "fetch  $name (${TALKS[$name]})"
  youtube_transcript_api "${TALKS[$name]}" --format text > "$out"
done

echo "done"
