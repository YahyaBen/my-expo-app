# Authentication setup

The app opens the public Discover shell at `/`, retaining its Home, Components
and Settings tabs. Components → App flows lists Login and Register at
`/components/login` and `/components/register`, with email/password and Google
options. `/login` and `/register` redirect to those examples; `/template` redirects
to `/`. Browsing does not require a session.

Registration, six-digit email verification, resend, password recovery and reset
use the existing Identity API contract. Successful authentication opens the
separate `/account` placeholder with account metadata and logout.

Screens can be reviewed before the API is available. A valid backend token
response is required to enter the account placeholder; no demo credentials or
simulated successful sign-ins are supplied.

## Information needed

- API origin and Swagger/OpenAPI, or exact example requests, success responses and
  errors for the operations below. Confirm the retained contract against the
  upcoming API before live use.
- Google OAuth **Web application client ID** for each API environment. This is the
  audience verified by the API, even though this is a mobile application.
- Google OAuth **iOS client ID** for each resolved iOS bundle identifier.
- Google OAuth **Android clients** registered with each resolved package name and
  the SHA-1 of the certificate that signs the installed app. Register development,
  internal and Google Play App Signing certificates as applicable. The app does
  not need an Android client ID environment variable.
- Registration fields, password policy, code expiry/resend rules and recovery link
  format. The existing contract requires username, email and password; names are
  optional. Confirm first-time Google account creation and the policy for linking
  an existing email/password account, including proof of account ownership.

Public OAuth IDs belong in app configuration. OAuth client secrets, service-account
keys, signing keys and passwords do not belong in the app or this chat.

## Google Cloud setup

The checked-in Android files name `expo-template-dev-hyrkul` (development) and
`expo-template-hyrkul` (production), but contain no OAuth clients. The checked-in
iOS plist is a placeholder and is not used for Google sign-in.

