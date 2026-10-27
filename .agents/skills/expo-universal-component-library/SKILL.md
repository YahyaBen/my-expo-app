---
name: expo-universal-component-library
description: Maintain shared native component architecture, theme tokens and Storybook coverage.
---

# Shared component library

Own library-wide structure and consistency. Individual controls own their public
contracts; this skill does not prescribe their props or feature workflows.

- Export public UI through [index.ts](../../../src/components/ui/index.ts).
  Keep implementation, types, private helpers and native adapters in one family
  folder. Import concrete siblings inside the library to avoid barrel cycles.
- Add a wrapper only for project behavior, theme mapping or a demonstrated native
  gap. Keep direct primitives direct. Use platform adapters for actual differences
  while preserving the shared public signature and declarations.
- Keep services, feature workflows and navigation out of shared presentation.
  Receive data and callbacks; reuse the existing Host at native composition
  boundaries rather than introducing a second hosting or theme system.
- Use semantic tokens from `src/constants/themes/`. Read
  [theme ownership](references/theme.md) when changing token resolution, a palette
  or inherited native appearance.
- Add or update a deterministic native story for changed reusable behavior. Use
  production components, explicit preview state and stable selectors on actual
  controls. Compound slots can use a focused composition story.
- Keep Storybook imports in `.rnstorybook/` and `src/features/storybook/`.
  Catalog flags control route access; they do not strip showcase modules. Follow
  the existing [preview workflow](../../../docs/storybook.md).
- On SDK/UI upgrades, inspect installed types and both platform adapters. Remove
  a workaround only after reproducing its original case on matching native builds.

Run lint and typecheck; regenerate registration after story edits. Check affected
native behavior on both platforms, including light/dark, live RTL, large text,
disabled states and touch bounds. Inspect both release graphs after entry/Metro
changes. Registration, screenshots and JS mocks do not establish native behavior.
