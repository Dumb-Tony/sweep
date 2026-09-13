# Sweep — Playtest log

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
