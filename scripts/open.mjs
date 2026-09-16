#!/usr/bin/env node
//
// List every open marker across the docs.
//
//   > **?**  an open question — something undecided
//   > **!**  a note, objection, or something to revisit
//
//   npm run open          everything
//   npm run open -- '!'   just the notes
//
// The markers live in the markdown itself, so they travel with the text they're
// about and survive without the docs site.

import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const ROOT = new URL('../docs/', import.meta.url).pathname
const LABEL = { '?': 'open question', '!': 'note' }
const want = process.argv[2] && process.argv[2] in LABEL ? process.argv[2] : null

async function* markdown(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue
    const p = join(dir, e.name)
    if (e.isDirectory()) yield* markdown(p)
    else if (e.name.endsWith('.md')) yield p
  }
}

let total = 0
const counts = { '?': 0, '!': 0 }

for await (const file of markdown(ROOT)) {
  const lines = (await readFile(file, 'utf8')).split('\n')
  const hits = []
  lines.forEach((line, i) => {
    const m = line.match(/\*\*([?!])\*\*/)
    if (!m) return
    if (want && m[1] !== want) return
    // Show what follows the marker, with the leading blockquote/list/table
    // punctuation stripped so the three styles read alike.
    const text = line
      .slice(line.indexOf(m[0]) + m[0].length)
      .replace(/^[\s|>*-]+/, '')
      .replace(/\s*\|\s*$/, '')
      .trim()
    hits.push({ n: i + 1, kind: m[1], text })
    counts[m[1]]++
    total++
  })
  if (!hits.length) continue
  console.log(`\n\x1b[1m${relative(ROOT, file)}\x1b[0m`)
  for (const h of hits) {
    const tint = h.kind === '?' ? '\x1b[33m' : '\x1b[36m'
    const text = h.text.length > 96 ? h.text.slice(0, 95) + '…' : h.text
    console.log(`  ${tint}${h.kind}\x1b[0m ${String(h.n).padStart(4)}  ${text}`)
  }
}

console.log(
  total
    ? `\n${total} open — ${counts['?']} ${LABEL['?']}s, ${counts['!']} ${LABEL['!']}s`
    : 'nothing open',
)
