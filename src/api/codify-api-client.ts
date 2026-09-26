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
import type {
  AdminCodifyDomain,
  AdminCodifyDomainQuery,
  AdminCodifyIntent,
  AdminCodifyIntentQuery,
  AdminListCodifyDomainsResponse,
  AdminListCodifyIntentsResponse,
  BulkStoreDealTemplatesRequest,
  BulkStoreIntentsRequest,
  BulkStoreResponse,
  CreateCodifyDomainRequest,
  KindRenderQuery,
  KindRenderResponse,
  ListCodifyDomainsResponse,
  LookupQuery,
  LookupResponse,
  UpdateCodifyDomainRequest,
  UpdateCodifyIntentRequest,
} from '../types/codify';

export class CodifyApiClient extends BaseApiClient {
  // ===========================================================================
  // Public helpers
  // ===========================================================================

  /**
   * GET /api/codify-domain/ — list every LIVE codify domain (with live
   * intent counts), filtered to domains that have ≥1 live intent. Anon-
   * allowed + per-IP throttled. Body shape: `{ data: CodifyDomainListItem[] }`.
   */
  async listDomains(): Promise<ApiResponse<ListCodifyDomainsResponse>> {
    return this.get<ListCodifyDomainsResponse>('/api/codify-domain/');
  }

  /**
   * GET /api/codify-domain/{tld}/kind-render — resolved kind_render map for a
   * TLD. `role` is silently dropped for anonymous callers (the server returns
   * `role: null` + the base-layer map). 404 when the TLD has no live domain.
   */
  async getKindRender(
    tld: string,
    query?: KindRenderQuery,
  ): Promise<ApiResponse<KindRenderResponse>> {
    return this.get<KindRenderResponse>(
      `/api/codify-domain/${encodeURIComponent(tld)}/kind-render`,
      query as Record<string, string> | undefined,
    );
  }

  /**
   * GET /api/codify/lookup/{resolver} — tenant-scoped controlled-input
   * autocomplete. `q` + `tld` are reserved; any other query key is forwarded
   * to the resolver backend. Unknown resolver → 404 `resolver_not_registered`;
   * an external (paid) backend requires auth → 401 `authentication_required`.
   * Returns `{ results, meta }`.
   */
  async lookup(
    resolver: string,
    query?: LookupQuery,
  ): Promise<ApiResponse<LookupResponse>> {
    return this.get<LookupResponse>(
      `/api/codify/lookup/${encodeURIComponent(resolver)}`,
      query as Record<string, string | number | boolean> | undefined,
    );
  }

  // ===========================================================================
  // Admin — codify-domain
  // ===========================================================================

  /**
   * GET /api/admin/codify-domain — paginated (50/page) list of domains across
   * all statuses, optionally filtered by `status` / `tld`. Body:
   * `{ data: AdminCodifyDomain[], total }`.
   */
  async adminListDomains(
    query?: AdminCodifyDomainQuery,
  ): Promise<ApiResponse<AdminListCodifyDomainsResponse>> {
    return this.get<AdminListCodifyDomainsResponse>(
      '/api/admin/codify-domain',
      query as Record<string, string> | undefined,
    );
  }

  /** GET /api/admin/codify-domain/{id} — single domain (any status). */
  async adminShowDomain(id: number): Promise<ApiResponse<AdminCodifyDomain>> {
    return this.get<AdminCodifyDomain>(
      `/api/admin/codify-domain/${encodeURIComponent(String(id))}`,
    );
  }

  /**
   * POST /api/admin/codify-domain — create a DRAFT domain. Validated against
   * codify-domain.schema.json (422 on failure). Returns the new row (201) with
   * `status: 'draft'` + the assigned `version`.
   */
  async adminCreateDomain(
    body: CreateCodifyDomainRequest,
  ): Promise<ApiResponse<AdminCodifyDomain>> {
    return this.post<AdminCodifyDomain>(
      '/api/admin/codify-domain',
      body as unknown as Record<string, unknown>,
    );
  }

  /**
   * PUT /api/admin/codify-domain/{id} — partial edit of a DRAFT domain (409
   * if not a draft). Sent as POST + `?_method=PUT`. The merged row must still
   * validate (422 otherwise). Returns the refreshed row.
   */
  async adminUpdateDomain(
    id: number,
    body: UpdateCodifyDomainRequest,
  ): Promise<ApiResponse<AdminCodifyDomain>> {
    return this.put<AdminCodifyDomain>(
      `/api/admin/codify-domain/${encodeURIComponent(String(id))}`,
      body as unknown as Record<string, unknown>,
    );
  }

