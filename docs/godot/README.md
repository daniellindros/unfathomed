# Godot notes

**What we've learned about building things in Godot.** Compiled from the tutorials
in `reference/transcripts/godot/`, plus anything worked out while building.

**What doesn't go here:** anything the official manual already answers. Godot's docs
are live and queryable, and a local copy of them would just rot — Godot 3 to 4 broke
enough that stale notes are worse than none. This folder holds what the manual
doesn't: patterns, trade-offs between approaches, things that turned out not to work,
and rulings for this project.

**Not requirements.** Community tutorials are one person's approach, not the right
answer. `docs/decisions.md` stays binding; nothing here becomes a rule until it's a
dated line there.

## Tags

Every claim carries one:

- **`[docs]`** — checked against the official Godot documentation.
- **`[video]`** — stated in a tutorial, not verified here. The source is named.
- **`[ours]`** — a ruling for this project, with the reasoning.

## Version

**No Godot version is pinned yet.** Until one is, a version-sensitive claim names the
version its source targeted and nothing more. The tutorials here span at least
4.x-generic and 4.7, and at least one feature (`@abstract`) is recent enough that it
won't exist in an older 4.x.

## Articles

| File | Covers | Sources |
|---|---|---|
| `state-machines.md` | Three ways to build one, and what they trade | Bitlytic, Quilled, BucketBrigade |
| `scene-structure.md` | Node paths, scene-unique nodes, keeping components decoupled | Godotneers ×2 |
| `signals.md` | Connecting, custom signals, editor vs code | Recursive Dev, Godotneers |
| `data-models.md` | Separating data from nodes | Godotneers, BucketBrigade |

Not yet written up: `godotneers-ui-basics` (no UI in this game yet),
`godotneers-shaders-intro`. Both still in `reference/transcripts/godot/`.
