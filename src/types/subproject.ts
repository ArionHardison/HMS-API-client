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

// =============================================================================
// Core Subproject shape
// =============================================================================

/**
 * One subproject node. Recursive via `chain` — but `chain` carries the
 * FLATTENED ancestor list (leaf -> root, leaf NOT included) rather than
 * a nested tree, so each ancestor's own `chain` is `[]` by convention.
 *
 * Field set is intentionally permissive: api/'s
 * `SubprojectClientDataResource` projects ~50 columns and we don't want
 * to fight schema drift here. The named fields are the ones the
 * hierarchy + DPG inheritance contract depends on; extras flow through
 * via the index signature.
 */
export interface Subproject {
  /** Primary key. */
  id: number;
  /** Display name. */
  name: unknown;
  /**
   * FK to the parent subproject, or `null` for root nodes. Mirrors the
   * api/ `subprojects.parent_project` column under its rename for the
   * SDK contract.
   */
  parent_subproject_id: number | null;
  /**
   * Resolved ancestor chain, leaf -> root (CLOSEST ancestor first,
   * ROOT last), EXCLUDING the current node. Each entry is itself a
   * Subproject; by convention nested `chain` arrays are empty (the
   * flattening happens once on the api/ side).
   */
  chain: Subproject[];

  // -- presentational / branding fields that participate in inheritance ------
  /** Optional theme key — example of an inherited field. */
  theme?: string | null;
  /** Optional logo URL — example of an inherited field. */
  logo?: string | null;
  /** Optional primary color — example of an inherited field. */
  primary_color?: string | null;

  /** Anything else api/ projects for this row. */
  [key: string]: unknown;
}

/**
 * `loadSubproject()` returns a discriminated union: either a 200 OK
 * envelope carrying a fully-resolved Subproject, or a 404 indicator.
 * CI-WWW and sys/ both render a "subproject not found" page on the
 * false branch instead of throwing — same contract as the legacy
 * `loadTenant()` had.
 */
export type SubprojectLoadResponse =
  | { status: 200; ok: true; data: Subproject }
  | { status: 404; ok: false; data: null };

// =============================================================================
// DPG instances
// =============================================================================

/**
 * The three DPG modes from the canonical 5-layer architecture
 * (api/docs/SYSTEM_ARCHITECTURE.md §5+6 + the
 * `subproject_dpg_instances.mode` column):
 *
 *   - native — purely in-app
 *   - domain — in-app + native DPG instance (e.g., emr.codify.nyc)
 *   - hybrid — agent-orchestrated; HITL delegation via
 *              micro-system-interfaces
 */
export type DpgInstanceMode = 'native' | 'domain' | 'hybrid';

/**
 * One DPG binding for a subproject. The hierarchy-aware addition over
 * the api/-side `subproject_dpg_instances` row is
 * `inherited_from_subproject_id`: when a binding is contributed by an
 * ancestor (rather than the leaf), this carries the ancestor's id.
 *
 * `inherited_from_subproject_id === null` means the binding lives on
 * the leaf subproject itself (no inheritance).
 */
export interface DpgInstance {
  /** Reference into the CodifySystems enum (e.g., 'emr', 'lms', 'hrm'). */
  system_key: string;
  /**
   * Per-city DPG host (e.g., `https://emr.codify.nyc`). `null` for
   * `mode: 'native'` bindings that don't have a separate host.
   */
  instance_url: string | null;
  /** One of the three canonical modes. */
  mode: DpgInstanceMode;
  /**
   * Ancestor subproject id this binding inherited from, or `null` when
   * the binding is set directly on the leaf.
   */
  inherited_from_subproject_id: number | null;
}
