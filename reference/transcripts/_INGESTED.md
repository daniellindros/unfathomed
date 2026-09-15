# Source register

Every transcript in this folder, and whether anything has been made of it yet.

**Used** means claims from it have been written into a `docs/` article with tags.
Not-yet-used is the normal state; it is not a backlog you owe anything to.

Raw files are never edited. If a transcript is wrong, the correction goes in the
article that cites it, not here.

---

## Playdead talks → `docs/inside-reference.md`

| File | Talk | Used? |
|---|---|---|
| `subtleties-konsoll2017.txt` | Subtleties of INSIDE (Konsoll 2017, Fasterholdt) | **Yes** — §9, almost entirely |
| `game-that-listens.txt` | Inside: A Game That Listens (GDC 2016, Andersen) | **Yes** — §11 rewritten from it |
| `rendering-gdce2016.txt` | Low Complexity, High Fidelity: The Rendering of INSIDE (GDCE 2016) | No — §7 is from slides only |
| `turn-it-down-90-vfx.txt` | Turn It Down 90% — INSIDE VFX (Control 2016) | No — §8 is from slides only |
| `huddle-up.txt` | Huddle up! Making the [SPOILER] of INSIDE (GDC 2017) | No |
| `stutter-free-60fps.txt` | Stutter Free 60 FPS (Unite 2016) | No |
| `unbreaking-immersion-2.txt` | Wwise Tour 2016 — Voice (2 of 3) | No |
| `unbreaking-immersion-3.txt` | Wwise Tour 2016 — Scene Change (3 of 3) | No |

Not fetchable: **Unbreaking Immersion part 1** (`1yzj2ZinN5M`) has captions
disabled. Confirmed — it failed while later videos in the same run succeeded.

## Godot tutorials → `docs/godot/`

Community tutorials. Not official documentation, not authoritative over
`docs/decisions.md`, and version-sensitive in a way the Playdead talks are not.

| File | Video | Author | Used? |
|---|---|---|---|
| `godot/bitlytic-state-machines.txt` | Finite State Machines in Godot 4 in Under 10 Minutes | Bitlytic | Yes — `state-machines.md` |
| `godot/quilled-state-machines.txt` | How to Make State Machines FAST | Quilled | Yes — `state-machines.md` |
| `godot/bucketbrigade-state-machines.txt` | The State Machine Video Of All Time (Godot 4.7) | BucketBrigade | Yes — `state-machines.md` |
| `godot/godotneers-node-paths.txt` | Node paths — find any node in your scene | Godotneers | Yes — `scene-structure.md` |
| `godot/godotneers-components.txt` | Godot Components — structuring a game | Godotneers | Yes — `scene-structure.md` |
| `godot/godotneers-data-models.txt` | Data models — extensible, maintainable games | Godotneers | Yes — `data-models.md` |
| `godot/recursivedev-signals.txt` | The basics of signals in Godot | Recursive Dev | Yes — `signals.md` |
| `godot/godotneers-ui-basics.txt` | Godot UI Basics | Godotneers | No — no UI in this game yet |
| `godot/godotneers-shaders-intro.txt` | Welcome to Shaderland | Godotneers | No |

---

## Caption quality

Auto-captions, so names and numbers are unreliable everywhere. Two are worse:

- **`game-that-listens.txt`** — YouTube serves only a Danish-tagged track for a
  Dane speaking English, so it was transcribed with the wrong speech model.
  "Jakob Schmid" comes out as "job Smith", "Wwise" as "Wise". Nothing specific in
  it survives without checking the slides. The file header says so too.
- **Godotneers videos** — the presenter's "hello Godotneers" is variously
  transcribed "hello goners", "hello Golden Ears", "hello girl Denise". Harmless,
  but a fair warning about what happens to technical terms.

## Adding more

Queues are `reference/talks.txt` (Playdead) and `reference/godot-videos.txt`
(Godot). Then:

```
cd reference && npm install
node fetch-transcripts.mjs                                     # Playdead
node fetch-transcripts.mjs -i godot-videos.txt -o transcripts/godot
```

New files get a frontmatter block automatically. Add a row here when you do.
