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
export interface ChainRecord {
    id?: number;
    [key: string]: unknown;
}
export interface CreateChainRequest {
    /** Display name for the chain. */
    name?: string;
    /** Parent protocol id, if any. */
    parent_id?: number;
    [key: string]: unknown;
}
export interface UpdateChainRequest {
    name?: string;
    [key: string]: unknown;
}
export interface SwitchChainParentRequest {
    /** New parent id. */
    parent_id?: number;
    [key: string]: unknown;
}
//# sourceMappingURL=chain.d.ts.map