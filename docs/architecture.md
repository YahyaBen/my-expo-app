# Application architecture

This template uses feature folders and shared native UI. Routes select screens;
features compose presentation and coordinate work; repositories own remote
operations. Add a layer only when the feature needs its responsibility.

## Folder map

| Folder                 | Responsibility and boundary                                                                                                      |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/`             | Expo Router routes, layouts and provider placement. Keep reusable screens outside this folder.                                   |
| `src/features/`        | Screens, feature hooks, drafts and workflows. Keep private examples and data with their feature.                                 |
| `src/components/ui/`   | Public native presentation, family-local helpers and iOS/Android adapters. Receive values and callbacks.                         |
| `src/constants/`       | Theme palettes, semantic/derived tokens, geometry and navigation policy.                                                         |
| `src/context/`         | Existing app preferences, language/direction, readiness and auth/query provider boundaries.                                      |
| `src/hooks/`           | Shared rendering and native lifecycle hooks; feature-only hooks stay with their feature.                                         |
| `src/services/`        | Validated HTTP, entity repositories, auth/session lifecycle and store-update adapters.                                           |
| `src/validation/`      | Pure runtime schemas and form resolver definitions.                                                                              |
| `src/types/`           | Shared contracts and asset declarations; infer wire DTOs from response schemas.                                                  |
| `src/lib/`             | Named capabilities: query client, permissions/preferences, notifications, haptics, alerts, localization, insets and performance. |
| `src/config/`          | Validated public brand metadata and literal native asset registries. Never import Node configuration here.                       |
| `src/guards/`          | Pure route-access decisions consumed by auth layouts/screens.                                                                    |
| `src/shared/locales/`  | In-app translation dictionaries registered in `src/lib/i18n.ts`.                                                                 |
| `config/`              | Build-time identity, variant validation, public projection, asset metadata, permission translations and config plugins.          |
| `scripts/`             | Local startup and Android build commands; developer tooling stays outside app startup.                                           |
| `assets/`              | Bundled icons, fonts, artwork and sample media; Metro references remain literal.                                                 |
| `docs/`                | Maintained setup, ownership and operations guides. Component contracts belong in their skills.                                   |
| `.agents/skills/`      | Focused project workflows and component contracts, discoverable through `docs/skills.md`.                                        |
| `.codex/`              | Project agent definitions and client settings; no app runtime code.                                                              |
| `.github/`, `.husky/`  | Static CI checks and local commit tooling; no automated test suite.                                                              |
| `.vscode/`, `.claude/` | Editor and agent settings; no app runtime ownership.                                                                             |

`android/`, `ios/`, `.expo/`, `node_modules/`, `graphify-out/` and local analysis
caches are generated or local tool output. Configure native behavior through app
configuration and plugins rather than editing generated projects.
Root `index.html` is the standalone privacy policy, not an Expo web entry point.
Keep the Firebase JSON and plist files used for native service configuration.

## Configuration and extension

- Change app identity, variant URLs/credentials and presentation defaults in
  `config/app.js`. `config/brand.js` validates them; `app.config.js` projects native
  configuration and public metadata. Keep credentials that must remain secret
  outside public app configuration.
- Change colors in `src/constants/themes/ux.ts`, derived roles in `tokens.ts`,
  typography/shape in `design.ts` and shared spacing/radii in `src/constants/layout.ts`.
  `system` intentionally leaves native colors unset. Preferences select values;
  they do not define another token system.
- Add a screen under its feature and a thin route under `src/app/`. Keep drafts
  local, forms in React Hook Form and consumed server state in TanStack Query.
  Add a repository operation only after confirming its backend contract; add
  query/mutation coordination only when needed.
- Extend an existing UI family through `@components/ui`. Keep common behavior
  shared and real SwiftUI/Compose differences in platform adapters, with matching
  declaration signatures. Update the existing native example and owning skill.
- Keep local demo data in `src/features/`; shared UI does not import fixtures.
  Preserve installed packages and native service files when adapting the template.

Use the [skill index](skills.md) for component contracts and
[documentation ownership](documentation.md) when changing guidance. Static checks
are lint, typecheck and formatting; native interactions and backend contracts
require separate verification.

## Template navigation

The template opens Discover at `/` with its native Home, Components and Settings
tabs. Components → App flows includes public Login and Register examples at
`/components/login` and `/components/register`. `/template` redirects to `/`.
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

The `(auth)` route group mounts the existing query, session and auth-flow
providers when an authentication example is opened. Discover, Home and the
ordinary catalog do not wait for session restoration. The auth group's native
loading/retry view preserves its incoming destination and parameters until auth
is known, including after storage-error retries.
Google native code loads after its explicit button action. The auth flow
uses the existing backend contract and routes email challenges to `/verify-email`.
Login and Register remain public examples even with a saved session. Successful
authentication opens the separate `/account` placeholder; only that destination
requires a valid backend session.
See [authentication setup](auth-forms.md).
Shared UI receives data and callbacks, and never imports services or fixtures.

Feature workflows and consumed query options call a feature-specific repository. The
repository exposes typed data operations through the existing HTTP client;
TanStack Query owns cache state and the auth lifecycle owns session state.
`authRepository` is the current implementation. Repository contracts are colocated
with their implementation; new entities add only their supported operations.
See [repository boundaries](api-services.md#repository-boundaries).

## Enforced import boundaries

`eslint.config.js` composes scoped policies with `restrictImports`; flat-config
rule replacement must preserve the shared restrictions.

- Routes/features consume the public `@components/ui` API. Routes and screen
  files cannot import raw HTTP or persisted storage; feature workflows retain
  their existing session/repository coordination owners.
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
See [API services](api-services.md), [authentication setup](auth-forms.md),
[appearance](appearance-themes.md) and [brand setup](development.md#brand-and-environment-configuration).
