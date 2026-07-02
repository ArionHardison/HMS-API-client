/**
 * CodifyApiClient — the codification surface of `api/Modules/Codify` that
 * the public-read `CodifyDomainApiClient` does NOT cover:
 *
 *   Public helpers (throttled, soft-auth / anon-allowed):
 *     GET  /api/codify-domain/                          listDomains
 *     GET  /api/codify-domain/{tld}/kind-render         getKindRender
 *     GET  /api/codify/lookup/{resolver}                lookup
 *
 *   Admin / HITL CRUD + approval (auth:admin +
 *   permission:manage_codify_domains — pass an admin Bearer via getToken):
 *     GET    /api/admin/codify-domain                   adminListDomains
 *     GET    /api/admin/codify-domain/{id}              adminShowDomain
 *     POST   /api/admin/codify-domain                   adminCreateDomain
 *     PUT    /api/admin/codify-domain/{id}              adminUpdateDomain
 *     POST   /api/admin/codify-domain/{id}/approve      adminApproveDomain
 *     POST   /api/admin/codify-domain/{id}/revert       adminRevertDomain
 *     GET    /api/admin/codify-intent                   adminListIntents
 *     GET    /api/admin/codify-intent/{id}              adminShowIntent
 *     PUT    /api/admin/codify-intent/{id}              adminUpdateIntent
 *     POST   /api/admin/codify-intent/{id}/approve      adminApproveIntent
 *     POST   /api/admin/codify-intent                   adminBulkStoreIntents
 *     POST   /api/admin/codify-deal-template            adminBulkStoreDealTemplates
 *
 * Companion to `CodifyDomainApiClient` (public domain → intent → deal-
 * template → comments). Named `CodifyApiClient` (not `CodifyDomainApiClient`)
 * to avoid the existing class collision.
 *
 * Response envelopes: the admin + public-list endpoints return RAW JSON
 * (NOT the `{ success, message, data }` Laravel envelope). `BaseApiClient`
 * returns the parsed body verbatim, so the typed `ApiResponse<T>` here is a
 * structural alias — read the body off the top-level fields (`.data`,
 * `.total`, `.id`, …) the controllers emit, not `res.data` of an envelope.
 *
 * `BaseApiClient` already handles, per the contract suite:
 *   - `Authorization: Bearer` injection (skip per call via `{ auth: false }`)
 *   - `X-Domain` header from `getDomain` (the lookup resolver is tenant-scoped)
 *   - PUT → POST + `?_method=PUT` (Laravel); admin updates are real PUTs on the
 *     route but go out as the override
 *   - 401 / 422 → callback + `ApiError`
 *
 * Idempotency: the admin write endpoints are not on the `/integrations/*`
 * idempotency middleware, so no `Idempotency-Key` is sent by default. The
 * per-call `opts.headers` escape hatch is still available if a caller wants
 * one.
 */
