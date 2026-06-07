/**
 * Five-Step Wizard API TypeScript Client
 *
 * This client provides TypeScript interfaces and methods for interacting with the
 * Five-Step Wizard API, including asynchronous job processing for long-running operations.
 */
import { AxiosResponse } from 'axios';
import { BaseApiClient, ApiResponse, ApiClientConfig } from './hms-api-client';
/**
 * Deal data structure that persists through all wizard steps
 */
export interface DealData {
    id: string;
    problem: string;
    category: string;
    sub_category?: string;
    solution_options?: SolutionOptionData[];
    stakeholders?: StakeholderData[];
    financing?: FinancingData[];
    expertise?: ExpertiseData[];
    execution_plan?: ExecutionPlanData;
    outcome?: OutcomeData;
    payout_status?: PayoutStatus;
    lessons_learned?: string;
    wizard_step: WizardStep;
    extensions?: Record<string, any>;
    created_at?: string;
    updated_at?: string;
}
/**
 * Solution Option data
 */
export interface SolutionOptionData {
    description: string;
    feasibility: FeasibilityRating;
}
/**
 * Stakeholder data
 */
export interface StakeholderData {
    name: string;
    role: string;
    engagement_level?: number;
    priority?: number;
}
/**
 * Financing data
 */
export interface FinancingData {
    stakeholder: string;
    estimated_cost: number;
    cost_basis: string;
}
/**
 * Expertise data
 */
export interface ExpertiseData {
    stakeholder: string;
    domain: string;
    responsibilities: string[];
}
/**
 * Execution Plan data
 */
export interface ExecutionPlanData {
    agents: string[];
    tools: string[];
    milestones: string[];
    progress?: number;
}
/**
 * Outcome data
 */
export interface OutcomeData {
    verified: boolean;
    metrics: Record<string, any>;
}
/**
 * Wizard Step enum
 */
export declare enum WizardStep {
    DEFINE_PROBLEM = "define_problem",
    CODIFY_SOLUTION = "codify_solution",
    SETUP_PROGRAM = "setup_program",
    EXECUTE_PROGRAM = "execute_program",
    VERIFY_OUTCOME = "verify_outcome",
    COMPLETE = "complete",
    PENDING = "pending"
}
/**
 * Feasibility Rating enum
 */
export declare enum FeasibilityRating {
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    UNKNOWN = "unknown"
}
/**
 * Payout Status enum
 */
export declare enum PayoutStatus {
    PENDING = "pending",
    PARTIAL = "partial",
    COMPLETE = "complete"
}
/**
 * Program data structure
 */
export interface ProgramData {
    id: string;
    name: string;
    description: string;
    protocol_id: string;
    protocol?: any;
    author_id: string;
    access_type: string;
    tags: string[];
    team: TeamMemberData[];
    attached_protocols: string[];
    status: string;
    extensions?: Record<string, any>;
    created_at?: string;
    updated_at?: string;
}
/**
 * Team Member data
 */
export interface TeamMemberData {
    id: string;
    name: string;
    role: string;
    email?: string;
}
/**
 * Protocol data structure
 */
export interface ProtocolData {
    id: string;
    name: string;
    owner_id: string;
    category_id: string;
    protocol_version: string;
    goal: string;
    problem: string;
    solution_context: string;
    chain: ChainStepData[];
    status: string;
    extensions?: Record<string, any>;
    created_at?: string;
    updated_at?: string;
}
/**
 * Chain Step data
 */
export interface ChainStepData {
    id: string;
    name: string;
    description: string;
    action: string;
    parameters: Record<string, any>;
}
/**
 * Complete API response containing all three data structures
 */
export interface ApiResponseData {
    deal: DealData;
    program: ProgramData;
    protocol: ProtocolData;
}
/**
 * Deal snapshot data
 */
export interface DealSnapshotData {
    id: string;
    deal_id: string;
    version: number;
    step: WizardStep;
    comment: string;
    created_by: string;
    deal_data: DealData;
    created_at?: string;
}
/**
 * Step input interfaces for each wizard step
 */
export interface DefineProblemInput {
    problem: string;
    category: string;
    sub_category?: string;
    user_id?: string;
    metadata?: Record<string, any>;
}
/**
 * Input for `WizardApiClient.defineDeal()` — wraps
 * `POST /api/wizard/deal/define` (DealWizardController). The api validates:
 *   - statement: required string, 1–8000 chars
 *   - subproject_id: optional integer (api falls back to X-Domain resolution)
 *   - tld: optional string up to 64 chars, normalized to `codify.<tld>`
 *
 * Anything else passed through is forwarded as-is into the orchestrator's
 * payload (e.g., `problem.intent_slug` override) — see CHAT_DEAL_WIRE.md.
 */
