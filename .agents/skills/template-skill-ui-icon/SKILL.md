---
name: template-skill-ui-icon
description: Render platform symbols through the public Icon export in native UI trees.
---

# Icon

Import `Icon` from `@components/ui` inside the existing native Host. Supply
typed SF Symbol and Material Symbol names for iOS and Android.

```tsx
const starIcon = Icon.select({
  ios: 'star.fill',
  android: 'star',
});

<Icon name={starIcon} size={24} />;
```

- `Icon.select` keeps both platform names. A plain `{ ios, android }`
  object is also supported. Consumers do not use XML assets or `@expo/ui`'s `Icon`.
  The shared Android artwork adapter alone uses the native Compose renderer.
- `size` defaults to 24 and gives the native row a bounded viewport for the
  symbol. `color` overrides the native button foreground, then
  the owning Host's themed text color. System leaves SwiftUI foregrounds native;
  Android artwork reads the Host's Material foreground for native image tinting.
  Native `style`, `modifiers`, disabled state and test selectors stay on the
  native wrapper.
- iOS renders system symbols with SwiftUI `Image`. An explicit `type` uses
  `expo-symbols` to preserve the requested rendering mode.
- An icon supplies artwork. Use an existing named native action control for
  interaction, and preserve its accessible name. Artwork is decorative unless
  `accessibilityLabel` is provided.
- Keep hosted `expo-symbols` artwork inside a non-collapsible `View` with
  `pointerEvents="none"`, so tapping artwork belongs to the native parent action.
  Do not add a separate icon press handler.
- Android renders the bundled regular Material Symbols through
  `unstable_getMaterialSymbolSourceAsync`, then draws the source in a native
  Compose Icon without an RNHostView. White glyph sources are shared by name and
  size; native tint follows theme changes without regenerating PNGs. Failed
  sources are removed so a later mount can retry. Preserve stale-result guards
  when a name or size changes during rendering.
- Do not bridge Android icon artwork back through RNHostView: in modal windows
  the bridge owns JS touches and can consume the center of a native parent button,
  even when its RN children use pointerEvents="none". Increasing the button size
  does not repair that dead zone.
- Verify the exact icon center, its surrounding padding, disabled actions, dynamic
  names, first-render artwork and theme tint on matching native builds. The button
  and sheet examples supply local actions and stable selectors for these checks.

Source: [public export](../../../src/components/ui/index.ts),
[implementation](../../../src/components/ui/icon/icon.tsx) and installed
[SymbolView types](../../../node_modules/expo-symbols/src/SymbolModule.types.ts).
