# Sweep

[Play Sweep](https://dumb-tony.github.io/sweep/) — one filthy floor, one broom, no rush.

- Read [GDD.md](GDD.md) for the comprehensive design and scope.
- Read [docs/PROTOTYPE_M1.md](docs/PROTOTYPE_M1.md) for the standalone HTML mechanic test and acceptance gates.
- Record actual test evidence in [docs/PLAYTEST_LOG.md](docs/PLAYTEST_LOG.md).
- Design provenance remains in local source-basis notes, excluded from Git because they contain private conversation excerpts.

Intended working directory: C:\GPT_DEV\sweep

M1 is implemented. Gather 80 leaves and 20 cans into the bin, clean 90% of eligible weight, and push the keys into their tray. The offline HTML includes start, play, result and restart. Engineering checks do not establish that sweeping feels satisfying: the five fresh-player test remains pending. Do not expand into M2 until the gates are reviewed.

## Play offline

Download [prototypes/m1/index.html](prototypes/m1/index.html) and open it in a modern desktop browser. Code, geometry and generated sound are embedded. No build, accounts, external assets or network access is needed. Settings and records fall back to memory if storage is blocked.

Move the pointer or use WASD / arrows. Hold click or Shift for pressure, Space to lift, Q/E or wheel to rotate. Escape pauses; R restarts. Visible pressure/lift buttons latch those actions. Comfort settings include response speed, smoothing, input toggles, contrast, mute and reduced effects. Desktop input is the primary test target.

## Developer checks

Node.js is needed only for these tests and optional preview:

```text
node tests/physics.cjs
node tests/lifecycle.cjs
node tests/serve.cjs
```

The preview serves only the game at http://127.0.0.1:4175. Test outputs stay in ignored `artifacts/`. F2 toggles diagnostics. GitHub Pages deploys only the standalone HTML through the checked-in workflow. See [contact and tuning notes](prototypes/m1/README.md).
