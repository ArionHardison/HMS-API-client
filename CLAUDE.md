# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Workspace:** `/Users/arionhardison/Desktop/CI/web-sdk` (git remote `ArionHardison/HMS-API-client`; formerly `P2X/sdk`). See the workspace root CLAUDE.md at `../CLAUDE.md` for the ecosystem map.

## CI Ecosystem Role

**Unified TypeScript client for the entire CI API.** This is the one SDK the CI frontends (`sys-mfe/`, `gov/`, `app/`) consume to talk to `../api`. The Phase 1 mandate — cover **every** endpoint exposed by `../api` with strict TypeScript types and a passing test for each — has landed: `spec/openapi.json` (Scramble-exported, 1110 operations) is the committed contract, ~52 hand-written domain client classes live in `src/api/`, and the "SRE lock" (`.github/workflows/sre-contract.yml`) enforces spec/type/coverage on every push to `main` and every PR. Phase 2 (later): publish for use by external developers.

The package is published as `@arionhardison/wizard-api-client` to GitHub Packages (see package.json for the current version — do not hard-code it in docs). The wizard name is historical: the Five-Step Wizard surface is now one bounded subsystem inside the unified client (see `src/api/wizard-api-client.ts` + `src/stores/wizard.ts`). Renaming/republishing remains a deliverable; consumers reference `@arionhardison/wizard-api-client` for now.

Consult the workspace root `../CLAUDE.md` for the full ecosystem map (this workspace replaced the frozen `../../P2X` layout in July 2026; old sibling names `sys/`, `sdk/`, `CI-WWW/` are now `sys-mfe/`, `web-sdk/`, `gov/`).

## Tech Stack

- **TypeScript** 5.4.x (`strict: true`, dual CJS/ESM build via two tsconfigs)
- **HTTP:** Axios 1.6+ with per-frontend HTTP adapter (browser/SSR/Node)
- **Real-time:** native `WebSocket` to `wss://<host>/ws/jobs` (wizard job progress); planned: Pusher/Laravel Echo bridge for the broader broadcast surface (`user-{id}`, `guest-{sessionKey}`, `/broadcasting/auth`)
- **Validation:** zod (used for runtime schema checking on selected DTOs)
- **Build:** `tsc` for the lib (CJS + ESM), `vite build` for the Vue example bundle
- **Vue layer:** Pinia 2 stores + composables (`useApi`, `useForm`, `useWizardStore`, etc.) — the **core client must be importable without Vue** so Nuxt 2 (`app/`, `gov/`) and Node-side SSR can use it
- **Tests:** Vitest 1.x + MSW (the old Jest-style `hms-api-client.test.ts` is still excluded in `vitest.config.ts` — migrate it)
- **Codegen:** `openapi-typescript` over the committed `spec/openapi.json` — `npm run generate:types` runs `scripts/dedupe-operation-ids.mjs`, then emits `src/generated/api-types.ts` + the operation index. `src/generated/` must never drift from the spec (`npm run types:check` diff-gates it; enforced in CI by `sre-contract.yml`)

## Commands

```bash
# Build (CJS + ESM + Vue example bundle)
npm run build              # build:lib (cjs+esm) + build:vue
npm run build:lib          # tsc only — what consumers actually receive
npm run build:cjs          # tsc -p tsconfig.json     -> dist/
npm run build:esm          # tsc -p tsconfig.esm.json -> dist/esm/

# Tests
npm test                   # vitest (watch). Use `vitest run` in CI.
npm run test:coverage      # vitest --coverage  (no line/branch threshold configured yet)
npm run test:contract      # vitest run src/__tests__/contract  (spec-coverage + base-client contracts)
npm run types:check        # regen types, git diff --exit-code src/generated, then type-level tests
npx vitest run path/to/file.test.ts                              # single file
npx vitest run -t "wizard codifies a problem"                    # single test by name

# Type-check & lint
npm run type-check         # vue-tsc --noEmit
npm run lint               # eslint --fix across vue/ts/js

# OpenAPI codegen (spec lives at spec/openapi.json)
npm run generate           # generate:types + generate:docs
npm run generate:types     # dedupe-operation-ids -> openapi-typescript -> src/generated/api-types.ts + operation index

# Docs
npm run docs:client        # typedoc src/api -> docs/client/
npm run docs:api           # redoc-cli over the OpenAPI spec
```

