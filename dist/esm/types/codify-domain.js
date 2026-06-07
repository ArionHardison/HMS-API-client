/**
 * Codify-domain types — request/response shapes for the
 * `/api/codify-domain/{tld}/*` endpoints exposed by api/.
 *
 * These mirror the Laravel schemas in
 * `api/Modules/Codify/Schemas/{codify-intent,codify-deal-template,codify-domain}.schema.json`
 * (the canonical JSON schemas in `/Users/arionhardison/Desktop/P2X/schemas/`).
 *
 * Hand-written rather than generated from a TS spec — small surface, low
 * change rate, and the spec uses JSON-Schema dialect that doesn't cleanly
 * round-trip to TypeScript without manual cleanup. Bumped along with the
 * schemas under `/schemas/` whenever the canonical shape changes; the
 * SDK's contract tests will surface drift.
 */
export {};
//# sourceMappingURL=codify-domain.js.map