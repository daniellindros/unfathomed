---
name: distil-transcript
description: Distil a raw conference-talk transcript into docs/inside-reference.md with correct [doc]/[obs]/[guess] tagging. Use when Daniel pastes a transcript, points at a file in reference/transcripts/, or asks to work through one of the talks tracked in Plane under the transcript label.
---

# Distil a transcript into inside-reference.md

Input is a raw auto-generated YouTube transcript — pasted into chat, or a file in
`reference/transcripts/`. Output is an edit to `docs/inside-reference.md`, and
usually a work item in Plane.

Read the whole transcript before writing anything. Auto-captions have no
punctuation and no speaker labels; a claim's meaning often only resolves several
paragraphs later.

## The tagging rule

Every factual line gets a tag. An untagged factual line is a bug.

- **`[doc]`** — a Playdead speaker stated it. This certifies *attribution, not
  truth*. "Fasterholdt recommends Swink's 200ms figure" is `[doc]`; "200ms is the
  threshold of perceived causation" is not — that's Swink's claim, and the talk is
  only evidence that Playdead use it.
- **`[obs]`** — observable by playing the game or watching footage. Reliable as
  description even when the method behind it is unknown.
- **`[guess]`** — inference. Anything the speaker implied rather than said,
  anything reconstructed from a slide, anything from the community. If you find
  yourself writing "presumably", "likely", or "they must have", it's `[guess]`.

When unsure between two tags, take the weaker one. A `[guess]` that turns out to be
solid costs nothing; a `[doc]` that turns out to be inference poisons the file.

## Auto-caption hazards

Captions garble exactly the things that make a claim specific. Before writing any
of these, check them against the talk's slide PDF (linked in the file's Sources
section) or the Playdead publications index:

- **Names.** Gjøl, Grøntved, Bøgeskov, Fasterholdt, Kjems, Konsoll — all reliably
  mangled.
- **Numbers and units.** "200 milliseconds" and "20 milliseconds" sound identical
  to a caption model and differ by an order of magnitude.
- **Technical terms.** "temporal reprojection", "additive poses", "Wwise",
  "screen-space reflections".

If a name, number, or technical term is load-bearing and can't be verified,
either leave it out or write the claim without it. Don't launder an uncertain
detail by tagging the sentence `[doc]`.

## Where the material goes

`inside-reference.md` is organised by question, not by source. Merge into the
existing numbered sections by topic — a talk's content usually scatters across
several of them.

Only add a new numbered section if the talk opens a genuinely new topic area.
Section 9 exists because the Konsoll talk is the only substantial source on game
feel; that's the bar.

When a claim contradicts something already in the file, **correct the existing
line in place**. Don't append a note saying the old line was wrong — a file that
contradicts itself is worse than one that's slightly out of date.

Also update, when the talk warrants it:

- **§13 table** — a newly-learned technique gets a row: technique, cost, verdict.
- **§14 open questions** — delete ones the talk answered, add ones it raised.
- **Plane** — close the talk's work item (project `UNFAT`, label `transcript`).
  Those items track distillation, not download.

## What never happens

- **Nothing in this file is a requirement.** It describes what ~25 people did over
  six years. Write it as description, never as instruction.
- **Never add to `decisions.md`.** A transcript is third-party source material and
  is never authoritative over it. If something is worth adopting, it becomes a
  work item in Plane labelled `decision` — Daniel decides, not the transcript.
- **Don't inflate the file.** A three-hour talk might yield six lines. Volume of
  transcript is not evidence of volume of finding.

## Voice

Match the file: terse, declarative, no hedging outside the tags — the tags carry
the uncertainty, so the prose doesn't need to.

Close a section with what the technique costs a solo dev, in bold, one or two
sentences. That judgement is the reason the file exists; a list of what Playdead
did without it is just trivia.
