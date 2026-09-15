# Design

**The game, from pitch to blueprint.** Part I is the concept: what the game is, who it's
for, why anyone would play it. Part II is the detail: how it works, precisely enough to
build from. The two standard templates, in one file, broadest first.

**Part I is one page.** If Part I is growing, that's scope creep showing up in prose
before it shows up in work. Part II grows as the game gets built — that's what it's for,
and detail arriving there is not the same thing as scope arriving.

**Unanswered sections are marked `?`** and carry the question instead of an answer. Fill
one by deciding, not by writing something plausible: an empty section is honest, a
guessed one gets built. `grep -c '\*\*?\*\*' docs/design.md` is a rough measure of how
much design is actually missing.

## What doesn't go here

| | |
|---|---|
| Settled questions, dated, binding | [decisions.md](decisions.md) |
| Unsettled questions, and tasks | Plane, project `UNFAT` — label `decision` for questions |
| Reasoning worth keeping, and sketches that were never settled | [answers/](answers/README.md) |
| How INSIDE did something | [inside/](inside/README.md) — reference, never a requirement |
| Godot patterns and trade-offs | [godot/](godot/README.md) |
| Folder layout, node naming, typing rules | `CLAUDE.md`, under Conventions |

## How to write in here

Part I is prose and may be qualitative. Part II is a blueprint, and four rules apply:

- **Present tense.** The game *behaves* this way. Not "will behave", never "might".
- **Numbers, not adjectives.** Not "the crusher falls fast" — how fast, over what
  distance, with what warning. Where the number isn't decided, say so and raise it in
  Plane rather than leaving a fuzzy sentence that reads like a spec.
- **One path, not a menu.** Don't document the options that were weighed; prototype the
  uncertain part, then write down what was chosen and why. Sketches that never became a
  decision live in [answers/](answers/README.md), not here.
- **Draw it where a drawing is shorter.** Diagrams, flow models, screen mockups.

When a Part II section outgrows this file it moves to `docs/design/<section>.md` and
leaves a one-line pointer behind.

## Contents

