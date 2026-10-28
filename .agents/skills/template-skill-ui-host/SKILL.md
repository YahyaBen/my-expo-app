---
name: template-skill-ui-host
description: Choose native Host boundaries, sizing, theme inheritance and live layout direction.
---

# UniversalHost

Import `UniversalHost` from `@components/ui` where React Native enters native UI.
Source: [universal-host.tsx](../../../src/components/ui/host/universal-host.tsx).

## Ownership

- `PageScreen` and `AuthScreenFrame` already host native content.
- Arrange siblings with Row/Column; direct Host siblings can overlap.
- After an `RNHostView` bridge, use one Host for a native group or an existing
  standalone hosted control. Avoid another Host around standalone controls.

## Sizing

| Configuration             | Default `matchContents` | Bounds                       |
| ------------------------- | ----------------------- | ---------------------------- |
| Ordinary                  | `{ vertical: true }`    | Full width, intrinsic height |
| `inline`                  | `true`                  | Intrinsic on both axes       |
| `viewportHeight={height}` | `false`                 | Explicit viewport height     |
| Explicit `matchContents`  | Supplied value          | Overrides automatic choice   |

Viewport height takes priority over inline when selecting `matchContents`.
Consumer `style` follows derived sizing and can override it. Fill sizing needs
a bounded parent; it cannot infer screen height from intrinsic scroll content.
The public `ref` addresses the RN `ViewInstance`. iOS Host content top-aligns;
request centering in native layout.

## Theme and direction

- Explicit `colorScheme`/`layoutDirection` override the nearest project Host,
  then app preferences. Preserve state when these values change.
- `useHostColorScheme`/`useHostLayoutDirection` read resolved values.
  Read them in a descendant to inspect a newly created Host's overrides.
- `seedColor` defaults to the active theme tint for every palette, including UX.
  Explicit seeds keep priority; Android derives Material controls and iOS applies
  native tint. Keep brand color choices in theme tokens, outside Host branches.
- Pass direction through the Host prop. Leave safe-area ownership to the page.

Check intrinsic/bounded sizes, retained state, touch bounds and RTL using the
[Host showcase](../../../src/features/ui-showcase/host-screen.tsx).
