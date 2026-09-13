# After Hours

[Play After Hours in 3D](https://dumb-tony.github.io/sweep/) — walk into a forgotten arcade and bring it back to life.

The arcade is now a fully 3D environment: an animated third-person character, orbit/follow cameras, modelled cabinets and tools, shadows, a back workshop, a real doorway, and collision-constrained cabinet hauling. Walk with WASD/arrows or click the floor. E interacts; hold Space to work; right-drag or Q/R orbits; scroll zooms. In-world labels let you approach cabinets and park in storage without dragging objects across the screen.

The first-corner restoration loop includes storing three cabinets, sweeping and scrubbing the floor, choosing finishes, repairing Star Signal, hauling it back, and playing it. Progress saves locally in a separate 3D save. See [the 3D implementation and validation notes](docs/ARCADE_3D.md) and [the broader arcade design](docs/ARCADE_PIVOT.md).

This remains one room and one repairable cabinet. Cleaning uses contact patches; cabinetry uses hand-truck hauling rather than rigid-body physics. Wiring and the cabinet game have focused 2D interfaces. Broader repairs, upgrades, and reopening nights are future work.

The previous [flat arcade prototype](https://dumb-tony.github.io/sweep/flat/) and [original Sweep](https://dumb-tony.github.io/sweep/legacy/) remain available.

## Development

Run `node tests/serve.cjs`, then open http://127.0.0.1:4175. No install or build step is required. WebGL 2 is required; Three.js 0.180.0 is vendored with its MIT license, with no runtime CDN dependency.

```text
node tests/arcade3d.cjs
node tests/arcade.cjs
node tests/physics.cjs
node tests/controls.cjs
node tests/motion.cjs
```

GitHub Actions runs all regressions before publishing reviewed game assets to GitHub Pages. Private source notes and diagnostic artifacts remain excluded from Git.
