---
name: template-skill-ui-button
description: Compose native semantic buttons and maintain their Host, color and geometry contract.
---

# Buttons

Import public buttons/types from `@components/ui`.
Source: [button/](../../../src/components/ui/button/).
Keep shared props/theme resolution in `universal-button.tsx` and rendering in
the existing iOS/Android adapters and private declaration.

## Choose the rendering boundary

- `UniversalButtonContent`: inside `PageScreen`, `AuthScreenFrame`,
  an existing native Host, list/card native content or a native sheet.
- `UniversalButton`: at an RN view/footer/overlay boundary; it owns one
  `UniversalHost`. An `RNHostView` subtree is also an RN boundary.
- For a group at an RN boundary, use one `UniversalHost` with content buttons.
  `PageFrame` alone does not establish native content hosting.
- Standalone explicit `colorScheme` reaches native appearance and descendant
  project context. Content buttons inherit the owning project Host.
  Raw native Host appearance alone does not update project React context.

## Props and intent

`variant` is required. Filled/prominent: `primary`, `success`, `warning`,
`info`, `destructive`; outlined/bordered: `secondary`; text/plain:
`tertiary`, `link`. `glass` uses iOS 26+ glass, older iOS automatic fallback
and Android outlined styling. Destructive also sets the iOS role.

Optional common props: `label`, native `children`, `onPress`, `disabled`,
`testID`, `fullWidth`, `color`, `contentColor`, `borderRadius`,
`contentPadding`. Standalone-only: `colorScheme`, `cornerRadii`.

- Children replace the label when non-nullish. For icon/text content, use native
  `Row`, `Icon`, `Text`; native Text can inherit the button foreground.
  Shared Icon artwork inherits the resolved button foreground through React
  context, with an explicit icon color taking precedence.
  `UniversalTextContent` sets its own foreground, so check filled-button contrast.
- Generic icon-only accessible naming is not exposed: there is no
  `accessibilityLabel` prop, and a label is ignored with children. Use an
  existing named icon-control adapter or deliberately extend both native adapters.
- There are no `style`, `modifiers`, `icon`, `loading`, `pending` or `href`
  props. Navigation, confirmation, pending/error state and duplicate-submit
  guards belong to the consumer. Disable unavailable actions with `disabled`.
- Do not nest independent interactive controls inside a button.

## Colors and geometry

- Defaults: primary/onPrimary; secondary/secondary; muted/muted tertiary;
  tint/tint link; paired status colors; error/onError destructive;
  surfaceVariant/text glass.
- Supplying either color prop skips both semantic defaults. Supply a coherent
  pair when overriding. iOS `color` is tint; Android uses filled-container
  color or outlined/text foreground fallback. Native disabled feedback remains.
- Omitted radius uses `design.shape.buttonRadius`, then native defaults.
  Explicit radius/padding preserve zero. Standalone physical `cornerRadii`
  overrides uniform radius; omitted corners are square and do not mirror in RTL.
  Preserve the existing Host clip and square inner renderer.
- `fullWidth` needs a parent with real width. Equal actions in a native Row
  each need a `Column modifiers={nativeRowWeight}` and a full-width button.
  Omit `fullWidth` for intrinsic sizing; keep existing per-axis Host sizing.

Use the [Buttons showcase](../../../src/features/ui-showcase/buttons-screen.tsx)
and [native stories](../../../.rnstorybook/stories/components/button.stories.tsx).
Verify disabled activation, pending recovery, Host overrides, translated/custom
labels, RTL and native edge taps after geometry changes.
