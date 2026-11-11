---
name: template-skill-ui-host
description: Compose native groups with shared Host ownership; audit redundant boundaries while preserving sizing, appearance and live layout direction.
---

# UniversalHost

Import `UniversalHost` from `@components/ui` where React Native enters native UI.
Source: [universal-host.tsx](../../../src/components/ui/host/universal-host.tsx).

## Choose the boundary

Reuse the existing Host for a native group. A Host around every small control is
an audit candidate; one Host containing many controls is not itself a problem.

| Caller location                                  | Composition                                                 |
| ------------------------------------------------ | ----------------------------------------------------------- |
| Inside `PageScreen` or an existing native tree   | Use native controls and content variants directly.          |
| RN view, footer, overlay or `RNHostView` subtree | Use one `UniversalHost` around a related native group.      |
| One standalone control at an RN boundary         | Use its existing hosted variant without an extra Host.      |
| Recycled RN list cell rendering native content   | Keep the cell's Host; share it across that cell's controls. |

- `PageFrame` alone does not host its content. React theme context surviving an
  `RNHostView` does not restore native ancestry; native content must re-enter a Host.
- Group siblings with `Row`/`Column`; direct Host children can overlap. Prefer
  `ButtonContent`, `UniversalTextContent` and static `SkeletonContent` inside
  that group. Use direct controls such as `TextInput` without standalone wrappers.
- Keep deliberate boundaries for native appearance/direction isolation,
  measured RN artwork, gestures, overlays and standalone animation. Preserve
  standalone APIs and examples that exercise those contracts.
- Choose boundaries explicitly at call sites. Do not make `UniversalHost` skip
  itself based on React context, or add detection providers, caches or wrappers.

## Audit and apply

Trace the rendered path through callers, aliases and wrappers. Distinguish a
native group from RN siblings before counting Hosts; an `RNHostView` starts a new
RN subtree. Inspect the installed Expo UI types and both platform implementations.

For each candidate, identify what its Host owns: bounds/measurement, native
appearance/direction, safe areas, refs, selectors, clipping, touch handling or
animation. Consolidate only when an existing or shared Host can retain those
responsibilities. Replace hosted children with their content variants together;
never place standalone hosted controls inside a new group Host.

Preserve field identity, drafts, focus/selection, callbacks, disabled guards and
stable `testID` props. Carry any needed container selector to the surviving
container. Retain bounded scrolling and RN cell recycling; do not replace
virtualization with an eager native group just to reduce Host count. Keep numeric
LTR islands and independently themed previews isolated from surrounding content.

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
Hosts add no content padding. Put gutters and gaps in native content groups;
keep scroll viewport bounds separate from their inner content insets.
The public `ref` addresses the RN `ViewInstance`. iOS Host content top-aligns;
request centering in native layout.

## Theme and direction

- Explicit `colorScheme`/`layoutDirection` override the nearest project Host,
  then app preferences. Preserve state when these values change.
- `useHostColorScheme`/`useHostLayoutDirection` read resolved values.
  Read them in a descendant to inspect a newly created Host's overrides.
- `seedColor` defaults to the active theme tint. System leaves it unset so the
  platform owns its default palette; UX supplies its tint.
  Explicit seeds keep priority; Android derives Material controls and iOS applies
  native tint. Keep brand color choices in theme tokens, outside Host branches.
- Pass direction through the Host prop. Leave safe-area ownership to the page.

Check intrinsic/bounded sizes, retained state, touch bounds and RTL using the
[Host example](../../../src/features/template/component-screen.tsx).

## Verification and performance claims

Run lint, typecheck and formatting checks. Check retained drafts and action state
when appearance/direction changes. Check changed controls on iOS
and Android with large text, keyboard, screen readers and edge taps.

Report structural changes separately from measured results. Host count does not
rank CPU, frame or memory costs, and a React profile of a Host includes descendant
work. Before claiming a gain, compare the same interaction in same-device release
builds using relevant native frame/CPU/memory traces. Record sample counts and
median/p90; mark unavailable native measurements pending.
