# After Hours

[Play After Hours](https://dumb-tony.github.io/sweep/) — restore a forgotten arcade, one corner at a time.

The project has pivoted from Sweep to arcade restoration. The first playable slice includes moving three cabinets into back storage, sweeping and scrubbing, restoring floors, choosing wall and cabinet colors, solving a wiring puzzle, and playing the machine you repaired. Progress and the arcade best score save locally.

See [the active design and scope](docs/ARCADE_PIVOT.md). This is one room and one playable cabinet, not the full planned renovation campaign. Cleaning currently uses stroke coverage; richer physical interactions, additional repairs, upgrades, and reopening nights are future work.

The original Sweep game is preserved at [the legacy prototype](https://dumb-tony.github.io/sweep/legacy/) and in `prototypes/m1/`. Its original GDD and playtest records remain historical references.

## Development

No dependencies or build step. Run `node tests/serve.cjs` and open http://127.0.0.1:4175. The preview serves only the three arcade game files.

Checks:

```text
node tests/arcade.cjs
node tests/physics.cjs
node tests/controls.cjs
node tests/motion.cjs
```

GitHub Actions runs the new restoration checks and the preserved Sweep regressions before publishing to GitHub Pages. Deployment includes only the arcade game assets and the legacy standalone HTML. Private source-basis notes and diagnostic artifacts are excluded from Git.
