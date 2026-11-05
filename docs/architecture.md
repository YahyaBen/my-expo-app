# Application architecture

The template has a native dock, an on-demand circular component menu, app-facing
component pages and a development-only Storybook entry.
`/` redirects to `/storybook` in development unless explicitly disabled.
`/?preview=true` lets transition stories push the real wireframe and return using
native Back. Preview/production start at the Template page. Its center action opens
the component menu; dragging reveals the centered page name in a non-blocking
native callout and updates it during the swipe. The name panel remains mounted
while the menu is open, and its local state updates independently of the carousel.
Tapping explicitly pushes `/components/[id]`. The menu closes
before navigation, on outside taps and on Android Back. Component IDs/icons belong
to `src/features/template/component-catalog.ts`; translated names belong to the locales.
Unknown URLs use the existing not-found fallback.

| Responsibility                          | Owner                                                                           |
| --------------------------------------- | ------------------------------------------------------------------------------- |
| Routes and native stack                 | `src/app/`                                                                      |
| Template shell and component pages      | `src/features/template/`                                                        |
| App settings and native device controls | `src/features/settings/`                                                        |
| Development entry and flag              | `src/features/storybook/`, `src/config/developer-tools.ts`                      |
| Stories and demonstration compositions  | `.rnstorybook/`                                                                 |
| Shared native presentation              | `src/components/ui/`                                                            |
| Preferences, language and direction     | Existing contexts, hooks and storage owners                                     |
| Optional auth/form workflow kit         | `src/features/auth/`, `src/context/auth.context.tsx`, `src/guards/`             |
| Entity data access                      | `src/services/<entity>/<entity>.repository.ts`                                  |
| HTTP, queries and session lifecycle     | `src/services/`, `src/lib/api-query-keys.ts`                                    |
| Validation and DTOs                     | `src/validation/`, `src/types/`                                                 |
| Build-time identity                     | `config/brand.js`, `config/brands/`, `app.config.js`                            |
| Public brand/asset metadata             | `src/config/brand.ts`, `src/config/brand-assets.ts`, `config/brand-assets.json` |

## Startup

The root restores fonts, appearance, header/motion preferences, language and device
feature preferences. It waits for the initial usable page layout before completing
the configured minimal/branded launch. `app-ready` follows resource readiness,
layout and overlay exit. It does not restore an auth session, contact a backend,
request permissions or check store updates. Reduced motion and activity state
remain shared native capabilities. Native stack transitions use the existing
platform options.

Notification presentation is configured by Storybook. Template loads its Settings
and map features when their tabs first open, keeping native maps and device helpers
out of Home module evaluation. Search shows a native map with local sample places;
its embedded sheet stays below the existing dock. Component search lives in the
Components tab. On Search, the center component menu also uses an inline sheet,
keeps the map/search controls visible and temporarily replaces the places sheet.
Retained tab activities keep drafts and selection while cleaning
up hidden effects. Settings reads permission state while visible, and requests
OS access or a one-shot location only after the matching action. The same feature
serves the Preferences story under its isolated appearance provider.
The map reuses that location owner for explicit recenter requests and displays a
static position marker without subscribing to continuous location updates.

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
- Schemas, DTOs, mappers, query keys and preview flags remain pure.
- UI implementations import concrete siblings, avoiding their own public barrel.
- Auth refresh keeps its raw transport independent of authenticated interceptors and the auth repository.
- Storybook imports stay in `.rnstorybook/` and its narrow feature entry. Native
  control restrictions cover both stories and supporting preview compositions.

Storybook compositions and fixtures remain behind the development boundary.
App-facing component pages use public UI directly, without importing Storybook.
The runtime guard, Metro integration and conditional registration import keep
developer tooling out of releases. Verify both native graphs after entry/Metro changes; see
[the catalog boundary](storybook.md#release-boundary).

## Brand and services

The Node brand resolver validates assets and native references; app modules read
only its public projection. Static asset registries keep Metro imports literal.
The root palette comes from the manifest; preview theme providers are isolated.
Language/device switches in the Preferences story can persist actual settings.

API helpers retain validated contracts, request cancellation, secure session
storage, generation guards, token rotation and cache maintenance. Backend URLs
are optional for the starter. Do not bypass those owners when adding real features.
See [API services](api-services.md), [auth kit](auth-forms.md),
[appearance](appearance-themes.md) and [brand setup](development.md#brand-and-environment-configuration).
