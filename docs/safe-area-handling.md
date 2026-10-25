# Safe-area handling

The current tab layout uses Expo Router Tabs with a native Expo UI dock. See the
[navigation architecture](architecture.md) for route ownership.

## Ownership

| Surface                        | Top                 | Bottom              | Sides               |
| ------------------------------ | ------------------- | ------------------- | ------------------- |
| Main tab content               | Screen              | In-flow tab dock    | Screen              |
| Detail with shared page header | Screen              | Screen              | Screen              |
| Authentication                 | Screen              | Screen              | Screen              |
| Account screen                 | Screen              | Screen              | Screen              |
| Launch/session restoration     | Content frame       | Content frame       | Content frame       |
| Native sheets                  | Native presentation | Native presentation | Native presentation |

`screenInsets` describes inset ownership without fixed device sizes. The custom
bar receives actual bottom/side values from Router's `BottomTabBarProps` and adds
them once. Tab routes no longer wrap content in a native-tabs `SafeAreaView`.
Home and the example pages use `PageScreen tab`; Settings uses its tab mode to
omit bottom system padding and Back. Page frames retain top/side ownership.

The dock's 84-point/dp frame contains the entire raised 76-point/dp button and
the 56-point/dp tab row in one native layout. Its negative 28-point/dp top margin
allows content to remain visible beside the raised button; that region has a
transparent background. The tab row and system bottom inset reserve screen
height, while the full native frame retains the circle's touch bounds.
Tab scroll content adds only the shared `tabBarRaisedHeight` clearance after its
last action, rather than padding for the entire dock. `PageScreen tab` supplies
inner scroll padding; Settings tab mode uses its last section footer. The dock
hides while the keyboard is visible. See the
[navigation contract](../.agents/skills/foodiya-ui-navigation/SKILL.md) for geometry ownership.

Expo Router already provides the root `SafeAreaProvider`; the app does not add
another provider around individual pages. Hooks handle changing insets with navigation
transitions. Backgrounds and Skia artwork may reach the edges; controls remain
inside protected content bounds. Portrait remains the app's configured
orientation; asymmetric side-inset cases cover possible tablet/window layouts
and future rotation support without changing that setting.

The page Host opts out of automatic SwiftUI safe areas because the outer frame handles them. RN keyboard padding handles overlap on iOS and Android. Tab and detail pages both use the shared content header, so no native-header keyboard offset is needed. The system-inset frame wraps the keyboard frame so keyboard padding cannot replace its bottom safe area. Authentication uses the same keyboard padding around its native Host. In the installed Android Expo UI implementation, the Host's keyboard-aware viewport measurement only clamps unbounded constraints; it does not guarantee avoidance for these flex-sized screen Hosts. Native bottom sheets keep their presentation's insets and keyboard behavior. The Host wrapper's global defaults are unchanged.

Old 56-point tab-bar offsets were removed from account, maps, Skia, error fallback, and Storybook screens. Map controls receive actual top/side padding; launch artwork shrinks to fit the available content area.

## Documentation

The tab integration follows the
[JavaScript tabs guide](https://docs.expo.dev/router/advanced/tabs/) and installed
Expo Router and Expo UI implementations. See also the
[SDK 57 safe-area-context reference](https://docs.expo.dev/versions/v57.0.0/sdk/safe-area-context/)
and [Expo UI Host reference](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/host/).
Native rendering, keyboard behavior and device geometry still require device
checks.

## Historical verification

The records below describe earlier layouts and retired test/flow tooling; they
do not establish native verification of the current tab layout.

Lint, typecheck, all 70 automated tests, and iOS/Android production JavaScript/Hermes exports pass. Storybook registration was regenerated. The Android SDK's `adb devices` reports no connected devices; native checks below have not run.

Four layout regression tests cover notched tab pages, native-header details, asymmetric changing side insets, and zero/gesture/three-button bottom insets. These test the shared ownership contract, not native geometry. Native Storybook's Pages/Navigation shell includes NotchedPhone, LandscapeCutout, NativeHeaderDetail, and LongContent fixtures. The inset fixtures override JS context only; they do not simulate an operating system notch, rotate a device, or render a native stack header.

For the shared keyboard-padding change, lint, typecheck, and all 26 layout checks pass; Storybook registration was regenerated. Pages/Navigation shell's KeyboardAccess story and `.maestro/storybook/keyboard-access.yaml` cover auth submission and repeated multiline-page saves without first dismissing the keyboard. Android execution was attempted on `emulator-5554`, but concurrent screen switching interrupted the first run and Maestro lost its device-server connection on retry. The complete native flow remains unverified, as does iOS keyboard behavior.

Before release, inspect iOS and Android with gesture and three-button navigation, a notched phone, a tablet/window resize, large text, and the keyboard open. Check the last scroll item, floating action hit area, native sheets, header transitions, and keyboard dismissal. Run the existing pages Maestro flows and capture native screenshots for comparison. Device checks require a connected device or simulator; automated JS checks cannot establish these results.

## Shared header follow-up (2026-10-04)

The root stack now hides native headers. All PageScreen pages protect the status-bar inset and render the Home title style over the same app background and shared PageMotionOverlay. Standalone pages add a native back arrow beside their title instead of a second toolbar and a bottom Back link. HeaderWithBackArrow and DarkHeaderWithBackArrow replace the former NativeHeaderDetail fixture, with explicit theme and counted activation. The header Maestro flow and updated collections flow cover native arrow activation and return to the prior tab; these remain unexecuted without a connected device.
