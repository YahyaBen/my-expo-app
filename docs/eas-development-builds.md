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

Install the resulting development client, then run `npm start`. It opens on-device
Storybook automatically. The retained native modules require that matching binary.
Use the [EAS build configuration reference](https://docs.expo.dev/eas/json/) for
profile options and [signing setup](https://docs.expo.dev/app-signing/app-credentials/)
for platform credentials.

## Profiles

| Profile              | Result                                                | Storybook                       |
| -------------------- | ----------------------------------------------------- | ------------------------------- |
| `development`        | Android debug APK or iOS Simulator development client | Enabled by Metro in development |
| `development-device` | Development client for physical iOS devices           | Enabled by Metro in development |
| `preview`            | Internal release APK / signed iOS internal build      | Disabled; neutral wireframe     |
| `production`         | Store binaries with remote version increment          | Disabled; neutral wireframe     |

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

The development client can connect to `npm run start:app` to inspect the wireframe.
The flag is a Metro/bundle choice; changing it requires restarting Metro with a
cleared cache. `__DEV__` always prevents Storybook in release JavaScript.

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

### Android Firebase messaging

The template's production Android app uses the root `google-services.json` for
Firebase project `expo-template-hyrkul`. Development uses
`google-services.development.json` from project `expo-template-dev-hyrkul`; preview
has no Firebase file configured yet. In `config/brands/template.json`, `android.googleServicesFile`
accepts either one file path or a map of paths by variant. Each configured file
must contain a client matching the resolved Android package; validation fails on
a mismatch rather than changing the app's identity.

To test in a development build:

1. When replacing the development configuration, register an Android app with package
   `com.hyrkul.mobiletemplate.dev`. Download its Google services JSON to the project
   as `google-services.development.json`. Keep the downloaded package names intact.
2. Add `"development": "./google-services.development.json"` beside the existing
   production entry in the brand's `android.googleServicesFile` map. For preview,
   register `com.hyrkul.mobiletemplate.preview` and add its file under `preview`.
3. Build and install a new Android development client:

   ```sh
   npx eas-cli@latest build --platform android --profile development
   npm run start:app
   ```

4. On the Android device, open Settings in the app and enable Notifications. The
   `[FCM] Device token` field displays the selectable token, follows token refreshes
   while Settings is visible, and has a refresh action for retrying a failed read.
   The development console also prints `[FCM] device token:` after registration.
   Paste this **FCM token** into the matching Firebase project's Console → Messaging
   → a notification campaign → Send test message. Include a title and body.
5. Verify receipt with the app open, in the background, and closed normally.
   Tap the notification to reopen the app. A force-stopped Android app must be
   opened manually before testing delivery again.

Expo's built-in Android Google services configuration copies the selected file
and applies the Google services Gradle plugin. Firebase's native modules autolink
on Android; its App config plugin is unnecessary for this Android-only setup.
iOS Firebase autolinking stays excluded and the existing `GoogleService-Info.plist`
stays inactive. Expo Go cannot run React Native Firebase; Metro reloads and OTA
updates cannot add these native modules.

`firebase.json` disables automatic messaging initialization by default. The app
enables it after notification permission is granted, creates the existing `default`
Android channel, and reads the token with `getFirebaseMessagingToken()` in
`src/lib/firebase-messaging.ts`. Startup never requests permission. Already-approved
devices register after launch and on returning to the foreground. Foreground FCM
notification payloads use `expo-notifications` for local presentation; background
notification payloads are displayed by FCM itself. `index.js` registers the
background handler before Expo Router, without displaying a duplicate alert.
Data-only messages have no product behavior yet, and notification taps open the
app without feature-specific routing.

After notification permission is granted, production Android installs automatically
subscribe to the `all-testing` topic during token registration and refresh. Subscription
runs without delaying token display; failures are logged and registration runs again
when the app returns to the foreground. Development and preview do not subscribe.
Existing installs join after launching the updated app; the client cannot enumerate
or subscribe every historical production token. The topic belongs to the production
Firebase project. To broadcast to subscribed installs, select that topic in Firebase
Console or send from a trusted server:

```js
await getMessaging().send({
  topic: 'all-testing',
  notification: { title: 'Test notification', body: 'Hello from Firebase' },
});
```

This example uses `getMessaging` from `firebase-admin/messaging` in a configured
server environment. No broadcast is sent as part of app setup. Topics are for public
broadcasts and are not an authorization boundary; see
[Firebase topic messaging](https://firebase.google.com/docs/cloud-messaging/topic-messaging).

There is no push-token backend contract configured. When adding per-user server
delivery, send the current
token and refreshes through the authenticated session lifecycle, including token
removal/reassignment on logout or account changes. Send notifications from Firebase
Console or a trusted server using the Admin SDK/FCM HTTP v1; keep server credentials
outside the app. See [React Native Firebase messaging](https://rnfirebase.io/messaging/usage)
and [Expo notification APIs](https://docs.expo.dev/versions/v58.0.0/sdk/notifications/).

[App updates](app-updates.md) use the selected brand's EAS project, an app-version
runtime policy and profile-specific channels. Store updates use the installed
native identity. Build/sign/submit and OTA publishing run through EAS; no build,
store submission or update publication is performed by cloning the repo.

## Verification scope

Resolved config, lint/typecheck, dependency checks and local native JS exports
are static validation. A successful EAS build additionally checks native
compilation and signing; installing it is required to verify actual UI behavior.
Keep [Storybook release graph checks](storybook.md#release-boundary), iOS/Android
device results and live-backend verification separate.
