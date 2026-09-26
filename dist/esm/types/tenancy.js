/**
 * Tenancy + Subproject + Domain slice — request / response types.
 *
 * Source of truth: `sdk/spec/endpoints.json`. Each interface mirrors the
 * `request.shape` or `response.shape` of one or more endpoints. `unknown`
 * preserves the spec's "shape unknown" cases (Laravel Resource
 * `parent::toArray($request)`, scraped `request->input('x')` keys, etc.).
 *
 * Structural interfaces only — no branded type aliases.
 */
export {};
//# sourceMappingURL=tenancy.js.map