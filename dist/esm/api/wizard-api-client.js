/**
 * Five-Step Wizard API TypeScript Client
 *
 * This client provides TypeScript interfaces and methods for interacting with the
 * Five-Step Wizard API, including asynchronous job processing for long-running operations.
 */
import { BaseApiClient } from './hms-api-client';
/**
 * Wizard Step enum
 */
export var WizardStep;
(function (WizardStep) {
    WizardStep["DEFINE_PROBLEM"] = "define_problem";
    WizardStep["CODIFY_SOLUTION"] = "codify_solution";
    WizardStep["SETUP_PROGRAM"] = "setup_program";
    WizardStep["EXECUTE_PROGRAM"] = "execute_program";
    WizardStep["VERIFY_OUTCOME"] = "verify_outcome";
    WizardStep["COMPLETE"] = "complete";
    WizardStep["PENDING"] = "pending";
})(WizardStep || (WizardStep = {}));
/**
 * Feasibility Rating enum
 */
export var FeasibilityRating;
(function (FeasibilityRating) {
    FeasibilityRating["HIGH"] = "high";
    FeasibilityRating["MEDIUM"] = "medium";
    FeasibilityRating["LOW"] = "low";
    FeasibilityRating["UNKNOWN"] = "unknown";
})(FeasibilityRating || (FeasibilityRating = {}));
/**
 * Payout Status enum
 */
export var PayoutStatus;
(function (PayoutStatus) {
    PayoutStatus["PENDING"] = "pending";
    PayoutStatus["PARTIAL"] = "partial";
    PayoutStatus["COMPLETE"] = "complete";
})(PayoutStatus || (PayoutStatus = {}));
/**
 * Job status enum
 */
export var JobStatus;
(function (JobStatus) {
    JobStatus["QUEUED"] = "queued";
    JobStatus["PROCESSING"] = "processing";
    JobStatus["COMPLETED"] = "completed";
    JobStatus["FAILED"] = "failed";
})(JobStatus || (JobStatus = {}));
// =================== WIZARD API CLIENT =====================
/**
 * Five-Step Wizard API Client
 */
