---
name: template-skill-ui-skeleton
description: Compose static native skeleton shapes and standalone animated placeholders.
---

# Skeleton

Import `Skeleton`, `SkeletonContent` and their types from `@components/ui`.
Source: [skeleton/](../../../src/components/ui/skeleton/).

| Component         | Ownership                                                   |
| ----------------- | ----------------------------------------------------------- |
| `SkeletonContent` | Static shape inside an existing native Host                 |
| `Skeleton`        | Standalone RN boundary with its own Host; pulses by default |

## Shape and motion

- Both accept `style`, `colorScheme` and `testID`; only `Skeleton` accepts
  `animate`. Shapes accept no children or press handlers.
- Flat `SkeletonStyle` supports only width, height, borderRadius, backgroundColor
  and opacity. Dimensions are numeric points/dp; omitted width or `'100%'`
  fills a constrained parent. Default height is 16.
- Other percentage sizes, style arrays and arbitrary RN styles are unsupported.
  Keep geometry finite/nonnegative and opacity within 0–1.
- Defaults use the control radius, theme border fill and 0.72 opacity.
- Standalone motion uses existing Reanimated native keyframes: 900 ms per direction,
  alternating to 45% opacity. Add no timer or second pulse layer.
- `animate={false}` makes a standalone shape static. Pass route focus when
  offscreen pulsing must stop. Shared guards pause for reduced motion/background.

The feature owns loading announcements and query states. Preserve cached content;
use explicit error/empty presentation after resolution.

Check shape bounds, theme colors, decorative accessibility, reduced motion and
background/focus transitions with the
[Skeleton showcase](../../../.rnstorybook/components/catalog/skeleton-preview.tsx).
