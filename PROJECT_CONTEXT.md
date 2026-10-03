# Workdesk Agent — project context

Updated: 2026-10-03

## User intent

Build an open-source web application for AI agents, such as Hermes Agent or other agent runtimes. Present their collaborative workflow through a virtual office inspired by the supplied reference. The user intends to upload the project to GitHub.

The working directory is currently named `workdesk-agent`; the final product name has not been decided.

## Reference observations

The reference was a portrait screenshot of a stylized 3D isometric office with blocky, low-poly characters. It showed:

- An elevated, diagonal view of the office.
- Warm wood flooring, pale walls, shelves, wall displays, and small decorative objects.
- A shared desk area with monitors and office chairs on a dark rug/platform edged with blue accent lighting.
- Distinct agent characters seated or standing at workstations.
- Floating dark nameplates identifying roles: CTO, Backend Dev, Full-Stack Dev, Frontend Dev, QA Engineer, DevOps, Pentester, and Security.
- Small status indicators next to role labels.
- A separate CTO desk toward the back of the office.

The reference conveys the idea of AI employees working together in a visible virtual office. Social-media overlays and the logo in the screenshot are not established product requirements.

## Current understanding

The proposed interpretation is a web interface where characters represent agents and their office activity makes collaborative task progress visible. This interpretation still needs refinement with the user; the screenshot alone does not specify execution behavior.

## Open decisions

- Whether the first version connects to real agents or simulates workflows for a UI prototype.
- Exact workflow: task creation, delegation, coordination, review, and completion behavior.
- Runtime integrations, including whether Hermes Agent is the first supported integration.
- Rendering approach, technology stack, persistence, and deployment model.
- Final project name, open-source license, and target GitHub repository.

The user approved the initial frontend design and implementation plan. A Vite + React + TypeScript frontend now renders the office with React Three Fiber and Drei, with role selection, agent details, and a local workflow demo. No real agent runtime is connected yet.

## Frontend snapshot

The user requested a first local commit of the current state, explicitly deferring push. Six workflow tests and a production build passed. Vite is running at `http://localhost:5173/` for preview. Full visual QA is pending because screen capture failed. Review identified a remaining narrow-screen camera framing issue: fixed zoom can crop the office on mobile. Keep this limitation visible until responsive camera fitting is implemented. Bundle splitting also remains future work.

## Initial 3D assets

The user requested initial 3D assets and explicitly chose Blender. Blender 5.2.1 LTS generated a first static low-poly asset pack in `assets/3d/`: an editable `workdesk-office.blend`, a complete `office.glb`, six separate agent GLBs (Backend, Frontend, QA, DevOps, Security, Lead), a desk GLB, a chair GLB, and `office-preview.png`.

The reproducible generator is `scripts/create_office.py`. Run with `/Applications/Blender.app/Contents/MacOS/Blender --background --python scripts/create_office.py` from the project root. This regenerates the asset files. Individual agent and furniture exports use ground-centered origins; Blender exports standard glTF coordinates for web use. These are static meshes, without rigs or animation. The preview was rendered and inspected. The initial assets are a visual starting point, not an approved final art direction.

## Reference lifecycle

The user requested that the project understanding be saved and the `reference` folder deleted afterward. This document preserves the relevant visual observations; the original image is intentionally removed.

## Working preferences

- After a requested commit and push both succeed and the task is complete, stop and verify all development servers started by Codex for that task, including child processes. Preserve unrelated or user-started servers, and honor explicit requests to keep a server running.
- Do not launch iOS simulators unless explicitly requested. The user previews iOS UI on a physical iPhone.
- Batch small changes. Build only when the requested task is complete and compilation verification is warranted; ask before an earlier build. Reuse a single build/cache directory per project.
