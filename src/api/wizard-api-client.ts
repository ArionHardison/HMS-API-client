/**
 * Five-Step Wizard API TypeScript Client
 * 
 * This client provides TypeScript interfaces and methods for interacting with the 
 * Five-Step Wizard API, including asynchronous job processing for long-running operations.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { BaseApiClient, ApiResponse, ApiClientConfig } from './hms-api-client';

// =================== WIZARD DATA TYPES =====================

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
export enum WizardStep {
  DEFINE_PROBLEM = 'define_problem',
  CODIFY_SOLUTION = 'codify_solution',
  SETUP_PROGRAM = 'setup_program',
  EXECUTE_PROGRAM = 'execute_program',
  VERIFY_OUTCOME = 'verify_outcome',
  COMPLETE = 'complete',
  PENDING = 'pending'
}

/**
 * Feasibility Rating enum
 */
export enum FeasibilityRating {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  UNKNOWN = 'unknown'
}

/**
 * Payout Status enum
 */
export enum PayoutStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  COMPLETE = 'complete'
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
export enum JobStatus {
  QUEUED = 'queued',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
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
    }
  }
}

// =================== WIZARD API CLIENT =====================

/**
 * Five-Step Wizard API Client
 */
export class WizardApiClient extends BaseApiClient {
  /**
   * WebSocket connection for real-time updates
   */
  private socket: WebSocket | null = null;
  
  /**
   * Event listeners for job updates
   */
  private jobListeners: Record<string, ((data: JobStatusData) => void)[]> = {};
  
  /**
   * Event listeners for deal updates
   */
  private dealListeners: Record<string, ((data: DealData) => void)[]> = {};
  
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
  constructor(config: ApiClientConfig) {
    super(config);
  }
  
