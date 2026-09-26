/**
 * Type contracts for `MiscCoreApiClient`.
 *
 * Source of truth: `sdk/spec/endpoints.json` — the long-tail Core endpoints
 * that don't fit the themed client buckets (chain/schedule/wizard/etc.).
 * Most are `auth: public` (home/feed/search/showcase/gov directory) with
 * a sprinkling of admin-side updates and authenticated user-account
 * mutations. Shapes are derived from each endpoint's `request.shape` /
 * `response.shape` — empty shapes fall back to permissive structural types.
 */
export {};
//# sourceMappingURL=misc-core.js.map