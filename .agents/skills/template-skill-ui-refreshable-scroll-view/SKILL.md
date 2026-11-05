---
name: template-skill-ui-refreshable-scroll-view
description: Coordinate native pull-to-refresh gestures and release indicators after settlement.
---

# Refreshable scroll view

Import `RefreshableScrollView` and `RefreshableScrollViewProps` from
`@components/ui` inside an existing native Host.
Source: [refreshable-scroll-view/](../../../src/components/ui/refreshable-scroll-view/).

- iOS uses SwiftUI refreshable; Android uses Compose PullToRefreshBox.
- Without an onRefresh callback or when disabled, retain ordinary scrolling.
- The async callback owns work and user-visible error feedback.
- Repeated gestures share the pending promise. Release the native indicator
  on settlement, including rejection, so a later gesture can recover.
- `usePullToRefresh` in `src/hooks/` coalesces pending work. Android supplies
  the spinner state callback. iOS awaits the shared promise.
- For TanStack Query data, call `useScreenRefresh([queryKey])` in the screen and
  pass its result to `PageScreen` or `RefreshableScrollView` as `onRefresh`.
  Use the exact keys for the displayed queries.
- Preserve native indicator colors and disabled/hidden interaction guards.
- Check callback changes during pending work, duplicate gestures, rejection,
  recovery and retained content.

Native gestures, indicator placement and short-content behavior require
verification on iOS and Android.
