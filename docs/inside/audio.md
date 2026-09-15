# Audio

Primary sources are *A Game That Listens* (GDC 2016, Martin Stig Andersen) and parts
2 and 3 of *Unbreaking Immersion* (Wwise Tour 2016, Andersen with Jakob Schmid).
**All watched and transcribed.** The GDC talk frames three interlocking problems:
death and respawn, sound conducting in-game actions, and audio-driven gameplay —
where the game must read the sound to know its own state. The Wwise talks are the
implementation, from the programmer's side.

**Source caveat.** The only caption track YouTube serves for this talk is tagged
Danish and was transcribed with the wrong speech model — see the header of
`reference/transcripts/game-that-listens.txt`. The argument survives intact and the
mechanisms below are clear, but every *figure* is as the captions rendered it and
none is verified against slides. Treat numbers here as `[guess]` even where the
surrounding claim is `[doc]`. The Wwise transcripts are clean English and do not
carry this problem — where they cover the same ground they are the better source, and
they independently confirm the six-second shockwave loop.

- **[doc]** Wwise integrated with Unity, wired into animation and gameplay rather than bolted on.
- **[doc]** Martin Stig Andersen created sound using bone conduction through a human skull.
- **[doc]** Audio influenced design, not just the reverse. The cornfield originally had no rain; Andersen liked the idea and applied the sound treatment, the team responded well, and the scene was changed to match.
- **[doc]** For the huddle, Andersen took five to seven improv theatre performers into a forest, tied them together, had them move as one mass, and recorded the footsteps. Convincing audio early is part of what made the creature feel real enough to keep.

### The continuous audio engine

- **[doc]** The audio engine runs continuously from entering the game to exiting it. Sound is unaffected by anything happening in the game unless explicitly specified otherwise — the inverse of the usual arrangement, where audio follows game state.
- **[doc]** The cost is that every sound must then be accounted for. Dynamic objects with their own start and stop events are the hard part, and keeping an overview of them is real work.
- **[doc]** Sounds are split into two categories: those that restart on respawn, and those that play across it. The respawn handler stops everything *except* ambience, music and similar beds.
- **[doc]** Mix states also survive death and respawn, selected from a library of generic ones — fade out over a few seconds on death, fade back in after.

### Death and respawn

- **[doc]** The game sends a death event, then pauses audio event execution while the level unloads and reloads, then resumes it — so everything queued during the gap fires at the same point in time instead of scattering across the load.
- **[doc]** Loading a save point and respawning are deliberately *different* events. Come back from the menu after a few days and the musical cue plays again; die and respawn and it doesn't.
- **[doc]** On death the mix is ducked, not cut. Andersen's claim is that nobody notices, and that this is what stops repeated deaths turning a piece of music you liked into the sound of being stuck. The captions give the figure as 6 dB.
- **[doc]** He uses Limbo as his own counter-example. The hotel sign's musical cue stops on death and restarts on reload; he says he played Limbo carefully to avoid dying because of it. They had ideas for fixing this during Limbo and no time to build them.

### Respawning into the right part of the loop

This is the marching-figures puzzle, not the shockwave — two separate sequences that
are easy to conflate.

- **[doc]** The boy must follow a line of marching figures. The loop has two halves: walk during the first, stand still during the second. Doing the opposite kills him.
- **[doc]** The characters' footsteps are *in the music*. The music decides when they walk, rather than the animation triggering footstep sounds.
- **[doc]** Respawning in the first half would kill him instantly, so a segment is queued as the screen fades to black, timed so he never arrives in the lethal half — and offset by roughly half a second so he doesn't land exactly on the beat.

### Deciding the outcome before the audio needs it

- **[doc]** In the shockwave section a blast fires every six seconds and the boy must be in cover.
- **[doc]** The music has to know whether he survives *before* the blast happens, because the loop restarting is what triggers the shockwave — by the time the game knows the answer, it is too late to choose the right material. So the game checks whether he is in cover shortly before the loop point (the captions say ~50 ms) and commits to that outcome.
- **[doc]** Having committed, they honour the decision even if he leaves cover during the blast. Otherwise the audio and the game would be telling the player different things.
- **[doc]** The musical change lands when the puzzle is *logically* solved, not when the player physically leaves it — underlining that you got it right.

**Committing early is the transferable idea, and it is free.** Anything that must
react ahead of an outcome — music, a camera move, a light change — needs that outcome
decided before it is visible and then honoured even if the world disagrees. It is a
correctness rule, not a content cost.

### Music time versus game time

