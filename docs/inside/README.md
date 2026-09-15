# INSIDE reference notes

**Researched background on how INSIDE was built.** Organised by question, not by
source. Read it to find out what the real technique was before choosing a cheaper
version of it.

**Reference, not requirements.** It describes what a funded studio of ~25 people did
over six years. Most of it is out of reach for a solo dev, and that's fine. Nothing
here is binding — `decisions.md` is binding.

One file per topic. Open the one that matches what you're doing; there's no reading
order and no need to read the rest.

| File | When to read it |
|---|---|
| [movement.md](movement.md) | Building the player controller, plane lock, Path3D, colliders |
| [game-feel.md](game-feel.md) | Anything about how control *feels* — animation interruption, input response, the look-at layer |
| [lighting.md](lighting.md) | Fog, key lights, banding and debanding, the grey-box tuning pass |
| [art-direction.md](art-direction.md) | Effects, restraint, deciding how much of something to build |
| [audio.md](audio.md) | Sound, music, breathing, and how respawn survives a level load |
| [animation.md](animation.md) | Animation budget, physics-driven motion, selling weight cheaply |
| [puzzles.md](puzzles.md) | Designing a puzzle, conveying failure, checkpoints |
| [teaching.md](teaching.md) | Introducing a verb without a tutorial; the opening |
| [camera.md](camera.md) | Framing and camera transitions |
| [performance.md](performance.md) | Streaming, scene splitting, frame spikes |
| [production.md](production.md) | What the team and timeline actually were — read before comparing yourself to it |
| [how-they-worked.md](how-they-worked.md) | Process: prototyping, throwing work away, concept art as a brief |
| [stealable.md](stealable.md) | **Start here.** Every technique with a cost and a verdict |
| [open-questions.md](open-questions.md) | What we still don't know |
| [sources.md](sources.md) | Every talk, what's been read, and how to fetch the slide decks |

## Confidence tags

Every factual line is tagged:

- **[doc]** — stated by Playdead directly, in a talk, slide deck or interview. Trust it.
- **[obs]** — observable by playing or watching footage. Reliable as description; the *method* behind it may still be a guess.
- **[guess]** — inference, mine or the community's. A hypothesis to test, not a fact.

Untagged factual lines are a bug. When something turns out to be wrong, correct it in
place rather than appending a note — a file that contradicts itself is worse than one
that's slightly out of date.

## What doesn't go here

Anything about *this* game. Nothing in these files is a task or a commitment. When
something here is worth adopting, it becomes a work item in Plane, and then a dated
line in `../decisions.md` once settled.
