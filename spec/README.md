# P2X API Endpoint Manifest

This directory is the **single source of truth** for every HTTP endpoint exposed by `/Users/arionhardison/Desktop/P2X/api`. Module-agent SDK code generators and TDD test suites read from these files; do not edit them by hand — regenerate.

## Files

| File | Purpose |
|------|---------|
| `endpoints.json` | One entry per `(method, uri)` pair. Carries auth, controller, request shape, response shape, broadcasts, file-upload flag, path/query params. |
| `openapi.json`   | Valid OpenAPI 3.1.0 derived from `endpoints.json`. Validated with `redocly lint` (only `no-server-example.com` warning remains). |
| `skipped.json`   | Routes that could not be fully characterized — phantom resource actions, MCP closure, Coinbase vendor webhook. 39 entries; see [Phantom routes](#phantom-routes). |

## Endpoint counts

Cross-checked against `php artisan route:list --json` (vendor packages filtered): the route table reports **810 unique `(method, uri)` API/broadcasting pairs**, and `endpoints.json` contains exactly **810** entries — perfect match.

| Module | Endpoints |
|--------|-----------|
| `Core` | 550 |
| `Modules/Activity` | 31 |
| `Modules/Assessments` | 31 |
| `Modules/Order` | 22 |
| `Modules/Agents` | 20 |
| `Modules/Items` | 20 |
| `Modules/Challenge` | 18 |
| `Modules/FollowUps` | 15 |
| `Modules/KPI` | 13 |
| `Modules/Connector` | 10 |
| `Modules/Nudge` | 10 |
| `Modules/Appeal` | 9 |
| `Modules/Application` | 9 |
| `Modules/Disbursement` | 9 |
| `Modules/Referral` | 9 |
| `Modules/Report` | 9 |
| `Modules/Verification` | 9 |
| `Modules/ETL` | 7 |
| `Modules/Workflow` | 5 |
| `Modules/Services` | 3 |
| `Vendor/Coinbase` | 1 |
| **Total** | **810** |

HTTP verbs: `GET 413`, `POST 272`, `PUT 47`, `DELETE 71`, `PATCH 7`.

## Auth-guard map

The SDK should dispatch on `endpoints[i].auth`:

| `auth` | Count | Middleware | SDK implication |
|--------|-------|-----------|-----------------|
| `api`     | 537 | `App\Http\Middleware\Authenticate:api` | Default Sanctum guard, public-facing user token. SDK default. |
| `admin`   | 150 | `App\Http\Middleware\Authenticate:admin` | Admin dashboard token (`dbAuth` in `app/`). SDK should expose a separate admin client or token slot. |
| `sanctum` | 22  | `App\Http\Middleware\Authenticate:sanctum` | Long-lived machine token used by subprojects/IBD/PHM server-to-server pushes. |
| `public`  | 101 | (no auth middleware) | No bearer required; `X-Domain` still required. Includes auth, registration, public dashboard reads, MCP connector, Coinbase webhook. |

`broadcasting` (Pusher channel auth) routes (`POST /api/broadcasting/auth`) are bucketed under `public` because their auth happens via the bound Echo client, not Sanctum middleware.

## Regenerating this manifest

From repo root:

```bash
# 1) Capture the route table
cd api && php artisan route:list --json > /tmp/routes_full.json

# 2) Build class -> file map at /tmp/class_map.json (PHP -> file path).
#    Walk every *.php under api/Modules and api/app, regex out `namespace ...;` + `class X`,
#    write { "App\\\\Foo\\\\Bar": "/abs/path/Foo/Bar.php", ... } to /tmp/class_map.json.

# 3) Walk routes, parse controllers, write endpoints.json + skipped.json
python3 sdk/spec/scripts/build_manifest.py

# 4) Project to OpenAPI 3.1
python3 sdk/spec/scripts/build_openapi.py

# 5) Validate
cd sdk && npx --yes --package=@redocly/cli@1.16.0 redocly lint spec/openapi.json
```

Step 2's class-map builder is a 30-line throwaway (regex over `*.php`); the two committed scripts in `scripts/` are the persistent artifact. Update the JSONs in this directory only via the scripts — never hand-edit.

### Parsing strategy

For each route, `build_manifest.py`:

1. Locates the controller PHP file from a fully-qualified-class-name → path map (built by walking `app/`, `Modules/`, `routes/`, etc., skipping vendor/worktrees/etc.).
2. Finds the controller method via a brace-balanced regex scan.
3. **Request shape:**
   - If the method signature contains a `*Request` typehint, that FormRequest's `rules()` array is parsed (top-level only — nested keys like `working_days.*.day_name` are flattened to `working_days: unknown[]`). Required vs optional is inferred from `required` in the rule string.
   - Otherwise, `$request->validate([...])` blocks are parsed identically.
   - Otherwise, `$request->input('key')`, `$request->get('key')`, and `$request->only([...])` calls are scraped to enumerate at least the field names; type defaults to `unknown?`.
4. **Response shape:**
   - First match of `new XxxResource(...)`, `XxxResource::collection(...)`, `XxxResource::make(...)`, `XxxResource::wrap(...)` — the corresponding class's `toArray()` is parsed for top-level keys (types guessed by name: `id`/`*_id` → number, `*_at` → string, `is_*`/`has_*` → boolean, etc.).
   - Otherwise `response()->json([...])` or `return [...]` literal — keys captured as `unknown`.
   - `wrapper`: `data` (single Resource), `paginated` (collection or paginate present), `raw` (literal JSON return). Single Resources are wrapped because Laravel Resources emit `{data: ...}` by default.

## Known dynamic / non-trivial endpoints

### File uploads (`fileUpload: true`) — 12 endpoints

These advertise `multipart/form-data` in the OpenAPI doc:

- `POST /api/agent/communicate/{chain}/send-message` (chat attachments)
- `POST /api/dashboard-settings/save`
- `POST /api/follow-up/voice-record` (voice memo)
- `POST /api/order/validate-item`, `PUT /api/order/{order}`
- `POST /api/public/codify/run`
- `POST /api/question`, `PUT /api/question/{question}` (assessment images)
- `POST /api/tenant-claim/verify` (KYC docs)
- `PUT /api/user-items/{user_item}`
- `POST /api/wizard/codify/{protocol}`, `POST /api/workflow/codify-pipeline/start`

### Endpoints that broadcast events — 7

All seven dispatch the same `ProtocolStepFinished` event over Pusher (Echo) — these are the "step-completion" terminals of the Five-Step Wizard:

```
POST /api/appeal/submit
POST /api/application/submit
POST /api/connector/execute
POST /api/disbursement/confirm
POST /api/referral/confirm
POST /api/report/submit
POST /api/verification/submit
```

The SDK's WebSocket job-progress tracker should already subscribe to whatever channel `ProtocolStepFinished` broadcasts on (`PrivateChannel("user.{userId}")` per app convention). Treat these as the canonical "wizard step finished" trigger.

### Public webhook receivers

- `POST /api/coinbase/webhook` — `Shakurov\Coinbase\Http\Controllers\WebhookController`. Public, signature-verified by `Shakurov\Coinbase\Http\Middleware\VerifySignature`. The SDK should not surface this as a callable method; it is for Coinbase to call us.
- `POST /api/broadcasting/auth` — Echo channel-authorization endpoint. Used by `laravel-echo` clients, not directly by the SDK.

### MCP connector closure

`GET /api/mcp/connector` and `POST /api/mcp/connector` are registered as Laravel-MCP closures via `Laravel\Mcp\Server\*` middleware (`ReorderJsonAccept`, `AddWwwAuthenticateHeader`). The body is a JSON-RPC envelope, not a Laravel-typed controller. Wrap as a single `mcp.connector` SDK method that takes/returns `unknown` and let callers cast on the JSON-RPC `method` field.

### Throttled

Only one endpoint is wrapped with rate limiting:

- `POST /api/public/contact` — `Illuminate\Routing\Middleware\ThrottleRequests:3,1` (3 hits / minute).

## Phantom routes

`skipped.json` contains 39 entries. Three categories:

1. **MCP closure** (2): `GET|POST /api/mcp/connector`. Discussed above.
2. **Vendor webhook** (1): `POST /api/coinbase/webhook`.
3. **Resource-route phantoms** (36): routes declared via `Route::apiResource(...)` whose controllers do not implement the corresponding action method. Hitting these returns Laravel's `BadMethodCallException` at controller dispatch. Tests should assert this until either (a) the controller is filled in or (b) the route declarations are tightened with `->only([...])`.

   Examples:
   ```
   POST   /api/ai/log               -> AiLogsController@store           (controller has only index/show/destroy)
   POST   /api/program-sale         -> ProgramSaleController@store      (entire CRUD missing)
   GET    /api/follow-up            -> FollowUpsController@index        (controller has only domain methods; no resource actions)
   POST   /api/role                 -> RolesController@store            (controller has only index)
   POST   /api/creator              -> CreatorsController@store         (controller has only index/show/update)
   ```

## Manual review needed

The following classes of inference may be wrong; module agents should re-verify before generating tests:

- **Resources that just `return parent::toArray($request)`** — `shape: {}` because we can't see the underlying model. Affects ~70 routes including `activity-location.*`, several wizard reads, and dashboard listings. A future pass could read the Eloquent model's `$fillable` / `$casts` to fill the gap.
- **Endpoints where `request.shape` is empty but the controller returns 4xx without the right body** — POST/PUT/PATCH routes flagged below have no FormRequest, no inline `validate()`, and no scraped `input/get/only` calls. They likely accept *some* body but our static analysis found nothing. The full list is 40 entries; notable ones:
  - `POST /api/agents/{agent}/activate`, `/deactivate`, `/tools/{tool}` (Agents module)
  - `POST /api/ai/install-model`, `/api/ai/delete-model`
  - `POST /api/items`, `PUT /api/items/{item}`
  - `POST /api/follow-up`, `PUT /api/follow-up/{follow_up}` (these are also in the phantom list)
- **`rules` strings containing PHP regex `/.../i`** — the regex's `|` characters bleed into our pipe-split rule parser, leaving truncated entries in `request.rules`. The `request.shape` field is unaffected (the `string` type is correctly inferred), but consumers should treat `rules` as a hint, not a contract.
- **Routes whose controller method name was not found in the declared class** — see `skipped.json`. We did *not* trace `extends` parents; if a parent action is genuinely meant to be inherited, those need manual confirmation.

## Worktree

Generated on branch `main` of worktree `/Users/arionhardison/Desktop/P2X/sdk/.claude/worktrees/agent-a4bd6095a0aa1fb44`. Merge to `main` once module agents have consumed it.
