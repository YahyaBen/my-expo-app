---
name: template-skill-ui-loading
description: Present loading, query results and retry states while preserving cached content.
---

# Loading and recovery

Import `LoadingContent`, `LoadingScreen`, `QueryContent`, `ContentQuery`
and `ScreenError` from `@components/ui`.
Source: [loading/](../../../src/components/ui/loading/).

## State ownership

- Use `LoadingContent` inside an existing Host and `LoadingScreen` at a
  route/Suspense boundary. `ScreenError` presents route-error recovery.
- Keep queries, prerequisites and retry work in the feature.
- A disabled query waits for prerequisites; a paused query waits for connectivity.
  Neither is active loading.
- Preserve cached content during refresh and refresh failure.
- Show persistent errors with retry. Disable retry while fetching, prerequisite
  disabled or paused offline.
- Render an empty message after data resolves and the caller marks it empty.
- Native progress rendering belongs in the existing iOS/Android adapters;
  shared state selection belongs in `loading-state.tsx`.

## Instance selectors

Give simultaneous `QueryContent` instances distinct stable `testID` prefixes.
Owned nodes append `-error`, `-retry`, `-offline`, `-loading` and `-idle`.
Without a prefix, preserve `query-error`, `query-retry`, `query-offline`,
`query-idle` and `loading-state`. Selectors must be independent of translations.

Check initial error, cached error, offline/disabled states, pending retry
suppression and independent activation using the
[Loading showcase](../../../src/features/ui-showcase/loading-screen.tsx).
