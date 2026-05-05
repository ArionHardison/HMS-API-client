# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## P2X Ecosystem Role

**Unified TypeScript client for the entire P2X API.** This is the one SDK that `sys/`, `gov/`, `app/`, and `CI-WWW/` all consume to talk to `../api`. Phase 1 mandate: cover **every** endpoint exposed by `../api` (~523 routes across `routes/api.php` + 20 nWidart modules) with strict TypeScript types and a passing test for each. Phase 2 (later): publish for use by external developers.

Today the package is published as `@arionhardison/wizard-api-client@1.1.5` to GitHub Packages and only covers the Five-Step Wizard. The wizard surface stays — it is one bounded subsystem inside the unified client (see `src/api/wizard-api-client.ts` + `src/stores/wizard.ts`). Renaming/republishing is a Phase 1 deliverable; consumers reference the package via `@arionhardison/wizard-api-client` for now.

Consult the top-level `/CLAUDE.md` for the full ecosystem map.

## Tech Stack

- **TypeScript** 5.4.x (`strict: true`, dual CJS/ESM build via two tsconfigs)
- **HTTP:** Axios 1.6+ with per-frontend HTTP adapter (browser/SSR/Node)
- **Real-time:** native `WebSocket` to `wss://<host>/ws/jobs` (wizard job progress); planned: Pusher/Laravel Echo bridge for the broader broadcast surface (`user-{id}`, `guest-{sessionKey}`, `/broadcasting/auth`)
- **Validation:** zod (used for runtime schema checking on selected DTOs)
- **Build:** `tsc` for the lib (CJS + ESM), `vite build` for the Vue example bundle
- **Vue layer:** Pinia 2 stores + composables (`useApi`, `useForm`, `useWizardStore`, etc.) — the **core client must be importable without Vue** so Nuxt 2 (`app/`) and Node-side SSR (`gov/`, `CI-WWW/`) can use it
- **Tests:** Vitest 1.x (Jest-style HMS suite is currently excluded — migrate it)
- **Codegen:** `openapi-generator-cli` + `openapi-typescript` scripts are wired in `package.json` but the input path (`../public/docs/api-spec.json`) does not yet exist; producing the spec from `../api` is the Phase 1 unblock

## Commands

```bash
# Build (CJS + ESM + Vue example bundle)
npm run build              # build:lib (cjs+esm) + build:vue
npm run build:lib          # tsc only — what consumers actually receive
npm run build:cjs          # tsc -p tsconfig.json     -> dist/
npm run build:esm          # tsc -p tsconfig.esm.json -> dist/esm/

# Tests
npm test                   # vitest (watch). Use `vitest run` in CI.
npm run test:coverage      # vitest --coverage  (no threshold configured yet — add one in Phase 1)
npm run test:contract      # vitest run tests/contract  (directory does not exist yet)
npx vitest run path/to/file.test.ts                              # single file
npx vitest run -t "wizard codifies a problem"                    # single test by name

# Type-check & lint
npm run type-check         # vue-tsc --noEmit
npm run lint               # eslint --fix across vue/ts/js

# OpenAPI codegen (currently broken — input path wrong; fix in Phase 1)
npm run generate           # generate:client + generate:types + generate:docs
npm run generate:client    # openapi-generator-cli (typescript-axios) -> src/generated/
npm run generate:types     # openapi-typescript -> src/generated/api-types.ts

# Docs
npm run docs:client        # typedoc src/api -> docs/client/
npm run docs:api           # redoc-cli over the OpenAPI spec
```

## Architecture

### Layered structure

```
src/
├── api-client.ts                 BaseApiClient — fetch/axios HTTP layer, interceptors, error normalization
├── api/
│   ├── wizard-api-client.ts      Five-Step Wizard endpoints + WebSocket job listener
│   ├── hms-api-client.ts         16 domain classes (User, Team, Items, Programs, Protocol, KPI, Chat, ...)
│   └── error-handling.ts         ApiError, isValidationError(), isAuthError(), etc.
├── composables/                  useApi, useForm, plus VueUse re-exports
├── stores/                       Pinia: auth, chat, items, notifications, wizard
├── router/                       Vue Router setup (example)
└── __tests__/                    Currently only publish-readiness & publish-workflow gates
```

`index.ts` re-exports the constructor classes, the singleton `hmsApiClient`, types, and Vue composables. **Always re-export new public types from `index.ts`** — consumers (especially `sys/`) treat anything not exported as private.

### HTTP layer contract (must match all four frontends)

Every frontend that consumes the SDK already implements the same request contract — the SDK must speak it natively, not force adapters per consumer:

