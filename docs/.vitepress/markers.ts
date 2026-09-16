import type MarkdownIt from 'markdown-it'

/**
 * Styles the inline markers used throughout the docs.
 *
 *   **?**  unanswered — a question, not a guess
 *   **!**  a note, objection, or something to revisit
 *
 * They appear in blockquotes, table cells and list items alike, so the marker
 * itself is tagged wherever it occurs; a blockquote that *opens* with one is
 * additionally tinted, since those carry the prose.
 *
 * The source stays plain markdown — greppable, and readable without the site.
 */
const MARKER: Record<string, string> = { '?': 'question', '!': 'note' }

export function markerPlugin(md: MarkdownIt): void {
  md.core.ruler.push('doc_markers', (state) => {
    const t = state.tokens
    for (let i = 0; i < t.length; i++) {
      // Tint a blockquote whose first inline content starts with a marker.
      if (t[i].type === 'blockquote_open') {
        const inline = t[i + 2]
        const m = inline?.type === 'inline' && inline.content.match(/^\*\*([?!])\*\*/)
        if (m) t[i].attrJoin('class', `doc-${MARKER[m[1]]}-block`)
      }

      // Tag every marker, wherever it sits.
      if (t[i].type !== 'inline') continue
      const kids = t[i].children ?? []
      for (let j = 0; j < kids.length - 2; j++) {
        if (kids[j].type !== 'strong_open') continue
        if (kids[j + 1].type !== 'text' || kids[j + 2].type !== 'strong_close') continue
        const kind = MARKER[kids[j + 1].content]
        if (kind) kids[j].attrJoin('class', `doc-marker doc-${kind}`)
      }
    }
    return true
  })
}
