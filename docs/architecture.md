# Application architecture

The template has one release wireframe and a development-only Storybook entry.
`/` redirects to `/storybook` in development unless explicitly disabled.
`/?preview=true` lets transition stories push the real wireframe and return using
native Back. Preview/production always show the wireframe. Unknown URLs use the
existing not-found fallback. The old auth, account, tab and showcase routes are gone.

| Responsibility                         | Owner                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------- |
| Routes and native stack                | `src/app/`                                                                      |
| Release wireframe                      | `src/features/template/`                                                        |
| Development entry and flag             | `src/features/storybook/`, `src/config/developer-tools.ts`                      |
| Stories and demonstration compositions | `.rnstorybook/`                                                                 |
| Shared native presentation             | `src/components/ui/`                                                            |
| Preferences, language and direction    | Existing contexts, hooks and storage owners                                     |
| Optional auth/form workflow kit        | `src/features/auth/`, `src/context/auth.context.tsx`, `src/guards/`             |
| Entity data access                     | `src/services/<entity>/<entity>.repository.ts`                                  |
| HTTP, queries and session lifecycle    | `src/services/`, `src/lib/api-query-keys.ts`                                    |
| Validation and DTOs                    | `src/validation/`, `src/types/`                                                 |
| Build-time identity                    | `config/brand.js`, `config/brands/`, `app.config.js`                            |
| Public brand/asset metadata            | `src/config/brand.ts`, `src/config/brand-assets.ts`, `config/brand-assets.json` |

## Startup

The root restores fonts, appearance, header/motion preferences, language and device
feature preferences. It waits for the initial usable page layout before completing
the configured minimal/branded launch. `app-ready` follows resource readiness,
layout and overlay exit. It does not restore an auth session, contact a backend,
request permissions or check store updates. Reduced motion and activity state
remain shared native capabilities. Native stack transitions use the existing
platform options.

Notification presentation is configured by Storybook, which owns the device
examples. The release shell does not load camera/location/notification helpers.

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

Every example formerly mounted as a showcase screen now lives inside Storybook.
The runtime guard, Metro integration and conditional registration import keep it
out of releases. Verify both native graphs after entry/Metro changes; see
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