## Architecture

### Layered structure

```
src/
├── api-client.ts                 BaseApiClient — fetch/axios HTTP layer, interceptors, error normalization;
│                                 SSR/Node default host is https://api.openyc.org (browser uses window origin;
│                                 explicit baseURL always wins)
├── api/
│   ├── wizard-api-client.ts      Five-Step Wizard endpoints + WebSocket job listener
│   ├── *-api-client.ts           ~52 hand-written domain clients (deal-wizard, hitl, rlhf, codify, lms,
│   │                             hrm, tenancy, per-Laravel-module clients, ...) + hms-api-client.ts
│   └── error-handling.ts         ApiError, isValidationError(), isAuthError(), etc.
├── generated/                    openapi-typescript output from spec/openapi.json — never hand-edit
├── typed-client.ts / typed-contract.ts   operationId-typed Request<E>/Response<E> layer
├── composables/                  useApi, useForm, plus VueUse re-exports
├── stores/                       Pinia: auth, chat, items, notifications, wizard
├── router/                       Vue Router setup (example)
└── __tests__/                    publish-readiness gates, contract suite (src/__tests__/contract), MSW mocks
```

`index.ts` re-exports the constructor classes, the singleton `hmsApiClient`, types, and Vue composables. **Always re-export new public types from `index.ts`** — consumers (especially `sys-mfe/`) treat anything not exported as private.

### HTTP layer contract (must match all consumer frontends)

Every frontend that consumes the SDK already implements the same request contract — the SDK must speak it natively, not force adapters per consumer:

- **Auth:** `Authorization: Bearer <token>` from injected token getter (do **not** hard-code `localStorage` — `app/` keeps the token in Vuex+cookie, `sys-mfe/` in cookie/sessionStorage, `gov/` (the former CI-WWW codebase) in Pinia-persisted localStorage; the legacy P2X Nuxt 3 gov portal used an httpOnly cookie).
- **Tenancy:** `X-Domain: <hostname>` on every request. The frontend supplies the resolver — SDK accepts a `getDomain(): string` function in client config.
- **Method override:** PUT/PATCH ride POST with a `_method=PUT|PATCH` query param (Laravel idiom). `app/` and `gov/` rely on this; do not break it.
- **Form data:** when payload contains a `File`/`Blob`, serialize via `object-to-formdata`-equivalent that supports nested arrays (`field[0][nested]=...`). `app/` uses this everywhere; `gov/`'s api-client layer already implements the nested-array form.
- **Errors:** normalize to `ApiError` with `isValidationError()` (HTTP 422 → `{ field: string[] }`), `isAuthError()` (401), `isForbiddenError()` (403), `isServerError()`. 401 should trigger an event/callback (`onUnauthorized`) the host app wires to its logout — do **not** redirect from inside the SDK.
- **Public endpoints:** `/api/load`, the `/public/auth/*` family, the Stripe webhook, and the gov directory pages must work **without** a token and must surface real HTTP status (200 vs 404) so `gov/`'s boot flow can `createError(404)`.

### Real-time

