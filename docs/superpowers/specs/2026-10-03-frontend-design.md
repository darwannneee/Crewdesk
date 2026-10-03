# Workdesk Agent frontend

## Purpose and scope

Build the first frontend of an open-source agent workspace using the existing Blender assets. The office makes agent roles and collaborative progress visible. This version uses local demo data; real Hermes or other runtime connections remain future work.

## Stack and boundaries

Use Vite, React, TypeScript, Three.js, React Three Fiber, and Drei. Keep agent/workflow demo state separate from rendering. Use the existing `assets/3d/office.glb` through Vite asset URLs. The editable Blender source remains in the repository. No backend, login, or external API is required.

## Layout and appearance

Use a dark navy interface with blue accents and clear typography. A compact header identifies Workdesk Agent and labels the workspace as a demo. On desktop, place a roster sidebar beside a large office canvas and an agent details panel. Place workflow and activity panels below. On narrow screens, stack panels without horizontal overflow and keep the office usable.

## Office interactions

Render the complete office model with an orthographic isometric camera, soft lighting, and orbit controls for rotation and zoom. Provide a reset-camera button. Clicking an agent selects its corresponding roster entry and details. Roster buttons provide a keyboard-accessible alternative to canvas selection. Show role/status labels anchored above agent positions; labels must remain readable and selectable.

Show a loading state while the model loads. A model or WebGL failure must show the existing office preview image with a clear message, preserving access to roster and workflow controls.

## Agent details

Use the six existing roles: Lead, Backend, Frontend, QA, DevOps, and Security. Show selected role, status, assigned task, and a concise description. Selection must work from both roster and scene. Do not imply that real agents are connected.

## Demo workflow

Provide one predefined example task with a start/replay action. Its sequential phases are planning, implementation, review, and completion. Each phase updates the relevant agent statuses, task information, workflow progress, and timestamped activity. Provide pause/resume and reset controls. Avoid duplicate timers during replay and clean up timers when the application unmounts. Keep a bounded activity history. Reset returns to the initial idle state.

## Accessibility and verification

Use semantic buttons, visible keyboard focus, text status indicators, and accessible names for icon controls. Respect reduced-motion preferences for decorative UI transitions. Verify demo start, pause/resume, completion, replay, and reset with targeted tests. Verify model export node names before implementing scene selection. Run the production build once after the complete task. Inspect desktop and narrow-screen layouts and check browser errors where browser tooling permits.

## Acceptance

- Vite starts the frontend with documented commands.
- Existing office GLB renders with rotation, zoom, camera reset, and agent selection.
- Roster, details, workflow, and activity panels remain usable on desktop and mobile.
- Demo progression visibly changes UI state; pause, resume, replay, and reset behave consistently.
- Failure/loading states communicate clearly without blocking non-3D controls.
- README explains local setup, asset regeneration, and the demo-only scope.

No publishing, commit/push, or real agent integration is part of this frontend task.
