---
name: template-skill-ui-popover
description: Compose controlled anchored native popovers and Android popup content.
---

# Popover

Import `Popover` and `PopoverProps` from `@components/ui` inside an existing Host.
Source: [popover/](../../../src/components/ui/popover/).

- Supply isPresented, onIsPresentedChange, a native trigger control and native
  children. The trigger's action sets the caller's presentation state to true.
- iOS uses SwiftUI Popover, including its compact popover adaptation. Android
  uses a Material DropdownMenu popup anchored to the trigger, without an arrow.
- Native outside dismissal reports false. Android Back also dismisses. Keep
  controlled state in sync; a close action in the content sets it to false.
- Trigger disabled state and accessible name belong to the supplied control.
  This wrapper does not add another press target or open itself automatically.
- Bound content width and keep content small enough for the viewport. Use a
  sheet for long forms or substantial scrolling. Reuse the current Host.
- testID addresses the anchor wrapper; presented content appends -content.
  Give trigger and content actions their own stable selectors.

Use [Popover/Playground](../../../.rnstorybook/stories/components/popover.stories.tsx)
for open/close, repeated actions, retained caller state and RTL. Verify outside
and Back dismissal, focus, large text, edge positioning and theme on both devices.
