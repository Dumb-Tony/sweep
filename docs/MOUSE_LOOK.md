# Mouse-look controls

The chase view requests browser pointer lock from Open the arcade, the Mouse look button, or a click in the scene. Relative mouse movement turns the centered camera; WASD moves along that heading. Hold left click or Space to use the current tool, E interacts, J opens the journal, C switches to the room overview, and Escape releases the cursor.

Menus, cleaning close-ups, the wiring panel, loss of focus, and leaving the chase camera release ownership. Movement, path following, and tool inputs are cleared on release. Closing a menu does not unexpectedly recapture the cursor: click the scene to resume. The room view keeps click-to-walk and right-drag controls. Touch controls remain available.

Pointer-lock lifecycle tests cover relative motion, Escape, menu release, denied requests, and late acquisition. Browser UI checks cover denied capture, journal toggling, and release of work input. The embedded test browser rejected actual capture with “The root document of this element is not valid for pointer lock.” Actual locked-mouse feel could not be validated in that host; the game displays a full-browser suggestion and retains right-drag as a fallback.

## Embedded browser fallback
When native pointer lock is denied or unavailable, the same click enables free mouse look. Unheld mouse movement over the canvas rotates the camera; the outer 24 pixels continue horizontal turning. Leaving the canvas stops edge turning. Escape, blur, menus and camera switching release both modes. This fallback does not confine the operating-system cursor.
Verified with automated no-button input tests and browser clicks at separate canvas positions (no drag), plus Escape/journal checks. Native pointer lock remains unavailable in the Codex embedded browser.
