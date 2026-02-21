---
name: deploy-assembly-battle
description: "Guidelines for building and deploying the Assembly Battle game as a static site. Use when preparing the project for production, generating the 'dist' folder, or verifying the build before hosting."
---

# Deploying Assembly Battle

## Overview

Assembly Battle is a Vite-based React application that deploys as a static site. The deployment process involves linting, testing, and building the production assets into the `dist/` directory.

## Prerequisites

- **Node.js & npm:** Ensure dependencies are installed (`npm install`).
- **Tests Passing:** Never deploy without verifying the core logic.

## Deployment Workflow

### 1. Pre-deployment Checks
Always run linting and tests before building:
```bash
npm run lint
npm run test -- --run
```

### 2. Build for Production
Generate the static assets in the `dist/` folder:
```bash
npm run build
```

### 3. Local Verification
Verify the build locally using the preview server:
```bash
npm run preview
```
The app will be accessible at `http://localhost:4173`.

## Hosting Options

As a static build, the contents of the `dist/` folder can be hosted on:
- **GitHub Pages:** (Requires `base` configuration in `vite.config.js`)
- **Vercel / Netlify:** Highly recommended for Vite apps (automatic detection).
- **S3 / Static Web Server:** Simply upload the `dist/` folder contents.

## Troubleshooting

- **Large Chunks:** If Vite warns about chunks > 500kB, consider code-splitting or manual chunking in `vite.config.js`.
- **Permission Denied (EACCES):** If `npm install` fails on a large disk, use `npm install --no-bin-links`.
- **Missing Dependencies:** Ensure `@playwright/test` is installed if running E2E visual verification.
