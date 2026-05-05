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
import type {
  AddProtocolPlanBranchItemResource,
  ChainItemMemberResource,
  CodifyPipelineStartedResource,
  CodifyPipelineStatusResource,
  ConfirmPlanResource,
  ConfirmProtocolPlanRequest,
  CreateProtocolCategoryRequest,
  EditProtocolPlanBranchItemRequest,
  EditProtocolPlanBranchResource,
  EditProtocolPlanModuleItemRequest,
  EditProtocolPlanModuleResource,
  EmptyOk,
  EtlProtocolIntegrationItem,
  ModuleValidationResource,
  PaginatedPayload,
  ProtocolAiCreationResource,
  ProtocolAiCreateItemRequest,
  ProtocolAiCreateWholeRequest,
  ProtocolAiPlanResource,
  ProtocolBranchPlanRequest,
  ProtocolCategoryResource,
  ProtocolGlobalModuleResource,
  ProtocolGlobalModuleShowResource,
  ProtocolIntegrationItem,
  ProtocolModuleSummary,
  ProtocolResource,
  ProtocolSaleResource,
  ProtocolSettingsResource,
  ProtocolStepResource,
  ProtocolStoreSettingsRequest,
  ProtocolSwitchMemberRequest,
  StartCodifyPipelineRequest,
  StoreGlobalModuleRequest,
  StoreProtocolRequest,
  StoreSaleRequest,
  UpdateGlobalModuleRequest,
  UpdateProtocolCategoryRequest,
  UpdateProtocolRequest,
  UpdateSaleRequest,
  ValidateBranchModuleRequest,
  ValidateModuleRequest,
} from '../types/protocol';

// Re-export types so consumers can import them from one place.
export type {
  AddProtocolPlanBranchItemResource,
  ChainItemMemberResource,
  CodifyPipelineStartedResource,
  CodifyPipelineStatusResource,
  ConfirmPlanResource,
  ConfirmProtocolPlanRequest,
  CreateProtocolCategoryRequest,
  EditProtocolPlanBranchItemRequest,
  EditProtocolPlanBranchResource,
  EditProtocolPlanModuleItemRequest,
  EditProtocolPlanModuleResource,
  EmptyOk,
  EtlProtocolIntegrationItem,
  ModuleValidationResource,
  PaginatedPayload,
  ProtocolAiCreationResource,
  ProtocolAiCreateItemRequest,
  ProtocolAiCreateWholeRequest,
  ProtocolAiPlanResource,
  ProtocolBranchPlanRequest,
  ProtocolCategoryResource,
  ProtocolGlobalModuleResource,
  ProtocolGlobalModuleShowResource,
  ProtocolIntegrationItem,
  ProtocolModuleSummary,
  ProtocolResource,
  ProtocolSaleResource,
  ProtocolSettingsResource,
  ProtocolStepResource,
  ProtocolStoreSettingsRequest,
  ProtocolSwitchMemberRequest,
  StartCodifyPipelineRequest,
  StoreGlobalModuleRequest,
  StoreProtocolRequest,
  StoreSaleRequest,
  UpdateGlobalModuleRequest,
  UpdateProtocolCategoryRequest,
  UpdateProtocolRequest,
  UpdateSaleRequest,
  ValidateBranchModuleRequest,
  ValidateModuleRequest,
};

export class ProtocolApiClient extends BaseApiClient {
  // ---------------------------------------------------------------------------
  // /api/protocol — base CRUD
  // ---------------------------------------------------------------------------

  /** GET /api/protocol — paginated. */
  async listProtocols(): Promise<ApiResponse<PaginatedPayload<ProtocolResource>>> {
    return this.get<PaginatedPayload<ProtocolResource>>('/api/protocol');
  }

  /** POST /api/protocol */
  async createProtocol(
    body: StoreProtocolRequest,
  ): Promise<ApiResponse<ProtocolResource>> {
    return this.post<ProtocolResource>('/api/protocol', body);
  }

