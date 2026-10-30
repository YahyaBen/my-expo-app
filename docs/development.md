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

| Command                           | Purpose                                       |
| --------------------------------- | --------------------------------------------- |
| `npm start`                       | Open Storybook in a native development client |
| `npm run storybook:dev`           | Same development catalog                      |
| `npm run start:app`               | Open the neutral wireframe instead            |
| `npm run android` / `npm run ios` | Local native run with installed toolchains    |
| `npm run storybook:generate`      | Refresh story registration                    |
| `npm run check`                   | Typecheck, lint and formatting                |
| `npx expo-doctor`                 | Check Expo configuration/dependency health    |

No automated tests or test scripts are included. Preserve `testID` props and
explicit selectors in stories for later device inspection. See
[Storybook](storybook.md) for the catalog and release bundle checks.

## Brand and environment configuration

The default brand is `template`. Its name, native identity, assets, EAS project ID
and initial presentation live in `config/brands/template.json`. `config/brand.js`
validates that manifest and `app.config.js` projects it into Expo configuration.
The app reads only public metadata through `src/config/brand.ts`.

For a cloned starter's EAS build, replace only the manifest's `eas.projectId` using
a project with slug `expo-mobile-template`. An empty ID works for local development.
Production configuration requires a project ID. Account access and signing are
still handled by EAS. See [build profiles](eas-development-builds.md).

| Variable                        | Meaning                                                                             |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| `APP_BRAND`                     | Registered manifest; defaults to `template`                                         |
| `APP_VARIANT`                   | `development` (default), `preview` or `production`                                  |
| `EXPO_PUBLIC_STORYBOOK_ENABLED` | Development defaults to enabled; exact `false` disables it; release always disabled |
| `EXPO_PUBLIC_API_URL`           | Optional backend for retained API helpers; production requires HTTPS when set       |
| `GOOGLE_MAPS_ANDROID_API_KEY`   | Optional package-restricted Maps key                                                |

No `.env.local` is required. The launch scripts override only their own child
process's preview flags and development variant. EAS profiles select their own
variant/flag. Public variables are bundled and must not contain secrets.
`EXPO_PUBLIC_ENABLE_DEV_SCREENS` is obsolete and unused.

For a different product, change the manifest's name, slug, scheme, native IDs and
assets as needed. Variants do not suffix native identities. The retained Google
configuration files stay unchanged and inactive for the neutral identity; enable
Firebase only with files matching the chosen package/bundle ID. No backend,
auth restoration, permission prompt or store-update check blocks starter startup.

## App and catalog ownership

`src/app/index.tsx` selects the wireframe or redirects to Storybook. The root owns
fonts, preference/language hydration, launch readiness, native navigation motion
and feedback hosting. It mounts no authentication or query provider. Helpers for
HTTP, auth, forms and session-safe queries remain available for future features,
with no live backend configured by default.

Reusable native UI lives in `src/components/ui/`. All example compositions,
including Home sections and device preferences, live in `.rnstorybook/components/`.
Use native stories to browse and interact. Components receive data and callbacks;
future routes/screens stay in `src/app/` and `src/features/` respectively.

## Verification

Run lint, typecheck, formatting and story generation for edits. Check both native
release graphs after tooling-entry changes. Keep static results separate from
device results and live-backend results. Manual device checks include cold start,
safe areas, dark mode, RTL, large text, keyboard, native Back, gestures, reduced
motion and background/resume. Builds/registration do not prove those behaviors.

## Dependency audit follow-up

The SDK-aligned dependency graph passes Expo Doctor. `npm audit` still reports
three high-severity entries through Expo CLI's Zod 3 dependency, plus seven low
entries. The app's direct Zod dependency is patched at 4.6.7. The collection
validation issue is tracked in
[GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5).
The current CLI requires Zod 3; replacing it with Zod 4 needs an upstream
compatibility change. npm's proposed force fix downgrades Expo to SDK 51, so it
has not been applied. Review this tooling dependency when Expo ships a fix.
