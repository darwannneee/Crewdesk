# Workdesk Agent

An early frontend prototype for an open-source AI agent workspace. A low-poly virtual office represents six agents, with a local demo workflow, role selection, and an activity feed.

## Run locally

Requires Node.js 22.12+ (Node.js 24 recommended).

```sh
npm ci
npm run dev
```

Use the URL printed by Vite. To verify or preview a production build:

```sh
npm test
npm run build
npm run preview
```

## Current scope

Vite, React, TypeScript, React Three Fiber, Drei, and Three.js. All agent activity is simulated; no Hermes or other agent runtime is connected. The demo runs through planning, implementation, review, and delivery, with pause/resume, reset, and replay controls.

Blender assets are in `assets/3d/`. The complete scene is `office.glb`; `workdesk-office.blend` is the editable source. Individual agent, desk, and chair GLBs are also included. These meshes are static and have no animation rig.

Regenerate assets from the project root with Blender installed:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --python scripts/create_office.py
```

This overwrites generated asset files. The UI uses Google Fonts with system font fallbacks.

## Prototype limitations

- The fixed camera zoom can crop the office on narrow mobile screens; responsive camera fitting remains to be implemented.
- The 3D dependencies produce a large initial JavaScript bundle; code splitting remains future work.
- Automated workflow tests and the production build pass. Full screenshot-based visual QA remains pending because the local screen-capture tool failed.
- Runtime integration, deployment, repository remote, and an open-source license have not been configured yet.

See `PROJECT_CONTEXT.md` and `docs/superpowers/` for project context, design, and implementation plan.
