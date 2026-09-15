# Scene structure and node access

Source: Godotneers, *Node paths* and *Godot Components*.

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