- **[doc]** The central engineering problem of the whole approach. Anchoring a mechanic to music puts it in *real* time; game time is frame-rate dependent. Five game-seconds and five real seconds are not the same thing, so a traversal that always worked can become impossible when the frame rate drops.
- **[doc]** Their debug view for the rotating cover: green bars mark solution positions and a yellow bar marks the cover's target, both locked to music time, while the cover itself runs on game time and continuously re-aligns toward the target.
- **[doc]** Slowed down hard, the cover visibly jumps between positions — "one thing I hope you never see in the game." The stated goal was that the puzzle stays solvable on a bad machine even when the motion stops being smooth.
- **[doc]** The target snaps to the nearest solution once the player is close enough. The game helps.

**This is the expensive half.** Syncing gameplay to music means every timing
guarantee now depends on real-world performance, and the fallback behaviour has to be
designed rather than discovered. A solo dev can have the continuous-audio half —
which is most of the emotional payoff — without ever anchoring a mechanic to a beat.

### Sound conducting the game

- **[doc]** Markers in the audio trigger events in the game. The flashing warning light before a shockwave is fired from a marker in the sound, not from game logic.
- **[doc]** The elevator crash: during development the elevator happened to hit the water on the beat, they liked it, and so its speed is now adjusted to land on the beat regardless of when in the loop the player triggers it.
- **[doc]** Audio drove a level-design change. The director and Andersen felt the shockwave section was too intense given a climax coming later, so the boy was sent inside a building to bring the mood down.
- **[doc]** The mechanism, from the slides: **named user cues are placed in music segments** and arrive in the engine as a callback — normally on the frame after the cue occurred. The game can also ask Wwise for the **current music playback position** directly, with extrapolation, and drive itself from that. This is how the game reads the sound rather than the other way round.
- **[doc]** The background flashes in the shockwave section are fired from **markers placed in the music**, not from game logic. Because each musical variation has different rhythmic content, Andersen decides per variation where the flash lands. He states the inversion directly: normally the game triggers sound events; here the game creates things from events the sound triggers.
- **[doc]** The mix is shaped continuously rather than switched. Ambience and the boy's voice are both **side-chained to the shockwave**, giving a pumping effect and making him quieter as the blast is louder. Reverb is enveloped so the world "sucks in" about two seconds before each blast and opens out after.
- **[doc]** In and out of cover are different filter states — muffled inside, bright and exposed outside — with a small reverb in cover and a large one outside.
- **[doc]** On surviving a blast he ducks the boy's footsteps by roughly 12 dB for the following six seconds, because he does not want to hear them at that moment. Sound effects are also pitched to fit the music, one example being a sound dropped around 300 cents.
- **[doc]** A layer he calls **state ambient** sits on top of the musical pulse: sustained tones whose volume *and* retrigger interval are both randomised, so the texture varies continuously without a loop becoming audible.

### Voice direction

- **[doc]** Andersen describes the setup as directing an actor: the sequencer performs, and he gives it direction per place and per event. The mechanisms are trigger boxes in the level, state machines, scripts, and direct parameter control.
- **[doc]** Trigger boxes are placed at z = 0, since the world is 3D but the gameplay is a plane.
- **[doc]** Each direction can set emotion, intensity or action independently, leaving the others alone. It can also lie — making him *sound* like he is landing during a custom animation that is not a landing.
- **[doc]** Intensity is generated by movement — a smoothed measure of how hard he is working — and then **clamped** per area, for example to a 50–75 band. The clamp can be **interpolated across space**, so a room gets more frightening toward one side, or **over time**, so he starts at maximum and relaxes over about five seconds regardless of where he is.

### The scene change

How the audio survives death, from the programmer's side. Andersen's name for it is a
theatre scene change: the curtain closes, people run about moving furniture, the
curtain opens, and nothing appears to have happened.

- **[doc]** On death the game unloads every non-static scene — anything physics or logic can have disturbed — and loads the respawn point. The audio must come through with its state unchanged.
- **[doc]** The slides give the sequence exactly. Note that the prepare and spawn events are **named per save point**, so the audio knows where it is going before the load starts:

  | Moment | Audio |
  |---|---|
  | Boy death | death event |
  | Fade out start | `prepare_spawn_[savepoint]` |
  | Fade out complete | **pause Wwise updates (`RenderAudio`)** |
  | Unload scenes | scene stop events |
  | Load scenes | scene and global start events |
  | Fade in start | post `spawn_[savepoint]`, resume Wwise updates |
  | Fade in complete | — |

- **[doc]** Their own summary of the effect: it creates **the illusion that no time passed**. The slide's image credit is a behind-the-scenes photograph of the Metropolitan Opera, which is where the curtain metaphor comes from.
- **[doc]** Freezing Wwise by simply not rendering is described as the absolutely simplest way to make it retain state. The commands issued meanwhile accumulate in a buffer and all execute in a single audio frame when rendering restarts.
- **[doc]** That single-frame burst needs a **2 MB command queue**, which overran the standard **512-sample** audio buffer. The fix was to double it to **1024 samples**; the added latency was judged imperceptible. The slides give both settings directly (`uCommandQueueSize`, `uNumSamplesPerFrame`).
- **[doc]** The death fade is six seconds — the length of the shockwave loop — which is how the player lands back at the same point in the cycle.

