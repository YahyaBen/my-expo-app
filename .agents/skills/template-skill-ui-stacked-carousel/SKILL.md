---
name: template-skill-ui-stacked-carousel
description: Compose a caller-configured native photo carousel with depth transforms and native page indicators.
---

# Stacked carousel

Import `StackedCarousel`, `StackedCarouselProps` and `PhotoItem` from `@components/ui`
inside an existing native Host.
[Source](../../../src/components/ui/stacked-carousel/stacked-carousel.tsx) owns
presentation; the caller owns images, translated labels, data and surrounding layout.

## Props

- Required: `items: readonly PhotoItem[]`, `width: number`,
  `accessibilityLabel: string`. Items need unique stable string IDs, an Expo
  Image source (URI, object or bundled asset number) and a translated label.
- `itemWidth` changes the card width; `height` is the artwork viewport height, including stack clearance (minimum 73 points/dp). `showIndicators` defaults to true.
- `getPositionLabel(index, total)` formats a zero-based index for the optional
  caption and spoken value. Without it, accessibility uses the item's label.
- `onIndexChange(index, item)` runs once for a changed user selection. Initial
  render, resizing, identical selections and dataset resets do not emit events.
- `testID` defaults to `stacked-carousel`. Caller-supplied prefixes identify instances.

## State and boundaries

- Empty data or a nonpositive/nonfinite width renders nothing. Ordered ID changes reset selection to the first
  item; source/label updates under the same IDs preserve selection. Width and
  direction changes keep the current photo aligned.
- The parent supplies available content width in points/dp after padding/safe
  areas. The component makes no screen-width assumptions and adds no headings.
- This is for small visual collections; all images render. Continuous offset
  and transforms stay on the UI runtime; React handles settled selection only.
- Preserve snap scrolling, physical LTR scroll coordinates with explicit RTL
  mirroring, adjustable accessibility actions, theme and reduced-motion behavior.
- Keep native text/controls around the RN artwork boundary. UI files contain no
  Picsum fixtures, translations, feature state, navigation or public-barrel imports.

[Native stories](../../../.rnstorybook/stories/components/stacked-carousel.stories.tsx)
exercise caller data, sizes, selection callbacks, replacement/empty/single-item
data, RTL and reduced motion. Verify scrolling, spoken selection and resizing
on both native platforms; registration is not device verification.
