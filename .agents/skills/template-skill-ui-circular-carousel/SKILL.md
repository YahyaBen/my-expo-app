---
name: template-skill-ui-circular-carousel
description: Compose a circular photo carousel with native scale selection and arc motion.
---

# Circular carousel

Import `CircularCarousel` from `@components/ui` inside an existing native Host.
[Source](../../../src/components/ui/circular-carousel/circular-carousel.tsx)
owns the Picsum starter photos, arc transforms and native Scale switch.

- Use page-width content: geometry derives from the window, safe areas and shared
  page spacing rather than an arbitrary narrow parent.
- Keep snap scrolling, continuous offset and scale interpolation on the UI runtime.
  Native controls/text surround the RN artwork/scroll boundary.
- Preserve circular clipping, arc/opacity interpolation and optional spring scale.
- Keep adjustable accessibility actions and selected-photo restoration after
  width/direction changes. RTL mirrors physical scrolling and card placement.
- Reduced motion uses the flat strip and disables optional scaling.
- Keep implementation helpers and existing selectors within this family.

Use [native stories](../../../.rnstorybook/stories/components/circular-carousel.stories.tsx)
to verify Scale activation, swiping, accessibility selection, resizing,
reduced motion, light/dark and live RTL.