export class WizardApiClient extends BaseApiClient {
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
    constructor(config) {
        super(config);
        /**
         * WebSocket connection for real-time updates
         */
        this.socket = null;
        /**
         * Event listeners for job updates
         */
        this.jobListeners = {};
        /**
         * Event listeners for deal updates
         */
        this.dealListeners = {};
    }
    /**
     * Initialize WebSocket connection for real-time job updates
     */
    initWebSocket() {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsHost = window.location.hostname === 'localhost' ?
            'localhost:6001' :
            window.location.host;
        try {
            this.socket = new WebSocket(`${wsProtocol}//${wsHost}/ws/jobs`);
            this.socket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    // Check the event type to determine how to process
                    if (message.event === 'job.status.updated') {
                        this.notifyJobListeners(message.data);
                    }
                    else if (message.event === 'deal.status.updated') {
                        this.notifyDealListeners(message.data);
                    }
                }
                catch (error) {
                    console.error('WebSocket message parsing error:', error);
                }
            };
            this.socket.onclose = () => {
                // Attempt to reconnect after a delay
                setTimeout(() => this.initWebSocket(), 5000);
            };
            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.socket?.close();
            };
        }
        catch (error) {
            console.error('WebSocket initialization error:', error);
        }
    }
    /**
     * Notify job listeners about job status updates
     * @param data Job status data
     */
    notifyJobListeners(data) {
        const listeners = this.jobListeners[data.id] || [];
        listeners.forEach(listener => {
            try {
                listener(data);
            }
            catch (error) {
                console.error('Error in job listener:', error);
            }
        });
    }
    /**
     * Notify deal listeners about deal status updates
     * @param data Deal data
     */
    notifyDealListeners(data) {
        const listeners = this.dealListeners[data.id] || [];
        listeners.forEach(listener => {
            try {
                listener(data);
            }
            catch (error) {
                console.error('Error in deal listener:', error);
            }
        });
    }
    /**
     * Add a listener for job status updates
     * @param jobId The job ID to listen for
     * @param listener The listener function
     * @returns A function to remove the listener
     */
    addJobListener(jobId, listener) {
        if (!this.jobListeners[jobId]) {
            this.jobListeners[jobId] = [];
        }
        this.jobListeners[jobId].push(listener);
        return () => {
            this.jobListeners[jobId] = this.jobListeners[jobId].filter(l => l !== listener);
            if (this.jobListeners[jobId].length === 0) {
                delete this.jobListeners[jobId];
            }
        };
    }
    /**
     * Add a listener for deal status updates
     * @param dealId The deal ID to listen for
     * @param listener The listener function
     * @returns A function to remove the listener
     */
    addDealListener(dealId, listener) {
        if (!this.dealListeners[dealId]) {
            this.dealListeners[dealId] = [];
        }
        this.dealListeners[dealId].push(listener);
        return () => {
            this.dealListeners[dealId] = this.dealListeners[dealId].filter(l => l !== listener);
            if (this.dealListeners[dealId].length === 0) {
                delete this.dealListeners[dealId];
            }
        };
    }
    /**
     * Start a new wizard session with the initial problem
     * @param data Define problem input data
     */
    async startWizard(data) {
        return this.client.post('/wizard/start', data);
    }
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
    async defineDeal(data) {
        return this.client.post('/wizard/deal/define', data);
    }
    /**
     * Process step 1: Define Problem
     * @param dealId Deal ID
     * @param data Define problem input data
     */
    async defineProblems(dealId, data) {
        return this.client.post(`/wizard/deal/${dealId}/step/define_problem`, data);
    }
    /**
     * Process step 2: Codify Solution
     * @param dealId Deal ID
     * @param data Codify solution input data
     */
    async codifySolution(dealId, data) {
        return this.client.post(`/wizard/deal/${dealId}/step/codify_solution`, data);
    }
    /**
     * Process step 3: Setup Program
     * @param dealId Deal ID
     * @param data Setup program input data
     */
    async setupProgram(dealId, data) {
        return this.client.post(`/wizard/deal/${dealId}/step/setup_program`, data);
    }
    /**
     * Process step 4: Execute Program
     * @param dealId Deal ID
     * @param data Execute program input data
     */
    async executeProgram(dealId, data) {
        return this.client.post(`/wizard/deal/${dealId}/step/execute_program`, data);
    }
    /**
     * Process step 5: Verify Outcome
     * @param dealId Deal ID
     * @param data Verify outcome input data
     */
    async verifyOutcome(dealId, data) {
        return this.client.post(`/wizard/deal/${dealId}/step/verify_outcome`, data);
    }
    /**
     * Get the current status of a job
     * @param jobId Job ID
     */
    async getJobStatus(jobId) {
        return this.client.get(`/wizard/job/${jobId}`);
    }
    /**
     * Poll the status of a job until it completes or fails
     * @param jobId Job ID
     * @param interval Polling interval in milliseconds
     * @param timeout Timeout in milliseconds
     */
    async pollJobStatus(jobId, interval = 1000, timeout = 300000) {
        const startTime = Date.now();
        return new Promise((resolve, reject) => {
            const poll = async () => {
                try {
                    const response = await this.getJobStatus(jobId);
                    const jobStatus = response.data.data;
                    if (jobStatus.status === JobStatus.COMPLETED) {
                        resolve(jobStatus);
                        return;
                    }
                    if (jobStatus.status === JobStatus.FAILED) {
                        reject(new Error(jobStatus.error || 'Job failed'));
                        return;
                    }
                    if (Date.now() - startTime >= timeout) {
                        reject(new Error('Job polling timed out'));
                        return;
                    }
                    setTimeout(poll, interval);
                }
                catch (error) {
                    reject(error);
                }
            };
            poll();
        });
    }
    /**
     * Get a deal by ID
     * @param dealId Deal ID
     */
    async getDeal(dealId) {
        return this.client.get(`/wizard/deal/${dealId}`);
    }
    /**
     * Get all deal snapshots
     * @param dealId Deal ID
     */
    async getDealSnapshots(dealId) {
        return this.client.get(`/wizard/deal/${dealId}/snapshots`);
    }
    /**
     * Get a specific deal snapshot
     * @param dealId Deal ID
     * @param version Snapshot version
     */
    async getDealSnapshot(dealId, version) {
        return this.client.get(`/wizard/deal/${dealId}/snapshot/${version}`);
    }
    /**
     * Compare two deal snapshots
     * @param dealId Deal ID
     * @param baseVersion Base version
     * @param compareVersion Compare version
     */
    async compareDealSnapshots(dealId, baseVersion, compareVersion) {
        return this.client.get(`/wizard/deal/${dealId}/compare?base_version=${baseVersion}&compare_version=${compareVersion}`);
    }
    /**
     * Restore a deal to a specific snapshot version
     * @param dealId Deal ID
     * @param version Snapshot version
     */
    async restoreDealSnapshot(dealId, version) {
        return this.client.post(`/wizard/deal/${dealId}/restore/${version}`);
    }
    /**
     * Get the complete wizard response (deal, program, protocol)
     * @param dealId Deal ID
     */
    async getWizardResponse(dealId) {
        return this.client.get(`/wizard/deal/${dealId}/response`);
    }
    /**
     * Create a deal snapshot manually
     * @param dealId Deal ID
     * @param comment Snapshot comment
     */
    async createDealSnapshot(dealId, comment) {
        return this.client.post(`/wizard/deal/${dealId}/snapshot`, { comment });
    }
}
// Create default instance with auto-configuration
export const wizardApiClient = new WizardApiClient({
    baseURL: typeof window !== 'undefined' ?
        (window.location.hostname === 'localhost' ? 'http://localhost:8000/api' : '/api') :
        'https://api.example.com/api'
});
/**
 * Generic type-safe API wrapper for wizard step functions
 * Handles asynchronous job processing automatically
 */
