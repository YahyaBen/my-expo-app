# Localization

App translations live in src/shared/locales/fr.json, en.json and ar.json. Use
useTranslation().t() for app-owned text and keep the same keys and interpolation
parameters in all three dictionaries. Route names, form fields, enums, brand
identity and test selectors stay independent of language. Keys for removed
product screens are not part of the template dictionary.

French is the default. The Preferences story and shared auth language control use
the existing language provider and appLanguage storage key. Startup waits for
restoration; failed reads use French and failed writes leave the current selection
usable for the session. The release wireframe has no Settings or login route.

Arabic selects RTL through the existing direction provider; French and English
select LTR. Language changes preserve mounted drafts and navigation. Storybook's
explicit direction controls support isolated layout previews. See
[live direction](layout-direction.md).

Brand names come from public app configuration. launch.loading interpolates
brandName; pass that value when rendering it. Auth wordmarks use the configured
name directly. Heading fonts follow the selected asset's supported scripts; see
[bundled assets](assets.md).

Custom validation messages store translation keys and translate at display time.
Zod's built-in messages use its current locale. API requests send the selected
Accept-Language; server responses and user-authored content stay with the server.
Keep dynamically composed translation keys when pruning dictionaries.

Native iOS permission messages live in config/locales/en.json, fr.json and
ar.json, registered through app.json. System dialogs follow device app-language
settings. The in-app picker changes content; native prompt edits require a build.

Run npm run check after edits. Check language persistence, RTL, draft preservation
and request language on matching iOS/Android builds; report backend verification
separately when a real API is configured.
