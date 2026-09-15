# INSIDE — Reference Notes

**Researched background on how INSIDE was built.** Organised by question, not by
source. Read it to find out what the real technique was before choosing a cheaper
version of it.

**Reference, not requirements.** It describes what a funded studio of ~25 people did
over six years. Most of it is out of reach for a solo dev, and that's fine. Nothing
here is binding — `decisions.md` is binding.

**What doesn't go here:** anything about *this* game. Nothing in this file is a task
or a commitment. When something here is worth adopting, it becomes a work item in
Plane, and then a dated line in `decisions.md` once settled.

---

## Confidence tags

Every factual line is tagged:

- **[doc]** — stated by Playdead directly, in a talk, slide deck or interview. Trust it.
- **[obs]** — observable by playing or watching footage. Reliable as description; the *method* behind it may still be a guess.
- **[guess]** — inference, mine or the community's. A hypothesis to test, not a fact.

Untagged factual lines are a bug. When something turns out to be wrong, correct it in
place rather than appending a note — a file that contradicts itself is worse than one
that's slightly out of date.

---

## 1. Production facts

- **[doc]** Developer: Playdead, Copenhagen. Founded 2006 by Arnt Jensen and Dino Patti.
- **[doc]** Released 29 June 2016 on Xbox One, July on Windows, August on PS4. Later iOS, Switch, macOS.
- **[doc]** Engine: Unity. Limbo used a custom in-house engine; they moved to Unity to simplify development and layered their own rendering routines on top.
- **[doc]** Development began in 2010, the same year Limbo shipped. Playdead have said publicly that Limbo and Inside each took six years.
- **[doc]** Team size never exceeded roughly 25 people.
- **[doc]** Partly financed by the Danish Film Institute; the rest was Limbo's earnings, reinvested.
- **[doc]** Key credits: Arnt Jensen (director), Jeppe Carlsen (designer), Kristian Kjems (programmer), Mikkel Gjøl (graphics), Mikkel Bøgeskov Svendsen (VFX), Andreas Normand Grøntved (animator), Lasse Jon Fuglsang Pedersen (senior programmer), Martin Stig Andersen and SØS Gunver Ryberg (audio), Jakob Schmid (audio programming).
- **[obs]** Around three hours long. No HUD, no menus during play, no dialogue, no text.

**Scale check.** Every beautiful thing below had a specialist behind it and years of
iteration. The useful question is never "can I copy this" but "what is the cheapest
version that still reads".

---

## 2. How they actually worked

Mostly from the Kotaku UK interview with Peter Buchardt, Playdead's 8th employee and a
level designer on both games.

- **[doc]** Ideas were prototyped constantly and then shelved. The team pushed an idea far enough to *believe* it could work, boxed it, and moved on — rather than taking a single idea all the way through production.
- **[doc]** Inside didn't start as Inside. The first version was set in space and gave the player more verbs — at one point a gun with a single bullet, and a grenade. Not an action game, just more to do. After about half a year Jensen judged it wrong and they reverted to a boy roughly identical to Limbo's.
- **[doc]** There was never a written story document. Jensen shared fragments with individuals as they needed them for their own work. The nearest thing to a design bible on Limbo was a 3m × 2m concept art poster on the office wall showing the world's areas in miniature, which the team mined for week-to-week ideas.
- **[doc]** Flat structure, open plan, no line managers for designers. Artists weren't asked to maintain production-tracking tasks; a producer handled that, and designers cleaned up after artists had finished an area.
- **[doc]** Many endings were tried for Limbo — at least five genuinely different ones — and discarded for not working well enough.

**Transfers to solo work:**

- Prototype to *belief*, not completion. Cheap alone, and it reveals that a mechanic is boring in two days rather than two months.
- A single evocative image can do the job of a design document. Consider a mood board alongside `design.md`.
- Be willing to throw away six months. They did. That only works if you notice early.

---

## 3. Movement, depth and the 2.5D constraint

