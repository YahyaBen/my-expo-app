# Brand and environment configuration

Read [development setup](../../../../docs/development.md#brand-and-environment-configuration)
for operator commands. Keep configuration in these existing owners:

| Owner                                                    | Responsibility                                                               |
| -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `config/brands/`, `config/brand.js`                      | Serializable identity/assets, integration references and manifest validation |
| `app.json`, `app.config.js`                              | Shared native settings and selected configuration assembly                   |
| `src/config/brand.ts`                                    | Validated public native metadata from `extra.brand`                          |
| `config/brand-assets.json`, `src/config/brand-assets.ts` | Public asset metadata and literal Metro imports                              |
| `config/api.js`, `src/services/api.config.ts`            | Shared API normalization/timeout and lazy native environment access          |

- `APP_BRAND` selects identity; `APP_VARIANT` selects development, preview or
  production. Preserve production identifiers. The resolver suffixes development
  native IDs and URL schemes with `.dev`, and preview with `.preview`, before
  validating package-specific Firebase mappings. Both development profiles share
  one identity. Keep the generated Expo client URL scheme development-only.
- Local and standard build profiles default to the template in every variant.
  A clone fills its existing `eas.projectId` slot; `eas.owner` is optional.
  Keep an empty slot usable locally and omit it from public EAS metadata.
  Production requires a project ID and disabled developer flags. A backend URL
  is optional for building; when supplied, production requires HTTPS. Client
  profiles select their own manifest explicitly; never reuse another client's project.
- Native modules read only public metadata. Do not import Node resolution,
  filesystem, full manifests or private environment values into the app.
- Presentation selects registered palette, heading font, launch artwork and
  launch mode. Saved user preferences retain precedence where
  supported. Add manifest fields only when an implementation consumes them.
- Register palettes in `src/constants/themes/` and the resolver's supported IDs.
  The brand seeds the default palette; Settings saves the user's selection.
  Isolated previews do not persist changes.
- Use literal asset imports, never a dynamic `require` from a manifest path.
  Verify native font names and scripts. Arabic and failed/unloaded optional fonts
  use native fallback; brand fonts apply to headings rather than every control.
- Keep refresh transport independent of the authenticated client. Production
  validation enforces release requirements without blocking local public previews.

Validate resolved configs for affected brands/variants, including invalid selectors
and missing required assets/configuration. Distinguish this from native builds and
runtime verification. Keep new maintained source roots in lint and both format scopes.
