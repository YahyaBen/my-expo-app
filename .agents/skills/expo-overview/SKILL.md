---
name: expo-overview
description: Configure this project's Expo SDK, native dependencies, brands and build environments.
license: MIT
---

# Expo project setup

Own SDK compatibility and build configuration. Application workflows and individual
control contracts are outside this skill's scope.

- Read `package.json` and the active lockfile before changing dependencies.
  Fetch `https://docs.expo.dev/versions/v<major>.0.0/` for the installed Expo
  major; use `https://docs.expo.dev/llms.txt` to locate other official guidance.
  Check installed types before using an API.
- Install compatible packages through `npx expo install <package>`; use `bunx`
  when `bun.lock` exists. SDK upgrades require migration review and aligned native
  dependencies, rather than changing version strings alone.
- Keep generated `ios/` and `android/` configuration in `app.json`,
  `app.config.js` and config plugins. Do not hand-edit generated native projects.
- A native dependency change requires a matching development build. Metro reloads
  and OTA updates do not replace the native runtime.
- Use the existing brand resolver and EAS profiles. Read
  [configuration boundaries](references/configuration.md) when changing identity,
  assets, environment selection or public native metadata.
- For EAS operations, inspect the selected brand's resolved project ID and account
  before building, submitting or updating. Run the CLI as `npx eas-cli@latest`
  or `bunx eas-cli` in a Bun checkout.
- Keep installed dependencies unless removal is part of the requested change;
  this starter deliberately retains packages for future features.

After changes, run lint and typecheck. Validate affected brand/variant configs and
dependency compatibility. Report native build and device results separately from
static checks.
