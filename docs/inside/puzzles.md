# Puzzle design

- **[doc]** Jeppe Carlsen's rule, from his GDC 2010 Limbo talk: puzzles should tax the brain but be physically easy to overcome. The solution should be easy to execute, and wrong approaches clearly not possible.
- **[doc]** Checkpoints placed so the player never repeats a puzzle they've already solved.
- **[doc]** Playtesting showed players press every button on the pad; you are blind to the approaches they'll try.
- **[doc]** Inside's puzzles are deliberately *less* logic-dense than Limbo's. In Limbo everything needed is usually on screen and the puzzle can almost be solved by looking. Inside allows a "puzzle" to be walking somewhere, pulling a lever, and watching something happen. More about being there than about solving.
- **[doc]** The hidden orb rooms became a home for "darlings" — puzzles somebody loved that didn't fit the main game. The torch-and-dogs puzzle ended up there because it wouldn't work in the critical path.
- **[obs]** Nearly every mechanic is bespoke: introduced, used once, discarded.
- **[doc]** Sometimes the simple solution wins. On Limbo they spent weeks trying to build an elaborate puzzle for getting the spider web off the boy, and settled on having him fall down a ledge so it comes off.

### Conveying failure

Fasterholdt treats this as a first-class design problem, and it's the most portable
idea in the Konsoll talk.

- **[doc]** If a gap looks *almost* jumpable, players will retry it endlessly and hate it. Make impossible jumps obviously, generously impossible.
- **[doc]** The general form: any wrong solution that looks plausible will trap the player. Playdead actively deleted whole puzzles because a failed approach looked convincingly right, rather than trying to signpost around it.
- **[doc]** Wrong interactions still get feedback. The boarded door in the barn has push and pull animations that clearly show "you're interacting, just not correctly" — without feedback the player concludes the object is inert.
- **[doc]** The heavy hatch can be grabbed while standing on top of it. Rather than blocking that, they let you try, give a small controller rumble, and nothing happens. Letting the wrong attempt play out is treated as better guidance than preventing it.

**This is a discipline, not a feature.** Costs nothing but attention, and it's the
difference between a puzzle feeling fair and feeling broken.

**Production implication.** Bespoke-per-puzzle is the most expensive design model there
is and the least available to a solo dev. The alternative is combinatorial — one system,
many rooms (The Swapper, Cocoon, and Carlsen's own 140). Which model this project uses
determines its whole production shape, so it belongs in `decisions.md`.

**The darlings trick is worth stealing.** A side channel for good ideas that don't fit
means not having to either force them in or throw them away.

---

*Part of [INSIDE reference notes](README.md). Claim tags are explained there.*