- **Auth:** `Authorization: Bearer <token>` from injected token getter (do **not** hard-code `localStorage` — `gov/` keeps the token in an httpOnly cookie, `app/` in Vuex+cookie, `sys/` in cookie/sessionStorage, `CI-WWW/` in Pinia-persisted localStorage).
- **Tenancy:** `X-Domain: <hostname>` on every request. The frontend supplies the resolver — SDK accepts a `getDomain(): string` function in client config.
- **Method override:** PUT/PATCH ride POST with a `_method=PUT|PATCH` query param (Laravel idiom). `app/` and `CI-WWW/` rely on this; do not break it.
- **Form data:** when payload contains a `File`/`Blob`, serialize via `object-to-formdata`-equivalent that supports nested arrays (`field[0][nested]=...`). `app/` uses this everywhere; `CI-WWW/lib/api-client.ts` already implements the nested-array form.
- **Errors:** normalize to `ApiError` with `isValidationError()` (HTTP 422 → `{ field: string[] }`), `isAuthError()` (401), `isForbiddenError()` (403), `isServerError()`. 401 should trigger an event/callback (`onUnauthorized`) the host app wires to its logout — do **not** redirect from inside the SDK.
- **Public endpoints:** `/api/load`, the `/public/auth/*` family, the Stripe webhook, and the gov directory pages must work **without** a token and must surface real HTTP status (200 vs 404) so `CI-WWW/`'s boot flow can `createError(404)`.

### Real-time

- **Wizard jobs (already shipping):** `WizardApiClient.addJobListener(jobId, fn)` opens a singleton native WebSocket to `wss://<host>/ws/jobs` and dispatches `job.status.updated` / `deal.status.updated` events. Auto-reconnects after 5s; subscriptions are reference-counted in-memory.
- **Broadcast surface (Phase 1.5):** `../api` broadcasts ~11 events via Pusher on `user-{id}` and `guest-{sessionKey}` channels and authorizes via `POST /broadcasting/auth`. `app/` already integrates `laravel-echo` directly. The SDK should ship an optional `RealtimeClient` (laravel-echo + pusher-js as **peerDependencies**, not deps — Node-side consumers must not pay the cost) wrapping the same channel/event names so all four frontends can drop their custom Echo glue.

### Multi-environment

- **Browser (sys, gov client, CI-WWW client, app client):** axios + native WebSocket. Today's path.
- **SSR (gov, CI-WWW, sys SSR):** must work in Node — no `window`, no `localStorage`. Token + domain come from injected getters, WebSocket modules are lazy-imported so the Node bundle doesn't load `pusher-js`.
- **Nuxt 2 / Vue 2 (app):** the **core client must not import Vue 3** at module top-level. Today `composables/`, `stores/`, and `router/` import Vue 3 — those must move behind subpath exports (`@arionhardison/wizard-api-client/vue3`) so `app/` can consume just the core client without pulling Vue 3 into the Vue 2 build.

## Frontend integration map

The four consumers and what each needs from the unified SDK (full investigation reports captured in conversation context):

| Frontend | Stack | Current SDK state | Headers/auth | Notes |
|----------|-------|-------------------|--------------|-------|
| `sys/` | Vue 3 + Vite, strict TS, Vitest | **Already consumes `@arionhardison/wizard-api-client@1.1.5`** via `src/composables/use-wizard-api.ts` + `src/composables/use-wizard-progress.ts`. Wraps SDK in a singleton; re-syncs headers per call; declares input shapes structurally to dodge SDK branding. | Bearer from `useUserToken()` (cookie SSR / sessionStorage SPA). `X-Domain` from `resolveActiveDomain()`. | Calls `/api/public/auth/sign-in`, `/api/user/get-data`, `/api/v1/services/{resolve,reserve}` directly via `ofetch` because the SDK does not yet cover them. |
| `gov/` | Nuxt 3 + Pinia (JS) | **No SDK dep.** Custom axios plugin at `plugins/01.use-axios.js` exposes `$get/$post/$put/$patch/$delete`. | Bearer from `authStore.user.accessToken` (httpOnly cookie). `X-Domain` from `window.location.host` or request header. 422 → `applicationStore.errors`. Cross-tab sync via `localStorage` `auth:logout`/`auth:login`. | 40+ endpoints across `ai/policy`, `ai/prompts`, `user`, `project-role`, `subproject-wizard`, `subproject-team`, `contacts`, `documentation`, `domain-interfaces`, `fees`, `c-request`, `creator`, `world-locations`, `dashboard/auth`. Sentry-tagged errors. **No WebSocket usage** today. |
| `app/` | Nuxt 2 + Vue 2 + Vuex (JS) | **No SDK dep.** Custom axios mixin at `mixins/api.js`. PUT/PATCH via POST + `_method`. `object-to-formdata` for nested payloads. | Bearer from `csapi.accessToken` (Vuex + `__Host-vuex_{hostname}` cookie). Cross-tenant tokens in `csapi.subprojectTokens[]` keyed by `_cmt/` URL prefix. Separate `dbAuth.accessToken` for `/dashboard/*`. | 117 unique endpoints. Laravel Echo on `user-{id}` (auth) / `guest-{sessionKey}` (anon) with exponential reconnect. JS-only — adopting strict TS will be IDE-only safety unless the migration to TS happens. **Migration path is incremental** (adapter layer → high-value modules → hybrid). |
| `CI-WWW/` | Nuxt 3 + strict TS, Vitest, Node 22 | **No SDK dep.** Custom axios factory at `lib/api-client.ts` exposing `$get/$post/$put/$patch/$delete`. | Bearer from `authStore.user.accessToken` (Pinia-persisted localStorage). `X-Domain` from hostname (with apex bypass). 401 → logout. Returns `null` on network failure. | Currently calls only `GET /api/load` (public, must preserve 200/404). Phase 5 will add authed pages: `/me`, `/board`, `/leader`, `/interface/load-interface`. |