1. Open the intended project in [Google Cloud Console](https://console.cloud.google.com/).
   Configure Google Auth Platform branding, audience and contact information.
   This integration requests only basic sign-in/profile information. Google exempts
   Sign in with Google using only `openid`, email and profile from the test-user
   allowlist requirement. If additional scopes are introduced while the project
   is in Testing, add the accounts used for testing. See
   [Google's audience rules](https://support.google.com/cloud/answer/15549945?hl=en).
2. Under Google Auth Platform → Clients, create a **Web application** client.
   Give its ID to the API developer and set `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.
   This flow sends an ID token to your API; no web redirect URI or client secret
   is needed in the mobile application.
3. Create **Android** clients using the package and actual signing SHA-1 for every
   build you will distribute. An EAS APK and a Google Play installation can use
   different certificates. Register the installed app's certificate, not just
   the upload key.
4. Create an **iOS** client with the matching bundle identifier. Set
   `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` before building iOS. `app.config.js` registers
   its reversed client ID URL scheme through the library's config plugin.
5. Put the public IDs in `.env.local` for local development and the matching EAS
   environment for cloud builds. Keep Web/iOS/Android clients in the intended
   Google project. The API must accept that environment's Web client ID.

Current native identities, resolved from the brand manifest:

| Variant     | Android package / iOS bundle identifier |
| ----------- | --------------------------------------- |
| development | `com.hyrkul.mobiletemplate.dev`         |
| preview     | `com.hyrkul.mobiletemplate.preview`     |
| production  | `com.hyrkul.mobiletemplate`             |

The development and development-device EAS profiles share the development identity.
Keep the production identifiers when configuring this existing application.

```dotenv
EXPO_PUBLIC_API_URL=https://your-api.example.com
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
```

Replace the examples with actual Google-issued IDs. Do not append `/api` to the
API origin. The native integration uses `react-native-nitro-google-signin` with
Android Credential Manager and the iOS Google SDK. Only the Google ID token is
sent to the API; SecureStore persists the API's own session tokens.

Install a **new development build** after this dependency change or an iOS client
ID/URL scheme change. Metro and OTA cannot install native code. Expo Go cannot
run this integration. Configure the iOS client before building iOS; preview
builds without credentials are not a verified native configuration.

See [Expo Google authentication](https://docs.expo.dev/guides/google-authentication/)
and the [library setup](https://react-native-nitro-google-sign-in.github.io/docs/setup/expo).

## API handoff

These paths and DTOs already exist in `auth.repository.ts`, `auth.types.ts` and
the response schemas; no new server operations were introduced:

| Method | Path                         | Purpose                                         |
| ------ | ---------------------------- | ----------------------------------------------- |
| POST   | `/api/auth/login`            | Email/username, password and device metadata    |
| POST   | `/api/auth/register`         | Profile, email, password and preferred language |
| POST   | `/api/auth/register/confirm` | Challenge ID, code and device metadata          |
| POST   | `/api/auth/register/resend`  | Registration email                              |
| POST   | `/api/auth/google`           | Google ID token and device metadata             |
| POST   | `/api/auth/token/refresh`    | Rotate the API refresh token                    |
| POST   | `/api/auth/logout`           | Revoke the captured API session                 |
| POST   | `/api/auth/password/forgot`  | Send recovery email                             |
| POST   | `/api/auth/password/reset`   | Challenge ID, code and new password             |
| GET    | `/api/users/me`              | Current identity, available to account features |

Login/registration/verification return `AuthFlowResponse`: an email challenge or
`loginResponse`. Google and refresh return `TokenResponse`, including identified
user, access/refresh token pair, expiry timestamps, session ID and device ID.
Exact schemas remain in source; malformed responses cannot establish a session.
Confirm envelopes and nullability against the actual API.

The API must verify Google's token signature, issuer, audience and expiry, and
identify the Google account by its stable `sub`. Account creation/linking, email
delivery, password checks, rate limits and session issuance belong to the API.
See [Google backend authentication](https://developers.google.com/identity/sign-in/android/backend-auth).

The reset screen expects a `challengeId` UUID in the email link, for example
`expomobiletemplate.dev://reset-password?challengeId=<uuid>` in development,
followed by the six-digit code entered by the user. Use the selected brand/variant
scheme. Confirm the API's actual recovery link format before relying on delivery.
Recovery messages do not disclose whether the email exists.

## Ownership and verification

The `(auth)` route group mounts the existing query/session providers. `AuthFlowProvider` owns
login, registration, verification and Google exchange. Route/session changes
invalidate stale responses, and concurrent auth submissions are guarded.
`useAuthForm` retains failed drafts and exposes errors. The route owner opens
`/account` after durable session storage; its guard returns to the Login example
after durable local logout. Login and Register remain accessible with a saved session.
The API must still authorize every protected operation.

The auth layout delays its own navigator until saved-session restoration finishes;
the public shell remains independent. Its native loading/retry view preserves the destination and
query parameters, including `reset-password?challengeId=...`, through slow storage
reads and restore retries. Account route guards run only after auth is known.

The existing lifecycle retains token rotation, serialized SecureStore writes,
cache cleanup and bounded background revocation. Passwords/codes are not persisted.
Verification challenges remain in memory; restarting requires a fresh challenge.
Google cancellation leaves forms unchanged; the native module loads on its button
action, and missing IDs/native code produce a retryable error.

Run lint, typecheck and formatting. Then verify on matching iOS/Android builds:
keyboard/autofill, accessibility, large text, RTL, errors/cancellation, Back during
requests, Google account choice, OTP/resend/expiry, recovery links, restart/refresh
and logout/storage-error retry. Verify Google on internal and store-signed Android
installations. Static checks do not establish native or live-backend behavior.

For recovery, cold-launch a reset link while session storage is deliberately slow,
then repeat with a storage-read failure and Retry. After signed-out restoration,
the reset screen must still receive the original challenge ID. With an existing
authenticated session, the reset example remains accessible and retains its challenge ID.

For a public iOS release using Google for the primary account,
[App Review guideline 4.8](https://developer.apple.com/app-store/review/guidelines/#login-services)
requires an equivalent privacy-preserving login option unless an exception applies;
Sign in with Apple is the usual implementation. Account deletion and privacy policy
also need real API/product support before submission; they are not simulated here.
