---
name: template-skill-ui-shape
description: Compose filled native geometric shapes with shared iOS and Android variants.
---

# Shape

Import `Shape` and `ShapeProps` from `@components/ui` inside an existing Host.
Source: [shape/](../../../src/components/ui/shape/).

- Shared variants are circle, rectangle, roundedRectangle and capsule. iOS
  renders SwiftUI shapes; Android renders Compose Shape primitives.
- Supply positive finite width/height values; both default to 64. A circle fits
  the shorter dimension. cornerRadius, default 12, applies to roundedRectangle.
- Color defaults to the owning Host scheme's theme tint. An explicit color wins.
- Shapes are artwork without actions or content slots. Omit accessibilityLabel
  for decoration; provide it when the shape conveys information.
- Android's star, pill-star and polygon parameters are outside this shared API.
  Do not silently substitute a different geometry on iOS.

Use [Shape/Playground](../../../.rnstorybook/stories/components/shape.stories.tsx)
for geometry, explicit colors, intrinsic sizing and light/dark previews. Inspect
both native renderers, including non-square circle frames and corner radii.
