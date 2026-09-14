# Centered camera and articulated character

The chase camera now sits directly behind the character. Both the boom and look target have zero shoulder offset. It retracts around full-height walls and cabinets, eases outward when an obstruction clears, and no longer compresses against the low front curb. The room overview remains available.

The character is hand-authored geometry with independent hips, shoulders, elbows, knees, wrists and ankles. A shaped work jacket, back patch, knit cap, facial details, gloves, denim, stitched pockets and laced boots replace the box-shaped body and rigid limbs. Walking blends into idle; opposite arm/leg swings, knee bends, floor-tool grips, hauling poses and left/right wall reaches are driven explicitly.

No Higgsfield credits or generated meshes were used. There are no automatic skin weights or imported skeletons to retarget.

Validation covers the complete deterministic restoration route, camera centering at 64 headings, obstacle handling, the open front curb, and finite joint transforms across idle, walking, hauling and work animations. Browser-controlled playtesting checks cabinet pickup/delivery through storage, centered framing, and tool use; it is separate from human feel testing.
