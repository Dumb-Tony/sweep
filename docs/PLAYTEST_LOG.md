# Sweep — Playtest log

## 2026-09-13 — M1.1 control repair / physics 2

User report: controls initially worked reasonably, then became erratic during play. Follow-up narrowed the trigger to mouse → keyboard → mouse, affecting movement, orientation, and pressure/lift. This is a real usability failure report; the earlier smoke checks did not establish sustained control quality.

Reproduced two specific failures against the previous code before repairing it:

- A five-unit horizontal stroke left the head frozen partway through alignment because rotation only updated while translation exceeded 12 units/s. The regression asserted perpendicular alignment after one second and failed on the old build. The head now remembers the last stroke heading and completes its bounded turn even at rest.
- Thirty tiny wheel events accumulated a hidden 4.5-radian manual offset. Scrolling no longer changes steering. Q/E remain deliberate rotation controls, the current offset is visible, and F / the Angle button restores automatic alignment without losing the run.

Also made input sampling side-effect free (rendering/keyboard sampling no longer rewrites pointer targets), isolated movement ownership from pressure/lift modifiers, normalized angle offsets, and clear/reconcile mouse pressure on pointer-up, lost capture and actual button state. Physics version 2 uses a separate record key.

Validation so far: all nine physics tests plus six lifecycle and seven new controls checks passed. The controls soak alternated mouse/keyboard, pressure/lift, Q rotation/F reset, wheel input, pointer exit/reentry and six focus pauses for 599.983 simulated seconds. This soak retained the keys but removed other debris to isolate input state; it is not a dense-pile performance test. Separately the 200-debris wall stress ran 120 seconds with no escapes or duplicate accounting (local VM p95 4.464 ms/step, max 6.559 ms).

The full physical cleanup route completed in 248.13 simulated seconds: 110/120 weight, 92 debris pieces, keys recovered, 60 strokes, 2,930 points. The 30/60/120 FPS replays matched exactly (weight 58, score 1,770 after 7,200 fixed steps). These are scripted checks, not human feel results. A longer agent-operated browser play session is recorded below after completion. The five-player exit gate remains pending.

### Exact handoff regression and browser play

The follow-up prompted an additional failing regression: mouse sweep, keyboard A/Q/Space/Shift, then mouse movement before all releases arrive. The old keyboard movement continued overriding the returning mouse. After the repair, pointer input explicitly takes ownership, cancels old keyboard commands, clears lift/pressure latches and restores automatic angle. This intentionally starts mouse control in a neutral state; reapply lift/pressure after changing devices. F now resets all broom controls while preserving cleanup.

Agent-operated Chromium play at 1280×720 on the previously recorded PC: the first repair was played across multiple rows for a 4:52 session, reaching 66% cleanup with 33 bodies remaining, repeated lifted repositioning, pressure deliveries, scrolling and pause. This session included idle/inspection intervals and did not complete the floor or prove human feel. After the final handoff fix, a fresh browser session explicitly switched mouse → keyboard → mouse with lift/pressure enabled. The HUD reported keyboard ownership followed by pointer ownership, zero angle offset, and both latches off; mouse contact resumed. Full completion remains separately covered by the 248.13-second physical simulation route. No five-player pass is claimed.

## 2026-09-13 — M1 implementation / fixed mess / physics 1

**Decision: iterate within M1; ready for human testing, not a passed enjoyment gate.** No fresh human testers participated. All observations below are automated simulation, DOM-stub integration, or agent-operated browser interaction. They are not manual human feel testing.

### Environment

- Windows test PC: AMD Ryzen 9 9950X 16-Core Processor; AMD Radeon RX 9070 XT and integrated AMD Radeon Graphics reported by the OS. The active rendering adapter was not established.
- Codex in-app Chromium, reported Chrome/152.0.0.0. Browser viewport 1280×720; gameplay canvas 696×464 CSS pixels with a fixed 960×640 world/backing canvas. Responsive layout also inspected at 390×844 (364×242 CSS canvas). Physical monitor resolution was unavailable from the hardware query.
- Local test runtime: installed Node 24.19.0 at Program Files/nodejs. The bundled runtime printed a version but exited before JavaScript execution; no bundled-runtime test success is claimed.
- Default response 1, smoothing 30 ms, pressure ratios 1.5× gain / 0.7× speed. High contrast and local reset were also exercised through browser controls.

### Engineering results

`tests/physics.cjs` passed nine checks. `tests/lifecycle.cjs` passed six integration checks and a standalone-asset scan. Repeated after input corrections; all passed.

