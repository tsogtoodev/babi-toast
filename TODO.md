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

- [ ] Fix `offset` handling for numeric `0`.
  - Current truthy checks ignore valid zero offsets in viewport positioning.

- [ ] Resolve package export/build warning for `./styles.css`.
  - Build passes but Bunchee warns that exported stylesheet source is missing during bundling.

- [X] Align docs and typings for `babi.show`.
  - `BabiOptions` exposes `state?: BabiState`, so README `babi.show({ state: "loading", ... })` examples type-check.

## Low Priority

- [ ] Add automated tests and CI checks.
  - At minimum: store lifecycle tests, timer/hover behavior tests, and API typing examples from README.
