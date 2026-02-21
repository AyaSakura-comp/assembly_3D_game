# Visual Overhaul: Project Snapshot & Handoff

**Date:** 2026-02-21
**Current Branch:** `visual-overhaul` (inside `.worktrees/visual-overhaul`)
**Status:** Tasks 1-3 complete. Proportions and alignment issues resolved.

---

## 1. What has been done

### ✅ Task 1: Modular Component Refactor
- Created `src/components/3d/` directory.
- Moved `RegisterCube`, `MemoryGrid`, and `StackTower` into modular components: `Case.jsx`, `Motherboard.jsx`, `DIPChip.jsx`, `SIMMSlot.jsx`, and `StackSocket.jsx`.
- Verified core game logic remains intact (36/36 unit tests passing).

### ✅ Task 2: Apex-86 Case Implementation
- Implemented a cream-colored "Wedge" computer case inspired by Apple II/C64.
- Added integrated keyboard slope and side vents.
- Refined vertical alignment so the motherboard sits neatly inside the case.

### ✅ Task 3: Motherboard & DIP Chips
- Implemented a dark green PCB floor (`Motherboard.jsx`) that fits the case dimensions.
- Re-designed register chips as black ceramic **DIP Chips** with:
    - **Amber 7-segment LED displays** showing the register value.
    - **Flicker animation:** Values rapidly randomize when updated before settling.
    - **Hardware details:** Visible metal pins (legs) touching the PCB.
- **Fixed Proportions:** Standardized `Y=0` as the motherboard surface to eliminate clipping and "weird" shapes.

---

## 2. Remaining Tasks

### ⏳ Task 4: Animated PCB Trace Pulses
- **Goal:** Add golden light pulses that travel along the motherboard between chips when data is moved (e.g., `MOV AX, BX`).
- **Implementation:** Create a `DataTrace.jsx` component. It should listen to register/memory changes and animate a beam from the source component to the destination.

### ⏳ Task 5: Boss Machine "Obelisk-X"
- **Goal:** Implement the opponent machine on the opposite side of the 3D space.
- **Aesthetic:** Charcoal-black horizontal box (IBM PC style) with a curved-glass CRT monitor.
- **Interaction:** The Boss machine should flicker when hit by player attacks and fire "Floppy Disk" projectiles when attacking.

### ⏳ Task 6: Strategic Hardware Slots (Optional Expansion)
- **Goal:** Allow players to "plug in" upgrade chips to the SIMM slots to modify interpreter behavior (e.g., reduce instruction costs).

---

## 3. How to Verify (For the next agent)

### Visual Verification
Since JSDOM cannot render 3D, always use Playwright to capture screenshots:
```bash
# From the worktree directory:
npx -y playwright screenshot --viewport-size 1280,720 --timeout 30000 --wait-for-timeout 10000 http://127.0.0.1:5174 screenshot_verify.jpg
```

### Unit Tests
```bash
# Ensure no logic regressions:
npm run test -- --run
```

### Reference Screenshots
- `screenshot_proportions_fixed.jpg`: Shows the current correct alignment.
- `screenshot_task3_final.jpg`: Shows the DIP chip and LED detail.
