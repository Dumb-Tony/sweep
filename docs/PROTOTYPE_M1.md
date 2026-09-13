# Milestone 1 — Standalone HTML vertical prototype

**Status: M1 implemented 2026-09-13; fresh-player exit gates pending.** The sole purpose of this milestone is proving the core mechanic/verb before expanding content. Follow the offline, fixed-step, restart, storage, and measurement contract in GDD.md. All thresholds are initial acceptance targets to validate, not completed test results.

## Question and hypothesis
Can moving a broom through physical debris be pleasurable and skillful before progression, polish or additional tools exist?

## Exact playable slice
One floor with walls, a generous bin, 80 leaf pieces, 20 cans and one pair of keys. Reach 90% eligible debris weight and recover the keys into a separate tray. No hard timer; show elapsed time. Pointer movement, pressure, manual rotation and lift are available. Include a small keyboard alternative for usability comparison.

## Implementation specification
Render a capsule broom about 12% of floor width. Cap its motion in world space independently of display resolution. Start pressure contact gain at 1.5x and pressure speed cap at 0.7x; tune from observation. Leaves have high drag; cans have low drag. Weighted cleanliness excludes keys. Each piece carries a unique ID, type, disposed state and combo eligibility. Sweep broad-phase cells along the broom's whole path. Reset clears bin totals, active combos and all body velocities.

## Deliberate exclusions
No shop, liquid, glass shards, complex sorting, fragility, smearing or industrial floors. Do not substitute instant-radius vacuum collection for physical contact.

## Test procedure and exit gate
Five fresh players get five minutes and two attempts. Four must finish cleanup and recover keys without needing developer rescue. Three should visibly improve pile control or reduce completion time by 15% on the second attempt. At least three request another mess or replay because sweeping feels satisfying. Ask whether pressure/lift behavior was understandable and whether pointer lag interfered.

Stress one 200-piece pile against a wall, a maximum-speed cursor crossing, a cursor leaving/reentering the canvas and rapid broom rotation. No debris may escape world bounds or be counted twice. Verify last-piece highlighting and zero dependence on screen resolution for force.

## Decision rule and deliverables
One offline HTML plus input settings and contact/performance notes. If scattering dominates, reduce impulse and improve bristle guidance. If gathering feels automatic, remove hidden attraction and inspect contact rules. If the final 10% frustrates testers, improve completion criteria rather than adding rewards.
