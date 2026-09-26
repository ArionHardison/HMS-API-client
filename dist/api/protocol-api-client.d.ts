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
import { BaseApiClient, type ApiResponse } from '../api-client';
import type { AddProtocolPlanBranchItemResource, ChainItemMemberResource, CodifyPipelineStartedResource, CodifyPipelineStatusResource, ConfirmPlanResource, ConfirmProtocolPlanRequest, CreateProtocolCategoryRequest, EditProtocolPlanBranchItemRequest, EditProtocolPlanBranchResource, EditProtocolPlanModuleItemRequest, EditProtocolPlanModuleResource, EmptyOk, EtlProtocolIntegrationItem, ModuleValidationResource, PaginatedPayload, ProtocolAiCreationResource, ProtocolAiCreateItemRequest, ProtocolAiCreateWholeRequest, ProtocolAiPlanResource, ProtocolBranchPlanRequest, ProtocolCategoryResource, ProtocolGlobalModuleResource, ProtocolGlobalModuleShowResource, ProtocolIntegrationItem, ProtocolModuleSummary, ProtocolResource, ProtocolSaleResource, ProtocolSettingsResource, ProtocolStepResource, ProtocolStoreSettingsRequest, ProtocolSwitchMemberRequest, StartCodifyPipelineRequest, StoreGlobalModuleRequest, StoreProtocolRequest, StoreSaleRequest, UpdateGlobalModuleRequest, UpdateProtocolCategoryRequest, UpdateProtocolRequest, UpdateSaleRequest, ValidateBranchModuleRequest, ValidateModuleRequest } from '../types/protocol';
export type { AddProtocolPlanBranchItemResource, ChainItemMemberResource, CodifyPipelineStartedResource, CodifyPipelineStatusResource, ConfirmPlanResource, ConfirmProtocolPlanRequest, CreateProtocolCategoryRequest, EditProtocolPlanBranchItemRequest, EditProtocolPlanBranchResource, EditProtocolPlanModuleItemRequest, EditProtocolPlanModuleResource, EmptyOk, EtlProtocolIntegrationItem, ModuleValidationResource, PaginatedPayload, ProtocolAiCreationResource, ProtocolAiCreateItemRequest, ProtocolAiCreateWholeRequest, ProtocolAiPlanResource, ProtocolBranchPlanRequest, ProtocolCategoryResource, ProtocolGlobalModuleResource, ProtocolGlobalModuleShowResource, ProtocolIntegrationItem, ProtocolModuleSummary, ProtocolResource, ProtocolSaleResource, ProtocolSettingsResource, ProtocolStepResource, ProtocolStoreSettingsRequest, ProtocolSwitchMemberRequest, StartCodifyPipelineRequest, StoreGlobalModuleRequest, StoreProtocolRequest, StoreSaleRequest, UpdateGlobalModuleRequest, UpdateProtocolCategoryRequest, UpdateProtocolRequest, UpdateSaleRequest, ValidateBranchModuleRequest, ValidateModuleRequest, };
export declare class ProtocolApiClient extends BaseApiClient {
    /** GET /api/protocol — paginated. */
    listProtocols(): Promise<ApiResponse<PaginatedPayload<ProtocolResource>>>;
    /** POST /api/protocol */
    createProtocol(body: StoreProtocolRequest): Promise<ApiResponse<ProtocolResource>>;
    /** GET /api/protocol/{protocol} */
    getProtocol(protocol: number): Promise<ApiResponse<ProtocolResource>>;
    /** PUT /api/protocol/{protocol} */
    updateProtocol(protocol: number, body: UpdateProtocolRequest): Promise<ApiResponse<ProtocolResource>>;
    /** DELETE /api/protocol/{protocol} */
    deleteProtocol(protocol: number): Promise<ApiResponse<unknown>>;
    /** GET /api/protocol-category — paginated. */
    listProtocolCategories(): Promise<ApiResponse<PaginatedPayload<ProtocolCategoryResource>>>;
    /** POST /api/protocol-category */
    createProtocolCategory(body: CreateProtocolCategoryRequest): Promise<ApiResponse<ProtocolCategoryResource>>;
    /** GET /api/protocol-category/all */
    getAllProtocolCategories(): Promise<ApiResponse<ProtocolCategoryResource[]>>;
    /** GET /api/protocol-category/for-attachment */
    getProtocolCategoriesForAttachment(): Promise<ApiResponse<ProtocolCategoryResource[]>>;
    /** GET /api/protocol-category/{protocol_category} */
    getProtocolCategory(protocolCategory: number): Promise<ApiResponse<ProtocolCategoryResource>>;
    /** PUT /api/protocol-category/{protocol_category} */
    updateProtocolCategory(protocolCategory: number, body: UpdateProtocolCategoryRequest): Promise<ApiResponse<ProtocolCategoryResource>>;
    /** DELETE /api/protocol-category/{protocol_category} */
    deleteProtocolCategory(protocolCategory: number): Promise<ApiResponse<unknown>>;
    /** GET /api/protocol-event/triggers */
    getProtocolEventTriggers(): Promise<ApiResponse<EmptyOk[]>>;
    /** GET /api/protocol/all */
    getAllProtocols(): Promise<ApiResponse<ProtocolResource[]>>;
    /** GET /api/protocol/activity/all */
    getProtocolActivityAll(): Promise<ApiResponse<EmptyOk[]>>;
    /** GET /api/protocol/agents/all (auth=sanctum) */
    getProtocolAgentsAll(): Promise<ApiResponse<ProtocolIntegrationItem[]>>;
    /** GET /api/protocol/appeal/all */
    getProtocolAppealAll(): Promise<ApiResponse<EmptyOk[]>>;
    /** GET /api/protocol/application/all */
    getProtocolApplicationAll(): Promise<ApiResponse<EmptyOk[]>>;
    /** GET /api/protocol/assessment/all */
    getProtocolAssessmentAll(): Promise<ApiResponse<EmptyOk[]>>;
    /** GET /api/protocol/assessment/item-instances/{assessment} */
    getAssessmentItemInstances(assessment: number): Promise<ApiResponse<EmptyOk[]>>;
    /** GET /api/protocol/challenge/all */
    getProtocolChallengeAll(): Promise<ApiResponse<EmptyOk[]>>;
    /** GET /api/protocol/connector/all */
    getProtocolConnectorAll(): Promise<ApiResponse<EmptyOk[]>>;
    /** GET /api/protocol/disbursement/all */
    getProtocolDisbursementAll(): Promise<ApiResponse<EmptyOk[]>>;
    /** GET /api/protocol/etl/all (auth=sanctum) */
    getProtocolEtlAll(): Promise<ApiResponse<EtlProtocolIntegrationItem[]>>;
    /** GET /api/protocol/nudge/all */
    getProtocolNudgeAll(): Promise<ApiResponse<EmptyOk[]>>;
    /** GET /api/protocol/order/all */
    getProtocolOrderAll(): Promise<ApiResponse<EmptyOk[]>>;
    /** GET /api/protocol/referral/all */
    getProtocolReferralAll(): Promise<ApiResponse<EmptyOk[]>>;
    /** GET /api/protocol/report/all */
    getProtocolReportAll(): Promise<ApiResponse<EmptyOk[]>>;
    /** GET /api/protocol/verification/all */
    getProtocolVerificationAll(): Promise<ApiResponse<EmptyOk[]>>;
    /** GET /api/protocol/workflow/all */
    getProtocolWorkflowAll(): Promise<ApiResponse<ProtocolIntegrationItem[]>>;
    /** GET /api/protocol/by-category-all/{category} */
    getProtocolsByCategoryAll(category: string | number): Promise<ApiResponse<ProtocolResource[]>>;
    /**
     * GET /api/protocol/by-category/{category?} — paginated.
     * Optional category segment is omitted when not supplied.
     */
    getProtocolsByCategory(category?: string | number): Promise<ApiResponse<PaginatedPayload<ProtocolResource>>>;
    /** GET /api/protocol/check-usage/{protocol} */
    checkProtocolUsage(protocol: number): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/protocol/errors/{protocol} */
    getProtocolErrors(protocol: number): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/protocol/get-temporary-user */
    getTemporaryUserProtocol(): Promise<ApiResponse<ProtocolResource>>;
    /** GET /api/protocol/chain-item-branch-plan/{protocol}/{item} */
    getChainItemBranchPlan(protocol: number, item: string | number): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/protocol/get-plan/{protocol} */
    getProtocolPlan(protocol: number): Promise<ApiResponse<ProtocolAiPlanResource>>;
    /** GET /api/protocol/get-steps/{protocol} */
    getProtocolSteps(protocol: number): Promise<ApiResponse<ProtocolStepResource[]>>;
    /** GET /api/protocol/intensive-module/roles/{protocol} */
    getIntensiveModuleRoles(protocol: number): Promise<ApiResponse<EmptyOk[]>>;
    /** GET /api/protocol/list-intensive/{protocol} */
    listIntensiveModules(protocol: number): Promise<ApiResponse<ProtocolGlobalModuleResource[]>>;
    /** GET /api/protocol/show-intensive/{module} */
    showIntensiveModule(module: number): Promise<ApiResponse<ProtocolGlobalModuleShowResource>>;
    /** GET /api/protocol/get-intensive-module-settings/{protocol}/{chain} */
    getIntensiveModuleSettings(protocol: number, chain: string | number): Promise<ApiResponse<EmptyOk>>;
    /**
     * GET /api/protocol/modules/{recurring?}
     * Optional `recurring` flag (0/1) is omitted when not supplied.
     */
    getProtocolModules(recurring?: 0 | 1 | boolean | string): Promise<ApiResponse<ProtocolModuleSummary[]>>;
    /** GET /api/protocol/node-members/{node} */
    getNodeMembers(node: number): Promise<ApiResponse<EmptyOk[]>>;
    /** GET /api/protocol/role-qualifications/{role} */
    getRoleQualifications(role: string | number): Promise<ApiResponse<EmptyOk[]>>;
    /** GET /api/protocol/roles/{type} */
    getProtocolRoles(type: string | number): Promise<ApiResponse<EmptyOk[]>>;
    /** GET /api/protocol/sale/get/{protocol} */
    getProtocolSale(protocol: number): Promise<ApiResponse<ProtocolSaleResource>>;
    /** GET /api/protocol/sale/salaries/{protocol} */
    getProtocolSaleSalaries(protocol: number): Promise<ApiResponse<ProtocolSaleResource[]>>;
    /** POST /api/protocol/sale/set-sale */
    setProtocolSale(body: StoreSaleRequest): Promise<ApiResponse<ProtocolSaleResource>>;
    /** PATCH /api/protocol/sale/update/{protocol} */
    updateProtocolSale(protocol: number, body: UpdateSaleRequest): Promise<ApiResponse<ProtocolSaleResource>>;
    /** GET /api/protocol/settings/get/{protocol} */
    getProtocolSettings(protocol: number): Promise<ApiResponse<ProtocolSettingsResource>>;
    /** POST /api/protocol/settings/save */
    saveProtocolSettings(body: ProtocolStoreSettingsRequest): Promise<ApiResponse<ProtocolSettingsResource>>;
    /** POST /api/protocol/add-module-to-plan */
    addModuleToPlan(body: ValidateModuleRequest): Promise<ApiResponse<ModuleValidationResource>>;
    /** POST /api/protocol/add-module-to-branch */
    addModuleToBranch(body: ValidateBranchModuleRequest): Promise<ApiResponse<AddProtocolPlanBranchItemResource>>;
    /** POST /api/protocol/edit-plan-module */
    editPlanModule(body: ValidateModuleRequest): Promise<ApiResponse<ModuleValidationResource>>;
    /** POST /api/protocol/edit-plan-branch-module */
    editPlanBranchModule(body: ValidateBranchModuleRequest): Promise<ApiResponse<EditProtocolPlanBranchResource>>;
    /** POST /api/protocol/move-up-plan-item */
    movePlanItemUp(body: EditProtocolPlanModuleItemRequest): Promise<ApiResponse<EditProtocolPlanModuleResource>>;
    /** POST /api/protocol/move-down-plan-item */
    movePlanItemDown(body: EditProtocolPlanModuleItemRequest): Promise<ApiResponse<EditProtocolPlanModuleResource>>;
    /** POST /api/protocol/delete-plan-item */
    deletePlanItem(body: EditProtocolPlanModuleItemRequest): Promise<ApiResponse<EditProtocolPlanModuleResource>>;
    /** POST /api/protocol/move-up-branch-item */
    moveBranchItemUp(body: EditProtocolPlanBranchItemRequest): Promise<ApiResponse<EditProtocolPlanBranchResource>>;
    /** POST /api/protocol/move-down-branch-item */
    moveBranchItemDown(body: EditProtocolPlanBranchItemRequest): Promise<ApiResponse<EditProtocolPlanBranchResource>>;
    /** POST /api/protocol/delete-branch-item */
    deleteBranchItem(body: EditProtocolPlanBranchItemRequest): Promise<ApiResponse<EditProtocolPlanModuleResource>>;
    /** POST /api/protocol/confirm-plan */
    confirmProtocolPlan(body: ConfirmProtocolPlanRequest): Promise<ApiResponse<ConfirmPlanResource>>;
    /** POST /api/protocol/switch-member */
    switchProtocolChainMember(body: ProtocolSwitchMemberRequest): Promise<ApiResponse<ChainItemMemberResource>>;
    /** POST /api/protocol/store-intensive */
    storeIntensiveModule(body: StoreGlobalModuleRequest): Promise<ApiResponse<ProtocolGlobalModuleResource>>;
    /**
     * POST /api/protocol/update-intensive/{module}
     * Spec lists method as POST (NOT PUT/PATCH) — it is a POST update endpoint.
     */
    updateIntensiveModule(module: number, body: UpdateGlobalModuleRequest): Promise<ApiResponse<ProtocolGlobalModuleResource>>;
    /** DELETE /api/protocol/delete-intensive/{global} */
    deleteIntensiveModule(global: number): Promise<ApiResponse<ProtocolGlobalModuleResource>>;
    /** DELETE /api/protocol/reset-plan/{protocol} */
    resetProtocolPlan(protocol: number): Promise<ApiResponse<ProtocolAiCreationResource>>;
    /**
     * POST /api/protocol/ai-create
     *
     * Enqueues `ProtocolAiModuleCreation` onto the `ai` queue and returns a
     * polling token in `data.id`. Caller polls `getAiRequestStatus(key)`
     * until `data.finished === true`.
     */
    aiCreateItem(body: ProtocolAiCreateItemRequest): Promise<ApiResponse<ProtocolAiCreationResource>>;
    /**
     * POST /api/protocol/ai-whole
     *
     * Same fire-and-poll contract as `aiCreateItem` — result token in `data.id`.
     */
    aiCreateWhole(body: ProtocolAiCreateWholeRequest): Promise<ApiResponse<ProtocolAiCreationResource>>;
    /**
     * POST /api/protocol/ai-create-branch
     *
     * Same fire-and-poll contract — result token in `data.id`.
     */
    aiCreateBranchPlan(body: ProtocolBranchPlanRequest): Promise<ApiResponse<ProtocolAiCreationResource>>;
    /**
     * GET /api/protocol/ai-request-status/{key}
     *
     * Polling endpoint paired with the three `ai-*` POSTs above. Pass the
     * `id` returned in the create response body.
     */
    getAiRequestStatus(key: string): Promise<ApiResponse<ProtocolAiCreationResource>>;
    /**
     * POST /api/workflow/codify-pipeline/start
     *
     * Public endpoint (no Bearer). When `file` is a Blob/File, the request
     * is auto-promoted to multipart/form-data by `BaseApiClient.serializeBody`.
     */
    startCodifyPipeline(body: StartCodifyPipelineRequest): Promise<ApiResponse<CodifyPipelineStartedResource>>;
    /**
     * POST /api/workflow/codify-pipeline/save-response
     *
     * Public endpoint. Body shape isn't pinned by the spec — caller sends the
     * follow-up question id + the user's answer payload.
     */
    saveCodifyPipelineResponse(body: Record<string, unknown>): Promise<ApiResponse<CodifyPipelineStatusResource>>;
    /** GET /api/workflow/codify-pipeline/check-pipeline/{session} (public) */
    checkCodifyPipeline(session: string): Promise<ApiResponse<CodifyPipelineStatusResource>>;
    /** GET /api/workflow/codify-pipeline/stop/{session} (public) */
    stopCodifyPipeline(session: string): Promise<ApiResponse<CodifyPipelineStatusResource>>;
}
//# sourceMappingURL=protocol-api-client.d.ts.map