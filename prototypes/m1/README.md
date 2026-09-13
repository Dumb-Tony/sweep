# Sweep M1 — contact and tuning notes

Open `index.html` directly to play offline. No build, fetch, fonts, CDN, engine or asset loading is required. This is one fixed mess, not a production scaffold.

## Rules and controls

80 leaves weigh 1 each; 20 cans weigh 2 each. Keys never count toward cleanliness. Completion requires 108/120 weight and key recovery. Bin and tray accept a piece only when its entire collision body is inside, moving below 28 world units/second continuously for 0.3 seconds. Keys entering the bin return visibly to the floor below their tray. A comfort-panel action also returns unrecovered keys there.

Pointer positions scale into the same 960×640 world at every display size. The 112-unit broom head has a 7-unit collision radius. Orientation follows stroke direction with bounded angular speed; Q/E adjust its visible angle offset; F or the Angle button restores automatic alignment. The wheel no longer rotates the broom. Opposite strokes keep the same head axis. Space lifts for repositioning. Left click or Shift adds pressure. WASD/arrows move in world space, including normalized diagonals. Visible buttons toggle pressure/lift; optional key toggles remove the need to hold a key. Leaving the canvas stops pointer travel and lifts contact; reentry remains speed capped. Focus loss pauses and clears held and latched controls.

## Contact model, physics version 2

- Fixed 1/120-second simulation, at most eight catch-up steps per rendered frame. Excess backlog is discarded. Presentation uses requestAnimationFrame.
- Maximum speed starts at 500 world units/second; pressure retains the proposed 0.7× speed cap and 1.5× normal contact gain. Response speed scales the cap from 0.5× to 1.5×. Independent smoothing ranges from 0 to 120 ms, initially 30 ms.
- The kinematic capsule sweeps translation and rotation in samples no farther than 3 units at its tip. A 32-unit spatial grid queries the whole swept capsule bounds. No collection radius, attraction or hidden pile snapping.
- Contact resolves overlap along the surface normal, then transfers bounded normal velocity. Pressure damps tangential slip at contact. Debris speed caps at 520 units/second. Wall constraints run after broom and pair contacts.
- Four grid-based piece-contact solver passes per step. Leaf circles carry rigid silhouettes; can circles roll visually with motion. Exponential drag: leaf 11/s, can 2.6/s, keys 9/s. This sacrifices detailed rigid-body rotation for stable, inexpensive M1 gathering.
- A grounded moving stroke owns a set of unique eligible debris IDs. Lift or 0.35 seconds idle ends it. Delivery within two seconds of last broom contact banks 10 points × (1 + floor(unique IDs/5)), capped at 5×. Otherwise it banks 10 points. Disposed flags prevent duplicate accounting. Keys award 100; elapsed time has no score bonus.
- Remaining bodies receive rings at 75% cleanup if highlighting is enabled. Keys remain labeled. Effects never count toward cleanup.

## Tuning decisions

The proposed pressure ratios were retained: scripted contact and full-route checks did not show explosive scattering. A generous right-side bin spans 344 units vertically. The top key tray is 210×88, with a recoverable floor position below it. Four contact passes kept the 200-piece wall pile bounded; no general physics engine or later-milestone systems were introduced.

Browser inspection prompted a viewport-relative floor size and focus without automatic scrolling. An input check found keyboard-only rotation could be lifted when movement stopped; persistent input modality fixes that. Pointer capture now rejects coordinates outside the canvas instead of treating off-canvas motion as continued sweeping.

## Diagnostics and limits

F2 reports rendered FPS, p95 frame work, frame/simulation cost, simulation time, active bodies, broom speed/angle, contacts, strokes, state, accumulator, viewport, canvas size and browser version. The 120-frame rolling cost measures game JavaScript work, not GPU presentation latency. High FPS on this machine is not a minimum-device promise.

Settings and best elapsed time use `sweep.m1.physics2.v1` in localStorage with try/catch and type/range validation. Reset clears that key. No cross-version comparisons or replays are persisted. Sound is synthesized after interaction and rate limited. Audio quality, pointer feel, touch comfort, assist comparability and the fresh-player exit gates need human testing. Best time is exploratory, with no competitive leaderboard.

### M1.1 control repair

Short strokes used to stop steering as soon as translation fell below 12 units/s, freezing the head partway through a turn. Physics 2 remembers the last stroke heading and completes the bounded turn at rest. Rotation offsets are normalized, shown in the controls, and resettable with F without losing cleanup. Ordinary wheel events no longer change the offset. Input reads are pure; keyboard steering no longer overwrites the pointer target. Mouse button state is reconciled on movement, pointer-up, and lost capture to avoid stuck pressure. Modifier keys do not take over movement ownership. The new storage key prevents comparing old handling records with the repaired model.

Mouse movement after keyboard use explicitly cancels the old keyboard commands, resets the manual angle, and releases pressure/lift latches. Reapply lift or pressure after this handoff. F also releases all controls, without restarting the floor. A dedicated regression covers returning to mouse when keyboard key-up events have not arrived.
