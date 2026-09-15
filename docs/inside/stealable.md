# Summary — what's stealable solo

| Technique | Cost | Verdict |
|---|---|---|
| Plane-constrained movement in 3D scenes | Low | Take it |
| "Inaccessible must look uninviting" rule | Free | Take it |
| 200ms response budget on every interaction | Free | Take it — testable constraint |
| Two exits from every animation (wait, or cut short on input) | Low | Take it |
| Minimum-duration timers for tiny inputs | Low | Take it |
| Grab as held state, stick = pull direction | Low | Take it |
| Procedural look-at layer for directing attention | Low | Take it |
| Additive poses instead of discrete animations | Low | Take it |
| Fake physics via a single velocity float | Low | Take it |
| Two verbs, taught in one enclosed room, never added to | Free | Take it |
| Make wrong solutions obviously wrong; delete puzzles that fail this | Free | Take it |
| Breath as one signal: gameplay → audio → animation | Medium | Take a reduced version |
| Debanding + volumetric fog + one strong key light | Low | Take it |
| Clamp fog intensity so bright sources still read through it | Free | Take it |
| Blue noise over white noise or a Bayer matrix, wherever you jitter | Low | Take it — the eye forgives noise, not patterns |
| Colour a stacked effect once on read-back, not per sprite | Low | Take it |
| Flipbook: sequential columns, random rows | Free | Take it |
| Checkpoints so no puzzle is ever repeated | Low | Take it |
| Respawn into a running audio loop | Low | Take it |
| Freeze the audio engine across a level load, then let it catch up | Low | Take it — this is how respawn-into-the-loop actually works |
| Drive the breath sequencer from audio callbacks, animation slaved to it | Low | Take it |
| Band a continuous parameter into musical dynamics rather than 1-10 | Free | Take it |
| Trigger visual events from markers in the music | Low | Take it |
| No allocations in per-frame code | Free | Take it — a discipline, not a feature |
| Beat-match breathing to footsteps by phase alignment | Medium | Skip unless running is central |
| Duck the mix on death instead of cutting it | Low | Take it |
| Split sounds: restart-on-respawn vs play-across | Low | Take it |
| Commit to an outcome before the audio needs it | Free | Take it — a correctness rule |
| Anchor a mechanic to music time | High | Avoid — every timing guarantee becomes frame-rate dependent |
| Teach controls by obstacle order, no prompts | Low | Take it |
| "Turn it down 90%" restraint on VFX | Free | Take it |
| Tune an effect down until it is uncomfortable, then leave it | Free | Take it — an actual procedure |
| Colour effects from the scene (lit/shaded picked colours), not from the texture | Low | Take it |
| Sell a physics body with a few animations on a raycast + velocity mapping | Low | Take it — the cheapest big win here |
| Impulse shockwave on foot plant, for weight | Low | Take it |
| Change the gameplay when the system cannot support it | Free | Take it |
| Darlings channel for puzzles that don't fit | Free | Take it |
| Limited palette, one accent colour | Free | Take it |
| Separate diffuse/specular/bounce light authoring | High | Approximate with per-area environments |
| Bespoke one-use mechanic per puzzle | Very high | Avoid — use a combinatorial model |
| Dense contextual animation | Very high | Reduce scope or design around it |
| Physics-driven creature (huddle) | Very high | No |
| Custom renderer / custom TAA | Very high | No — Godot defaults plus tuning |
| Seamless streaming world | High | Only if the design needs it |
| Split scenes into mutable gameplay vs immutable environment | Free | Take it — makes respawn cheap |
| Do expensive work behind a curtain the game already has | Free | Take it |
| Profile at fixed checkpoints for a per-location base cost | Low | Take it once there's content |

---

*Part of [INSIDE reference notes](README.md). Claim tags are explained there.*
