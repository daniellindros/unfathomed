#!/usr/bin/env bash
#
# Fetch auto-generated transcripts from YouTube.
#
# Run locally. YouTube blocks cloud/datacentre IPs, so this fails in CI and in
# remote Claude Code sessions.
#
#   pip install youtube-transcript-api
#
# Usage:
#   ./fetch-transcripts.sh                       fetch everything in talks.txt
#   ./fetch-transcripts.sh URL_OR_ID ...         fetch specific videos
#   ./fetch-transcripts.sh name=URL_OR_ID ...    choose the output filename
#
# Options:
#   -o DIR   output directory        (default: transcripts)
#   -l LANG  language code           (default: en)
#   -i FILE  list file for no-arg    (default: talks.txt)
#   -f       refetch even if the output file already exists
#   -h       show this help
#
# Accepts full URLs (watch, youtu.be, live, shorts, embed) or bare 11-char IDs.

set -euo pipefail

# Resolve our own path before cd, so usage() can still read this file.
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPT_PATH="$SCRIPT_DIR/$(basename "$0")"
cd "$SCRIPT_DIR"

OUT_DIR="transcripts"
LANG_CODE="en"
LIST_FILE="talks.txt"
FORCE=0

usage() {
  sed -n '3,21p' "$SCRIPT_PATH" | sed 's/^#\{1,\} \{0,1\}//'
}

die() { printf 'error: %s\n' "$1" >&2; exit 1; }

# Pull the video ID out of any common YouTube URL shape, or pass through a bare ID.
extract_id() {
  local s="$1" id
  case "$s" in
    *youtube.com/watch*v=*) id="${s#*v=}" ;;
    *youtu.be/*)            id="${s#*youtu.be/}" ;;
    *youtube.com/live/*)    id="${s#*/live/}" ;;
    *youtube.com/shorts/*)  id="${s#*/shorts/}" ;;
    *youtube.com/embed/*)   id="${s#*/embed/}" ;;
    *)                      id="$s" ;;
  esac
  id="${id%%[?&/]*}"
  printf '%s' "$id"
}

fetch_one() {
  local name="$1" raw="$2" id out
  id="$(extract_id "$raw")"

  case "$id" in
    *[!A-Za-z0-9_-]* | "") die "not a YouTube ID or URL: $raw" ;;
  esac
  [ "${#id}" -eq 11 ] || die "video ID should be 11 characters, got '${id}' from: $raw"

  [ -n "$name" ] || name="$id"
  out="$OUT_DIR/$name.txt"

  if [ -f "$out" ] && [ "$FORCE" -eq 0 ]; then
    printf 'skip   %s\n' "$name"
    return 0
  fi

  printf 'fetch  %-28s %s\n' "$name" "$id"
  # Write to a temp file so a failed fetch doesn't leave a truncated transcript.
  if youtube_transcript_api "$id" --languages "$LANG_CODE" --format text > "$out.part"; then
    mv "$out.part" "$out"
  else
    rm -f "$out.part"
    printf 'FAILED %s (%s)\n' "$name" "$id" >&2
    return 1
  fi
}

while getopts ':o:l:i:fh' opt; do
  case "$opt" in
    o) OUT_DIR="$OPTARG" ;;
    l) LANG_CODE="$OPTARG" ;;
    i) LIST_FILE="$OPTARG" ;;
    f) FORCE=1 ;;
    h) usage; exit 0 ;;
    :) die "-$OPTARG needs an argument" ;;
    \?) die "unknown option -$OPTARG (try -h)" ;;
  esac
done
shift $((OPTIND - 1))

command -v youtube_transcript_api >/dev/null 2>&1 \
  || die "youtube_transcript_api not found. pip install youtube-transcript-api"

mkdir -p "$OUT_DIR"

failed=0

if [ "$#" -gt 0 ]; then
  for arg in "$@"; do
    # "name=URL" only if the part before the first "=" is a plain filename.
    # A bare URL also contains "=" (watch?v=...), so require no : / ? in it.
    case "$arg" in
      *=*) prefix="${arg%%=*}" ;;
      *)   prefix="" ;;
    esac
    case "$prefix" in
      "" | *[!A-Za-z0-9._-]*) fetch_one "" "$arg" || failed=1 ;;
      *)                      fetch_one "$prefix" "${arg#*=}" || failed=1 ;;
    esac
  done
else
  [ -f "$LIST_FILE" ] || die "no arguments and no $LIST_FILE to read"
  while IFS= read -r line || [ -n "$line" ]; do
    line="${line%%#*}"
    # trim surrounding whitespace
    line="$(printf '%s' "$line" | tr -s '[:space:]' ' ')"
    line="${line# }"; line="${line% }"
    [ -n "$line" ] || continue
    fetch_one "${line%% *}" "${line#* }" || failed=1
  done < "$LIST_FILE"
fi

[ "$failed" -eq 0 ] || die "one or more transcripts failed"
echo "done"
