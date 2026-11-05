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

The root `google-services.json` and `GoogleService-Info.plist` are preserved unchanged.
`firebase.json` keeps automatic initialization and data collection disabled. Its
Android notification channel matches `expo-notifications` (`default`) to avoid
manifest merge conflicts with React Native Firebase Messaging.
The neutral template does not reference those Firebase apps.
`android.googleServicesFile` is optional and validated against the selected
package when enabled. iOS Firebase autolinking remains intentionally excluded.
Enabling Firebase later needs the matching config/plugins and a new native build.
Firebase files must match the resolved variant ID, including its suffix. The
resolver validates Firebase against that ID.

EAS Update is not provisioned by this template. Configure its URL, runtime policy
and channels deliberately before shipping updates. Build/sign/submit and updates
run through EAS; no build or store submission is performed by cloning the repo.

## Verification scope

Resolved config, lint/typecheck, dependency checks and local native JS exports
are static validation. A successful EAS build additionally checks native
compilation and signing; installing it is required to verify actual UI behavior.
Keep [Storybook release graph checks](storybook.md#release-boundary), iOS/Android
device results and live-backend verification separate.
