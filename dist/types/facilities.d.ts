/**
 * Types for `FacilitiesApiClient` — the Facilities (venue / location)
 * CriticalAsset proxy.
 *
 * Source of truth: `Modules/Facilities/Routes/api.php`,
 * `PortfolioRollupController`, `ThemeSignalsController`. Both endpoints are
 * read-only GETs under `/api/facilities/*`.
 */
/** Canonical system-group column keys (Modules/Facilities/Enums/SystemGroup). */
export type FacilitiesSystemGroup = 'water_plumbing' | 'hvac_thermal' | 'fire_life_safety' | 'electrical_it' | 'access_envelope';
/** One cell in the portfolio rollup grid. */
export interface FacilitiesRollupCell {
    signal_count: number;
    /** Worst ConfidenceLabel value across the cell, or null when empty. */
    worst_confidence: string | null;
}
/** One building row in the portfolio rollup grid. `building` is null for padding rows. */
export interface FacilitiesRollupRow {
    building: string | null;
    cells: Record<string, FacilitiesRollupCell>;
}
/** Response body for `GET /api/facilities/portfolio/rollup`. Always 25 rows. */
export interface FacilitiesPortfolioRollupResponse {
    columns: string[];
    rows: FacilitiesRollupRow[];
}
/** One signal in a theme drill-down. */
export interface FacilitiesThemeSignal {
    pipeline_id: number;
    session_identifier: string | null;
    issue_type: string | null;
    asset_kind: string | null;
    system_group: string;
    building: string | null;
    urgency?: string | null;
    confidence_label: string | null;
    confidence_score: number | null;
    observed_at: string | null;
}
/** One time-series bucket in a theme drill-down. */
export interface FacilitiesThemeTimeSeriesBucket {
    /** 'YYYY-MM-DD'. */
    bucket: string;
    signal_count: number;
    avg_confidence: number | null;
}
/**
 * Inner body for `GET /api/facilities/themes/{theme}/signals`. Wrapped under
 * `data` server-side; the SDK surfaces this inner object as `ApiResponse.data`.
 */
export interface FacilitiesThemeSignalsResponse {
    theme: {
        slug: string;
        name: string | null;
        title: string | null;
    };
    signals: FacilitiesThemeSignal[];
    time_series: FacilitiesThemeTimeSeriesBucket[];
}
//# sourceMappingURL=facilities.d.ts.map