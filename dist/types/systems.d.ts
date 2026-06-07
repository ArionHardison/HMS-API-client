/**
 * Type contracts for `SystemsApiClient`.
 *
 * Source of truth: `api/app/Services/Systems/SystemMetadataService::catalog()`
 * and the existing per-vertical components shape returned by
 * `componentsFor()`. Mirrors the Pest contract pinned in
 * `tests/Feature/Services/Systems/SystemMetadataServiceTest.php`.
 *
 * The catalog walks `CodifySystems::getValues()` and returns every
 * `category === 'native_system'` entry grouped by `vertical`. Platform
 * orchestrators (GOV/SYS/APP/API) and external services (GOOGLE_PLACES)
 * are excluded server-side.
 */
/**
 * One concrete system surface within a vertical. Mirrors a single
 * `native_system` entry from the CodifySystems PHP enum.
 */
export interface SystemComponent {
    /** Lowercase slug — stable identifier (e.g., `'emr'`, `'lims'`, `'hrm'`). */
    key: string;
    /** Display name (e.g., `'Electronic Medical Records'`). */
    name: string;
    /** Acronym shown in compact UI surfaces (e.g., `'EMR'`). */
    abbr: string;
    /** Whether this component is currently live on the codify-systems droplet. */
    deployed: boolean;
    /** One-line description of what this component does. */
    purpose: string | null;
    /** Capability slugs exposed to agents (e.g., `'patient.get'`). */
    capabilities: string[];
}
/**
 * One vertical grouping in the catalog response. Powers a single
 * collapsible parent in sys/'s sidebar Systems submenu, with `components`
 * becoming the expand children.
 */
export interface SystemCatalogEntry {
    /** Lowercase vertical slug (e.g., `'healthcare'`, `'careers'`). */
    vertical: string;
    /** Display label for the vertical (e.g., `'Healthcare'`). */
    label: string;
    /** Short marketing description shown under the label. */
    description: string;
    /** Optional lucide-icon hint (no `lucide:` prefix; consumer prefixes). */
    icon: string | null;
    /** The native_system components belonging to this vertical. */
    components: SystemComponent[];
}
//# sourceMappingURL=systems.d.ts.map