# TODO

**The working list — everything not yet done, including everything not yet
decided.** Delete freely; this file has no memory and needs none.

**What doesn't go here:** anything already settled. When a question is decided it
moves to `decisions.md` as a dated line and leaves this file.

---

## Undecided

Questions that block work. Each says where the answer lives once it's settled.

- [ ] **Puzzle model** — bespoke-per-puzzle (INSIDE) vs combinatorial one-system
      (The Swapper, Cocoon). Determines the whole production shape. Leaning
      combinatorial for solo feasibility. Blocks any level work.
      → `decisions.md`, and the reasoning into `design.md`.
- [ ] **Godot version to pin** — blocks the tutorial below; it differs between
      4.x releases. → `decisions.md`.
- [ ] **Target length / scope** — needs to be a number, not "short".
      → `design.md` under Target length, with a dated line in `decisions.md`.
- [ ] **Whether the 200ms response budget is a hard rule** — see
      `inside-reference.md` §9. → `decisions.md`.
- [ ] **Whether to build audio-driven respawn** (the shockwave-loop technique) —
      cheap to build in from the start, expensive to retrofit. → `decisions.md`.

## Now

- [ ] Work through the official "Your first 3D game" tutorial in the Godot docs.
- [ ] Grey-box test corridor: capsule player, one directional light, volumetric fog,
      debanding on. Spend an evening only tuning knobs. Judge the look before modelling anything.
- [ ] Fill in `docs/design.md`. Half a page.

## Soon

- [ ] Player controller: CharacterBody3D, `velocity.z = 0`, snap Z after `move_and_slide()`.
- [ ] Upgrade to Path3D-tangent movement so the path can curve toward/away from camera.
- [ ] Soft-lerp correction back onto the curve.
- [ ] Resolve input against camera right-vector, not path tangent, so direction doesn't
      flip when the path turns more than 90°.
- [ ] Crate prop: RigidBody3D with `axis_lock_linear_z` + angular X/Y locked.

## Transcripts to collect

Run `reference/fetch-transcripts.sh` locally (YouTube blocks cloud IPs).
Then paste one at a time into chat to distil into `inside-reference.md`.

- [x] Subtleties of INSIDE (Konsoll 2017) — done, became section 9
- [ ] A Game That Listens (GDC 2016) — highest value, do next
- [ ] Unbreaking Immersion (Wwise 2016, 3 parts)
- [ ] Turn it Down 90% — INSIDE VFX (Control 2016)
- [ ] Low Complexity, High Fidelity: Rendering (GDCE 2016) — read alongside the slide PDF
- [ ] Stutter Free 60 FPS (Unite 2016) — only if streaming world is needed
- [ ] Huddle Up! (GDC 2017) — low priority

## Later

- [ ] Look-at layer (head + spine, shoulders counter-rotating, blends out past threshold).
- [ ] Two-exit animation system: authored cut-short frame per animation.
- [ ] Minimum-duration timers for tap inputs.
- [ ] Decide the two verbs, then design the teaching room. Opening gets built last.
