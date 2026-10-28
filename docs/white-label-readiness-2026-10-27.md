# White-label readiness review — 2026-10-27

Follow-up: the [2026-10-28 implementation report](white-label-implementation-2026-10-28.md)
records the clean npm installation, individual pushed fixes and the remaining
P1/P2 work. This review retains its original audit context.

## Decision

The project has a credible shared mobile foundation, but it is not yet a
complete client application with working push notifications and proven backend
delivery. Keep its existing architecture. The remaining work is concentrated in
real integration contracts, client release configuration and native operation;
another repository layer, dependency-injection framework or folder reorganization
would not close those gaps.

This review covered architecture, authentication, HTTP and remote state,
notifications, native permissions, branding, builds, startup, localization,
accessibility and code maintenance. It includes focused source/configuration
fixes. No automated tests were created or run, as requested. Native-device and
live-backend execution were not performed.

The inventory contains 221 application TypeScript implementation files and
15,850 lines before these edits, plus 22 declarations/JSON files under `src`.
The installed baseline is Expo 58.0.19, React Native 0.88.0, React 19.3.0,
Expo UI 58.0.23 and Expo Router 58.0.26. Counts exclude native projects,
dependencies and Storybook sources outside `src`.

Priority means implementation order, not a certification: P1 blocks the stated
capability or release configuration; P2 is a correctness/maintenance issue;
P3 is optional follow-up. A missing starter capability is distinguished from a
defect in an implemented feature.

## Changes completed in this review

| Priority | Finding and concrete consequence                                                                                                                                                             | Change                                                                                                                                                                                                      |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1       | CI used `npm ci`, but the only lockfile was Yarn v1. A clean npm checkout could not follow the documented install path. Yarn also ignored the declared npm overrides.                        | Added canonical `package-lock.json`, removed `yarn.lock`, and clarified npm ownership. Existing direct dependency versions and the Skia alias are preserved; declared overrides now appear in the npm lock. |
| P1       | Explicit production configuration accepted a cleartext API origin. Credentials could be sent over HTTP if such an origin was supplied.                                                       | `config/brand.js` requires HTTPS for `APP_VARIANT=production`; local development can still use HTTP.                                                                                                        |
| P1       | A production config could explicitly enable developer catalog routes.                                                                                                                        | `config/brand.js` rejects enabled catalog/Storybook flags in production. Existing production EAS flags remain disabled.                                                                                     |
| P1       | Android Firebase dependencies initialize natively even without a JS push feature. Their default initialization could create notification identifiers before a client integration was chosen. | New `firebase.json` disables default app data collection and Messaging auto-initialization. Packages remain installed.                                                                                      |
| P2       | Authenticated failures other than 401 were not checked for session ownership. An old account's network/500 error could reach feedback after an account switch.                               | `src/services/api.ts` checks the request generation on every authenticated failure.                                                                                                                         |
| P2       | Obsolete login/OTP requests could report failures after leaving a form; obsolete successful requests could resolve as successful submissions.                                                | `src/features/auth/auth-flow.context.tsx` rejects stale success/failure with `SessionChangedError`, which shared feedback already suppresses.                                                               |
| P2       | Raw refresh responses used stored-session normalization, which intentionally accepts legacy frontend records.                                                                                | `src/services/auth/auth.refresh.ts` validates the actual refresh wire response with `tokenResponseSchema` before persistence. Malformed responses produce payload-free validation errors.                   |
| P2       | A remounted language provider could read before a pending preference write finished, restoring an older language and direction.                                                              | `src/context/language.context.tsx` waits for the existing persistence queue before restoration.                                                                                                             |
| P2       | Dormant native packages contributed camera, microphone, location and storage/media permissions although no application callers exist.                                                        | `app.json` blocks nine unused Android permissions. Required capabilities must be deliberately restored alongside a real feature.                                                                            |
| P2       | The only development iOS EAS target was a simulator.                                                                                                                                         | Added `development-device`, inheriting the same development configuration with `ios.simulator: false`. Signing and a new build are still required.                                                          |
| P2       | `.env.example` contained PowerShell assignments and a build command as raw dotenv content.                                                                                                   | Removed the commands and corrected the Storybook script comment.                                                                                                                                            |

