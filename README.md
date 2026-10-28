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

Copy `.env.example` to `.env.local` and select `APP_BRAND` and `APP_VARIANT`.
The default local and EAS-profile brand is the unlinked `template`.
Other client manifests remain available through explicit selection. Set
`EXPO_PUBLIC_API_URL` for the real backend. Link the template to its own EAS
project before cloud builds; production also requires its HTTPS API origin.
Restart Metro after changing brand or variant selection. See
[brand configuration](docs/development.md#brand-and-environment-configuration).
Use `npx expo install <package>` for SDK-compatible dependencies.
Run `npm run typecheck` and `npm run lint` before finishing a change.

Enable `EXPO_PUBLIC_ENABLE_DEV_SCREENS=true` to browse the native catalog, or use
`npm run storybook:dev` for the development-only fixture browser and Controls.
See [component previews](docs/storybook.md) for matching build/brand setup.

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
