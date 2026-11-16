# Expo white-label template

iOS and Android starter using Expo SDK 58, Expo Router and native Expo UI.
The app opens Discover with its native Home, Components and Settings tabs.
Components → App flows lists Login and Register as optional full-screen examples
with email/password and Google options. Browsing the template requires no account.
See [authentication setup](docs/auth-forms.md) for the API contract and Google credentials.

Keep it simple. Native performance is a primary requirement: load only what the
active feature needs, preserve idle/motion guards and measure before optimizing.

## Clone and run

Use Node 22.18+, 24.3+ or 26+ and npm with the committed `package-lock.json`.

```sh
npm ci
npm start
```

Install a matching development build first; Expo Go does not contain all the native
modules. Browse examples through the Components tab and Home tab.
Component examples and demo artwork work offline. Authentication requires a reachable
API; Google also requires OAuth credentials and a matching native build.

```sh
npm run check              # Typecheck, lint and formatting
```

Keep `testID` props on components and interactive examples. This template has no
test runner or test suites.

Edit theme colors directly in [ux.ts](src/constants/themes/ux.ts), component color
roles in [tokens.ts](src/constants/themes/tokens.ts), spacing/radii in
[layout.ts](src/constants/layout.ts), and typography in
[design.ts](src/constants/themes/design.ts). See
[theme values](docs/appearance-themes.md#theme-values) for ownership and previewing.

## Build your clone with EAS

Set `eas.owner` and `eas.projectId` in
[config/brands/template.json](config/brands/template.json) to your EAS account
and project UUID. Use the slug `hyrkul-wlui-template` to match this starter.
You can clear the ID for local development without linking an EAS project.

```sh
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile development
# Install the development build, then:
npm start
```

Use `development` for Android devices/iOS Simulator, `development-device` for an
iOS device, `preview` for an internal release, and `production` for store binaries.
EAS still needs account access and platform signing credentials. No cloud build is
triggered by local setup.

Android push uses `expo-notifications` with variant-specific Google services files;
see [Expo push setup](docs/eas-development-builds.md#expo-push-notifications) for
credentials and testing. Remote iOS push setup is pending. A distinct store app
needs unique native identifiers, branding and matching platform credentials.
Identity changes live in the brand manifest; changing an EAS UUID cannot change
an app's native identity.

Animations, gestures, sheets, launch transitions and reduced-motion handling remain
available through the shared UI and app component pages. Check native push/Back,
themes, dark mode and RTL on both platforms. See [EAS setup](docs/eas-development-builds.md).

## Project guidance

- [Documentation index](docs/index.md) and [development](docs/development.md)
- [Architecture](docs/architecture.md) and [native UI](docs/ui.md)
- [Agent rules](AGENTS.md), [skill index](docs/skills.md) and [documentation ownership](docs/documentation.md)

Install SDK-compatible packages with `npx expo install <package>`. Installed
dependencies remain available for future features. Component contracts belong
in their matching `.agents/skills/` files; implementation belongs in source.
