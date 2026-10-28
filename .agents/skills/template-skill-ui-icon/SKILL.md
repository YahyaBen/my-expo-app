---
name: template-skill-ui-icon
description: Render Expo Symbols artwork through the public Icon export in native UI trees.
---

# Icon

Import `Icon` from `@components/ui`. It renders `expo-symbols` artwork through
`RNHostView` inside the existing native Host. Supply typed SF Symbol and Material
Symbol names for iOS and Android.

```tsx
const starIcon = Icon.select({
  ios: 'star.fill',
  android: 'star',
});

<Icon name={starIcon} size={24} />;
```

- `Icon.select` keeps both names for `SymbolView`; a plain `{ ios, android }`
  object is also supported. Do not use XML assets or `@expo/ui`'s `Icon`.
- `size` defaults to 24. `color` overrides the native button foreground, then
  the owning Host's themed text color.
  Native `style`, `modifiers`, disabled state and test selectors stay on the
  native wrapper; `type` selects iOS symbol rendering.
- An icon supplies artwork. Use an existing named native action control for
  interaction, and preserve its accessible name. Artwork is decorative unless
  `accessibilityLabel` is provided.
- Android uses the bundled regular Material Symbols font loaded by `SymbolView`.
  Verify first-render artwork and dynamic names on matching native builds.

Source: [public export](../../../src/components/ui/index.ts),
[implementation](../../../src/components/ui/icon/icon.tsx) and installed
[SymbolView types](../../../node_modules/expo-symbols/src/SymbolModule.types.ts).
