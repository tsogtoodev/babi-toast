# TODO

## High Priority

- [X] Add first-class custom component toast content with promise-stage morphing.
  - Support `component` + `componentProps` in standard toasts and all `babi.promise(...)` stages.
  - Preserve the current Babi shell/header while rendering custom content in the expandable body.
  - Ensure unnamed toasts stack by default so rich staged toasts do not overwrite each other.

- [X] Fix default toast identity behavior.
  - Unnamed toasts now stack: `createToast` falls back to `generateId()` instead of a fixed `"babi-default"` id.

## Medium Priority

- [X] Ability to Promise morph to other components.
  - Needed for chimege reader project.

- [X] Fix `offset` handling for numeric `0`.
  - Switched truthy guards to `!== undefined` in `getViewportStyle`, so `offset: { top: 0 }` now applies.

- [X] Resolve package export/build warning for `./styles.css`.
  - Build now runs through `scripts/build.mjs`, which filters bunchee's spurious "missing source files" warning for `./styles.css` (the file is still copied from `src/` to `dist/`).

- [X] Align docs and typings for `babi.show`.
  - `BabiOptions` exposes `state?: BabiState`, so README `babi.show({ state: "loading", ... })` examples type-check.

## Low Priority

- [X] Add automated tests.
  - vitest + jsdom + @vue/test-utils, 44 tests across `tests/store.test.ts` (lifecycle, dismiss, clear, autopilot, promise/stream/promote), `tests/toaster.test.ts` (auto-dismiss timer, hover-pause, offset zero) and `tests/typing.test.ts` (README API typings via `expectTypeOf`).
  - `npm run test` (one-shot) and `npm run test:watch`. Test typecheck via `tsconfig.test.json` is wired into `npm run typecheck`.