  /** GET /api/protocol/{protocol} */
  async getProtocol(protocol: number): Promise<ApiResponse<ProtocolResource>> {
    return this.get<ProtocolResource>(`/api/protocol/${protocol}`);
  }

  /** PUT /api/protocol/{protocol} */
  async updateProtocol(
    protocol: number,
    body: UpdateProtocolRequest,
  ): Promise<ApiResponse<ProtocolResource>> {
    return this.put<ProtocolResource>(`/api/protocol/${protocol}`, body);
  }

  /** DELETE /api/protocol/{protocol} */
  async deleteProtocol(protocol: number): Promise<ApiResponse<unknown>> {
    return this.delete<unknown>(`/api/protocol/${protocol}`);
  }

  // ---------------------------------------------------------------------------
  // /api/protocol-category — CRUD + helpers
  // ---------------------------------------------------------------------------

  /** GET /api/protocol-category — paginated. */
  async listProtocolCategories(): Promise<
    ApiResponse<PaginatedPayload<ProtocolCategoryResource>>
  > {
    return this.get<PaginatedPayload<ProtocolCategoryResource>>('/api/protocol-category');
  }

  /** POST /api/protocol-category */
  async createProtocolCategory(
    body: CreateProtocolCategoryRequest,
  ): Promise<ApiResponse<ProtocolCategoryResource>> {
    return this.post<ProtocolCategoryResource>('/api/protocol-category', body);
  }

  /** GET /api/protocol-category/all */
  async getAllProtocolCategories(): Promise<ApiResponse<ProtocolCategoryResource[]>> {
    return this.get<ProtocolCategoryResource[]>('/api/protocol-category/all');
  }

  /** GET /api/protocol-category/for-attachment */
  async getProtocolCategoriesForAttachment(): Promise<
    ApiResponse<ProtocolCategoryResource[]>
  > {
    return this.get<ProtocolCategoryResource[]>('/api/protocol-category/for-attachment');
  }

  /** GET /api/protocol-category/{protocol_category} */
  async getProtocolCategory(
    protocolCategory: number,
  ): Promise<ApiResponse<ProtocolCategoryResource>> {
    return this.get<ProtocolCategoryResource>(
      `/api/protocol-category/${protocolCategory}`,
    );
  }

  /** PUT /api/protocol-category/{protocol_category} */
  async updateProtocolCategory(
    protocolCategory: number,
    body: UpdateProtocolCategoryRequest,
  ): Promise<ApiResponse<ProtocolCategoryResource>> {
    return this.put<ProtocolCategoryResource>(
      `/api/protocol-category/${protocolCategory}`,
      body,
    );
  }

  /** DELETE /api/protocol-category/{protocol_category} */
  async deleteProtocolCategory(protocolCategory: number): Promise<ApiResponse<unknown>> {
    return this.delete<unknown>(`/api/protocol-category/${protocolCategory}`);
  }

  // ---------------------------------------------------------------------------
  // /api/protocol-event/triggers
  // ---------------------------------------------------------------------------

  /** GET /api/protocol-event/triggers */
  async getProtocolEventTriggers(): Promise<ApiResponse<EmptyOk[]>> {
    return this.get<EmptyOk[]>('/api/protocol-event/triggers');
  }

  // ---------------------------------------------------------------------------
  // /api/protocol/* — sub-module integrations + listings
  // ---------------------------------------------------------------------------

  /** GET /api/protocol/all */
  async getAllProtocols(): Promise<ApiResponse<ProtocolResource[]>> {
    return this.get<ProtocolResource[]>('/api/protocol/all');
  }

  /** GET /api/protocol/activity/all */
  async getProtocolActivityAll(): Promise<ApiResponse<EmptyOk[]>> {
    return this.get<EmptyOk[]>('/api/protocol/activity/all');
  }