- **[obs]** Full 3D scenes, 3D lighting and physics, but the player is constrained to a 2D plane of movement.
- **[doc]** Depth was an explicit early experiment, not an accident. In Limbo, getting past a crate meant climbing it; in Inside they wanted the boy to walk *past* things — between trees, around obstacles — which makes the player start thinking in depth.
- **[doc]** This created a real problem. Artists would build something interesting in the background and players would try to walk there. The fix was a readability rule: anything the player can't reach must look uninteresting or dangerous. No doors left ajar in the background.
- **[obs]** The plane isn't always world-axis-aligned; the level curves toward and away from camera in places and the boy follows it.
- **[obs]** Perspective camera throughout, never orthographic. Foreground / play plane / background parallax does much of the atmospheric work.
- **[guess]** The curving sections are likely a spline constraint with input mapped to the tangent. Playdead haven't documented this.
- **[doc]** Water is the biggest mechanical difference from Limbo. In Limbo water kills you; in Inside it's a medium. Swimming gives full directional freedom — described as effectively flying — with a breath timer as the constraint, later lifted.

**Godot translation:**

- Straight sections: `CharacterBody3D`, `velocity.z = 0`, and snap `global_position.z` after `move_and_slide()` — slide collisions against angled geometry accumulate drift otherwise.
- Curved sections: sample a `Path3D` for the tangent, drive velocity along it, soft-lerp the player back toward the curve. Collision stays genuine 3D.
- Props: `RigidBody3D` with `axis_lock_linear_z` plus angular X and Y locked. Only works on straight sections.
- Colliders much deeper in Z than they appear, so fast bodies can't tunnel past the edges. Background scenery on layers the player doesn't collide with.

**The readability rule is the important one, and it's free.** If the player can't go
somewhere, it must not look inviting. Costs nothing and prevents the most common
complaint about depth in 2.5D games.

**Contrast — Somerville (Jumpship, 2022).** Made by Playdead's co-founder Dino Patti
after he left. Abandoned the constraint: full 3D movement with an authored cinematic
camera. Reviewers consistently found depth illegible — running into obstacles that
didn't look like obstacles, getting stuck for not standing in the exact spot. Evidence
that Inside's plane lock is load-bearing, not a shortcut.

---

## 4. Camera

- **[obs]** Slow, soft follow. Framing changes at scene boundaries rather than continuous tracking.
- **[obs]** Every screen is composed — silhouette against light, strong foreground framing elements.
- **[doc]** Camera behaviour had performance consequences: on the rooftop section before the lineup, the camera pans to look further ahead than usual, and that caused the entire world to load into memory. One of the hardest areas to optimise.
- **[guess]** Likely authored camera volumes or triggers with blending, rather than one follow rig.

**Note:** camera look-ahead and streaming are coupled. If you build level streaming,
the camera's view distance is part of the budget.

---

## 5. Puzzle design

- **[doc]** Jeppe Carlsen's rule, from his GDC 2010 Limbo talk: puzzles should tax the brain but be physically easy to overcome. The solution should be easy to execute, and wrong approaches clearly not possible.
- **[doc]** Checkpoints placed so the player never repeats a puzzle they've already solved.
- **[doc]** Playtesting showed players press every button on the pad; you are blind to the approaches they'll try.
- **[doc]** Inside's puzzles are deliberately *less* logic-dense than Limbo's. In Limbo everything needed is usually on screen and the puzzle can almost be solved by looking. Inside allows a "puzzle" to be walking somewhere, pulling a lever, and watching something happen. More about being there than about solving.
- **[doc]** The hidden orb rooms became a home for "darlings" — puzzles somebody loved that didn't fit the main game. The torch-and-dogs puzzle ended up there because it wouldn't work in the critical path.
- **[obs]** Nearly every mechanic is bespoke: introduced, used once, discarded.
- **[doc]** Sometimes the simple solution wins. On Limbo they spent weeks trying to build an elaborate puzzle for getting the spider web off the boy, and settled on having him fall down a ledge so it comes off.

### Conveying failure

Fasterholdt treats this as a first-class design problem, and it's the most portable
idea in the Konsoll talk.

- **[doc]** If a gap looks *almost* jumpable, players will retry it endlessly and hate it. Make impossible jumps obviously, generously impossible.
- **[doc]** The general form: any wrong solution that looks plausible will trap the player. Playdead actively deleted whole puzzles because a failed approach looked convincingly right, rather than trying to signpost around it.
- **[doc]** Wrong interactions still get feedback. The boarded door in the barn has push and pull animations that clearly show "you're interacting, just not correctly" — without feedback the player concludes the object is inert.
- **[doc]** The heavy hatch can be grabbed while standing on top of it. Rather than blocking that, they let you try, give a small controller rumble, and nothing happens. Letting the wrong attempt play out is treated as better guidance than preventing it.

