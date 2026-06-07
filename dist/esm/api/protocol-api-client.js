/**
 * ProtocolApiClient — covers every endpoint in the Protocol CRUD + AI Assist
 * slice of the P2X API. Source of truth for shapes is `sdk/spec/endpoints.json`.
 *
 * The class extends `BaseApiClient`, which already handles:
 *   - Bearer token injection (skipped per call via `{ auth: false }`)
 *   - `X-Domain` header from `getDomain`
 *   - PUT/PATCH → POST + `?_method=PUT|PATCH` (Laravel)
 *   - FormData switching when payload contains a `File`/`Blob`
 *   - 401 / 422 → callback + `ApiError`
 *
 * AI-assist endpoints (`ai-create`, `ai-whole`, `ai-create-branch`) are
 * fire-and-poll: they enqueue a background job onto the `ai` queue and
 * return a `ProtocolAiCreationResource` whose `data.id` is the polling
 * key. Callers poll `getAiRequestStatus(key)` (`/api/protocol/ai-request-status/{key}`)
 * separately. We surface the token under multiple aliases (`id`, `key`,
 * `request_id`) on the response type so consumers can pick whichever
 * spelling matches the rest of their codebase.
 *
 * The Workflow Codify Pipeline endpoints (`/api/workflow/codify-pipeline/*`)
 * are `auth: public` per spec — they MUST be sent without a Bearer token
 * (we pass `{ auth: false }` on each).
 *
 * `wrapper: "data"` endpoints surface the typed payload directly under
 * `.data`; `wrapper: "paginated"` endpoints return `{ items: T[]; meta?;
 * links? }` under `.data` (typed via `PaginatedPayload<T>`).
 */
