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
- **[doc]** The same pattern recurs on Inside. A single drawing by the lead artist — "the huddle drawing", a potato — was referred to throughout production for modelling, shading, lighting and shadowing decisions across the whole game, not only the creature. Two projects, two cases of one image doing a design document's job. *(Huddle Up!, GDC 2017)*

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

Primary source is the GDC / GDC Europe 2016 rendering talk by Mikkel Gjøl (graphics
programmer, first half) and Mikkel Svendsen (technical artist, second half).
**Watched and transcribed.** Slides are public and carry the shader code.

### Why any of this matters

- **[doc]** The fixed camera is the root of the whole approach. Because framing never changes, artists can tune every pixel knowing it will look on the player's screen exactly as it does on theirs — so the game can lean on very subtle detail.
- **[doc]** That is also the constraint: subtle detail cannot survive distracting artefacts, so banding, flickering and aliasing are unacceptable in a way they would not be in another game. **The art direction generates the technical requirements**, not the other way round.
- **[doc]** Shipped at 60 FPS, 1080p, on every target. Unity with a source licence, so the engine itself was modified.
- **[doc]** Light pre-pass rendering: base pass writes depth and normals; a light pass samples those and outputs lighting; a final pass applies materials and samples the lighting; then translucency; then post.

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

### Fog, and the cheapest atmosphere in the talk

- **[doc]** Many scenes were literally just geometry plus a **linear depth fog** — Gjøl shows one with and without, and the fog alone makes it moody.
- **[doc]** One detail makes it work: the fog's intensity is **clamped to a maximum** so bright light sources still punch through. Exponential fog converges toward full opacity and swallows them.
- **[doc]** Their "atmospheric scattering" is **a very wide glow** — blur the whole screen and add it back on top. Gjøl is almost apologetic about how simple it is; the artists got a great deal out of it.
- **[doc]** A second, *narrow* high-intensity glow comes from an emissive mask remapped to an HDR range. The trap they hit: if a pixel produces a large bloom but is not itself rendered bright, it reads as wrong — so the **HDR values have to be written back**.
- **[doc]** Order matters: **temporal anti-aliasing runs before the HDR bloom**, because a little aliasing at high intensity flickers badly.

### Banding, and why it gets its own section

This is the most directly stealable material Playdead published.

- **[doc]** Output is 8-bit per channel; the eye perceives something closer to 14. Higher-precision buffers were too slow on some platforms, and sRGB targets had awkward platform implementations, so they dithered instead.
- **[doc]** The principle: add one bit of uniform noise before quantising, and the quantised result averages out to the original signal.
- **[doc]** Gjøl is emphatic that this is **two lines in a pixel shader** — add a random number on output — and says there is no reason any game should ship with banding, indies included.
- **[doc]** Uniform noise has a flaw called **noise modulation**: the error depends on the signal, so you get visible bands with no noise in them. Switching to a **triangular distribution** makes the error independent of the signal, at the cost of two bits of noise rather than one.
- **[doc]** To get that back, use **blue noise with a triangular distribution** — visibly less noisy and no bands. Implemented as a precomputed blue-noise texture for cache coherency, with an ALU version (two white noises summed) where bandwidth-bound.
- **[doc]** **What to dither matters as much as how.** The lighting pass, then the final pass, which re-quantises when it reads lighting and writes 8-bit. The **translucency pass is possibly the most important**, because blending reads and writes the same target repeatedly and re-quantises every time. The post pass too. They pushed their wide-glow pass to a 10-bit target with power-of-two compression on top.
- **[doc]** Banding is about quantisation, not colour, so **normals get dithered too** — needed only where intense speculars meet normals varying across large surfaces.
- **[doc]** **Animate the noise**, or it sits on the screen like dust on a lens as the camera moves. Animated noise also gets integrated away by the temporal anti-aliasing, which is a bonus.
- **[doc]** Dither the UI as well — it is mostly transparencies and fades. And output in the display's correct range so you dither the signal rather than leaving a television's limited-range conversion to do it badly.

### Noise, patterns, and blue noise

- **[doc]** The finding underneath several effects: **the eye is forgiving toward noise and unforgiving toward patterns.** White noise is cheap but noisy. A Bayer matrix gives good local coverage but reads as a pattern, which is worse.
- **[doc]** **Blue noise** — high-pass-filtered white noise — keeps the local-coverage property without being a pattern, and roughly halved the sample counts they needed. Svendsen's summary at the end of the talk is simply that blue noise is the general saviour and you should use it too.

### Local fog volumes

The flashlight effect, and a good worked example of getting an expensive thing cheap.

- **[doc]** Naively ray-marching to the depth buffer sampling the projected texture, shadow map and falloff took 128 samples and over a frame and a half.
- **[doc]** Fog is authored as **boxes**, intersected geometrically with the light frustum — clip the frustum by each box plane and patch the holes — so sampling only happens where both exist. Front faces and back faces are rendered in two passes to bound the march.
- **[doc]** The effect is smooth, so it runs at **half resolution** and is upsampled. The upsample deliberately adds a noisy blur to break up the half-resolution structure, which also feeds the temporal anti-aliasing: their TAA uses neighbourhood clipping, which handles per-pixel noise well and half-resolution noise badly.
- **[doc]** The shipped version is around three samples at half resolution — **under one sample per full-resolution pixel** — in under a millisecond. Shadow maps and projected textures are also downscaled, since the effect is blurry anyway.
- **[doc]** The same boxes carry effects: above water the light is sampled as-is; below, an animated texture fakes caustics.

