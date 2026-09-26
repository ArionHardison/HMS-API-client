/**
 * `resolveInherited(subproject, key)` — pure helper.
 *
 * Subprojects form a hierarchy (parent -> child) and most
 * presentation/branding/system fields inherit upward: a leaf can leave
 * `theme` null and pick up its parent's value, or its grandparent's,
 * etc. This helper performs that walk leaf -> root and returns the
 * FIRST non-null/non-undefined value for the requested key.
 *
 * The walk uses `subproject.chain` (the api/-resolved ancestor list,
 * leaf -> root, EXCLUDING the leaf itself). The leaf's own value is
 * checked first. If neither the leaf nor any ancestor has a value, the
 * helper returns `null` cast to the field type.
 *
 * This file is intentionally Vue-free, side-effect-free, and exports
 * exactly one function so it can be tree-shaken into any consumer
 * bundle (sys/ Vite, gov/ Nuxt 3 SSR, app/ Nuxt 2, CI-WWW/ Nuxt 3).
 */
import type { Subproject } from '../types/subproject';
/**
 * Walk a subproject's inheritance chain (leaf -> root) and return the
 * first non-null/non-undefined value for the given key. Returns `null`
 * cast to `Subproject[K]` when no node in the chain carries a value.
 *
 * Behavior:
 *   - leaf value wins when it is non-null
 *   - chain is walked in order (closest ancestor first)
 *   - `undefined` is treated the same as `null` (api/ may omit fields)
 *   - the function does not mutate `subproject` or any chain entry
 *
 * Note on the cast: TypeScript can't narrow "Subproject[K] minus null"
 * generically without a `NonNullable` wrapper, but the contract is
 * that we return `Subproject[K]` even on the no-match branch (which is
 * `null`). Consumers that care about the discriminated null can
 * `?? someDefault` at the call site.
 */
export declare function resolveInherited<K extends keyof Subproject>(subproject: Subproject, key: K): Subproject[K];
//# sourceMappingURL=resolve-inherited.d.ts.map