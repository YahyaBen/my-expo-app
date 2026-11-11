# Development

## SDK and native verification baseline

This starter uses Expo SDK 58, React Native 0.88, React 19.3, Expo Router and
`@expo/ui`. Inspect `package.json`, the lockfile and installed types before changes.
Use [SDK 58 documentation](https://docs.expo.dev/versions/v58.0.0/) and
`npx expo install <package>` for SDK-compatible dependencies. Keep the intentional
Skia package alias and dependency overrides.

Use Node 22.18+, 24.3+ or 26+ with npm. `npm ci` installs the committed dependency
graph. Native package/config changes require a matching EAS development build;
Metro reloads and OTA updates cannot add native modules. Expo Go is insufficient
for the complete catalog. Generated `ios/` and `android/` projects stay untracked;
configure native behavior through app configuration and plugins.

## Commands

| Command                           | Purpose                                     |
| --------------------------------- | ------------------------------------------- |
| `npm start`                       | Open the app in a native development client |
| `npm run android` / `npm run ios` | Local native run with installed toolchains  |
| `npm run check`                   | Typecheck, lint and formatting              |
| `npx expo-doctor`                 | Check Expo configuration/dependency health  |

No automated tests or test scripts are included. Preserve `testID` props and
explicit selectors in native examples for later device inspection.

Edit app-owned theme values directly in the existing TypeScript theme/layout
files, then run `npm run check`. See
[theme values](appearance-themes.md#theme-values) for ownership and previewing.

## Brand and environment configuration

The default brand is `template`. Its name, native identity, assets, EAS project ID
and initial presentation live in `config/brands/template.json`. `config/brand.js`
validates that manifest and `app.config.js` projects it into Expo configuration.
The app reads only public metadata through `src/config/brand.ts`.

For a cloned starter's EAS build, set the manifest's `eas.owner` and
`eas.projectId` for a project with the slug `expo-mobile-template`. An empty ID
works for local development. Production requires a project ID. See
[build profiles](eas-development-builds.md) for account access and signing.

| Variable              | Meaning                                                                       |
| --------------------- | ----------------------------------------------------------------------------- |
| `APP_BRAND`           | Registered manifest; defaults to `template`                                   |
| `APP_VARIANT`         | `development` (default), `preview` or `production`                            |
| `EXPO_PUBLIC_API_URL` | Optional backend for retained API helpers; production requires HTTPS when set |

No `.env.local` is required. The launch script selects the development variant
for its child process. EAS profiles select their own variant. Public variables
are bundled and must not contain secrets.

For a different product, change the manifest's name, slug, scheme, native IDs and
assets as needed. The manifest defines production identity; development and preview
suffix native IDs and URL schemes for side-by-side installation. See
[native identity and integrations](eas-development-builds.md#native-identity-and-integrations).
Expo push notifications are configured for Android development and production.
Google services files match those packages because Expo uses FCM underneath on
Android; preview needs its own file. See the
[Expo push setup](eas-development-builds.md#expo-push-notifications).
Remote iOS push setup is pending. No backend, auth restoration, permission prompt or
store-update check blocks starter startup.

## App and catalog ownership

`src/app/index.tsx` opens the template screen. The root owns
fonts, preference/language hydration, launch readiness, native navigation motion
and feedback hosting. It mounts no authentication or query provider. Helpers for
HTTP, auth, forms and session-safe queries remain available for future features,
with no live backend configured by default.

Reusable native UI lives in `src/components/ui/`. App examples live in
`src/features/template/`; Home and Settings own their feature compositions.
Use the Components tab to browse and interact. Components receive data and callbacks;
future routes/screens stay in `src/app/` and `src/features/` respectively.

## Verification

Run lint, typecheck and formatting for edits. Check both native
release graphs after tooling-entry changes. Keep static results separate from
device results and live-backend results. Manual device checks include cold start,
safe areas, dark mode, RTL, large text, keyboard, native Back, gestures, reduced
motion and background/resume. Static checks and builds do not prove those behaviors.

## Dependency audit follow-up

The SDK-aligned dependency graph passes Expo Doctor. `npm audit` still reports
three high-severity entries through Expo CLI's Zod 3 dependency, plus seven low
entries. The app's direct Zod dependency is patched at 4.6.7. The collection
validation issue is tracked in
[GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5).
The current CLI requires Zod 3; replacing it with Zod 4 needs an upstream
compatibility change. npm's proposed force fix downgrades Expo to SDK 51, so it
has not been applied. Review this tooling dependency when Expo ships a fix.