- **Wizard jobs (already shipping):** `WizardApiClient.addJobListener(jobId, fn)` opens a singleton native WebSocket to `wss://<host>/ws/jobs` and dispatches `job.status.updated` / `deal.status.updated` events. Auto-reconnects after 5s; subscriptions are reference-counted in-memory.
- **Broadcast surface (Phase 1.5):** `../api` broadcasts ~11 events via Pusher on `user-{id}` and `guest-{sessionKey}` channels and authorizes via `POST /broadcasting/auth`. `app/` already integrates `laravel-echo` directly. The SDK should ship an optional `RealtimeClient` (laravel-echo + pusher-js as **peerDependencies**, not deps — Node-side consumers must not pay the cost) wrapping the same channel/event names so all four frontends can drop their custom Echo glue.

### Multi-environment

- **Browser (sys-mfe, gov client, app client):** axios + native WebSocket. Today's path.
- **SSR (gov, sys-mfe SSR):** must work in Node — no `window`, no `localStorage`. Token + domain come from injected getters (SSR/Node baseURL falls back to `https://api.openyc.org`), WebSocket modules are lazy-imported so the Node bundle doesn't load `pusher-js`.
- **Nuxt 2 / Vue 2 (app, gov):** the **core client must not import Vue 3** at module top-level. `composables/`, `stores/`, and `router/` import Vue 3 — those live behind the Vue layer / subpath exports (`@arionhardison/wizard-api-client/vue3`) so Vue 2 consumers can take just the core client without pulling Vue 3 into their builds.

## Frontend integration map

The consumers and what each needs from the unified SDK (full investigation reports captured in conversation context; the SDK-adoption states below date from the P2X audit — re-verify before relying on them):

| Frontend | Stack | Current SDK state | Headers/auth | Notes |
|----------|-------|-------------------|--------------|-------|
| `sys-mfe/` | Vue 3 + Vite, strict TS, Vitest | **Already consumes `@arionhardison/wizard-api-client`** via `src/composables/use-wizard-api.ts` + `src/composables/use-wizard-progress.ts`. Wraps SDK in a singleton; re-syncs headers per call; declares input shapes structurally to dodge SDK branding. | Bearer from `useUserToken()` (cookie SSR / sessionStorage SPA). `X-Domain` from `resolveActiveDomain()`. | Calls `/api/public/auth/sign-in`, `/api/user/get-data`, `/api/v1/services/{resolve,reserve}` directly via `ofetch` because the SDK does not yet cover them. |
| old `gov/` policy portal (**legacy P2X, not in this workspace**) | Nuxt 3 + Pinia (JS) | **No SDK dep.** Custom axios plugin at `plugins/01.use-axios.js` exposes `$get/$post/$put/$patch/$delete`. | Bearer from `authStore.user.accessToken` (httpOnly cookie). `X-Domain` from `window.location.host` or request header. 422 → `applicationStore.errors`. Cross-tab sync via `localStorage` `auth:logout`/`auth:login`. | 40+ endpoints across `ai/policy`, `ai/prompts`, `user`, `project-role`, `subproject-wizard`, `subproject-team`, `contacts`, `documentation`, `domain-interfaces`, `fees`, `c-request`, `creator`, `world-locations`, `dashboard/auth`. Sentry-tagged errors. **No WebSocket usage** today. |
| `app/` | Nuxt 2 + Vue 2 + Vuex (JS) | **No SDK dep.** Custom axios mixin at `mixins/api.js`. PUT/PATCH via POST + `_method`. `object-to-formdata` for nested payloads. | Bearer from `csapi.accessToken` (Vuex + `__Host-vuex_{hostname}` cookie). Cross-tenant tokens in `csapi.subprojectTokens[]` keyed by `_cmt/` URL prefix. Separate `dbAuth.accessToken` for `/dashboard/*`. | 117 unique endpoints. Laravel Echo on `user-{id}` (auth) / `guest-{sessionKey}` (anon) with exponential reconnect. JS-only — adopting strict TS will be IDE-only safety unless the migration to TS happens. **Migration path is incremental** (adapter layer → high-value modules → hybrid). |
| `gov/` (former `CI-WWW/`, repurposed as the `gov.codify.*` traffic director) | Nuxt 2 / Vue 2.7 + strict TS, Jest | **No SDK dep.** Custom axios factory at `lib/api-client.ts` exposing `$get/$post/$put/$patch/$delete`. | Bearer from `authStore.user.accessToken` (Pinia-persisted localStorage). `X-Domain` from hostname (with apex bypass). 401 → logout. Returns `null` on network failure. | Originally called only `GET /api/load` (public, must preserve 200/404); later phases add authed pages: `/me`, `/board`, `/leader`, `/interface/load-interface`. |

