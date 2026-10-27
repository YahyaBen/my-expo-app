---
name: template-skill-ui-native
description: Apply shared native width, fill, row-weight and minimum-height modifiers.
---

# Native layout helpers

Import these modifier helpers from `@components/ui`.
Source: [native-fill-width declarations and adapters](../../../src/components/ui/native/).

| Helper                            | Purpose                                         |
| --------------------------------- | ----------------------------------------------- |
| `nativeFillWidth`                 | Fill a constrained parent's width               |
| `nativeFillWidthCenter`           | Full width with centered frame alignment on iOS |
| `nativeFillWidthEnd`              | Full width with trailing frame alignment on iOS |
| `nativeFillSize`                  | Fill both axes of a bounded parent              |
| `nativeRowWeight`                 | Share remaining width as a direct Row child     |
| `nativeCenteredMinHeight(height)` | Center short content while allowing growth      |

- Center/end helpers alias fill-width on Android. Also set Column alignment
  when child alignment must match across platforms.
- Put row weight on direct children, usually one Column per equal-width action.
- A fill requires real parent bounds. Avoid fill-size inside an unbounded
  vertical scroll; use centered minimum height for short scroll content.
- These values are modifier arrays, not RN styles. Spread to combine and never
  mutate shared arrays.
- `native-children.ts` is a private compound-slot parser.
- For SwiftUI frames, chain separate fixed and flexible dimension modifiers.
  Set raw HStack/VStack spacing explicitly when zero is intended.

Check direct-child weight, constrained fills, center/end alignment, RTL and large
text with the [Native layout showcase](../../../src/features/ui-showcase/native-screen.tsx).
