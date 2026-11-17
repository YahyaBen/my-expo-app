# EAS builds

## Link a clone

Set `app.eas.owner` and `app.eas.projectId` in `config/app.js` to the
account and UUID of your EAS project. Set `app.slug` to match that project.
Production requires a project ID. Local development accepts
an empty ID.

```sh
npm ci
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile development
```

Install the resulting development client, then run `npm start` to open the app.
The retained native modules require that matching binary.
Use the [EAS build configuration reference](https://docs.expo.dev/eas/json/) for
profile options and [signing setup](https://docs.expo.dev/app-signing/app-credentials/)
for platform credentials.

## Profiles

| Profile              | Result                                                 |
| -------------------- | ------------------------------------------------------ |
| `development`        | Android debug APK or iOS Simulator development client  |
| `development-device` | Development client for physical iOS devices            |
| `preview`            | Internal release APK / signed iOS internal build       |
| `production`         | Store binaries with locally configured version numbers |

Installed names combine `app.name` and the selected variant's `nameSuffix` in
`config/app.js`: `Expo Template Dev`, `Expo Template Preview`, or `Expo Template`.
Install a new native build to apply a name change. EAS uses the local version
source without auto-increment: increase `app.android.versionCode` and
`app.ios.buildNumber` yourself before a new store upload. For an existing app,
use numbers above the latest uploaded builds, including previous remote EAS versions.

```sh
npx eas-cli@latest build --platform ios --profile development
npx eas-cli@latest build --platform ios --profile development-device
npx eas-cli@latest build --platform all --profile preview
npx eas-cli@latest build --platform all --profile production
```

EAS chooses the SDK-compatible iOS image through `image: auto`. Development Android
limits Gradle to one worker with parallel execution disabled. Preview explicitly creates
an installable APK. Production creates the store Android app bundle by default.
Build profiles share `app.eas.projectId`. No backend URL is required.

The app opens the public Discover shell. Login and Register are listed under
Components → App flows; they do not gate the catalog or Home tab.

## Local Android release

On Windows, use the installed Android SDK/JDK and Expo prebuild with Gradle to
produce a signed AAB locally. The helper uses the production brand identity and
the exact `app.version` and `app.android.versionCode` in `config/app.js`.
It does not increment build numbers. `JAVA_HOME` and `ANDROID_HOME` must point
to the installed toolchains.

```powershell
node scripts/build-android-local.cjs --credentials "C:\private\keystore-credentials.md" --keystore "C:\private\upload.jks" --output "dist\app-release.aab"
```

The credentials Markdown must provide these three data fields:

```text
- Android upload keystore password: <password>
- Android key alias: <alias>
- Android key password: <password>
```

Keep that file and the keystore outside source control. The helper reads only
those fields, verifies the keystore, and passes signing values through the local
build process environment. The config plugin configures generated Gradle signing
without embedding credentials in source; generated Android files remain ignored.
The helper selects the production variant and update channel,
generates Android with Expo, regenerates the JavaScript bundle so current public
configuration values are embedded, runs `bundleRelease`, verifies the archive signature,
and copies the AAB to the requested output. Sanitized logs are kept in
`.expo/local-release/build.log`. An existing output file is never overwritten.

On Windows the helper temporarily maps an unused drive letter to this workspace
and places the app's C++ staging files under that short path. This avoids Ninja's
260-character filename limit while keeping generated files in `.expo/`. It removes
its own drive mapping when finished. Gradle runs without a persistent daemon.

After a failed build, `--reuse-native` reapplies only the local release config
plugin before retrying Gradle, retaining compiled outputs. Use it only when app
identity, version, dependencies and other native configuration have not changed
since prebuild. Otherwise run the normal command to regenerate Android first.

Configure API and Google OAuth values for the intended release before relying on
authentication; a successful native build does not verify live sign-in.

## Native identity and integrations

EAS project UUIDs identify Expo projects, not store apps. Account access, Android
signing, Apple credentials and device provisioning are still required where
applicable. Separate products need unique app IDs, display names and assets in the
`config/app.js`. Keeping an existing package ID updates/replaces that installed app.

`config/brand.js` derives each variant's identity from `config/app.js` so development,
preview and production can be installed together:

| Variant       | Android package / iOS bundle ID | URL scheme suffix |
| ------------- | ------------------------------- | ----------------- |
| `production`  | App's base ID                   | None              |
| `preview`     | Base ID + `.preview`            | `.preview`        |
| `development` | Base ID + `.dev`                | `.dev`            |

Both development profiles use the same development identity. For a physical
iPhone, build `development-device`; `development` targets the iOS Simulator.
Rebuild and install the variants after changing IDs. EAS handles signing for
each resolved ID; iOS internal builds require device provisioning. Each variant
has its own app data. Only development registers the generated Expo development
client URL scheme, so Metro QR codes open the development app.

### Expo push notifications

The app uses `expo-notifications` and Expo Push Service. Settings displays one
selectable `[Expo] Push token` for testing. Android transport uses FCM underneath
Expo, so the Google services files and FCM v1 sending credentials remain required.

| Variant     | Android application ID          | Google services file               | Firebase project           |
| ----------- | ------------------------------- | ---------------------------------- | -------------------------- |
| Development | `com.hyrkul.mobiletemplate.dev` | `google-services.development.json` | `expo-template-dev-hyrkul` |
| Production  | `com.hyrkul.mobiletemplate`     | `google-services.json`             | `expo-template-hyrkul`     |

In `config/app.js`, set `variants.development.googleServicesFile` and
`variants.production.googleServicesFile` to the separate downloaded Firebase
Android app JSON files. Each file must contain a client matching the resolved
Android package. The resolver rejects missing files, malformed JSON and mismatched
package names before building. Preview has an empty path; register its `.preview`
package and fill `variants.preview.googleServicesFile` before enabling Android push.
Expo copies the selected file and configures Google services during prebuild.

Configure sending credentials and test:

1. Run `npx eas-cli@latest credentials --platform android`. Select the development
   or production build profile and manage the Google Service Account Key for Push
   Notifications (FCM V1). Upload a key from the matching Firebase project shown
   above. Repeat for the other application identifier. The Google services JSON
   files are app configuration, not private service-account sending keys. Keep
   private keys in EAS credential storage and outside the app and repository.
2. Build and install a new Android client after removing React Native Firebase:

   ```sh
   npx eas-cli@latest build --platform android --profile development
   npm start
   ```

   Use `--profile production` for the store build. Existing binaries still contain
   their previous native modules; Metro reloads and OTA updates cannot replace them.

3. Open Settings, enable Notifications, and copy `[Expo] Push token`. Paste the
   actual token (for example `ExponentPushToken[...]`) into
   [Expo’s push notification tool](https://expo.dev/notifications). Set the Android
   channel ID to `default` and send a notification with a title and body.
4. Verify delivery in foreground, background and closed states. Tap the notification
   to reopen the app. A force-stopped Android app must be opened manually before
   testing again. Check permission changes, retry after a network failure, and
   token display after returning to Settings.

`src/lib/push-notifications.ts` calls `getExpoPushTokenAsync({ projectId })` after
checking OS permission and creating the notification channel. The selected EAS
project ID comes from Expo configuration; the application ID comes from the
installed binary. Registration runs while Settings is visible. The field rereads
on resume and supports manual retry; Expo manages native device-token mapping.
Startup requests notification permission after launch on iOS and Android if the
user has not made a choice yet. Previous grants or denials skip the startup prompt.
Android also configures foreground presentation; startup does not register a new
Expo token. Native Expo delivery handles background
alerts. Notification taps open the app without feature-specific routing; custom
silent background work is not configured.

### Development topic through Expo

Development Android installs subscribe to `variants.development.developmentPushTopic`
in `config/app.js` (currently `all-testing-et`) with Expo's
`subscribeToTopicAsync()` after notification permission is granted. The app tries
after the startup permission request finishes, on returning to the foreground, and during Settings token
registration. Topic work does not block launch or Expo token display; failures
are logged and the next registration/resume can retry. Production, preview and
iOS do not subscribe, and existing installs join when they run the updated app.
Set the topic to `''` to disable subscription for a clone.

This is an FCM topic managed through the Expo Android API. Send topic messages
from the development Firebase project (`expo-template-dev-hyrkul`) using Firebase
Console or a trusted FCM sender. Expo Push Service and its test tool accept Expo
token recipients rather than topic names. To broadcast through Expo Push Service
across Android and iOS, a backend must retain the recipient Expo push tokens.
No push-token backend contract is configured in this template.

The app uses no React Native Firebase packages, custom Android messaging plugin
or JavaScript background handler. Topic support must be present in the installed
Expo development/release binary; rebuild if that native module is unavailable.
See [Expo topic APIs](https://docs.expo.dev/versions/v58.0.0/sdk/notifications/#notificationssubscribetotopicasynctopic).

Remote iOS setup remains pending APNs credentials and its own device verification.
Expo Go cannot test Android
remote push notifications; use a development build. An Expo token alone does not
prove EAS sending credentials are configured. See
[Expo notification APIs](https://docs.expo.dev/versions/v58.0.0/sdk/notifications/)
and [FCM v1 credentials for Expo](https://docs.expo.dev/push-notifications/fcm-credentials/).

[App updates](app-updates.md) use the selected brand's EAS project, an app-version
runtime policy and profile-specific channels. Store updates use the installed
native identity. Build/sign/submit and OTA publishing run through EAS; no build,
store submission or update publication is performed by cloning the repo.

## Verification scope

Resolved config, lint/typecheck, dependency checks and local native JS exports
are static validation. A successful EAS build additionally checks native
compilation and signing; installing it is required to verify actual UI behavior.
Keep native release graph checks, iOS/Android device results and live-backend
verification separate.
