# Changelog

All notable changes to `@arionhardison/wizard-api-client` are recorded
here. Format roughly follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning
follows SemVer.

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
  canonical entry point for the YCaaS wizard flow.
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
