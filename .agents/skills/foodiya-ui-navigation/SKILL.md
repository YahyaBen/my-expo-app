---
name: foodiya-ui-navigation
description: Compose or maintain Foodiya's five-slot native tab dock with four selected navigation items, a raised center action and shared safe-area ownership.
---

# Tab navigation

Use `TabNavigationBar` from `@components/ui` for the app's five-slot dock: two
navigation items, a raised center action, then two navigation items. The center
action is a button; it does not add a fifth route. Keep navigation and sheet
state in the consumer. Follow [Foodiya implementation](../foodiya-implementation/SKILL.md)
and [mobile UI requirements](../expo-mobile-ui-only/SKILL.md).

## Check the public contract

Exports are `TabNavigationBar`, `TabNavigationItemId`, `TabNavigationItem` and
`TabNavigationBarProps`. The [shared implementation](../../../src/components/ui/navigation/tab-navigation-bar.tsx)
owns dock geometry and the icon map. The [iOS](../../../src/components/ui/navigation/navigation-tab.ios.tsx)
and [Android](../../../src/components/ui/navigation/navigation-tab.android.tsx)
adapters own native tab-item rendering and semantics; `navigation-tab.d.ts`
supplies their shared contract. Read both before changing native behavior. Import siblings
directly inside the UI library; feature consumers use the public UI barrel.

| Prop                                     | Contract                                                                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `items`                                  | A readonly tuple of exactly four records with stable `id`, translated `label` and optional `testID`, in navigation order. |
| `activeId`                               | The selected `TabNavigationItemId`: `home`, `search`, `recipes` or `more`.                                                |
| `onSelect`                               | Receives the selected item ID; the consumer owns Router events and route navigation.                                      |
| `action`                                 | The center floating action's required `kind`, translated `label` and `onPress`, plus optional `disabled` and `testID`.    |
| `bottomInset`, `leftInset`, `rightInset` | Optional device insets owned by the dock.                                                                                 |
| `colorScheme`                            | Optional scheme override; otherwise inherit the project appearance.                                                       |

Do not pass route objects, transport callbacks or a fifth item as the center
action. The ID and test selector stay independent of the translated label.
Read the [floating-action contract](../foodiya-ui-floating-action/SKILL.md) for
the action kinds, disabled state and its native 76-point/dp circle. The `continue`
kind supplies the plus icon.

## Own the dock boundary once

The bar is an in-flow navigator footer with a transparent raised region. Its
84-point/dp native frame contains the entire 76-point/dp button; a negative top
margin of `tabBarRaisedHeight` (28 points/dp) overlaps content beside the raised
button. Only the 56-point/dp tab row and bottom system inset reserve screen
height. Keep the root transparent above the dock surface so scrolling content
remains visible on both sides of the circle.

One bounded native Host and Row lay out the tabs and `FloatingActionButton`
together. The center column adds four points/dp above and below the circle;
controls have no absolute overlay and remain inside the full native touch frame.
The dock owns its bottom and side insets. Tab content omits another bottom system
inset and adds only `tabBarRaisedHeight` as trailing scroll clearance, so the last
action can move above the circle. `PageScreen tab` supplies that inner padding;
Settings tab mode adds the same clearance in its last section footer. Do not add
the full dock height as content padding.

The component owns its native Host boundary. Reuse native Row/Column composition
inside it; do not wrap it in another Host or place React Native controls inside
the native content tree. Side items expose native selected-state semantics and
translated accessibility names. Preserve the live layout direction and the
center position in RTL.

Keep the dock full-width and flat: no rounded corners, pill selection backgrounds,
outer button surround or shadows. Side selection uses the foreground color and
native selected-state semantics. The center action keeps its native circle.
Its control Host centers within the safe viewport and uses the shared
`screenContentMaxWidth` (640 points/dp), so wide/open displays keep all five slots
together while the dock background remains full-width. Narrow viewports remain fluid.

Selected and inactive items use the semantic tab colors; the floating button
retains the floating-action family's semantic colors. Keep theme overrides in
the existing tokens. The current dock is static; the historical wave/glass
implementations are not part of this contract.

## Verify the composition

The [native navigation story](../../../.rnstorybook/stories/components/navigation.stories.tsx)
exercises the shared dock separately from app navigation. Keep deterministic
selection, center-action activation and disabled action behavior discoverable.
The long-content fixture shows striped rows beside the raised circle and keeps
a counted final content action above it at the end of scrolling.
Check both native adapters, light/dark, RTL, long labels, large text, side cutouts,
bottom system insets, keyboard visibility and the raised button's edge taps.

Run `npm run check` and regenerate registration with `npm run storybook:generate`
when stories change. Report device observations separately; static checks and
registration do not establish native interaction or appearance.
