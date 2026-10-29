This is an Expo/React Native application for iOS and Android. Prioritize native
behavior, performance and compatibility across both platforms.

## Simplicity and performance

- Keep it simple: use the smallest clear implementation and reuse existing owners.
  Add abstractions, providers, dependencies or persisted state only for a current need.
- Treat startup, responsiveness, memory and idle work as acceptance criteria.
  Keep unused integrations out of startup and developer tooling out of releases.
- Preserve native behavior, accessibility and stable `testID` props. Keep this
  template free of automated test suites; use static checks and native verification.
- Measure before optimizing. Do not add speculative memoization or caching, or
  claim device performance gains from source inspection or bundle size alone.

## Skills and documentation

- Find the skill matching the task in [the skill index](docs/skills.md).
  Read only the relevant skills; each owns one responsibility and works independently.
- Feature boundaries belong to [Template implementation](.agents/skills/template-skill-implementation/SKILL.md).
  Performance work uses [Template performance](.agents/skills/template-skill-performance/SKILL.md).
- Keep component contracts in their matching skills and implementation in source.
  Do not add per-component READMEs or chain skills through links to other skills.
- Use [the documentation index](docs/index.md) for project guides and follow
  [documentation ownership](docs/documentation.md) when editing guidance.

## Expo APIs

Before changing Expo, EAS or React Native API usage:

1. Read the `expo` major version in `package.json`.
2. Fetch matching documentation at `https://docs.expo.dev/versions/v<major>.0.0/`.
3. Use `https://docs.expo.dev/llms.txt` to locate other official pages. Check
   installed types; do not rely on remembered APIs.

## Commands and verification

Use `bunx` instead of `npx` when `bun.lock` exists. Install SDK-compatible packages
through `npx expo install <package>`, rather than a package manager's add command.

```sh
npx expo start
npx expo lint
npx tsc --noEmit
npx expo-doctor
npx expo install --fix
```

Run lint and typecheck before declaring work complete. Format edited files and
report native-device, live-backend and static verification separately.

## Navigation and native builds

- Use Expo Router. Keep screens/navigators in `src/app/` and reusable code outside
  it. Import `Link`, `router` and `useLocalSearchParams` from `expo-router`.
- Configure generated native behavior through `app.json` and config plugins;
  never create or edit generated `ios/` or `android/` projects by hand.
- Native libraries require a matching development build; Expo Go contains only
  bundled modules. Metro reloads and OTA updates do not replace native binaries.
- Use EAS for cloud build/sign/submit and OTA delivery. Run commands through
  `npx eas-cli@latest <command>` or `bunx eas-cli <command>` in a Bun project.
- Prefer supported Expo modules and preserve intentional installed dependencies.
  See [Router](https://docs.expo.dev/router/introduction/) and
  [EAS](https://docs.expo.dev/eas/) for official guidance.
