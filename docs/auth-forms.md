# Optional authentication kit

The template has no login, registration, recovery or account screens and mounts
no auth provider. Storybook form/OTP examples validate local state without a
backend. Shared auth presentation, schemas, session services and workflow helpers
remain available for a future application.

## Add a real workflow

Configure a reachable `EXPO_PUBLIC_API_URL`, add your Router screens, and mount the
existing query/session providers where needed. `AuthFlowProvider` requires an
`onVerificationRequired` callback; the consuming app owns its verification route.
A changed pathname invalidates pending form responses. The workflow calls
`authRepository` for remote operations and the lifecycle/session owners for
durable session changes.

Use `useAuthForm` for local drafts, schema validation and guarded submissions.
It disables mutation retries and keeps credentials from being queued offline.
Multi-step registration/challenge state stays in `AuthFlowProvider`; small
recovery forms can call `authRepository.forgotPassword` and
`authRepository.resetPassword` through that form helper.
Add actual route protection using the retained auth predicates when introducing
authenticated screens.

`src/services/api.ts` owns bearer metadata, typed API errors and shared token
rotation. `auth.repository.ts` owns the typed remote-operation contract;
`src/services/auth/` retains installation metadata, SecureStore, restoration and
local logout. Tokens are stored together; passwords and
codes are not persisted. Session generations prevent old requests from committing
after account changes. Preserve cancellation, serialized storage and cache cleanup.
See [API/session ownership](api-services.md#session-model-and-logout).

## Native presentation and selectors

Compose `AuthScreenFrame`, `FormTextInput`, `FormSubmit` and the OTP components
through `@components/ui`. Native keyboard/layout behavior belongs to those shared
components. Local Login Form and OTP Storybook fixtures remain available, with
pending/error/visibility examples and stable `native-form-*` selectors.

Preserve component `testID` props and derived suffixes, including field errors,
password actions and alert controls. The root still hosts `AlertHost`; native
message and acknowledgment selectors are `app-alert-message` and
`app-alert-dismiss`. Deleted screen-specific selectors are not part of the
starter's runtime UI.

## Verification

Run lint, typecheck, formatting and story registration. No automated form suite
or test runner is included. Use **Forms/Login Form**, **Forms/OTP**
and **Wireframes/Component Gallery** for native checks. Keyboard, accessibility,
large text, RTL, actual authentication and recovery delivery require matching
iOS/Android builds and a real backend once those features are implemented.
