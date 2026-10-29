---
name: template-skill-ui-slider
description: Compose controlled native sliders with continuous or stepped numeric ranges.
---

# Slider

Import `Slider` from `@components/ui` inside an existing Host.
Source: [slider.tsx](../../../src/components/ui/slider/slider.tsx).

- Required: numeric `value`, `onValueChange(next: number)`.
- Optional: `min` (0), `max` (1), `step`, `disabled`, `testID`,
  native `modifiers`.
- Supply finite values, `min < max` and an in-range value. Omit step for a
  continuous range; a discrete range needs positive aligned steps/endpoints.
- Give the native parent/control real width. Show translated description/value
  and units nearby; proximity alone does not prove an accessibility association.
- Drag callbacks are frequent. Update local preview state and reuse the feature's
  commit/debounce policy for storage/network work. Format display precision
  separately from the editable value.
- Disabled preserves value and suppresses callbacks. Keep native thumb, track,
  colors and feedback supplied by the Host/platform.
- There are no `label`, RN `style`, `minimumValue`, `maximumValue`,
  `onSlidingComplete`, track-color or children props.

Use the [showcase](../../../.rnstorybook/components/catalog/slider-preview.tsx)
in **Wireframes/Component Gallery**. Verify endpoints, step alignment, reset, disabled
suppression, accessibility adjustment and RTL on devices.
