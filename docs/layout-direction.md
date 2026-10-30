# Live LTR / RTL

Arabic selected in **Wireframes/Preferences** applies RTL; French and English
apply LTR. Language changes preserve mounted drafts and navigation. Explicit
direction controls in native Storybook provide session-only layout previews.

`LayoutDirectionProvider` updates Expo Router's public `LocaleProvider` and the
root React Native view's `direction`. Every `UniversalHost` receives an explicit
`layoutDirection` on each render. Avoid `I18nManager.forceRTL` / `allowRTL` and
reload APIs: global direction changes require a subsequent app launch.

`PageFrame` retains a title/back header and consumes the top safe area once;
content owns the remaining edges. Isolated stories and sheets use distinct
direction-control selectors. Native sheets cover the page while presented; the direction
composition story includes an in-sheet switch for that scenario.

Compose content in the shared Expo UI Row / Column controls. Use logical start /
end offsets for React Native alignment. Keep physical safe-area insets and map
coordinates physical. The input's existing `leftIcon` / `rightIcon` slots behave
as leading / trailing; Expo UI already maps input padding to start / end.
The Android page back arrow is selected explicitly, retaining the workaround for
SDK 57's XML icon loader ignoring the vector's `autoMirrored` attribute. Recheck
that behavior on SDK 58 before removing the selection. iOS uses the semantic `arrow.backward`.

Use the shared `BottomSheet` export from `@components/ui`. Expo's universal sheet
creates its own native Host; the shared wrapper bridges content back through a
`UniversalHost` so open sheets follow theme and direction changes.

Current native fixtures include [page RTL](../.rnstorybook/stories/components/page-screen.stories.tsx),
[tab direction](../.rnstorybook/stories/components/navigation.stories.tsx) and
[live button direction](../.rnstorybook/stories/components/button.stories.tsx).
Check draft preservation, open-sheet updates, native appearance, text cursor/focus
and back gestures manually on iOS and Android. Preserve the existing selectors;
this template has no automated test suite.

Sources: [Expo localization](https://docs.expo.dev/guides/localization/),
[SDK 58 Host](https://docs.expo.dev/versions/v58.0.0/sdk/ui/universal/host/),
[React Native I18nManager](https://reactnative.dev/docs/0.88/i18nmanager).
