# Camera

- **[obs]** Slow, soft follow. Framing changes at scene boundaries rather than continuous tracking.
- **[obs]** Every screen is composed — silhouette against light, strong foreground framing elements.
- **[doc]** Camera behaviour had performance consequences: on the rooftop section before the lineup, the camera pans to look further ahead than usual, and that caused the entire world to load into memory. One of the hardest areas to optimise.
- **[guess]** Likely authored camera volumes or triggers with blending, rather than one follow rig.

**Note:** camera look-ahead and streaming are coupled. If you build level streaming,
the camera's view distance is part of the budget.

---

*Part of [INSIDE reference notes](README.md). Claim tags are explained there.*