The native permission/Firebase defaults need newly built binaries. Existing
installed clients retain their compiled permissions and initialization behavior.
See the maintained [integration guidance](eas-development-builds.md#integration-readiness).

## Architecture and clean code

The current dependency direction is appropriate:

```text
Expo Router route / access guard
  -> feature screen and local workflow
     -> query/mutation policy
        -> endpoint -> shared transport -> validated response
     -> shared native UI receiving props and callbacks

Build-time brand -> public presentation metadata -> existing providers/UI
```

| Area                   | Assessment                                        | Source and next action                                                                                                                                                                                                                                          |
| ---------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route ownership        | Healthy                                           | Thin files under `src/app/` compose features. `src/guards/auth-guards.ts` uses actual session state. Keep backend authorization authoritative.                                                                                                                  |
| Service boundaries     | Healthy                                           | Endpoint modules, query policy and schemas are separate. Preserve the independent refresh transport and avoid another HTTP client family.                                                                                                                       |
| Shared native UI       | Healthy with native limitations                   | `src/components/ui/index.ts` is the public API. Platform adapters own SwiftUI/Compose differences; features retain workflow decisions.                                                                                                                          |
| Import enforcement     | Useful but bounded                                | `eslint.config.js` composes restrictions for routes, screens, transport, schemas and UI. It checks selected static syntax/scopes, not every runtime import or side effect.                                                                                      |
| Dependency cycles      | No cycle found in the inspected static graph      | An AST inventory resolved static imports/re-exports with the existing tsconfig and found no strongly connected group. Dynamic `require`/imports and full native/platform graphs are outside that observation.                                                   |
| Large files            | Targeted maintenance only                         | The largest runtime owners are OTP sheet (528 lines), photo grid (412), transport (402) and Settings (323). Size alone does not justify extraction; split only when a new independent responsibility appears. The largest file overall is a developer showcase. |
| Code hygiene           | No broad suppression problem found                | Source searches found no `@ts-ignore`/`@ts-expect-error`, explicit `any` escape hatch or application `console` logging. This is a source inventory, not proof of runtime correctness.                                                                           |
| Public starter content | Client work remains                               | Home includes interactive demonstrations and third-party Picsum images. Search/My Recipes use 24 local examples; the center sheet uses 100 illustrative journeys. Decide client content and media ownership before delivery.                                    |
| Documentation          | Mostly clear ownership; historical volume remains | Current guides and component skills have defined owners. The index already identifies 25 older cleanup candidates; retain useful observations before consolidation. This review does not delete that evidence.                                                  |

The public Home gallery is independent of the opt-in developer catalog. Its
four-digit local `1111` demonstration is not the six-digit backend OTP flow.
Disabling developer routes therefore does not produce a finished client Home.
This review preserves those intentional examples and documents the distinction.

## Authentication, services and remote state

Existing strengths should remain intact:

- `auth.session.ts` serializes secure storage, validates stored sessions and
  tracks account generations. Passwords and entered verification codes are not
  persisted.
- `auth.refresh.ts` coalesces token rotation and uses its own interceptor-free
  client. Temporary network failures preserve the session; recognized invalid
  sessions trigger cleanup. Refresh wire validation is now explicit.
- `auth.lifecycle.ts` waits for local deletion/cache cleanup, then performs
  bounded best-effort revocation with captured credentials. A late revoke cannot
  borrow another account's token.
- `api.ts` centralizes request metadata, safe errors, response validation and a
  bounded unauthorized retry. Reads propagate cancellation; responses and now
  failures retain session ownership.
- `query-utils.ts` separates finite/infinite keys, uses `skipToken` for missing
  identifiers and bounds pagination. Mutation helpers retain cache maintenance
  before consumer callbacks.
- `session-mutation.ts` disables automatic write replay/retries and checks
  account ownership before applying results. `query-provider.tsx` connects
  native focus/reconnect state and cleans up subscriptions.

Remaining service integration work:

| Priority                | Gap                                         | Required decision/work                                                                                                                                                                                            |
| ----------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1 for recovery         | Recovery delivery is unspecified            | `forgotPassword` returns a message; reset needs a UUID `challengeId` and code. Confirm the actual email/deep-link payload and expiry behavior with the backend. No delivery URL or endpoint was invented.         |
| P1 for each new backend | Identity wire contract is provider-specific | `src/types/auth.types.ts`, auth schemas and endpoints still implement Foodiya.Identity. Changing the origin does not adapt another client's authentication API. Map a supplied contract in these existing owners. |
| P1 for push             | No device-token write contract              | An installation UUID and device/session DTOs do not register a push token. Define token association, replacement and removal before implementing the feature.                                                     |
| P2 for product features | Entity operations are intentionally absent  | Existing generic helpers are ready to reuse. Add only endpoints and response schemas supported by the client's backend; the sample recipes/journeys are not remote entities.                                      |
| Conditional             | Google sign-in is not a completed flow      | A request type/endpoint exists, but there is no native identity-provider UI/token acquisition integration. Implement only if required by the client.                                                              |
| P2                      | No live auth evidence from this review      | Restoration, rotation, revocation, verification and recovery delivery still need actual backend/native evidence. Static inspection cannot establish server behavior.                                              |

Public route guards and frontend roles do not grant server authorization. Each
backend must enforce account ownership on every protected operation. The current
frontend deliberately does not introduce runtime tenant switching.

## Push notifications

Push is **not implemented**. There are installed Expo Notifications and Firebase
Messaging packages, but there are no notification/Firebase imports under `src`.
There is no permission request, channel setup, token acquisition, token listener,
server registration, foreground policy, background-message owner or tap router.
iOS currently excludes Firebase from autolinking; no notification plugin is
configured. The new inert Firebase defaults do not implement push.

Use one documented owner for notification presentation and taps. Choose the
transport with the backend team before enabling native initialization:

| Transport choice  | Contract/configuration needed                                                                                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Expo Push Service | Expo project identity, each client's APNs/FCM credentials, Expo token association endpoint, delivery receipts and invalid-token handling.                                                        |
| Direct APNs/FCM   | Platform token registration and server delivery credentials, provider-specific token rotation and invalid-token feedback. RNFirebase on iOS additionally requires deliberate native integration. |

Do not let Expo Notifications and Firebase independently present the same remote
message. A future implementation should give these responsibilities explicit
owners within the current architecture:

| Responsibility                 | Proposed owner and behavior                                                                                                                                                                              |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Native capabilities            | Shared config + selected brand's credentials; rebuild after changing native configuration.                                                                                                               |
| Permission consent             | Feature/UI action explaining value, denied-state recovery and Android channel ordering using the installed SDK APIs. No prompt during generic starter hydration.                                         |
| Token lifecycle                | Service-owned acquisition/rotation and cancellation; persist only what the agreed contract requires. Re-enable Firebase initialization only if chosen.                                                   |
| Server association             | Validated service operation scoped to installation and current account, with session generation checks. Define how an old account is detached while credentials still exist.                             |
| Offline/logout behavior        | Explicit retry/detachment policy with the backend; local token caching alone cannot guarantee removal from an old server account.                                                                        |
| Foreground/background delivery | One notification policy, deduplicated IDs and correctly registered listeners/cleanup. Register any background handler at its required entry point.                                                       |
| Tap routing                    | Validate a small versioned payload schema and allowlisted route/entity IDs. Wait for session restoration and enforce auth before protected navigation. Do not open arbitrary payload URLs as app routes. |
| Cold start and duplicates      | Consume initial and live responses through the same handler, process each event once and clear consumed state as supported.                                                                              |
| Sender operations              | Server-side credentials, expiry, invalid-token removal and receipt/failure handling. Never embed sender credentials in public Expo variables.                                                            |

The backend must supply at least: token kind, platform, installation identifier,
account association rules, registration/replacement/removal operations, notification
payload version and logout semantics. Endpoint names and bodies remain undecided.

Official references: [SDK 58 Notifications](https://docs.expo.dev/versions/v58.0.0/sdk/notifications/),
[push setup](https://docs.expo.dev/push-notifications/push-notifications-setup/) and
[Firebase auto-initialization](https://rnfirebase.io/messaging/usage#auto-initialization).

## Brands, native builds and delivery

| Area                   | Current state                                                                                                                               | Remaining work                                                                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brand identity         | `config/brands/` selects app name, scheme, IDs, assets and EAS/Firebase references; resolver validates assets and Firebase package mapping. | Register a client's manifest and provide its real assets, native identity and cloud references.                                                                                                |
| Neutral template       | Unlinked `com.example.mobiletemplate`, placeholder artwork, minimal launch.                                                                 | It is a local starting point; production requires explicit brand/API/EAS configuration.                                                                                                        |
| Likan                  | Own native identity and EAS project; Default header and branded launch.                                                                     | Supply the real environment and client-owned release metadata/credentials.                                                                                                                     |
| Variant isolation      | Development/preview/production intentionally share each brand's application identity.                                                       | They replace one another on a device. If concurrent installs are needed, define separate IDs, schemes and Firebase mappings deliberately.                                                      |
| Environment validation | Production now requires HTTPS, explicit brand/EAS references and disabled developer flags.                                                  | Continue to supply `APP_VARIANT` explicitly in release commands. It is intentionally independent of `NODE_ENV`; a production JS export is not automatically a production client configuration. |
| Native permissions     | Dormant Android sensitive permissions blocked; notification permission retained.                                                            | Re-enable only the permissions used by an implemented feature. iOS still has library-contributed purpose strings, which alone do not request access.                                           |
| Physical development   | Added signed-device profile; existing simulator profile retained.                                                                           | Enroll/sign the intended device and build when implementing native integrations. No build was started here.                                                                                    |
| Store updates          | Existing Android Play update hook defers until startup and checks native availability.                                                      | This is a Play binary update path; it does not configure iOS delivery or OTA.                                                                                                                  |
| OTA                    | `expo-updates` is installed, but update URL, runtime policy and channels are absent.                                                        | Optional until OTA is needed. Configure client-isolated projects/channels and native compatibility before publishing any update.                                                               |
| Submission             | Existing EAS profiles select Likan; submit config has no hardcoded App Store app ID.                                                        | Explicitly resolve each client's project/account, signing, store listing and release metadata before submission.                                                                               |

Public environment values and Expo extras are shipped to the application.
Keep backend sender secrets and signing material in their existing server/build
credential systems. The brand resolver is build-time code; native presentation
reads its public projection rather than importing the Node filesystem resolver.

## Startup, performance, accessibility and operations

Startup already separates fonts, preferences, session restoration, first layout
and reveal. Restoration failure exposes recovery instead of falsely declaring
the app ready. Optional fonts fall back to native typography. Shared motion
subscriptions include focus/background/Reduce Motion handling; preference writes
are queued. This review found no basis for a broad provider/memoization rewrite.

The destination sheet uses a bounded FlashList with stable IDs and a native Host
height floor. The small 24-row examples use regular native layout. A real feed
needs a decision based on its own row count, images and native cell cost.
The interactive Home gallery and remote demo images may be a meaningful workload,
but source size/render counts do not establish a frame-rate regression.

French, English and Arabic each contain 761 leaf translation keys with matching
key sets and interpolation placeholders. This establishes dictionary parity,
not translation quality or VoiceOver/TalkBack output. Existing selectors, RTL
context, keyboard boundaries and Reduce Motion are useful foundations. Native
disabled-input semantics and disclosure selectors retain the upstream limitations
recorded in their component skills.

Observe startup instrumentation exists in `src/lib/performance.ts`, including
recovery milestones, guarded native loading and filtering of sensitive auth route
parameters. It is not evidence of configured client dashboards, crash handling,
alert ownership, data retention or a performance baseline. Decide those operational
owners for each client. Support/privacy destination labels exist in translations,
but a finished client's real destinations/account lifecycle require product and
backend contracts; this review does not fabricate them.

No current startup-duration, frame-rate, memory or battery improvement is claimed.
Historical Android build successes in the EAS guide predate this review's native
configuration changes and do not validate the new binary behavior.

## Ordered implementation backlog

1. **Adopt the canonical dependency tree.** Use `npm ci` from the new lockfile in
   the clean build environment. Preserve the explicit overrides and native alias.
   Ensure the hosted quality job completes with that tree.
2. **Close backend contract gaps.** Confirm client Identity compatibility,
   recovery link/challenge delivery, device-token lifecycle and any actual product
   endpoints. Keep response validation and ownership in the current service layer.
3. **Implement push as one feature.** Choose transport, configure each client's
   credentials, add the validated backend operations, then compose consent,
   lifecycle and guarded tap routing. Enable native initialization deliberately.
4. **Finish the client surface.** Replace or explicitly accept public demo content,
   third-party media, tab labels and client support/account destinations. Decide
   whether installed variants may overwrite one another.
5. **Produce current native evidence.** New binaries are needed for changed
   permissions/Firebase metadata. Record the actual device/build/environment when
   validating native behavior and performance; no such execution was requested here.
6. **Add OTA only when needed.** Define project/channel isolation and runtime
   compatibility before publishing. Installed packages alone are not delivery setup.
7. **Consolidate guidance after integration.** Keep one maintained owner per
   topic, update this dated review's successor and retain useful historical evidence.

## Verification record

Static verification results are recorded below. Native-device execution,
live-backend requests, push delivery,
fresh cloud builds and hosted CI execution remain outside this review.

- Tests: none added or run.
- Native configuration: both brand identities resolved; Android introspection
  includes removal directives for the nine blocked permissions. No merged native
  binary was built.
- Dependency metadata: root lock dependencies match the manifest; direct locked
  versions match the existing installed versions; declared npm overrides resolve
  as intended. The three initially missing Storybook distribution records were
  completed from official npm metadata. No direct dependency was removed.
- Clean installation: npm CI dry-run passed. Package-lock generation and dry-run
  did not install the new override tree into the current Yarn-created modules;
  a full clean install and hosted CI execution remain pending.
- Lint: `npm run lint` passed with zero warnings.
- Typecheck: `npm run typecheck` passed.
- Formatting: `npm run format:check` passed across maintained files.
- Whitespace: `git diff --check` passed. Edited documentation links resolve.

See [architecture](architecture.md), [API services](api-services.md),
[development](development.md) and [integration readiness](eas-development-builds.md#integration-readiness)
for maintained implementation guidance.
