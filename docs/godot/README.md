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

**Godot 4.7** (`decisions.md`, 2026-09-15). Policy is to track the latest stable, so
this moves; 4.8 is alpha and not in use.

A version-sensitive claim names the version its source targeted. Most of these
tutorials are 4.x-generic; BucketBrigade's is 4.7, so its use of `@abstract` — recent
enough that it won't exist in an older 4.x — is on-version for us.

## Articles

| File | Covers | Sources |
|---|---|---|
| `state-machines.md` | Three ways to build one, and what they trade | Bitlytic, Quilled, BucketBrigade |
| `scene-structure.md` | Node paths, scene-unique nodes, keeping components decoupled | Godotneers ×2 |
| `signals.md` | Connecting, custom signals, editor vs code | Recursive Dev, Godotneers |
| `data-models.md` | Separating data from nodes | Godotneers, BucketBrigade |
| `ui.md` | Containers, the sizing model, themes, and two project settings to set early | Godotneers |
| `shaders.md` | The pipeline, visual vs code, language gotchas | Godotneers |

Every Godot transcript fetched so far is written up.
