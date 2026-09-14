# Handoff — unfathomed

Context from the chat session where this project was scoped, for whoever (or
whatever) picks it up next. Written 2026-09-14. Delete this file once the repo
has enough history to speak for itself.

Repo: https://github.com/daniellindros/unfathomed

---

## Who you're working with

Daniel. Frontend developer — Vue, TypeScript, Vitest, GraphQL. Strong on
programming fundamentals, comfortable with tooling, git, and reading code.

New to: Godot, 3D, game development, and art.

So: don't explain loops, types, or version control. Do explain engine concepts,
3D maths, rendering terms, and game-dev conventions properly — those are genuinely
new. He'll tell you when you're pitching too low.

Prefers short, plain answers. Fewer caveats, fewer tables, no preamble.

---

## What the project is

A cinematic 2.5D puzzle-platformer in the style of INSIDE (Playdead, 2016).
Solo dev. First game. Godot, GDScript.

The goal is explicitly **to learn Godot 3D and finish something small**, not to
ship a commercial title. Scope creep is the identified main risk, and he asked to
be pushed back on when it happens. Take that seriously — it was a request, not
politeness.

---

## Decisions already made

These are in `docs/decisions.md` and are binding. Summary of the reasoning, which
the decisions file doesn't carry:

**Player is constrained, camera is authored.** Not free-3D. This was settled after
looking at how Somerville (by Playdead's co-founder) removed the constraint and
got consistently criticised for illegible depth — players running into obstacles
that didn't look like obstacles. The conclusion was that INSIDE's plane lock isn't
a technical shortcut, it's what makes controls readable under a camera the player
doesn't own.

**Movement follows an authored path, not a fixed world Z plane.** Daniel
specifically liked the idea of the character moving closer to and further from the
camera as the level curves. Implementation direction below.

**Art style: low-poly, near-monochrome, heavy fog, strong key light.** Chosen
partly because it removes texture authoring, UV work and PBR material sets — the
parts of 3D art that need a specialist. The cost moves into lighting craft, which
is learnable solo.

**Documentation lives in this repo.** Deliberately not in Claude.ai project
knowledge, to avoid two copies drifting apart.

---

## Open questions — raise these, don't assume

**Puzzle model.** The biggest open question, and it determines production shape.

- *Bespoke* (INSIDE): every mechanic appears once and is discarded. Enormous
  handmade art, animation and scripting cost. Playdead spent six years with ~25
  people on a three-hour game.
- *Combinatorial* (The Swapper, Cocoon, 140): one system explored across many
  rooms. Once the mechanic and tileset exist, a new puzzle costs an afternoon.

Leaning combinatorial for solo feasibility. Not decided. Don't let the project
drift into bespoke by accident — it will, because INSIDE is the reference.

**Godot version to pin.** Not settled.

**Target length.** Not settled. Push for a number.

**Whether the 200ms response budget becomes a hard rule.** See below.

---

## Technical direction worked out so far

No code exists yet. This is the direction, not a spec.

### Plane-constrained movement (straight sections)

`CharacterBody3D` moves kinematically, so Godot's axis locks don't apply. Never
generate Z motion, and snap afterwards:

```gdscript
var input := Input.get_axis("left", "right")
velocity.x = input * SPEED
velocity.z = 0.0
velocity.y -= gravity * delta
move_and_slide()
global_position.z = 0.0
```

The final snap matters — slide collisions against angled geometry nudge the body
off-plane by small amounts that accumulate over minutes.

### Path-based movement (curving sections)

Don't parent the player to a `PathFollow3D` and drive `progress` — that discards
`move_and_slide()` and the player stops colliding with anything. Instead use the
path only for orientation: sample the curve at the closest point, take the
tangent, and move along it.

```gdscript
var offset := curve.get_closest_offset(to_local(global_position))
var forward := # tangent at offset
forward.y = 0.0
forward = forward.normalized()

velocity.x = forward.x * input * SPEED
velocity.z = forward.z * input * SPEED
velocity.y -= gravity * delta
move_and_slide()
```

Then soft-lerp the player toward the nearest point on the curve each frame — a
lerp, not a snap, so the correction isn't visible.

Two known problems with this approach:

1. **Input direction flips** when the path turns more than ~90° away from camera:
   "right" on the stick starts meaning left on screen. Resolve input against the
   camera's right vector rather than the path tangent, or keep total curvature
   modest.
2. **Props can't be axis-locked** when there's no single axis. Either confine
   `RigidBody3D` crates to straight sections, or accept full 3D physics for them.

Design note: curves should be moments, not the default. INSIDE is mostly flat and
the depth shifts land because they're rare.

### Props

`RigidBody3D` with `axis_lock_linear_z`, `axis_lock_angular_x`,
`axis_lock_angular_y`. Tumbles convincingly, stays in plane. Let death ragdolls go
fully 3D — it reads as drama, not as a bug. INSIDE does this.

### Collision geometry

Make colliders much deeper in Z than they appear so fast bodies can't tunnel past
the edges. Put background and foreground scenery on layers the player doesn't
collide with, or give it no collider. Most 2.5D bugs are the player catching on
decoration.

### Camera

Perspective, never orthographic — the parallax between fore and background does
most of the atmospheric work and orthographic throws it away.

### Look and lighting

The style lives in the lighting, not the models. Grey boxes under good lighting
already look like INSIDE; good models under flat lighting never will.

- `WorldEnvironment` with volumetric fog on.
- **Debanding enabled in project settings from day one.** Playdead gave an entire
  talk on dithering to fight colour banding — with a near-monochrome palette and
  wide fog gradients, banding is the artefact that destroys the look.
- One strong key light per shot, usually behind or to the side, so the character
  reads as a near-black silhouette.
- Light each scene as a *shot*, not as a room.

First practical task is a grey-box test corridor — capsule, one light, fog — and
an evening spent only turning knobs.

---

## The documentation system

Four files, different authority levels. This distinction matters:

- `docs/decisions.md` — **binding.** Read before proposing an approach. Don't
  re-litigate what's in it. If something in it looks wrong, say so explicitly
  rather than quietly working around it. Append-only; when a decision reverses,
  edit the line in place rather than adding a contradicting one.
- `docs/design.md` — what the game is and isn't. Currently an empty skeleton, on
  purpose. It was left blank rather than filled with plausible pillars, because
  invented pillars get inherited without being noticed. Daniel fills this in.
- `docs/inside-reference.md` — researched background on INSIDE. **Reference, not
  requirements.** Every line is tagged `[doc]` (stated by Playdead directly),
  `[obs]` (observable) or `[guess]` (inference). Never treat a `[guess]` as
  settled. Never treat any of it as a requirement — most of it describes what a
  funded studio of 25 did over six years.
- Working list — since moved out of the repo to Plane, project `UNFAT`.

`reference/transcripts/` holds raw auto-generated YouTube captions of Playdead
talks. Third-party source material. Auto-captions garble names and technical
terms badly — verify against the slide PDFs before relying on anything specific.
Never authoritative over `decisions.md`.

---

## Research findings worth acting on

From `inside-reference.md`, the items with the best cost-to-value ratio:

**The 200ms rule.** Roughly 200ms is the window in which a response still reads as
caused by your input. Playdead's gameplay designer applies it to continuous
actions, not just button presses — the player should get a visible response within
200ms at any moment, mid-animation included. It's a testable constraint rather than
an opinion. Strong candidate for a hard project rule.

**Two exits from every animation.** Wait and the full natural animation plays;
give input and it cuts short at an authored frame. Jump is allowed to interrupt
earlier than run, because an aggressive motion hides the seam. This is the actual
mechanism behind "player stays in control while animation plays". Cheap in Godot —
one exported frame threshold per animation.

**Two verbs, one room.** INSIDE has exactly two buttons: jump and grab. Grab is
taught in an enclosed barn the player can't leave until they've understood it —
rope, lever, lawnmower handle, spring handle, boarded door — and then no new input
is introduced for the rest of the game. That's a solo-dev-sized design.

**Conveying failure.** If a wrong solution looks plausible, players retry forever
and hate it. Playdead deleted whole puzzles rather than signpost around this.
Wrong interactions still get feedback — the boarded door has push/pull animations
that show "you're interacting, just not correctly".

**Fake physics via a single float.** The fern: real physics was uncontrollable,
pure animation was lifeless. Shipped version is a linear animation whose speed is
driven by one float acting as a velocity, no collision, no simulation. Same trick
handles lever release bounce.

**Respawn into a running audio loop.** In the shockwave sequence, death doesn't
cut the soundtrack and reset — the explosion loop keeps running and the player
respawns at the right point in the cycle. Costs almost nothing and is the
difference between death feeling like a reset and death feeling like part of the
scene. Easier to build this way from the start than to retrofit.

**Inaccessible must look uninviting.** Playdead hit a real problem where artists
built interesting backgrounds and players tried to walk there. The fix was a rule,
not tech: anything unreachable must look uninteresting or dangerous. No doors left
ajar in the background. Free to apply.

---

## Immediate next steps

Tracked in Plane, project `UNFAT`. In order:

1. Official "Your first 3D game" tutorial in the Godot docs — nodes, scenes,
   signals before anything else.
2. Grey-box test corridor, tune lighting and fog.
3. Fill in `docs/design.md`.
4. Decide the puzzle model.
5. Player controller, plane-constrained first, path-based second.

`.gitignore` should cover `.godot/`, `*.translation`, `export_presets.cfg`
(it can hold signing details) and `.DS_Store`.

If the repo is public, consider whether `reference/transcripts/` — verbatim
third-party conference transcripts — belongs in it.

---

## What went before this

A long chat session covering: choosing a Godot learning path, why INSIDE and
The Swapper differ structurally, how 2.5D constraints are implemented, why
Somerville's approach was criticised, how INSIDE's art style trades texture work
for lighting work, and research into Playdead's published talks. That session
produced `inside-reference.md`.

That conversation is not accessible from here. Anything from it that isn't in
these files is gone.
