# After Hours — 3D environment, v0.2

Requested 13 September 2026: replace the flat drag-and-drop arcade with a fully 3D environment, retaining the restoration foundation.

## Implemented

Real WebGL 2 geometry with perspective rendering, depth, dynamic shadows, lighting, camera orbit/zoom, and an animated third-person character. A main arcade floor and back workshop are connected by a traversable doorway. Three modelled cabinets have control panels, joysticks, trim, marquees, and screens. Workshop furniture, paint tins, shelving, signs, and storage bays furnish the space.

Walk with camera-relative WASD/arrows or click-to-walk. Click a cabinet to approach and interact; E loads/parks the hand truck, opens the service panel, or plays a repaired machine. Hauling follows the character's traversed path so the cabinet does not cut through corners. Solid cabinet and wall collisions, wider planned paths when hauling, acceleration/deceleration, keyboard takeover of click paths, blur clearing, and serialized hauling trails handle control transitions.

Hold Space while walking to sweep, scrub, or lay flooring within physical reach. A Work toggle supports touch and click walking. Q/R or right-drag orbit the camera; scroll changes distance. Room and follow camera modes are available. Near camera-side walls and the partition fade for visibility.

The existing seven-step first-corner loop, circuit puzzle, Star Signal mini-game, finish choices, and local progress persist in the 3D version. The 3D save uses a separate key, preserving older 2D progress. The prior arcade lives under `/flat/`; the original Sweep under `/legacy/`.

## Scope

This is a stylized third-person 3D prototype, not a first-person renovation simulator. Cabinet movement is collision-constrained hand-truck hauling with storage-bay snapping, not a rigid-body physics simulation. Cleaning still removes contact patches rather than simulating loose piles. Wiring and the restored arcade game use focused 2D service/game interfaces inside the 3D loop. One room and one repairable cabinet remain the current campaign scope.

Three.js 0.180.0 is vendored locally with its MIT license; the game has no runtime CDN or asset dependencies. Requires WebGL 2. Generated geometry, canvas sign textures, and optional synthesized sound are local. No accounts, remote save, or analytics.

## Regression coverage

`node tests/arcade3d.cjs`: all three cabinet storage routes, complete floor coverage at each stage, service-panel approach, repaired cabinet return, collision with walls/bounds, acceleration/release, failed circuits, and save validation. The complete simulated route is approximately 131 seconds, with state serialized/deserialized every 97 movement frames to exercise reloads while hauling. Earlier prototypes retain their existing tests.

During development the route tests exposed cabinet corner-cutting and storage entrance congestion. Breadcrumb-based hauling, wider obstacle clearance, and a rear storage aisle resolved both. Browser playtesting is performed with UI-driven movement, not by changing hidden game state; it is distinct from human feel testing.

## Release verification

Browser-controlled playtest: all three cabinet pickups and storage deliveries; load/reload while hauling; room and follow cameras; keyboard orbit and wheel zoom; complete sweeping stage into the scrubber; partial scrubbing; keyboard takeover and return to click walking; 390×844 layout inspection. No browser warnings or errors were captured. Full later restoration stages and the return trip were verified by the deterministic route test, not claimed as a complete browser or human feel playthrough.

Published commit `9ff3eeb` passed GitHub Actions run `34781751083`. Public HTML, scene, model, stylesheet, and both Three.js modules returned HTTP 200 and exactly matched local files after newline normalization. `/flat/` and `/legacy/` returned HTTP 200. The public 3D scene rendered successfully with no logged warnings/errors and was left at a fresh start.