**Common contract** all consumers expect from the SDK:

1. Injectable token + domain getters (no global state).
2. PUT/PATCH via POST + `_method`.
3. FormData with nested-array serialization for file uploads.
4. 422 surfaced as field-keyed validation errors.
5. 401 surfaced as a callback/event, not a redirect.
6. Public endpoints reachable without a token and preserving HTTP status.
7. SSR-safe: no `window`/`localStorage` at module load time.

## API surface to cover (`../api`)

Laravel 10 + nWidart modules. The OpenAPI contract is committed at `spec/openapi.json` (Scramble-exported from `../api`, 1110 operations) and enforced in CI. To enumerate live routes from the api repo when checking for spec drift:

```bash
cd /Users/arionhardison/Desktop/CI/api
php artisan route:list --path=api --json > /tmp/routes.json
```

High-level grouping (full counts in the investigation report):

- **Core** (`routes/api.php`, ~347 routes): auth (Sanctum + social OAuth), users, teams, roles, subscriptions, programs, protocols, wizard (`wizard/codify/{protocol}`), chat, payments, broadcasting auth, frontend CMS, gov directory.
- **Modules** (`Modules/*/Routes/api.php`, ~176 routes): `Activity`, `Agents`, `Appeal`, `Application`, `Assessments`, `Challenge`, `Connector`, `Disbursement`, `ETL`, `FollowUps`, `Items`, `KPI`, `Nudge`, `Order`, `Referral`, `Report`, `Services`, `Systems`, `Verification`, `Workflow`.
- **Versioned segments:** only `Modules/ETL` (`/api/v1/etl/*`) and `Modules/Services` (`/api/v1/services/*`) use a `v1/` prefix; the rest is unversioned.
- **Webhooks:** `POST /api/webhook/stripe-payment/handle` is **public, unauthenticated** — the SDK must allow opt-out of auth header injection on this path.
- **File uploads:** `users/change-photo`, `users/change-cover`, `challenge/record-video`, `follow-up/voice-record|voice-finalize`.
- **Polling endpoints:** `public/codify/state/{key}`, `workflow/codify-pipeline/check-pipeline/{session}`, `etl/status/{pipelineId}`, `protocol/ai-request-status/{key}`. SDK should ship a generic `pollUntil(predicate, opts)` helper.
- **Broadcast events:** ~11 (`ChatMessageEvent`, `ProtocolStepFinished`, `FinishGlobalModuleTask`, `ForceChangeProtocolStep`, `ScheduleCallStart`, `PolicyChanged`, plus per-module variants). Channels: `user-{id}`, `guest-{sessionKey}`. Auth: `POST /broadcasting/auth`.

## Strict-TDD working agreement

The user mandate is **strict TDD + strict TS, every endpoint covered, no exceptions.**