**Common contract** all four expect from the SDK:

1. Injectable token + domain getters (no global state).
2. PUT/PATCH via POST + `_method`.
3. FormData with nested-array serialization for file uploads.
4. 422 surfaced as field-keyed validation errors.
5. 401 surfaced as a callback/event, not a redirect.
6. Public endpoints reachable without a token and preserving HTTP status.
7. SSR-safe: no `window`/`localStorage` at module load time.

## API surface to cover (`../api`)

Laravel 10 + nWidart modules. Total surface ≈ 523 endpoints. **No OpenAPI doc exists today** — Phase 1 must produce one. To enumerate live routes from the api repo:

```bash
cd /Users/arionhardison/Desktop/P2X/api
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

1. **Spec first.** Phase 1 step 1 is generating an OpenAPI spec from `../api` (e.g., `l5-swagger` or `scribe`) and committing it into this repo (`spec/openapi.json`). Until that lands, codegen is broken — the configured input `../public/docs/api-spec.json` doesn't exist.
2. **Test before code.** Every endpoint method gets a Vitest test using **MSW** (preferred over `axios-mock-adapter` so the same mocks work in Node and browser test envs) that asserts: URL, method, headers (`Authorization`, `X-Domain`, `Content-Type`), request body shape, and response decoding. Add the test, watch it fail, then add the method.
3. **Generated, not hand-written, where possible.** `npm run generate` should produce `src/generated/` types and a thin client. Hand-written wrappers live in `src/api/*-api-client.ts` and consume the generated layer for type safety. The current 80KB `hms-api-client.ts` is the prior-art hand-written approach — keep it working until generated equivalents pass the same tests, then replace.
4. **Coverage gate.** Add a vitest coverage threshold (target ≥90% lines/branches on `src/api/**` once codegen lands) and run it in `prepublishOnly`.
5. **Migrate the excluded suite.** `src/api/__tests__/hms-api-client.test.ts` is Jest + `axios-mock-adapter` and currently excluded from vitest. Phase 1 deliverable: port it to vitest + MSW so it runs in CI.
6. **Branding-stable types.** `sys/` deliberately re-declares input shapes structurally because earlier SDK exports collided with its branding rules. Keep public types **structural** (interfaces, not branded type aliases) so `sys/` can drop its `as unknown as` workarounds.
7. **No silent breakage.** `scripts/check-breaking-changes.js` (`npm run version:check`) and `scripts/generate-migration-guide.js` exist but are not wired to CI. Wire them.

## Build / publish notes

- Published to **GitHub Packages** (`https://npm.pkg.github.com`), scope `@arionhardison`. `publishConfig.access: public`. CI auth uses `GITHUB_TOKEN` only — no external npm secret.
- Publish workflow: `.github/workflows/publish.yml` triggers on tags `v*.*.*` or `workflow_dispatch`; runs `npm ci`, `npm run test`, `npm run build`, then `npm publish`. `prepublishOnly` also runs `npm run build`.
- `files` field ships only `dist/**/*` and `README.md`. `examples/` and `__tests__/` are intentionally excluded.
- `prebuild` does `rm -rf dist` — never put committed artifacts in `dist/`.
- Build order matters: a recent fix (commit `554a3bc`) added `build:lib` before `test` so the publish-readiness `dist/`-presence gate passes on a fresh clone. Don't reorder `prebuild`/`build:lib`/`test` without re-running the publish-readiness suite.
- `peerDependencies` (`vue ^3.4`, `pinia`, `vue-router`) are for the Vue 3 layer only. Once the core client is split behind a subpath export, those must become **optional** peerDeps so `app/` (Vue 2) and Node-side consumers don't trip resolution.

## Reference

- `README.md` — full wizard API documentation and consumer examples.
- `/CLAUDE.md` (repo root) — ecosystem overview, deployment topology, multi-tenancy patterns.
- `../api/CLAUDE.md` — the API this SDK targets.
- `../sys/CLAUDE.md`, `../gov/CLAUDE.md`, `../app/CLAUDE.md`, `../CI-WWW/CLAUDE.md` — per-consumer integration constraints.
