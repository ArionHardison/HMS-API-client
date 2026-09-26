/**
 * Type definitions for the Protocol CRUD + AI Assist slice of the P2X API.
 *
 * Source of truth is `sdk/spec/endpoints.json` — every shape here corresponds
 * to a `request.shape` or `response.shape` for an endpoint matching one of
 * the slice predicates (URI starts with `/api/protocol/`, contains
 * `/codify-pipeline/`, starts with `/api/protocol-`, or `id` matches
 * `protocol.*` minus the PersonalChain sibling slice).
 *
 * All types are structural (interfaces, not branded aliases) so consumers
 * like `sys/` can drop their `as unknown as` workarounds.
 */
/**
 * Single protocol record. `programs` is intentionally `unknown` — the
 * controller hydrates it lazily depending on subproject context, and the
 * spec doesn't pin a shape here.
 */
export interface ProtocolResource {
    id: number;
    name: unknown;
    problem: unknown;
    category_id: number;
    programs: unknown;
}
/** Body for `POST /api/protocol`. */
export interface StoreProtocolRequest {
    name: string;
    category_id?: number | null;
    problem: string;
}
/** Body for `PUT /api/protocol/{protocol}`. */
export interface UpdateProtocolRequest {
    name: string;
    category_id?: number | null;
    problem: string;
}
/** `wrapper: "data"` on `protocol-category.*` endpoints — open-shape resource. */
export type ProtocolCategoryResource = Record<string, unknown>;
/** Body for `POST /api/protocol-category`. */
export interface CreateProtocolCategoryRequest {
    category_name: string;
}
/** Body for `PUT /api/protocol-category/{protocol_category}`. */
export interface UpdateProtocolCategoryRequest {
    category_name: string;
}
/** Body for `POST /api/protocol/confirm-plan` (re-uses the category-name shape per spec). */
export interface ConfirmProtocolPlanRequest {
    category_name: string;
}
/** Body for `POST /api/protocol/add-module-to-plan` and edit-plan-module. */
export interface ValidateModuleRequest {
    id: string;
    protocol_id: number;
    at: string;
    at_time?: boolean | null;
    branch_child_id?: number | null;
    branch_id?: string | null;
    moduleName?: unknown;
    stepDescription: string;
    target: string;
}
/** Body for `POST /api/protocol/add-module-to-branch` + edit-plan-branch-module. */
export interface ValidateBranchModuleRequest {
    branch_id: string;
    branch_child_id: number;
    id: string;
    protocol_id: number;
    at?: string | null;
    moduleName?: unknown;
    stepDescription: string;
    target: string;
}
/** Body for `POST /api/protocol/{move-up,move-down,delete}-branch-item`. */
export interface EditProtocolPlanBranchItemRequest {
    branch_id: string;
    item: string;
    protocol_id: number;
}
/** Body for `POST /api/protocol/{move-up,move-down,delete}-plan-item`. */
export interface EditProtocolPlanModuleItemRequest {
    item: string;
    protocol_id: number;
}
/**
 * Open-shape responses — the controllers return whatever the resource emits
 * for the validated module/branch, which the spec doesn't pin.
 */
export type ModuleValidationResource = Record<string, unknown>;
export type EditProtocolPlanModuleResource = Record<string, unknown>;
export type EditProtocolPlanBranchResource = Record<string, unknown>;
export type AddProtocolPlanBranchItemResource = Record<string, unknown>;
export type ConfirmPlanResource = Record<string, unknown>;
/**
 * Body for `POST /api/protocol/ai-create`. The controller dispatches a job
 * onto the `ai` queue and returns a polling token.
 */
export interface ProtocolAiCreateItemRequest {
    child: number;
    at?: string | null;
    goal: string;
    module: string;
    planNodeId: string;
    protocol?: unknown;
    wish?: string | null;
    type: string;
}
/** Body for `POST /api/protocol/ai-whole`. */
export interface ProtocolAiCreateWholeRequest {
    protocol?: unknown;
    parent: number;
}
/** Body for `POST /api/protocol/ai-create-branch`. */
export interface ProtocolBranchPlanRequest {
    context: string;
    module: string;
    parent: string;
    protocol_id: number;
    id: string;
}
/**
 * AI-assist endpoints (`ai-create`, `ai-whole`, `ai-create-branch`) all
 * return a `ProtocolAiCreationResource` whose `data` payload carries
 * `{ id: requestId }` — that `id` is the polling key callers feed into
 * `GET /api/protocol/ai-request-status/{key}`. We surface it as both
 * `id` (the actual server key) and `key`/`request_id` aliases so callers
 * have a stable name regardless of which spelling the wider codebase uses.
 *
 * Polling responses share the resource but populate the status fields
 * (`successfully`, `finished`, `message`, `step`) instead of the request id.
 */
