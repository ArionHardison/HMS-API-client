/**
 * Shared subproject section payloads used by every wizard / admin / claim
 * surface that walks an admin through configuring a subproject. Six sections,
 * each with a stable shape across:
 *   - /api/subproject-admin/create/subproject/{section}
 *   - /api/subproject-admin/claim/subproject/{subproject}/{section}
 *   - /api/subproject-wizard/{section}/{id}
 *   - /api/project-settings/{section}/{subproject?}
 *
 * Source of truth: `sdk/spec/endpoints.json` request shapes for each section.
 */
export {};
//# sourceMappingURL=subproject-sections.js.map