# EAS builds

## Link a clone

Set `eas.projectId` in `config/brands/template.json` to an EAS project UUID owned
by an account you can access. Use slug `expo-mobile-template` for that project
to match the starter. No other repository setting is needed for the unchanged
template. An empty ID is allowed locally; production validation rejects it.

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

```sh
npx eas-cli@latest build --platform ios --profile development
npx eas-cli@latest build --platform ios --profile development-device
npx eas-cli@latest build --platform all --profile preview
npx eas-cli@latest build --platform all --profile production
```

EAS chooses the SDK-compatible iOS image through `image: auto`. Development Android
keeps its memory-constrained Gradle command/init script. Preview explicitly creates
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

The root `google-services.json`, `GoogleService-Info.plist` and `firebase.json` are
preserved byte-for-byte. The neutral template does not reference those Firebase
apps. `android.googleServicesFile` is optional and validated against the selected
package when enabled. iOS Firebase autolinking remains intentionally excluded.
Enabling Firebase later needs the matching config/plugins and a new native build.

EAS Update is not provisioned by this template. Configure its URL, runtime policy
and channels deliberately before shipping updates. Build/sign/submit and updates
run through EAS; no build or store submission is performed by cloning the repo.

## Verification scope

Resolved config, lint/typecheck, dependency checks and local native JS exports
are static validation. A successful EAS build additionally checks native
compilation and signing; installing it is required to verify actual UI behavior.
Keep [Storybook release graph checks](storybook.md#release-boundary), iOS/Android
device results and live-backend verification separate.
