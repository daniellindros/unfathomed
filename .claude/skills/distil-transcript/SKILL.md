---
name: distil-transcript
description: Distil a raw talk or tutorial transcript into the notes under docs/ — Playdead talks into docs/inside/, Godot tutorials into docs/godot/ — with the right confidence tag on every claim and the register updated. Use when Daniel pastes a transcript, points at a file in reference/transcripts/, or asks to work through one of the talks tracked in Plane under the transcript label.
---

# Distil a transcript into the notes

Input is a raw auto-generated transcript — pasted into chat, or a file in
`reference/transcripts/`. Output is an edit to one or more files under `docs/`, a
row in the register, and usually a work item in Plane.

The job is the same whatever the source: read it all, tag every claim by how much
it's worth, merge it into the file that owns the topic, and say what it costs
*this* project. The destination decides the tag vocabulary and the hazards, and
that's most of what differs.

## Where it goes

| Source | Destination | Tags |
|---|---|---|
| Playdead talk about INSIDE | `docs/inside/` | `[doc]` `[obs]` `[guess]` |
| Godot tutorial | `docs/godot/` | `[docs]` `[video]` `[ours]` |
| Anything else | **Stop and ask.** See below. | — |

`reference/transcripts/godot/` holds the Godot ones. A Godot tutorial never feeds
`docs/inside/`, and a Playdead talk never feeds `docs/godot/` — even when a
Playdead talk is about a technique, because `docs/godot/` is about this engine and
`docs/inside/` is about that game.

### When it's neither

A general game-design talk — puzzle design, level design, production, anything
that isn't INSIDE and isn't Godot — has no home in `docs/` yet, and opening one is
Daniel's call, not a side effect of watching a video. Ask before writing anything.

Two things to put to him when it comes up:

- **The bar.** A nugget earns a home if it would change what he does on *this*
  game. If it wouldn't, it's trivia, and the cheapest place for it is nowhere.
  Third-party material that isn't about INSIDE or Godot has a way of being
  unbounded — there is always another GDC talk — and this project's stated risk is
  scope creep.
- **The shape.** Start as one file, not a folder. `docs/inside/` was a single
  `inside-reference.md` until it grew enough that filename-as-index beat section
  numbers; that's the precedent, and a folder with a README and an index table
  before there are three files' worth of material is overhead with nothing in it.

Anything genuinely worth adopting goes to Plane as a `decision` item regardless,
which is the escape valve when no doc home fits.

## Before writing anything

Read the whole transcript first. Auto-captions have no punctuation and no speaker
labels; a claim's meaning often only resolves several paragraphs later.

**Read the file header.** It records which caption track YouTube served. A track
tagged as a language other than the one spoken was transcribed with the wrong
speech model, and the header says so — in that case names and technical terms are
not just unreliable, they are wrong, and nothing specific survives without
verification against the slides.

## The tagging rule

Every factual line gets a tag. An untagged factual line is a bug. When unsure
between two tags, take the weaker one — a weak tag that turns out to be solid costs
nothing, a strong tag that turns out to be inference poisons the file.

**`docs/inside/`:**

- **`[doc]`** — a Playdead speaker stated it. This certifies *attribution, not
  truth*. "Fasterholdt recommends Swink's 200ms figure" is `[doc]`; "200ms is the
  threshold of perceived causation" is not — that's Swink's claim, and the talk is
  only evidence that Playdead use it.
- **`[obs]`** — observable by playing the game or watching footage. Reliable as
  description even when the method behind it is unknown.
- **`[guess]`** — inference. Anything the speaker implied rather than said,
  anything reconstructed from a slide, anything from the community. If you find
  yourself writing "presumably", "likely", or "they must have", it's `[guess]`.

**`docs/godot/`:**

- **`[docs]`** — checked against the official Godot documentation. A tutorial
  claim is not `[docs]` because it sounds authoritative; it's `[docs]` once
  verified, and the manual is live and queryable, so verifying is cheap.
- **`[video]`** — stated in the tutorial, not verified. Name the source.
- **`[ours]`** — a ruling for this project, with the reasoning. This is the tag
  that makes the file worth more than the manual.

## Auto-caption hazards

Captions garble exactly the things that make a claim specific. Verify against the
talk's slide PDF (linked in the file's Sources section), the Playdead publications
index, or the official Godot docs before writing any of these:

- **Names.** Gjøl, Grøntved, Bøgeskov, Fasterholdt, Kjems, Konsoll — all reliably
  mangled. So is "Godotneers", which arrives as "goners", "Golden Ears" and "girl
  Denise".
- **Numbers and units.** "200 milliseconds" and "20 milliseconds" sound identical
  to a caption model and differ by an order of magnitude.
- **Technical terms.** "temporal reprojection", "additive poses", "Wwise",
  "screen-space reflections" — and every Godot identifier, which the caption model
  has never seen: `CharacterBody3D`, `_physics_process`, `@export`, `@abstract`.

If a name, number, or identifier is load-bearing and can't be verified, either
leave it out or write the claim without it. Never launder an uncertain detail by
tagging the sentence `[doc]` or `[docs]`.

**Godot only: version matters.** These tutorials rot in a way the Playdead talks
don't. Note which version a source targeted when a claim is version-sensitive — the
project is on 4.7 (`decisions.md`), and something like `@abstract` doesn't exist in
an older 4.x.

## Merging into the files

Both folders are one file per question, not per source. Read the folder's
`README.md` for the list, then merge into the files the material belongs to — one
talk's content usually scatters across several.

Only add a new file if the source opens a genuinely new topic area, and add it to
the README table when you do. `game-feel.md` exists because the Konsoll talk is the
only substantial source on it; that's the bar.

When a claim contradicts something already in the file, **correct the existing line
in place**. Don't append a note saying the old line was wrong — a file that
contradicts itself is worse than one that's slightly out of date.

## Also update

**Always:**

- **`reference/transcripts/_INGESTED.md`** — the register. Flip the source's "Used?"
  cell to which article it went into. The register is what stops the next session
  hunting through the folder, and it's only true if it's updated in the same pass.
- **Plane** — close the source's work item if it has one (project `UNFAT`, label
  `transcript`). Those items track distillation, not download, so a source with no
  item is normal — don't create one just to close it.

**`docs/inside/` only:**

- **`stealable.md`** — a newly-learned technique gets a row: technique, cost, verdict.
- **`open-questions.md`** — delete ones the talk answered, add ones it raised.
- **`sources.md`** — mark the talk as watched and transcribed.

**`docs/godot/` only:**

- **`README.md`** — the article table lists each file's covers and sources; add the
  new source to the row.

## What never happens

- **Nothing in these files is a requirement.** `docs/inside/` describes what ~25
  people did over six years. `docs/godot/` is one tutorial author's approach. Write
  both as description, never as instruction.
- **Never add to `decisions.md`.** A transcript is third-party source material and
  is never authoritative over it. If something is worth adopting, it becomes a work
  item in Plane labelled `decision` — Daniel decides, not the transcript.
- **Don't inflate the file.** A three-hour talk might yield six lines. Volume of
  transcript is not evidence of volume of finding.

## Voice

Match the file: terse, declarative, no hedging outside the tags — the tags carry the
uncertainty, so the prose doesn't need to.

Close with the judgement, in bold, one or two sentences. That judgement is the
reason the file exists; the description without it is trivia.

- **`docs/inside/`** — what the technique costs a solo dev.
- **`docs/godot/`** — an `[ours]` ruling: which way this project goes and why, or
  that it isn't needed yet and what would make it needed.