import { BaseApiClient, type ApiResponse } from '../api-client';
import type { AdminCodifyDomain, AdminCodifyDomainQuery, AdminCodifyIntent, AdminCodifyIntentQuery, AdminListCodifyDomainsResponse, AdminListCodifyIntentsResponse, BulkStoreDealTemplatesRequest, BulkStoreIntentsRequest, BulkStoreResponse, CreateCodifyDomainRequest, KindRenderQuery, KindRenderResponse, ListCodifyDomainsResponse, LookupQuery, LookupResponse, UpdateCodifyDomainRequest, UpdateCodifyIntentRequest } from '../types/codify';
export declare class CodifyApiClient extends BaseApiClient {
    /**
     * GET /api/codify-domain/ — list every LIVE codify domain (with live
     * intent counts), filtered to domains that have ≥1 live intent. Anon-
     * allowed + per-IP throttled. Body shape: `{ data: CodifyDomainListItem[] }`.
     */
    listDomains(): Promise<ApiResponse<ListCodifyDomainsResponse>>;
    /**
     * GET /api/codify-domain/{tld}/kind-render — resolved kind_render map for a
     * TLD. `role` is silently dropped for anonymous callers (the server returns
     * `role: null` + the base-layer map). 404 when the TLD has no live domain.
     */
    getKindRender(tld: string, query?: KindRenderQuery): Promise<ApiResponse<KindRenderResponse>>;
    /**
     * GET /api/codify/lookup/{resolver} — tenant-scoped controlled-input
     * autocomplete. `q` + `tld` are reserved; any other query key is forwarded
     * to the resolver backend. Unknown resolver → 404 `resolver_not_registered`;
     * an external (paid) backend requires auth → 401 `authentication_required`.
     * Returns `{ results, meta }`.
     */
    lookup(resolver: string, query?: LookupQuery): Promise<ApiResponse<LookupResponse>>;
    /**
     * GET /api/admin/codify-domain — paginated (50/page) list of domains across
     * all statuses, optionally filtered by `status` / `tld`. Body:
     * `{ data: AdminCodifyDomain[], total }`.
     */
    adminListDomains(query?: AdminCodifyDomainQuery): Promise<ApiResponse<AdminListCodifyDomainsResponse>>;
    /** GET /api/admin/codify-domain/{id} — single domain (any status). */
    adminShowDomain(id: number): Promise<ApiResponse<AdminCodifyDomain>>;
    /**
     * POST /api/admin/codify-domain — create a DRAFT domain. Validated against
     * codify-domain.schema.json (422 on failure). Returns the new row (201) with
     * `status: 'draft'` + the assigned `version`.
     */
    adminCreateDomain(body: CreateCodifyDomainRequest): Promise<ApiResponse<AdminCodifyDomain>>;
    /**
     * PUT /api/admin/codify-domain/{id} — partial edit of a DRAFT domain (409
     * if not a draft). Sent as POST + `?_method=PUT`. The merged row must still
     * validate (422 otherwise). Returns the refreshed row.
     */
    adminUpdateDomain(id: number, body: UpdateCodifyDomainRequest): Promise<ApiResponse<AdminCodifyDomain>>;
    /**
     * POST /api/admin/codify-domain/{id}/approve — promote a DRAFT to LIVE
     * (demotes the prior live version to deprecated + fires CodifyDomainApproved).
     * 409 if the row is not a draft. Returns the now-live row.
     */
    adminApproveDomain(id: number): Promise<ApiResponse<AdminCodifyDomain>>;
    /**
     * POST /api/admin/codify-domain/{id}/revert — demote a LIVE row and restore
     * the prior deprecated version to live. 409 if the row is not live or no
     * prior version exists. Returns the restored (now-live) row.
     */
    adminRevertDomain(id: number): Promise<ApiResponse<AdminCodifyDomain>>;
    /**
     * GET /api/admin/codify-intent — paginated (50/page) list of intents,
     * optionally filtered by `domain_id` / `tld` / `status` / `slug`. Body:
     * `{ data: AdminCodifyIntent[], total }`.
     */
    adminListIntents(query?: AdminCodifyIntentQuery): Promise<ApiResponse<AdminListCodifyIntentsResponse>>;
    /** GET /api/admin/codify-intent/{id} — single intent (any status). */
    adminShowIntent(id: number): Promise<ApiResponse<AdminCodifyIntent>>;
    /**
     * PUT /api/admin/codify-intent/{id} — partial edit of a DRAFT intent (409
     * if not a draft). Sent as POST + `?_method=PUT`. The merged row must still
     * validate against codify-intent.schema.json (422 otherwise).
     */
    adminUpdateIntent(id: number, body: UpdateCodifyIntentRequest): Promise<ApiResponse<AdminCodifyIntent>>;
    /**
     * POST /api/admin/codify-intent/{id}/approve — promote a DRAFT intent to
     * LIVE (demotes the prior live (tld, slug) + fires CodifyIntentApproved).
     * 409 if not a draft.
     */
    adminApproveIntent(id: number): Promise<ApiResponse<AdminCodifyIntent>>;
    /**
     * POST /api/admin/codify-intent — bulk-create intents. Each entry is
     * validated against codify-intent.schema.json; the whole batch fails 422 on
     * the first bad row (or 422 `No intents supplied.` on an empty array).
     * Returns `{ created: <n> }` (201).
     */
    adminBulkStoreIntents(body: BulkStoreIntentsRequest): Promise<ApiResponse<BulkStoreResponse>>;
    /**
     * POST /api/admin/codify-deal-template — bulk-create deal templates. Each
     * entry is validated against codify-deal-template.schema.json and its
     * `(tld, intent_slug)` must resolve to an existing intent (422 otherwise).
     * Returns `{ created: <n> }` (201).
     */
    adminBulkStoreDealTemplates(body: BulkStoreDealTemplatesRequest): Promise<ApiResponse<BulkStoreResponse>>;
}
//# sourceMappingURL=codify-api-client.d.ts.map