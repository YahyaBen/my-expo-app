# Expo white-label template

iOS and Android starter using Expo SDK 58, Expo Router and native Expo UI.
Development opens the on-device Storybook catalog. Preview and production builds
open a single neutral UX wireframe. Product, auth, account, settings and tab screens
have been removed; shared components and optional service/workflow helpers remain.

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
npm run start:app           # View the release wireframe in development
npm run storybook:dev       # Alias for the default development catalog
npm run storybook:generate  # After adding or moving stories
npm run check              # Typecheck, lint and formatting; no automated tests
```

Keep `testID` props on components and interactive stories. This template has no
test runner or test suites.

## Build your clone with EAS

Change only `eas.projectId` in [config/brands/template.json](config/brands/template.json)
from the empty string to your own EAS project UUID. Create that EAS project with
slug `expo-mobile-template` to match this starter. The empty slot keeps local
Storybook usable without linking someone else's project.

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
