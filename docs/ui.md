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

## Haptic feedback

Use `triggerHaptic` from `src/lib/haptics.ts` for semantic selection, action or
success/warning/error feedback. Call it at the user interaction or settled outcome;
it returns immediately, limits bursts, skips inactive apps and absorbs unavailable
hardware/runtime errors. Controls own their feedback timing; feature callers should
avoid duplicating it. Android uses native haptic constants and iOS uses selection,
impact and notification feedback from [Expo Haptics](https://docs.expo.dev/versions/v58.0.0/sdk/haptics/).
Selection uses the broadly supported Android clock tick. Outcome constants require
API 30; older Android versions use context-click and long-press fallbacks. Check
constant API levels against the installed native implementation before changing effects.
The `Components/Haptics` Storybook preview compares the effects on physical devices.

## Previews and SDK upgrades

Stories and all native demonstration compositions live in `.rnstorybook/`. Shared UI imports neither. The explicit development
entry owns Storybook imports; see [preview access and bundle boundaries](storybook.md).

For an SDK or Expo UI upgrade:

1. Read the target version's documentation and installed native types. Review
   affected `.ios`, `.android` and declaration files together.
2. Reproduce any workaround's original case before removing it. Include intrinsic,
   full and fractional widths for Hosts, buttons and inputs on Android; an older
   Expo UI version rejected JS numeric widths during native conversion. Keep the
   current version aligned with the installed SDK and verify using new binaries.
3. Use matching native builds and exercise affected iOS/Android interactions,
   light/dark, live RTL, large text, selectors, retained state and touch bounds.
4. Run lint and typecheck; regenerate registration after story changes. Inspect
   both release graphs after entry/Metro changes. Development guards control access; inspect emitted bundles to confirm tooling exclusion.

Use [the SDK baseline](development.md#sdk-and-native-verification-baseline) for
current package/build requirements. Report static checks separately from native
execution. Update the existing skill when its contract changes; do not add source
folder READMEs or duplicate the contract in this guide.