| Check | Observed result |
| --- | --- |
| Complete physical route | 248.13 simulated seconds, 108/120 weight (90%), 91 debris pieces, keys recovered, 63 strokes, 2,650 points |
| Replay at 30 / 60 / 120 rendered FPS | Identical after 7,200 fixed steps: weight 55, score 1,660, sampled leaf x=900.1794801536815, y=343.7152145214773; 0% difference |
| 200 debris + keys at a wall | 120 simulated seconds of extreme crossing/rotation/pressure; finite positions and velocities, no world escapes, no duplicate accounting |
| Node VM stress timing, final local run | p95 2.781 ms per simulation step, max 5.083 ms; includes VM overhead and is not browser rendering performance |
| Browser performance sample | About 174 rendered FPS; p95 0.90 ms game frame work over a rolling 120-frame sample during the local interaction session |
| Browser physical delivery | Agent drag and settling delivered 10% weighted cleanup with 5× delivery visible, then Escape paused at 30.342 simulated seconds |
| Physical boundaries | Lift transfers no contact; no vacuum movement; pressure caps speed at 0.7×; full-entry/low-speed/0.3-second dwell enforced; salvage rejection remains recoverable; repeat-contact IDs cannot farm score |
| Lifecycle | Result generated from a completion fixture, one-action restart, 50 rapid resets, ten-minute simulated background pause, input clearing and storage-denied fallback passed in DOM stubs |
| Resolution | Identical physical state for proportionally identical pointer input at 480 and 960 CSS widths in DOM-stub tests |
| Pointer boundary | Exit stops travel; reentry speed remains capped; captured pointer motion beyond the canvas is rejected |

The complete route operates the real simulation through target movement, pressure and lift. It does not teleport debris. It uses the same explicit key-return action exposed in the UI before physically sweeping keys into the tray. It is an engineered route with knowledge of piece positions, not evidence that a new player can finish unaided in five minutes. The result fixture checks UI lifecycle separately from the full physical route.

### Browser inspection and tuning

Inspected start/play screens at desktop and phone-sized viewports; agent exercised start, pointer contact/disposal, F2 metrics, Escape pause, comfort expansion, high contrast, key return and local reset. The initial oversized floor caused scrolling during focus; floor sizing now follows viewport height and focus avoids automatic scrolling. Start/pause/result overlays use the viewport so the start card cannot be clipped by a short canvas.

Fixed keyboard rotation incorrectly lifting after movement ended by retaining the last input modality. Fixed off-canvas captured pointer motion being treated as in-floor movement. Kept the initial pressure ratios because the contact and route tests did not show explosive scattering. No extra levels, tools or production systems were added.

### Remaining gates and limitations

- Recruit five fresh players for two attempts of up to five minutes each. Need four unaided finishes plus key recovery; three showing improved pile control or at least 15% faster second completion; three voluntarily wanting another mess/replay because sweeping feels satisfying. None of these gates has been measured or passed.
- Ask explicitly about pointer lag, pressure/lift comprehension, satisfaction, sound and late debris hunting. Automation cannot establish these subjective results.
- Last-debris rings are implemented at 75% cleanup and the physical route reaches 90%; human search frustration remains unmeasured.
- Small-screen layout fits, but leaf targets are small. Touch, gamepads, remapping, enlarged brooms, competitive assist records and broader browser/device coverage are outside this bounded implementation or remain unvalidated.
- File navigation was blocked by browser automation policy. HTTP browser operation plus self-contained-asset and storage-denied checks were verified; actual human double-click/file:// launch remains a test gate. No browser-policy bypass was attempted.
- Public deployment verification is recorded below after publishing. Only reviewed game, design, test and project files are committed; source conversation excerpts and raw local test artifacts stay ignored.

Next bounded experiment: fresh-player comprehension and feel test. Use at most two focused tuning rounds if scattering or lag dominates; do not add content to compensate for a failing core verb.

### Public deployment verification

- Public play URL: https://dumb-tony.github.io/sweep/
- Repository: https://github.com/Dumb-Tony/sweep
- Game commit: `b9cbade925436b2ac2e5af3f5be0dd65360e9b63`.
- [GitHub Pages workflow 34739540892](https://github.com/Dumb-Tony/sweep/actions/runs/34739540892) completed successfully, including simulation and lifecycle tests on the Linux runner, artifact staging and Pages deployment.
- Public response: HTTP 200, 28,600 bytes. Response HTML exactly matched the committed/local standalone file after CRLF/LF normalization.
- Agent-operated public browser check: start, pointer sweep, settlement/disposal, F2 metrics and Escape pause. Public HUD reached 9% cleanup, nine disposed pieces, 5× delivery, and paused at 24.642 simulated seconds. Browser console inspection returned no warnings or errors. A sampled live frame window reported 177.9 FPS and 0.80 ms p95 JavaScript frame work.
- The public tab was returned to the start screen for the user. This evidence-only log update does not change the tested game artifact.

## Entry template

- Date / build / course / physics version:
- Test PC CPU, GPU, browser, resolution:
- Tester familiarity and accessibility settings:
- Hypothesis being tested:
- Task, attempt count and observed results:
- Completion time / relevant score / mechanic-specific metrics:
- Voluntary retry and comprehension observations:
- Bugs, unfair states and performance measurements:
- Parameter changes and why:
- Retest evidence:
- Decision: proceed / iterate / park:
- Unresolved questions and next bounded experiment:
