import { defineConfig } from 'vitepress'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const DOCS = join(import.meta.dirname, '..')

/** First `# heading` of a file, falling back to a tidied filename. */
function titleOf(dir: string, file: string): string {
  const first = readFileSync(join(DOCS, dir, file), 'utf8')
    .split('\n')
    .find((l) => l.startsWith('# '))
  if (first) return first.slice(2).trim()
  return file.replace(/\.md$/, '').replace(/-/g, ' ')
}

/**
 * Build a sidebar group by reading the directory, so adding a note is enough —
 * nothing here needs editing when files come and go.
 */
function group(dir: string, text: string) {
  const files = readdirSync(join(DOCS, dir))
    .filter((f) => f.endsWith('.md'))
    // README first, then alphabetical.
    .sort((a, b) => (a === 'README.md' ? -1 : b === 'README.md' ? 1 : a.localeCompare(b)))
  return {
    text,
    collapsed: false,
    items: files.map((f) => ({
      text: titleOf(dir, f),
      link: `/${dir}/${f.replace(/\.md$/, '')}`,
    })),
  }
}

export default defineConfig({
  title: 'Unfathomed',
  description: 'Project notes — design, decisions, and research.',
  srcExclude: ['**/node_modules/**'],
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    search: { provider: 'local' },
    outline: { level: [2, 3] },
    nav: [
      { text: 'Design', link: '/design' },
      { text: 'Decisions', link: '/decisions' },
      { text: 'INSIDE', link: '/inside/README' },
      { text: 'Godot', link: '/godot/README' },
    ],
    sidebar: [
      {
        text: 'The game',
        collapsed: false,
        items: [
          { text: 'Design', link: '/design' },
          { text: 'Decisions', link: '/decisions' },
        ],
      },
      group('inside', 'INSIDE reference'),
      group('godot', 'Godot notes'),
      group('answers', 'Answers'),
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/daniellindros/unfathomed' },
    ],
  },
})
