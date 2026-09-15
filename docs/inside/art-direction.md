# Art direction and VFX

Primary source is *Turn it Down 90%* (Control Conference 2016, Mikkel Bøgeskov
Svendsen). **Watched and transcribed.** He joined after Limbo shipped and ended up on
VFX without expecting to.

- **[obs]** Low polygon counts, near-absent albedo detail, no visible normal-map work.
- **[obs]** Near-monochrome palette. The boy's red shirt is the only saturated colour for most of the game and anchors the eye in every frame.
- **[obs]** Environment silhouettes carry readability; shapes are simple and high-contrast against fog.

### The title is the method

- **[doc]** He arrived wanting to prove himself — the biggest explosions, the best rain, tens of thousands of rendered figures. The advice that corrected it was literally "how about you turn it down ninety percent", and he says it took a long time to sink in.
- **[doc]** His framing for the discipline: game VFX is the cherry on top, and like film CGI or stage makeup, people only remark on it when it's *bad*. The best version is the one nobody notices.
- **[doc]** The tuning instruction he was given, and the most usable line in the talk: **turn it down until it becomes uncomfortable**, then live with the discomfort. He describes it being uncomfortable for a few days before he began to enjoy the omission.
- **[doc]** Two concrete rules from it: don't make the rain the brightest thing on screen, and don't colour smoke opaque grey or yellow just because that is "smoke colour".
- **[doc]** The shipped rain is dim enough to read mainly on shaded surfaces and under a lamp post. The intent: you hear rain, your eye goes looking for it, and it is there. That is the whole requirement.

### Integrate rather than add

- **[doc]** The first water waves were additive and lit from a cube map, because that was the easy and fashionable approach. The result was reflections with no source in the scene — motion replaced by a distraction. The shipped version blends normally and samples the *same* reflection and refraction maps the water already uses, so it sits inside the picture rather than on top of it.
- **[doc]** Smoke is authored as two picked colours, a lit side and a shaded side, sampled from what is actually around it. The shader takes the dot product of the normal against a **custom light direction chosen per smokestack** — there is no single sun to reference — and blends between the two. He describes it as deliberately camouflaging the effect into the environment.
- **[doc]** Their standard particle shader **does not accept colour from the texture at all**, only alpha, with colour coming from that two-tone blend. The alpha is deliberately low-detail; variation comes from random rotation and random size instead.
- **[doc]** Lens flares were going to have rainbows. In a near-monochrome game they went monochrome almost immediately.
- **[doc]** The first water normal map was an ocean, generated from cellular noise with every octave, with screen distortion. It was a pond. The shipped version is a subtle bump that satisfies the need for motion and nothing more.

### Detail has a floor, not a ceiling

- **[doc]** Sub-particle motion — UV distortion sampled from a motion texture before the real texture — was taken from a Naughty Dog technique, chosen to keep overdraw low.
- **[doc]** His first attempt used sharp Perlin noise from a 3D package, on the reasoning that turbulence is what smoke does. It was too detailed to work even turned down entirely. The replacement was made in Photoshop from a UV gradient with a swirl filter applied and tiled — he calls it "world noise" — and it reads as slow, viscous motion at about ten percent strength.
- **[doc]** That particle system contains roughly **eight particles**.
- **[doc]** The rule he quotes from a mentor: **your work is only as good as its worst detail.** One detail too many either falls apart or reads slightly wrong, and wrong is attention-grabbing. *(The mentor's name is destroyed in the captions and is not reproduced here.)*

### Water edge displacement

The one deeply technical item, and a good illustration of the cost of things nobody sees.

- **[doc]** Crossing the waterline, the surface was a flat polygon — visible for perhaps two frames, and jarring after seeing it bumpy from above. The fix was a tessellated edge with displacement mapping near the camera.
- **[doc]** That introduced a hard cutoff at the top and bottom of the water band. The solution traces toward the horizon tracking the lowest and highest wave found, then fades each vertex out as it approaches either extreme while staying sharp at the horizon, using a remap (inverse lerp) on data carried from the vertex shader.
- **[doc]** He describes it as weeks of despairing work, so that the player does not notice a flat-pancake water surface.

### Deleting things

- **[doc]** Sometimes the right answer is removal, not restraint: an effect too aggressive, ten thousand figures replaced by a line in the background, a flourish dropped because the scene was already strange enough.
- **[doc]** He is openly unhappy about "kill your darlings" as a phrase, and gives a better reason for it: **you delete what you are too close to, because proximity removes your ability to judge whether it fits.**
- **[doc]** The counterweight, stated explicitly: they do turn it up to eleven once or twice, and knowing when you are the lead violinist and when you are not is the actual skill.
- **[doc]** He credits every lesson in the talk to mentorship rather than to himself.

**The trade for a solo dev:** the art style removes texture authoring, UV work and PBR
material sets almost entirely, and moves the cost into lighting. Good trade — lighting
is learnable alone. But low-poly under flat lighting looks like an asset pack, not
like Inside.

**"Turn it down until it becomes uncomfortable" is the version to keep.** It is an
actual procedure rather than an aspiration, and it costs nothing but nerve. Note that
this is a different move from the darlings channel in [puzzle design](puzzles.md) — that one finds a home for
work that doesn't fit, this one deletes it.

---

*Part of [INSIDE reference notes](README.md). Claim tags are explained there.*
