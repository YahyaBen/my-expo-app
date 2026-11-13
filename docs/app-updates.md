# App updates

The app checks after its initial screen is interactive, then every 15 minutes
while in the foreground. Returning to the foreground checks immediately if the
last attempt was at least 15 minutes ago. A manual check resets that countdown;
failed checks wait for the next eligible attempt. The timer stops in the background
and waits while another update operation is running. No background task or
persisted update state is added.

A native sheet requires an available update before the app can be used again.
The prompt occupies 65% of the available height, with scrollable instructions
above the update action and a footer showing the app name and installed version.
It has no Later or Cancel action, drag handle, swipe dismissal, backdrop dismissal
or Android Back dismissal. It stays open during download, after download until
restart, and after an action fails so the user can retry. Settings keeps a manual
**Check for updates** action and separate results for app improvements and the
store release. Initial network failures do not block launch or count as a
successful version check; failed rechecks retain already detected updates.
Checks and actions share one in-flight operation. A successful check or fetch
that reports a withdrawn update releases its prompt.

The root prompt uses a full-size, non-intercepting native Host rather than sizing
to modal content, which has no inline height. It can offer an OTA result while
the store check is still running; update actions wait for that shared check to
finish. Settings reads the same detection result without starting another check
when opened.

## Expo updates

`expo-updates` checks for a compatible JavaScript/assets update. Download and
restart require separate user actions, with the prompt blocking app access until
restart. A downloaded update can also run on the
next cold launch. Rollbacks to the embedded update follow the same fetch/restart
flow. Development mode and builds without enabled Expo Updates show unavailable.

`AppUpdatesProvider` owns detection and actions in `src/features/updates/`.
`Updates.useUpdates()` observes pending downloads. The provider serves the root
prompt and Settings; standalone component previews do not start update work.

The EAS CLI configured the `appVersion` runtime policy and build-profile channels
in `app.json` / `eas.json`. `app.config.js` derives the update URL from the selected
brand's existing `eas.projectId`. **Increase `expo.version` before making a build
with different native code or native configuration.** Builds sharing an app version
must have compatible native code. An OTA update cannot add native modules.

`updates.checkAutomatically: ON_ERROR_RECOVERY` keeps ordinary checks with the
post-launch controller and preserves Expo's native recovery checks. The app does
not wait for the network on its launch screen or restart itself without a tap.

Publish through EAS after building and installing a matching release binary:

```sh
npx eas-cli@latest update --channel preview --environment preview --message "Describe the change"
```

Use the matching `APP_BRAND` / `APP_VARIANT` when publishing; preview builds use
`preview`, production builds use `production`. Keep runtime version, environment,
project and channel aligned. Publishing affects installed apps; verify a preview
before choosing a production publication.

## App Store and Google Play

`expo-in-app-updates` compares the installed binary with its store release. iOS
uses the App Store marketing version; Android uses Google Play's version code and
update eligibility, including the user's track and rollout. “Up to date” means
the store did not offer a newer eligible release; it does not require a beta or
newer installed binary to equal the public version. Settings reads the installed
version/build from `expo-application`, rather than an OTA manifest.

Store checks run only in production builds with the native module present.
Development and preview identities have different suffixes and do not check the
production listing. Imports are deferred so older clients without the module do
not crash. A missing iOS listing is an unsuccessful check. Android requires a
Google Play installation and an account eligible for the release.

The package uses the installed bundle ID for iOS lookup, defaulting to the US
storefront. For an app published elsewhere, set `AppStoreCountry` in
`ios.infoPlist` to its storefront code. Optional `AppStoreID` pins its numeric
listing ID. These are native configuration changes and require a new binary.

The update action opens Apple's store sheet or Google's permitted update flow.
Android prefers an immediate flow when allowed and otherwise uses the package's
supported fallback. Interrupted immediate updates remain available to resume.
The app keeps its required-update prompt visible if the native store flow is
closed or canceled; StoreKit and Google Play own their cancellation controls.
Opening the store does not count as installation. Native checks use platform
timeout behavior and have no cancellation
API; a slow store check can keep update controls busy while the app stays usable.

## Verification

Install new native builds on both platforms: this feature enables iOS autolinking
for the existing store-update module and adds the OTA native configuration.
Metro reloads and an OTA publication cannot apply those native changes.

- In a preview release, publish a compatible OTA, verify detection, download,
  blocked dismissal, restart, next cold launch, offline retry and rollback.
- With production store identities, verify a current release and an older
  installed release. Use a Play testing track/account eligible for the newer
  version; a sideloaded preview APK does not validate Play update availability.
- Check blocked swipe/backdrop/Android Back dismissal, native StoreKit/Play
  presentation and cancellation, duplicate taps, interrupted
  downloads, large text and English/French/Arabic layouts on both platforms.
- On a cold launch with a compatible OTA available, verify the prompt appears on
  Home without opening Settings, including while the store check is slow. Verify
  Home stays blocked through download, retry and the required restart. Withdraw
  an OTA before download and verify its prompt releases when fetch reports none.
- Keep the app in the foreground for 15 minutes and verify another check. Verify
  a manual check resets the countdown, backgrounding stops the timer, returning
  after the deadline checks once, and update operations never overlap. Verify a
  failed recheck retains an already detected update and a downloaded rollback
  stays ready to restart.
- Run lint, typecheck and formatting separately from native-device and live-store
  checks. Static checks do not prove store availability or native presentation.

See the official [Expo Updates API](https://docs.expo.dev/versions/v58.0.0/sdk/updates/),
[EAS setup](https://docs.expo.dev/eas-update/getting-started/),
[store-update package](https://github.com/SohelIslamImran/expo-in-app-updates) and
[Google Play update testing](https://developer.android.com/guide/playcore/in-app-updates/test).
