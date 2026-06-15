/**
 * Codify (codification surface) types — request/response shapes for the
 * parts of `api/Modules/Codify/Routes/api.php` that the existing
 * `CodifyDomainApiClient` (public domain → intent → deal-template →
 * comments) does NOT cover:
 *
 *   - Public list/kind-render/lookup helpers
 *       GET  /api/codify-domain/                         (index)
 *       GET  /api/codify-domain/{tld}/kind-render        (kindRender)
 *       GET  /api/codify/lookup/{resolver}               (lookup)
 *
 *   - Admin / HITL CRUD + approval workflow (auth:admin +
 *     permission:manage_codify_domains)
 *       codify-domain: index, show, store, update, approve, revert
 *       codify-intent: index, show, update, approve, bulkStore
 *       codify-deal-template: bulkStore
 *
 * Source of truth = the api route file + each controller action's
 * validate()/request shape, NOT guessed. Free-form / LLM-authored JSON
 * blobs (vocabulary, policy_boundary, about_copy, problem_classification,
 * parameters, …) are typed loosely (`Record<string, unknown>` / `unknown`)
 * because the canonical shapes live in the schema validator on the api
 * side and are intentionally open-ended.
 *
 * The shared intent / deal-template element types are reused from
 * `./codify-domain` so the two clients stay in lock-step.
 */

import type {
  CodifyDealTemplate,
  CodifyIntent,
  DealTemplatePipelineStep,
  DealTemplateStakeholder,
  DealTemplateSuccessCriterion,
  DealTemplateSystem,
} from './codify-domain';

export type { CodifyDealTemplate, CodifyIntent } from './codify-domain';

// ─── Shared enums ───────────────────────────────────────────────────────

/** `codify_domains.shape` enum (CodifyDomain::SHAPES). */
export type CodifyDomainShape =
  | 'vertical'
  | 'city'
  | 'political'
  | 'wrapper'
  | 'agency';

/** Lifecycle status shared by codify_domains / codify_intents / templates. */
export type CodifyStatus = 'draft' | 'review' | 'live' | 'deprecated';

// ─── Public: index ──────────────────────────────────────────────────────

/**
 * One row of `GET /api/codify-domain/` — a live domain with its live
 * intent count. Domains with zero live intents are filtered out server-side.
 */
export interface CodifyDomainListItem {
  tld: string;
  name: string;
  parent_tld: string | null;
  shape: CodifyDomainShape | string;
  intent_count: number;
}

/** Envelope of `GET /api/codify-domain/` — `{ data: [...] }`. */
export interface ListCodifyDomainsResponse {
  data: CodifyDomainListItem[];
}

// ─── Public: kind-render ────────────────────────────────────────────────

/**
 * Response of `GET /api/codify-domain/{tld}/kind-render`. `role` echoes the
 * EFFECTIVE role (null for anonymous callers — the server drops `?role=`
 * unless the caller is authenticated AND a member of that role on the TLD).
 * `layers` / `resolved` are open maps the KindRenderResolver produces.
 */
export interface KindRenderResponse {
  tld: string;
  role: string | null;
  context: string | null;
  layers: Record<string, unknown>;
  resolved: Record<string, unknown>;
}

/** Optional query for kindRender / the layered domain payload. */
export interface KindRenderQuery {
  /** Echoed back only when authenticated + role-member; otherwise dropped. */
  role?: string;
  /** Free-form context discriminator (≤80 chars server-side). */
  context?: string;
}

// ─── Public: lookup (controlled-input autocomplete) ─────────────────────

/** One autocomplete result row from `GET /api/codify/lookup/{resolver}`. */
export interface LookupResult {
  id: string | number;
  label: string;
  meta?: Record<string, unknown>;
}

export interface LookupResponseMeta {
  resolver: string;
  backend: string;
  count: number;
  /** Present (`external_budget_exhausted`) when a paid backend is capped. */
  note?: string;
}

/** Response of `GET /api/codify/lookup/{resolver}`. */
export interface LookupResponse {
  results: LookupResult[];
  meta: LookupResponseMeta;
}

/**
 * Query for the lookup resolver. `q` + `tld` are reserved; any other key is
 * forwarded verbatim to the resolver backend (classification, resource,
 * state_code, country, …).
 */
export interface LookupQuery {
  q?: string;
  tld?: string;
  [param: string]: string | number | boolean | undefined;
}

// ─── Admin: codify-domain ───────────────────────────────────────────────

/**
 * A persisted codify_domains row as returned by the admin endpoints. This
 * is `CodifyDomain::toSchemaArray()` + the appended numeric `id`. The
 * free-form ontology blobs are open maps (validated against
 * codify-domain.schema.json server-side, not here).
 */
export interface AdminCodifyDomain {
  id: number;
  tld: string;
  shape: CodifyDomainShape | string;
  parent_tld: string | null;
  status: CodifyStatus;
  version: number;
  vocabulary: Record<string, unknown>;
  policy_boundary: Record<string, unknown>;
  authority_structure: Record<string, unknown>;
  substrate_systems: unknown;
  stakeholder_onet_codes: unknown[];
  about_copy: Record<string, unknown>;
  kind_render?: Record<string, unknown>;
  created_at: string | null;
  updated_at: string | null;
  approved_at: string | null;
  approved_by: string | null;
}

