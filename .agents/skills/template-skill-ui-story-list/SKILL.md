---
name: template-skill-ui-story-list
description: Compose a caller-configured native photo carousel with overlapping-card motion.
---

# Story list

Import `StoryList`, `StoryListProps` and `PhotoItem` from `@components/ui`
inside an existing native Host.
[Source](../../../src/components/ui/story-list/story-list.tsx) owns
presentation; the caller owns images, translated labels, data and surrounding layout.

## Props

- Required: `items: readonly PhotoItem[]`, `width: number`,
  `accessibilityLabel: string`. Items need unique stable string IDs, an Expo
  Image source (URI, object or bundled asset number) and a translated label.
- `itemWidth` changes the card width; `height` is the artwork viewport height. Cards default to 78% of the supplied width.
- `getPositionLabel(index, total)` formats a zero-based index for the optional
  caption and spoken value. Without it, accessibility uses the item's label.
- `onIndexChange(index, item)` runs once for a changed user selection. Initial
  render, resizing, identical selections and dataset resets do not emit events.
- `testID` defaults to `story-list`. Caller-supplied prefixes identify instances.

## State and boundaries

- Empty data or a nonpositive/nonfinite width renders nothing. Ordered ID changes reset selection to the first
  item; source/label updates under the same IDs preserve selection. Width and
  direction changes keep the current photo aligned.
- The parent supplies available content width in points/dp after padding/safe
  areas. The component makes no screen-width assumptions and adds no headings.
- Photo cells use a shared virtualized horizontal viewport with fixed layouts;
  distant images unmount. Keep native clipping off for transformed overlap and
  descending cell stacking order. Continuous artwork motion stays on the UI
  runtime; React handles settled selection and the native list owns its window.
- Preserve snap scrolling, native-direction scroll metrics normalized to logical offsets, paired RTL
  mirroring, adjustable accessibility actions, theme and reduced-motion behavior.
- Keep native text/controls around the RN artwork boundary. UI files contain no
  Picsum fixtures, translations, feature state, navigation or public-barrel imports.

[Native stories](../../../.rnstorybook/stories/components/story-list.stories.tsx)
exercise caller data, sizes, selection callbacks, replacement/empty/single-item
data, 200/1,000-item windows, RTL and reduced motion. Verify scrolling, spoken selection and resizing
on both native platforms; registration is not device verification.