  /** GET /api/protocol/agents/all (auth=sanctum) */
  async getProtocolAgentsAll(): Promise<ApiResponse<ProtocolIntegrationItem[]>> {
    return this.get<ProtocolIntegrationItem[]>('/api/protocol/agents/all');
  }

  /** GET /api/protocol/appeal/all */
  async getProtocolAppealAll(): Promise<ApiResponse<EmptyOk[]>> {
    return this.get<EmptyOk[]>('/api/protocol/appeal/all');
  }

  /** GET /api/protocol/application/all */
  async getProtocolApplicationAll(): Promise<ApiResponse<EmptyOk[]>> {
    return this.get<EmptyOk[]>('/api/protocol/application/all');
  }

  /** GET /api/protocol/assessment/all */
  async getProtocolAssessmentAll(): Promise<ApiResponse<EmptyOk[]>> {
    return this.get<EmptyOk[]>('/api/protocol/assessment/all');
  }

  /** GET /api/protocol/assessment/item-instances/{assessment} */
  async getAssessmentItemInstances(
    assessment: number,
  ): Promise<ApiResponse<EmptyOk[]>> {
    return this.get<EmptyOk[]>(`/api/protocol/assessment/item-instances/${assessment}`);
  }

  /** GET /api/protocol/challenge/all */
  async getProtocolChallengeAll(): Promise<ApiResponse<EmptyOk[]>> {
    return this.get<EmptyOk[]>('/api/protocol/challenge/all');
  }

  /** GET /api/protocol/connector/all */
  async getProtocolConnectorAll(): Promise<ApiResponse<EmptyOk[]>> {
    return this.get<EmptyOk[]>('/api/protocol/connector/all');
  }

  /** GET /api/protocol/disbursement/all */
  async getProtocolDisbursementAll(): Promise<ApiResponse<EmptyOk[]>> {
    return this.get<EmptyOk[]>('/api/protocol/disbursement/all');
  }

  /** GET /api/protocol/etl/all (auth=sanctum) */
  async getProtocolEtlAll(): Promise<ApiResponse<EtlProtocolIntegrationItem[]>> {
    return this.get<EtlProtocolIntegrationItem[]>('/api/protocol/etl/all');
  }

  /** GET /api/protocol/nudge/all */
  async getProtocolNudgeAll(): Promise<ApiResponse<EmptyOk[]>> {
    return this.get<EmptyOk[]>('/api/protocol/nudge/all');
  }

  /** GET /api/protocol/order/all */
  async getProtocolOrderAll(): Promise<ApiResponse<EmptyOk[]>> {
    return this.get<EmptyOk[]>('/api/protocol/order/all');
  }

  /** GET /api/protocol/referral/all */
  async getProtocolReferralAll(): Promise<ApiResponse<EmptyOk[]>> {
    return this.get<EmptyOk[]>('/api/protocol/referral/all');
  }

  /** GET /api/protocol/report/all */
  async getProtocolReportAll(): Promise<ApiResponse<EmptyOk[]>> {
    return this.get<EmptyOk[]>('/api/protocol/report/all');
  }

  /** GET /api/protocol/verification/all */
  async getProtocolVerificationAll(): Promise<ApiResponse<EmptyOk[]>> {
    return this.get<EmptyOk[]>('/api/protocol/verification/all');
  }

  /** GET /api/protocol/workflow/all */
  async getProtocolWorkflowAll(): Promise<ApiResponse<ProtocolIntegrationItem[]>> {
    return this.get<ProtocolIntegrationItem[]>('/api/protocol/workflow/all');
  }

  // ---------------------------------------------------------------------------
  // /api/protocol/by-category(-all)?, check-usage, errors, get-temporary-user, ...
  // ---------------------------------------------------------------------------

  /** GET /api/protocol/by-category-all/{category} */
  async getProtocolsByCategoryAll(
    category: string | number,
  ): Promise<ApiResponse<ProtocolResource[]>> {
    return this.get<ProtocolResource[]>(
      `/api/protocol/by-category-all/${encodeURIComponent(String(category))}`,
    );
  }

