# Bundled assets

Each brand manifest selects `presentation.headingFont` and
`presentation.launchArtwork`. The public metadata in
[`config/brand-assets.json`](../config/brand-assets.json) describes registered
files, platform font names and supported languages. Config resolution validates
the selected IDs and files. [`src/config/brand-assets.ts`](../src/config/brand-assets.ts)
owns literal Metro imports and the small selection helpers used by the root,
page titles, auth headings and launch screen. Native modules never import the Node resolver
or full brand manifests.

| Brand      | Heading font             | Registered launch artwork | Launch mode |
| ---------- | ------------------------ | ------------------------- | ----------- |
| `template` | Native system typography | `assets/images/icon.png`  | Minimal     |

`assets/animations/blue-pepe.lottie` remains bundled and registered as `bluePepe`.
Branded Lottie launch support is retained: a manifest can select
`presentation.launch: "branded"` and `presentation.launchArtwork: "bluePepe"`.

The template image is an existing Expo placeholder. Replace it with client artwork
before distribution. Native app/adaptive icons and the native splash are separate
manifest fields; changing in-app artwork does not update those assets.

## Fonts

`app.config.js` derives the `expo-font` plugin's files from the selected font.
The root's `useFonts` map uses the same selection; system typography produces an
empty map. Page headers, auth headings and launch use platform family names from
the metadata. Page/auth title sizes still come from the active theme's type
presets; their foreground uses its primary accent. Other text controls keep
native typography.

If loading the optional heading font fails, startup continues with native
typography. The helper returns a family only after its runtime font is loaded;
the native splash cannot remain held behind a font-error boundary. Minimal
launch does not mount the registered artwork, though its literal asset remains
bundled for branded previews. See the [launch contract](../.agents/skills/template-skill-ui-launch-screen/SKILL.md).

Android derives its embedded family from the filename. iOS uses the font's
embedded name, which can differ. The retained `Urbanist-Bold.ttf` is a static 700-weight
TrueType font with family `Urbanist`, subfamily `Bold`, and PostScript name
`Urbanist-Bold`. Both platform entries use `Urbanist-Bold`. The retained Inter
Black asset uses `Inter-Black`; the alias `InterBlack` does not occur in its name
table. Keep platform entries explicit, inspect replacement files' metadata and
verify them on both platforms. Config validation and JavaScript exports cannot
establish actual font rendering.

Urbanist Bold comes from the official
[Expo Google Fonts static Urbanist package](https://github.com/expo/google-fonts/tree/master/font-packages/urbanist/700Bold).
Its SHA-256 is
`c06728d590de58ab0ccf39c4ea80428b2976355239f2b9e025095bc065d297e9`.
The Urbanist Project Authors' SIL Open Font License 1.1 is retained in
[`assets/fonts/Urbanist-OFL.txt`](../assets/fonts/Urbanist-OFL.txt), sourced from
[Google Fonts](https://github.com/google/fonts/blob/main/ofl/urbanist/OFL.txt).
The static file remains available as a registered heading font on SDK 58. SDK 58 also supports
variable fonts, but changing the registered font still requires checking its
metadata, native embedding and rendering on both platforms.

The bundled heading font is enabled only for `en` and `fr`. Arabic headings use
native fallback; do not force a Latin font on Arabic or all body text. Adding a
language requires a font with appropriate glyphs and native readability checks.

## Change or add artwork and fonts

1. Select an existing asset ID in the brand manifest when possible. A new brand
   using registered assets needs no screen edits.
2. For a new asset, add its bundled file and metadata, then add a literal import
   or `require` to the native registry. Its typed keys must match the metadata.
   Never construct `require(manifestPath)` dynamically. The current launch
   renderer supports Lottie and image assets.
3. Restart Metro with the intended `APP_BRAND`/`APP_VARIANT`; selection is fixed
   for that app run. Changes to embedded fonts, font plugin configuration, native
   identity, icons or native splash require a matching native build. An OTA
   update cannot replace those native settings.
4. Run `npm run check`, resolve both affected brand configurations and export
   native JavaScript. Then check native headings, image/Lottie loading, Arabic,
   accessibility and reduced motion on iOS and Android. See the component skills
   for composition and selectors.

Metro can bundle all statically registered sources, even when only one is
selected. This registry does not promise per-brand asset removal or runtime
tenant switching.

Header paths for Dunes, Ribbon and Rain remain in the shared page geometry.
`assets/images/header-motion/rain.svg` is a static snapshot; production builds its
animated paths and native blur mask from numeric commands. Removed Smoke and
Water SVGs are no longer bundled. Dunes, Ribbon, Rain and the iOS SVG material
mask are retained. The branded launch edge keeps cached paths and its drift;
minimal launch does not mount artwork or that edge. The existing
[page](../.agents/skills/template-skill-ui-page/references/page-guide.md) and
[launch](../.agents/skills/template-skill-ui-launch-screen/SKILL.md) skills own these
presentation contracts.
