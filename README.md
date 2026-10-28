# Expo mobile starter

An iOS and Android bootstrap application built with Expo SDK 58, Expo Router and native
Expo UI.

Home, native component showcase, authentication, Account and Settings form the
starting point. The default template uses white, black and gray UX tokens in
light/dark appearance, native typography and a flat header. All installed
packages are retained for future features.

## Get started

Use a supported Node release (22.18+, 24.3+ or 26+) and the committed
`package-lock.json`. npm is the package manager for this project; it applies the
dependency overrides in `package.json`.

```sh
npm ci
npm start
```

The starter runs without `.env.local`; local and EAS profiles default to the
`template` brand. Copy `.env.example` only when overriding the brand/variant or
connecting a backend. `EXPO_PUBLIC_API_URL` is optional for builds and public
screens; authentication needs a real backend. Production URLs must use HTTPS.
Restart Metro after changing brand or variant selection. See
[brand configuration](docs/development.md#brand-and-environment-configuration).
Use `npx expo install <package>` for SDK-compatible dependencies.
Run `npm run typecheck` and `npm run lint` before finishing a change.

Enable `EXPO_PUBLIC_ENABLE_DEV_SCREENS=true` to browse the native catalog, or use
`npm run storybook:dev` for the development-only fixture browser and Controls.
See [component previews](docs/storybook.md) for matching build/brand setup.

## Build your clone

Set the existing `eas.projectId` field in
[config/brands/template.json](config/brands/template.json) to your own EAS project
UUID. Use a project with slug `expo-mobile-template` to match the default
manifest. That is the only required repository setting for a starter build;
the EAS owner is optional and no backend or Firebase setup is required.

After signing in to your Expo account, run:

```sh
npx eas-cli@latest build --platform android --profile development
```

The existing `preview`, `production`, and iOS profiles use the same project ID.
EAS handles the usual account access and signing setup. For another brand,
select its manifest explicitly and supply its own project ID there.

## Find the guidance

- [Documentation index](docs/index.md): setup, architecture, UI, releases and reports.
- [Development](docs/development.md): commands, retained component fixtures and environment.
- [Architecture](docs/architecture.md): routes, features, services and shared boundaries.
- [Native UI](docs/ui.md): component selection and canonical skill links.
- [Documentation ownership](docs/documentation.md): where to maintain each kind of guidance.
- [Agent rules](AGENTS.md) and [skill index](docs/skills.md): project constraints and task-specific guidance.

Component contracts live in their existing `.agents/skills/template-skill-ui-*` skills,
with detailed references only where needed. Source folders hold code; avoid
reintroducing per-component READMEs.
