"use strict";
/**
 * FacilitiesApiClient — covers the Facilities (venue / location) CriticalAsset
 * proxy (`Modules/Facilities/Routes/api.php`, mounted under `/api/facilities`).
 *
 * Route inventory (source of truth = the api route file +
 * `PortfolioRollupController` + `ThemeSignalsController`):
 *
 *   GET /api/facilities/portfolio/rollup        index  — 25×5 buildings grid
 *   GET /api/facilities/themes/{theme}/signals  show   — signals + time-series
 *
 * Both are read-only. The frontend NEVER calls CriticalAsset GraphQL
 * directly — credentials stay in api/. `portfolio/rollup` returns a bespoke
 * `{columns, rows}` body; `themes/{theme}/signals` returns a `{data: {...}}`
 * body (consumers read it off `res.data.data`). An unknown theme slug or an
 * unseeded Path row both 404.
 *
 * `BaseApiClient` already handles `Authorization: Bearer` + `X-Domain`
 * injection and 401 / 422 → callback + `ApiError`. The tenant is resolved
 * server-side from `X-Domain` (SetDomainContext), so set `getDomain` on the
 * client config.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacilitiesApiClient = void 0;
const api_client_1 = require("../api-client");
class FacilitiesApiClient extends api_client_1.BaseApiClient {
    /**
     * GET /api/facilities/portfolio/rollup — the 25-row × 5-column heatmap.
     * Always returns exactly 25 rows (padded with `{building: null}` rows when
     * fewer buildings have signals).
     */
    async getPortfolioRollup() {
        return this.get('/api/facilities/portfolio/rollup');
    }
    /**
     * GET /api/facilities/themes/{theme}/signals — signals + day-bucketed
     * time-series for one facility Path theme (`restroom`, `comfort`,
     * `safe-path`, `rain-drainage`). Unknown / unseeded themes 404.
     */
    async getThemeSignals(theme) {
        return this.get(`/api/facilities/themes/${encodeURIComponent(theme)}/signals`);
    }
}
exports.FacilitiesApiClient = FacilitiesApiClient;
//# sourceMappingURL=facilities-api-client.js.map