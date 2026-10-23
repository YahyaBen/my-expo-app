---
name: foodiya-ui-list-item
description: 'Compose Foodiya native list rows using headline, supporting text and accessory slots.'
---

# List item

Import `ListItem` and `ListItemProps` from `@components/ui`.
`list-item.tsx` directly re-exports Expo UI, while
`list-item.android.tsx` adds the actual Android row `testID` missing in the
installed universal implementation. Metro selects the Android override.
`ListItemProps` comes directly from Expo UI without local appearance helpers.

Keep `Leading`, `Supporting` and `Trailing` slots attached to the original native
markers. Caller props, colors and modifier order pass through; the Android test
selector is appended after caller modifiers. Native row colors and
supporting/accessory typography inherit the Host.

Registration uses a verification information row in
[register-screen.tsx](../../../src/features/auth/screens/register-screen.tsx).
The [list showcase](../../../src/features/ui-showcase/list-screen.tsx) also uses
the same component. Settings uses its own `SettingsRow` composition.

For an existing form row with custom native content, use `ListItemAction` and
`ListItemActionProps` from the same public entry point. It accepts `children`,
`onPress`, `disabled` and `testID`; it adds no Host, padding, shape or theme button
geometry. Its declaration and iOS/Android adapters live beside `list-item.tsx`.
iOS uses an automatic SwiftUI Button inside the owning Form/List so the native
cell supplies press highlighting. Android uses a transparent, rectangular
clickable Compose Surface with native enabled/disabled semantics and ripple.
Keep independently interactive accessories in passive rows, outside this action.
Do not nest another ListItem inside FieldGroup.Section on Android: that section
already supplies a Material row. Language sheet choices use a bounded FieldGroup
so iOS has a list context and large-text options remain scrollable.

Import from `@components/ui` and compose inside `UniversalHost`. The Host uses the shared light/dark scheme and theme tint; Host seedColor overrides remain available; use native modifiers only where exposed by the component API. No custom glass layer or Android glass imitation is added.

Native story: [list.stories.tsx](../../../.rnstorybook/stories/components/list.stories.tsx).
Default and compound-slot fixtures retain controls for appearance, row actions
and refresh. Run lint and typecheck; regenerate registration when stories change.
Check native row selectors, slots, appearance and touch behavior on iOS/Android.
The `SettingsRowFeedback` fixture in
[field-group.stories.tsx](../../../.rnstorybook/stories/forms/field-group.stories.tsx)
exercises form/sheet row feedback, disabled activation and a passive switch row.

See [native control themes](../../../docs/control-theme.md) and [UI guide](../../../docs/ui.md).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/list-item/](../../../src/components/ui/list-item/).
