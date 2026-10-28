# EAS development builds

The source now targets SDK 58; see the
[current SDK baseline](development.md#sdk-and-native-verification-baseline).
Likan is linked to `@hyrkul/likan`, project
`7263b456-2908-484f-891e-7279db6b447e`; select `APP_BRAND=likan` for EAS commands.
SDK 58 Android development-build validation is recorded below. The later
historical sections describe SDK 57 binaries and configuration. Device behavior
remains unverified.

## Integration readiness

`development` keeps its existing iOS simulator target. `development-device`
inherits the same brand, environment and development client with
`ios.simulator: false` for a signed physical-device build. Select the same
`APP_BRAND` before any EAS command and use the intended profile; neither profile
creates notification registration by itself. See
[EAS profile inheritance](https://docs.expo.dev/build/eas-json/#sharing-configuration-between-profiles).

Push notifications are not implemented in this starter. Installed Expo
Notifications and Firebase Messaging packages do not provide permission flow,
token registration/rotation, backend association, logout cleanup or notification
tap routing. iOS still excludes Firebase from autolinking and has no notification
plugin configured. A future push feature needs one message/tap owner, each client's
native credentials and an agreed backend device-token contract. Follow the
[SDK 58 notification guidance](https://docs.expo.dev/versions/v58.0.0/sdk/notifications/)
for channel, permissions and response APIs.

`firebase.json` disables Firebase's default data collection and Messaging token
auto-initialization while these native dependencies are dormant. Enable them
deliberately when implementing the selected notification transport; see
[Firebase initialization](https://rnfirebase.io/messaging/usage#auto-initialization).
`app.json` blocks Android camera, microphone, location and media/storage
permissions that retained packages can otherwise merge into the binary. Add a
real feature's permission flow and purpose strings before unblocking its required
permissions. Notification permission remains available for future integration.
These native defaults require a new binary; Metro and OTA do not alter an
already installed app's permissions or Firebase metadata.

EAS Update delivery is also unconfigured: there is no update URL, runtime version
policy or build channel. The Android Google Play update hook below is separate.
Before adopting OTA, isolate each client's project and channel and define native
compatibility through a
[runtime version policy](https://docs.expo.dev/eas-update/runtime-versions/).

## Android development build memory limits

The Android `development` profile runs `:app:assembleDebug` with one Gradle worker,
parallel project execution disabled, and `config/android-build-memory.gradle` as
an init script. The script adds a shared CMake/Ninja pool to Android application
and library modules: one compiler for Skia's heavy translation units and two for
other native modules, including autolinked dependencies. Gradle
worker limits alone do not limit Ninja's internal compiler jobs. All four existing
Android ABIs remain enabled.

These limits address local reproductions where Gradle, three Kotlin compiler
JVMs, and simultaneous Skia C++ compilers exhausted the roughly 16 GB build
environment. A later cloud retry still used the medium worker's parallel build
defaults and failed with the same disappearing-daemon error. The current EAS
account is on the Free plan, so the development profile keeps the medium worker.
The limits trade build speed for lower peak memory. They do not change
SDK/package versions, runtime behavior, or heap settings.

The Skia maintainers confirmed that 2.14.0 exhausts EAS medium-worker memory in
an SDK 58 reproduction. The additional heavy C++ translation units compile in
parallel; [upstream fix #4284](https://github.com/wcandillon/react-native-skia/pull/4284)
reduces that compiler memory use and is included in the newer 2.x release.
The project now pins Skia 2.15.2, including that fix, through the npm alias
documented in the [SDK baseline](development.md#sdk-and-native-verification-baseline).
The existing concurrency limits remain enabled. The earlier build records below
used Skia 2.14.0.

Local validation on 2026-10-26 completed `:app:assembleDebug` for all four ABIs
in 33m 2s, with a measured cgroup peak of 10.62 GiB and zero OOM kills. This ran
against the retained EAS native project with cached Java/Kotlin tasks; the fresh
cloud build below verifies the complete development profile.

An incremental rebuild on 2026-10-27 included the current `react-native-view-shot`
6.1.1 dependency and completed in 3m 9s. Its APK contains all four ABIs and passes
Android APK signature verification; cgroup memory counters report zero OOM kills.
Installation and runtime behavior remain untested.

The fresh SDK 58 Android development cloud build finished successfully on
2026-10-27. The worker ran the configured command above, compiled all four ABIs,
completed Gradle in 40m 18s, and uploaded the APK. EAS reports `FINISHED` with no
build error; all 799 actionable tasks executed. This validates the memory limits
on the existing medium worker; device execution remains untested.

- [Build 6b702a67-2f2c-4db3-bbcb-b958183bd80e](https://expo.dev/accounts/hyrkul/projects/likan/builds/6b702a67-2f2c-4db3-bbcb-b958183bd80e)
- [SDK 58 Android development APK](https://expo.dev/artifacts/eas/EAruSzUQABzjDoBcggqWTCwjObUJPJd-ndVvKvJvLK4.apk)

## Skia 2.15.2 Android development build — 2026-10-27

Submitted the current SDK 58 source with Expo 58.0.19 and Skia 2.15.2 using the
existing `development` profile, remote Android signing credentials and the
current `yarn.lock`. EAS accepted
[build f6aa826d-0349-4704-aa39-9af52a9711ee](https://expo.dev/accounts/hyrkul/projects/likan/builds/f6aa826d-0349-4704-aa39-9af52a9711ee)
at 14:42 UTC; its verified submission status was `IN_QUEUE`.

Typecheck, zero-warning lint, formatting of the changed files and all 20 Expo
Doctor checks passed before submission. Native compilation and device behavior
remain pending for this Skia version; the completed builds above used 2.14.0.

## Historical SDK 57 build records

Requested 2026-10-03 after the global checks passed. Used the existing `development` profile with `developmentClient: true`, internal distribution, and the development environment. EAS login and linked project were verified.

## Android

The first build failed at `:app:processDebugResources`: `drawable/splashscreen_logo` was missing. The installed SDK 57 splash plugin references this drawable in its theme even when no image is configured. Fixed `app.json` by setting the existing `assets/images/splash-icon.png`, width 200, and `contain` resize mode.

Verified a fresh isolated Android prebuild generates the logo in all five density folders. `npm run check` passed (typecheck, lint, formatting, 73 tests). No generated native files were edited by hand.

Replacement submitted with existing remote signing credentials. Verified final EAS state: `FINISHED`, no build error, with build artifact upload completed. Native compilation and APK packaging succeeded; installation and device behavior remain unverified.

- Replacement build ID: `3bb7e03e-5414-49ce-8749-1b76b03791a3`
- [Replacement build status and installation artifact](https://expo.dev/accounts/ybenabdallah/projects/likan/builds/3bb7e03e-5414-49ce-8749-1b76b03791a3)

- Failed build ID: `bb2fb613-9756-47c7-9533-a934b1f9e61c`
- App ID: `com.hyrkul.likan`
- [Build status and installation artifact](https://expo.dev/accounts/ybenabdallah/projects/likan/builds/bb2fb613-9756-47c7-9533-a934b1f9e61c)

## iOS configuration

The iOS simulator development build submitted on 2026-10-10 failed during prebuild because the installed React Native Firebase config plugin requires `expo.ios.googleServicesFile`. Build ID: `64f44088-ab45-4e15-92c1-f79118d58c37`.

The subsequent simulator build compiled with a placeholder plist, but the user
reported that it closes before the splash screen. The Firebase config plugin
calls `FirebaseApp.configure()` before React Native starts. Firebase iOS SDK
`12.18.0` rejects the placeholder `GOOGLE_APP_ID` with a native exception.

Firebase has no current application consumers, so the startup repair removes
its bootstrap plugins and iOS Google-services reference. `expo.autolinking.ios.exclude`
keeps `@react-native-firebase/app` and `@react-native-firebase/messaging` out of the
iOS binary. Their npm packages remain installed for future features. The obsolete
Firebase framework/linking overrides are also removed. The placeholder file remains
in the repository but is not bundled or used by the new iOS build.

Android keeps its valid `google-services.json` and both Firebase native modules.
Expo's default plugins copy the JSON and configure the Google Services Gradle
plugin from `android.googleServicesFile`; the removed Firebase plugins were
redundant for this project's Android settings. Android native config introspection
is unchanged after this repair.

Replacement [iOS simulator build 1f0c2bdb-b8c6-4b5f-83db-527d05a4baba](https://expo.dev/accounts/ybenabdallah/projects/likan/builds/1f0c2bdb-b8c6-4b5f-83db-527d05a4baba)
finished successfully with the existing `development` profile and cleared cache.
[Download the replacement simulator app](https://expo.dev/artifacts/eas/H-kPam29-3hFRILDdwXnUYNH-zkEyTV8TGtwSQYSM9c.tar.gz).
Install this replacement; the previous iOS artifact contains the
invalid bootstrap and cannot be corrected by a Metro reload.

To enable Firebase on iOS later, obtain the Firebase-generated plist for
`com.hyrkul.likan`, restore its native plugins and framework configuration, remove
the iOS autolinking exclusions and create a new native build. Reference's plist
identifies `com.hyrkul.foodiya` and cannot be reused by changing only the bundle ID.
Apple device signing and provisioning remain unverified.

The remote development environment now provides `EXPO_PUBLIC_API_URL`. The dev
client's Metro server also loads the project's local development environment
when serving JavaScript. See [the 2026-10-10 cleanup verification](build-verification.md)
for fresh builds of the unpatched dependency set and runtime verification limits.

## iPhone Duo display support — 2026-10-21

All iOS build profiles pin `macos-tahoe-26.6-xcode-27.1` so builds use the
iOS 27.1 SDK. SDK 57's default Xcode 26 image leaves the app in iPhone Duo's
compatibility window. Building with iOS 27.1 opts the app into using the full
display; setting `ios.requireFullScreen` does not select that SDK.

`app.json` enables `expo-build-properties`' `ios.enableSceneSupport` option.
The locked Expo `57.0.27` and build-properties `57.0.22` support this SDK 57
migration. Prebuild generates the scene manifest and moves React Native startup
to Expo's scene delegate, which creates its window from `UIWindowScene` instead
of `UIScreen.main.bounds`. Keep these changes in config rather than editing
generated iOS files. The minimum supported iOS version remains unchanged.

Create and install a new iOS binary after this change. Metro reloads and EAS
Update cannot change an installed binary's build SDK or native scene lifecycle:

```sh
# Simulator development client
npx eas-cli@latest build --platform ios --profile development

# Signed physical-device preview
npx eas-cli@latest build --platform ios --profile preview
```

After installation, verify a cold launch, folding/unfolding, rotation, keyboard
access, navigation and asymmetric safe areas on iPhone Duo. Full display rendering
and native compilation still require verification with the new binary.

References: [Apple's iPhone Duo preparation guide](https://developer.apple.com/iphone-duo/prepare/),
[Expo SDK 57 scene support](https://docs.expo.dev/versions/v57.0.0/sdk/build-properties/#pluginconfigtypeios),
and [EAS build images](https://docs.expo.dev/build-reference/infrastructure/#ios-server-images).

Local verification passed: TypeScript, zero-warning lint, Expo config introspection
and the scene-startup transformation applied to the installed SDK template. No new
cloud build or native device test was run for this change.

## Google Play store updates

The root layout enables `useStoreUpdates` after the launch screen exits. On
Android release builds, it checks Google Play once per mounted app session and
starts the native update flow when an update is available. The package chooses
a permitted flexible/immediate flow from Play's update priority (4 or higher
prefers immediate). The user accepts the Google Play prompt before updating.
The package completes a flexible update after its download, which can restart
the app. No OTA update service is involved.

Debug builds and iOS skip the hook. Loading the native module is deferred and
guarded so missing modules, offline checks and installs that are not eligible
for Play updates do not block startup. A dismissed prompt or failed check is
not retried on every foreground event; a new cold launch tries again. If a
check finishes while the app is in the background, it waits for foreground
before checking again or presenting an update.

`expo-in-app-updates` is pinned to `0.13.0`. This integration was added on SDK 57;
the source now targets SDK 58.
The package's release was developed with SDK 58 and Expo Modules 2.0; its peer
dependencies accept this installation, but native compatibility still requires
verification in a new Android build. The native module is autolinked;
no config plugin, App Store ID or generated native source edits are needed for
this Android integration. iOS autolinking explicitly excludes the package while
App Store update support is disabled. Build and install a new Android binary to include it. Existing
development clients cannot acquire native modules through a Metro reload.

For device testing, use a release build installed through Google Play or its
internal app sharing flow. A sideloaded development APK is not sufficient:

1. Install an older release containing this integration through internal app
   sharing. The tester must own the app in Google Play.
2. Upload a build with the same application ID/signing key and a higher
   `versionCode`. Open its sharing link without installing the newer build.
3. Cold-launch the older app and accept the update prompt. Check dismissal,
   offline startup and returning from the background as well.

Internal app sharing does not support `inAppUpdatePriority`; use a Play test
track when verifying priority-based immediate updates. Native compilation and
the actual Play download/install flow still require a new build and device
verification. See the [package documentation](https://github.com/SohelIslamImran/expo-in-app-updates)
and [Google's testing guide](https://developer.android.com/guide/playcore/in-app-updates/test).

Local verification passed: typecheck, zero-warning lint, formatting, all 135
tests (including nine store-update lifecycle tests), Android Hermes production
export and Android/iOS autolinking checks. These checks do not verify native
compilation or a live Google Play installation.
