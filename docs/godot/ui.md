# UI

Source: Godotneers, *Godot UI Basics*. Editor-only — no GDScript needed to follow it.

Filed even though this game has almost no UI, because two things here are project
settings that want deciding once and early, not retrofitted.

## The two settings that matter before anything else

- **`[video]`** **Reference resolution.** Project Settings → Window → Viewport Width/Height. You design at one resolution and Godot scales from it. Pick what most players have; the video checks the Steam Hardware Survey and lands on 1920×1080. The editor's screen rectangle sometimes doesn't refresh — Project → Reload Current Project fixes it.
- **`[video]`** **Stretch mode and aspect.** Project Settings → Window → Stretch. `disabled` (the default) is what makes a UI fall apart when the window resizes. `canvas_items` stretches the base size to the whole screen, which is usually what's wanted. Then `aspect`: `keep` gives letterboxes and pillarboxes, `ignore` distorts, and `expand` keeps the aspect while using the extra space to show more of the world.

**`[ours]`** `expand` is the one that matches a cinematic 2.5D game — more world
visible on a wider monitor, no bars, no distortion. It also interacts with framing:
`../inside/camera.md` says every screen in INSIDE is composed, and `expand` means
the composition's edges differ between aspect ratios. Worth knowing before shots get
framed, not after.

## Structure

- **`[video]`** **`CanvasLayer`** separates UI from the game world. Without it the UI lives in the same space as the game and moves when the camera does. Render order is tree order — later siblings draw on top.
- **`[video]`** **Containers lay out their children; you don't position UI by hand.** A container asks each child how big it wants to be, then places everything. Manual positioning breaks the moment text length changes — which it does with different numbers, and badly with localisation.
- **`[video]`** Containers only lay out **`Control` nodes** (green icons in the Add Node dialog). A `Sprite2D` is invisible to them — use `TextureRect` instead.
- **`[video]`** The useful ones: `GridContainer`, `VBoxContainer`, `HBoxContainer`, `PanelContainer` (a panel that resizes to its content), `MarginContainer`, `CenterContainer`.

## The sizing model, which is the confusing part

- **`[video]`** **Expand** controls how much space a control *requests*: off means minimum size, on means "give me whatever you can spare."
- **`[video]`** **Fill / Shrink Center / Shrink Begin / Shrink End** controls what it *does* with the space it got.
- **`[video]`** These two are independent, and that's the trap — with Expand off, the fill setting appears to do nothing, because the control only received its minimum size in the first place.
- **`[video]`** **Stretch ratio** splits space between expanding siblings: each gets its ratio over the sum of all ratios. Two controls at 1 and 3 get a quarter and three quarters.
- **`[video]`** A bare `Control` node renders nothing and makes a **spacer** — set it to expand and it pushes its siblings around. This is how you centre or bottom-align a group, because `CenterContainer` only gives children their minimum size and so kills expansion inside it.
- **`[video]`** `TextureRect` has its own trap: `expand_mode` `ignore_size` reports zero minimum size, so the container gives it nothing and it vanishes. `fit_width` derives width from height. Pair with `stretch_mode` `keep_aspect_centered` or the image distorts.

## Themes

- **`[video]`** A `Theme` resource restyles controls by type. Three ways to apply it: on one control (tedious), on the root of a UI subtree (inherited by descendants), or globally in Project Settings → GUI → Theme → Custom, which needs an editor restart.
- **`[video]`** **Theme type variations** give one control type several looks — a `BigPanelContainer` based on `PanelContainer`, or Godot's built-in `HeaderLarge` label variation. Set via the control's Theme Type Variation field.
- **`[video]`** `StyleBoxTexture` with texture margins keeps a border unstretched while stretching the middle — a nine-patch. Without margins the border smears.
- **`[video]`** Buttons need a style box per state — normal, hover, pressed, disabled.
- **`[video]`** **Controls don't watch for theme changes.** After editing a theme, Scene → Reload Saved Scene, or the editor keeps showing the old look.

## For this project

**`[ours]`** INSIDE has no HUD and no menus during play (`../inside/production.md`), and the time-dilation
sketch deliberately puts its meter in audio and colour rather than on screen. So this
is for the pause and options menus and nothing else.

**`[ours]`** Set reference resolution and stretch mode during the grey-box corridor
anyway. They're project-wide, they change how every shot is framed, and they are
annoying to change once there's content built against them.
