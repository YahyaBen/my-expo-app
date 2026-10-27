# Shared native UI

Import presentation through [the public UI entry point](../src/components/ui/index.ts)
using `@components/ui`. The app targets iOS and Android with native Expo UI controls.
Find a component's contract in [the skill index](skills.md).

## Library boundaries

Each family owns its implementation, types, private helpers and platform adapters
in `src/components/ui/<family>/`. A wrapper needs concrete project behavior or a
native adaptation; direct primitives stay direct. Inside the library, import
concrete sibling files to avoid cycles through the public barrel.

Keep feature state, queries, writes and navigation in `src/features/`. Shared UI
receives values and callbacks. Use existing theme/preference providers and semantic
tokens from `src/constants/themes/`.

## Native composition

A Host provides native hosting and theme; put ordinary siblings in native Row or
Column layouts. Content controls reuse their existing Host; standalone hosted
wrappers bridge React Native boundaries. Keep specialized RN artwork inside the
appropriate `RNHostView` boundary.

Read the affected component's supported props before composing it. Preserve native
feedback, accessible names, disabled behavior, safe areas and actual touch bounds.
Human guides describe setup and architecture; detailed props and component behavior
have one owner in the matching skill.

## Previews and SDK upgrades

Stories live in `.rnstorybook/`; app catalog compositions live in
`src/features/ui-showcase/`. Shared UI imports neither. The explicit development
entry owns Storybook imports; see [preview access and bundle boundaries](storybook.md).

For an SDK or Expo UI upgrade:

1. Read the target version's documentation and installed native types. Review
   affected `.ios`, `.android` and declaration files together.
2. Reproduce any workaround's original case before removing it. The
   [historical numeric-width failure](build-verification.md#expo-ui-version) is
   a regression scenario, not evidence about the current SDK.
3. Use matching native builds and exercise affected iOS/Android interactions,
   light/dark, live RTL, large text, selectors, retained state and touch bounds.
4. Run lint and typecheck; regenerate registration after story changes. Inspect
   both release graphs after entry/Metro changes. Catalog guards control access,
   while tooling exclusion requires checking emitted bundles.

Use [the SDK baseline](development.md#sdk-and-native-verification-baseline) for
current package/build requirements. Report static checks separately from native
execution. Update the existing skill when its contract changes; do not add source
folder READMEs or duplicate the contract in this guide.
