# Altarea reference and Likan theme

The `altarea` theme is selected by Likan's brand manifest. The neutral template
keeps UX Template. This reference records the public website design observed on
2026-10-23 and the values adapted to the native app. The
[appearance guide](appearance-themes.md) owns configuration and preview behavior;
component skills own the implementation contracts.

Sources: [Altarea homepage](https://www.altarea.com/) and its
[shared stylesheet](https://www.altarea.com/wp-content/themes/altarea/dist/assets/main-CHjpdwgZ.css).
Values below came from CSS custom properties, component rules and computed
styles, rather than sampling an image. The stylesheet URL is fingerprinted and
may change when the site is rebuilt.

## Website foundations

| CSS role             | Value     | Use                                                         |
| -------------------- | --------- | ----------------------------------------------------------- |
| `--color-primary`    | `#502882` | Purple headings, navigation, filled actions, feature panels |
| `--color-secondary`  | `#AA3787` | Magenta accents and alternate actions                       |
| `--color-dark`       | `#000000` | Body text and dark outlines                                 |
| `--color-white`      | `#FFFFFF` | Main canvas and inverse text                                |
| `--color-light`      | `#F6F5F3` | Warm secondary canvas                                       |
| `--color-grey-light` | `#EBEBE8` | Soft neutral surfaces                                       |
| `--color-grey`       | `#D4D4D4` | Dividers and neutral details                                |

The site uses generous whitespace, architectural photography, large bold purple
headings, small uppercase section labels and restrained line icons. News and
project cards emphasize the image and text; large feature panels sometimes have
an oversized corner on one side. The mobile header uses a circular outlined menu
button. Photographs, the Altarea logo and its decorative brand mark are website
content; Likan retains its own name and artwork.

## Website typography

Both `--font` and `--fontheading` are `Urbanist, sans-serif`. The website serves
a variable WOFF2. Body text computes to 18px, weight 400, line height 27px;
headings use weight 700 and the main heading has line height 1.2. Buttons use
16px regular text with a 24px line height. The root rem is 16px.

| CSS size token | Source value                                        |
| -------------- | --------------------------------------------------- |
| `xxs`          | `0.625rem`                                          |
| `xs`           | `0.813rem`                                          |
| `sm`           | `0.938rem`                                          |
| `base`         | `1rem`                                              |
| `md`           | `clamp(1.0625rem, 1rem + 0.2vw, 1.125rem)`          |
| `lg`           | `clamp(1.125rem, 0.875rem + 0.8vw, 1.375rem)`       |
| `xl`           | `clamp(1.375rem, 1.15625rem + 0.5859375vw, 1.5rem)` |
| `2xl`          | `clamp(1.625rem, 1.375rem + 0.78125vw, 1.875rem)`   |
| `3xl`          | `clamp(1.625rem, 0.75rem + 2.8vw, 2.5rem)`          |
| `4xl`          | `clamp(1.875rem, 0.625rem + 4vw, 3.125rem)`         |
| `5xl`          | `clamp(1.875rem, 6vw, 3.75rem)`                     |
| `6xl`          | `clamp(2.5rem, 8vw, 4rem)`                          |
| `7xl`          | `clamp(3.75rem, 1.875rem + 3.9063vw, 4.5rem)`       |

The final website heading rules map h1/h2 to `4xl`, h3 to `3xl`, and h4 to `2xl`.
At the inspected 608px viewport, the section h2 computed to 34.32px. These fluid
web sizes are reference values, not native pixel dimensions.

## Website shapes, layout and interaction

| Element or token                           | Observed value                                                                  |
| ------------------------------------------ | ------------------------------------------------------------------------------- |
| Standard button                            | 24px radius, 1px border, inline-flex                                            |
| Button padding / icon gap                  | 8px vertically, 28.8px horizontally / 8px                                       |
| Filled buttons                             | Purple, magenta or black with white text                                        |
| Outline buttons                            | Transparent with matching colored text and border; homepage uses black outlines |
| Hover                                      | Filled/outlined colors invert; native apps use platform press feedback          |
| Button focus                               | `0 0 0 2px` black ring                                                          |
| Mobile menu                                | Circular, 38px diameter at the inspected breakpoint; base rule is 48px          |
| Text fields / textarea / select            | 6px radius, 1px `#CED4DA` border, 16px vertical / 12px horizontal padding       |
| Field focus                                | White background, `#CECECE` border, 4px translucent gray outer ring             |
| Filter select                              | Square, bottom separator only                                                   |
| General radius                             | 16px                                                                            |
| Large decorative radii                     | 70px / 150px / 200px; responsive overrides include 40px / 100px                 |
| Spacing `05 / 1 / 2 / 3 / 4`               | 8 / 16 / 28 / 56 / 64px                                                         |
| Section spacing `xl / xxl`                 | 80 / 128px; small-screen overrides 40 / 64px                                    |
| Default gap                                | 16px                                                                            |
| Horizontal gutter                          | 48px; small-screen override 24px                                                |
| Container widths `sm / md / lg / xl / 2xl` | 768 / 1024 / 1180 / 1300 / 1536px                                               |
| Image ratio token                          | 4:3; individual editorial cards also use other crops                            |
| Shadow                                     | `0 16px 12px rgba(0, 0, 0, 0.1)`                                                |
| Button/menu transitions                    | 300ms color/background/border transitions                                       |
| Field transitions                          | 150ms ease-in-out border/shadow transitions                                     |

## Native mapping

The implementation extends the existing registry in
[`src/constants/themes/`](../src/constants/themes/index.ts). The
[`altarea.ts`](../src/constants/themes/altarea.ts) palette owns both appearances
and its type/shape tokens; [`design.ts`](../src/constants/themes/design.ts)
retains the original defaults for the other palettes. The usual semantic roles
also supply navigation, native Host tint, text, validation and feedback.

| Native role                      | Light               | Dark adaptation |
| -------------------------------- | ------------------- | --------------- |
| Primary fill / foreground accent | `#502882`           | `#D4B5F4`       |
| Primary label                    | `#FFFFFF`           | `#27123F`       |
| Secondary accent                 | `#AA3787`           | `#ED9BD3`       |
| Background                       | `#FFFFFF`           | `#17121F`       |
| Surface                          | `#F6F5F3`           | `#211A2B`       |
| Raised surface                   | `#FFFFFF`           | `#2B2236`       |
| Text                             | `#000000`           | `#FAF7FD`       |
| Muted text                       | `#62605E`           | `#C6BFD0`       |
| Button / input radius            | 24 / 6 points or dp | Same            |

Dark colors, pressed colors, containers, validation colors and accessible border
colors are native adaptations. The inspected website does not supply a dark
theme. Primary actions retain a filled native style; secondary actions retain
the existing platform-specific bordered/outlined style. Native feedback,
disabled appearance, padding, minimum touch areas, lists, sheets, toggles and
pickers keep their platform behavior. The website's compact menu diameter and
hover transitions do not replace native interaction.

Opt-in native text variants use heading 36/700, title 30/700, subtitle 22/600,
body 18/400, label 16/600 and caption 13/400 (size/weight). Native text scaling
and wrapping remain intact. Text with no variant keeps native typography;
explicit caller text styles still take priority. Likan's page/auth/launch headings
use a bundled static Urbanist Bold. Settings section and language-sheet headings
use the same font and primary foreground: purple `#502882` in light appearance,
with the existing lighter purple adaptation in dark appearance. Body text and native control labels keep
platform fonts; Arabic headings use native fallback. See the
[font registration and license](assets.md#fonts).

Shared mobile spacing remains 0, 4, 8, 12, 16, 24 and 32 points/dp. Likan starts
with native header blur over the content beneath it, while the title and Back
remain sharp above the backdrop. `design.header.artwork` is false for Altarea,
so colored header waves stay absent even with an older saved effect. Settings
hides that inactive effect picker and preserves its stored value. The measured
title band, safe area, scroll inset and touch shield remain. Native Reduce
Transparency keeps its existing solid-background fallback; `headerBlur={false}`
remains an explicit frame-level opt-out. The branded launch and reduced-motion
behavior remain configured through their existing owners. The native splash
and adaptive icon backgrounds use the new palette; embedded font/splash changes
need a matching native build.

Android uses the published `expo-blur` defaults for tint, intensity and reduction
factor, with no adjustable blur-level preference. iOS uses
public ultra-thin system materials, which may still apply their own color
treatment. The capture background and platform
limits belong to the [page contract](../.agents/skills/foodiya-ui-page/references/page-guide.md).

Page titles use the purple foreground accent and the selected Urbanist family.
Auth uses a magenta wordmark, purple heading and the theme's body type scale.
Home groups its existing introduction and primary sign-in/account action on a
warm neutral surface, with Settings secondary and developer links lower emphasis.

## Preview and verification

Use the native Tokens page at `/ui-component/tokens` for palette swatches,
typography, shapes, shared spacing, counted enabled/disabled buttons, an explicit
square-corner override and an editable/resettable field. Native Storybook's
`Components/Theme Tokens` includes Altarea Light/Dark and UX Light/Dark. The Text
page's isolated palette picker also includes Altarea. Ordinary Settings keeps
the configured brand and offers System/Light/Dark appearance.

Static checks and opaque color-contrast calculations do not establish rendered
native colors, button edge activation, font rendering or accessibility output.
The opaque-palette calculation gives a minimum of 4.93:1 in light and 7.39:1 in
dark across the eight text tones on background, surface and raised surface.
Primary fill/label contrast is 10.68:1 in light and 9.41:1 in dark. These values
use the [W3C relative-luminance formula](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
Check those on iOS and Android, including large text, Arabic, live appearance
changes, saved-header precedence and retained input drafts.
