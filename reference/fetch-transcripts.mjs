#!/usr/bin/env node
//
// Fetch auto-generated transcripts from YouTube.
//
//   npm install            (once, in this directory)
//   npm run fetch          everything in talks.txt
//   node fetch-transcripts.mjs URL_OR_ID ...
//   node fetch-transcripts.mjs name=URL_OR_ID ...
//
// Options:
//   -o DIR   output directory        (default: transcripts)
//   -l LANG  preferred language      (default: en)
//   -i FILE  list file for no-arg    (default: talks.txt)
//   -f       refetch even if the output file already exists
//   -h       show this help
//
// Accepts full URLs (watch, youtu.be, live, shorts, embed) or bare 11-char IDs.
//
// Note: YouTube rate-limits bursts. Failed videos are retried with backoff;
// if one still fails, rerun later — finished files are skipped.

import { YoutubeTranscript } from 'youtube-transcript';
import { readFile, writeFile, mkdir, rename, unlink, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function usage() {
  const src = process.argv[1];
  return readFile(src, 'utf8').then((t) =>
    t.split('\n').slice(2, 21).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
}

/** Pull the video ID out of any common YouTube URL shape, or pass a bare ID through. */
export function extractId(s) {
  let id = s;
  const m =
    s.match(/[?&]v=([^&]+)/) ??
    s.match(/youtu\.be\/([^?&/]+)/) ??
    s.match(/\/(?:live|shorts|embed)\/([^?&/]+)/);
  if (m) id = m[1];
  id = id.split(/[?&/]/)[0];
  return id;
}

const exists = (p) => access(p).then(() => true, () => false);

/** Fetch one transcript, preferring `lang` but accepting whatever track exists. */
async function fetchTranscript(id, lang) {
  let segments, tag, fellBack = false;
  try {
    segments = await YoutubeTranscript.fetchTranscript(id, { lang });
    tag = segments[0]?.lang ?? lang;
  } catch (err) {
    if (!/No transcripts are available in/.test(err.message)) throw err;
    // The only track may be mislabelled — YouTube tags by detected language, and
    // a non-native speaker presenting in English often lands under their own
    // locale. Take whatever exists and record the tag in the file header.
    segments = await YoutubeTranscript.fetchTranscript(id);
    tag = segments[0]?.lang ?? 'unknown';
    fellBack = true;
  }
  return { segments, tag, fellBack };
}

const RATE_LIMITED = /too many requests|received a captcha|IP/i;

async function withRetry(fn, label, attempts = 4) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      const last = i === attempts - 1;
      if (last || !RATE_LIMITED.test(err.message)) throw err;
      const wait = 2 ** (i + 1) * 1000;
      console.error(`  rate-limited on ${label}, retrying in ${wait / 1000}s`);
      await sleep(wait);
    }
  }
}

/** Wrap to a readable width; auto-captions arrive as thousands of tiny fragments. */
function wrap(text, width = 96) {
  const out = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (line && line.length + word.length + 1 > width) { out.push(line); line = word; }
    else line = line ? `${line} ${word}` : word;
  }
  if (line) out.push(line);
  return out.join('\n');
}

function render({ segments, tag, fellBack }, id, requested) {
  const head = [
    `# source: https://www.youtube.com/watch?v=${id}`,
    `# caption track: ${tag}${fellBack ? `  (requested "${requested}" — not available)` : ''}`,
    `# fetched: ${new Date().toISOString().slice(0, 10)}  segments: ${segments.length}`,
  ];
  if (fellBack && tag !== requested) {
    head.push(
      `#`,
      `# WARNING: this track is tagged "${tag}", not "${requested}". If the speech is`,
      `# actually English, YouTube transcribed it with the wrong language model and`,
      `# names and technical terms will be badly mangled. Verify every specific.`,
    );
  }
  const body = segments.map((s) => s.text).join(' ').replace(/\s+/g, ' ').trim();
  return `${head.join('\n')}\n\n${wrap(body)}\n`;
}

async function fetchOne(name, raw, opts) {
  const id = extractId(raw);
  if (!/^[A-Za-z0-9_-]{11}$/.test(id)) {
    throw new Error(`not a YouTube ID or URL: ${raw}`);
  }
  const out = join(opts.outDir, `${name || id}.txt`);
  const label = name || id;

  if (!opts.force && (await exists(out))) {
    console.log(`skip   ${label}`);
    return;
  }

  console.log(`fetch  ${label.padEnd(26)} ${id}`);
  const result = await withRetry(() => fetchTranscript(id, opts.lang), label);

  // Write to a temp file so a failure leaves no truncated transcript.
  const part = `${out}.part`;
  try {
    await writeFile(part, render(result, id, opts.lang), 'utf8');
    await rename(part, out);
  } catch (err) {
    await unlink(part).catch(() => {});
    throw err;
  }
  if (result.fellBack) {
    console.log(`       ^ no "${opts.lang}" track; took "${result.tag}" — see the file header`);
  }
}

async function readList(file) {
  const text = await readFile(file, 'utf8').catch(() => {
    throw new Error(`no arguments and no ${file} to read`);
  });
  return text
    .split('\n')
    .map((l) => l.replace(/#.*$/, '').trim())
    .filter(Boolean)
    .map((l) => {
      const [name, ...rest] = l.split(/\s+/);
      return { name, raw: rest.join(' ') };
    });
}

function parseArgs(argv) {
  const opts = { outDir: 'transcripts', lang: 'en', listFile: 'talks.txt', force: false, help: false };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-o') opts.outDir = argv[++i];
    else if (a === '-l') opts.lang = argv[++i];
    else if (a === '-i') opts.listFile = argv[++i];
    else if (a === '-f') opts.force = true;
    else if (a === '-h' || a === '--help') opts.help = true;
    else rest.push(a);
  }
  return { opts, rest };
}

async function main() {
  process.chdir(HERE);
  const { opts, rest } = parseArgs(process.argv.slice(2));
  if (opts.help) return console.log(await usage());

  await mkdir(opts.outDir, { recursive: true });

  // "name=URL" only when the part before the first "=" is a plain filename;
  // a bare URL also contains "=" (watch?v=...).
  const jobs = rest.length
    ? rest.map((arg) => {
        const i = arg.indexOf('=');
        const prefix = i > 0 ? arg.slice(0, i) : '';
        return /^[A-Za-z0-9._-]+$/.test(prefix)
          ? { name: prefix, raw: arg.slice(i + 1) }
          : { name: '', raw: arg };
      })
    : await readList(opts.listFile);

  let failed = 0;
  for (const { name, raw } of jobs) {
    try {
      await fetchOne(name, raw, opts);
    } catch (err) {
      console.error(`FAILED ${name || raw}: ${err.message.replace(/\s+/g, ' ').slice(0, 160)}`);
      failed++;
    }
  }

  if (failed) {
    console.error(`\n${failed} failed. Rerun to retry just those — finished files are skipped.`);
    process.exitCode = 1;
  } else {
    console.log('done');
  }
}

main();
