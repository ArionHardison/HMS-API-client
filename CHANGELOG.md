# Changelog

All notable changes to `@arionhardison/wizard-api-client` are recorded
here. Format roughly follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning
follows SemVer.

## [Unreleased]

## [1.21.0] — 2026-10-05

Everything recorded since 1.4.0 ships in this release. Consumers receive it
from a rebuilt `dist/` — a vendored `npm pack` tarball (how sys consumes the
SDK; see README → Publishing) or the `v1.21.0` tag's publish workflow. The
tracked `dist/` on `main` and sys's vendored `1.20.0` tarball do NOT carry the
`X-Tenant-Domain` header or any other change below.

### Added

- **`Retry-After` on the thrown error (anti-bulk-exfiltration plan C10 /
  WS8 'sdk').** Every `ApiError` now carries `retryAfter: number | null` —
  the seconds the server asked the client to wait, parsed from the
  `Retry-After` header (delta-seconds or an HTTP-date, both normalized to
  whole seconds from now) with the api's `retry_after` body field as the
  fallback — plus `rateLimit?: RateLimitInfo` (`{ retryAfter, error, scope,
  limit, window }`) when the response was a refusal (a 429, or the api's
  `rate_limited` / `rate_limiter_unavailable` body on a 503 shed) and an
  `isRateLimitError()` predicate (429). Both the fetch pipeline
  (`BaseApiClient`) and the legacy axios construction path populate it;
  `toJSON()` includes `retryAfter`. New root exports: `parseRetryAfter`,
  `bodyRetryAfter`, `rateLimitInfoFrom`, `httpStatusOf`, `isRetryableError`
  and the `RateLimitInfo` type. `getErrorMessage()` says "Too many requests.
  Please try again in N seconds." for a 429.
- **`MiscCoreApiClient.listPublicSubprojects({ page?, per_page? })`** — the
  optional query sends `?page=` / `?per_page=` to `GET /api/public/subprojects`,
  which paginates since CI-API #5959 (WS4). New types
  `PublicSubprojectsQuery`, `PublicSubprojectsPage`, `PublicSubprojectsPageMeta`,
  `PublicSubprojectListItem`. The zero-argument call keeps working (page 1).
- **`useApi` state gains `retryAfter: number | null`**, mirroring the thrown
  error's value so a view can render "try again in N s" directly.
- **`X-Tenant-Domain` beside `X-Domain`.** `BaseApiClient` now sends the one
  `getDomain()` value under BOTH names — `X-Tenant-Domain` is the api's primary,
  proxy-safe tenant header (`SetDomainContext` reads it first and it follows
  the alias chain), `X-Domain` the legacy fallback; same opt-in, same omission
  when `getDomain` is absent or returns null. Verified live 2026-10-05 on the
  Cloudflare-fronted hostnames WS8 moves browsers to: an X-Domain-only request
  resolves NO tenant on `https://api.project20x.com` / `https://api.openyc.org`
  (`/api/load` → `{error}`) and is ignored in favour of the host on
  `https://openyc.org`, while `X-Tenant-Domain` resolves CodifyNYC on all
  three. Through the deleted Vercel `/api` rewrite tenancy rode
  `X-Forwarded-Host`; direct to the api hostname only `X-Tenant-Domain` carries
  it. Both names are in the api's CORS `allowed_headers`.

### Changed

