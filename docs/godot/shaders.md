# Shaders

Source: Godotneers, *Welcome to Shaderland*. 2D throughout, to keep the maths simple.

## The pipeline

- **`[video]`** A shader is a program that runs on the GPU rather than the CPU, and changes how meshes and textures get rendered.
- **`[video]`** *Everything* in Godot is a mesh — a `Sprite2D`, a label, a `Polygon2D` all have vertices and triangles underneath.
- **`[video]`** **Vertex shader** runs once per vertex and can modify vertex data. It cannot add or remove vertices or triangles — it's only ever called to modify one that already exists.
- **`[video]`** **Rasterisation** then puts a grid over the output and produces a *fragment* per pixel. Called a fragment rather than a pixel because it carries more than colour — screen location, lighting, normals, UVs.
- **`[video]`** **Fragment shader** runs once per fragment and modifies that data — colour, transparency — before the GPU writes the final pixels.
- **`[video]`** Shaders run **in parallel with no guaranteed order**, which is what makes them fast and also why a vertex shader can't add geometry.
- **`[video]`** **Nothing persists between frames.** A shader has no variables that survive; everything is recalculated from scratch every run. Animation therefore comes from the built-in `TIME`, which is seconds since engine start, always positive — not from a delta accumulated somewhere.

## Visual shaders vs the shading language

- **`[video]`** Both exist; neither is strictly better. Visual is good for learning and prototyping. Code is necessary because visual shaders can't do loops or custom functions, and because almost every shader you find online is written as code.
- **`[video]`** The visual editor "likes to crash every now and then" — save often.
- **`[video]`** Visual shaders silently convert between vector sizes (dropping a component, or padding with zero). In code you do the conversion yourself.

### Language differences from GDScript

- **`[video]`** Return type goes before the function name; no `func` keyword; braces rather than indentation; `//` comments; statements end in semicolons; `if` conditions must be parenthesised.
- **`[video]`** **No implicit int-to-float.** `sin(x) * 100` fails; it has to be `100.0`. Same for comparisons — `< 0` must be `< 0.0`. This is the error you will hit first.
- **`[video]`** Data moves through built-in variables rather than parameters — read `VERTEX`, write `VERTEX`. Case-sensitive, and the built-ins are uppercase.
- **`[video]`** Vector components have interchangeable names: `.x`/`.y`/`.z` and `.r`/`.g`/`.b` are the same fields. Use the positional names for positions and the colour names for colours; it's purely for readability.
- **`[video]`** `uniform` declares a parameter exposed in the inspector. Hints refine the widget — `source_color` gives a colour picker rather than a raw vec4.

## Two things worth keeping

**`[video]`** Vertex coordinates in 2D are *local space* — relative to the sprite's centre, in pixels. That's what makes "only move the top of the grass" expressible: the upper vertices are the ones with negative Y. Effects come from finding a property that distinguishes the vertices you want.

**`[video]`** Write shaders with intermediate named variables and comments, not the dense one-liner style found online. The compiler optimises the extra variables away, so there is no performance cost — the compactness is purely a readability loss, and it's a large part of why shaders read as dark magic.

## For this project

**`[ours]`** Not needed soon, and worth being disciplined about. `inside-reference.md` §7
is explicit that the style lives in lighting — `WorldEnvironment`, volumetric fog,
debanding, one key light — none of which is a custom shader. Playdead wrote their own
renderer; §13 rates that "very high / no."

**`[ours]`** Where it would plausibly earn its place later: the diegetic desaturation
for the time-dilation meter in `../answers/2026-09-15-time-dilation.md`, and subtle
foliage sway. Both are the exact examples in this video, which is convenient. Neither
is worth touching before the grey-box corridor exists.
