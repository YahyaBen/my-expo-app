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

Edit **`config/app.js`** when cloning the template. It contains commented setup
values and a description for each variant. `config/brand.js` validates the file;
`app.config.js` assembles Expo configuration. `app.json` retains shared native
behavior and plugins; `eas.json` retains reusable build profiles. The app reads
only selected public metadata through `src/config/brand.ts`, never the setup file.

| Setting in `config/app.js`                              | Purpose                                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------------------ |
| `variant`                                               | Local default: `development`, `preview` or `production`                  |
| `app.id`, `app.name`, `app.description`                 | Internal brand ID, app name and product description                      |
| `app.slug`, `app.scheme`                                | EAS project slug and base deep-link scheme                               |
| `app.version`                                           | Store-visible version and app-version OTA runtime                        |
| `app.android.package`, `app.ios.bundleIdentifier`       | Base production native identities                                        |
| `app.android.versionCode`, `app.ios.buildNumber`        | Locally managed build numbers; increase before store uploads             |
| `app.icon`, `app.ios.icon`, `app.android`, `app.splash` | Home-screen icons and splash assets/colors                               |
| `app.presentation`                                      | Default palette, launch mode, registered heading font and launch artwork |
| `app.eas.owner`, `app.eas.projectId`                    | Your EAS account and project UUID; slug must match that project          |
| `variants.<variant>.description`                        | Explains who the variant is for and which services it uses               |
| `variants.<variant>.nameSuffix`, `identitySuffix`       | Home-screen label suffix and native ID / deep-link suffix                |
| `variants.<variant>.apiUrl`                             | Optional backend origin; production requires HTTPS when set              |
| `variants.<variant>.googleServicesFile`                 | Firebase Android client JSON path; `''` disables Android push            |
| `variants.development.developmentPushTopic`             | Android development broadcast topic; `''` disables subscription          |
| `variants.<variant>.googleMaps`                         | Android/iOS Maps SDK API keys                                            |
| `variants.<variant>.googleAuth`                         | Google OAuth Web and iOS client IDs                                      |

No `.env.local` is required. `npm start` respects the file's default variant;
EAS build profiles select their own `APP_VARIANT`. For an OTA update, explicitly
select the variant with `APP_VARIANT` or the file's `variant` value; a channel name
does not select app configuration. Existing nonempty API/Google environment values
still override the selected variant for local or CI/EAS use; `.env.example` lists
them. Remove stale overrides when switching projects. An optional legacy
`APP_BRAND` must match `app.id`; new clones do not need it.

Public Google client IDs and restricted native Maps keys may be configured here.
Keep OAuth client secrets, FCM service-account private keys and signing passwords
outside app configuration. Authentication needs a reachable API and matching
Google Cloud registrations; see [authentication setup](auth-forms.md).

For a cloned starter's EAS build, fill `app.eas` with your project details.
An empty project ID works locally; production requires an ID. EAS uses local
version numbers and does not increment them. For an existing app, choose build
numbers above the latest uploaded Android/iOS builds, including previous EAS
remote counters. `package.json` version is npm metadata and does not control
native app versions. See [build profiles](eas-development-builds.md).

For a different product, change the file's name, slug, scheme, native IDs and
assets. The app section defines production identity; development and preview
suffix native IDs and URL schemes for side-by-side installation. See
[native identity and integrations](eas-development-builds.md#native-identity-and-integrations).
Expo push notifications are configured for Android development and production.
Google services files match those packages because Expo uses FCM underneath on
Android; preview needs its own file. See the
[Expo push setup](eas-development-builds.md#expo-push-notifications).
Remote iOS push setup is pending. No backend, auth restoration, permission prompt or
store-update check blocks starter startup.

## Google Maps example

Open **Components → Media & carousels → Google Maps** to pan and zoom around a
sample Casablanca marker, switch between standard and satellite maps, or reset
the view. This example does not request location access.

Set `variants.<variant>.googleMaps.androidApiKey` and `iosApiKey` in `config/app.js`.
`app.config.js` passes them to the
`react-native-maps` config plugin; only availability flags go into `extra.googleMaps`.
Enable **Maps SDK for Android** and **Maps SDK for iOS** in Google Cloud. Restrict
the Android key to the resolved package name and signing certificate SHA-1, and
the iOS key to the resolved bundle identifier. Development and preview builds use
the variant identifiers described above.

Create and install a new EAS development build after adding this native dependency
or changing either key. Reloading Metro or publishing an OTA update cannot add the
SDK or change its embedded keys. A missing key or native module shows a setup state
in the example. See the [Expo SDK 58 Google Maps setup](https://docs.expo.dev/versions/v58.0.0/sdk/map-view/#deploy-app-with-google-maps).

## App and catalog ownership

`src/app/index.tsx` opens the public Discover/Home/Components/Settings shell.
Components → App flows lists Login and Register at `/components/login` and
`/components/register`; `/template` is an alias for `/`. The root owns fonts,
preference/language hydration, launch readiness, native navigation motion and
feedback hosting. The `(auth)` route group owns authentication/query providers
and session restoration for those examples. Its loading/retry view preserves
incoming auth links while storage is read. Confirm API contracts and configure
credentials before live use.

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

Run Expo Doctor and `npm audit` against the current lockfile when reviewing
dependencies; advisory counts and compatibility results are not permanent
architecture guarantees. The Expo CLI's Zod 3 collection-validation issue is tracked in
[GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5).
Review its installed dependency path and upstream fix before changing overrides.
Keep dependency fixes compatible with the selected Expo SDK; do not apply
`npm audit fix --force` as routine maintenance because it can replace SDK versions.
