# Sweep — Game Design Document

## Elevator pitch
Cleaning becomes a short arcade physics sport: guide a broom through a filthy floor, gather a satisfying moving pile and send it into the right disposal area. Power comes from stroke speed; mastery comes from control.

## Design pillars
- The broom feels directly connected to the player's hand.
- Debris moves physically and remains readable in groups.
- Big sweeps feel earned; precision remains useful.
- Cleanup ends with satisfaction rather than hunting invisible specks.

## Player fantasy
Turn an overwhelming mess into one elegant sweeping motion. Become unexpectedly skilled at positioning, corralling and delivering clutter without throwing someone's keys into the trash.

## Core gameplay loop
Survey debris and objectives → gather with controlled strokes → build a pile → move it toward a destination → dispose accurately → finish the cleanliness target → compare time and technique → retry. Target timed runs: 2–4 minutes; offer untimed cleanup as an equal-access play mode.

## Controls
Pointer moves the broom head in the floor plane. Its orientation follows the filtered stroke direction; Q/E or the wheel rotates a manual angle offset. Hold left mouse for downward pressure, release for a light guiding sweep. Space lifts the broom for repositioning; R restart; Escape pause. Broom speed is capped and smoothed so cursor teleporting cannot launch debris through walls. Keyboard alternative after initial pointer tuning: WASD movement, Q/E rotation, Shift pressure, Space lift. Gamepad later uses stick movement and triggers pressure/lift.

## Moment-to-moment mechanics
Use a slow stroke to gather scattered leaves, firm pressure to push a pile, and a fast release to send rolling cans into a bin. Lift the broom to move behind a pile without scattering it. Preserve a ring or keys by steering them into a recovery tray. A speedier stroke creates more force but may spread debris; success is not proportional to mouse sensitivity.

## Physics and systems
Broom is a kinematic capsule moving toward a target with bounded velocity and angular velocity. Swept contacts transfer normal impulse proportional to relative stroke speed and pressure. Friction and drag create material differences: leaves stop quickly and collect; cans roll farther; paper drifts. M1 uses rigid clusters for small leaf shapes and circles for cans; visual flecks do not count toward cleanliness.

Pressure increases grip/contact transfer but reduces maximum broom speed. Piles arise from object contact, not a vacuum radius. A disposal zone accepts eligible pieces only after full entry and low motion for 0.3 seconds. Wrong-category items move to a visible reject tray or remain retrievable; nothing important vanishes with a cryptic penalty. Lost objects have a visible recover/reset action.

## Scoring
Define clean percent from eligible debris weight, not visual pixel coverage. M1 ends at 90%, and highlights remaining pieces when close. Proposed points: 10 per correctly disposed piece, multiplied by a delivery combo based on distinct pieces gathered in one continuous grounded stroke and delivered within two seconds. Combo caps at 5x and banks on disposal. Contacting the same piece repeatedly never adds count. Salvage objects award recovery points; discarding one costs points and returns it to a tray so the objective remains possible. Time bonus is capped and applies only after the cleanliness target. Untimed mode omits it.

## Level and environment design
One unobstructed room introduces gathering and disposal; a table leg later introduces corral-and-lift routing. Bin mouth must be generous relative to broom width. Conditional release: six stages across bedroom, cinema and restaurant kits. Each stage adds one clear objective: clean 90%, recover ring, sort cans, beat opening time, avoid fragile props or assemble one pile. Festival, stadium, casino and warehouse are backlog scale tests.

## Progression and unlocks
Unlock wider or softer brooms as sidegrades after basic handling is mastered. Wide broom clears open floors but struggles around furniture; soft broom protects fragile debris; heavy broom drives cans but scatters light material. Cosmetics and stage medals provide rewards. Squeegee/liquid tools require an independent feasibility gate and are not necessary to finish the initial game.

## Replayability
Alternate stroke routes, fewer strokes, best time, accurate sorting and optional all-clear attempts. Fixed mess layouts permit technique comparison. Seeded daily messes are deferred; optional local seeds can later add variety without accounts. “One giant pile” is a different objective using the same verb.

## Art direction
Top-down tactile illustration with clean material silhouettes, warm light and pleasing before/after contrast. Floor texture must not resemble remaining dirt. Broom bristles have a visible leading edge. Debris can be colorful without depending on color to communicate disposal category.

## Animation and VFX
Bristles bend in stroke direction; pressure compresses the head slightly. Leaves bunch, cans wobble and disposal gives a brief pop/settle response. Keep dust puffs small and non-occluding; do not overlay a constant particle cloud on the very objects players must see. End-state shine is optional, brief and reducible.

## Audio
Soft bristle scrape varies with speed and pressure. Paper rustle, leaf crunch and can rattle identify materials. Disposal/combo sounds reward the completed delivery, with voice limits to prevent dense piles from producing harsh noise. No compulsory countdown alarm in relaxed mode.

## UI/UX
Show clean percent, time or relaxed label, current delivery combo and salvage objective. A short visible gesture demonstrates sweep, pressure and lift. Result screen lists correct disposal, salvage, time and stroke efficiency. Restart is one action. Optional last-debris highlighting avoids tedious searching.