- **`useApi` never retries a 4xx.** `executeWithRetry` used to replay ANY
  error while `retry > 0`, so a 429 was retried at `retryDelay * (n + 1)` ms —
  inside the server's `Retry-After` window, extending the refusal. It now
  replays only 5xx and network failures (`isRetryableError`); 4xx — 429
  included — surface at once with `retryAfter` for the caller to schedule.
  A 5xx / network replay now waits the LONGER of the linear ladder
  (`retryDelay * (n + 1)`) and the server's `Retry-After`, capped at
  `RETRY_AFTER_CAP_SECONDS` = 120 s (plan C10's client cooldown cap) — a 503
  shed saying `Retry-After: 30` (the api's fail-closed budget store, plan §4)
  is replayed at 30 s, not 1 s. Without a `Retry-After` the ladder is exactly
  the old one.
- **`listPublicSubprojects()` return type** is now `Promise<PublicSubprojectsPage>`
  (`{ data, meta }`) instead of `Promise<ApiResponse<MiscCoreResponse>>`. The
  endpoint's wire is a Laravel paginator and never carried `success` /
  `message`, so the old annotation promised fields that did not exist;
  `.data` keeps working and is typed as the row array. No known caller.
- **`ApiClientConfig.baseURL` docs**: the browser default (`window.location.origin`)
  is documented as same-origin for hosts that proxy `/api/*` themselves (the
  app droplet's nginx) — NOT a Vercel contract: the gov / sys / www `/api`
  rewrites are deleted under WS8, so a Vercel-hosted consumer passes an
  absolute Cloudflare-fronted `baseURL` (`https://api.project20x.com` or
  `https://openyc.org`). Comment-only; no runtime change.

- **Brand rename → OpenYC.** Every place the SDK's prose named the legacy
  brand or its `.ai` tenant host now says **OpenYC** / `openyc.org`: the
  `ApiClientConfig.baseURL` doc comment, `WizardApiClient.defineDeal()`,
  `NioFirebaseLoginResponse`, the msw `X-Domain` / same-origin test fixtures,
  the 1.4.0 `startWizard()` note, and the mirrored comments in the tracked
  `dist/`. No runtime change — the default host was already
  `https://api.openyc.org`. Codify is the platform; OpenYC is the
  startup/tech/dev layer on it.

### Fixed

- **`useApi` cache hit clears `retryAfter`.** The cache-hit branch reset
  `data` / `success` / `error` / `rawError` but not `retryAfter`, so a cached
  success after a 429 on other arguments reported `success: true` beside a
  stale cooldown. It is `null` there now (the field mirrors `rawError`).
- **`listPublicSubprojects()` docblock** named `X-Domain` as the tenant
  carrier and promised the brand-apex fleet listing on any host. It now names
  both tenant headers (`X-Tenant-Domain` is the one the api resolves; the
  controller's apex check still reads `X-Domain`) and states that the fleet
  listing needs `baseURL: 'https://openyc.org'` — on the api hostnames the
  proxy overwrites `X-Domain`, so the directory answers the one resolved
  tenant (`total` 1).
- **`publish.yml` test job generates the types before it builds.**
  `src/generated/api-types.ts` is gitignored; `build:lib` (`tsc`) and the
  coverage contract both read it, so on a clean runner the tag path failed
  before this (`TS2307` in `src/typed-contract.ts`, `ENOENT` in
  `spec-coverage.contract.test.ts`). `npm run generate:types` now runs right
  after `npm ci` — the same order `sre-contract.yml`'s `types:check` uses.
- **Notifications store `apiError()`** — its parameter was named `error`,
  shadowing the store's own `error()` function, so `useApi`'s default
  error-notification path (`showErrorNotification: true`) threw
  `TypeError: error is not a function` instead of toasting. Renamed to `err`;
  pinned in `src/composables/__tests__/useApi.retry.test.ts`.

### Removed

- **`FacilitiesThemeSignal.session_identifier`** — the api stopped echoing it
  from `GET /api/facilities/themes/{theme}/signals` in CI-API #5284
  (`4ca315b60`): `pipeline_states.session_identifier` is the pipeline lane's
  guest bearer (check-pipeline → `deal_guid`, `POST deal/{guid}/cancel`), so
  the field no longer exists on the wire and the type no longer promises it.
  `pipeline_id` is unchanged. Type-only; no runtime change. Pinned at compile
  time (`src/__tests__/contract/facilities-theme-signal.test-d.ts`) and at
  runtime (`src/api/__tests__/facilities.test.ts`).

### Known limitations

- **`useApi` is not shipped by the package root.** The Vue 3 composables and
  Pinia stores live behind `src/vue3/index.ts`, which neither `tsconfig.json`
  nor `tsconfig.esm.json` includes, and `package.json` `exports` has only `"."`
  — so `@arionhardison/wizard-api-client/vue3` does not resolve and no consumer
  imports `useApi` today (sys / gov / www / app: zero call sites). The no-4xx
  retry behaviour above is therefore in-repo until a `./vue3` subpath ships;
  `ApiError.retryAfter` / `rateLimit`, `isRetryableError`,
  `listPublicSubprojects({ page })` and the `X-Tenant-Domain` header ARE in the
  built `dist/`.
- **`WizardApiClient`'s job socket dials same-origin `/ws/jobs`.**
  `initWebSocket()` (opened only when the first job / deal listener is
  registered — never at construction) builds `wss://<page host>/ws/jobs`
  (`localhost:6001` on localhost) and reschedules itself every 5 s on close.
  Once a Vercel-hosted consumer's `/ws` rewrite to the raw origin is deleted
  (WS8) that URL 404s there, so the socket is inert on Vercel; no consumer
  registers a listener today. Follow-up: an opt-in `wsURL` in `ApiClientConfig`
  (no default dial) and capped reconnects.

## [1.4.0] — 2026-05-17

### Added

- **`IntakeModuleApiClient`** — new client for the `/api/v1/intake/*` patient
  intake module surface (8 endpoints):
  - `start()` — kick off a new intake session.
  - `exchange()` — redeem a single-use handoff token from another subproject
    for the receiving subproject's session (public, no Bearer).
  - `voiceRecord()` / `voiceFinalize()` — capture and finalize voice notes
    for asynchronous transcription.
  - `submitAnswers()` — replace the answers payload.
  - `setAudience()` — set the intake audience (`patient` / `family_member` /
    `caregiver`).
  - `initiateHandoff()` — mint a handoff token + URL another subproject can
    exchange.
  - `getStatus()` — lightweight poll for intake state changes.
- **`AuthUserApiClient.getAccessibleSubprojects()`** —
  `GET /api/me/accessible-subprojects`, lists subprojects the current user
  has access to (for subproject switcher UIs).
- **`MiscCoreApiClient.submitErrorReport()`** —
  `POST /api/support/error-report`, anonymous error reporting from the
  tenant-error pages.
- **`WizardSetupApiClient.startWizard()`** — `POST /api/wizard/start`, the
  canonical entry point for the OpenYC wizard flow.
- **`SubprojectApiClient.getCurrentSubprojectSystem()`** —
  `GET /api/v1/subprojects/current/system` + new `SubprojectSystemData`
  interface for the system-config payload.

### Notes

- Tracks `codify_p2x_sdk` v0.2.0 (Dart sibling shipped the same Intake
  surface + auth/payment/items/schedule/services/follow_ups/chat/notification
  client expansions).
- Hand-written; OpenAPI codegen Tier 2 still deferred.
- 1064/1066 tests pass; the 1 failing test (`publish-readiness.test.ts >
  no-missing-deps`) is a pre-existing issue scanning stale `dist/` artifacts,
  unrelated to this release.

## [1.3.0] — 2026-05-16

### Added

- **`SubprojectApiClient`** — the hierarchy-aware successor to
  `TenancyApiClient`. Same surface (boot endpoints, subproject CRUD,
  admin lifecycle, team, wizard, project settings, tenant claim,
  tenant interface graph, domain interfaces, world locations, gov
  directory, frontend/SEO, creators/featured, contacts, documentation),
  plus:
  - `loadSubproject()` returns a typed `Subproject` carrying
    `parent_subproject_id: number | null` and `chain: Subproject[]`
    (ancestor list, leaf → root). When api/ omits the hierarchy
    fields, the client surfaces `null` + `[]` so existing flat-tenant
    installs keep working.
  - `getDpgInstances(id)` — new method targeting
    `GET /api/subprojects/{id}/dpg-instances`. Returns
    `Array<{system_key, instance_url, mode,
    inherited_from_subproject_id}>`. Mode is constrained to
    `'native' | 'domain' | 'hybrid'`.
- **`Subproject`, `DpgInstance`, `DpgInstanceMode`,
  `SubprojectLoadResponse`** — new structural types exported from the
  root barrel (`src/types/subproject.ts`).
- **`resolveInherited(subproject, key)`** — pure helper exported from
  the root barrel. Walks `subproject.chain` leaf → root and returns
  the first non-null/non-undefined value for the given key. Treats
  `undefined` as a no-match; does not mutate the input.

### Changed

- **`TenancyApiClient`** is now a thin subclass of
  `SubprojectApiClient` (no method bodies of its own). The class is
  marked `@deprecated` and emits a single `console.warn` on first
  construction nudging consumers to migrate. Removed in 2.0.0.

### Deprecated

- `TenancyApiClient` (use `SubprojectApiClient`).
- `loadTenant()` (use `loadSubproject()`).
- `LoadTenantResult` and `LoadSubprojectResult` type aliases (use
  `SubprojectLoadResponse`).

### Breaking-in-2.0

- The deprecation alias (`TenancyApiClient` class + `loadTenant()`
  method + `LoadTenantResult`/`LoadSubprojectResult` aliases) will be
  removed in 2.0.0. Consumers have one full minor (1.3.x) to migrate.

### Notes for `api/` sibling work

The matching server route for `getDpgInstances(id)` does not yet
exist. `api/Modules/Systems/` ships the
`subproject_dpg_instances` table + the X-Domain-scoped
`GET /api/v1/subprojects/current/system` endpoint, but the per-id
hierarchy-aware route needs to be added. Required:

1. `Route::get('subprojects/{id}/dpg-instances', ...)` under
   `auth:api` in `api/Modules/Systems/Routes/api.php`.
2. Server-side walking of the `parent_project` chain to set
   `inherited_from_subproject_id` per binding (leaf wins per
   `system_key`).

Similarly, `loadSubproject()`'s `parent_subproject_id` + `chain`
fields are forward-compatible: the SDK tolerates their absence today
but expects `api/app/Http/Resources/CodifySubprojects/SubprojectClientDataResource`
to project them once the sibling ticket lands.

## [1.2.x] — earlier

See git log on the `main` branch for entries prior to the changelog
being introduced.
