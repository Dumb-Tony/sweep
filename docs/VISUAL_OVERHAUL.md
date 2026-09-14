# After Hours — visual overhaul (v0.3)

The request for this release is presentation: textures, lighting, shadows, models, and polish before further restoration mechanics. `model.js`, progression, cabinet routes, puzzle rules, and the save key remain unchanged.

## Art direction

A worn neighborhood arcade in cool late-night surroundings, warmed by practical workshop lamps, old signage, brass accents, and a paper restoration journal. The room remains a stylized 3D cutaway with the established orbit and follow cameras.

## Rendering and assets

- Locally generated, seeded surface textures with bump and roughness maps for paint, metal, worn tile, terrazzo, and parquet. Existing floor palettes now select distinct surface treatments.
- Irregular alpha-textured dirt, varied in position, rotation, and scale, replaces the repeated polygon patches.
- Shaped, bevelled cabinet side panels with moulding, original side artwork and marquees, curved clear-coated CRT glass, tilted bezels, printed control decks, metal joystick shafts, buttons, coin doors, screws, vents, and feet.
- Animated CRT signal graphics and stronger marquee illumination when Star Signal is repaired; restarting restores the unpowered screen.
- Improved character cap, face, clothes, and footwear; distinct cleaning-tool heads and a detailed hand-truck handle.
- Wall panelling, trim, conduit, posters, light fixtures, overhead supports, a workshop pegboard, tools, drawers, paint tins, labelled boxes, and a detailed supply trolley. Decorations stay within existing fixtures and boundaries.
- Local environment reflections, tuned directional and practical lights, soft contact-shadow decals, subtle light halos, floating dust motes, and a restrained screen vignette.
- Paper-journal interface, refined control bar and world labels, hideable journal, updated welcome card, and optional rendering diagnostics.

All graphics are original procedural artwork/geometry rendered locally. No runtime art CDN, external font, image generation service, or new library dependency is required. Three.js remains pinned and vendored.

Floor rendering uses four instanced batches rather than 153 separate tile meshes; every tile still updates independently. The rendering-details panel reports live FPS, draw calls, triangles, and resolution scale for diagnosing this browser, not as a cross-device benchmark.

## Validation

The complete deterministic 3D restoration route, hauling reload checks, collisions, puzzle failures, and legacy regressions pass. Browser visual inspection and UI-driven playtesting cover the material transitions and room interactions. Human feel testing remains separate from browser automation.

Browser input testing completed the scrub and parquet routes, applied wall paint, reloaded the save, solved the wiring panel, and hauled the powered cabinet through the doorway to finish the chapter. All four floor finishes and the wall/cabinet palettes were exercised, and the updated CRT minigame launched correctly. A local idle diagnostics snapshot at 1280×720 reported 324 draw calls and 43k triangles; FPS is device- and scene-dependent. A reflection-map blur warning found during inspection was corrected before release.