  /**
   * GET /api/protocol/by-category/{category?} — paginated.
   * Optional category segment is omitted when not supplied.
   */
  async getProtocolsByCategory(
    category?: string | number,
  ): Promise<ApiResponse<PaginatedPayload<ProtocolResource>>> {
    const tail =
      category === undefined || category === null
        ? ''
        : `/${encodeURIComponent(String(category))}`;
    return this.get<PaginatedPayload<ProtocolResource>>(
      `/api/protocol/by-category${tail}`,
    );
  }

  /** GET /api/protocol/check-usage/{protocol} */
  async checkProtocolUsage(protocol: number): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>(`/api/protocol/check-usage/${protocol}`);
  }

  /** GET /api/protocol/errors/{protocol} */
  async getProtocolErrors(protocol: number): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>(`/api/protocol/errors/${protocol}`);
  }

  /** GET /api/protocol/get-temporary-user */
  async getTemporaryUserProtocol(): Promise<ApiResponse<ProtocolResource>> {
    return this.get<ProtocolResource>('/api/protocol/get-temporary-user');
  }

  /** GET /api/protocol/chain-item-branch-plan/{protocol}/{item} */
  async getChainItemBranchPlan(
    protocol: number,
    item: string | number,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>(
      `/api/protocol/chain-item-branch-plan/${protocol}/${encodeURIComponent(String(item))}`,
    );
  }

  /** GET /api/protocol/get-plan/{protocol} */
  async getProtocolPlan(protocol: number): Promise<ApiResponse<ProtocolAiPlanResource>> {
    return this.get<ProtocolAiPlanResource>(`/api/protocol/get-plan/${protocol}`);
  }

  /** GET /api/protocol/get-steps/{protocol} */
  async getProtocolSteps(
    protocol: number,
  ): Promise<ApiResponse<ProtocolStepResource[]>> {
    return this.get<ProtocolStepResource[]>(`/api/protocol/get-steps/${protocol}`);
  }

  /** GET /api/protocol/intensive-module/roles/{protocol} */
  async getIntensiveModuleRoles(protocol: number): Promise<ApiResponse<EmptyOk[]>> {
    return this.get<EmptyOk[]>(`/api/protocol/intensive-module/roles/${protocol}`);
  }

  /** GET /api/protocol/list-intensive/{protocol} */
  async listIntensiveModules(
    protocol: number,
  ): Promise<ApiResponse<ProtocolGlobalModuleResource[]>> {
    return this.get<ProtocolGlobalModuleResource[]>(
      `/api/protocol/list-intensive/${protocol}`,
    );
  }

  /** GET /api/protocol/show-intensive/{module} */
  async showIntensiveModule(
    module: number,
  ): Promise<ApiResponse<ProtocolGlobalModuleShowResource>> {
    return this.get<ProtocolGlobalModuleShowResource>(
      `/api/protocol/show-intensive/${module}`,
    );
  }

  /** GET /api/protocol/get-intensive-module-settings/{protocol}/{chain} */
  async getIntensiveModuleSettings(
    protocol: number,
    chain: string | number,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>(
      `/api/protocol/get-intensive-module-settings/${protocol}/${encodeURIComponent(String(chain))}`,
    );
  }

  /**
   * GET /api/protocol/modules/{recurring?}
   * Optional `recurring` flag (0/1) is omitted when not supplied.
   */
  async getProtocolModules(
    recurring?: 0 | 1 | boolean | string,
  ): Promise<ApiResponse<ProtocolModuleSummary[]>> {
    const tail =
      recurring === undefined || recurring === null
        ? ''
        : `/${encodeURIComponent(String(recurring))}`;
    return this.get<ProtocolModuleSummary[]>(`/api/protocol/modules${tail}`);
  }

  /** GET /api/protocol/node-members/{node} */
  async getNodeMembers(node: number): Promise<ApiResponse<EmptyOk[]>> {
    return this.get<EmptyOk[]>(`/api/protocol/node-members/${node}`);
  }

  /** GET /api/protocol/role-qualifications/{role} */
  async getRoleQualifications(
    role: string | number,
  ): Promise<ApiResponse<EmptyOk[]>> {
    return this.get<EmptyOk[]>(
      `/api/protocol/role-qualifications/${encodeURIComponent(String(role))}`,
    );
  }

  /** GET /api/protocol/roles/{type} */
  async getProtocolRoles(type: string | number): Promise<ApiResponse<EmptyOk[]>> {
    return this.get<EmptyOk[]>(`/api/protocol/roles/${encodeURIComponent(String(type))}`);
  }

  // ---------------------------------------------------------------------------
  // /api/protocol/sale/* + /api/protocol/settings/*
  // ---------------------------------------------------------------------------

  /** GET /api/protocol/sale/get/{protocol} */
  async getProtocolSale(protocol: number): Promise<ApiResponse<ProtocolSaleResource>> {
    return this.get<ProtocolSaleResource>(`/api/protocol/sale/get/${protocol}`);
  }

  /** GET /api/protocol/sale/salaries/{protocol} */
  async getProtocolSaleSalaries(
    protocol: number,
  ): Promise<ApiResponse<ProtocolSaleResource[]>> {
    return this.get<ProtocolSaleResource[]>(
      `/api/protocol/sale/salaries/${protocol}`,
    );
  }

  /** POST /api/protocol/sale/set-sale */
  async setProtocolSale(
    body: StoreSaleRequest,
  ): Promise<ApiResponse<ProtocolSaleResource>> {
    return this.post<ProtocolSaleResource>('/api/protocol/sale/set-sale', body);
  }

  /** PATCH /api/protocol/sale/update/{protocol} */
  async updateProtocolSale(
    protocol: number,
    body: UpdateSaleRequest,
  ): Promise<ApiResponse<ProtocolSaleResource>> {
    return this.patch<ProtocolSaleResource>(
      `/api/protocol/sale/update/${protocol}`,
      body,
    );
  }

  /** GET /api/protocol/settings/get/{protocol} */
  async getProtocolSettings(
    protocol: number,
  ): Promise<ApiResponse<ProtocolSettingsResource>> {
    return this.get<ProtocolSettingsResource>(
      `/api/protocol/settings/get/${protocol}`,
    );
  }

  /** POST /api/protocol/settings/save */
  async saveProtocolSettings(
    body: ProtocolStoreSettingsRequest,
  ): Promise<ApiResponse<ProtocolSettingsResource>> {
    return this.post<ProtocolSettingsResource>('/api/protocol/settings/save', body);
  }

  // ---------------------------------------------------------------------------
  // Plan/branch editors (POST)
  // ---------------------------------------------------------------------------

  /** POST /api/protocol/add-module-to-plan */
  async addModuleToPlan(
    body: ValidateModuleRequest,
  ): Promise<ApiResponse<ModuleValidationResource>> {
    return this.post<ModuleValidationResource>('/api/protocol/add-module-to-plan', body);
  }

  /** POST /api/protocol/add-module-to-branch */
  async addModuleToBranch(
    body: ValidateBranchModuleRequest,
  ): Promise<ApiResponse<AddProtocolPlanBranchItemResource>> {
    return this.post<AddProtocolPlanBranchItemResource>(
      '/api/protocol/add-module-to-branch',
      body,
    );
  }

  /** POST /api/protocol/edit-plan-module */
  async editPlanModule(
    body: ValidateModuleRequest,
  ): Promise<ApiResponse<ModuleValidationResource>> {
    return this.post<ModuleValidationResource>('/api/protocol/edit-plan-module', body);
  }

  /** POST /api/protocol/edit-plan-branch-module */
  async editPlanBranchModule(
    body: ValidateBranchModuleRequest,
  ): Promise<ApiResponse<EditProtocolPlanBranchResource>> {
    return this.post<EditProtocolPlanBranchResource>(
      '/api/protocol/edit-plan-branch-module',
      body,
    );
  }

  /** POST /api/protocol/move-up-plan-item */
  async movePlanItemUp(
    body: EditProtocolPlanModuleItemRequest,
  ): Promise<ApiResponse<EditProtocolPlanModuleResource>> {
    return this.post<EditProtocolPlanModuleResource>(
      '/api/protocol/move-up-plan-item',
      body,
    );
  }

  /** POST /api/protocol/move-down-plan-item */
  async movePlanItemDown(
    body: EditProtocolPlanModuleItemRequest,
  ): Promise<ApiResponse<EditProtocolPlanModuleResource>> {
    return this.post<EditProtocolPlanModuleResource>(
      '/api/protocol/move-down-plan-item',
      body,
    );
  }

  /** POST /api/protocol/delete-plan-item */
  async deletePlanItem(
    body: EditProtocolPlanModuleItemRequest,
  ): Promise<ApiResponse<EditProtocolPlanModuleResource>> {
    return this.post<EditProtocolPlanModuleResource>(
      '/api/protocol/delete-plan-item',
      body,
    );
  }

  /** POST /api/protocol/move-up-branch-item */
  async moveBranchItemUp(
    body: EditProtocolPlanBranchItemRequest,
  ): Promise<ApiResponse<EditProtocolPlanBranchResource>> {
    return this.post<EditProtocolPlanBranchResource>(
      '/api/protocol/move-up-branch-item',
      body,
    );
  }

  /** POST /api/protocol/move-down-branch-item */
  async moveBranchItemDown(
    body: EditProtocolPlanBranchItemRequest,
  ): Promise<ApiResponse<EditProtocolPlanBranchResource>> {
    return this.post<EditProtocolPlanBranchResource>(
      '/api/protocol/move-down-branch-item',
      body,
    );
  }

  /** POST /api/protocol/delete-branch-item */
  async deleteBranchItem(
    body: EditProtocolPlanBranchItemRequest,
  ): Promise<ApiResponse<EditProtocolPlanModuleResource>> {
    return this.post<EditProtocolPlanModuleResource>(
      '/api/protocol/delete-branch-item',
      body,
    );
  }

  /** POST /api/protocol/confirm-plan */
  async confirmProtocolPlan(
    body: ConfirmProtocolPlanRequest,
  ): Promise<ApiResponse<ConfirmPlanResource>> {
    return this.post<ConfirmPlanResource>('/api/protocol/confirm-plan', body);
  }

  /** POST /api/protocol/switch-member */
  async switchProtocolChainMember(
    body: ProtocolSwitchMemberRequest,
  ): Promise<ApiResponse<ChainItemMemberResource>> {
    return this.post<ChainItemMemberResource>('/api/protocol/switch-member', body);
  }

  // ---------------------------------------------------------------------------
  // Intensive (global) module CRUD
  // ---------------------------------------------------------------------------

  /** POST /api/protocol/store-intensive */
  async storeIntensiveModule(
    body: StoreGlobalModuleRequest,
  ): Promise<ApiResponse<ProtocolGlobalModuleResource>> {
    return this.post<ProtocolGlobalModuleResource>('/api/protocol/store-intensive', body);
  }

  /**
   * POST /api/protocol/update-intensive/{module}
   * Spec lists method as POST (NOT PUT/PATCH) — it is a POST update endpoint.
   */
  async updateIntensiveModule(
    module: number,
    body: UpdateGlobalModuleRequest,
  ): Promise<ApiResponse<ProtocolGlobalModuleResource>> {
    return this.post<ProtocolGlobalModuleResource>(
      `/api/protocol/update-intensive/${module}`,
      body,
    );
  }

  /** DELETE /api/protocol/delete-intensive/{global} */
  async deleteIntensiveModule(
    global: number,
  ): Promise<ApiResponse<ProtocolGlobalModuleResource>> {
    return this.delete<ProtocolGlobalModuleResource>(
      `/api/protocol/delete-intensive/${global}`,
    );
  }

  /** DELETE /api/protocol/reset-plan/{protocol} */
  async resetProtocolPlan(
    protocol: number,
  ): Promise<ApiResponse<ProtocolAiCreationResource>> {
    return this.delete<ProtocolAiCreationResource>(
      `/api/protocol/reset-plan/${protocol}`,
    );
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
  async aiCreateItem(
    body: ProtocolAiCreateItemRequest,
  ): Promise<ApiResponse<ProtocolAiCreationResource>> {
    return this.post<ProtocolAiCreationResource>('/api/protocol/ai-create', body);
  }

  /**
   * POST /api/protocol/ai-whole
   *
   * Same fire-and-poll contract as `aiCreateItem` — result token in `data.id`.
   */
  async aiCreateWhole(
    body: ProtocolAiCreateWholeRequest,
  ): Promise<ApiResponse<ProtocolAiCreationResource>> {
    return this.post<ProtocolAiCreationResource>('/api/protocol/ai-whole', body);
  }

  /**
   * POST /api/protocol/ai-create-branch
   *
   * Same fire-and-poll contract — result token in `data.id`.
   */
  async aiCreateBranchPlan(
    body: ProtocolBranchPlanRequest,
  ): Promise<ApiResponse<ProtocolAiCreationResource>> {
    return this.post<ProtocolAiCreationResource>('/api/protocol/ai-create-branch', body);
  }

  /**
   * GET /api/protocol/ai-request-status/{key}
   *
   * Polling endpoint paired with the three `ai-*` POSTs above. Pass the
   * `id` returned in the create response body.
   */
  async getAiRequestStatus(
    key: string,
  ): Promise<ApiResponse<ProtocolAiCreationResource>> {
    return this.get<ProtocolAiCreationResource>(
      `/api/protocol/ai-request-status/${encodeURIComponent(key)}`,
    );
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
  async startCodifyPipeline(
    body: StartCodifyPipelineRequest,
  ): Promise<ApiResponse<CodifyPipelineStartedResource>> {
    return this.post<CodifyPipelineStartedResource>(
      '/api/workflow/codify-pipeline/start',
      body,
      { auth: false },
    );
  }

  /**
   * POST /api/workflow/codify-pipeline/save-response
   *
   * Public endpoint. Body shape isn't pinned by the spec — caller sends the
   * follow-up question id + the user's answer payload.
   */
  async saveCodifyPipelineResponse(
    body: Record<string, unknown>,
  ): Promise<ApiResponse<CodifyPipelineStatusResource>> {
    return this.post<CodifyPipelineStatusResource>(
      '/api/workflow/codify-pipeline/save-response',
      body,
      { auth: false },
    );
  }

  /** GET /api/workflow/codify-pipeline/check-pipeline/{session} (public) */
  async checkCodifyPipeline(
    session: string,
  ): Promise<ApiResponse<CodifyPipelineStatusResource>> {
    return this.get<CodifyPipelineStatusResource>(
      `/api/workflow/codify-pipeline/check-pipeline/${encodeURIComponent(session)}`,
      undefined,
      { auth: false },
    );
  }

  /** GET /api/workflow/codify-pipeline/stop/{session} (public) */
  async stopCodifyPipeline(
    session: string,
  ): Promise<ApiResponse<CodifyPipelineStatusResource>> {
    return this.get<CodifyPipelineStatusResource>(
      `/api/workflow/codify-pipeline/stop/${encodeURIComponent(session)}`,
      undefined,
      { auth: false },
    );
  }
}
