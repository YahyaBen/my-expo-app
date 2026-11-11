# Application architecture

The template has a native dock, a modal component menu, app-facing
component pages. All build variants start at the Template page through `/`.
Its center action opens
the shared native modal sheet with a translated empty state and Close action.
The menu presenter stays mounted after its first open so native dismissal can finish.
Component IDs/icons belong to `src/features/template/component-catalog.ts`;
translated names belong to the locales.
Unknown URLs use the existing not-found fallback.

The Components tab lists categories. Each category opens
`/components/category/[id]` with its own component list; selecting a component
keeps the existing `/components/[id]` destination. Category membership and icons
share the component catalog owner, with names and counts translated in all app
languages. Native Back returns from a demo to its category, then to the tab.

Settings remains a retained dock tab. First-level routes enter right to left in
LTR and left to right in RTL. Routes pushed two or more levels above the template
shell slide up from the bottom; for example, Components → Controls → Checkbox.
Depth is counted in the route's owning navigator below Router's wrapper stack.
The Button demo uses a native page modal: `pageSheet` on iOS and
`fullScreenModal` on Android, keeping Android's page scroll outside a draggable
sheet. Reduced motion disables stack animations; Back reverses the destination's
transition. The existing `index` anchor keeps a base screen behind deep-linked modals.

Home's [date and time banner](../src/features/home/date-time-banner.tsx) belongs to
the feature's scrollable content, inside its first `PageSection`. It shows the local
date and 24-hour time in the app language, refreshing each minute while visible and
active. Shared page components retain ownership of the default rectangular blurred
header and Back.

| Responsibility                          | Owner                                                                           |
| --------------------------------------- | ------------------------------------------------------------------------------- |
| Routes and native stack                 | `src/app/`                                                                      |
| Template shell and component pages      | `src/features/template/`                                                        |
| App settings and native device controls | `src/features/settings/`                                                        |
| Shared native presentation              | `src/components/ui/`                                                            |
| Preferences, language and direction     | Existing contexts, hooks and storage owners                                     |
| Optional auth/form workflow kit         | `src/features/auth/`, `src/context/auth.context.tsx`, `src/guards/`             |
| Entity data access                      | `src/services/<entity>/<entity>.repository.ts`                                  |
| HTTP, queries and session lifecycle     | `src/services/`, `src/lib/api-query-keys.ts`                                    |
| Validation and DTOs                     | `src/validation/`, `src/types/`                                                 |
| Build-time identity                     | `config/brand.js`, `config/brands/`, `app.config.js`                            |
| Public brand/asset metadata             | `src/config/brand.ts`, `src/config/brand-assets.ts`, `config/brand-assets.json` |

## Startup

The root restores fonts, appearance, motion preferences, language and device
feature preferences. It waits for the initial usable page layout before completing
the configured minimal/branded launch. `app-ready` follows resource readiness,
layout and overlay exit. Readiness does not wait for an auth session, backend,
permission response or store-update check. Reduced motion and activity state
remain shared native capabilities. Native stack transitions use the existing
platform options.

After launch, the root requests notification permission on iOS and Android while
the app is active. It asks once per app session only when permission is undetermined;
previous grants or denials do not prompt or open device settings. Android creates
the notification channel before requesting permission.
Android builds with push configured also set Expo's notification presentation
handler after launch without fetching a token. Settings reads a
selectable Expo push token while visible after notification permission is granted.
The app uses `expo-notifications` and Expo Push Service; Expo manages the native
transport and device-token mapping. Development Android installs also join the
`all-testing-et` topic through Expo's topic API after OS permission is granted, on
launch/resume and during Settings registration. The launch attempt waits for the
permission request to finish. No custom messaging service, receiver or
JavaScript background task is configured. Template loads Settings
when its tab first opens, keeping device helpers out of Home module evaluation.
Discover shows offline editorial content. Component search lives in the
Components tab. The center component menu uses the shared native modal sheet.
Retained tab activities keep drafts and selection while cleaning
up hidden effects. Settings reads permission state while visible, and requests
OS access or a one-shot location only after the matching action.

Optional auth/query/service helpers are retained for future features and are not
mounted by the starter. A consuming auth flow supplies its own verification
navigation callback. Add providers only when building an actual backend feature.
Shared UI receives data and callbacks, and never imports services or fixtures.

Feature workflows and query options call a feature-specific repository. The
repository exposes typed data operations through the existing HTTP client;
TanStack Query owns cache state and the auth lifecycle owns session state.
`authRepository` is the current implementation. Repository contracts are colocated
with their implementation; new entities add only their supported operations.
See [repository boundaries](api-services.md#repository-boundaries).

## Enforced import boundaries

`eslint.config.js` composes scoped policies with `restrictImports`; flat-config
rule replacement must preserve the shared restrictions.

- Routes/features consume the public `@components/ui` API and do not own raw HTTP,
  secure storage or query transport configuration.
- Services do not depend on feature presentation, UI components or UI contexts.
- Entity repositories do not own React rendering, navigation, cache policy or native storage.
- Schemas, DTOs, mappers and query keys remain pure.
- UI implementations import concrete siblings, avoiding their own public barrel.
- Auth refresh keeps its raw transport independent of authenticated interceptors and the auth repository.

App-facing component pages use public UI directly. Verify both native graphs
after entry/Metro changes to keep developer tooling out of releases.

## Brand and services

The Node brand resolver validates assets and native references; app modules read
only its public projection. Static asset registries keep Metro imports literal.
The root palette comes from the manifest; preview theme providers are isolated.
Language/device switches in Settings persist actual settings.

API helpers retain validated contracts, request cancellation, secure session
storage, generation guards, token rotation and cache maintenance. Backend URLs
are optional for the starter. Do not bypass those owners when adding real features.
See [API services](api-services.md), [auth kit](auth-forms.md),
[appearance](appearance-themes.md) and [brand setup](development.md#brand-and-environment-configuration).