## Accessibility and options
Adjust sensitivity and smoothing independently; allow pressure/lift toggles, remapping, enlarged broom option, no-timer mode, high contrast and reduced particles. Scale the playfield rather than requiring precise pixel targeting at high resolution. Provide a keyboard-accessible alternative before a wider playtest; track assisted competitive records separately but never gate content behind unassisted play.

## Technical approach
M1 uses Canvas 2D, a uniform spatial hash and lightweight circle/capsule contacts at fixed timestep. Sweep the broom through its motion path; never set its position directly to a far cursor coordinate. Use stable pile resolution and cap pieces at 200, starting with 100. Simulate large debris; keep purely visual dust outside objective accounting. Evaluate a physics library in M2 only if contacts remain unstable after bounded tuning.

## Risks and mitigations
Mouse motion may feel laggy: expose smoothing, cap acceleration judiciously and measure perceived control. Tunneling and explosive piles: sweep contacts, cap impulses and test worst-case clumps. Cleanup may become tedious: threshold completion and visible leftovers. Combo scoring may reward abuse: unique object IDs and bank only on delivery. Fluids and smears can multiply complexity: keep them outside initial scope.

## Scope boundaries
M1 includes one floor, leaves/cans, one bin and one salvage item. Conditional release caps at six stages, three debris families, three broom variants and a recovery tray. No liquid simulation, dangerous glass systems, food smearing, leaf-blower power-up, job-management economy, multiplayer or giant persistent venues.

## Milestone roadmap
1. **Standalone HTML vertical prototype:** prove satisfying direct broom control, debris gathering and pile delivery on one floor.
2. **Input and material validation:** keyboard/gamepad alternatives, stable dense contacts and one more debris behavior; reject materials that only add annoyance.
3. **Small game:** six stages, distinct objectives, broom sidegrades, local records and relaxed mode.
4. **Polish:** tactile audio/animation, last-debris UX, comfort options and long-session performance.
5. **Expansion review:** fluids, larger venues or new tools only if they preserve the broom-centered appeal.

## Development policy and evidence

This is a planning document, version 0.1, dated 2026-09-12. It is not a production commitment. Design provenance is preserved in local source-basis notes, excluded from the public repository. The user's current brief takes precedence over older multiplayer brainstorming. Mechanical formulas, key bindings, content budgets, and test thresholds below are proposed hypotheses, not previously approved requirements or measured results.

Single-player first. No accounts, servers, matchmaking, replication, rollback, network authority, or multiplayer-driven entity architecture. A later multiplayer proposal requires its own feasibility and scope decision. Ordinary modular separation of input, simulation, presentation, and save data is sufficient now.

Milestone 1 is a standalone HTML vertical prototype whose sole purpose is proving the core mechanic/verb before expanding content. “Vertical” means a complete tiny start–play–result–restart loop, not production polish. Implementation was authorized on 2026-09-13. M1 now exists in prototypes/m1/index.html; this does not authorize M2 or mark the human exit gates passed.

## Shared implementation and validation contract

Deliver the future M1 as one index.html with embedded CSS, JavaScript, geometry, and generated sound. It must open from file:// offline with no installation, build command, CDN, remote fonts, fetch, or external asset requirement. Use Canvas 2D for initial rendering, including projected geometry where specified. No engine decision for the full game is implied.

Use requestAnimationFrame for presentation and a fixed 1/120-second simulation accumulator, capped at eight catch-up steps. Discard excessive backlog after suspending a tab; pause on lost focus and clear held input. Tune to a stable 60 rendered frames/second on the actual test PC, whose CPU, GPU, browser, and resolution must be recorded. Compare repeated scripted input at 30, 60, and 120 rendered FPS; traversal/score differences above 2% need investigation. This is local repeatability, not a promise of cross-browser bitwise determinism.

Persist only settings and appropriate local records through a versioned localStorage adapter wrapped in try/catch. The game must remain playable in memory when storage is unavailable, especially under file://. Provide an explicit local reset action. Later ghost recordings must carry course, rules, and physics version identifiers. Never silently compare incompatible records.

Developer-only overlays report frame cost, simulation time, relevant physical variables, and reset state. M1 tests cover the normal loop, boundary cases, focus loss, rapid restart, and prolonged use. Do not invest in a general framework before a mechanic passes.

## Milestone governance

Milestones are exit gates, not promised calendar dates. At each gate, record observations, parameter changes, unresolved issues, and a proceed / iterate / park decision in docs/PLAYTEST_LOG.md. Recruit five fresh players where possible; an internal solo test can identify problems but cannot count as the fresh-player comprehension gate. Small samples are directional evidence.

M1 includes only the bespoke prototype specification in docs/PROTOTYPE_M1.md. Do not begin M2 merely because M1 runs without crashing. If the mechanic misses its enjoyment or readability gate, run up to two focused tuning rounds before deciding whether to revise the premise or park it. Adding levels, upgrades, story, or polished assets is not the remedy for an unproven verb.
