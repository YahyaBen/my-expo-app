# Localization

App translations live in src/shared/locales/ with dictionaries for French (fr),
English (en), Arabic (ar), Simplified Chinese (zh), Spanish (es), Turkish (tr),
Korean (ko), Japanese (ja) and Hindi (hi). Register languages in src/lib/i18n.ts
and label them in the Settings language picker. Use useTranslation().t() for
app-owned text and keep the same keys and interpolation parameters in all
dictionaries. Route names, form fields, enums, brand identity and test selectors
stay independent of language. Keys for removed
product screens are not part of the template dictionary.

English is the default. Settings and the shared auth language control use
the existing language provider and appLanguage storage key. Startup waits for
restoration; failed reads use English and failed writes leave the current selection
usable for the session. Template's Settings tab exposes the saved language choice;
there is no login route.

Arabic selects RTL through the existing direction provider; all other supported
languages select LTR. Language changes preserve mounted drafts and navigation.
See [live direction](layout-direction.md).

Brand names come from public app configuration. launch.loading interpolates
brandName; pass that value when rendering it. Auth wordmarks use the configured
name directly. Heading fonts follow the selected asset's supported scripts; see
[bundled assets](assets.md).

Custom validation messages store translation keys and translate at display time.
Zod's built-in messages use its current locale (`zh` maps to `zhCN`). API requests
send the selected Accept-Language; server responses and user-authored content stay
with the server. Keep dynamically composed translation keys when pruning dictionaries.

Native iOS permission messages live in config/locales/en.json, fr.json and
ar.json, registered through app.json. System dialogs follow device app-language
settings. The in-app picker changes content; native prompt edits require a build.
The other supported languages currently cover in-app content only. Translation
and picker changes can use Metro or a compatible OTA update without a new native build.

Run npm run check after edits. Check language persistence, RTL, draft preservation
and request language on matching iOS/Android builds; report backend verification
separately when a real API is configured.
