# On-device Storybook

Storybook is the development entry for this iOS/Android template. The old `/ui`,
`/ui-component/*`, auth, account and tab routes have been removed.

## Launch

Install a matching development build, then run `npm start` or
`npm run storybook:dev`. The cross-platform launcher selects the development
variant, enables Storybook and starts Metro with `--dev-client --clear`.
Extra arguments pass through, for example `npm start -- --port 8093`.
No environment files are required or rewritten.

The root redirects to `/storybook`, with no extra app header around the explorer.
The initial selection is **Wireframes/Home Sections/Cards**; subsequent selection
is saved by Storybook. Use its sidebar to browse:

- **Components**: individual native controls, typography, layout, themes and feedback.
- **Forms**: local form validation and OTP demonstrations without a backend.
- **Wireframes/Home Sections**: the former Home gallery and sample rows, retaining IDs.
- **Wireframes/Component Gallery**: complete interactive native compositions, including camera.
- **Wireframes/Preferences**: language, appearance, motion and device controls.
- **Wireframes/Template**: the single release wireframe.
- **Motion/Transitions**: native push/Back plus header expansion and reduced motion.

`npm run start:app` explicitly disables Storybook to work on the wireframe.
`EXPO_PUBLIC_STORYBOOK_ENABLED=false` also disables the catalog for a direct Expo
start. Restart with a cleared Metro cache after switching modes.

For a focused canvas, use
`/storybook?storyId=components-button--playground&canvas=true`. Omit `canvas=true`
for the sidebar/Controls. The canvas preserves individual native selectors.
The root waits for resources and page layout before revealing the app.

## Isolation and native effects

Stories and all demonstration compositions live in `.rnstorybook/`. Shared UI never
imports fixtures. Story themes use in-memory providers. Preferences stories can
change the saved language and device feature switches; real permission requests,
camera, one-shot location and notification actions happen only when requested.
They are device tools and do not require an auth session or backend.
Image/carousel examples use deterministic inline SVG wireframes and work offline.
Inline SVG image sources use Base64 data URIs: the Android `expo-image` data
loader decodes their payload as Base64. Keep encoding in the preview fixture
helper so production photo components continue to receive ordinary image sources.

Existing animation families include carousels, photo grid expansion/dismissal,
sheets, skeletons, launch reveal, decorative headers and OTP face feedback.
Motion respects background activity and reduced-motion settings. Inspect light,
dark, RTL, large text, disabled controls and touch bounds on both native platforms.
Content motion also waits for launch completion and pauses on retained unfocused
story canvases. **Motion/Transitions/PausedContent** exercises the shared gate
without unmounting its draft or native content.

## Release boundary

The runtime flag requires `__DEV__`. Metro's `withStorybook` integration is disabled
when `NODE_ENV=production` or the public flag is false. The entry's conditional
require is removed in release mode, and the root protects the Storybook route.
EAS development profiles enable Storybook; preview and production disable it.
The brand resolver rejects explicit Storybook enablement outside development.

All showcase compositions now live behind this tooling boundary; they are no
longer ordinary Router screens. Inspect both native release source maps after
entry, Metro or Router changes:

```powershell
$env:APP_VARIANT = 'preview'
$env:NODE_ENV = 'production'
$env:EXPO_PUBLIC_STORYBOOK_ENABLED = 'false'
npx expo export --platform all --clear --source-maps --output-dir .expo/template-release --max-workers 2
```

Check all source-map `sources`, including indexed sections, for `.rnstorybook`,
`node_modules/@storybook` and `node_modules/storybook`; none should remain.
Use the preview variant for this local check so no EAS project ID is needed.
Production configuration additionally requires a project ID.

## Maintenance

Each component, form and performance fixture has one **Playground** story. Use
Controls for variants, text, colors, appearance, direction and other supported
props; use Actions for callback logs. When a component needs a distinct
composition, its `example` control selects it within the same Playground.
Wireframes and motion scenarios remain separate compositions.

Use the production public component API, explicit local state and stable selectors.
Run `npm run storybook:generate` after moving/adding stories. Regenerate, typecheck,
lint and format before committing. There is no automated test runner or `play`
suite. Registration and successful exports establish static/module boundaries;
they do not prove native rendering, animation quality, keyboard or gestures.

In Page Header/Playground, select the `native-back-return` example to push
`/?preview=true` to the actual wireframe route. Its header Back or Android system
Back returns to the retained story. Check draft/count/scroll preservation and
native blur after repeated trips. Use `colorProbe` with scrolling or overlay
controls to inspect blur over primary/secondary cards. The Stacked Carousel
`opaque-cards` dataset checks solid front-card visibility during slow drags and
after settling; repeat with compact sizing, RTL and Reduce motion.
