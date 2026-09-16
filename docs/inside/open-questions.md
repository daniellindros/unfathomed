# Open questions

Unanswered. Fill in or delete as you learn.

- How exactly are the curving depth sections implemented — spline constraint, or invisible collision shaping a still-flat movement space?
- How are camera transitions triggered and blended?
- Is the checkpoint system manually placed or driven by puzzle state? *(Partly answered: the streaming talk shows safe points as fixed, named locations used by their profiling tools, and respawn reloading only the dirty gameplay scenes. Placement itself is still not described.)*
- What's in the Danish-language animation talk? Not yet watched.
- ~~How did Wwise communicate state back to the engine?~~ **Answered by the slide deck.** Named user cues placed in music segments arrive as engine callbacks on the following frame, and the game can additionally query Wwise for the current music playback position with extrapolation. The garbled Q&A answer was about reading the play position rather than relying on markers alone.

---

*Part of [INSIDE reference notes](README.md). Claim tags are explained there.*
