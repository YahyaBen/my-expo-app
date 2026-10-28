# EAS development builds

The source now targets SDK 58; see the
[current SDK baseline](development.md#sdk-and-native-verification-baseline).
The standard profiles now select the unlinked default template and its grayscale
UX wireframe. Fill only `eas.projectId` in `config/brands/template.json` to link
your clone to its own project. The EAS slug must match `expo-mobile-template`.
The owner and backend URL are optional for a starter build; EAS account access
and normal platform signing still apply.
Earlier SDK 57/58 build records describe retired client configurations. They
are historical evidence and do not validate the current template binary.

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
policy or build channel. The existing Android Google Play update hook is separate.
Before adopting OTA, isolate each client's project and channel and define native
compatibility through a
[runtime version policy](https://docs.expo.dev/eas-update/runtime-versions/).

## Android development build limits

The development profile keeps one Gradle worker and disables parallel project
execution. Its init script, `config/android-build-memory.gradle`, limits native
CMake/Ninja concurrency for retained modules, including Skia. The installed Skia
alias and existing ABI settings are unchanged.

Earlier compilation results and SDK migration observations are retained as
[historical native build evidence](archive/native-build-evidence.md). They belong
to retired client binaries; create a matching template build for current native
behavior.
