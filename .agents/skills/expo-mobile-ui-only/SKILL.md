---
name: expo-mobile-ui-only
description: Apply the project's iOS and Android platform and native UI technology constraints.
---

# Mobile UI constraints

- Target iOS and Android. Do not add web routes, DOM, WebViews, CSS, browser
  previews or web fallbacks.
- Render controls with `@expo/ui` through the existing `@components/ui` exports.
  Do not substitute React Native controls, NativeWind or another UI kit.
  Check installed APIs before selecting a component; surface a missing capability
  before adding an alternative library.
- Use Expo Router and keep reusable code outside `src/app/`. Put real native
  differences in `.ios.tsx` and `.android.tsx` adapters.
- Use native `Row`, `Column` and `Spacer` for ordinary layout. React Native
  infrastructure remains appropriate for safe areas, keyboard, navigation,
  absolute overlays, maps, Lottie and Skia. Bridge necessary RN artwork into
  native content with `RNHostView`.
- Preserve native accessibility, interaction feedback, theme, live RTL and large
  text. Keep visible surfaces aligned with their actual touch targets.
- Prefer native defaults and existing semantic tokens. Add decorative layers,
  measurements, memoization or dependencies only for a concrete requirement.

These constraints govern technology selection. Existing component implementations
define supported props, hosting, sizing and behavior.