**This is a discipline, not a feature.** Costs nothing but attention, and it's the
difference between a puzzle feeling fair and feeling broken.

**Production implication.** Bespoke-per-puzzle is the most expensive design model there
is and the least available to a solo dev. The alternative is combinatorial — one system,
many rooms (The Swapper, Cocoon, and Carlsen's own 140). Which model this project uses
determines its whole production shape, so it belongs in `decisions.md`.

**The darlings trick is worth stealing.** A side channel for good ideas that don't fit
means not having to either force them in or throw them away.

---

## 6. Teaching the player

- **[obs]** No tutorial, no prompts, no text. Controls are taught by the order of obstacles in the opening forest.
- **[obs]** First real obstacle is a fallen tree, which forces jump to be discovered. The next sequence re-tests jumping under chase pressure, then introduces hiding.
- **[doc]** There are only two buttons in the entire game: jump, and action/grab.
- **[doc]** The chase sequence is treated as a *test*, not a lesson. If the player gets through it, the team considered movement and jumping taught and stopped worrying about them.
- **[doc]** The barn area after the chickens is a deliberate teaching box. The player can't leave until the grab verb is understood. The sequence:
  1. Rope — first time up on the stick means something (climb).
  2. Lever — hold the button to hold the object, release to let go. Establishes that grab is a *held* state, not a toggle.
  3. Lawnmower handle — stick direction becomes pull direction, and holding the stick keeps pulling.
  4. Spring-loaded handle — snaps back when released, reinforcing the same rule from the other side.
  5. Boarded door — the payoff. Push horizontally, nothing; push *up*, the board lifts. Teaches that grab plus any direction works, including vertical.
  6. A crate on the way out, reusing the same button.
- **[doc]** After that box, nothing new is introduced at the input level. Everything later is a riff on grab and direction.
- **[obs]** Chase and hide alternate, teaching that the player must react as well as think.
- **[obs]** One continuous space, not discrete levels.

**Practical consequence:** design the first five minutes *last*, once the verbs are
final. Building the opening first means rebuilding it.

**The structural lesson:** two verbs, one enclosed room the player can't leave until
they've found both, then never add another input for the rest of the game. That's a
solo-dev-sized design, and it's what Inside actually does.

---

## 7. Rendering and lighting

Primary source is the GDC / GDC Europe 2016 rendering talk by Mikkel Gjøl and Mikkel
Svendsen. Slides are public.

- **[doc]** Lighting authored as *separate* diffuse, specular and bounce-light entities, so each could be tuned independently per shot.
- **[doc]** Local shadowed volumetrics for atmosphere.
- **[doc]** Analytic primitive-based ambient occlusion, chosen specifically to stay artist-approachable rather than for physical accuracy.
- **[doc]** Screen-space reflections.
- **[doc]** A custom water rendering system.
- **[doc]** Deliberate dithering to fight colour banding. Playdead gave a whole separate talk on this (*Banding in Games*, DTU VisionDay 2014). With a near-monochrome palette and wide gradients, banding is the artefact that destroys the look.
- **[doc]** Custom temporal reprojection anti-aliasing, released open-source under MIT in March 2016 for Unity 5+. Written by Lasse Jon Fuglsang Pedersen with input from Gjøl. The repo includes the GDC 2016 slide deck.
- **[doc]** *Custom Pixels* (GGJ 2015) covers going fully custom in Unity by replacing all shaders — the approach underneath the above.
- **[obs]** Key light usually behind or to the side; the boy reads as a near-black silhouette.
- **[obs]** Fog eats the background within a fairly short distance and does most of the depth work.

**Godot translation:**

- `WorldEnvironment` with volumetric fog on. Debanding enabled in project settings from day one — the most direct port of a Playdead technique available.
- One strong key light per shot, plus fill. Godot doesn't split diffuse/specular/bounce authoring, so the equivalent is per-area Environment overrides and careful light energy.
- Grey-box test corridor with one light and fog, tuned before any real modelling. Godot's defaults will not look like this; the knobs are where the style lives.

---

## 8. Art direction and VFX

- **[obs]** Low polygon counts, near-absent albedo detail, no visible normal-map work.
- **[obs]** Near-monochrome palette. The boy's red shirt is the only saturated colour for most of the game and anchors the eye in every frame.
- **[doc]** The VFX talk is titled *Turn it Down 90%*. Playdead describe the game as visually minimalist — clean shapes, muted colours, no added sugar — and the talk covers what those choices cost the VFX work.
- **[obs]** Environment silhouettes carry readability; shapes are simple and high-contrast against fog.

**The trade for a solo dev:** removes texture authoring, UV work and PBR material sets
almost entirely, and moves the cost into lighting. Good trade — lighting is learnable
alone. But low-poly under flat lighting looks like an asset pack, not like Inside.

**The restraint is the technique.** "Turn it down 90%" is a usable rule: build the
effect, then remove most of it.

---

## 9. Game feel — control versus animation

The whole of the Konsoll 2017 talk (*Subtleties of INSIDE*, Martin Fasterholdt,
gameplay designer). This is the richest source for anything to do with how the game
*feels*, and unlike the rendering material, nearly all of it is within reach solo.

**[doc]** The organising tension, in his words: the player must stay in control while
a continuous, natural animation plays. Those two goals fight, and most of the
techniques below are ways of not choosing between them.

**[doc]** Their working method for subtlety: implement an effect, then turn it down
repeatedly until you can barely see it, and ship that. The same "turn it down" instinct
as the VFX talk, applied to gameplay.

### Stunting out of animations

- **[doc]** Every animation has two exits. Wait, and the full natural animation plays out. Give input, and it cuts short.
- **[doc]** The cut-short point is an authored frame number, per animation. The lever release is around seven frames before input is accepted.
- **[doc]** Different actions get different thresholds. Jump is allowed to interrupt earlier than run, because an aggressive movement hides the cut better than a soft one.
- **[doc]** Example: landing from a fall plays a slow stumble-to-feet. Hold right from the moment of landing and the boy moves almost immediately; do nothing and you get the full performance.

### Minimum durations for tiny inputs

- **[doc]** Tapping the action button doesn't play two frames of grab. A timer forces a small, complete "wiggle" — reach, touch, stumble back — so the input reads as acknowledged rather than glitched.
- **[doc]** Same on release: there's a minimum hold time, because letting go faster than that looks wrong.
- **[doc]** Both are interruptible by jump or a direction. The timer shapes the animation; it never takes control.

### Directional grabbing

- **[doc]** Grab is a held state. Hold the button, hold the object; release, let go. Never a toggle.
- **[doc]** Stick direction maps to pull direction continuously — reversing mid-pull is allowed, and the player is never locked into completing a motion.
- **[doc]** Small stick movements get no lean animation; larger ones get one. Two tiers, not a continuous blend.
- **[doc]** Underwater the same lever needs several grab animations because approach is omnidirectional, with rotation blended to match.
- **[doc]** One deliberate rule-break: pull the underwater cylinder past roughly 80% and the game takes over and finishes it, on the reasoning that anyone who got that far intended to finish, and punishing an unlucky release would be worse than the inconsistency.

### The 200ms rule

- **[doc]** Fasterholdt recommends *Game Feel* by Steve Swink, and leans on its figure of roughly 200 milliseconds as the window within which a response still reads as caused by your input. Slower than that and the game starts to feel sluggish and disconnected.
- **[doc]** He applies it to continuous actions, not just discrete button presses — the player should have a response inside 200ms at any moment, mid-animation included.

**This is the most useful single number in the whole reference.** It's a testable
constraint: if any interaction in the game takes longer than 200ms to visibly respond,
it's wrong regardless of how good the animation is.

### Additive pose layering

- **[doc]** The button-press reach is built as additive poses on the upper body — front, left, right — rather than discrete animations. Blending them gives every in-between position for free, and lets the boy keep his hand on the button while walking.
- **[doc]** A separate animation exists for pressing while running (hand slides along). An attempt at a jumping press was abandoned because it looked wrong and barely differed from the normal jump.
- **[doc]** Where animation can't cover a case — pressing mid-turn — they simply play nothing. Stated priority: the button must always respond to input. That comes first, and animation yields to it.
- **[doc]** Inputs are queued internally so every tap executes, even when the animation can't keep up.

### The look-at layer

- **[doc]** A procedural layer on top of everything else: head rotates toward a point of interest, then the spine gradually follows, with the shoulders counter-rotating.
- **[doc]** It blends out automatically when the head is already turned too far from the target, so idle animations and interactions don't cause unnatural neck rotation. It blends back in when the boy returns to a neutral idle.
- **[doc]** Used for direction, not just flavour: fixing the boy's gaze on the marching figures in the background, or on a machine that turns out to be lethal. The player follows his eyeline.

**Cheap and high-value.** A look-at layer directs attention without a cutscene, a
prompt, or taking control away. Strong candidate for early implementation.

### Fake physics

- **[doc]** The fern took one to two weeks. A real physics version was uncontrollable; a pure animation version was lifeless. The shipped version is a hybrid: an animation-driven body shake, plus one prominent leaf running a linear left-right animation whose speed is driven by a single float in a script acting as a velocity — no collision, no simulation. Push it and it follows you; knock it and it keeps moving.
- **[doc]** The same single-float trick handles lever release: rather than authoring an animation for letting go at an arbitrary point, they let the fake velocity resolve the bounce.
- **[doc]** The rotating valve went the other way — a real rigid-body sphere, invisible and excluded from the game world entirely, driven by torque from player input, whose rotation then drives blended valve poses. Easier than reimplementing drag and friction by hand.
- **[doc]** That valve has two input modes: *direct*, where the valve matches the stick's absolute direction (feels right when stationary), and *gesture*, where a detected rotation switches to spin mode with a clamped maximum speed. The transition between them took a long time to get right.

**The direct-versus-gesture distinction is worth internalising.** Map to the literal
input where it reads well, and to inferred intent where it doesn't — and expect the
transition to be the expensive part.

### The world stays present

- **[doc]** Deliberate policy: when a player pokes at the edges of the game, something should always answer. Never a dead end that feels unfinished.
- **[doc]** Examples: pots slide off a tilting platform, fall, break, and leave shards — and there's a cat and litter at the bottom of the pit they land in. Walking into a wall gives a lean-against-it animation. Stopping at a ledge plays a different stop than stopping on flat ground. Turning at a ledge edge plays a small "close call". A shopping trolley under a gap you'd normally clear has different reactions depending on which side you fall in from.
- **[doc]** Stated reasons: it's fun to make, and it keeps the player inside the world when they start testing its edges rather than bouncing them out of it.

**Realistic note for solo work:** this is the category with the worst
effort-to-visibility ratio, and Playdead had a dedicated animator. Pick three or four
spots rather than doing it everywhere.

---

## 10. Animation and physics

- **[obs]** Large amount of contextual animation: grabbing, stumbling, catching himself, decelerating before a wall, reacting to being caught.
- **[obs]** Visible weight and momentum. He does not stop on a dime.
- **[obs]** Ragdoll goes fully 3D on death, breaking the plane constraint. Reads as drama, not as a bug.
- **[doc]** The huddle (the late-game creature) is not conventionally animated. Its skinned mesh has bones governed by physics rather than animation curves — a sack of physics bodies with dynamic arms imposed on top, moved by physics and animation as one unit, then glued together with specialised shading.
- **[doc]** The huddle took more than four years on and off. A consultant hacked together a working prototype in one month, which convinced the team it was worth doing; a programmer was then dedicated to it for the rest of the project. Roughly a third of the company touched it at some point.
- **[doc]** Grøntved, the animator, is explicit that people assume the huddle is thousands of hand animations strung together, and that this is neither true nor feasible.

**Honest note:** animation is the most likely bottleneck for a solo dev and the one
least helped by the low-poly art style. Two options: budget for it explicitly, or
design a game that needs less of it.

**The prototype-in-a-month pattern is worth copying.** Before committing to an expensive
mechanic, build the ugliest possible version and see if it's fun.

---

## 11. Audio

Primary source is *A Game That Listens* (GDC 2016, Martin Stig Andersen). **Watched
and transcribed.** He frames the talk as three interlocking problems: death and
respawn, sound conducting in-game actions, and audio-driven gameplay — where the
game must read the sound to know its own state.

**Source caveat.** The only caption track YouTube serves for this talk is tagged
Danish and was transcribed with the wrong speech model — see the header of
`reference/transcripts/game-that-listens.txt`. The argument survives intact and the
mechanisms below are clear, but every *figure* is as the captions rendered it and
none is verified against slides. Treat numbers here as `[guess]` even where the
surrounding claim is `[doc]`.

- **[doc]** Wwise integrated with Unity, wired into animation and gameplay rather than bolted on.
- **[doc]** Martin Stig Andersen created sound using bone conduction through a human skull.
- **[doc]** Audio influenced design, not just the reverse. The cornfield originally had no rain; Andersen liked the idea and applied the sound treatment, the team responded well, and the scene was changed to match.
- **[doc]** For the huddle, Andersen took five to seven improv theatre performers into a forest, tied them together, had them move as one mass, and recorded the footsteps. Convincing audio early is part of what made the creature feel real enough to keep.

### The continuous audio engine

- **[doc]** The audio engine runs continuously from entering the game to exiting it. Sound is unaffected by anything happening in the game unless explicitly specified otherwise — the inverse of the usual arrangement, where audio follows game state.
- **[doc]** The cost is that every sound must then be accounted for. Dynamic objects with their own start and stop events are the hard part, and keeping an overview of them is real work.
- **[doc]** Sounds are split into two categories: those that restart on respawn, and those that play across it. The respawn handler stops everything *except* ambience, music and similar beds.
- **[doc]** Mix states also survive death and respawn, selected from a library of generic ones — fade out over a few seconds on death, fade back in after.

### Death and respawn

- **[doc]** The game sends a death event, then pauses audio event execution while the level unloads and reloads, then resumes it — so everything queued during the gap fires at the same point in time instead of scattering across the load.
- **[doc]** Loading a save point and respawning are deliberately *different* events. Come back from the menu after a few days and the musical cue plays again; die and respawn and it doesn't.
- **[doc]** On death the mix is ducked, not cut. Andersen's claim is that nobody notices, and that this is what stops repeated deaths turning a piece of music you liked into the sound of being stuck. The captions give the figure as 6 dB.
- **[doc]** He uses Limbo as his own counter-example. The hotel sign's musical cue stops on death and restarts on reload; he says he played Limbo carefully to avoid dying because of it. They had ideas for fixing this during Limbo and no time to build them.

### Respawning into the right part of the loop

This is the marching-figures puzzle, not the shockwave — two separate sequences that
are easy to conflate.

- **[doc]** The boy must follow a line of marching figures. The loop has two halves: walk during the first, stand still during the second. Doing the opposite kills him.
- **[doc]** The characters' footsteps are *in the music*. The music decides when they walk, rather than the animation triggering footstep sounds.
- **[doc]** Respawning in the first half would kill him instantly, so a segment is queued as the screen fades to black, timed so he never arrives in the lethal half — and offset by roughly half a second so he doesn't land exactly on the beat.

### Deciding the outcome before the audio needs it

- **[doc]** In the shockwave section a blast fires every six seconds and the boy must be in cover.
- **[doc]** The music has to know whether he survives *before* the blast happens, because the loop restarting is what triggers the shockwave — by the time the game knows the answer, it is too late to choose the right material. So the game checks whether he is in cover shortly before the loop point (the captions say ~50 ms) and commits to that outcome.
- **[doc]** Having committed, they honour the decision even if he leaves cover during the blast. Otherwise the audio and the game would be telling the player different things.
- **[doc]** The musical change lands when the puzzle is *logically* solved, not when the player physically leaves it — underlining that you got it right.

**Committing early is the transferable idea, and it is free.** Anything that must
react ahead of an outcome — music, a camera move, a light change — needs that outcome
decided before it is visible and then honoured even if the world disagrees. It is a
correctness rule, not a content cost.

### Music time versus game time

- **[doc]** The central engineering problem of the whole approach. Anchoring a mechanic to music puts it in *real* time; game time is frame-rate dependent. Five game-seconds and five real seconds are not the same thing, so a traversal that always worked can become impossible when the frame rate drops.
- **[doc]** Their debug view for the rotating cover: green bars mark solution positions and a yellow bar marks the cover's target, both locked to music time, while the cover itself runs on game time and continuously re-aligns toward the target.
- **[doc]** Slowed down hard, the cover visibly jumps between positions — "one thing I hope you never see in the game." The stated goal was that the puzzle stays solvable on a bad machine even when the motion stops being smooth.
- **[doc]** The target snaps to the nearest solution once the player is close enough. The game helps.

**This is the expensive half.** Syncing gameplay to music means every timing
guarantee now depends on real-world performance, and the fallback behaviour has to be
designed rather than discovered. A solo dev can have the continuous-audio half —
which is most of the emotional payoff — without ever anchoring a mechanic to a beat.

### Sound conducting the game

- **[doc]** Markers in the audio trigger events in the game. The flashing warning light before a shockwave is fired from a marker in the sound, not from game logic.
- **[doc]** The elevator crash: during development the elevator happened to hit the water on the beat, they liked it, and so its speed is now adjusted to land on the beat regardless of when in the loop the player triggers it.
- **[doc]** Audio drove a level-design change. The director and Andersen felt the shockwave section was too intense given a climax coming later, so the boy was sent inside a building to bring the mood down.

### The breathing loop

The clearest example of how tightly audio and animation are coupled, from the Konsoll talk.

- **[doc]** Breathing is two additive poses — inhaled and exhaled — blended on top of whatever animation is playing, including crouching and interacting.
- **[doc]** The poses are driven *by the audio system*, not by gameplay directly. Gameplay changes the sound; the sound then drives the visible breathing. Chest and head movement always match the audio because the audio is the source.
- **[doc]** Nearly anything can feed it: movement intensity, animation state, area triggers, individual interactions. Grabbing a lever produces a breath through the nose; pulling something heavy intensifies it.
- **[doc]** Recovery is slow and deliberate. After a chase, the breath takes a long time to settle.
- **[doc]** One override sits on top: jumping forces an inhale on takeoff and an exhale on landing, regardless of the current breath state, because mismatched breathing during jumps read as wrong.

**Worth copying as an architecture, not just an effect.** One signal (breath intensity)
fed by many gameplay sources, driving audio, with animation slaved to the audio. It
gives free continuity between systems that would otherwise have to be synchronised by
hand — and it's the same idea as letting the audio own respawn timing.

**The continuous audio engine is the cheap, high-value half of this talk.** Letting
the mix run across death, ducking instead of cutting, and splitting sounds into
restart-on-respawn versus play-across costs almost nothing and is the difference
between death feeling like a reset and death feeling like part of the scene. The
beat-synced puzzles are the expensive half and are separable. Strong candidate for
this project — and much easier built in from the start than retrofitted.

---

## 12. Performance and streaming

- **[doc]** Playdead gave a Unite 2016 talk specifically about continuously loading and unloading assets during gameplay without stutter, targeting a stutter-free 60fps.
- **[doc]** Two known problem areas: the rooftop section, where a camera pan looking further ahead than usual caused the whole world to load; and the first submarine parking area, where a tinted glass pane hid an almost complete forest's worth of polygons that were still being rendered.

**Takeaway:** continuous-world streaming is a real engineering problem, not a free
consequence of building one big level. If the project wants seamless space, that's a
system to plan, not a side effect.

---

## 13. Summary — what's stealable solo

| Technique | Cost | Verdict |
|---|---|---|
| Plane-constrained movement in 3D scenes | Low | Take it |
| "Inaccessible must look uninviting" rule | Free | Take it |
| 200ms response budget on every interaction | Free | Take it — testable constraint |
| Two exits from every animation (wait, or cut short on input) | Low | Take it |
| Minimum-duration timers for tiny inputs | Low | Take it |
| Grab as held state, stick = pull direction | Low | Take it |
| Procedural look-at layer for directing attention | Low | Take it |
| Additive poses instead of discrete animations | Low | Take it |
| Fake physics via a single velocity float | Low | Take it |
| Two verbs, taught in one enclosed room, never added to | Free | Take it |
| Make wrong solutions obviously wrong; delete puzzles that fail this | Free | Take it |
| Breath as one signal: gameplay → audio → animation | Medium | Take a reduced version |
| Debanding + volumetric fog + one strong key light | Low | Take it |
| Checkpoints so no puzzle is ever repeated | Low | Take it |
| Respawn into a running audio loop | Low | Take it |
| Duck the mix on death instead of cutting it | Low | Take it |
| Split sounds: restart-on-respawn vs play-across | Low | Take it |
| Commit to an outcome before the audio needs it | Free | Take it — a correctness rule |
| Anchor a mechanic to music time | High | Avoid — every timing guarantee becomes frame-rate dependent |
| Teach controls by obstacle order, no prompts | Low | Take it |
| "Turn it down 90%" restraint on VFX | Free | Take it |
| Darlings channel for puzzles that don't fit | Free | Take it |
| Limited palette, one accent colour | Free | Take it |
| Separate diffuse/specular/bounce light authoring | High | Approximate with per-area environments |
| Bespoke one-use mechanic per puzzle | Very high | Avoid — use a combinatorial model |
| Dense contextual animation | Very high | Reduce scope or design around it |
| Physics-driven creature (huddle) | Very high | No |
| Custom renderer / custom TAA | Very high | No — Godot defaults plus tuning |
| Seamless streaming world | High | Only if the design needs it |

---

## 14. Open questions

Unanswered. Fill in or delete as you learn.

- How exactly are the curving depth sections implemented — spline constraint, or invisible collision shaping a still-flat movement space?
- How are camera transitions triggered and blended?
- Is the checkpoint system manually placed or driven by puzzle state?
- What's in the Danish-language animation talk? Not yet watched.
- How did Wwise communicate state back to the engine? Andersen was asked this directly in the Q&A and said timeline markers were used during development but replaced by something else for the final game. The captions destroy the answer. The slides or the Wwise Tour talks may have it.

---

## Sources

### Playdead's own publications

Playdead maintain an index page with PDFs and video for everything they've published:
**https://blog.playdead.com/articles/inside_presentations/inside_publications.html**

Slide decks mirrored in their GitHub repo:
**https://github.com/playdeadgames/publications/tree/master/INSIDE**

Individual talks:

- *Low Complexity, High Fidelity: The Rendering of INSIDE* — GDC / GDCE 2016, Gjøl & Svendsen. The rendering source of truth.
  https://www.youtube.com/watch?v=RdN06E6Xn9E (non-paywalled GDCE version)
- *Temporal Reprojection Anti-Aliasing in INSIDE* — GDC 2016.
  https://www.youtube.com/watch?v=2XXS5UyNjjU
  Source code (MIT, Unity 5+): https://github.com/playdeadgames/temporal
- *Banding in Games* — DTU VisionDay 2014. Dithering to kill colour banding.
- *Custom Pixels* — GGJ 2015. Replacing all shaders in Unity for fully custom rendering.
- *Turn it Down 90% — INSIDE VFX* — Control Conference 2016.
  https://www.youtube.com/watch?v=vA3uFC2p8eo
- *Huddle Up! Making the [spoiler] of INSIDE* — GDC 2017. Physics-driven creature.
  https://www.youtube.com/watch?v=gFkYjAKuUCE
  Slides: https://media.gdcvault.com/gdc2017/Presentations/Grontved_Huddle%20Up!%20Making.pdf
- *A Game That Listens* — GDC 2016, Martin Stig Andersen. **Watched and transcribed.** Audio/gameplay feedback loops; the source for most of section 11. Note: YouTube serves only a Danish-tagged caption track for this talk, transcribed with the wrong speech model — names and figures in it are unreliable.
  https://www.youtube.com/watch?v=Dnd74MQMQ-E
- *Unbreaking Immersion* — Wwise 2016. Audio sequencer, breathing, the shockwave sequence.
- *The Boy From INSIDE* — AES 2016. Sound design of the main character.
- *The Playdead Approach to Audio* — ITU 2016. Wwise/Unity setup.
- *Tools, Tricks and Technologies for Reaching Stutter Free 60 FPS in INSIDE* — Unite 2016.
  https://www.youtube.com/watch?v=mQ2KTRn4BMI
- *Subtleties of INSIDE* — Konsoll 2017, Martin Fasterholdt. **Watched and transcribed.** The best source on game feel, control, and animation layering. Section 9 is drawn almost entirely from it.
  https://www.youtube.com/watch?v=3pzgnN3pK_8
- *INSIDE Shipping on iOS* — Digital Dragons 2018.
  https://www.youtube.com/watch?v=bv6Oh4GWk2A

### Design

- Steve Swink, *Game Feel*. Recommended by Fasterholdt; source of the 200ms real-time-control figure.
- Jeppe Carlsen, *LIMBO: Balancing Fun and Frustration in Puzzle Design*, GDC 2010. About Limbo, but the philosophy carries directly.
  Summary: https://www.gamespot.com/articles/limbo-level-designer-talks-puzzles/1100-6273547/

### Interviews and analysis

- *Inside Inside* — Jeremy Hosking interviewing Peter Buchardt, commissioned by Kotaku UK, 2018. The best single source on how Playdead actually worked day to day.
  https://jeremyhosking.medium.com/inside-inside-3c55746dc46c
- *Inside — Teaching through Level Design*, Game Developer. Opening-forest breakdown.
  https://www.gamedeveloper.com/design/inside---teaching-through-level-design
- Playdead Unofficial Museum — fan-maintained index of interviews and talks.
  https://sites.google.com/view/playdeadunofficialmuseum/interviews-talks

### Academic

- "Inside the Loop: The Audio Functionality of Inside" — peer-reviewed analysis of the shockwave sequence and audio-led respawn.
  https://link.springer.com/article/10.1007/s40869-018-0071-x
