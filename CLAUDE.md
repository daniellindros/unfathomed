# Project

Cinematic 2.5D puzzle-platformer in the style of INSIDE (Playdead, 2016).
Godot 4.x, GDScript. Solo dev, first game.

I'm a frontend developer (Vue/TypeScript) — strong on programming fundamentals,
new to Godot, 3D, and game development generally. Skip programming basics.
Explain engine concepts, 3D concepts, and game-dev conventions properly.

## Docs

One home per kind of thing. If something belongs in two files, it belongs in one of
them and the other should point at it.

- `docs/design.md` — **what the game is.** A snapshot, rewritten in place. Scope
  lives here. Half a page; if it's growing, say so.
- `docs/decisions.md` — **settled questions only.** A dated, append-only ledger.
  **Binding.** Read before proposing an approach. Don't re-litigate what's in here;
  if something in it looks wrong, say so rather than quietly working around it.
- `docs/todo.md` — **being retired.** See Work tracking below. Don't add to it.
- `docs/inside-reference.md` — **researched background on how INSIDE was built.**
  Reference, not requirements. Lines are tagged `[doc]` (stated by Playdead),
  `[obs]` (observable), `[guess]` (inference). Never treat a `[guess]` as settled,
  and never treat anything here as a requirement — most of it was built by a funded
  studio of 25 over six years. Nothing here is a task until it's a work item in Plane.

## Work tracking

Plane, project **Unfathomed** (`UNFAT`) — tasks, and the open questions that gate
them. Not in the repo. Two labels carry meaning:

- `decision` — an unsettled question. When it's settled it becomes a dated line in
  `docs/decisions.md`, and the work item closes.
- `transcript` — a Playdead talk to distil into `docs/inside-reference.md`. Tracks
  distillation, not download; the download queue is `reference/talks.txt`.

`docs/todo.md` is a **partial remnant** of that move, not the live list. Its
Undecided and Now items are already in Plane; its Soon, Transcripts and Later
items are not yet. Read it for those, but don't treat it as current and don't add
to it.

## Reference material

- `reference/transcripts/` — raw auto-generated transcripts of Playdead talks.
  Third-party source material, not project decisions. Read on request or when
  verifying a claim in `inside-reference.md`. Auto-captions contain transcription
  errors — verify names and technical terms against the slide PDFs before relying
  on them. Never authoritative over `docs/decisions.md`.

## Conventions

- Static typing on all GDScript.
- (folder layout — fill in once there's code)
- (node naming — fill in once there's code)

## How I want help

Priorities are atmosphere and finishing something small. Scope creep is the main
risk on this project — push back when I'm growing it. When I ask a design question,
tell me what it costs a solo dev, not just how it's done.