### The breathing loop

The clearest example of how tightly audio and animation are coupled. The Konsoll talk
describes the result; the Wwise talk gives the mechanism.

- **[doc]** Breathing is two additive poses — inhaled and exhaled — blended on top of whatever animation is playing, including crouching and interacting.
- **[doc]** The poses are driven *by the audio system*, not by gameplay directly. Gameplay changes the sound; the sound then drives the visible breathing. Chest and head movement always match the audio because the audio is the source.
- **[doc]** Concretely: a small sequencer written in Unity script posts a Wwise event, asks for a callback when it finishes, and posts the next one on that callback. The **recorded sounds' own lengths therefore define the rhythm** — uneven, and natural because of it. The same callbacks drive the additive pose, which is why they cannot drift apart.
- **[doc]** Everything hangs off **one Wwise event** at the top of a switch hierarchy: action, then theme, then emotion, then cycle (inhale or exhale).
- **[doc]** The loop is explicit in the slides: update the breath cycle, set the switches and RTPC, post the event asking for an `AK_EndOfEvent` callback, wait for it, repeat.
- **[doc]** **Action is normally derived automatically from the animation**, and overridden only where a scene needs a different reading. Emotion can also be set to morph automatically to another value after a given time.
- **[doc]** Three axes, all settable at runtime: **action** (what he's doing), **emotion** (the situation), **intensity** (exhaustion, or emotional charge). Emotions in the hierarchy include panic, alert, determined, frantic, relaxed, relieved and strangled.
- **[doc]** A `sneak` theme exists alongside `normal`, because it is largely a stealth game and Andersen is explicit that a character making ordinary noise while sneaking breaks it for him.
- **[doc]** Intensity is **exhaustion, low-pass filtered** — movement generates exhaustion, the filter smooths it, and the result selects the depth and force of the breath. Depending on the emotion switch it reads as physical exertion or as emotional charge. It is a continuous parameter banded into musical dynamics — piano, mezzo-forte, forte — rather than numbered 1–10. His reasoning: hearing a sound, he can always say which dynamic it is, where a number means nothing. The same scale is used for physics sounds.
- **[doc]** Intensity updates only when a breath is taken, which Schmid believes is performance-related.
- **[doc]** The voice is mixed in plain stereo, and its volume depends on distance to camera **and the angle of the boy's head** — facing the camera is louder, facing away raises the reverb. This is the look-at layer from [game feel](game-feel.md) feeding the mix.
- **[doc]** Recovery is slow and deliberate. After a chase, the breath takes a long time to settle.
- **[doc]** Jumping is a special case rather than a simple override. You hold your breath in the air: if he is inhaling the sequence just stops there, and if he is exhaling a *quick* inhale is inserted so he is full of air on landing. Landing always begins with an exhale, and an impact value derived from speed chooses between a normal exhale and a grunt.
- **[doc]** A three-state engagement axis — **not engaged, engaged passive, engaged active** — marks performing work and selects a different set of sounds. *(Corrected from the transcript against the slides, which show three states rather than two.)*

### Beat-matching the breath to the footsteps

- **[doc]** Running switches the sequencer from stitching sounds together to spacing them out, targeting one breath per two steps.
- **[doc]** Snapping to that instantly sounded forced, so Schmid treated it as a **frequency and phase alignment problem**. The run cycle runs 0–1 with each step at half phase; breathing wants half the run's frequency. The current breathing rhythm is analysed for its own frequency and phase, and then nudged toward the footsteps.
- **[doc]** The stated model is a **DJ beat-matching two turntables** — and the slides sharpen it: interpolate the breath frequency toward the run frequency, and compensate that frequency for the phase offset, "like a DJ that uses pitch adjust without nudging the record". No discontinuity, so the transition is inaudible.
- **[doc]** The numbers: a run cycle is two steps, right foot at phase 0.0 and left at 0.5; a breath cycle is one breath, taken at phase 0. On switching modes, the breath's frequency is computed from **the last two breaths** and its phase from that frequency and the last breath's time.

**Worth copying as an architecture, not just an effect.** One signal (breath intensity)
fed by many gameplay sources, driving audio, with animation slaved to the audio. It
gives free continuity between systems that would otherwise have to be synchronised by
hand — and it's the same idea as letting the audio own respawn timing.

**The continuous audio engine is the cheap, high-value half of this talk.** Letting
the mix run across death, ducking instead of cutting, and splitting sounds into
restart-on-respawn versus play-across costs almost nothing and is the difference
between death feeling like a reset and death feeling like part of the scene. The
beat-synced puzzles are the expensive half and are separable. Strong candidate for
this project — and much easier built in from the start than retrofitted.

---

*Part of [INSIDE reference notes](README.md). Claim tags are explained there.*
