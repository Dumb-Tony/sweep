# Restoration clarity and tools

Tools now have separate models for broom, string mop, forked pry bar, notched tile trowel, scraper, plaster trowel and paint roller. Wood, rubber, cloth and metal use different materials. Tile setting has a crouching pose.

Unfinished floor tiles stay visibly absent until installed. Dust and grime retain a visible minimum size until cleared. Amber outlines automatically reveal the final twelve surface patches (four patches in machine cleaning). Show unfinished reveals every remaining section; Find next patch routes the player to work or the disposal bin. Counts and percentages no longer round unfinished work up to 100%.

Completion uses the individual work cells, not their average. A fully completed saved surface advances on loading. The work footprint includes the player's feet, avoiding heading-dependent missed spots directly underneath the character.

## Verification

- Full deterministic route regression: all three cabinets through storage, sweeping, mopping, tile lifting, thirteen disposal trips, floor installation, all three wall passes, all three machine cleanings, wiring and cabinet return.
- Last-patch regressions for every surface; residual floating-point values; 32 camera headings; recovery of a completed saved floor.
- Browser checkpoint playtests: storage to sweeping; sweep to mop; mop to lifting; lift to debris; disposal to installation; final tile to stripping; stripping to patching; patching to painting; painting to machine cleaning; rubbing the last machine patch; failed and successful wiring; cabinet return; a completed arcade round (7 stars).
- Browser checks of Find next patch, remaining counts, automatic outlines and tool rendering. No browser warnings or errors observed.

Browser testing used prepared local checkpoints and actual UI input. It was not a continuous manual playthrough. Full routes were exercised by the deterministic simulation. Run `node tests/serve-checkpoints.cjs` to reproduce local browser checkpoints on port 4176; use `?step=store`, `sweep`, `mop`, `lift`, `dispose`, `lay`, `strip`, `patch`, `paint`, `clean`, `repair`, `return` or `play`. This server is local-only and its fixture saves are separate from the public game's origin.
