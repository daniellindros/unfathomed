# Rendering and lighting

Primary source is the GDC / GDC Europe 2016 rendering talk by Mikkel Gjøl (graphics
programmer, first half) and Mikkel Svendsen (technical artist, second half).
**Watched and transcribed.** Slides are public and carry the shader code.

### Why any of this matters

- **[doc]** The fixed camera is the root of the whole approach. Because framing never changes, artists can tune every pixel knowing it will look on the player's screen exactly as it does on theirs — so the game can lean on very subtle detail.
- **[doc]** That is also the constraint: subtle detail cannot survive distracting artefacts, so banding, flickering and aliasing are unacceptable in a way they would not be in another game. **The art direction generates the technical requirements**, not the other way round.
- **[doc]** Shipped at 60 FPS, 1080p, on every target. Unity with a source licence, so the engine itself was modified.
- **[doc]** Light pre-pass rendering: base pass writes depth and normals; a light pass samples those and outputs lighting; a final pass applies materials and samples the lighting; then translucency; then post.

- **[doc]** Lighting authored as *separate* diffuse, specular and bounce-light entities, so each could be tuned independently per shot.
- **[doc]** Local shadowed volumetrics for atmosphere.
- **[doc]** Analytic primitive-based ambient occlusion, chosen specifically to stay artist-approachable rather than for physical accuracy.
- **[doc]** Screen-space reflections.
- **[doc]** A custom water rendering system.
- **[doc]** Deliberate dithering to fight colour banding. Playdead gave a whole separate talk on this (*Banding in Games*, DTU VisionDay 2014). With a near-monochrome palette and wide gradients, banding is the artefact that destroys the look.
- **[doc]** Custom temporal reprojection anti-aliasing, released open-source under MIT in March 2016 for Unity 5+. Written by Lasse Jon Fuglsang Pedersen with input from Gjøl. The repo includes the GDC 2016 slide deck.
- **[doc]** *Custom Pixels* (GGJ 2015) covers going fully custom in Unity by replacing all shaders — the approach underneath the above.
- **[obs]** Key light usually behind or to the side; the boy reads as a near-black silhouette.
- **[obs]** Fog eats the background within a fairly short distance and does most of the depth work.

### Fog, and the cheapest atmosphere in the talk

- **[doc]** Many scenes were literally just geometry plus a **linear depth fog** — Gjøl shows one with and without, and the fog alone makes it moody.
- **[doc]** One detail makes it work: the fog's intensity is **clamped to a maximum** so bright light sources still punch through. Exponential fog converges toward full opacity and swallows them.
- **[doc]** Their "atmospheric scattering" is **a very wide glow** — blur the whole screen and add it back on top. Gjøl is almost apologetic about how simple it is; the artists got a great deal out of it.
- **[doc]** A second, *narrow* high-intensity glow comes from an emissive mask remapped to an HDR range. The trap they hit: if a pixel produces a large bloom but is not itself rendered bright, it reads as wrong — so the **HDR values have to be written back**.
- **[doc]** Order matters: **temporal anti-aliasing runs before the HDR bloom**, because a little aliasing at high intensity flickers badly.

### Banding, and why it gets its own section

This is the most directly stealable material Playdead published.

- **[doc]** Output is 8-bit per channel; the eye perceives something closer to 14. Higher-precision buffers were too slow on some platforms, and sRGB targets had awkward platform implementations, so they dithered instead.
- **[doc]** The principle: add one bit of uniform noise before quantising, and the quantised result averages out to the original signal.
- **[doc]** Gjøl is emphatic that this is **two lines in a pixel shader** — add a random number on output — and says there is no reason any game should ship with banding, indies included.
- **[doc]** Uniform noise has a flaw called **noise modulation**: the error depends on the signal, so you get visible bands with no noise in them. Switching to a **triangular distribution** makes the error independent of the signal, at the cost of two bits of noise rather than one.
- **[doc]** To get that back, use **blue noise with a triangular distribution** — visibly less noisy and no bands. Implemented as a precomputed blue-noise texture for cache coherency, with an ALU version (two white noises summed) where bandwidth-bound.
- **[doc]** **What to dither matters as much as how.** The lighting pass, then the final pass, which re-quantises when it reads lighting and writes 8-bit. The **translucency pass is possibly the most important**, because blending reads and writes the same target repeatedly and re-quantises every time. The post pass too. They pushed their wide-glow pass to a 10-bit target with power-of-two compression on top.
- **[doc]** Banding is about quantisation, not colour, so **normals get dithered too** — needed only where intense speculars meet normals varying across large surfaces.
- **[doc]** **Animate the noise**, or it sits on the screen like dust on a lens as the camera moves. Animated noise also gets integrated away by the temporal anti-aliasing, which is a bonus.
- **[doc]** Dither the UI as well — it is mostly transparencies and fades. And output in the display's correct range so you dither the signal rather than leaving a television's limited-range conversion to do it badly.

### Noise, patterns, and blue noise

