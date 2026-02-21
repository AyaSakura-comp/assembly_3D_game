# Assembly Battle: 1980s Retro Hardware Visuals Design

**Date:** 2026-02-21
**Topic:** 3D Visual Overhaul (React Three Fiber)
**Status:** Validated

---

## 1. Player's Machine: The "Apex-86"

### Case and Motherboard
- **Chassis:** A cream-colored, wedge-shaped computer case (Apple II/C64 style).
- **Details:** Sloped front with an integrated mechanical keyboard (double-shot keycaps), cooling vents, and a red glowing power toggle.
- **Motherboard (PCB):** Dark green PCB floor inside the case lid. Features intricate gold copper traces, visible capacitors, and ribbon cable headers.
- **Lighting:** Warm localized glow from internal components casting long shadows.

### Register Chips (AX, BX, CX, DX, SP)
- **Model:** Oversized Ceramic DIP (Dual In-line Package) chips in black sockets.
- **Display:** Recessed **Amber 7-segment LED** (4 digits) on top.
- **Animation:** Digits flicker rapidly through random numbers during updates before settling. Logic core pulses brightly on write.

### Memory Modules (SIMMs)
- **Model:** Two rows of four Single In-line Memory Modules (SIMMs).
- **Feedback:** Tiny status LEDs beside each RAM chip—**Blue** for READ, **Red** for WRITE.
- **Sound:** Faint 3D-localized electrical hum during access.

### Stack Tower (Glass Socket)
- **Model:** Vertical, semi-transparent "Glass Stack Socket."
- **Data:** Values appear as glowing orange disks ("data bytes") that drop in from the top.
- **Indicators:** Bottom disk glows intensely (Base Pointer); top disk is highlighted (Stack Pointer).

---

## 2. Boss Machine: The "Obelisk-X"

### Aesthetic
- **Chassis:** Angular, charcoal-black horizontal desktop (IBM PC style).
- **Monitor:** 12-inch CRT with a curved glass face, displaying green-phosphor ASCII art and a "SYSTEM_CRACKING..." bar.
- **HP Meter:** A physical analog needle meter on the front panel that twitches and drops.

---

## 3. Interaction and Data Flow

### Animated PCB Traces
- **Visual:** Golden pulses of light traveling along etched traces between components (e.g., `MOV AX, BX` pulses from BX chip to AX chip).
- **Motion:** Organic acceleration/deceleration curves.

### Battle Effects
- **Boss Attack:** Fires spinning 5.25" floppy disks leaving a trail of digital noise.
- **Player Attack:** High-intensity Amber Data Beam erupts from the CPU to strike the Boss's CRT, causing shatter-flicker and sparking fans.

---

## 4. Implementation Strategy

### Architecture
- **Components:** Individual React Three Fiber components for `Case`, `Motherboard`, `DIPChip`, `SIMMSlot`, and `StackSocket`.
- **State:** Driven by the existing `useGameStore` machine state.
- **Animations:** Using `framer-motion-3d` or `GSAP` for the trace pulses and projectile trajectories.

### Testing
- **Visual Regression:** Use Playwright to capture screenshots of the new components in isolation and in the battle scene.
- **Performance:** Monitor draw calls and polygon counts to ensure smooth 60fps on standard hardware.