1. **Spec is committed at `spec/openapi.json`.** It is Scramble-exported from `../api` (1110 operations; types derived from FormRequest rules and JsonResource transformers). Treat it as the contract: when api/ adds or changes routes, re-export the spec, then re-run `npm run generate:types` to rebuild `src/generated/` — the `sre-contract.yml` workflow fails CI if `src/generated/` drifts from the spec.
2. **Test before code.** Every endpoint method gets a Vitest test using **MSW** (preferred over `axios-mock-adapter` so the same mocks work in Node and browser test envs) that asserts: URL, method, headers (`Authorization`, `X-Domain`, `Content-Type`), request body shape, and response decoding. Add the test, watch it fail, then add the method.
3. **Generated, not hand-written, where possible.** `npm run generate:types` produces `src/generated/` types; `src/typed-client.ts` / `src/typed-contract.ts` layer operationId-typed `Request<E>`/`Response<E>` on top. Hand-written wrappers live in `src/api/*-api-client.ts` and consume the generated layer for type safety. The 80KB `hms-api-client.ts` is the prior-art hand-written approach — keep it working until generated equivalents pass the same tests, then replace.
4. **Coverage gate.** `src/__tests__/contract/spec-coverage.contract.test.ts` enforces endpoint coverage against `spec/endpoints.json` (escape hatch: `spec/skipped.json`) and runs in CI via `sre-contract.yml`. A vitest line/branch coverage threshold is still not configured — add one.
5. **Migrate the excluded suite.** `src/api/__tests__/hms-api-client.test.ts` is Jest + `axios-mock-adapter` and still excluded in `vitest.config.ts`. Deliverable: port it to vitest + MSW so it runs in CI.
6. **Branding-stable types.** `sys-mfe/` deliberately re-declares input shapes structurally because earlier SDK exports collided with its branding rules. Keep public types **structural** (interfaces, not branded type aliases) so `sys-mfe/` can drop its `as unknown as` workarounds.
7. **No silent breakage.** The `sre-contract.yml` workflow gates spec/type/coverage drift on every PR and push to `main`. Note: `package.json` still has `version:check` / `migration:generate` scripts pointing at `scripts/check-breaking-changes.js` / `scripts/generate-migration-guide.js`, but those files no longer exist — fix or remove the dangling scripts.

## Build / publish notes

- Published to **GitHub Packages** (`https://npm.pkg.github.com`), scope `@arionhardison`. `publishConfig.access: public`. CI auth uses `GITHUB_TOKEN` only — no external npm secret. **Gotcha:** `package.json` `publishConfig.registry` says `registry.npmjs.org`, but `publish.yml`'s `setup-node` `registry-url` (`npm.pkg.github.com`) wins in CI — the effective publish target is GitHub Packages.
- Publish workflow: `.github/workflows/publish.yml` triggers on tags `v*.*.*` or `workflow_dispatch`; runs `npm ci`, `npm run build:lib`, `npm run test`, then `npm publish`. `prepublishOnly` also runs `npm run build`. The separate `sre-contract.yml` workflow (push to `main` + PRs) runs the contract gate and must stay decoupled from the tag-gated publish path.
- `files` field ships only `dist/**/*` and `README.md`. `examples/` and `__tests__/` are intentionally excluded.
- `prebuild` does `rm -rf dist` — never put committed artifacts in `dist/`.
- Build order matters: a recent fix (commit `554a3bc`) added `build:lib` before `test` so the publish-readiness `dist/`-presence gate passes on a fresh clone. Don't reorder `prebuild`/`build:lib`/`test` without re-running the publish-readiness suite.
- `peerDependencies` (`vue ^3.4`, `pinia`, `vue-router`) are for the Vue 3 layer only. Once the core client is split behind a subpath export, those must become **optional** peerDeps so `app/` (Vue 2) and Node-side consumers don't trip resolution.

## Reference

- `README.md` — full wizard API documentation and consumer examples (its `npm install @wizard/api-client` snippet is stale; the package is `@arionhardison/wizard-api-client`).
- `../CLAUDE.md` (workspace root) — ecosystem overview, deployment topology, multi-tenancy patterns.
- `../api/CLAUDE.md` — the API this SDK targets.
- `../sys-mfe/CLAUDE.md`, `../app/CLAUDE.md`, `../gov/CLAUDE.md` — per-consumer integration constraints. (`../mob-sdk/` is the Dart/Flutter counterpart of this SDK.)