import { BaseApiClient } from '../api-client';
export class ProtocolApiClient extends BaseApiClient {
    // ---------------------------------------------------------------------------
    // /api/protocol — base CRUD
    // ---------------------------------------------------------------------------
    /** GET /api/protocol — paginated. */
    async listProtocols() {
        return this.get('/api/protocol');
    }
    /** POST /api/protocol */
    async createProtocol(body) {
        return this.post('/api/protocol', body);
    }
    /** GET /api/protocol/{protocol} */
    async getProtocol(protocol) {
        return this.get(`/api/protocol/${protocol}`);
    }
    /** PUT /api/protocol/{protocol} */
    async updateProtocol(protocol, body) {
        return this.put(`/api/protocol/${protocol}`, body);
    }
    /** DELETE /api/protocol/{protocol} */
    async deleteProtocol(protocol) {
        return this.delete(`/api/protocol/${protocol}`);
    }
    // ---------------------------------------------------------------------------
    // /api/protocol-category — CRUD + helpers
    // ---------------------------------------------------------------------------
    /** GET /api/protocol-category — paginated. */
    async listProtocolCategories() {
        return this.get('/api/protocol-category');
    }
    /** POST /api/protocol-category */
    async createProtocolCategory(body) {
        return this.post('/api/protocol-category', body);
    }
    /** GET /api/protocol-category/all */
    async getAllProtocolCategories() {
        return this.get('/api/protocol-category/all');
    }
    /** GET /api/protocol-category/for-attachment */
    async getProtocolCategoriesForAttachment() {
        return this.get('/api/protocol-category/for-attachment');
    }
    /** GET /api/protocol-category/{protocol_category} */
    async getProtocolCategory(protocolCategory) {
        return this.get(`/api/protocol-category/${protocolCategory}`);
    }
    /** PUT /api/protocol-category/{protocol_category} */
    async updateProtocolCategory(protocolCategory, body) {
        return this.put(`/api/protocol-category/${protocolCategory}`, body);
    }
    /** DELETE /api/protocol-category/{protocol_category} */
    async deleteProtocolCategory(protocolCategory) {
        return this.delete(`/api/protocol-category/${protocolCategory}`);
    }
    // ---------------------------------------------------------------------------
    // /api/protocol-event/triggers
    // ---------------------------------------------------------------------------
    /** GET /api/protocol-event/triggers */
    async getProtocolEventTriggers() {
        return this.get('/api/protocol-event/triggers');
    }
    // ---------------------------------------------------------------------------
    // /api/protocol/* — sub-module integrations + listings
    // ---------------------------------------------------------------------------
    /** GET /api/protocol/all */
    async getAllProtocols() {
        return this.get('/api/protocol/all');
    }
    /** GET /api/protocol/activity/all */
    async getProtocolActivityAll() {
        return this.get('/api/protocol/activity/all');
    }
    /** GET /api/protocol/agents/all (auth=sanctum) */
    async getProtocolAgentsAll() {
        return this.get('/api/protocol/agents/all');
    }
    /** GET /api/protocol/appeal/all */
    async getProtocolAppealAll() {
        return this.get('/api/protocol/appeal/all');
    }
    /** GET /api/protocol/application/all */
    async getProtocolApplicationAll() {
        return this.get('/api/protocol/application/all');
    }
    /** GET /api/protocol/assessment/all */
    async getProtocolAssessmentAll() {
        return this.get('/api/protocol/assessment/all');
    }
    /** GET /api/protocol/assessment/item-instances/{assessment} */
    async getAssessmentItemInstances(assessment) {
        return this.get(`/api/protocol/assessment/item-instances/${assessment}`);
    }
    /** GET /api/protocol/challenge/all */
    async getProtocolChallengeAll() {
        return this.get('/api/protocol/challenge/all');
    }
    /** GET /api/protocol/connector/all */
    async getProtocolConnectorAll() {
        return this.get('/api/protocol/connector/all');
    }
    /** GET /api/protocol/disbursement/all */
    async getProtocolDisbursementAll() {
        return this.get('/api/protocol/disbursement/all');
    }
    /** GET /api/protocol/etl/all (auth=sanctum) */
    async getProtocolEtlAll() {
        return this.get('/api/protocol/etl/all');
    }
    /** GET /api/protocol/nudge/all */
    async getProtocolNudgeAll() {
        return this.get('/api/protocol/nudge/all');
    }
    /** GET /api/protocol/order/all */
    async getProtocolOrderAll() {
        return this.get('/api/protocol/order/all');
    }
    /** GET /api/protocol/referral/all */
    async getProtocolReferralAll() {
        return this.get('/api/protocol/referral/all');
    }
    /** GET /api/protocol/report/all */
    async getProtocolReportAll() {
        return this.get('/api/protocol/report/all');
    }
    /** GET /api/protocol/verification/all */
    async getProtocolVerificationAll() {
        return this.get('/api/protocol/verification/all');
    }
    /** GET /api/protocol/workflow/all */
    async getProtocolWorkflowAll() {
        return this.get('/api/protocol/workflow/all');
    }
    // ---------------------------------------------------------------------------
    // /api/protocol/by-category(-all)?, check-usage, errors, get-temporary-user, ...
    // ---------------------------------------------------------------------------
    /** GET /api/protocol/by-category-all/{category} */
    async getProtocolsByCategoryAll(category) {
        return this.get(`/api/protocol/by-category-all/${encodeURIComponent(String(category))}`);
    }
    /**
     * GET /api/protocol/by-category/{category?} — paginated.
     * Optional category segment is omitted when not supplied.
     */
    async getProtocolsByCategory(category) {
        const tail = category === undefined || category === null
            ? ''
            : `/${encodeURIComponent(String(category))}`;
        return this.get(`/api/protocol/by-category${tail}`);
    }
    /** GET /api/protocol/check-usage/{protocol} */
    async checkProtocolUsage(protocol) {
        return this.get(`/api/protocol/check-usage/${protocol}`);
    }
    /** GET /api/protocol/errors/{protocol} */
    async getProtocolErrors(protocol) {
        return this.get(`/api/protocol/errors/${protocol}`);
    }
    /** GET /api/protocol/get-temporary-user */
    async getTemporaryUserProtocol() {
        return this.get('/api/protocol/get-temporary-user');
    }
    /** GET /api/protocol/chain-item-branch-plan/{protocol}/{item} */
    async getChainItemBranchPlan(protocol, item) {
        return this.get(`/api/protocol/chain-item-branch-plan/${protocol}/${encodeURIComponent(String(item))}`);
    }
    /** GET /api/protocol/get-plan/{protocol} */
    async getProtocolPlan(protocol) {
        return this.get(`/api/protocol/get-plan/${protocol}`);
    }
    /** GET /api/protocol/get-steps/{protocol} */
    async getProtocolSteps(protocol) {
        return this.get(`/api/protocol/get-steps/${protocol}`);
    }
    /** GET /api/protocol/intensive-module/roles/{protocol} */
    async getIntensiveModuleRoles(protocol) {
        return this.get(`/api/protocol/intensive-module/roles/${protocol}`);
    }
    /** GET /api/protocol/list-intensive/{protocol} */
    async listIntensiveModules(protocol) {
        return this.get(`/api/protocol/list-intensive/${protocol}`);
    }
    /** GET /api/protocol/show-intensive/{module} */
    async showIntensiveModule(module) {
        return this.get(`/api/protocol/show-intensive/${module}`);
    }
    /** GET /api/protocol/get-intensive-module-settings/{protocol}/{chain} */
    async getIntensiveModuleSettings(protocol, chain) {
        return this.get(`/api/protocol/get-intensive-module-settings/${protocol}/${encodeURIComponent(String(chain))}`);
    }
    /**
     * GET /api/protocol/modules/{recurring?}
     * Optional `recurring` flag (0/1) is omitted when not supplied.
     */
    async getProtocolModules(recurring) {
        const tail = recurring === undefined || recurring === null
            ? ''
            : `/${encodeURIComponent(String(recurring))}`;
        return this.get(`/api/protocol/modules${tail}`);
    }
    /** GET /api/protocol/node-members/{node} */
    async getNodeMembers(node) {
        return this.get(`/api/protocol/node-members/${node}`);
    }
    /** GET /api/protocol/role-qualifications/{role} */
    async getRoleQualifications(role) {
        return this.get(`/api/protocol/role-qualifications/${encodeURIComponent(String(role))}`);
    }
    /** GET /api/protocol/roles/{type} */
    async getProtocolRoles(type) {
        return this.get(`/api/protocol/roles/${encodeURIComponent(String(type))}`);
    }
    // ---------------------------------------------------------------------------
    // /api/protocol/sale/* + /api/protocol/settings/*
    // ---------------------------------------------------------------------------
    /** GET /api/protocol/sale/get/{protocol} */
    async getProtocolSale(protocol) {
        return this.get(`/api/protocol/sale/get/${protocol}`);
    }
    /** GET /api/protocol/sale/salaries/{protocol} */
    async getProtocolSaleSalaries(protocol) {
        return this.get(`/api/protocol/sale/salaries/${protocol}`);
    }
    /** POST /api/protocol/sale/set-sale */
    async setProtocolSale(body) {
        return this.post('/api/protocol/sale/set-sale', body);
    }
    /** PATCH /api/protocol/sale/update/{protocol} */
    async updateProtocolSale(protocol, body) {
        return this.patch(`/api/protocol/sale/update/${protocol}`, body);
    }
    /** GET /api/protocol/settings/get/{protocol} */
    async getProtocolSettings(protocol) {
        return this.get(`/api/protocol/settings/get/${protocol}`);
    }
    /** POST /api/protocol/settings/save */
    async saveProtocolSettings(body) {
        return this.post('/api/protocol/settings/save', body);
    }
    // ---------------------------------------------------------------------------
    // Plan/branch editors (POST)
    // ---------------------------------------------------------------------------
    /** POST /api/protocol/add-module-to-plan */
    async addModuleToPlan(body) {
        return this.post('/api/protocol/add-module-to-plan', body);
    }
    /** POST /api/protocol/add-module-to-branch */
    async addModuleToBranch(body) {
        return this.post('/api/protocol/add-module-to-branch', body);
    }
    /** POST /api/protocol/edit-plan-module */
    async editPlanModule(body) {
        return this.post('/api/protocol/edit-plan-module', body);
    }
    /** POST /api/protocol/edit-plan-branch-module */
    async editPlanBranchModule(body) {
        return this.post('/api/protocol/edit-plan-branch-module', body);
    }
    /** POST /api/protocol/move-up-plan-item */
    async movePlanItemUp(body) {
        return this.post('/api/protocol/move-up-plan-item', body);
    }
    /** POST /api/protocol/move-down-plan-item */
    async movePlanItemDown(body) {
        return this.post('/api/protocol/move-down-plan-item', body);
    }
    /** POST /api/protocol/delete-plan-item */
    async deletePlanItem(body) {
        return this.post('/api/protocol/delete-plan-item', body);
    }
    /** POST /api/protocol/move-up-branch-item */
    async moveBranchItemUp(body) {
        return this.post('/api/protocol/move-up-branch-item', body);
    }
    /** POST /api/protocol/move-down-branch-item */
    async moveBranchItemDown(body) {
        return this.post('/api/protocol/move-down-branch-item', body);
    }
    /** POST /api/protocol/delete-branch-item */
    async deleteBranchItem(body) {
        return this.post('/api/protocol/delete-branch-item', body);
    }
    /** POST /api/protocol/confirm-plan */
    async confirmProtocolPlan(body) {
        return this.post('/api/protocol/confirm-plan', body);
    }
    /** POST /api/protocol/switch-member */
    async switchProtocolChainMember(body) {
        return this.post('/api/protocol/switch-member', body);
    }
    // ---------------------------------------------------------------------------
    // Intensive (global) module CRUD
    // ---------------------------------------------------------------------------
    /** POST /api/protocol/store-intensive */
    async storeIntensiveModule(body) {
        return this.post('/api/protocol/store-intensive', body);
    }
    /**
     * POST /api/protocol/update-intensive/{module}
     * Spec lists method as POST (NOT PUT/PATCH) — it is a POST update endpoint.
     */
    async updateIntensiveModule(module, body) {
        return this.post(`/api/protocol/update-intensive/${module}`, body);
    }
    /** DELETE /api/protocol/delete-intensive/{global} */
    async deleteIntensiveModule(global) {
        return this.delete(`/api/protocol/delete-intensive/${global}`);
    }
    /** DELETE /api/protocol/reset-plan/{protocol} */
    async resetProtocolPlan(protocol) {
        return this.delete(`/api/protocol/reset-plan/${protocol}`);
    }
    // ---------------------------------------------------------------------------
    // AI assist (fire-and-poll) + status polling
    // ---------------------------------------------------------------------------
    /**
     * POST /api/protocol/ai-create
     *
     * Enqueues `ProtocolAiModuleCreation` onto the `ai` queue and returns a
     * polling token in `data.id`. Caller polls `getAiRequestStatus(key)`
     * until `data.finished === true`.
     */
    async aiCreateItem(body) {
        return this.post('/api/protocol/ai-create', body);
    }
    /**
     * POST /api/protocol/ai-whole
     *
     * Same fire-and-poll contract as `aiCreateItem` — result token in `data.id`.
     */
    async aiCreateWhole(body) {
        return this.post('/api/protocol/ai-whole', body);
    }
    /**
     * POST /api/protocol/ai-create-branch
     *
     * Same fire-and-poll contract — result token in `data.id`.
     */
    async aiCreateBranchPlan(body) {
        return this.post('/api/protocol/ai-create-branch', body);
    }
    /**
     * GET /api/protocol/ai-request-status/{key}
     *
     * Polling endpoint paired with the three `ai-*` POSTs above. Pass the
     * `id` returned in the create response body.
     */
    async getAiRequestStatus(key) {
        return this.get(`/api/protocol/ai-request-status/${encodeURIComponent(key)}`);
    }
    // ---------------------------------------------------------------------------
    // /api/workflow/codify-pipeline/* — auth: public (no Bearer)
    // ---------------------------------------------------------------------------
    /**
     * POST /api/workflow/codify-pipeline/start
     *
     * Public endpoint (no Bearer). When `file` is a Blob/File, the request
     * is auto-promoted to multipart/form-data by `BaseApiClient.serializeBody`.
     */
    async startCodifyPipeline(body) {
        return this.post('/api/workflow/codify-pipeline/start', body, { auth: false });
    }
    /**
     * POST /api/workflow/codify-pipeline/save-response
     *
     * Public endpoint. Body shape isn't pinned by the spec — caller sends the
     * follow-up question id + the user's answer payload.
     */
    async saveCodifyPipelineResponse(body) {
        return this.post('/api/workflow/codify-pipeline/save-response', body, { auth: false });
    }
    /** GET /api/workflow/codify-pipeline/check-pipeline/{session} (public) */
    async checkCodifyPipeline(session) {
        return this.get(`/api/workflow/codify-pipeline/check-pipeline/${encodeURIComponent(session)}`, undefined, { auth: false });
    }
    /** GET /api/workflow/codify-pipeline/stop/{session} (public) */
    async stopCodifyPipeline(session) {
        return this.get(`/api/workflow/codify-pipeline/stop/${encodeURIComponent(session)}`, undefined, { auth: false });
    }
}
//# sourceMappingURL=protocol-api-client.js.map