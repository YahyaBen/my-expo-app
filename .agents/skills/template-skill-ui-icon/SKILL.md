---
name: template-skill-ui-icon
description: Select native SF Symbols and Material XML icons through the public Icon export.
---

# Icon

Import `Icon` from `@components/ui`. Select an SF Symbol on iOS and a literal,
synchronous `require()` of an installed Material XML asset on Android.

```tsx
const starIcon = Icon.select({
  ios: 'star.fill',
  android: require('@expo/material-symbols/star.xml'),
});
```

- Dynamic `import()` through the project re-export stays a Promise: Expo's
  Babel plugin recognizes imports from `@expo/ui` only.
- Verify XML paths exist; TypeScript does not validate `require()` paths.
- An icon supplies artwork. Use an existing named native action control for
  interaction, and preserve its accessible name.
- Read installed types before choosing accessibility or sizing props.

Source: [public export](../../../src/components/ui/index.ts) and installed
[Icon types](../../../node_modules/@expo/ui/src/universal/Icon/).
