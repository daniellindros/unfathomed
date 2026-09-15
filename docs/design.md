# Design — the concept

**What the game is, in brief.** The pitch: what it is, who it's for, and why anyone
would play it. Follows the *Game Design Concept and Pitch* template. A snapshot,
rewritten in place as it changes — not a log.

One page is the target. If this file is growing, that's scope creep showing up in prose
before it shows up in work. Detail is not growth — detail belongs in [gdd.md](gdd.md).

**What doesn't go here:** how the game works in detail ([gdd.md](gdd.md)), dated
decisions ([decisions.md](decisions.md)), tasks and unsettled questions (Plane), notes on
how INSIDE did something ([inside/](inside/README.md)).

**Unanswered sections are marked `?`** and carry the question instead of an answer. Fill
one by deciding, not by writing something plausible: an empty section is honest, a
guessed one gets built.

---

## Working title

**Unfathomed.** Used by the repo and by the Plane project (`UNFAT`).

> **?** A title is supposed to communicate the gameplay and the style. This one carries
> depth, water and the unknown — which may be right, but the game it names isn't decided
> yet. Revisit once the sections below are filled.

## Concept statement

> **?** The game in one or two sentences: theme, setting, and why it's worth someone's
> time. Everything below is easier once this exists, so it's the first thing to write
> and the last thing to stop rewriting.

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
> holds attention for the whole runtime.

The one thing already implied: the camera is authored, so the player never owns the
frame. Whatever the experience turns out to be, it is directed rather than explored.

## Visual and audio style

**Visual, settled** ([decisions.md](decisions.md)): low-poly, limited to near-monochrome
palette, moody lighting, cinematic 2.5D framing. Godot 3D, not 2D.

**Audio:**

> **?** Unanswered — style, instrumentation, whether there is music at all. INSIDE's
> approach is written up in [inside/audio.md](inside/audio.md); nothing there is a
> commitment.

**Reference art:** none collected. `reference/images/` is the home when there is any.
[inside/art-direction.md](inside/art-direction.md) and
[inside/lighting.md](inside/lighting.md) hold the research behind the style target.

## Game world fiction

> **?** The world and any narrative, in the terms the player meets them — not backstory
> for its own sake. Backstory that never reaches the player belongs in
> [gdd.md](gdd.md#game-world), and mostly shouldn't be written at all.

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
| Major risks | Animation volume ([inside/animation.md](inside/animation.md)); the path-constrained controller, which everything else rests on ([inside/movement.md](inside/movement.md)); scope creep, which is the standing risk on this project |

## Core loops

> **?** What the player does over and over, and why that's engaging. Detail goes in
> [gdd.md](gdd.md#player-objectives-and-progression); this section holds the gist in two
> or three lines once it exists.

## Objectives and progression

> **?** How the player moves through the game from opening to end, and what their
> short- and long-term goals are. Detail in
> [gdd.md](gdd.md#player-objectives-and-progression).

## Game systems

> **?** Which systems the game needs, and which of them the player touches directly.
> Detail in [gdd.md](gdd.md#mvp-systems-and-features).

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

*Detail lives in [gdd.md](gdd.md). Rulings live in [decisions.md](decisions.md).*