/** Paginated envelope of `GET /api/admin/codify-domain`. */
export interface AdminListCodifyDomainsResponse {
  data: AdminCodifyDomain[];
  total: number;
}

/** Optional filters for `GET /api/admin/codify-domain`. */
export interface AdminCodifyDomainQuery {
  status?: CodifyStatus;
  tld?: string;
}

/**
 * Body for `POST /api/admin/codify-domain`. Validated against
 * codify-domain.schema.json on the api side; `status`/`version` are forced
 * server-side (draft / next version) so they are not part of the contract.
 */
export interface CreateCodifyDomainRequest {
  tld: string;
  shape: CodifyDomainShape | string;
  parent_tld?: string | null;
  vocabulary: Record<string, unknown>;
  policy_boundary: Record<string, unknown>;
  authority_structure: Record<string, unknown>;
  substrate_systems: unknown;
  stakeholder_onet_codes?: unknown[];
  about_copy: Record<string, unknown>;
  kind_render?: Record<string, unknown>;
}

/**
 * Body for `PUT /api/admin/codify-domain/{id}` — partial edit of a DRAFT
 * row. Only the editable columns are accepted; the merged result must still
 * validate against the schema (409 if the row is not a draft).
 */
export interface UpdateCodifyDomainRequest {
  shape?: CodifyDomainShape | string;
  parent_tld?: string | null;
  vocabulary?: Record<string, unknown>;
  policy_boundary?: Record<string, unknown>;
  authority_structure?: Record<string, unknown>;
  substrate_systems?: unknown;
  stakeholder_onet_codes?: unknown[];
  about_copy?: Record<string, unknown>;
}

// ─── Admin: codify-intent ───────────────────────────────────────────────

/**
 * A persisted codify_intents row from the admin endpoints —
 * `CodifyIntent::toSchemaArray()` + `id` + `domain_id`.
 */
export type AdminCodifyIntent = CodifyIntent & {
  id: number;
  domain_id: number;
};

/** Paginated envelope of `GET /api/admin/codify-intent`. */
export interface AdminListCodifyIntentsResponse {
  data: AdminCodifyIntent[];
  total: number;
}

/** Optional filters for `GET /api/admin/codify-intent`. */
export interface AdminCodifyIntentQuery {
  domain_id?: number;
  tld?: string;
  status?: CodifyStatus;
  slug?: string;
}

/**
 * Body for `PUT /api/admin/codify-intent/{id}` — partial edit of a DRAFT
 * intent. Only these columns are accepted; the merged row must still
 * validate against codify-intent.schema.json.
 */
export interface UpdateCodifyIntentRequest {
  narrative?: string;
  intent_class?: string;
  frequency_hint?: CodifyIntent['frequency_hint'];
  stakes_hint?: CodifyIntent['stakes_hint'];
  example_constraints?: unknown[];
  parameters?: CodifyIntent['parameters'];
}

/**
 * One intent in a `POST /api/admin/codify-intent` bulk store. Each entry is
 * validated against codify-intent.schema.json. `domain_id` is resolved from
 * `tld` server-side when omitted.
 */
export interface BulkStoreIntentEntry {
  tld: string;
  slug: string;
  narrative: string;
  intent_class: string;
  domain_id?: number;
  frequency_hint?: CodifyIntent['frequency_hint'];
  stakes_hint?: CodifyIntent['stakes_hint'];
  example_constraints?: unknown[];
  parameters?: CodifyIntent['parameters'];
  status?: CodifyStatus;
  version?: number;
}

/** Body for `POST /api/admin/codify-intent` (bulk store). */
export interface BulkStoreIntentsRequest {
  intents: BulkStoreIntentEntry[];
}

// ─── Admin: codify-deal-template ────────────────────────────────────────

/**
 * One template in a `POST /api/admin/codify-deal-template` bulk store. Each
 * entry is validated against codify-deal-template.schema.json. `intent_id`
 * is resolved from `(tld, intent_slug)` server-side.
 */
export interface BulkStoreDealTemplateEntry {
  tld: string;
  intent_slug: string;
  problem_classification: {
    ontology_class: string;
    summary: string;
  } & Record<string, unknown>;
  required_stakeholders: DealTemplateStakeholder[];
  required_systems: DealTemplateSystem[];
  pipeline_steps: DealTemplatePipelineStep[];
  success_criteria: DealTemplateSuccessCriterion;
  financial_model?: CodifyDealTemplate['financial_model'];
  policy_edge_ref?: string;
  status?: CodifyStatus;
  version?: number;
}

/** Body for `POST /api/admin/codify-deal-template` (bulk store). */
export interface BulkStoreDealTemplatesRequest {
  templates: BulkStoreDealTemplateEntry[];
}

/**
 * Response of the two bulk-store endpoints — `{ created: <n> }` (201).
 */
export interface BulkStoreResponse {
  created: number;
}
