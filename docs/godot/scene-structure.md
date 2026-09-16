# Scene structure and node access

Sources: Godotneers, *Node paths* and *Godot Components*; Code With Ro, *Mastering Composition*.

## Reaching other nodes

- **`[video]`** `get_node("Path")` and `$Path` are the same thing — `$` is shorthand and compiles to the same call. Both resolve **relative to the node the script is on**, not to the scene root.
- **`[video]`** Path building works like a filesystem: `NodeA/NodeB/Sprite` goes down, `..` goes up, `.` is the current node, and they combine — `../Player/Sprite` goes up then down.
- **`[video]`** `get_parent()` is the same as `..`.
- **`[video]`** `$` needs quotes when the path contains dots — `$"../.."` — because the parser can't otherwise tell where the path ends.
- **`[video]`** `self` refers to the current node, and can usually be omitted entirely.

## Scene-unique nodes, and why they matter

- **`[video]`** Right-click a node → **Access as Unique Name**. It gets a `%` marker, and `%Sprite` then finds it **from anywhere in that scene**, regardless of depth or position.
- **`[video]`** The problem this solves: every relative path breaks when you move either the node or the script. Reordering a scene silently breaks code that was correct. Unique names survive rearrangement.
- **`[video]`** Godotneers' position is that there's "really no reason to not use scene-unique nodes these days."

**`[ours]`** Take this as the default. A 2.5D level is exactly the thing that gets
rearranged constantly while the lighting is tuned, and path-based access converts
every rearrangement into a debugging session.

## Keeping components from becoming spaghetti

The components video builds a tower-defence game badly on purpose first — the tower
holds references to the fish and the projectile and does all the work — then takes it
apart. The stated principle:

- **`[video]`** A component should work independently of those around it and know as little about them as possible.
- **`[video]`** Anything affecting gameplay belongs in an exported variable, not a constant in code — speed, damage, health, spawn interval. The reason given is prototyping: tuning in the inspector while the game runs, instead of editing and restarting.

**`[ours]`** That maps directly onto the grey-box lighting task — an evening spent
only turning knobs only works if the knobs are exported.

### The duck-typed contract

The best idea in the video.

- **`[video]`** Rather than the projectile knowing what a fish is, it asks whatever it collided with `if body.has_method("take_damage")` and calls it if so. Anything with that method can be damaged; anything without is ignored silently. The projectile script contains no reference to fish at all.

**`[ours]`** This is the same shape as the `TimeDilation` sketch — the hazard asks a
known question rather than the time system knowing every hazard. Worth reaching for
whenever two systems would otherwise need to import each other.

### Spawning

- **`[video]`** `preload` a scene, call `instantiate()`, then `add_child()`. Forgetting `add_child` is the classic bug: the node exists but is not in the tree, so nothing renders and nothing errors.
- **`[video]`** Export an `Array[PackedScene]` instead of hardcoding what a spawner spawns, then `pick_random()`. The spawner stops knowing about fish.
- **`[video]`** `get_tree().create_timer()` returns a `SceneTreeTimer` with its own `timeout` signal, disposed automatically. Used with `randf_range()` for irregular intervals, since a fixed `Timer` node produces an unnaturally regular rhythm.

### Detecting contact — two ways

- **`[video]`** An `Area` with a collision shape, reacting to `body_entered`. The area must be looking for physics bodies; it cannot see a bare `Sprite`.
- **`[video]`** Or, if the body is a `CharacterBody` already calling `move_and_slide()`, ask it afterwards: `get_slide_collision_count()`, then `get_slide_collision(i).get_collider()`. The physics engine has already done this work, so there's nothing to add.
- **`[video]`** Collision layers and masks stop same-type collisions — the small fish were being blocked by the big fish until the mask was cleared.
- **`[video]`** **Debug → Visible Collision Shapes** draws shapes at runtime. The video uses it to find a bug where the script was on the `Sprite` rather than the `CharacterBody`, so the art moved and the collider stayed put.

