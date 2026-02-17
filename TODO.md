# TODO

## High Priority

- [ ] Fix default toast identity behavior.
  - Current behavior uses a fixed default id (`"babi-default"`), so new toasts replace older ones.
  - Decide whether default should stack (unique id) or intentionally replace (single active toast).

## Medium Priority

- [ ] Fix `offset` handling for numeric `0`.
  - Current truthy checks ignore valid zero offsets in viewport positioning.

- [ ] Resolve package export/build warning for `./styles.css`.
  - Build passes but Bunchee warns that exported stylesheet source is missing during bundling.

- [ ] Align docs and typings for `babi.show`.
  - README examples use `state` in `show(...)`, but `BabiOptions` currently does not expose `state`.

## Low Priority

- [ ] Add automated tests and CI checks.
  - At minimum: store lifecycle tests, timer/hover behavior tests, and API typing examples from README.