### Light types

- **[doc]** Because the light pass just writes into a buffer, they could add custom light types freely.
- **[doc]** The **bounce light** is the simplest and does the pseudo-global-illumination work by hand: a wrapped or double-Lambert term with an artist-facing **hardness** parameter that fades the front-to-back dot product. The effect is to blur where the light appears to come from, so it reads as an area rather than a point, and can be faded all the way to flat ambient.

### VFX techniques worth remembering

- **[doc]** **Fire is coloured once, not per sprite.** Individually coloured sprites stack during blending into implausible brightness, so instead they render black-and-white "hotness" sprites additively into a single buffer — reusing the HDR bloom alpha, since fire blooms anyway — and apply **one gradient** on read-back.
- **[doc]** Their flipbook animation avoids two failure modes at once: sequential frames make a short loop obvious, and random frames repeat often enough that a repeat reads as lag. The fix is **sequential columns with random rows**. Frames cross-fade along a vertical gradient with noise rather than cutting.
- **[doc]** **Rain is a mesh of individual raindrops** with a vertex shader that wraps a drop back to the top of the volume when it reaches the bottom. Splashes expand with random rotation and reposition on the integer part of time while animating on the fractional part. Scrolling post effects had no parallax; scrolling sprites had too much overdraw.
- **[doc]** **Lens flare occlusion without ray casts or colliders**: sample the depth buffer stochastically **per vertex** — four samples for a quad rather than anything per-pixel — and multiply into the flare. Offsetting those samples off-centre gives a free gradient across the flare, since you are sampling all four corners anyway.
- **[doc]** Screen-space reflections need an assumed wall thickness, or objects stretch — the artists' name for the artefact was "the boy with MC Hammer pants." Using the screen-space ray's movement as the thickness fails on a wall at 45° to the viewer, where the ray barely moves; using the reflection direction itself works.
- **[doc]** Large water uses **planar reflections, not screen-space** — a surface spanning most of the screen shows the artefacts too readily. Layers are rendered as separate objects and the order flips when the camera goes under. Each layer writes an "already rendered water" stencil bit and later geometry reading that bit discards, which lets them render front-to-back with rejection instead of back-to-front.
- **[doc]** The tiling trick for foam: wavy cobblestones tile perfectly without looking tiled, so they traced the wave lines from a photograph, layered stock wave imagery underneath, and removed the lines.

**Godot translation:**

- `WorldEnvironment` with volumetric fog on. Set fog to fall off linearly rather than exponentially if bright sources need to punch through it — that clamp is what keeps lights readable through heavy fog.
- **Debanding on in project settings from day one.** Godot's debanding is the same idea as Gjøl's two lines, applied at the end of the pipeline, and it is free. Worth knowing what it does *not* cover: it dithers the final output, not every intermediate pass. Playdead found the translucency pass the most important one to dither because blending re-quantises repeatedly, so heavy layered transparency plus wide fog gradients is where banding may still appear.
- Animate any noise you add yourself. Static noise reads as dirt on the lens the moment the camera moves.
- One strong key light per shot, plus fill. Godot doesn't split diffuse/specular/bounce authoring, so the equivalent is per-area Environment overrides and careful light energy. The bounce light's *hardness* idea — softening the falloff until the source is ambiguous — transfers as a light with low energy and wide range rather than a tight one.
- Grey-box test corridor with one light and fog, tuned before any real modelling. Godot's defaults will not look like this; the knobs are where the style lives.

---

## 8. Art direction and VFX

Primary source is *Turn it Down 90%* (Control Conference 2016, Mikkel Bøgeskov
Svendsen). **Watched and transcribed.** He joined after Limbo shipped and ended up on
VFX without expecting to.

- **[obs]** Low polygon counts, near-absent albedo detail, no visible normal-map work.
- **[obs]** Near-monochrome palette. The boy's red shirt is the only saturated colour for most of the game and anchors the eye in every frame.
- **[obs]** Environment silhouettes carry readability; shapes are simple and high-contrast against fog.

### The title is the method

- **[doc]** He arrived wanting to prove himself — the biggest explosions, the best rain, tens of thousands of rendered figures. The advice that corrected it was literally "how about you turn it down ninety percent", and he says it took a long time to sink in.
- **[doc]** His framing for the discipline: game VFX is the cherry on top, and like film CGI or stage makeup, people only remark on it when it's *bad*. The best version is the one nobody notices.
- **[doc]** The tuning instruction he was given, and the most usable line in the talk: **turn it down until it becomes uncomfortable**, then live with the discomfort. He describes it being uncomfortable for a few days before he began to enjoy the omission.
- **[doc]** Two concrete rules from it: don't make the rain the brightest thing on screen, and don't colour smoke opaque grey or yellow just because that is "smoke colour".
- **[doc]** The shipped rain is dim enough to read mainly on shaded surfaces and under a lamp post. The intent: you hear rain, your eye goes looking for it, and it is there. That is the whole requirement.