**`[ours]`** The slide-collision approach is the one that fits here — the player is a
`CharacterBody3D` calling `move_and_slide()` every frame already. And
`../inside/movement.md` warns that most 2.5D bugs are the player catching on
decoration, so Visible Collision Shapes is likely to earn its keep early.

## Composition: how to split an object up at all

The Godotneers video is about keeping components decoupled. Code With Ro's is about
the prior question — what the components should be.

- **`[video]`** The failure it prevents: a `player.gd` that grows through movement, double jump, dash, attack, dodge, block, and is hundreds of lines before any enemy exists. At which point starting over feels easier than continuing.
- **`[video]`** Inheritance expresses *is a*, and goes rigid fast — a healing totem has health like an enemy but does not move, a crate can be hit like a player. Composition expresses *has a*: a character **has** a movement component, a health component, an attack component.
- **`[video]`** One script, one job. A health component owns life and death; an input component owns buttons and nothing else.
- **`[video]`** Reuse is the payoff: the same health component goes on the player, an enemy, a guard, a crate. An invulnerable shopkeeper simply doesn't get one. Components travel between projects.
- **`[video]`** Node count is not the cost people fear. Godot 4 nodes are cheap — a hundred enemies with ten components each is fine, and far cheaper than one script nobody dares edit.

### Typed exports as sockets

The mechanism, and the part worth taking:

```gdscript
class_name HealthComponent extends Node      # now a real type

# in the owner
@export var health_component: HealthComponent
```

- **`[video]`** `class_name` makes the script a type the engine knows, like `int` or `String`. `@export` with that type gives an inspector slot which **only accepts a node carrying that script** — dragging the wrong component in is blocked outright, which kills a class of silent bug.
- **`[video]`** It also replaces `@onready var health = get_node("Components/HealthComponent")`, which breaks the moment the node is renamed or moved. A typed export is a reference, not a path, so rearranging the scene leaves it intact.
- **`[video]`** And the editor can autocomplete the component's own functions and variables from the owner's script.

### The two approaches disagree, and it matters

`scene-structure.md` already carries Godotneers' contract — ask
`body.has_method("take_damage")` and call it if present. That is a *different*
decoupling strategy from the typed export above, and the trade is real:

| | Duck-typed (`has_method`) | Typed export |
|---|---|---|
| Caller knows the type | No | Yes |
| Autocomplete and type checking | No | Yes |
| Wiring needed | None | Drag into the inspector slot |
| Works on anything | Yes — unknown objects included | Only what you wired up |

**`[ours]`** Use both, for different jobs. A projectile hitting an unknown thing
should duck-type, because it genuinely cannot know what it hit. A player reaching its
own health component should use a typed export, because it knows exactly what that is
and the safety is free. Reaching for `has_method` on your own children is throwing
away type checking for nothing.

### Two heuristics worth keeping

- **`[video]`** **The rock test.** A component should not know what it is attached to. "If I put this script on a literal rock, would it still function?" If yes, it's a component; if no, it's owner logic wearing a component's clothes.
- **`[video]`** **The owner becomes an orchestrator.** It stops doing the work and starts managing state — telling movement to stop while attack runs. It stays short because it coordinates rather than implements.
- **`[video]`** Components communicate by signal, not by reaching for each other: health emits "I took damage" and does not know whether anything is listening. See [signals.md](signals.md).
- **`[video]`** Exported tuning values make one component serve many entities — a flying enemy is the movement component with a gravity multiplier of zero; a heavy one is more gravity and less jump velocity.

**`[ours]`** Directly relevant, and it is how the time-dilation sketch already wants to
work: hazards read `TimeDilation.world_scale` and know nothing about each other. Worth
adopting before the player controller exists, because retrofitting composition onto a
grown `player.gd` is exactly the situation the video opens with.

**`[ours]`** Note the version drift: that video runs Godot 4.6 RC1 on a 4.5 project,
and this project is pinned to 4.7. `class_name` and typed `@export` are long-standing,
so nothing here is version-sensitive — but the editor UI in the video will not match.
