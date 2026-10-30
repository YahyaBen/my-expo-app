---
name: template-skill-ui-ios-home-grid
description: Compose a caller-configured native photo grid with measured expansion and drag dismissal.
---

# Photo home grid

Import `IosHomeGrid`, `IosHomeGridProps` and `PhotoItem` from `@components/ui`
inside an existing native Host. [Source](../../../src/components/ui/ios-home-grid/ios-home-grid.tsx)
owns presentation on iOS and Android; callers own photo data and translated text.

## Props

- Required: `items: readonly PhotoItem[]`, `width: number`, `closeLabel: string`.
  Each item has a unique stable string `id`, an Expo Image `source` (URI, source
  object or bundled asset number), and a translated `label`.
- Optional: `columns` (maximum, default 4), `gap` (8), `borderRadius` (16),
  `dismissHint`, `onSelect(item, index)`, `onClose(item, index)`, and `testID`
  (default `ios-home-grid`). Width is content width in points/dp; the caller owns
  surrounding padding and safe areas. Narrow widths reduce columns to keep
  native targets usable. Empty data or nonpositive/nonfinite width renders nothing.
- `onSelect` runs after a valid measured expansion is accepted. `onClose` runs
  once when a Close, downward drag or accessibility dismissal is accepted.
  These are action callbacks, never render/effect notifications.

- Optional `viewportHeight` must be positive and finite. It bounds and virtualizes
  rows for a larger dataset; the grid owns vertical scrolling in this mode. Put
  it outside another vertical scroll container. Omit it for a small eager inline
  grid in a parent scroll. Keep native tile buttons, measured expansion and the
  named Close action in both modes.

## State and native boundaries

- Ordered item IDs/labels, width, viewport height, columns, gap, radius, font scale or direction changes
  remount the internal scene and cancel stale expansion. This reset does not emit
  `onClose`. Labels join the key because wrapping can change row height. Source
  updates with unchanged IDs/labels use current data while expanded.
- Native buttons own tile/Close activation. Keep artwork as a pointer-transparent
  sibling: an RN bridge inside a native button label can consume Android photo taps.
- Measure photo/scene in window coordinates for LTR/RTL expansion. Preserve the
  local gesture root, async measurement/unmount guards and duplicate-close guard.
- Keep spring return, downward distance/velocity dismissal and cancelled-drag
  reset. Hide/disable the underlying grid while expanded. Retain named Close,
  accessibility dismissal and escape. Reduced motion skips zoom/drag transforms.
- Keep helpers within the family. The component has no Picsum fixture, screen
  heading, app navigation, translations or preference persistence.

[Native stories](../../../.rnstorybook/stories/components/ios-home-grid.stories.tsx)
exercise custom data/labels/width, callbacks, replacement while expanded, empty
and one-item data, a partial three-column row and bounded 200/1,000-item data. Verify native edge taps,
short/cancelled drags, large text, live RTL and both appearances on devices.
