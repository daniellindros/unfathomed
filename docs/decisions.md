# Decisions

Append-only. One line per settled question. Binding — see CLAUDE.md.
When a decision is reversed, edit the line in place and note what replaced it,
rather than adding a contradicting line below.

## Settled

- 2026-09-14 — Engine is Godot, 3D. Learning it for this project.
- 2026-09-14 — Style target is INSIDE: low-poly, limited/near-monochrome palette, moody lighting, cinematic 2.5D.
- 2026-09-14 — Player is constrained rather than free-3D. Movement follows an authored path that can move toward and away from the camera, not a fixed world-axis Z plane.
- 2026-09-14 — Camera is authored, not player-controlled.
- 2026-09-14 — Project documentation lives in this repo, not in Claude.ai project knowledge. Single source of truth.
- 2026-09-14 — Talk transcripts kept in `reference/transcripts/` for offline reference.

## Open — decide before building much

- Puzzle model: bespoke-per-puzzle (INSIDE) vs combinatorial one-system (The Swapper, Cocoon). Determines the whole production shape. Leaning combinatorial for solo feasibility, not decided.
- Godot version to pin.
- Target length / scope.
- Whether to adopt the 200ms response budget as a hard rule.
- Whether to build audio-driven respawn (the shockwave-loop technique).