export interface ProtocolAiCreationResource {
    /** Polling token — the value the caller sends as `{key}` to `ai-request-status`. */
    id?: string;
    /** Alias surfaced by some consumers; equal to `id` when present. */
    key?: string;
    /** Alias surfaced by some consumers; equal to `id` when present. */
    request_id?: string;
    /** Final outcome flag — only populated on the polling response. */
    successfully?: boolean;
    /** Whether the background job has run to completion. */
    finished?: boolean;
    /** Human-readable status / error message. */
    message?: string | null;
    /** Free-form progress marker emitted by the worker. */
    step?: string | number | null;
    [key: string]: unknown;
}
/** Body for `POST /api/protocol/store-intensive`. */
export interface StoreGlobalModuleRequest {
    at_time: string;
    at_week_days: unknown[];
    every_hour?: unknown;
    prevent_finish?: boolean | null;
    protocol_id: string;
    chain_item_id: string;
    repeat: number;
    run_every: string;
    selected_item?: number | null;
    selected_module?: unknown;
    settings?: unknown[] | null;
    target: string;
    start_after: string;
    stop_after?: string | null;
}
/** Body for `POST /api/protocol/update-intensive/{module}`. */
export interface UpdateGlobalModuleRequest {
    id?: unknown;
    at_time?: unknown;
    at_week_days: unknown[];
    every_hour?: unknown;
    prevent_finish?: boolean | null;
    protocol_id: string;
    chain_item_id: string;
    repeat: number;
    run_every: string;
    selected_item: number;
    selected_module?: unknown;
    settings?: unknown[] | null;
    target: string;
    role?: number | null;
    start_after: string;
    stop_after?: string | null;
}
/** Response from `store-intensive` / `update-intensive` (ProtocolGlobalModuleResource). */
export interface ProtocolGlobalModuleResource {
    id: number;
    module: unknown;
    item: unknown;
    protocol_id: number;
}
/** Show-intensive — single global module record. */
export interface ProtocolGlobalModuleShowResource {
    at_time: unknown;
    at_week_days: unknown;
    every_hour: unknown;
    id: number;
    prevent_finish: unknown;
    protocol_id: number;
    repeat: unknown;
    role: unknown;
    target: unknown;
    run_every: unknown;
    selected_item: unknown;
    selected_module: unknown;
    settings: unknown;
    start_after: unknown;
    stop_after: unknown;
}
/** Single salary line on a protocol-sale. */
export interface ProtocolSalaryLine {
    id?: number | null;
    role_id?: number | null;
    salary?: number | null;
}
/** Body for `POST /api/protocol/sale/set-sale`. */
export interface StoreSaleRequest {
    protocol_id?: unknown;
    amount: number;
    /**
     * Salary lines, indexed in spec as `salary.*.{id,role_id,salary}`. Spec
     * shape says `object`; callers in practice ship an array — we accept either.
     */
    salary?: ProtocolSalaryLine[] | Record<string, ProtocolSalaryLine>;
}
/** Body for `PATCH /api/protocol/sale/update/{protocol}`. */
export interface UpdateSaleRequest {
    amount: number;
    salary?: ProtocolSalaryLine[] | Record<string, ProtocolSalaryLine>;
}
export type ProtocolSaleResource = Record<string, unknown>;
export type ProtocolSettingsResource = Record<string, unknown>;
/** Body for `POST /api/protocol/settings/save`. */
export interface ProtocolStoreSettingsRequest {
    protocol_id?: unknown;
    report?: boolean | null;
}
/** Body for `POST /api/protocol/switch-member`. */
export interface ProtocolSwitchMemberRequest {
    node_id: number;
    member_id: number;
}
export type ChainItemMemberResource = Record<string, unknown>;
/** `GET /api/protocol/modules/{recurring?}` — single module summary. */
export interface ProtocolModuleSummary {
    contain_items: unknown;
    description: unknown;
    id: number;
    module_resource: unknown;
    multi_ways: unknown;
    score_based: unknown;
    role_targeted: unknown;
    time_based: unknown;
    name: unknown;
    items: unknown;
}
/** `GET /api/protocol/get-steps/{protocol}` — single step. */
export interface ProtocolStepResource {
    id: number;
    name: unknown;
    role: unknown;
}
/** Sub-module integration resources keyed by module — open shape. */
export interface ProtocolIntegrationItem {
    id: number;
    name: unknown;
    description: unknown;
}
/** `etl.protocol.all` — has the same shape plus severity/status. */
export interface EtlProtocolIntegrationItem {
    id: number;
    name: unknown;
    description: unknown;
    severity: unknown;
    status: unknown;
}
/** Body for `POST /api/workflow/codify-pipeline/start`. `problem` and `file` are mutually exclusive but both surfaced. */
export interface StartCodifyPipelineRequest {
    problem?: string | Blob | File | null;
    file?: Blob | File | null;
    session: string;
    timezone: string;
}
/**
 * Response shape of `POST /api/workflow/codify-pipeline/start`
 * (CodifyPipelineStartedResource).
 */
export interface CodifyPipelineStartedResource {
    started: unknown;
    progress: unknown;
    interaction: unknown;
    name: unknown;
    interaction_data: unknown;
}
/**
 * Response shape of `check-pipeline`, `save-response`, `stop`
 * (CodifyPipelineStatusResource).
 */
export interface CodifyPipelineStatusResource {
    finished: unknown;
    started: unknown;
    progress: unknown;
    interaction: unknown;
    name: unknown;
    interaction_data: unknown;
    program: unknown;
    account: unknown;
}
/**
 * `GET /api/protocol/get-plan/{protocol}` — `ProtocolAiPlanResource`.
 * The controller wraps the plan JSON with a `confirmed` flag.
 */
export interface ProtocolAiPlanResource {
    plan?: unknown;
    confirmed?: boolean;
    [key: string]: unknown;
}
/**
 * `wrapper: "paginated"` Laravel envelope shape — kept structural and open
 * because pagination metadata is not part of this slice's contract.
 */
export interface PaginatedPayload<T> {
    items: T[];
    meta?: unknown;
    links?: unknown;
}
/** Empty success payload (`wrapper: "data"`, `shape: {}`). */
export interface EmptyOk {
    [key: string]: unknown;
}
//# sourceMappingURL=protocol.d.ts.map