- **[doc]** The finding underneath several effects: **the eye is forgiving toward noise and unforgiving toward patterns.** White noise is cheap but noisy. A Bayer matrix gives good local coverage but reads as a pattern, which is worse.
- **[doc]** **Blue noise** — high-pass-filtered white noise — keeps the local-coverage property without being a pattern, and roughly halved the sample counts they needed. Svendsen's summary at the end of the talk is simply that blue noise is the general saviour and you should use it too.

### Local fog volumes

The flashlight effect, and a good worked example of getting an expensive thing cheap.

- **[doc]** Naively ray-marching to the depth buffer sampling the projected texture, shadow map and falloff took 128 samples and over a frame and a half.
- **[doc]** Fog is authored as **boxes**, intersected geometrically with the light frustum — clip the frustum by each box plane and patch the holes — so sampling only happens where both exist. Front faces and back faces are rendered in two passes to bound the march.
- **[doc]** The effect is smooth, so it runs at **half resolution** and is upsampled. The upsample deliberately adds a noisy blur to break up the half-resolution structure, which also feeds the temporal anti-aliasing: their TAA uses neighbourhood clipping, which handles per-pixel noise well and half-resolution noise badly.
- **[doc]** The shipped version is around three samples at half resolution — **under one sample per full-resolution pixel** — in under a millisecond. Shadow maps and projected textures are also downscaled, since the effect is blurry anyway.
- **[doc]** The same boxes carry effects: above water the light is sampled as-is; below, an animated texture fakes caustics.

### Light types

- **[doc]** Because the light pass just writes into a buffer, they could add custom light types freely.
- **[doc]** The **bounce light** is the simplest and does the pseudo-global-illumination work by hand: a wrapped or double-Lambert term with an artist-facing **hardness** parameter that fades the front-to-back dot product. The effect is to blur where the light appears to come from, so it reads as an area rather than a point, and can be faded all the way to flat ambient.

### VFX techniques worth remembering

- **[doc]** **Fire is coloured once, not per sprite.** Individually coloured sprites stack during blending into implausible brightness, so instead they render black-and-white "hotness" sprites additively into a single buffer — reusing the HDR bloom alpha, since fire blooms anyway — and apply **one gradient** on read-back.
- **[doc]** Their flipbook animation avoids two failure modes at once: sequential frames make a short loop obvious, and random frames repeat often enough that a repeat reads as lag. The fix is **sequential columns with random rows**. Frames cross-fade along a vertical gradient with noise rather than cutting.
- **[doc]** **Rain is a mesh of individual raindrops** with a vertex shader that wraps a drop back to the top of the volume when it reaches the bottom. Splashes expand with random rotation and reposition on the integer part of time while animating on the fractional part. Scrolling post effects had no parallax; scrolling sprites had too much overdraw.
- **[doc]** **Lens flare occlusion without ray casts or colliders**: sample the depth buffer stochastically **per vertex** — four samples for a quad rather than anything per-pixel — and multiply into the flare. Offsetting those samples off-centre gives a free gradient across the flare, since you are sampling all four corners anyway.
- **[doc]** Screen-space reflections need an assumed wall thickness, or objects stretch — the artists' name for the artefact was "the boy with MC Hammer pants." Using the screen-space ray's movement as the thickness fails on a wall at 45° to the viewer, where the ray barely moves; using the reflection direction itself works.
- **[doc]** Large water uses **planar reflections, not screen-space** — a surface spanning most of the screen shows the artefacts too readily. Layers are rendered as separate objects and the order flips when the camera goes under. Each layer writes an "already rendered water" stencil bit and later geometry reading that bit discards, which lets them render front-to-back with rejection instead of back-to-front.
- **[doc]** The tiling trick for foam: wavy cobblestones tile perfectly without looking tiled, so they traced the wave lines from a photograph, layered stock wave imagery underneath, and removed the lines.

**Godot translation:**

- `WorldEnvironment` with volumetric fog on. Set fog to fall off linearly rather than exponentially if bright sources need to punch through it — that clamp is what keeps lights readable through heavy fog.
- **Debanding on in project settings from day one.** Godot's debanding is the same idea as Gjøl's two lines, applied at the end of the pipeline, and it is free. Worth knowing what it does *not* cover: it dithers the final output, not every intermediate pass. Playdead found the translucency pass the most important one to dither because blending re-quantises repeatedly, so heavy layered transparency plus wide fog gradients is where banding may still appear.
- Animate any noise you add yourself. Static noise reads as dirt on the lens the moment the camera moves.
- One strong key light per shot, plus fill. Godot doesn't split diffuse/specular/bounce authoring, so the equivalent is per-area Environment overrides and careful light energy. The bounce light's *hardness* idea — softening the falloff until the source is ambiguous — transfers as a light with low energy and wide range rather than a tight one.
- Grey-box test corridor with one light and fog, tuned before any real modelling. Godot's defaults will not look like this; the knobs are where the style lives.

---

*Part of [INSIDE reference notes](README.md). Claim tags are explained there.*