### Integrate rather than add

- **[doc]** The first water waves were additive and lit from a cube map, because that was the easy and fashionable approach. The result was reflections with no source in the scene — motion replaced by a distraction. The shipped version blends normally and samples the *same* reflection and refraction maps the water already uses, so it sits inside the picture rather than on top of it.
- **[doc]** Smoke is authored as two picked colours, a lit side and a shaded side, sampled from what is actually around it. The shader takes the dot product of the normal against a **custom light direction chosen per smokestack** — there is no single sun to reference — and blends between the two. He describes it as deliberately camouflaging the effect into the environment.
- **[doc]** Their standard particle shader **does not accept colour from the texture at all**, only alpha, with colour coming from that two-tone blend. The alpha is deliberately low-detail; variation comes from random rotation and random size instead.
- **[doc]** Lens flares were going to have rainbows. In a near-monochrome game they went monochrome almost immediately.
- **[doc]** The first water normal map was an ocean, generated from cellular noise with every octave, with screen distortion. It was a pond. The shipped version is a subtle bump that satisfies the need for motion and nothing more.

### Detail has a floor, not a ceiling

- **[doc]** Sub-particle motion — UV distortion sampled from a motion texture before the real texture — was taken from a Naughty Dog technique, chosen to keep overdraw low.
- **[doc]** His first attempt used sharp Perlin noise from a 3D package, on the reasoning that turbulence is what smoke does. It was too detailed to work even turned down entirely. The replacement was made in Photoshop from a UV gradient with a swirl filter applied and tiled — he calls it "world noise" — and it reads as slow, viscous motion at about ten percent strength.
- **[doc]** That particle system contains roughly **eight particles**.
- **[doc]** The rule he quotes from a mentor: **your work is only as good as its worst detail.** One detail too many either falls apart or reads slightly wrong, and wrong is attention-grabbing. *(The mentor's name is destroyed in the captions and is not reproduced here.)*

### Water edge displacement

The one deeply technical item, and a good illustration of the cost of things nobody sees.

- **[doc]** Crossing the waterline, the surface was a flat polygon — visible for perhaps two frames, and jarring after seeing it bumpy from above. The fix was a tessellated edge with displacement mapping near the camera.
- **[doc]** That introduced a hard cutoff at the top and bottom of the water band. The solution traces toward the horizon tracking the lowest and highest wave found, then fades each vertex out as it approaches either extreme while staying sharp at the horizon, using a remap (inverse lerp) on data carried from the vertex shader.
- **[doc]** He describes it as weeks of despairing work, so that the player does not notice a flat-pancake water surface.

### Deleting things

- **[doc]** Sometimes the right answer is removal, not restraint: an effect too aggressive, ten thousand figures replaced by a line in the background, a flourish dropped because the scene was already strange enough.
- **[doc]** He is openly unhappy about "kill your darlings" as a phrase, and gives a better reason for it: **you delete what you are too close to, because proximity removes your ability to judge whether it fits.**
- **[doc]** The counterweight, stated explicitly: they do turn it up to eleven once or twice, and knowing when you are the lead violinist and when you are not is the actual skill.
- **[doc]** He credits every lesson in the talk to mentorship rather than to himself.

**The trade for a solo dev:** the art style removes texture authoring, UV work and PBR
material sets almost entirely, and moves the cost into lighting. Good trade — lighting
is learnable alone. But low-poly under flat lighting looks like an asset pack, not
like Inside.

**"Turn it down until it becomes uncomfortable" is the version to keep.** It is an
actual procedure rather than an aspiration, and it costs nothing but nerve. Note that
this is a different move from the darlings channel in §5 — that one finds a home for
work that doesn't fit, this one deletes it.


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

### How the huddle actually works

From *Huddle Up!* (GDC 2017), three speakers: the animator, the senior programmer and
a gameplay programmer. **Watched and transcribed.** Two of the three names are
destroyed by the captions and are not reproduced here.

**Conception.** The animator's job before production was to find the movement.

- **[doc]** The reference wasn't a spec but a single drawing by the lead artist, known internally as "the huddle drawing" — a potato. It was consulted throughout production for decisions on modelling, shading, lighting and shadowing, **and not only for the huddle but for the whole game**. This is the concept-art-as-design-document pattern from §2, named.
- **[doc]** Three stated inspirations: the demon boar from *Princess Mononoke*, which morphs and grows a limb wherever its purpose requires one; the physics blob game *Gish*, which deforms to squeeze through gaps; and **crowd surfing** — many hands with a shared goal but different motives, some lifting gently, some holding you in place, some trying to bring you down. The huddle is framed as a cluster of individuals with one goal and conflicting motives.
- **[doc]** The concept rig was deliberately crude — four spine bones, points scattered over the surface, six legs, several arms and torsos, two free-floating bodies — so limbs could be pulled inside and pushed out elsewhere. Fast to animate with no rig in the way.
- **[doc]** The first concept animations date to **late 2010**, months after Limbo shipped. Around **40** were made before any production work, described as a spot on the horizon to aim for. He says the team outdid them by miles.
- **[doc]** Silhouette beat plausibility explicitly: three arms grip the swinging crane where plausibility would want twenty.

**The core, from the senior programmer.**

- **[doc]** **26 dynamic bodies** — rigid bodies with colliders, stepped by a custom physics model. On top of them sit the same number of *internal bones*, caching position, velocity and mass and accumulating the impulses that get synced back.
- **[doc]** An **adjacency graph** links nearest neighbours. At boot the bodies are placed on a sphere and the edges are established then — **the edge configuration never changes again**. Each edge is a spring with a target length, and the target lengths deform continuously with the core's scale and height.
- **[doc]** **Two spine bones** sit above all that, driven by logic states and a little animation rather than by physics. Each owns a *cluster* of internal bones which hold local positions relative to it, so applying torque to the top spine bone drags its cluster along. The programmer's phrase for this is "skimming the physics" — macro control over a simulation you don't otherwise steer.
- **[doc]** Because many largely independent systems all push impulses into one core, the result is explicitly **emergent** — unpredictable, and tuned by constant tweaking rather than designed to a spec.
- **[doc]** Landing non-vertically is normal, and rotating the spine upright looked silly. Instead they **reconfigure the spine** so the structure rises. Doing that instantly pops, because every constraint changes at once, so the **rest lengths are blended** to hide it. He states the general rule plainly: they worked very hard to avoid any visible pop.

**The visual layer, from the gameplay programmer.** The best part of the talk, because
it is so much cheaper than it looks.

- **[doc]** He joined while the core was a buggy floating blob, and was **not allowed to touch the physics** because it changed constantly. His job was a thin visual layer, done early specifically to find out whether the thing could ever be convincing.
- **[doc]** His demonstration: the *shipped* huddle with its legs hidden looks like something you would doubt could ever ship. His analogy is the internet joke of crude stick arms drawn onto a bird, which makes it a different animal entirely. The legs are what sell the mass.
- **[doc]** The mesh covers the **front only** — the back is empty because it is never seen. Six legs attach to physics bodies at the bottom, six arms at the top (one of which is a leg behaving as an arm), and they reconfigure when the creature turns so the silhouette always reads.
- **[doc]** Loose body parts on the front were ragdolls glued on, swapped later for **custom springs** for performance. Losing the ragdolls lost their collision, so the parts now **retract near walls** to stop them clipping. Small forces on the springs make them squirm, so they read as alive rather than as an unconscious body.
- **[doc]** **The entire leg system uses seven animations**: two running forward, two running backward (played in reverse), one stumble over an edge, two falling. The algorithm is: raycast down from the attachment body to find the ground, **blend between the high and low run cycle by distance to ground**, and **drive playback speed directly from the physics body's velocity**.
- **[doc]** The refinements are small and specific: on stopping, blend to a pose with the foot down, because nobody stands with a foot in the air. Leg phase offset changes by gait — together at rest, maximally apart walking, about 25% apart galloping.
- **[doc]** Sliding on a slippery floor is **the animation frozen** while the physics runs unchanged, plus a slide sound.
- **[doc]** Each foot plant sends a small **shockwave of impulses up the body** so the mass jiggles. He admits it is hard to see, and says it makes a large difference in play — the difference between an animal and something translating through space.
- **[doc]** The arms work the same way. Grabbing is a physics model; the arms are flavour on top. The two animations used most are a **grab that is scrubbed by play position** so it reaches different distances, and a retract for when a dynamic arm is finished and withdraws into the body.
- **[doc]** The production rule underneath all of it: they tweaked the huddle for the gameplay they needed, and **where they could not make it work they deleted the gameplay and designed something else the system could do**.

**Honest note:** animation is the most likely bottleneck for a solo dev and the one
least helped by the low-poly art style. Two options: budget for it explicitly, or
design a game that needs less of it.

**The prototype-in-a-month pattern is worth copying.** Before committing to an expensive
mechanic, build the ugliest possible version and see if it's fun.

**The leg system is the most encouraging thing in this whole file.** Seven animations,
a downward raycast, one blend on height and one mapping from velocity to playback
speed — and it carries a creature people assume was hand-animated for years. The
expensive part of the huddle was the core simulation; the part that makes it *read* is
cheap and within reach. Where animation budget is tight, look for the equivalent
trick before authoring more clips.

**"If the system can't do it, change the gameplay" is the production lesson.** They
had four years and a dedicated programmer and still bent the design to the tech rather
than the other way round. A solo dev has less room, not more.

---

## 11. Audio

Primary sources are *A Game That Listens* (GDC 2016, Martin Stig Andersen) and parts
2 and 3 of *Unbreaking Immersion* (Wwise Tour 2016, Andersen with Jakob Schmid).
**All watched and transcribed.** The GDC talk frames three interlocking problems:
death and respawn, sound conducting in-game actions, and audio-driven gameplay —
where the game must read the sound to know its own state. The Wwise talks are the
implementation, from the programmer's side.

**Source caveat.** The only caption track YouTube serves for this talk is tagged
Danish and was transcribed with the wrong speech model — see the header of
`reference/transcripts/game-that-listens.txt`. The argument survives intact and the
mechanisms below are clear, but every *figure* is as the captions rendered it and
none is verified against slides. Treat numbers here as `[guess]` even where the
surrounding claim is `[doc]`. The Wwise transcripts are clean English and do not
carry this problem — where they cover the same ground they are the better source, and
they independently confirm the six-second shockwave loop.

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
- **[doc]** The background flashes in the shockwave section are fired from **markers placed in the music**, not from game logic. Because each musical variation has different rhythmic content, Andersen decides per variation where the flash lands. He states the inversion directly: normally the game triggers sound events; here the game creates things from events the sound triggers.
- **[doc]** The mix is shaped continuously rather than switched. Ambience and the boy's voice are both **side-chained to the shockwave**, giving a pumping effect and making him quieter as the blast is louder. Reverb is enveloped so the world "sucks in" about two seconds before each blast and opens out after.
- **[doc]** In and out of cover are different filter states — muffled inside, bright and exposed outside — with a small reverb in cover and a large one outside.
- **[doc]** On surviving a blast he ducks the boy's footsteps by roughly 12 dB for the following six seconds, because he does not want to hear them at that moment. Sound effects are also pitched to fit the music, one example being a sound dropped around 300 cents.
- **[doc]** A layer he calls **state ambient** sits on top of the musical pulse: sustained tones whose volume *and* retrigger interval are both randomised, so the texture varies continuously without a loop becoming audible.

### Voice direction

- **[doc]** Andersen describes the setup as directing an actor: the sequencer performs, and he gives it direction per place and per event. The mechanisms are trigger boxes in the level, state machines, scripts, and direct parameter control.
- **[doc]** Trigger boxes are placed at z = 0, since the world is 3D but the gameplay is a plane.
- **[doc]** Each direction can set emotion, intensity or action independently, leaving the others alone. It can also lie — making him *sound* like he is landing during a custom animation that is not a landing.
- **[doc]** Intensity is generated by movement — a smoothed measure of how hard he is working — and then **clamped** per area, for example to a 50–75 band. The clamp can be **interpolated across space**, so a room gets more frightening toward one side, or **over time**, so he starts at maximum and relaxes over about five seconds regardless of where he is.

### The scene change

How the audio survives death, from the programmer's side. Andersen's name for it is a
theatre scene change: the curtain closes, people run about moving furniture, the
curtain opens, and nothing appears to have happened.

- **[doc]** On death the game unloads every non-static scene — anything physics or logic can have disturbed — and loads the respawn point. The audio must come through with its state unchanged.
- **[doc]** The sequence: a death event fires so the audio can prepare; the respawn point is already known, so a prepare-spawn event fires too; the screen goes black; **the game stops calling `RenderAudio()`**; scenes unload, scene-placed sounds stop, new scenes load and their trigger boxes fire; a spawn event posts; then `RenderAudio()` resumes.
- **[doc]** Freezing Wwise by simply not rendering is described as the absolutely simplest way to make it retain state. The commands issued meanwhile accumulate in a buffer and all execute in a single audio frame when rendering restarts.
- **[doc]** That single-frame burst overran Xbox's standard 512-sample buffer, so they doubled it. The added latency was judged not noticeable.
- **[doc]** The death fade is six seconds — the length of the shockwave loop — which is how the player lands back at the same point in the cycle.

### The breathing loop

The clearest example of how tightly audio and animation are coupled. The Konsoll talk
describes the result; the Wwise talk gives the mechanism.

- **[doc]** Breathing is two additive poses — inhaled and exhaled — blended on top of whatever animation is playing, including crouching and interacting.
- **[doc]** The poses are driven *by the audio system*, not by gameplay directly. Gameplay changes the sound; the sound then drives the visible breathing. Chest and head movement always match the audio because the audio is the source.
- **[doc]** Concretely: a small sequencer written in Unity script posts a Wwise event, asks for a callback when it finishes, and posts the next one on that callback. The **recorded sounds' own lengths therefore define the rhythm** — uneven, and natural because of it. The same callbacks drive the additive pose, which is why they cannot drift apart.
- **[doc]** Everything hangs off **one Wwise event** at the top of a switch hierarchy: action, then theme, then emotion, then cycle (inhale or exhale).
- **[doc]** Three axes, all settable at runtime: **action** (what he's doing), **emotion** (the situation), **intensity** (exhaustion, or emotional charge). Emotions in the hierarchy include panic, alert, determined, frantic, relaxed, relieved and strangled.
- **[doc]** A `sneak` theme exists alongside `normal`, because it is largely a stealth game and Andersen is explicit that a character making ordinary noise while sneaking breaks it for him.
- **[doc]** Intensity is a continuous parameter banded into musical dynamics — piano, mezzo-forte, forte — rather than numbered 1–10. His reasoning: hearing a sound, he can always say which dynamic it is, where a number means nothing. The same scale is used for physics sounds.
- **[doc]** Intensity updates only when a breath is taken, which Schmid believes is performance-related.
- **[doc]** The voice is mixed in plain stereo, and its volume depends on distance to camera **and the angle of the boy's head** — facing the camera is louder, facing away raises the reverb. This is the look-at layer from §9 feeding the mix.
- **[doc]** Recovery is slow and deliberate. After a chase, the breath takes a long time to settle.
- **[doc]** Jumping is a special case rather than a simple override. You hold your breath in the air: if he is inhaling the sequence just stops there, and if he is exhaling a *quick* inhale is inserted so he is full of air on landing. Landing always begins with an exhale, and an impact value derived from speed chooses between a normal exhale and a grunt.
- **[doc]** Grabbing is split into **passive engagement** (taking hold, bracing) and **active engagement** (actually pushing or pulling).

### Beat-matching the breath to the footsteps

- **[doc]** Running switches the sequencer from stitching sounds together to spacing them out, targeting one breath per two steps.
- **[doc]** Snapping to that instantly sounded forced, so Schmid treated it as a **frequency and phase alignment problem**. The run cycle runs 0–1 with each step at half phase; breathing wants half the run's frequency. The current breathing rhythm is analysed for its own frequency and phase, and then nudged toward the footsteps.
- **[doc]** The stated model is a **DJ beat-matching two turntables**: if the tempo is off, adjust pitch; if the phase is behind, over-correct until it catches. Applied gradually, the two align without the transition being audible.

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

Primary source is *Tools, Tricks and Technologies for Reaching Stutter Free 60 FPS*
(Unite 2016), three Playdead programmers. **Watched and transcribed.** Much of it is
Unity-specific and marked as such; the structural ideas are not.

- **[doc]** The stated company principle: **technology should never cause a distraction from the game experience.** For Inside that meant no loading screens from start to finish, no streaming artefacts, and no frame-rate stutter at 60 FPS on console. One speaker notes the consequence — do the job perfectly and nobody notices you did anything.
- **[doc]** Two known problem areas: the rooftop section, where a camera pan looking further ahead than usual caused the whole world to load; and the first submarine parking area, where a tinted glass pane hid an almost complete forest's worth of polygons that were still being rendered.

### How the world is cut up

- **[doc]** Content is split spatially into **subscenes**, of which Inside has about **250**, organised as areas (forest, farm, city) → individual puzzles → subscenes. A puzzle is roughly **100 metres, or one to three minutes of play**.
- **[doc]** Each chunk splits three ways: **backdrop**, **environment** (graphics), and **gameplay** (collision and anything the player interacts with).
- **[doc]** The split earns its keep because only **gameplay scenes are mutable**; environment and backdrop are treated as conceptually immutable — a tree may wave, but the scene's state is always consistent. So **respawn only reloads the dirty gameplay scenes**, not the world around them.
- **[doc]** Three zones: scenes inside the view frustum are active; a surrounding **prepare zone** loads and readies them; beyond that they unload.

### Five tests before an expensive object is active

- **[doc]** A **potential visible set** per location, generated by a frustum, which a **level artist then manually prunes** using knowledge the geometry doesn't carry — one example goes from eight scenes to five.
- **[doc]** Scene contents are rarely evenly distributed, so a **voxel grid** is built inside each scene at build time and serialised. At runtime the frustum is tested against the scene bounds, then against the voxels.
- **[doc]** Custom **bounds volumes** per object, and **facing planes** — a plane where the object is only active if the camera sees its front. Their example limits a spotlight's bounds to where the light actually lands.
- **[doc]** The same bounds subdivide a scene into sections, so activation happens at that granularity rather than whole-scene.
- **[doc]** All five must pass: scene in the visible set, scene in the frustum, active voxels in the frustum, section visible, object's own bounds visible.

### Spreading the cost over frames

- **[doc]** **Pre-awake**: load the scene inactive so initialisation hasn't run, cache the initialisation steps at build time, then run **one step per object per frame** before activating. Whatever remains in the real initialisation must be fast.
- **[doc]** **Late awake**: a frame delay after activation for parts that can afford to appear slightly later. This is what removed their last stutters.
- **[doc]** Unloading is time-sliced too — a bottom-up destroy of small pieces. A **scheduler** distributes all this work across frames by priority, with unload ranked below activate.
- **[doc]** Work moves to build time wherever possible, and shaders and expensive data structures are pre-warmed during the initial load, before gameplay starts.
- **[doc]** **Death and chapter load are used as cover** for the expensive collection and asset-unloading passes that would stutter during play. This is the same instinct as the audio scene change in §11 — do the costly thing behind the curtain.

### The tools, which are half the talk

- **[doc]** A **safe-point profiler**: load a scene, place the boy at a checkpoint, let culling settle, sample. Repeated at every safe point in the game. Because nothing is moving, the result is a **base cost per location**, and the profiler's slider scrubs through *places* rather than time.
- **[doc]** Run nightly on the target hardware by the build server, which gives a **history** — per-subscene performance over the project, so regressions are visible rather than discovered.
- **[doc]** A **subscene lifecycle profiler** measures load → activate → deactivate for one subscene with all other systems disabled, which is where a load spike shows up.
- **[doc]** **Automated playback**: recorded controller input replayed between safe points, with profiling modules attached. The game is not fully deterministic, so the character drifts and needs positional correction to stay in sync.
- **[doc]** The playback modules map onto the game's linear path — a frame-rate graph drawn along the character's route in the scene view, memory with garbage-collection events visible against frame spikes, and a subscene state timeline. That timeline has a state worth stealing: **loaded and then unloaded without ever being activated**, which flags a visible set or culling bound that was set up wrong.

### Unity-specific, noted for honesty

- **[doc]** A **zero-garbage policy** — no per-frame allocation, and an entire playthrough fitting in a 400 MB pre-allocated managed heap.
- **[doc]** They modified Unity's source: time-sliced scene integration and animation initialisation, faster object activation, and a garbage collector changed to run only when the heap is full rather than at around 20% usage.
- **[doc]** Their micro-optimisation list is mostly about avoiding the engine: build your own update manager instead of per-object update callbacks (**worth one to two milliseconds a frame**), never `foreach`, avoid runtime instantiation, cache transforms, prefer local position and rotation, avoid string concatenation, and replace C# events — internally a linked list for thread safety they didn't need — with an array.
- **[doc]** Asked how they learned all this: the profiler, repeatedly, chasing each source of garbage to the script that caused it. "Practice and a lot of work."

**When they did it matters more than what they did.** Garbage was kept in check from
early, but the bulk of the optimisation happened in the **final year of a six-year
project**, once the art was in and the game was, in their words, something most people
would have called finished a year before it shipped.

**Why they stayed on Unity, in their own words:** because they don't design up front.
They set things up, try them, discard around 70%, and a game emerges. Fast turnaround
mattered more than raw efficiency, and they judged that a less flexible engine would
have cost them quality.

**Almost none of this is a solo dev's problem yet, and that's the point.** Streaming a
seamless world is a system to plan, not a side effect of building one big level. Two
things do transfer now, both free: splitting a level into mutable gameplay and
immutable environment so a respawn only reloads what changed, and doing expensive work
behind whatever curtain the game already has.

**Takeaway:** continuous-world streaming is a real engineering problem, not a free
consequence of building one big level. If the project wants seamless space, that's a
system to plan, not a side effect.

### From the audio side

Schmid's half of the Wwise talk, and the most transferable performance material
Playdead published.

- **[doc]** **No allocations at runtime.** Garbage collection freezes the whole game and produces a frame spike, which he names as the visible flaw in most lower-tier Unity games. Everything else below follows from this rule.
- **[doc]** Where allocation was unavoidable they removed the cause rather than tolerating it: Wwise's user cues from the music allocated a string per callback, so they hashed the strings in the plugin source and compared hashes instead.
- **[doc]** The Unity-side wrapper was the performance problem, not Wwise. Its `MonoBehaviour` API calls were "unreasonably slow", so they stripped what they could — including a per-object component check, replaced with an assumption that it is present and an error if not.
- **[doc]** **Virtual voices** are called a free win: enabled indiscriminately, they culled enough inaudible sounds to recover meaningful CPU with no cleverness required. Schmid's advice is to have them on by default and trim back only if needed.
- **[doc]** They were using the entire CPU budget on Xbox, largely because of convolution reverb, which Andersen was unwilling to give up.
- **[doc]** A 2D game has a small enough state space to be genuinely testable — they could profile a whole playthrough and compare two runs.
- **[doc]** The debugging trick worth stealing: an inaudible glitch (256-sample blocks of silence) was found by **recording every playtest in Audacity and reading the spectrogram**, where each one shows as an obvious vertical line. Andersen could hear that something was wrong before anyone could find it.
- **[doc]** They used Playmaker for state machines and say plainly that they sometimes wish they had not, because it does not perform well.

**The allocation rule is the one that transfers.** It is engine-independent and it is
about the thing players actually notice — a frame spike mid-jump. Godot has its own
allocation costs rather than a Mono GC, but the discipline is the same: don't
allocate in a per-frame path.

**The spectrogram trick is nearly free** and applies to any intermittent audio bug.

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
| Clamp fog intensity so bright sources still read through it | Free | Take it |
| Blue noise over white noise or a Bayer matrix, wherever you jitter | Low | Take it — the eye forgives noise, not patterns |
| Colour a stacked effect once on read-back, not per sprite | Low | Take it |
| Flipbook: sequential columns, random rows | Free | Take it |
| Checkpoints so no puzzle is ever repeated | Low | Take it |
| Respawn into a running audio loop | Low | Take it |
| Freeze the audio engine across a level load, then let it catch up | Low | Take it — this is how respawn-into-the-loop actually works |
| Drive the breath sequencer from audio callbacks, animation slaved to it | Low | Take it |
| Band a continuous parameter into musical dynamics rather than 1-10 | Free | Take it |
| Trigger visual events from markers in the music | Low | Take it |
| No allocations in per-frame code | Free | Take it — a discipline, not a feature |
| Beat-match breathing to footsteps by phase alignment | Medium | Skip unless running is central |
| Duck the mix on death instead of cutting it | Low | Take it |
| Split sounds: restart-on-respawn vs play-across | Low | Take it |
| Commit to an outcome before the audio needs it | Free | Take it — a correctness rule |
| Anchor a mechanic to music time | High | Avoid — every timing guarantee becomes frame-rate dependent |
| Teach controls by obstacle order, no prompts | Low | Take it |
| "Turn it down 90%" restraint on VFX | Free | Take it |
| Tune an effect down until it is uncomfortable, then leave it | Free | Take it — an actual procedure |
| Colour effects from the scene (lit/shaded picked colours), not from the texture | Low | Take it |
| Sell a physics body with a few animations on a raycast + velocity mapping | Low | Take it — the cheapest big win here |
| Impulse shockwave on foot plant, for weight | Low | Take it |
| Change the gameplay when the system cannot support it | Free | Take it |
| Darlings channel for puzzles that don't fit | Free | Take it |
| Limited palette, one accent colour | Free | Take it |
| Separate diffuse/specular/bounce light authoring | High | Approximate with per-area environments |
| Bespoke one-use mechanic per puzzle | Very high | Avoid — use a combinatorial model |
| Dense contextual animation | Very high | Reduce scope or design around it |
| Physics-driven creature (huddle) | Very high | No |
| Custom renderer / custom TAA | Very high | No — Godot defaults plus tuning |
| Seamless streaming world | High | Only if the design needs it |
| Split scenes into mutable gameplay vs immutable environment | Free | Take it — makes respawn cheap |
| Do expensive work behind a curtain the game already has | Free | Take it |
| Profile at fixed checkpoints for a per-location base cost | Low | Take it once there's content |

---

## 14. Open questions

Unanswered. Fill in or delete as you learn.

- How exactly are the curving depth sections implemented — spline constraint, or invisible collision shaping a still-flat movement space?
- How are camera transitions triggered and blended?
- Is the checkpoint system manually placed or driven by puzzle state? *(Partly answered: the streaming talk shows safe points as fixed, named locations used by their profiling tools, and respawn reloading only the dirty gameplay scenes. Placement itself is still not described.)*
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

- *Low Complexity, High Fidelity: The Rendering of INSIDE* — GDC / GDCE 2016, Gjøl & Svendsen. **Watched and transcribed.** The rendering source of truth and the source for section 7. Read alongside the slides, which carry the shader code the talk refers to.
  https://www.youtube.com/watch?v=RdN06E6Xn9E (non-paywalled GDCE version)
- *Temporal Reprojection Anti-Aliasing in INSIDE* — GDC 2016.
  https://www.youtube.com/watch?v=2XXS5UyNjjU
  Source code (MIT, Unity 5+): https://github.com/playdeadgames/temporal
- *Banding in Games* — DTU VisionDay 2014. Dithering to kill colour banding.
- *Custom Pixels* — GGJ 2015. Replacing all shaders in Unity for fully custom rendering.
- *Turn it Down 90% — INSIDE VFX* — Control Conference 2016, Mikkel Bøgeskov Svendsen. **Watched and transcribed.** The source for section 8.
  https://www.youtube.com/watch?v=vA3uFC2p8eo
- *Huddle Up! Making the [spoiler] of INSIDE* — GDC 2017, three speakers. **Watched and transcribed.** The source for section 10. Two of the three speakers' names are unrecoverable from the captions; check the slides before citing anyone.
  https://www.youtube.com/watch?v=gFkYjAKuUCE
  Slides: https://media.gdcvault.com/gdc2017/Presentations/Grontved_Huddle%20Up!%20Making.pdf
- *A Game That Listens* — GDC 2016, Martin Stig Andersen. **Watched and transcribed.** Audio/gameplay feedback loops; the source for most of section 11. Note: YouTube serves only a Danish-tagged caption track for this talk, transcribed with the wrong speech model — names and figures in it are unreliable.
  https://www.youtube.com/watch?v=Dnd74MQMQ-E
- *Unbreaking Immersion* — Wwise Tour 2016, Andersen and Jakob Schmid. **Parts 2 and 3 watched and transcribed** — the implementation behind section 11, and the performance notes in section 12. Part 1 has captions disabled on YouTube and has not been watched.
  https://www.youtube.com/watch?v=gRF8Gt5hys4 (2, Voice) · https://www.youtube.com/watch?v=TcSuVzUjmLw (3, Scene Change)
- *The Boy From INSIDE* — AES 2016. Sound design of the main character.
- *The Playdead Approach to Audio* — ITU 2016. Wwise/Unity setup.
- *Tools, Tricks and Technologies for Reaching Stutter Free 60 FPS in INSIDE* — Unite 2016, three Playdead programmers. **Watched and transcribed.** The source for section 12. Much of the detail is Unity-specific.
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
