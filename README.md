# Expo white-label template

iOS and Android starter using Expo SDK 58, Expo Router and native Expo UI.
Development opens the on-device Storybook catalog. Preview and production builds
open the Template page with a native dock and circular component menu. Tap its
center action to browse components: swiping shows the page name and tapping an
icon pushes its native example. Shared components and optional service/workflow
helpers remain available independently of Storybook.

Keep it simple. Native performance is a primary requirement: load only what the
active feature needs, preserve idle/motion guards and measure before optimizing.

## Clone and run

Use Node 22.18+, 24.3+ or 26+ and npm with the committed `package-lock.json`.

```sh
npm ci
npm start
```

Install a matching development build first; Expo Go does not contain all the native
modules. Storybook opens automatically with its sidebar and Controls. Start with
**Wireframes → Home Sections → Cards** for the former Home compositions and stable
`home-*` selectors. Demo artwork works offline. No backend or `.env.local` is needed.

```sh
npm run start:app           # View Template and its component menu in development
npm run storybook:dev       # Alias for the default development catalog
npm run storybook:generate  # After adding or moving stories
npm run check              # Typecheck, lint and formatting
```

Keep `testID` props on components and interactive stories. This template has no
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
You can clear the ID to use local Storybook without linking an EAS project.

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

The existing `google-services.json`, `GoogleService-Info.plist` and `firebase.json`
are preserved. They are not attached to the neutral template identity. A distinct
store app needs unique native identifiers, branding and matching Firebase files
if Firebase is enabled. Those optional identity changes live in the same brand
manifest; changing an EAS UUID cannot change an app's native identity.

Animations, gestures, sheets, launch transitions and reduced-motion handling remain
available through the shared UI and Storybook. **Motion → Transitions** demonstrates
native push/Back using the template wireframe. Theme, dark-mode and RTL stories are
included. See [Storybook](docs/storybook.md) and [EAS setup](docs/eas-development-builds.md).

## Project guidance

- [Documentation index](docs/index.md) and [development](docs/development.md)
- [Architecture](docs/architecture.md) and [native UI](docs/ui.md)
- [Agent rules](AGENTS.md), [skill index](docs/skills.md) and [documentation ownership](docs/documentation.md)

Install SDK-compatible packages with `npx expo install <package>`. Installed
dependencies remain available for future features. Component contracts belong
in their matching `.agents/skills/` files; implementation belongs in source.