  /**
   * Initialize WebSocket connection for real-time job updates
   */
  private initWebSocket() {
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
            this.notifyJobListeners(message.data as JobStatusData);
          } else if (message.event === 'deal.status.updated') {
            this.notifyDealListeners(message.data as DealData);
          }
        } catch (error) {
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
    } catch (error) {
      console.error('WebSocket initialization error:', error);
    }
  }
  
  /**
   * Notify job listeners about job status updates
   * @param data Job status data
   */
  private notifyJobListeners(data: JobStatusData) {
    const listeners = this.jobListeners[data.id] || [];
    
    listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('Error in job listener:', error);
      }
    });
  }
  
  /**
   * Notify deal listeners about deal status updates
   * @param data Deal data
   */
  private notifyDealListeners(data: DealData) {
    const listeners = this.dealListeners[data.id] || [];
    
    listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
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
  public addJobListener(jobId: string, listener: (data: JobStatusData) => void): () => void {
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
  public addDealListener(dealId: string, listener: (data: DealData) => void): () => void {
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
  async startWizard(data: DefineProblemInput): Promise<AxiosResponse<ApiResponse<StepResultData>>> {
    return this.client.post('/wizard/start', data);
  }
  
  /**
   * Process step 1: Define Problem
   * @param dealId Deal ID
   * @param data Define problem input data
   */
  async defineProblems(dealId: string, data: DefineProblemInput): Promise<AxiosResponse<ApiResponse<StepResultData>>> {
    return this.client.post(`/wizard/deal/${dealId}/step/define_problem`, data);
  }
  
  /**
   * Process step 2: Codify Solution
   * @param dealId Deal ID
   * @param data Codify solution input data
   */
  async codifySolution(dealId: string, data: CodifySolutionInput): Promise<AxiosResponse<ApiResponse<StepResultData>>> {
    return this.client.post(`/wizard/deal/${dealId}/step/codify_solution`, data);
  }
  
  /**
   * Process step 3: Setup Program
   * @param dealId Deal ID
   * @param data Setup program input data
   */
  async setupProgram(dealId: string, data: SetupProgramInput): Promise<AxiosResponse<ApiResponse<StepResultData>>> {
    return this.client.post(`/wizard/deal/${dealId}/step/setup_program`, data);
  }
  
  /**
   * Process step 4: Execute Program
   * @param dealId Deal ID
   * @param data Execute program input data
   */
  async executeProgram(dealId: string, data: ExecuteProgramInput): Promise<AxiosResponse<ApiResponse<StepResultData>>> {
    return this.client.post(`/wizard/deal/${dealId}/step/execute_program`, data);
  }
  
  /**
   * Process step 5: Verify Outcome
   * @param dealId Deal ID
   * @param data Verify outcome input data
   */
  async verifyOutcome(dealId: string, data: VerifyOutcomeInput): Promise<AxiosResponse<ApiResponse<StepResultData>>> {
    return this.client.post(`/wizard/deal/${dealId}/step/verify_outcome`, data);
  }
  
  /**
   * Get the current status of a job
   * @param jobId Job ID
   */
  async getJobStatus(jobId: string): Promise<AxiosResponse<ApiResponse<JobStatusData>>> {
    return this.client.get(`/wizard/job/${jobId}`);
  }
  
  /**
   * Poll the status of a job until it completes or fails
   * @param jobId Job ID
   * @param interval Polling interval in milliseconds
   * @param timeout Timeout in milliseconds
   */
  async pollJobStatus(
    jobId: string, 
    interval: number = 1000, 
    timeout: number = 300000
  ): Promise<JobStatusData> {
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
        } catch (error) {
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
  async getDeal(dealId: string): Promise<AxiosResponse<ApiResponse<DealData>>> {
    return this.client.get(`/wizard/deal/${dealId}`);
  }
  
  /**
   * Get all deal snapshots
   * @param dealId Deal ID
   */
  async getDealSnapshots(dealId: string): Promise<AxiosResponse<ApiResponse<DealSnapshotData[]>>> {
    return this.client.get(`/wizard/deal/${dealId}/snapshots`);
  }
  
  /**
   * Get a specific deal snapshot
   * @param dealId Deal ID
   * @param version Snapshot version
   */
  async getDealSnapshot(dealId: string, version: number): Promise<AxiosResponse<ApiResponse<DealSnapshotData>>> {
    return this.client.get(`/wizard/deal/${dealId}/snapshot/${version}`);
  }
  
  /**
   * Compare two deal snapshots
   * @param dealId Deal ID
   * @param baseVersion Base version
   * @param compareVersion Compare version
   */
  async compareDealSnapshots(
    dealId: string, 
    baseVersion: number, 
    compareVersion: number
  ): Promise<AxiosResponse<ApiResponse<VersionComparisonData>>> {
    return this.client.get(
      `/wizard/deal/${dealId}/compare?base_version=${baseVersion}&compare_version=${compareVersion}`
    );
  }
  
  /**
   * Restore a deal to a specific snapshot version
   * @param dealId Deal ID
   * @param version Snapshot version
   */
  async restoreDealSnapshot(dealId: string, version: number): Promise<AxiosResponse<ApiResponse<DealData>>> {
    return this.client.post(`/wizard/deal/${dealId}/restore/${version}`);
  }
  
  /**
   * Get the complete wizard response (deal, program, protocol)
   * @param dealId Deal ID
   */
  async getWizardResponse(dealId: string): Promise<AxiosResponse<ApiResponse<ApiResponseData>>> {
    return this.client.get(`/wizard/deal/${dealId}/response`);
  }
  
  /**
   * Create a deal snapshot manually
   * @param dealId Deal ID
   * @param comment Snapshot comment
   */
  async createDealSnapshot(dealId: string, comment: string): Promise<AxiosResponse<ApiResponse<DealSnapshotData>>> {
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
export class WizardStepExecutor<T> {
  constructor(
    private client: WizardApiClient,
    private stepFunction: (dealId: string, data: T) => Promise<AxiosResponse<ApiResponse<StepResultData>>>
  ) {}
  
  /**
   * Process the step, handling asynchronous job processing automatically
   * @param dealId Deal ID
   * @param data Step input data
   * @param onProgress Progress callback
   * @param onDealUpdate Deal update callback
   */
  async process(
    dealId: string, 
    data: T, 
    onProgress?: (progress: number) => void,
    onDealUpdate?: (deal: DealData) => void
  ): Promise<DealData> {
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
    let removeJobListener: (() => void) | undefined;
    let removeDealListener: (() => void) | undefined;
    
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
    } finally {
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
  defineProblems: new WizardStepExecutor<DefineProblemInput>(
    wizardApiClient,
    (dealId, data) => wizardApiClient.defineProblems(dealId, data)
  ),
  
  codifySolution: new WizardStepExecutor<CodifySolutionInput>(
    wizardApiClient,
    (dealId, data) => wizardApiClient.codifySolution(dealId, data)
  ),
  
  setupProgram: new WizardStepExecutor<SetupProgramInput>(
    wizardApiClient,
    (dealId, data) => wizardApiClient.setupProgram(dealId, data)
  ),
  
  executeProgram: new WizardStepExecutor<ExecuteProgramInput>(
    wizardApiClient,
    (dealId, data) => wizardApiClient.executeProgram(dealId, data)
  ),
  
  verifyOutcome: new WizardStepExecutor<VerifyOutcomeInput>(
    wizardApiClient,
    (dealId, data) => wizardApiClient.verifyOutcome(dealId, data)
  )
};