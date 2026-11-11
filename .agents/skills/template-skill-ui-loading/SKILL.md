---
name: template-skill-ui-loading
description: Present loading, query results and retry states while preserving cached content.
---

# Loading and recovery

Import `LoadingContent`, `LoadingScreen`, `QueryContent`, `ContentQuery`
and `ScreenError` from `@components/ui`. Import `EmptyState`, `EmptyStateProps` and
`EmptyStateAction` for resolved empty pages and lists.
Source: [loading/](../../../src/components/ui/loading/).

## State ownership

- Use `LoadingContent` inside an existing Host and `LoadingScreen` at a
  route/Suspense boundary. `ScreenError` presents route-error recovery.
- Keep Hosts unpadded. Loading puts device insets in its native content group;
  recovery reuses the shared page's scrolling and inset ownership.
- Keep queries, prerequisites and retry work in the feature.
- A disabled query waits for prerequisites; a paused query waits for connectivity.
  Neither is active loading.
- Preserve cached content during refresh and refresh failure.
- Show persistent errors with retry. Disable retry while fetching, prerequisite
  disabled or paused offline.
- Render `EmptyState` after data resolves and the caller marks it empty.
  `emptyMessage` overrides its default title; `emptyState` replaces the presentation
  with feature-specific content while preserving query state selection.
- Native progress rendering belongs in the existing iOS/Android adapters;
  shared state selection belongs in `loading-state.tsx`.

## Empty pages and lists

- Compose `EmptyState` in the existing Host and scroll/list owner. It adds no
  Host, navigation, data writes or loading work.
- Supply a translated `title`, optional `description` and typed `icon`; the
  default is a folder. The centered layout uses semantic light/dark colors.
- Optional `primaryAction`, `secondaryAction` and `footerAction` receive a label,
  callback, disabled state, accessible name and stable selector. Set the footer's
  `external` flag only when its arrow is appropriate. Actions belong to the caller.
- Paired actions stack on narrow screens, at large text sizes or for long labels.
  Content can grow beyond its centered minimum height inside the owning scroller.
- Root `testID` defaults to `empty-state`; descendants append `-title`,
  `-description`, `-primary`, `-secondary` and `-footer`. Use `titleTestID` and
  action `testID` overrides to preserve existing selectors during adoption.
- Check paired actions, no actions, search results and dark appearance.
  Verify RTL, large text, touch bounds and disabled actions
  on matching iOS and Android builds.

## Native indicators

Import `LoadingIndicator`, `LoadingIndicatorProps`, `ProgressIndicator` and
`ProgressIndicatorProps` from `@components/ui` inside an existing Host.

- LoadingIndicator defaults to a circular spinner. Its expressive variant uses
  Material morphing shapes on Android and a SwiftUI spinner on iOS. Existing
  LoadingContent keeps its circular appearance.
- ProgressIndicator defaults to linear. A finite value is clamped to 0 through 1;
  omitted or non-finite values are indeterminate. Linear progress needs a
  constrained parent width. Circular is indeterminate and accepts no value in
  the shared contract; iOS does not offer Android's determinate circular style.
- Both indicators use the Host scheme's theme tint unless color is supplied.
  Supply accessibilityLabel when there is no adjacent descriptive label.
- Native animation needs no JS timer. Mount indicators only while work is active.
  Do not invent elapsed-time completion percentages.

Use the [loading examples](../../../src/features/template/component-screen.tsx)
for native styles, progress updates, completion and explicit tint. Check actual
rendering and accessibility separately on iOS and Android.

## Instance selectors

Give simultaneous `QueryContent` instances distinct stable `testID` prefixes.
Owned nodes append `-error`, `-retry`, `-offline`, `-loading`, `-idle` and `-empty`.
Without a prefix, preserve `query-error`, `query-retry`, `query-offline`,
`query-idle`, `query-empty` and `loading-state`. Selectors must be independent of translations.

Check initial error, cached error, offline/disabled states, pending retry
suppression and independent activation using the
[loading examples](../../../src/features/template/component-screen.tsx).
