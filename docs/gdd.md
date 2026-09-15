# Game design document

**How the game works, in precise detail.** Follows the *Detailed Game Design
Documentation* template. Backward-looking and forward-looking at once: it records what
was designed and why, and it is the thing to build from.

**[design.md](design.md) is the front page.** Title, concept statement, genre, audience,
selling points, player experience, style, platform and scope live there and are not
repeated here. This file starts where that one stops.

**What doesn't go here:**

| | |
|---|---|
| The pitch — what the game is and why | [design.md](design.md) |
| Settled questions, dated, binding | [decisions.md](decisions.md) |
| Unsettled questions | Plane, label `decision` |
| Reasoning worth keeping, and sketches that were never settled | [answers/](answers/README.md) |
| How INSIDE did something | [inside/](inside/README.md) — reference, never a requirement |
| Godot patterns and trade-offs | [godot/](godot/README.md) |
| Folder layout, node naming, typing rules | `CLAUDE.md`, under Conventions |

## How to write in here

Four rules, from the template:

- **Present tense.** The game *behaves* this way. Not "will behave", never "might".
- **Numbers, not adjectives.** Not "the crusher falls fast" — how fast, over what
  distance, with what warning. Where the number isn't decided, say so and raise it in
  Plane rather than leaving a fuzzy sentence that reads like a spec.
- **One path, not a menu.** Don't document the options that were weighed; prototype the
  uncertain part, then write down what was chosen and why. Sketches that never became a
  decision live in [answers/](answers/README.md), not here.
- **Draw it where a drawing is shorter.** Diagrams, flow models, screen mockups.

**Unanswered sections are marked `?`** and carry the question. `grep -c '\*\*?\*\*'`
across this file and [design.md](design.md) is a rough measure of how much design is
actually missing.

**One file for now.** When a section outgrows the page it moves to `docs/gdd/<section>.md`
and leaves a one-line pointer here.

---

## Status

**As of 2026-09-15.**

- **Complete:** nothing in the game. The research base is done — every Playdead
  transcript in the repo is distilled into [inside/](inside/README.md), and every Godot
  tutorial fetched so far is written up in [godot/](godot/README.md).
- **In progress:** the design itself. [design.md](design.md) is a skeleton of open
  questions, and most of this file inherits that.
- **Blockers:** no concept statement and no selling points. Nearly every section below
  is waiting on those two, and no amount of writing here substitutes for them.
- **Debt:** the 38 "Take it" verdicts in
  [inside/stealable.md](inside/stealable.md) are still only notes. The free ones belong
  in [decisions.md](decisions.md); the rest belong in Plane.
- **Code:** none. No Godot project committed yet.

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

The right-hand column can't be filled before Unique Selling Points in
[design.md](design.md) is, and it is the same question twice. Budget and revenue figures
aren't recorded here — for a self-funded first game they inform nothing.

## Player objectives and progression

> **?** Unanswered, all of it:
> - Who the player is, and what they know at the opening.
> - Primary goals, and the route to them — which parts are linear, which branch. (Linear
>   is the default and the cheap one.)
> - Moment-by-moment gameplay.
> - The core loop, and any outer loop.
> - How each of the Key Moments above is reached.

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

- **Controls.** **?** The verb list is undecided ([design.md](design.md#interactivity)).
  Whatever it becomes, the scheme is consistent across the whole game, and each verb is
  specified here with its input, its held-versus-tapped behaviour, and its response
  budget.
- **Screens.** **?** Title, pause, options, save. Wireframes, no art.
- **HUD.** **?** The working assumption behind
  [answers/2026-09-15-time-dilation.md](answers/2026-09-15-time-dilation.md) is that
  there isn't one and that state is conveyed diegetically, through audio and colour.
  That is a sketch, not a decision.
- **Options.** **?** Audio, visual, saving. Godot's UI sizing model and the two project
  settings worth setting before building any of it are in [godot/ui.md](godot/ui.md).
- **Help system.** None. Teaching happens through obstacle order, not prompts
  ([inside/teaching.md](inside/teaching.md)) — which makes room design the help system,
  and puts the cost in level layout rather than UI.

## MVP systems and features

**The MVP is not defined.** Until [design.md](design.md) names what the game is, listing
features here would be inventing it. Nothing is listed on purpose.

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

## Technical documentation

Engine-level patterns live in [godot/](godot/README.md) and are not duplicated here.
Anything settled is a dated line in [decisions.md](decisions.md). This section holds
what's specific to building *this* game.

- **Target hardware.** **?** Nothing decided; see
  [design.md](design.md#platform-technology-and-scope).
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
Anything that gets worked through properly becomes a file in
[answers/](answers/README.md) and a link from here; anything that gets decided leaves
this list entirely.

| Idea | Worked through? |
|---|---|
| Time dilation as a puzzle verb — the player privileged relative to the world, not global slow motion | [answers/2026-09-15-time-dilation.md](answers/2026-09-15-time-dilation.md) — costed, undecided |
| Gun-fu combat | [answers/2026-09-15-gun-fu-shooting.md](answers/2026-09-15-gun-fu-shooting.md) — rejected on tone and cost, not settled |

The "Take it" verdicts in [inside/stealable.md](inside/stealable.md) are a pool to draw
from, not entries in this list.

## Unresolved questions

**They live in Plane**, project Unfathomed (`UNFAT`), label `decision` — not in this
file. The template keeps them in the doc; this project moved task and question tracking
out of the repo on 2026-09-14 ([decisions.md](decisions.md)), and splitting them back
across two homes would guarantee one of them goes stale.

Resolution works the same as the template intends: a settled question becomes a dated
line in [decisions.md](decisions.md), the work item closes, and the reasoning — if it's
worth keeping — becomes a file in [answers/](answers/README.md).

The `?` markers in this file and in [design.md](design.md) are the doc-side view of the
same thing: a question that's blocking a *document* rather than a task.

## Prototypes

None. Links go here when there are any — including throwaway ones, which are the point:
Playdead discard roughly 70% of what they try ([inside/how-they-worked.md](inside/how-they-worked.md)).

---

*The pitch is [design.md](design.md). Rulings are [decisions.md](decisions.md).*
