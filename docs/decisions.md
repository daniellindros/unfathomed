# Decisions

**Settled questions only.** A dated ledger — read it to find out what has already
been decided, so it doesn't get re-argued. Binding: see CLAUDE.md.

Append-only. One line per settled question. When a decision is reversed, edit the
line in place and note what replaced it, rather than adding a contradicting line
below.

**What doesn't go here:** unsettled questions (Plane, label `decision`), prose about what the
game is (`design.md`), notes on how INSIDE did something (`inside/`).

---

- 2026-09-14 — Engine is Godot, 3D. Learning it for this project.
- 2026-09-14 — Style target is INSIDE: low-poly, limited/near-monochrome palette, moody lighting, cinematic 2.5D.
- 2026-09-14 — Player is constrained rather than free-3D. Movement follows an authored path that can move toward and away from the camera, not a fixed world-axis Z plane.
- 2026-09-14 — Camera is authored, not player-controlled.
- 2026-09-14 — Project *documentation* lives in this repo, not in Claude.ai project knowledge. Single source of truth. Narrowed later the same day: task tracking moved out to Plane, see below.
- 2026-09-14 — Talk transcripts kept in `reference/transcripts/` for offline reference.
- 2026-09-14 — Task tracking lives in Plane, project Unfathomed (`UNFAT`), not in the repo. The in-repo working list was removed at commit e99348c. Docs stay in the repo; only the working list moved.
- 2026-09-15 — Godot version pinned to 4.7, the current stable. Policy is to track latest stable; 4.8 is alpha and not used until it ships.
- 2026-09-15 — `design.md` follows the two standard templates: Part I the concept/pitch document, Part II the detailed GDD. Originally split across `design.md` and `gdd.md` the same day; merged into one file, since the split is a team device and the templates' overlapping sections had to be de-duplicated by hand. Part I is one page and holds any field the two templates share. Unresolved questions stay in Plane rather than in the GDD's own section.
- 2026-09-16 — Anything the player cannot reach must look uninteresting or dangerous. No doors left ajar in the background. See [inside/movement.md](inside/movement.md).
- 2026-09-16 — A wrong solution must never look plausible. Where one does, the puzzle gets deleted rather than signposted around — but a wrong interaction still gets feedback, so the object never reads as inert. See [inside/puzzles.md](inside/puzzles.md).
- 2026-09-16 — Fog intensity is clamped to a maximum so bright sources still read through it, rather than converging to full opacity. See [inside/lighting.md](inside/lighting.md).
- 2026-09-16 — Effects are built, then turned down until the reduction is uncomfortable, and shipped there. See [inside/art-direction.md](inside/art-direction.md).
- 2026-09-16 — No allocations in per-frame code. See [inside/performance.md](inside/performance.md).
- 2026-09-16 — Anything that must react ahead of an outcome has that outcome decided before it becomes visible, and honoured afterwards even if the world disagrees. See [inside/audio.md](inside/audio.md).
- 2026-09-16 — Expensive work happens behind a curtain the game already has — a death, a fade, a load — never during play. See [inside/performance.md](inside/performance.md).
- 2026-09-16 — Levels split into mutable gameplay scenes and immutable environment scenes, so a respawn reloads only what changed. Applies once level building starts. See [inside/performance.md](inside/performance.md).
- 2026-09-16 — Where the tech cannot support a piece of gameplay, the gameplay changes. Building the system up to meet the design is the expensive direction and is not the default. See [inside/animation.md](inside/animation.md).
