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
export {};
//# sourceMappingURL=systems.js.map