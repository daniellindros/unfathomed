# Movement, depth and the 2.5D constraint

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

*Part of [INSIDE reference notes](README.md). Claim tags are explained there.*
