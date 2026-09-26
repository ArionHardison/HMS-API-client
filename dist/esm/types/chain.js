/**
 * Type contracts for `ChainApiClient`.
 *
 * Source of truth: `sdk/spec/endpoints.json` — entries under `/api/chain*`
 * (excluding `/api/personal-chain/*` which is owned by another slice).
 *
 * Most endpoints have empty `request.shape` / `response.shape` in the spec,
 * so we expose permissive structural records — sufficient for IDE
 * auto-complete without lying about controller-side fields.
 */
export {};
//# sourceMappingURL=chain.js.map