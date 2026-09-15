# Signals

Sources: Recursive Dev, *The basics of signals*; Godotneers, *Godot Components*.

- **`[video]`** Godotneers' framing: a signal is a mailing list a node publishes. Others subscribe to be told when something happens, instead of checking every frame.
- **`[video]`** Two ways to connect. In the editor: select the node, **Node → Signals**, pick the signal, choose a script, and Godot writes the handler and marks both the node and the function with a connection icon. In code: `timer.timeout.connect(_on_timer_timeout)`.
- **`[video]`** Pass the function **name**, not a call — adding parentheses calls it immediately instead of registering it.
- **`[video]`** Signals carry arguments. `body_entered` passes the body itself, which is what makes the duck-typed contract in `scene-structure.md` possible. `toggled` passes the new on/off state.
- **`[video]`** Custom signals: declare `signal name` on a node, `emit` it, and it appears in the editor's Signals tab like a built-in.
- **`[video]`** Every node inherits a lot of signals from `Node`, `CanvasItem` and `Object`. Most are irrelevant; the ones worth using are usually the type's own.

**`[ours]`** Signals are the decoupling mechanism that shows up in every other note
here — the state machine's `transitioned`, the components video's timer and area, the
animation component listening for `state_changed`. Worth internalising early because
the alternative is polling, and polling is how nodes end up holding references to each
other.
