# Data models

Sources: Godotneers, *Data models*; BucketBrigade, *state machine* video.

## The problem

- **`[video]`** Building everything from nodes works until the same thing has to exist in two places. A weapon lying in the world and the same weapon in an inventory are the same item, but a node models only the first. *(Godotneers)*
- **`[video]`** You don't want to hand an inventory a whole 3D scene — it carries a model, an area, a pickup script, none of which the inventory needs. What's needed is an object holding what the item *is*, separate from how it's shown. *(Godotneers)*

## The naive version and why it fails

- **`[video]`** Start with a dictionary in an autoloaded `items.gd`, keyed by string id, each entry a dictionary of name and scene path. It works. *(Godotneers)*
- **`[video]`** Three problems arrive quickly: string ids are typo-prone with no autocomplete (the video hits this live and spends a minute debugging a mistyped id); scene paths are hardcoded strings, so renaming or moving a scene breaks the database silently; and the dictionary gets unmaintainable as it grows. *(Godotneers)*

## The fix: Resources

- **`[video]`** Godot's `Resource` is the built-in type for storing data. Subclass it, give it typed exported properties, and create instances as files from the editor's right-click → New Resource. *(BucketBrigade)*
- **`[video]`** BucketBrigade uses exactly this for a state machine: an abstract `Data` resource, subclassed as `PlayerData`, holding speed, jump height, acceleration, friction. States read `data.friction` rather than holding their own numbers, which is what lets one state machine drive more than one entity. *(BucketBrigade)*

Typed properties fix all three problems at once — autocomplete instead of strings,
real scene references instead of paths, and one file per item instead of one growing
dictionary.

**`[ours]`** Relevant sooner than it looks. `../inside/game-feel.md` is a list of
per-action tuning values — cut-short frame thresholds, minimum hold durations, the
two-tier lean threshold — and those are the same shape as `PlayerData`. Keeping them
in a resource rather than scattered across state scripts means tuning in one place,
which is the pattern the whole reference file keeps pointing at.

**`[ours]`** Not needed for the grey-box corridor. Exported variables on one script
are fine until there are two entities or a tuning pass that spans several scripts.

---

*Godotneers' video continues past the point read; the second half covers extending and
combining data models and tooling for balancing. The Resource conclusion above is
sourced from BucketBrigade, who does the same thing.*
