# State machines

Three tutorials, three different designs. The disagreements are the useful part —
they're real trade-offs, not one person being wrong.

## What they agree on

- **`[video]`** A state is a set of conditions plus a behaviour. The enemy that wanders until it spots you, then chases, then attacks, is three states — and written as `if` chains it grows unmanageably as states are added. *(Bitlytic)*
- **`[video]`** Every state exposes four methods: `enter`, `exit`, `update`, `physics_update`. `update` runs on the visual frame, `physics_update` on the physics server. They're named differently from Godot's own `_process`/`_physics_process` so the machine can drive them without colliding with the engine's virtual methods. *(all three)*
- **`[video]`** The machine owns the lifecycle: it tracks the current state, calls `exit` on the old one and `enter` on the new one, and is otherwise agnostic about what states exist. *(Bitlytic)*
- **`[video]`** An exported `initial_state` entered on `_ready`. *(all three)*

## Where they disagree

### Are states nodes?

- **`[video]`** **Nodes** (Bitlytic, Quilled). States are child nodes of the state-machine node; `_ready` loops over children and registers any that are a `State`. Visible in the scene tree, configurable in the inspector, and each state can hold its own exported values.
- **`[video]`** **Not nodes** (BucketBrigade). States extend `RefCounted` and never enter the tree. The machine instantiates one on each transition. Lighter, and nothing about the state is inspectable.

The nodeless version allocates a fresh state object on every transition, which the
node version doesn't. For a character switching state several times a second that's
worth knowing about, though it's unlikely to matter at this scale.

### How is a transition addressed?

- **`[video]`** **By string.** `change_state("move")`, with a dictionary keyed on the lowercased node name. Both node-based tutorials lowercase the key specifically to dodge capitalisation bugs — a tell that the string is the weak point. No autocomplete, and a typo fails at runtime. *(Bitlytic, Quilled)*
- **`[video]`** **By class.** `transition_to(PlayerJumpState)`, with the parameter statically typed as `GDScript`. Autocomplete works and a typo won't compile. *(BucketBrigade)*

### Who starts the transition?

- **`[video]`** **The state calls the machine** — it holds a reference back and calls `change_state`. Simplest, and couples every state to the machine. *(Quilled)*
- **`[video]`** **The state emits a signal** the machine is connected to, passing itself and the target. The state knows nothing about the machine. *(Bitlytic, BucketBrigade)*

## BucketBrigade's extras

Worth separating from the core, because each is optional:

- **`[video]`** Abstract base classes via `@abstract`, including intermediate ones — a `MovementState` holding shared movement code and a `RestState` that decays velocity to zero, so an idle state extends `RestState` and inherits only what it needs. This answers the loose end Bitlytic flags at the end of his own video, where idle and follow duplicate the same three variables.
- **`[docs]`** `@abstract` marks a class or method as non-instantiable; a class with any abstract method must itself be abstract. It's in the current stable documentation and is a recent addition, so it will not exist in an older 4.x. That video targets Godot 4.7.
- **`[video]`** Dependencies injected into each state — the actor, an input component, and a data resource — so the same machine drives more than one entity.
- **`[video]`** A capped `state_history` array, most recent first.
- **`[video]`** A `state_changed` signal that an animation component consumes, mapping state class to animation name through an exported dictionary. He says outright he isn't convinced it's the best approach.

## For this project

**`[ours]`** The string-vs-class split is the only choice that really matters here,
and class-typed transitions win: the state list for an INSIDE-like character is small
and nearly fixed — idle, run, jump, fall, grab, swim, dead — so losing autocomplete
and compile-time checking buys nothing.

**`[ours]`** Nodes over `RefCounted`, despite the above coming from the nodeless
tutorial. Being able to see and tune states in the inspector matters more here than
allocation, and `inside-reference.md` §9 is full of per-state numbers that want to be
exported values — the cut-short frame thresholds especially.

**`[ours]`** The signal-based transition is worth taking. It's the same shape as the
decoupling in `scene-structure.md` and the same shape as the time-dilation sketch: the
thing that knows something announces it, rather than reaching for whoever needs to know.

**`[ours]`** None of this is needed yet. The grey-box corridor needs a capsule that
moves, and a two-state machine is more ceremony than `if is_on_floor()`. This becomes
worth building at around four states, or when the two-exit animation system from §9
arrives — that one genuinely wants per-state authored frame thresholds.
