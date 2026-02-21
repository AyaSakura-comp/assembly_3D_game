# Gemini CLI Project Context: Assembly Battle

## Project Overview

A web-based 3D puzzle battle game where players write assembly programs to attack bosses. The 3D scene (React Three Fiber) visualizes the internals of a virtual CPU (registers, memory, stack) executing the player's code in real-time.

**Stack:** Vite + React + React Three Fiber + Monaco Editor + Zustand + Tailwind CSS

---

## Deployment Workflow

This project is deployed as a static site. The production assets are generated in the `dist/` directory.

### 1. Pre-deployment Verification
Always run linting and tests before any build or deployment:
```bash
npm run lint
npm run test -- --run
```

### 2. Build for Production
Generate the production-ready static assets:
```bash
npm run build
```

### 3. Local Verification
Verify the build locally using the Vite preview server:
```bash
npm run preview
```
- **Access URL:** `http://localhost:4173`
- **Verification:** Use the `playwright` CLI to take screenshots if visual verification is needed:
  ```bash
  npx -y playwright screenshot --viewport-size 1280,720 http://127.0.0.1:4173 screenshot_verify.jpg
  ```

---

## Development Guidelines

- **TDD:** Always follow Test-Driven Development. No production code without a failing test first.
- **Visual Verification:** Since JSDOM cannot render 3D, use Playwright screenshots to verify React Three Fiber changes.
- **File System:** If `npm install` fails with symlink errors on large disks, use `npm install --no-bin-links`.
- **Zustand Store:** The game state (HP, machine, timer) is managed in `src/store/gameStore.js`. It is exposed to `window.__zustand_store__` in dev mode for E2E testing.

---

## Technical Context

- **Interpreter:** Custom assembly interpreter in `src/interpreter/interpreter.js`.
- **Skill Matching:** Logic in `src/interpreter/skillMatcher.js`.
- **Level Progression:** Definitions in `src/levels/levels.js`.
- **3D Scene:** Modular components in `src/components/3d/` (e.g., `DIPChip`, `SIMMSlot`, `StackSocket`).
