# Game feel — control versus animation

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

*Part of [INSIDE reference notes](README.md). Claim tags are explained there.*
