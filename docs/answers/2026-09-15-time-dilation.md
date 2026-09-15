# How a time-dilation mechanic would work

**Question:** if slow motion were a puzzle verb rather than a combat one, how would it
actually work?

**Nothing here is decided.** It's a design sketch with the Godot mechanics worked out
far enough to cost it.

## The trap: uniform slow motion isn't a mechanic

If the world and the player both drop to 0.25, every relative speed is unchanged. The
puzzle is identical, just longer. It *feels* different and *plays* the same.

The mechanic only exists when the player is privileged relative to the world. So this
isn't "slow motion", it's **relative time advantage** — the slowed look is a side
effect of the thing, not the thing.

That reframing decides the implementation.

## Don't use `Engine.time_scale`

`Engine.time_scale` is a global multiplier on `delta`. It affects `_process`,
`_physics_process`, the physics server, `AnimationPlayer`, `Tween` and `Timer` alike —
and therefore the player too. It gives the feel without the advantage, and the rest of
the work is spent clawing it back out of the player, the UI and the input path.

Invert it: leave engine time alone and give the *world* a scale the player never reads.

```gdscript
# time_dilation.gd  (autoload as TimeDilation)
extends Node

const NORMAL: float = 1.0
const SLOWED: float = 0.25

var world_scale: float = NORMAL
var charge: float = 1.0

@export var drain_per_second: float = 0.5
@export var refill_per_second: float = 0.25

func _process(delta: float) -> void:
	var active: bool = Input.is_action_pressed("dilate") and charge > 0.0
	world_scale = SLOWED if active else NORMAL
	var rate: float = -drain_per_second if active else refill_per_second
	charge = clampf(charge + rate * delta, 0.0, 1.0)
```

Anything in the world that moves asks for the scale:

```gdscript
@export var anim: AnimationPlayer

func _process(_delta: float) -> void:
	anim.speed_scale = TimeDilation.world_scale
```

`delta` stays real-time throughout, so the player controller needs no changes at all —
which is the tell that this is the right shape. It's also the same decoupling as the
duck-typed contract in `../godot/scene-structure.md`: the hazard asks a known question
rather than the time system knowing about every hazard.

### Why an autoload

An autoload is a node Godot creates once at startup and parents to the tree root,
before the main scene. Registered in Project Settings, it lands in `project.godot`:

```ini
[autoload]

TimeDilation="*res://autoload/time_dilation.gd"
```

Changing scenes frees the current scene entirely, so anything that must outlive a
transition can't live inside one. Two gotchas that would bite:

- **Persistence cuts both ways.** `charge` carries across a respawn unless explicitly reset, so the player reloads a checkpoint with an empty meter and no idea why. Needs a `reset()` called from whatever handles respawn.
- **`get_tree().paused = true` freezes autoloads too.** Fine here — you want draining to stop — but an audio manager added later would need `process_mode = PROCESS_MODE_ALWAYS`.

## Two things this makes free

**Jump distance.** Slow the hazards but not gravity and nothing changes; slow gravity
and the character sails. One exported float, and a whole category of puzzle.

**Physics props are the exception.** A `RigidBody3D` crate is simulated by the physics
server at global scale — one body can't be slowed. The way out is Playdead's own: the
fern in `../inside-reference.md` §9 is a linear animation driven by a single float
acting as a velocity, no simulation at all. Built that way, a prop scales like anything
else.

## Hold, don't toggle

Grab in INSIDE is a held state, never a toggle (§9). Matching that keeps one input
grammar, and means the player is always one release from normal time.

## The meter problem

A drain meter needs reading, and there's no HUD. So make it diegetic:

- **Audio.** Pitch-drop the mix on entry; warp pitch and filter toward "running out" as charge depletes. This is the breathing-loop architecture from §11 — one signal feeding audio, visuals slaved to the audio rather than driven in parallel.
- **Colour.** Push further toward monochrome as it drains.

Neither needs a pixel of UI.

## The 200ms interaction

Whether the 200ms response budget becomes a hard rule is still open. If it does, it
interacts with this directly: the rule is about *perceived causation*, which is
wall-clock. At `world_scale = 0.25` a 200ms in-world response is 800ms of real time and
reads as broken. Input response has to stay unscaled — which the design above gets for
free, since engine time is never touched.

## Cost

- Autoload plus hazard hookup: an evening.
- Diegetic meter: another evening.
- Each room using it: an afternoon — the combinatorial payoff, and the real argument for this over bespoke mechanics.
- **Tuning is the expensive part.** How slow, how long, how fast it refills. No shortcut; it's playtesting, and it's the same shape as the grey-box lighting evening.

## Still open

- Whether this belongs in the game at all. `design.md` is empty.
- Whether the player should be fully unaffected, or slowed less than the world. The second keeps some weight; the first is a cleaner power.
