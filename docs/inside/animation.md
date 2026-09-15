# Animation and physics

- **[obs]** Large amount of contextual animation: grabbing, stumbling, catching himself, decelerating before a wall, reacting to being caught.
- **[obs]** Visible weight and momentum. He does not stop on a dime.
- **[obs]** Ragdoll goes fully 3D on death, breaking the plane constraint. Reads as drama, not as a bug.
- **[doc]** The huddle (the late-game creature) is not conventionally animated. Its skinned mesh has bones governed by physics rather than animation curves — a sack of physics bodies with dynamic arms imposed on top, moved by physics and animation as one unit, then glued together with specialised shading.
- **[doc]** The huddle took more than four years on and off. A consultant hacked together a working prototype in one month, which convinced the team it was worth doing; a programmer was then dedicated to it for the rest of the project. Roughly a third of the company touched it at some point.
- **[doc]** Grøntved, the animator, is explicit that people assume the huddle is thousands of hand animations strung together, and that this is neither true nor feasible.

### How the huddle actually works

From *Huddle Up!* (GDC 2017), three speakers: the animator, the senior programmer and
a gameplay programmer. **Watched and transcribed.** Two of the three names are
destroyed by the captions and are not reproduced here.

**Conception.** The animator's job before production was to find the movement.

- **[doc]** The reference wasn't a spec but a single drawing by the lead artist, known internally as "the huddle drawing" — a potato. It was consulted throughout production for decisions on modelling, shading, lighting and shadowing, **and not only for the huddle but for the whole game**. This is the concept-art-as-design-document pattern from [how they actually worked](how-they-worked.md), named.
- **[doc]** Three stated inspirations: the demon boar from *Princess Mononoke*, which morphs and grows a limb wherever its purpose requires one; the physics blob game *Gish*, which deforms to squeeze through gaps; and **crowd surfing** — many hands with a shared goal but different motives, some lifting gently, some holding you in place, some trying to bring you down. The huddle is framed as a cluster of individuals with one goal and conflicting motives.
- **[doc]** The concept rig was deliberately crude — four spine bones, points scattered over the surface, six legs, several arms and torsos, two free-floating bodies — so limbs could be pulled inside and pushed out elsewhere. Fast to animate with no rig in the way.
- **[doc]** The first concept animations date to **late 2010**, months after Limbo shipped. Around **40** were made before any production work, described as a spot on the horizon to aim for. He says the team outdid them by miles.
- **[doc]** Silhouette beat plausibility explicitly: three arms grip the swinging crane where plausibility would want twenty.

**The core, from the senior programmer.**

- **[doc]** **26 dynamic bodies** — rigid bodies with colliders, stepped by a custom physics model. On top of them sit the same number of *internal bones*, caching position, velocity and mass and accumulating the impulses that get synced back.
- **[doc]** An **adjacency graph** links nearest neighbours. At boot the bodies are placed on a sphere and the edges are established then — **the edge configuration never changes again**. Each edge is a spring with a target length, and the target lengths deform continuously with the core's scale and height.
- **[doc]** **Two spine bones** sit above all that, driven by logic states and a little animation rather than by physics. Each owns a *cluster* of internal bones which hold local positions relative to it, so applying torque to the top spine bone drags its cluster along. The programmer's phrase for this is "skimming the physics" — macro control over a simulation you don't otherwise steer.
- **[doc]** Because many largely independent systems all push impulses into one core, the result is explicitly **emergent** — unpredictable, and tuned by constant tweaking rather than designed to a spec.
- **[doc]** Landing non-vertically is normal, and rotating the spine upright looked silly. Instead they **reconfigure the spine** so the structure rises. Doing that instantly pops, because every constraint changes at once, so the **rest lengths are blended** to hide it. He states the general rule plainly: they worked very hard to avoid any visible pop.

**The visual layer, from the gameplay programmer.** The best part of the talk, because
it is so much cheaper than it looks.

- **[doc]** He joined while the core was a buggy floating blob, and was **not allowed to touch the physics** because it changed constantly. His job was a thin visual layer, done early specifically to find out whether the thing could ever be convincing.
- **[doc]** His demonstration: the *shipped* huddle with its legs hidden looks like something you would doubt could ever ship. His analogy is the internet joke of crude stick arms drawn onto a bird, which makes it a different animal entirely. The legs are what sell the mass.
- **[doc]** The mesh covers the **front only** — the back is empty because it is never seen. Six legs attach to physics bodies at the bottom, six arms at the top (one of which is a leg behaving as an arm), and they reconfigure when the creature turns so the silhouette always reads.
- **[doc]** Loose body parts on the front were ragdolls glued on, swapped later for **custom springs** for performance. Losing the ragdolls lost their collision, so the parts now **retract near walls** to stop them clipping. Small forces on the springs make them squirm, so they read as alive rather than as an unconscious body.
- **[doc]** **The entire leg system uses seven animations**: two running forward, two running backward (played in reverse), one stumble over an edge, two falling. The algorithm is: raycast down from the attachment body to find the ground, **blend between the high and low run cycle by distance to ground**, and **drive playback speed directly from the physics body's velocity**.
- **[doc]** The refinements are small and specific: on stopping, blend to a pose with the foot down, because nobody stands with a foot in the air. Leg phase offset changes by gait — together at rest, maximally apart walking, about 25% apart galloping.
- **[doc]** Sliding on a slippery floor is **the animation frozen** while the physics runs unchanged, plus a slide sound.
- **[doc]** Each foot plant sends a small **shockwave of impulses up the body** so the mass jiggles. He admits it is hard to see, and says it makes a large difference in play — the difference between an animal and something translating through space.
- **[doc]** The arms work the same way. Grabbing is a physics model; the arms are flavour on top. The two animations used most are a **grab that is scrubbed by play position** so it reaches different distances, and a retract for when a dynamic arm is finished and withdraws into the body.
- **[doc]** The production rule underneath all of it: they tweaked the huddle for the gameplay they needed, and **where they could not make it work they deleted the gameplay and designed something else the system could do**.

**Honest note:** animation is the most likely bottleneck for a solo dev and the one
least helped by the low-poly art style. Two options: budget for it explicitly, or
design a game that needs less of it.

**The prototype-in-a-month pattern is worth copying.** Before committing to an expensive
mechanic, build the ugliest possible version and see if it's fun.

**The leg system is the most encouraging thing in this whole file.** Seven animations,
a downward raycast, one blend on height and one mapping from velocity to playback
speed — and it carries a creature people assume was hand-animated for years. The
expensive part of the huddle was the core simulation; the part that makes it *read* is
cheap and within reach. Where animation budget is tight, look for the equivalent
trick before authoring more clips.

**"If the system can't do it, change the gameplay" is the production lesson.** They
had four years and a dedicated programmer and still bent the design to the tech rather
than the other way round. A solo dev has less room, not more.

---

*Part of [INSIDE reference notes](README.md). Claim tags are explained there.*
