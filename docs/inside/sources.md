# Sources

### Playdead's own publications

Playdead maintain an index page with PDFs and video for everything they've published:
**https://blog.playdead.com/articles/inside_presentations/inside_publications.html**

Slide decks mirrored in their GitHub repo:
**https://github.com/playdeadgames/publications/tree/master/INSIDE**

**Fetching those PDFs:** the repo uses Git LFS, so the usual `raw.githubusercontent.com`
URL returns a 132-byte pointer file rather than the document. Swap the host for
`media.githubusercontent.com/media/` and the same path serves the real PDF.

Decks published there and **not yet read**, in rough order of likely value to this
project: the rendering deck (carries the shader code [rendering and lighting](lighting.md) refers to), *Banding in
Games*, the Huddle Up deck (which would settle the two speaker names the captions
destroyed), *The Boy from INSIDE* and the ITU audio talk, and the iOS shipping deck.

Individual talks:

- *Low Complexity, High Fidelity: The Rendering of INSIDE* — GDC / GDCE 2016, Gjøl & Svendsen. **Watched and transcribed.** The rendering source of truth and the source for [rendering and lighting](lighting.md). Read alongside the slides, which carry the shader code the talk refers to.
  https://www.youtube.com/watch?v=RdN06E6Xn9E (non-paywalled GDCE version)
- *Temporal Reprojection Anti-Aliasing in INSIDE* — GDC 2016.
  https://www.youtube.com/watch?v=2XXS5UyNjjU
  Source code (MIT, Unity 5+): https://github.com/playdeadgames/temporal
- *Banding in Games* — DTU VisionDay 2014. Dithering to kill colour banding.
- *Custom Pixels* — GGJ 2015. Replacing all shaders in Unity for fully custom rendering.
- *Turn it Down 90% — INSIDE VFX* — Control Conference 2016, Mikkel Bøgeskov Svendsen. **Watched and transcribed.** The source for [art direction and vfx](art-direction.md).
  https://www.youtube.com/watch?v=vA3uFC2p8eo
- *Huddle Up! Making the [spoiler] of INSIDE* — GDC 2017, three speakers. **Watched and transcribed.** The source for [animation and physics](animation.md). Two of the three speakers' names are unrecoverable from the captions; check the slides before citing anyone.
  https://www.youtube.com/watch?v=gFkYjAKuUCE
  Slides: https://media.gdcvault.com/gdc2017/Presentations/Grontved_Huddle%20Up!%20Making.pdf
- *A Game That Listens* — GDC 2016, Martin Stig Andersen. **Watched and transcribed.** Audio/gameplay feedback loops; the source for most of [audio](audio.md). Note: YouTube serves only a Danish-tagged caption track for this talk, transcribed with the wrong speech model — names and figures in it are unreliable.
  https://www.youtube.com/watch?v=Dnd74MQMQ-E
- *Unbreaking Immersion* — Wwise Tour 2016, Andersen and Jakob Schmid. **Parts 2 and 3 watched and transcribed**; part 1 has captions disabled on YouTube, so **the slide deck was read instead** — it covers all three parts plus bonus slides with the exact API calls and settings, and is the better source throughout. Claims in [audio](audio.md) and [performance and streaming](performance.md) have been checked against it.
  https://www.youtube.com/watch?v=gRF8Gt5hys4 (2, Voice) · https://www.youtube.com/watch?v=TcSuVzUjmLw (3, Scene Change)
  Slides: https://github.com/playdeadgames/publications/blob/master/INSIDE/schmid-Wwise_2016-INSIDE_Audio.pdf
- *The Boy From INSIDE* — AES 2016. Sound design of the main character.
- *The Playdead Approach to Audio* — ITU 2016. Wwise/Unity setup.
- *Tools, Tricks and Technologies for Reaching Stutter Free 60 FPS in INSIDE* — Unite 2016, three Playdead programmers. **Watched and transcribed.** The source for [performance and streaming](performance.md). Much of the detail is Unity-specific.
  https://www.youtube.com/watch?v=mQ2KTRn4BMI
- *Subtleties of INSIDE* — Konsoll 2017, Martin Fasterholdt. **Watched and transcribed.** The best source on game feel, control, and animation layering. [game feel](game-feel.md) is drawn almost entirely from it.
  https://www.youtube.com/watch?v=3pzgnN3pK_8
- *INSIDE Shipping on iOS* — Digital Dragons 2018.
  https://www.youtube.com/watch?v=bv6Oh4GWk2A

### Design

- Steve Swink, *Game Feel*. Recommended by Fasterholdt; source of the 200ms real-time-control figure.
- Jeppe Carlsen, *LIMBO: Balancing Fun and Frustration in Puzzle Design*, GDC 2010. About Limbo, but the philosophy carries directly.
  Summary: https://www.gamespot.com/articles/limbo-level-designer-talks-puzzles/1100-6273547/

### Interviews and analysis

- *Inside Inside* — Jeremy Hosking interviewing Peter Buchardt, commissioned by Kotaku UK, 2018. The best single source on how Playdead actually worked day to day.
  https://jeremyhosking.medium.com/inside-inside-3c55746dc46c
- *Inside — Teaching through Level Design*, Game Developer. Opening-forest breakdown.
  https://www.gamedeveloper.com/design/inside---teaching-through-level-design
- Playdead Unofficial Museum — fan-maintained index of interviews and talks.
  https://sites.google.com/view/playdeadunofficialmuseum/interviews-talks

### Academic

- "Inside the Loop: The Audio Functionality of Inside" — peer-reviewed analysis of the shockwave sequence and audio-led respawn.
  https://link.springer.com/article/10.1007/s40869-018-0071-x
