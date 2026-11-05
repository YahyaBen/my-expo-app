---
name: template-skill-ui-circular-carousel
description: Compose a caller-configured native photo carousel with circular clipping and arc motion.
---

# Circular carousel

Import `CircularCarousel`, `CircularCarouselProps`, `CircularCarouselItem`,
`CircularCarouselIconItem` and `PhotoItem` from `@components/ui`
inside an existing native Host.
[Source](../../../src/components/ui/circular-carousel/circular-carousel.tsx) owns
presentation; the caller owns images, translated labels, data and surrounding layout.

## Props

- Required: `items`, `width: number`, `accessibilityLabel: string`. Items need
  unique stable string IDs and translated labels. A photo supplies `source`
  (Expo Image URI/object/bundled asset); an icon supplies typed `icon` names.
  The generic props infer the item/callback type; existing photo callers remain valid.
- `itemSize` changes the image step/diameter; `height` is the artwork viewport
  height. The selected circle is always larger. With Reduce Motion, size changes
  when selection settles.
- `getPositionLabel(index, total)` formats a zero-based index for the optional
  caption and spoken value. Without it, accessibility uses the item's label.
- `onIndexChange(index, item)` runs once for a changed user selection. Initial
  render, resizing, identical selections and dataset resets do not emit events.
- `onPreviewIndexChange(index, item)` reports the centered item at drag start and
  subsequent nearest-item changes during the swipe/inertia. It does not commit
  selection or activate an item. Index crossings are detected on the UI runtime;
  React receives preview changes rather than every scroll frame. Keep transient
  name feedback separate from the carousel's caller state so it can update alone.
- Optional `onItemPress(index, item)` enables named native circle actions. Swipes
  select without activating. Accessibility increment/decrement selects; activate
  opens the selected item. `onScrollBeginDrag` reports a new drag;
  `onSelectionSettled(index, item)` reports a settled scroll, including the same item.
  Feature navigation and informational name callouts stay in the consumer.
- `testID` defaults to `circular-carousel`. Caller-supplied prefixes identify instances.

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
- Interactive cells use centered content padding and local artwork coordinates
  so native actions stay within each cell's touch frame. Native controls re-enter
  through the cell Host; photos remain pointer-transparent inside their action.
- Preserve snap scrolling, native-direction scroll metrics normalized to logical offsets, paired RTL
  mirroring, adjustable accessibility actions, theme and reduced-motion behavior.
- Keep native text/controls around the RN artwork boundary. UI files contain no
  Picsum fixtures, translations, feature state, navigation or public-barrel imports.

[Native stories](../../../.rnstorybook/stories/components/circular-carousel.stories.tsx)
exercise caller data, sizes, selection callbacks, replacement/empty/single-item
data, 200/1,000-item windows, RTL and reduced motion. Verify scrolling, spoken selection and resizing
on both native platforms; registration is not device verification.
