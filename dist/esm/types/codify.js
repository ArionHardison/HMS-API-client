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
export {};
//# sourceMappingURL=codify.js.map