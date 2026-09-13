> The current playable implementation is now [fully 3D](ARCADE_3D.md). This document records the broader pivot and its initial flat prototype.

# After Hours — active direction

Approved 13 September 2026: pivot Sweep into a cozy abandoned-arcade restoration game. Working title: After Hours. Keep the existing repository and public URL. The previous Sweep prototype remains available under `/legacy/`.

## Player promise

Restore a place, then enjoy what you brought back to life. Clear space, uncover discoveries, clean surfaces, repair machines, choose finishes, and reopen a room full of playable games. Restoration should deliver frequent visible payoffs, with no mandatory customer timer interrupting decorating.

## First playable slice (v0.1)

One front room, three movable cabinets, a back storage area, and one repairable/playable cabinet. Seven steps: store cabinets, sweep debris, scrub grime, restore floor, paint walls, solve the circuit, place Star Signal. Completion unlocks ongoing floor/wall/cabinet color changes and a 30-second star-catching game with saved best score. Four floor finishes, four wall colors, four Star Signal body colors. Local progress saves automatically; blocked storage falls back to session play. Mouse/touch dragging and keyboard tool controls, plus cabinet-movement buttons.

This is an interaction prototype, not the complete renovation game. Movement uses drag/drop and storage snapping; sweeping clears contact patches, rather than carrying forward M1's pile simulation. Cleaning and floor work currently share a stroke-based coverage model. Only Star Signal is repairable and recolorable; the other two cabinets are set dressing after storage. No economy, customers, multiroom campaign, component-by-component recoloring, wall patterns, structural work, or expanded repair catalog yet.

## Next design work

First validate whether the small restoration payoff is enjoyable. Give sweeping, scrubbing, and resurfacing more distinct tactile behaviors. Then add discoveries and a second cabinet with a different repair, a small upgrade decision, independent cabinet trim/control colors, and room layout editing. Larger rooms, storage logistics, player-triggered opening nights, income, signs, and customer reactions follow after the core loop earns expansion.

Keep progress forgiving: no consumable token grind to play restored games, free appearance changes, clear puzzle hints, and no lost cleaning progress when controls switch.

## Validation, 13 September 2026

- Automated model regression: complete seven-step route, out-of-stage actions, invalid placement, each individual broken connector, save roundtrip, malformed save rejection.
- Browser input playthrough: dragged all three cabinets to storage, swept and scrubbed the full floor, switched keyboard/pointer, selected Seaside tiles, reloaded at 44% restored and continued, applied Rose dusk walls, checked failed circuit/hint, solved all six connectors, dragged working cabinet back, reached 100% restored, launched and played Star Signal.
- Inspection found and fixed initial viewport overflow, storage cabinet/header overlap, wall preview not rendering, and circuit rotation losing keyboard focus.
- Browser console: no warnings/errors during local route. Browser automation and visual inspection do not constitute human feel testing.

Public deployment verification is recorded after release in the delivery response.
