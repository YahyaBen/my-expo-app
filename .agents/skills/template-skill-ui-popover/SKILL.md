---
name: template-skill-ui-popover
description: Compose themed, anchored native popovers and grouped action dropdowns.
---

# Popover and dropdown menu

Import `Popover` and `PopoverProps` from `@components/ui` inside an existing Host.
Source: [popover/](../../../src/components/ui/popover/).

- Supply isPresented, onIsPresentedChange, a native trigger control and native
  children. The trigger's action sets the caller's presentation state to true.
- Both overlays use the same theme surface, border and corner radius. iOS uses
  SwiftUI Popover with compact adaptation and the system arrow. Android uses an
  anchored Compose popup with a Material Surface.
- Native outside dismissal reports false. Android Back also dismisses. Keep
  controlled state in sync; a close action in the content sets it to false.
- Trigger disabled state and accessible name belong to the supplied control.
  This wrapper does not add another press target or open itself automatically.
- Set `width` when the content needs a fixed panel width. `scrollable` keeps
  taller content reachable. Reuse the current Host and prefer a sheet for long forms.
- testID addresses the anchor wrapper; presented content appends -content.
  Give trigger and content actions their own stable selectors.

Use `DropdownMenu` for grouped actions. It accepts the same presentation and
trigger props as `Popover`, plus `sections` and `onSelect`. Sections may have a
heading. Each action has a stable, menu-wide unique ID and may have a visual
shortcut hint, an explicit `testID`, or a disabled state. A group expands its
child actions inline. Selecting an enabled action requests dismissal and passes
its ID to `onSelect`.

Use the [catalog examples](../../../src/features/template/overlay-examples.tsx)
to verify selection, submenu behavior, outside and Back dismissal, focus, large
text, RTL, edge positioning and light/dark appearance on both platforms.