export interface DefineDealInput {
    /** The user's free-text problem statement (1–8000 chars). */
    statement: string;
    /** Optional explicit subproject binding; api defaults to X-Domain resolution. */
    subproject_id?: number;
    /**
     * Codify TLD slug — bare (`accountants`) or prefixed (`codify.accountants`).
     * api/ normalizes both forms to `codify.<tld>` before persisting.
     */
    tld?: string;
    /** Optional partial-override of the problem block (intent_slug, classification, …). */
    problem?: {
        intent_slug?: string | null;
        classification?: unknown;
        ontology_class?: string | null;
        required_info?: unknown;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}
export interface CodifySolutionInput {
    solution_options: SolutionOptionData[];
    selected_solution?: number;
    metadata?: Record<string, any>;
}
export interface SetupProgramInput {
    stakeholders: StakeholderData[];
    financing?: FinancingData[];
    expertise?: ExpertiseData[];
    program_name?: string;
    program_description?: string;
    team_members?: TeamMemberData[];
    metadata?: Record<string, any>;
}
export interface ExecuteProgramInput {
    execution_plan: Partial<ExecutionPlanData>;
    timeline?: string;
    resources?: string;
    metadata?: Record<string, any>;
}
export interface VerifyOutcomeInput {
    outcome: {
        verified: boolean;
        metrics: Record<string, any>;
    };
    payout_status?: PayoutStatus;
    lessons_learned?: string;
    metadata?: Record<string, any>;
}
/**
 * Job status data
 */
export interface JobStatusData {
    id: string;
    type: string;
    status: JobStatus;
    progress: number;
    result?: any;
    error?: string;
    created_at: string;
    updated_at: string;
}
/**
 * Job status enum
 */
export declare enum JobStatus {
    QUEUED = "queued",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed"
}
/**
 * Step result data
 */
export interface StepResultData {
    success: boolean;
    deal: DealData;
    job_id?: string;
    is_async: boolean;
    message?: string;
}
/**
 * Version comparison data
 */
export interface VersionComparisonData {
    base_version: number;
    compare_version: number;
    differences: {
        [key: string]: {
            old: any;
            new: any;
            type: 'added' | 'removed' | 'modified';
        };
    };
}
/**
 * Five-Step Wizard API Client
 */
export declare class WizardApiClient extends BaseApiClient {
    /**
     * WebSocket connection for real-time updates
     */
    private socket;
    /**
     * Event listeners for job updates
     */
    private jobListeners;
    /**
     * Event listeners for deal updates
     */
    private dealListeners;
    /**
     * Create a new wizard API client
     * @param config API client configuration
     *
     * Note: WebSocket connection is NOT auto-opened. Consumer code that
     * cares about real-time job/deal events must register a listener via
     * `addJobListener()` / `addDealListener()`, which internally calls
     * `initWebSocket()` lazily.
     *
     * Background: the original constructor opened a WebSocket to
     * `${window.location.host}/ws/jobs` unconditionally on any browser
     * environment. The SDK is consumed by multi-tenant frontends where
     * most tenant subdomains (codify.<tld>, codify.<city>, agency
     * apexes) do NOT have a Cloudflare/Nginx route for /ws/jobs, so
     * every page load printed "WebSocket connection to
     * wss://<tenant>/ws/jobs failed" and triggered a 5 s reconnect loop
     * forever. Pinned by tests/api/__tests__/wizard-api-client.websocket.test.ts.
     */
    constructor(config: ApiClientConfig);
    /**
     * Initialize WebSocket connection for real-time job updates
     */
    private initWebSocket;
    /**
     * Notify job listeners about job status updates
     * @param data Job status data
     */
    private notifyJobListeners;
    /**
     * Notify deal listeners about deal status updates
     * @param data Deal data
     */
    private notifyDealListeners;
    /**
     * Add a listener for job status updates
     * @param jobId The job ID to listen for
     * @param listener The listener function
     * @returns A function to remove the listener
     */
    addJobListener(jobId: string, listener: (data: JobStatusData) => void): () => void;
    /**
     * Add a listener for deal status updates
     * @param dealId The deal ID to listen for
     * @param listener The listener function
     * @returns A function to remove the listener
     */
    addDealListener(dealId: string, listener: (data: DealData) => void): () => void;
    /**
     * Start a new wizard session with the initial problem
     * @param data Define problem input data
     */
    startWizard(data: DefineProblemInput): Promise<AxiosResponse<ApiResponse<StepResultData>>>;
    /**
     * Create a new Deal from a problem statement — the canonical entry point
     * for the YCaaS apex chat surface (and any other caller that wants to
     * kick off the deal lifecycle from free text). Wraps
     * `POST /api/wizard/deal/define` (Modules\Deals\Http\Controllers\DealWizardController::define).
     *
     * api/ resolves the subproject from the explicit `subproject_id` body OR
     * the `X-Domain` header on the request (already injected by BaseApiClient).
     * api/ also classifies the problem against an LLM and computes the deal's
     * `required_info` before persisting — those fields come back on the
     * response.
     *
     * Returns the new Deal in state=analyzing, wizard_step=1. Subsequent
     * lifecycle calls go through the other `/wizard/deal/{id}/*` methods
     * on this client (defineProblems, codifySolution, etc.).
     *
     * See `api/docs/CHAT_DEAL_WIRE.md` for the multi-session chat→deal plan.
     */
    defineDeal(data: DefineDealInput): Promise<AxiosResponse<ApiResponse<DealData>>>;
    /**
     * Process step 1: Define Problem
     * @param dealId Deal ID
     * @param data Define problem input data
     */
    defineProblems(dealId: string, data: DefineProblemInput): Promise<AxiosResponse<ApiResponse<StepResultData>>>;
    /**
     * Process step 2: Codify Solution
     * @param dealId Deal ID
     * @param data Codify solution input data
     */
    codifySolution(dealId: string, data: CodifySolutionInput): Promise<AxiosResponse<ApiResponse<StepResultData>>>;
    /**
     * Process step 3: Setup Program
     * @param dealId Deal ID
     * @param data Setup program input data
     */
    setupProgram(dealId: string, data: SetupProgramInput): Promise<AxiosResponse<ApiResponse<StepResultData>>>;
    /**
     * Process step 4: Execute Program
     * @param dealId Deal ID
     * @param data Execute program input data
     */
    executeProgram(dealId: string, data: ExecuteProgramInput): Promise<AxiosResponse<ApiResponse<StepResultData>>>;
    /**
     * Process step 5: Verify Outcome
     * @param dealId Deal ID
     * @param data Verify outcome input data
     */
    verifyOutcome(dealId: string, data: VerifyOutcomeInput): Promise<AxiosResponse<ApiResponse<StepResultData>>>;
    /**
     * Get the current status of a job
     * @param jobId Job ID
     */
    getJobStatus(jobId: string): Promise<AxiosResponse<ApiResponse<JobStatusData>>>;
    /**
     * Poll the status of a job until it completes or fails
     * @param jobId Job ID
     * @param interval Polling interval in milliseconds
     * @param timeout Timeout in milliseconds
     */
    pollJobStatus(jobId: string, interval?: number, timeout?: number): Promise<JobStatusData>;
    /**
     * Get a deal by ID
     * @param dealId Deal ID
     */
    getDeal(dealId: string): Promise<AxiosResponse<ApiResponse<DealData>>>;
    /**
     * Get all deal snapshots
     * @param dealId Deal ID
     */
    getDealSnapshots(dealId: string): Promise<AxiosResponse<ApiResponse<DealSnapshotData[]>>>;
    /**
     * Get a specific deal snapshot
     * @param dealId Deal ID
     * @param version Snapshot version
     */
    getDealSnapshot(dealId: string, version: number): Promise<AxiosResponse<ApiResponse<DealSnapshotData>>>;
    /**
     * Compare two deal snapshots
     * @param dealId Deal ID
     * @param baseVersion Base version
     * @param compareVersion Compare version
     */
    compareDealSnapshots(dealId: string, baseVersion: number, compareVersion: number): Promise<AxiosResponse<ApiResponse<VersionComparisonData>>>;
    /**
     * Restore a deal to a specific snapshot version
     * @param dealId Deal ID
     * @param version Snapshot version
     */
    restoreDealSnapshot(dealId: string, version: number): Promise<AxiosResponse<ApiResponse<DealData>>>;
    /**
     * Get the complete wizard response (deal, program, protocol)
     * @param dealId Deal ID
     */
    getWizardResponse(dealId: string): Promise<AxiosResponse<ApiResponse<ApiResponseData>>>;
    /**
     * Create a deal snapshot manually
     * @param dealId Deal ID
     * @param comment Snapshot comment
     */
    createDealSnapshot(dealId: string, comment: string): Promise<AxiosResponse<ApiResponse<DealSnapshotData>>>;
}
export declare const wizardApiClient: WizardApiClient;
/**
 * Generic type-safe API wrapper for wizard step functions
 * Handles asynchronous job processing automatically
 */
export declare class WizardStepExecutor<T> {
    private client;
    private stepFunction;
    constructor(client: WizardApiClient, stepFunction: (dealId: string, data: T) => Promise<AxiosResponse<ApiResponse<StepResultData>>>);
    /**
     * Process the step, handling asynchronous job processing automatically
     * @param dealId Deal ID
     * @param data Step input data
     * @param onProgress Progress callback
     * @param onDealUpdate Deal update callback
     */
    process(dealId: string, data: T, onProgress?: (progress: number) => void, onDealUpdate?: (deal: DealData) => void): Promise<DealData>;
}
/**
 * Create type-safe step handlers
 */
export declare const wizardSteps: {
    defineProblems: WizardStepExecutor<DefineProblemInput>;
    codifySolution: WizardStepExecutor<CodifySolutionInput>;
    setupProgram: WizardStepExecutor<SetupProgramInput>;
    executeProgram: WizardStepExecutor<ExecuteProgramInput>;
    verifyOutcome: WizardStepExecutor<VerifyOutcomeInput>;
};
//# sourceMappingURL=wizard-api-client.d.ts.map