---
name: template-skill-ui-stacked-carousel
description: Compose a photo stack carousel with depth motion and native page indicators.
---

# Stacked carousel

Import `StackedCarousel` from `@components/ui` inside an existing native Host.
[Source](../../../src/components/ui/stacked-carousel/stacked-carousel.tsx)
owns the Picsum starter photos, stack transforms, native dots and labels.

- Use page-width content: card geometry derives from the window, safe areas and
  shared page spacing.
- The RN artwork boundary supplies snap scrolling; native content surrounds it.
  Keep continuous offset and transforms on the UI runtime.
- Preserve vertical translation, scale, perspective, rotation and clamped opacity.
- Restore the selected photo after width/direction changes. Keep RTL scroll
  mirroring and adjustable accessibility actions.
- Reduced motion uses the simpler fade instead of depth transforms.
- Native page dots reflect settled selection and inherit Host appearance.
  Keep helpers and existing selectors within this family.

Use [native stories](../../../.rnstorybook/stories/components/stacked-carousel.stories.tsx)
to verify edge photos, swiping, page dots, accessible selection, reduced motion,
resizing and live RTL on both platforms.
