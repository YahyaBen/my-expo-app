---
name: expo-api-services
description: Maintain validated API contracts, session-safe queries, mutations and cache updates.
---

# API services

Confirm the backend verb, path, identifiers, parameters, nullability, body and
response envelope before adding an operation. Use the supplied contract or existing
reference material; do not invent CRUD capabilities. Extend `src/services/` helpers
and the current auth lifecycle rather than creating a second transport.

| Owner                                    | Responsibility                                           |
| ---------------------------------------- | -------------------------------------------------------- |
| `src/validation/schemas/api/<entity>.ts` | Runtime response schema; infer response DTOs from it     |
| `src/types/<entity>.types.ts`            | Query, result and supported write types                  |
| `src/lib/api-query-keys.ts`              | Pure normalized key factories                            |
| Entity `.api.ts` / `.service.ts`         | HTTP through `apiClient`; no React, UI or cache effects  |
| Entity `.queries.ts` / `.mutations.ts`   | Read options and supported writes with cache maintenance |
| Entity `.hooks.ts`                       | React consumption, callback composition and invalidation |

## Response and session boundaries

- Attach a Zod `responseSchema` to each consumed JSON response. Validate once in
  `apiClient`; do not cast responses or parse again in screens. Preserve required,
  optional and nullable fields; use `z.looseObject` for additive fields and the
  existing pagination schema for page metadata.
- Malformed success responses become safe `ApiResponseValidationError`s without
  payloads, credentials or Zod input. Do not retry them, seed caches or invalidate
  from malformed writes.
- Use `src/services/api.config.ts` and the shared native-safe `config/api.js`.
  Keep native configuration lazy for public previews. Refresh remains independent
  of the authenticated client and its interceptors.
- Keep wire auth schemas separate from the frontend session schema and pure
  `auth.mapper.ts`. Require a nonempty access token and identified user; retain
  supported legacy nullable metadata. Remove corrupt stored sessions; invalid
  updates preserve the previous session and generation.
- Logout captures credentials and rechecks ownership after reads. Await durable
  local deletion/cache cleanup before bounded, unawaited revocation through the
  unauthenticated client using the captured bearer. Share concurrent clears;
  restore retryable state only for same-generation deletion failures. Never refresh
  revocation credentials or notify a newer account on stale failure.

## Queries and writes

- Normalize parameters once for requests and keys with `request-utils.ts`;
  preserve explicit `false` and encode identifier segments.
- Reuse `query-utils.ts`, forward `AbortSignal` on every read and use `skipToken`
  until all detail identifiers exist. Separate finite/infinite keys; stop pagination
  on the final, empty or repeated page.
- Match service/query defaults. Use `useQueryClient()` in hooks and explicit
  clients in imperative factories. Reuse entity invalidators with complete
  identifier tuples. Pull-to-refresh targets exact displayed query keys through
  `useScreenRefresh`, preserving filters, drafts and completion/error handling.
- Use `sessionMutationOptions` for authenticated writes: retain generation guards,
  no automatic retry and no deferred offline replay. Add optimistic behavior only
  for an explicit workflow with cancellation, rollback and account ownership.
- Cancel detail reads before replacing/removing entries. After each awaited
  cancellation, call `assertCurrent()` before touching the cache. Seed only valid
  returned details and invalidate affected finite/infinite lists and related data.
  Await required maintenance before completion or success navigation; failed writes
  keep existing freshness.
- Compose callbacks through `withMutationCallbacks`; replacing `onSuccess` must
  not discard maintenance. Keep navigation in consumers. Distinguish server-write
  failures from callback/refetch failures before offering a repeated POST.

Search DTO, method, key and hook consumers before changing contracts. Update
schemas, request normalization, keys and invalidation together. Use installed
types and current official TanStack/Axios documentation for API syntax.

Run lint and typecheck. Exercise changed auth/contracts against the real backend
when available and report that separately. The [API guide](../../../docs/api-services.md)
records session details and manual checks; this checkout has no service test runner.