export class WizardStepExecutor {
    constructor(client, stepFunction) {
        this.client = client;
        this.stepFunction = stepFunction;
    }
    /**
     * Process the step, handling asynchronous job processing automatically
     * @param dealId Deal ID
     * @param data Step input data
     * @param onProgress Progress callback
     * @param onDealUpdate Deal update callback
     */
    async process(dealId, data, onProgress, onDealUpdate) {
        // Call the step function
        const response = await this.stepFunction(dealId, data);
        const result = response.data.data;
        // If not async, return the deal immediately
        if (!result.is_async) {
            return result.deal;
        }
        // If async, poll for job completion
        if (!result.job_id) {
            throw new Error('Asynchronous job ID not provided');
        }
        // Add listeners for progress and deal updates
        let removeJobListener;
        let removeDealListener;
        if (onProgress) {
            removeJobListener = this.client.addJobListener(result.job_id, (jobStatus) => {
                onProgress(jobStatus.progress);
            });
        }
        if (onDealUpdate) {
            removeDealListener = this.client.addDealListener(dealId, (dealData) => {
                onDealUpdate(dealData);
            });
        }
        try {
            // Poll for job completion
            const jobStatus = await this.client.pollJobStatus(result.job_id);
            // Get the updated deal
            const dealResponse = await this.client.getDeal(dealId);
            return dealResponse.data.data;
        }
        finally {
            // Remove listeners if added
            if (removeJobListener) {
                removeJobListener();
            }
            if (removeDealListener) {
                removeDealListener();
            }
        }
    }
}
/**
 * Create type-safe step handlers
 */
export const wizardSteps = {
    defineProblems: new WizardStepExecutor(wizardApiClient, (dealId, data) => wizardApiClient.defineProblems(dealId, data)),
    codifySolution: new WizardStepExecutor(wizardApiClient, (dealId, data) => wizardApiClient.codifySolution(dealId, data)),
    setupProgram: new WizardStepExecutor(wizardApiClient, (dealId, data) => wizardApiClient.setupProgram(dealId, data)),
    executeProgram: new WizardStepExecutor(wizardApiClient, (dealId, data) => wizardApiClient.executeProgram(dealId, data)),
    verifyOutcome: new WizardStepExecutor(wizardApiClient, (dealId, data) => wizardApiClient.verifyOutcome(dealId, data))
};
//# sourceMappingURL=wizard-api-client.js.map