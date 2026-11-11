# EAS builds

## Link a clone

Set `eas.owner` and `eas.projectId` in `config/brands/template.json` to the
account and UUID of your EAS project. Use the slug `hyrkul-wlui-template` to
match the starter. Production requires a project ID. Local development accepts
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

| Profile              | Result                                                |
| -------------------- | ----------------------------------------------------- |
| `development`        | Android debug APK or iOS Simulator development client |
| `development-device` | Development client for physical iOS devices           |
| `preview`            | Internal release APK / signed iOS internal build      |
| `production`         | Store binaries with remote version increment          |

All profiles use the brand manifest's `name` as the installed app name. The
default brand displays `Expo Template`. Install a new native build to apply a
name change.

```sh
npx eas-cli@latest build --platform ios --profile development
npx eas-cli@latest build --platform ios --profile development-device
npx eas-cli@latest build --platform all --profile preview
npx eas-cli@latest build --platform all --profile production
```

EAS chooses the SDK-compatible iOS image through `image: auto`. Development Android
limits Gradle to one worker with parallel execution disabled. Preview explicitly creates
an installable APK. Production creates the store Android app bundle by default.
Build profiles share the manifest's project ID. No backend URL is required.

All profiles open the template app and its component pages.

## Native identity and integrations

EAS project UUIDs identify Expo projects, not store apps. Account access, Android
signing, Apple credentials and device provisioning are still required where
applicable. Separate products need unique app IDs, display names and assets in the
brand manifest. Keeping an existing package ID updates/replaces that installed app.

`config/brand.js` derives each variant's identity from the manifest so development,
preview and production can be installed together:

| Variant       | Android package / iOS bundle ID | URL scheme suffix |
| ------------- | ------------------------------- | ----------------- |
| `production`  | Manifest's base ID              | None              |
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

In `config/brands/template.json`, `android.googleServicesFile` accepts one file
path or a map by variant. Each file must contain a client matching the resolved
Android package. Preview has no file configured; register its `.preview` package
and add its Google services file before enabling remote push for that variant.
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

Development Android installs subscribe to `all-testing-et` with Expo's
`subscribeToTopicAsync()` after notification permission is granted. The app tries
after the startup permission request finishes, on returning to the foreground, and during Settings token
registration. Topic work does not block launch or Expo token display; failures
are logged and the next registration/resume can retry. Production, preview and
iOS do not subscribe, and existing installs join when they run the updated app.

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
The existing `GoogleService-Info.plist` is unreferenced. Expo Go cannot test Android
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
