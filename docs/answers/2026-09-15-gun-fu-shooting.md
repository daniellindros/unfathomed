# Gun-fu shooting doesn't fit this game

**Question:** Equilibrium / John Wick style gun-fu combat, with a slow-motion mechanic.

**Short answer:** the slow motion is fine and cheap. The shooting breaks two settled
decisions and multiplies the production cost several times over. Nothing was decided —
this records why the idea stalled.

## It conflicts with decisions already made

`decisions.md` settles two things this needs:

- the camera is authored, not player-controlled
- the player is constrained to a path, not free-3D

Gun-fu is about spatial relationships — you, and several people at varying angles and
distances, and reading the room. On a path, under a camera you don't own, enemies can
only be left or right. That isn't John Wick, it's a shooting gallery.

Adding free aim to fix that reintroduces the exact failure `../inside/movement.md`
records for Somerville: a player pointing at things in a space whose depth the camera
deliberately flattens, and reviewers who couldn't tell what was reachable. The plane
lock is load-bearing, not a shortcut.

## The verb count is the other problem

INSIDE ships two buttons, taught in one barn, and never adds a third — [teaching](../inside/teaching.md) calls that
the solo-dev-sized design. Shooting brings aim, fire, reload, cover, target-switch and
a slow-motion toggle. Each needs animation in every direction, and [animation](../inside/animation.md) already flags
animation as the most likely bottleneck for a solo dev and the one least helped by
low-poly art. Then enemies that path, flank and telegraph — a system a puzzle-platformer
doesn't otherwise need at all.

## The tonal question, which matters more

INSIDE's dread comes from being a small thing that runs and hides. Gun-fu is a power
fantasy. Near-monochrome, heavy fog and a vulnerable silhouette can carry balletic
gunplay — that's a real game someone could make — but it is a *different* game.

This is the part `design.md` exists to arbitrate, and it can't, because it's empty. If
"you are powerless" is a pillar, this is dead on arrival. If it isn't, the project has
changed and that should be a deliberate choice rather than a drift.

## What was proposed instead

Keep the slow motion, drop the gun: time dilation as a puzzle verb — slipping past a
sweeping light, crossing a crusher, riding a collapsing platform. One system across
many rooms, which is the combinatorial model the puzzle-model question is already
leaning toward. No aiming, no enemy AI, no combat animation, and powerlessness intact:
you aren't winning a fight, you're surviving a gap.

See [How a time-dilation mechanic would work](2026-09-15-time-dilation.md).

## Still open

- `design.md` is empty, so nothing here is settled.
- Whether time dilation belongs in this game at all is itself undecided.