| Part | Sections |
|---|---|
| **I — Concept** | [Working title](#working-title) · [Concept statement](#concept-statement) · [Pillars](#pillars) · [What this deliberately is not](#what-this-deliberately-is-not) · [Genre](#genre) · [Target audience](#target-audience) · [Unique selling points](#unique-selling-points) · [Player experience and POV](#player-experience-and-pov) · [Visual and audio style](#visual-and-audio-style) · [Game world fiction](#game-world-fiction) · [Monetization](#monetization) · [Platform, technology, and scope](#platform-technology-and-scope) · [Core loops](#core-loops) · [Objectives and progression](#objectives-and-progression) · [Game systems](#game-systems) · [Interactivity](#interactivity) |
| **II — Detail** | [Key moments](#key-moments) · [Competition](#competition) · [Player objectives and progression](#player-objectives-and-progression) · [Game world](#game-world) · [User interface](#user-interface) · [MVP systems and features](#mvp-systems-and-features) · [Game objects](#game-objects) · [Localization](#localization) · [Tools](#tools) · [Technical](#technical) · [Ideas and expansions](#ideas-and-expansions) · [Prototypes](#prototypes) |

## Status

**As of 2026-09-15.**

- **Complete:** nothing in the game. The research base is done — every Playdead
  transcript in the repo is distilled into [inside/](inside/README.md), and every Godot
  tutorial fetched so far is written up in [godot/](godot/README.md).
- **In progress:** the design itself. Part I is a skeleton of open questions, and most of
  Part II inherits that.
- **Blockers:** no concept statement and no selling points. Nearly everything below is
  waiting on those two, and no amount of writing here substitutes for them.
- **Debt:** the 38 "Take it" verdicts in [inside/stealable.md](inside/stealable.md) are
  still only notes. The free ones belong in [decisions.md](decisions.md); the rest belong
  in Plane.
- **Code:** none. No Godot project committed yet.

---

# Part I — Concept

*The pitch. One page. A snapshot, rewritten in place as it changes — not a log.*

## Working title

**Unfathomed.** Used by the repo and by the Plane project (`UNFAT`).

> **?** A title is supposed to communicate the gameplay and the style. This one carries
> depth, water and the unknown — which may be right, but the game it names isn't decided
> yet. Revisit once the sections below are filled.

## Concept statement

> **?** The game in one or two sentences: theme, setting, and why it's worth someone's
> time. Everything below is easier once this exists, so it's the first thing to write
> and the last thing to stop rewriting.

## Pillars

Not part of the template, kept because this project already leans on it — the gun-fu
question turned on whether powerlessness is a pillar, and couldn't be answered because
nothing was written here.

> **?** Three at most. A pillar is a sentence that settles arguments: if a proposed
> feature contradicts one, the feature loses without further discussion.

## What this deliberately is not

> **?** The other half of the pillars, and the cheaper half to enforce. Scope creep is
> the standing risk on this project, and a written "not this" is the only thing that
> makes refusal automatic rather than a fresh argument each time.

## Genre

Cinematic 2.5D puzzle-platformer. Single-player, linear, no combat systems.

Concretely, and settled in [decisions.md](decisions.md): the player is constrained to an
authored path that can move toward and away from the camera, rather than free 3D or a
fixed world-axis plane; the camera is authored and never player-controlled.

> **?** "Like INSIDE" is a style target ([decisions.md](decisions.md)), not a genre
> statement. What this game does that a puzzle-platformer doesn't have to do is
> unanswered — and it's the same hole as Unique Selling Points below.

## Target audience

> **?** Who plays this, what they've played before, age range, and desired ESRB rating.

## Unique selling points

> **?** Empty, and this is the section the template calls critically important. Resembling
> INSIDE is not a selling point — INSIDE exists, is finished, and is better funded. What
> this game has that it doesn't is the question, and if it can't be answered the design
> needs refocusing rather than more documentation.

No prototype yet; a link goes here when there is one.

## Player experience and POV

> **?** Who the player is, the setting, the fantasy granted, the emotions wanted, and what
> holds attention for the whole runtime. The phases of that experience are
> [Player objectives and progression](#player-objectives-and-progression); the peaks are
> [Key moments](#key-moments).

The one thing already implied: the camera is authored, so the player never owns the
frame. Whatever the experience turns out to be, it is directed rather than explored.

## Visual and audio style

**Visual, settled** ([decisions.md](decisions.md)): low-poly, limited to near-monochrome
palette, moody lighting, cinematic 2.5D framing. Godot 3D, not 2D.

**Audio:**

> **?** Unanswered — style, instrumentation, whether there is music at all. INSIDE's
> approach is written up in [inside/audio.md](inside/audio.md); nothing there is a
> commitment.

**Reference art:** none collected. `reference/images/` is the home when there is any. A
single evocative image can do the work of pages of this document
([inside/how-they-worked.md](inside/how-they-worked.md)), which makes a mood board the
highest-value thing in this section and the one most easily put off.

## Game world fiction

> **?** The world and any narrative, in the terms the player meets them — not backstory
> for its own sake. Backstory the player never perceives belongs in
> [Game world](#game-world), and mostly shouldn't be written at all.

## Monetization

> **?** For a first solo game the cheap answer is premium or free, with nothing bought
> in-game — one line, decided once, never touched again. Any other answer is a set of
> systems to build, and they'd be the largest feature in the game.

## Platform, technology, and scope

| | |
|---|---|
| Engine | Godot 4.7, GDScript, 3D — [decisions.md](decisions.md), tracking latest stable |
| Platform | **?** Desktop is assumed by the toolchain but nothing is settled |
| Team | One developer, first game |
| Length | **?** Minutes or hours of play |
| To first playable | **?** |
| Major risks | The four in [Technical](#technical), of which scope is the standing one |

## Core loops

> **?** What the player does over and over, and why that's engaging. Two or three lines
> here once it exists; the detail is
> [Player objectives and progression](#player-objectives-and-progression).

## Objectives and progression

> **?** How the player moves through the game from opening to end, and their short- and
> long-term goals. Detail in
> [Player objectives and progression](#player-objectives-and-progression).

## Game systems

> **?** Which systems the game needs, and which of them the player touches directly.
> Detail in [MVP systems and features](#mvp-systems-and-features).

## Interactivity

**Settled:** movement follows an authored path; the camera is authored
([decisions.md](decisions.md)). The player reads a frame they don't control and moves
through a space whose depth is deliberately flattened — which is why free aim and
free-3D verbs keep failing here, worked through in
[answers/2026-09-15-gun-fu-shooting.md](answers/2026-09-15-gun-fu-shooting.md).

> **?** The verb list. INSIDE ships two buttons and never adds a third
> ([inside/teaching.md](inside/teaching.md)); how many this game ships, and which,
> is undecided. Every verb is animation in every direction, so this number is a budget,
> not a wish list.

---

# Part II — Detail

*The blueprint. Present tense, real numbers, or an explicit `?`.*

## Key moments

> **?** Three at minimum: the first positive experience inside the opening five minutes,
> the struggle the game is remembered for, and the resolution. These come before level
> layout — they're what the layout exists to deliver.

## Competition

| Game | Released | Why it competes | What sets this apart |
|---|---|---|---|
| INSIDE | 2016 | The style target itself | **?** |
| LIMBO | 2010 | Same studio, same silhouette-and-dread grammar, 2D | **?** |
| Little Nightmares | 2017 | 2.5D, wordless, child protagonist, stealth-flavoured puzzles | **?** |
| Somerville | 2022 | Ex-Playdead, 2.5D, and the cautionary one — its depth-reading problems are written up in [inside/movement.md](inside/movement.md) | **?** |

The right-hand column can't be filled before [Unique selling points](#unique-selling-points)
is, and it is the same question twice. Budget and revenue figures aren't recorded here —
for a self-funded first game they inform nothing.

## Player objectives and progression

> **?** Unanswered, all of it:
> - Who the player is, and what they know at the opening.
> - Primary goals, and the route to them — which parts are linear, which branch. (Linear
>   is the default and the cheap one.)
> - Moment-by-moment gameplay.
> - The core loop, and any outer loop.
> - How each of the [Key moments](#key-moments) is reached.

## Game world

- **Backstory.** **?** Only what the player can actually perceive earns a line. Fiction
  the player never meets costs writing time and buys nothing.
- **Organization.** **?** The MVP is undefined: how many rooms, how many sequences, which
  one teaches. INSIDE's opening barn teaches both verbs in one room
  ([inside/teaching.md](inside/teaching.md)); this game's equivalent is not designed.
- **Physics.** Movement follows an authored path that moves toward and away from the
  camera ([decisions.md](decisions.md)). Every number is open: walk and run speed, jump
  height and distance, gravity, ledge-grab reach, fall height that kills.
- **Easter eggs.** None. Nothing to hide until there's a game to hide it in.

## User interface

- **Controls.** **?** The verb list is undecided ([Interactivity](#interactivity)).
  Whatever it becomes, the scheme is consistent across the whole game, and each verb is
  specified here with its input, its held-versus-tapped behaviour, and its response
  budget.
- **Screens.** **?** Title, pause, options, save. Wireframes, no art.
- **HUD.** **?** The working assumption behind
  [answers/2026-09-15-time-dilation.md](answers/2026-09-15-time-dilation.md) is that
  there isn't one, and that state is conveyed diegetically through audio and colour.
  That is a sketch, not a decision.
- **Options.** **?** Audio, visual, saving. Godot's UI sizing model and the two project
  settings worth setting before building any of it are in [godot/ui.md](godot/ui.md).
- **Help system.** None. Teaching happens through obstacle order, not prompts
  ([inside/teaching.md](inside/teaching.md)) — which makes room design the help system,
  and puts the cost in level layout rather than UI.

## MVP systems and features

**The MVP is not defined.** Until [Part I](#part-i--concept) names what the game is,
listing features here would be inventing it. Nothing is listed on purpose.

Each feature gets one entry, in this shape:

```
### <Feature name>

**Intent.** Why it exists — what the player experience needs that this provides.
**Moment-by-moment.** What the player does, in order, in present tense.
**Numbers.** Speeds, distances, durations, timings. Ranges where tuning is expected.
**Failure.** What going wrong looks like, and how the player is told.
**UI.** Inputs and feedback, linked back to the section above.
**Status.** Not started / prototyped / built.
**Work items.** UNFAT-nn.
```

Candidate verbs and mechanics with no decision behind them belong under
[Ideas and expansions](#ideas-and-expansions), not here. A feature arrives in this
section when it's being built.

## Game objects

> **?** Empty until there are features to serve. One row per object once there are —
> name, attributes with ranges, behaviour, and the scene it lives in. Keeping the data
> out of the nodes is written up in [godot/data-models.md](godot/data-models.md); a
> resource file beats a table here as soon as there are more than a handful.

No NPC section yet. Nothing in [decisions.md](decisions.md) commits the game to
characters other than the player.

## Localization

> **?** English is the default. If the game ships wordless — no dialogue, no on-screen
> text, which is INSIDE's approach and the cheapest one — this section is one line
> forever and the question disappears. That's worth deciding early, because text added
> later drags a string-key convention and a translation pass in behind it.

## Tools

The Godot editor is the level-layout tool. Nothing else is built.

> **?** Two candidates, both deferred until a room exists to need them: an authoring aid
> for the movement path and camera, and a way to place checkpoints. Both are tempting to
> build before the game and neither should be — a tool without a game to serve is a
> second project.

`reference/fetch-transcripts.mjs` is documentation tooling, not game tooling.

## Technical

Engine-level patterns live in [godot/](godot/README.md) and are not duplicated here.
Anything settled is a dated line in [decisions.md](decisions.md). This section holds what
is specific to building *this* game.

- **Target hardware.** **?** Nothing decided; see
  [Platform, technology, and scope](#platform-technology-and-scope).
- **Engine.** Godot 4.7, GDScript, static typing on everything (`CLAUDE.md`).
- **Directory structure and naming.** Not yet defined — `CLAUDE.md` holds the
  conventions and says so.
- **Data file format.** **?** Godot resources are the default; see
  [godot/data-models.md](godot/data-models.md).
- **Server / network.** None. Single-player, offline.
- **AI and procedural systems.** None planned. Pathfinding, procedural generation and
  economy are all absent, and each of them arriving would be a new system to justify.
- **Cheats for testing.** **?** A room-skip and a checkpoint-jump pay for themselves the
  first week there's more than one room.

**Major technical risks**, in the order they're likely to bite:

| Risk | Why | Reference |
|---|---|---|
| Animation volume | The bottleneck least helped by low-poly art, and it scales with the verb count | [inside/animation.md](inside/animation.md) |
| The path-constrained controller | Everything else rests on it, and the failure mode is subtle: a space whose depth the camera flattens, where the player can't read what's reachable | [inside/movement.md](inside/movement.md) |
| The look | Fog, key light and debanding are cheap; getting them to *read* is a tuning pass, not a feature | [inside/lighting.md](inside/lighting.md) |
| Scope | The standing risk on a solo first game, and the one this document can cause as easily as cure | `CLAUDE.md` |

## Ideas and expansions

Non-MVP, one line each. A parking lot, deliberately cheap to add to and cheap to ignore.
Anything worked through properly becomes a file in [answers/](answers/README.md) and a
link from here; anything decided leaves this list entirely.

| Idea | Worked through? |
|---|---|
| Time dilation as a puzzle verb — the player privileged relative to the world, not global slow motion | [answers/2026-09-15-time-dilation.md](answers/2026-09-15-time-dilation.md) — costed, undecided |
| Gun-fu combat | [answers/2026-09-15-gun-fu-shooting.md](answers/2026-09-15-gun-fu-shooting.md) — rejected on tone and cost, not settled |

The "Take it" verdicts in [inside/stealable.md](inside/stealable.md) are a pool to draw
from, not entries in this list.

## Prototypes

None. Links go here when there are any — including throwaway ones, which are the point:
Playdead discard roughly 70% of what they try
([inside/how-they-worked.md](inside/how-they-worked.md)).

---

*The detailed template keeps an Unresolved Questions section. This document doesn't: they
live in Plane, label `decision`, decided on 2026-09-14 — and splitting them across Plane
and a file would guarantee one of the two goes stale. The `?` markers above are the
doc-side view of the same thing: a question blocking a document rather than a task.*
