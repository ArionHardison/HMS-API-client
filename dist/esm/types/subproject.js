/**
 * Subproject (hierarchy-aware) — request / response types for the
 * `SubprojectApiClient`.
 *
 * The SDK contract treats subprojects as a tree: each subproject can
 * have a `parent_subproject_id`, and effective values for most
 * presentation/branding/system fields inherit upward. `chain` carries
 * the resolved ancestor list (leaf -> root, EXCLUDING the leaf itself)
 * so the SDK never has to walk the tree itself — api/ resolves it once
 * and the client surfaces the pre-flattened chain.
 *
 * Source of truth on the api/ side: `SubprojectClientDataResource`
 * (api/app/Http/Resources/CodifySubprojects/SubprojectClientDataResource.php).
 * The api/ `subprojects` table uses `parent_project` as the FK column;
 * the resource is expected to project it as `parent_subproject_id` for
 * the SDK contract. If the resource hasn't been updated yet, the SDK
 * tolerates the missing field and surfaces `parent_subproject_id: null`
 * + `chain: []` — see the back-compat test in
 * `src/api/__tests__/subproject.test.ts`.
 *
 * Structural interfaces only — no branded type aliases. This is
 * deliberate: sys/ deliberately re-declares input shapes structurally,
 * and adding brands would force `as unknown as` shims downstream.
 */
export {};
//# sourceMappingURL=subproject.js.map