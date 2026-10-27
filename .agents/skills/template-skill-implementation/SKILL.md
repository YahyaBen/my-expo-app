---
name: template-skill-implementation
description: Implement feature workflows while preserving the project's architecture and import boundaries.
---

# Feature implementation

Inspect the affected route, screen, workflow and callers. Change only the layers
needed for the requested behavior; reuse the existing feature's structure.

| Responsibility                                  | Owner                                        |
| ----------------------------------------------- | -------------------------------------------- |
| Routes, navigators and access                   | `src/app/`, `src/guards/`                    |
| Screens, local drafts and workflow coordination | `src/features/<feature>/`                    |
| Pure validation and domain rules                | Feature domain files, `src/validation/`      |
| HTTP, remote state and session lifecycle        | `src/services/`, `src/lib/api-query-keys.ts` |
| Shared native presentation                      | `src/components/ui/<family>/`                |
| Persisted preferences                           | Existing contexts, hooks and storage owners  |

- Keep dependencies flowing from routes to features to service hooks/options to
  transport. Pure rules have no rendering or I/O. Shared UI receives data and
  callbacks; it does not own feature navigation or entity writes.
- Import shared UI from `@components/ui` in features. Inside that library, import
  concrete implementation files to avoid public-barrel cycles.
- Keep server state in TanStack Query, transient state local and form state in the
  existing React Hook Form flow. Extract coordination only when it has a real
  responsibility; a small existing submission does not need another workflow file.
- Update a changed contract and its consumers together. Preserve cancellation,
  session ownership, required mutation callbacks and duplicate-submit guards.
  Navigate after required cache maintenance completes; retain drafts on failure.
- Translate app-owned labels and accessibility text in `fr.json`, `en.json` and
  `ar.json` together. Keep IDs, route names and selectors independent of language;
  use logical start/end placement without mirroring physical coordinates/insets.
- Reuse existing providers and adapters. Avoid parallel theme/session/HTTP systems,
  generic repositories or dependency-injection layers for ordinary feature work.
- Extend ESLint scopes through `restrictImports`; flat-config replacement must
  preserve shared native-control, route and Storybook restrictions. See the
  [enforced boundaries](../../../docs/architecture.md#enforced-import-boundaries).

Run lint, typecheck and formatting checks for edited files. Update native examples
when reusable behavior changes; regenerate registration after story edits. There
is no automated service or UI test runner in this checkout. Report native-device
and live-backend verification separately from static checks.