  /**
   * POST /api/admin/codify-domain/{id}/approve — promote a DRAFT to LIVE
   * (demotes the prior live version to deprecated + fires CodifyDomainApproved).
   * 409 if the row is not a draft. Returns the now-live row.
   */
  async adminApproveDomain(id: number): Promise<ApiResponse<AdminCodifyDomain>> {
    return this.post<AdminCodifyDomain>(
      `/api/admin/codify-domain/${encodeURIComponent(String(id))}/approve`,
    );
  }

  /**
   * POST /api/admin/codify-domain/{id}/revert — demote a LIVE row and restore
   * the prior deprecated version to live. 409 if the row is not live or no
   * prior version exists. Returns the restored (now-live) row.
   */
  async adminRevertDomain(id: number): Promise<ApiResponse<AdminCodifyDomain>> {
    return this.post<AdminCodifyDomain>(
      `/api/admin/codify-domain/${encodeURIComponent(String(id))}/revert`,
    );
  }

  // ===========================================================================
  // Admin — codify-intent
  // ===========================================================================

  /**
   * GET /api/admin/codify-intent — paginated (50/page) list of intents,
   * optionally filtered by `domain_id` / `tld` / `status` / `slug`. Body:
   * `{ data: AdminCodifyIntent[], total }`.
   */
  async adminListIntents(
    query?: AdminCodifyIntentQuery,
  ): Promise<ApiResponse<AdminListCodifyIntentsResponse>> {
    return this.get<AdminListCodifyIntentsResponse>(
      '/api/admin/codify-intent',
      query as Record<string, string | number> | undefined,
    );
  }

  /** GET /api/admin/codify-intent/{id} — single intent (any status). */
  async adminShowIntent(id: number): Promise<ApiResponse<AdminCodifyIntent>> {
    return this.get<AdminCodifyIntent>(
      `/api/admin/codify-intent/${encodeURIComponent(String(id))}`,
    );
  }

  /**
   * PUT /api/admin/codify-intent/{id} — partial edit of a DRAFT intent (409
   * if not a draft). Sent as POST + `?_method=PUT`. The merged row must still
   * validate against codify-intent.schema.json (422 otherwise).
   */
  async adminUpdateIntent(
    id: number,
    body: UpdateCodifyIntentRequest,
  ): Promise<ApiResponse<AdminCodifyIntent>> {
    return this.put<AdminCodifyIntent>(
      `/api/admin/codify-intent/${encodeURIComponent(String(id))}`,
      body as unknown as Record<string, unknown>,
    );
  }

  /**
   * POST /api/admin/codify-intent/{id}/approve — promote a DRAFT intent to
   * LIVE (demotes the prior live (tld, slug) + fires CodifyIntentApproved).
   * 409 if not a draft.
   */
  async adminApproveIntent(id: number): Promise<ApiResponse<AdminCodifyIntent>> {
    return this.post<AdminCodifyIntent>(
      `/api/admin/codify-intent/${encodeURIComponent(String(id))}/approve`,
    );
  }

  /**
   * POST /api/admin/codify-intent — bulk-create intents. Each entry is
   * validated against codify-intent.schema.json; the whole batch fails 422 on
   * the first bad row (or 422 `No intents supplied.` on an empty array).
   * Returns `{ created: <n> }` (201).
   */
  async adminBulkStoreIntents(
    body: BulkStoreIntentsRequest,
  ): Promise<ApiResponse<BulkStoreResponse>> {
    return this.post<BulkStoreResponse>(
      '/api/admin/codify-intent',
      body as unknown as Record<string, unknown>,
    );
  }

  // ===========================================================================
  // Admin — codify-deal-template
  // ===========================================================================

  /**
   * POST /api/admin/codify-deal-template — bulk-create deal templates. Each
   * entry is validated against codify-deal-template.schema.json and its
   * `(tld, intent_slug)` must resolve to an existing intent (422 otherwise).
   * Returns `{ created: <n> }` (201).
   */
  async adminBulkStoreDealTemplates(
    body: BulkStoreDealTemplatesRequest,
  ): Promise<ApiResponse<BulkStoreResponse>> {
    return this.post<BulkStoreResponse>(
      '/api/admin/codify-deal-template',
      body as unknown as Record<string, unknown>,
    );
  }
}
