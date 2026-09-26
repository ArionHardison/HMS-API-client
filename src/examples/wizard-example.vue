<template>
  <div class="wizard-container">
    <!-- Wizard Header -->
    <div class="wizard-header">
      <h1>Five-Step Wizard</h1>
      <div class="step-indicators">
        <div 
          v-for="(step, index) in steps" 
          :key="index" 
          :class="['step-indicator', { 
            'active': currentStepIndex === index,
            'completed': isStepCompleted(index)
          }]"
          @click="canNavigateToStep(index) && navigateToStep(index)"
        >
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-name">{{ step.name }}</div>
        </div>
      </div>
    </div>

    <!-- Processing Overlay -->
    <div v-if="processing" class="processing-overlay">
      <div class="processing-content">
        <div class="spinner"></div>
        <h3>{{ processingMessage }}</h3>
        <div v-if="processingProgress > 0" class="progress-bar">
          <div class="progress-fill" :style="{ width: `${processingProgress}%` }"></div>
        </div>
        <div v-if="processingProgress > 0" class="progress-text">
          {{ Math.round(processingProgress) }}%
        </div>
      </div>
    </div>

    <!-- Step 1: Define Problem -->
    <div v-show="currentStepIndex === 0" class="wizard-step">
      <h2>Step 1: Define Problem</h2>
      
      <div class="form-group">
        <label for="problem">What problem are you trying to solve?</label>
        <textarea 
          id="problem" 
          v-model="step1Data.problem" 
          class="form-control" 
          rows="3" 
          placeholder="Describe your problem or challenge..."
          required
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="category">Problem Category</label>
        <select 
          id="category" 
          v-model="step1Data.category" 
          class="form-control" 
          required
        >
          <option value="">Select a category</option>
          <option value="healthcare">Healthcare</option>
          <option value="finance">Finance</option>
          <option value="education">Education</option>
          <option value="technology">Technology</option>
          <option value="environment">Environment</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="sub_category">Subcategory (Optional)</label>
        <input 
          type="text" 
          id="sub_category" 
          v-model="step1Data.sub_category" 
          class="form-control" 
          placeholder="Specify a subcategory..."
        />
      </div>

      <div class="button-row">
        <button 
          @click="processStep1" 
          :disabled="!isStep1Valid" 
          class="btn-primary"
        >
          Continue to Step 2
        </button>
      </div>
    </div>

    <!-- Step 2: Codify Solution -->
    <div v-show="currentStepIndex === 1" class="wizard-step">
      <h2>Step 2: Codify Solution</h2>
      
      <div v-if="deal?.solution_options?.length" class="proposed-solutions">
        <h3>AI-Generated Solution Options</h3>
        <div 
          v-for="(solution, index) in deal.solution_options" 
          :key="index"
          :class="['solution-option', { 'selected': step2Data.selected_solution === index }]"
          @click="step2Data.selected_solution = index"
        >
          <div class="solution-header">
            <span class="solution-number">Option {{ index + 1 }}</span>
            <span :class="['feasibility-badge', solution.feasibility.toLowerCase()]">
              {{ solution.feasibility }}
            </span>
          </div>
          <p>{{ solution.description }}</p>
        </div>
      </div>
      
      <div class="form-group">
        <label>Add Your Own Solution</label>
        <div class="custom-solution-input">
          <input 
            v-model="newSolution.description" 
            class="form-control" 
            placeholder="Describe your solution..."
          />
          <select v-model="newSolution.feasibility" class="form-control">
            <option value="HIGH">High Feasibility</option>
            <option value="MEDIUM">Medium Feasibility</option>
            <option value="LOW">Low Feasibility</option>
            <option value="UNKNOWN">Unknown Feasibility</option>
          </select>
          <button @click="addCustomSolution" :disabled="!newSolution.description" class="btn-secondary">
            Add
          </button>
        </div>
      </div>

      <div class="button-row">
        <button @click="currentStepIndex = 0" class="btn-secondary">
          Back
        </button>
        <button 
          @click="processStep2" 
          :disabled="!isStep2Valid" 
          class="btn-primary"
        >
          Continue to Step 3
        </button>
      </div>
    </div>

    <!-- Step 3: Setup Program -->
    <div v-show="currentStepIndex === 2" class="wizard-step">
      <h2>Step 3: Setup Program</h2>
      
      <div class="form-group">
        <label for="program_name">Program Name</label>
        <input 
          type="text" 
          id="program_name" 
          v-model="step3Data.program_name" 
          class="form-control" 
          placeholder="Enter program name..."
          required
        />
      </div>
      
      <div class="form-group">
        <label for="program_description">Program Description</label>
        <textarea 
          id="program_description" 
          v-model="step3Data.program_description" 
          class="form-control" 
          rows="3" 
          placeholder="Describe the program..."
          required
        ></textarea>
      </div>
      
      <div class="form-group">
        <label>Stakeholders</label>
        <div v-for="(stakeholder, index) in step3Data.stakeholders" :key="index" class="stakeholder-item">
          <div class="stakeholder-inputs">
            <input 
              v-model="stakeholder.name" 
              class="form-control" 
              placeholder="Stakeholder name" 
              required
            />
            <input 
              v-model="stakeholder.role" 
              class="form-control" 
              placeholder="Role" 
              required
            />
          </div>
          <button @click="removeStakeholder(index)" class="btn-icon" title="Remove stakeholder">
            ✕
          </button>
        </div>
        <button @click="addStakeholder" class="btn-secondary">
          Add Stakeholder
        </button>
      </div>

      <div class="button-row">
        <button @click="currentStepIndex = 1" class="btn-secondary">
          Back
        </button>
        <button 
          @click="processStep3" 
          :disabled="!isStep3Valid" 
          class="btn-primary"
        >
          Continue to Step 4
        </button>
      </div>
    </div>

    <!-- Step 4: Execute Program -->
    <div v-show="currentStepIndex === 3" class="wizard-step">
      <h2>Step 4: Execute Program</h2>
      
      <div class="form-group">
        <label for="execution_plan">Execution Plan</label>
        <textarea 
          id="execution_plan" 
          v-model="executionPlanText" 
          class="form-control" 
          rows="5" 
          placeholder="Detail the execution plan..."
          required
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="timeline">Timeline</label>
        <input 
          type="text" 
          id="timeline" 
          v-model="step4Data.timeline" 
          class="form-control" 
          placeholder="Timeline for execution..."
          required
        />
      </div>
      
      <div class="form-group">
        <label for="resources">Resources</label>
        <textarea 
          id="resources" 
          v-model="step4Data.resources" 
          class="form-control" 
          rows="3" 
          placeholder="Resources needed..."
          required
        ></textarea>
      </div>

      <div class="button-row">
        <button @click="currentStepIndex = 2" class="btn-secondary">
          Back
        </button>
        <button 
          @click="processStep4" 
          :disabled="!isStep4Valid" 
          class="btn-primary"
        >
          Continue to Step 5
        </button>
      </div>
    </div>

    <!-- Step 5: Verify Outcome -->
    <div v-show="currentStepIndex === 4" class="wizard-step">
      <h2>Step 5: Verify Outcome</h2>
      
      <div class="form-group">
        <label>Was the outcome successful?</label>
        <div class="radio-group">
          <label class="radio-item">
            <input 
              type="radio" 
              v-model="step5Data.outcome.verified" 
              :value="true" 
              name="outcome_verified"
            />
            <span>Yes</span>
          </label>
          <label class="radio-item">
            <input 
              type="radio" 
              v-model="step5Data.outcome.verified" 
              :value="false" 
              name="outcome_verified"
            />
            <span>No</span>
          </label>
        </div>
      </div>
      
      <div class="form-group">
        <label for="lessons_learned">Lessons Learned</label>
        <textarea 
          id="lessons_learned" 
          v-model="step5Data.lessons_learned" 
          class="form-control" 
          rows="4" 
          placeholder="What did you learn from this process?"
          required
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="payout_status">Payout Status</label>
        <select 
          id="payout_status" 
          v-model="step5Data.payout_status" 
          class="form-control" 
          required
        >
          <option value="PENDING">Pending</option>
          <option value="PARTIAL">Partial</option>
          <option value="COMPLETE">Complete</option>
        </select>
      </div>

      <div class="metrics-form">
        <h3>Success Metrics</h3>
        <div v-for="(value, key) in step5Data.outcome.metrics" :key="key" class="metric-item">
          <input 
            :value="key" 
            @input="updateMetricKey(key, $event)" 
            class="form-control" 
            placeholder="Metric name" 
          />
          <input 
            v-model="step5Data.outcome.metrics[key]" 
            class="form-control" 
            placeholder="Value" 
          />
          <button @click="removeMetric(key)" class="btn-icon" title="Remove metric">
            ✕
          </button>
        </div>
        <button @click="addMetric" class="btn-secondary">
          Add Metric
        </button>
      </div>

      <div class="button-row">
        <button @click="currentStepIndex = 3" class="btn-secondary">
          Back
        </button>
        <button 
          @click="processStep5" 
          :disabled="!isStep5Valid" 
          class="btn-primary"
        >
          Complete Wizard
        </button>
      </div>
    </div>

    <!-- Results View -->
    <div v-show="currentStepIndex === 5" class="wizard-step results-view">
      <h2>Wizard Complete</h2>
      
      <div v-if="fullResponse" class="result-container">
        <div class="result-tabs">
          <button 
            :class="['tab-button', { active: activeTab === 'deal' }]" 
            @click="activeTab = 'deal'"
          >
            Deal
          </button>
          <button 
            :class="['tab-button', { active: activeTab === 'program' }]" 
            @click="activeTab = 'program'"
          >
            Program
          </button>
          <button 
            :class="['tab-button', { active: activeTab === 'protocol' }]" 
            @click="activeTab = 'protocol'"
          >
            Protocol
          </button>
          <button 
            :class="['tab-button', { active: activeTab === 'json' }]" 
            @click="activeTab = 'json'"
          >
            JSON
          </button>
        </div>
        
        <div class="tab-content">
          <!-- Deal Tab -->
          <div v-if="activeTab === 'deal'" class="tab-pane">
            <h3>Deal Summary</h3>
            <div class="result-summary">
              <div class="summary-item">
                <strong>Problem:</strong> {{ fullResponse.deal.problem }}
              </div>
              <div class="summary-item">
                <strong>Category:</strong> {{ fullResponse.deal.category }}
                <span v-if="fullResponse.deal.sub_category">
                  / {{ fullResponse.deal.sub_category }}
                </span>
              </div>
              <div class="summary-item">
                <strong>Status:</strong> {{ fullResponse.deal.wizard_step }}
              </div>
              <div v-if="fullResponse.deal.outcome" class="summary-item">
                <strong>Outcome Verified:</strong> 
                {{ fullResponse.deal.outcome.verified ? 'Yes' : 'No' }}
              </div>
              <div v-if="fullResponse.deal.lessons_learned" class="summary-item">
                <strong>Lessons Learned:</strong> {{ fullResponse.deal.lessons_learned }}
              </div>
            </div>
          </div>
          
          <!-- Program Tab -->
          <div v-if="activeTab === 'program'" class="tab-pane">
            <h3>Program Details</h3>
            <div class="result-summary">
              <div class="summary-item">
                <strong>Name:</strong> {{ fullResponse.program.name }}
              </div>
              <div class="summary-item">
                <strong>Description:</strong> {{ fullResponse.program.description }}
              </div>
              <div class="summary-item">
                <strong>Team Size:</strong> {{ fullResponse.program.team.length }} members
              </div>
              <div class="summary-item">
                <strong>Status:</strong> {{ fullResponse.program.status }}
              </div>
              <div v-if="fullResponse.program.tags?.length" class="summary-item">
                <strong>Tags:</strong> {{ fullResponse.program.tags.join(', ') }}
              </div>
            </div>
          </div>
          
          <!-- Protocol Tab -->
          <div v-if="activeTab === 'protocol'" class="tab-pane">
            <h3>Protocol Information</h3>
            <div class="result-summary">
              <div class="summary-item">
                <strong>Name:</strong> {{ fullResponse.protocol.name }}
              </div>
              <div class="summary-item">
                <strong>Goal:</strong> {{ fullResponse.protocol.goal }}
              </div>
              <div class="summary-item">
                <strong>Problem:</strong> {{ fullResponse.protocol.problem }}
              </div>
              <div class="summary-item">
                <strong>Solution Context:</strong> {{ fullResponse.protocol.solution_context }}
              </div>
              <div class="summary-item">
                <strong>Version:</strong> {{ fullResponse.protocol.protocol_version }}
              </div>
              <div class="summary-item">
                <strong>Status:</strong> {{ fullResponse.protocol.status }}
              </div>
            </div>
            
            <h4>Chain Steps</h4>
            <div v-if="fullResponse.protocol.chain?.length" class="chain-steps">
              <div 
                v-for="(step, index) in fullResponse.protocol.chain" 
                :key="index"
                class="chain-step"
              >
                <div class="step-number">{{ index + 1 }}</div>
                <div class="step-content">
                  <h5>{{ step.name }}</h5>
                  <p>{{ step.description }}</p>
                  <div v-if="step.action" class="step-action">
                    <strong>Action:</strong> {{ step.action }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="no-data">
              No chain steps available
            </div>
          </div>
          
          <!-- JSON Tab -->
          <div v-if="activeTab === 'json'" class="tab-pane">
            <pre>{{ JSON.stringify(fullResponse, null, 2) }}</pre>
          </div>
        </div>
      </div>
      
      <div v-else class="loading-data">
        Loading result data...
      </div>

      <div class="button-row">
        <button @click="currentStepIndex = 4" class="btn-secondary">
          Back
        </button>
        <button @click="startNewWizard" class="btn-primary">
          Start New Wizard
        </button>
      </div>
    </div>

    <!-- Version History Sidebar -->
    <div 
      :class="['version-sidebar', { 'open': showVersionHistory }]"
      v-if="deal?.id"
    >
      <div class="sidebar-header">
        <h3>Version History</h3>
        <button @click="showVersionHistory = false" class="btn-icon">✕</button>
      </div>
      
      <div v-if="snapshots.length === 0" class="loading-data">
        Loading snapshots...
      </div>
      
      <div v-else class="snapshot-list">
        <div 
          v-for="snapshot in snapshots" 
          :key="snapshot.version"
          :class="['snapshot-item', { 'current': currentSnapshot === snapshot.version }]"
          @click="selectSnapshot(snapshot.version)"
        >
          <div class="snapshot-header">
            <span class="version-number">v{{ snapshot.version }}</span>
            <span class="snapshot-step">{{ snapshot.step }}</span>
          </div>
          <div class="snapshot-time">
            {{ formatDate(snapshot.created_at) }}
          </div>
          <div class="snapshot-comment">
            {{ snapshot.comment }}
          </div>
        </div>
      </div>
      
      <div class="sidebar-actions">
        <button 
          @click="createSnapshot" 
          :disabled="!deal?.id" 
          class="btn-secondary"
        >
          Create Snapshot
        </button>
        <button 
          v-if="currentSnapshot && currentSnapshot !== (deal?.version || 0)"
          @click="restoreSnapshot"
          class="btn-primary"
        >
          Restore to v{{ currentSnapshot }}
        </button>
      </div>
    </div>
    
    <button 
      @click="showVersionHistory = !showVersionHistory" 
      class="history-toggle-button"
      v-if="deal?.id"
    >
      {{ showVersionHistory ? 'Hide History' : 'Show History' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { 
  wizardApiClient, 
  wizardSteps,
  DealData, 
  ProgramData, 
  ProtocolData,
  WizardStep,
  StepResultData,
  DealSnapshotData,
  FeasibilityRating,
  PayoutStatus,
  SolutionOptionData,
  StakeholderData,
  ApiResponseData
} from '../api/wizard-api-client';

// Step definition
interface Step {
  name: string;
  key: string;
}

// Define the wizard steps
const steps: Step[] = [
  { name: 'Define Problem', key: 'define_problem' },
  { name: 'Codify Solution', key: 'codify_solution' },
  { name: 'Setup Program', key: 'setup_program' },
  { name: 'Execute Program', key: 'execute_program' },
  { name: 'Verify Outcome', key: 'verify_outcome' }
];

// State management
const currentStepIndex = ref(0);
const deal = ref<DealData | null>(null);
const processing = ref(false);
const processingMessage = ref('');
const processingProgress = ref(0);
const showVersionHistory = ref(false);
const snapshots = ref<DealSnapshotData[]>([]);
const currentSnapshot = ref<number | null>(null);
const fullResponse = ref<ApiResponseData | null>(null);
const activeTab = ref('deal');

// Step data
const step1Data = ref({
  problem: '',
  category: '',
  sub_category: '',
  metadata: {}
});

const step2Data = ref({
  solution_options: [] as SolutionOptionData[],
  selected_solution: 0,
  metadata: {}
});

const newSolution = ref({
  description: '',
  feasibility: FeasibilityRating.MEDIUM
});

const step3Data = ref({
  stakeholders: [] as StakeholderData[],
  program_name: '',
  program_description: '',
  team_members: [],
  metadata: {}
});

const step4Data = ref({
  execution_plan: {
    agents: [] as string[],
    tools: [] as string[],
    milestones: [] as string[]
  },
  timeline: '',
  resources: '',
  metadata: {}
});

const step5Data = ref({
  // Set from the running program's execution instance before Step 5:
  // the api grades at POST /wizard/deal/{deal}/verify/{execution}.
  execution_id: undefined as number | string | undefined,
  outcome: {
    verified: true,
    metrics: {}
  },
  payout_status: PayoutStatus.PENDING,
  lessons_learned: '',
  metadata: {}
});

// Computed properties for validation
const isStep1Valid = computed(() => {
  return !!step1Data.value.problem && !!step1Data.value.category;
});

const isStep2Valid = computed(() => {
  return step2Data.value.solution_options.length > 0;
});

const isStep3Valid = computed(() => {
  return (
    step3Data.value.stakeholders.length > 0 &&
    step3Data.value.stakeholders.every(s => !!s.name && !!s.role) &&
    !!step3Data.value.program_name &&
    !!step3Data.value.program_description
  );
});

const isStep4Valid = computed(() => {
  return (
    !!executionPlanText.value &&
    !!step4Data.value.timeline &&
    !!step4Data.value.resources
  );
});

const isStep5Valid = computed(() => {
  return (
    Object.keys(step5Data.value.outcome.metrics).length > 0 &&
    !!step5Data.value.lessons_learned
  );
});

// Execution plan text for easier editing
const executionPlanText = computed({
  get() {
    try {
      return JSON.stringify(step4Data.value.execution_plan, null, 2);
    } catch {
      return '{\n  "agents": [],\n  "tools": [],\n  "milestones": []\n}';
    }
  },
  set(value) {
    try {
      step4Data.value.execution_plan = JSON.parse(value);
    } catch {
      // Keep existing value if parsing fails
    }
  }
});

// Load deal and snapshots if a deal ID is available
watch(() => deal.value?.id, async (dealId) => {
  if (dealId) {
    await loadSnapshots(dealId);
  }
}, { immediate: true });

// Function to load snapshots for a deal
async function loadSnapshots(dealId: string) {
  try {
    const response = await wizardApiClient.getDealSnapshots(dealId);
    snapshots.value = response.data.data.sort((a, b) => b.version - a.version);
  } catch (error) {
    console.error('Error loading snapshots:', error);
  }
}

// Function to create a new snapshot
async function createSnapshot() {
  if (!deal.value?.id) return;
  
  try {
    processing.value = true;
    processingMessage.value = 'Creating snapshot...';
    
    const comment = prompt('Enter a comment for this snapshot:') || 'Manual snapshot';
    
    const response = await wizardApiClient.createDealSnapshot(deal.value.id, comment);
    
    if (response.data.success) {
      await loadSnapshots(deal.value.id);
    }
  } catch (error) {
    console.error('Error creating snapshot:', error);
  } finally {
    processing.value = false;
  }
}

// Function to select a snapshot
async function selectSnapshot(version: number) {
  currentSnapshot.value = version;
}

// Function to restore to a snapshot
async function restoreSnapshot() {
  if (!deal.value?.id || !currentSnapshot.value) return;
  
  try {
    processing.value = true;
    processingMessage.value = 'Restoring snapshot...';
    
    const response = await wizardApiClient.restoreDealSnapshot(
      deal.value.id,
      currentSnapshot.value
    );
    
    if (response.data.success) {
      deal.value = response.data.data;
      updateUIFromDeal();
      showVersionHistory.value = false;
    }
  } catch (error) {
    console.error('Error restoring snapshot:', error);
  } finally {
    processing.value = false;
  }
}

// Helper function to check if a step is completed
function isStepCompleted(index: number) {
  if (!deal.value) return false;
  
  const stepKey = steps[index].key;
  const currentStep = deal.value.wizard_step.toLowerCase();
  
  // Find the index of the current step
  const currentIndex = steps.findIndex(s => s.key === currentStep);
  
  // If the current step is after this step, then this step is completed
  return currentIndex > index;
}

// Function to navigate to a step if allowed
function canNavigateToStep(index: number) {
  if (index === 0) return true; // Can always go to first step
  return isStepCompleted(index - 1); // Can go to this step if previous is completed
}

// Function to navigate to a step
function navigateToStep(index: number) {
  if (canNavigateToStep(index)) {
    currentStepIndex.value = index;
  }
}

// Function to process Step 1: Define Problem
async function processStep1() {
  if (!isStep1Valid.value) return;
  
  try {
    processing.value = true;
    processingMessage.value = 'Processing problem definition...';
    processingProgress.value = 0;
    
    // If we have a deal, update it; otherwise start a new wizard
    if (deal.value?.id) {
      deal.value = await wizardSteps.defineProblems.process(
        deal.value.id,
        step1Data.value,
        progress => processingProgress.value = progress
      );
    } else {
      const response = await wizardApiClient.startWizard(step1Data.value);
      
      if (response.data.success) {
        const result = response.data.data;
        
        if (result.is_async && result.job_id) {
          // Handle async job
          const removeListener = wizardApiClient.addJobListener(
            result.job_id,
            jobStatus => processingProgress.value = jobStatus.progress
          );
          
          try {
            await wizardApiClient.pollJobStatus(result.job_id);
            const dealResponse = await wizardApiClient.getDeal(result.deal.id);
            deal.value = dealResponse.data.data;
          } finally {
            removeListener();
          }
        } else {
          deal.value = result.deal;
        }
      }
    }
    
    // Update step data
    updateUIFromDeal();
    
    // Move to the next step
    currentStepIndex.value = 1;
  } catch (error) {
    console.error('Error processing Step 1:', error);
    alert('An error occurred while processing your problem. Please try again.');
  } finally {
    processing.value = false;
  }
}

// Function to add a custom solution
function addCustomSolution() {
  if (!newSolution.value.description) return;
  
  step2Data.value.solution_options.push({
    description: newSolution.value.description,
    feasibility: newSolution.value.feasibility as FeasibilityRating
  });
  
  // Reset the form
  newSolution.value = {
    description: '',
    feasibility: FeasibilityRating.MEDIUM
  };
}

// Function to process Step 2: Codify Solution
async function processStep2() {
  if (!isStep2Valid.value || !deal.value?.id) return;
  
  try {
    processing.value = true;
    processingMessage.value = 'Processing solution options...';
    processingProgress.value = 0;
    
    deal.value = await wizardSteps.codifySolution.process(
      deal.value.id,
      step2Data.value,
      progress => processingProgress.value = progress
    );
    
    // Update step data
    updateUIFromDeal();
    
    // Move to the next step
    currentStepIndex.value = 2;
  } catch (error) {
    console.error('Error processing Step 2:', error);
    alert('An error occurred while processing your solution. Please try again.');
  } finally {
    processing.value = false;
  }
}

// Function to add a stakeholder
function addStakeholder() {
  step3Data.value.stakeholders.push({ name: '', role: '' });
}

// Function to remove a stakeholder
function removeStakeholder(index: number) {
  step3Data.value.stakeholders.splice(index, 1);
}

// Function to process Step 3: Setup Program
async function processStep3() {
  if (!isStep3Valid.value || !deal.value?.id) return;
  
  try {
    processing.value = true;
    processingMessage.value = 'Setting up program...';
    processingProgress.value = 0;
    
    deal.value = await wizardSteps.setupProgram.process(
      deal.value.id,
      step3Data.value,
      progress => processingProgress.value = progress
    );
    
    // Update step data
    updateUIFromDeal();
    
    // Move to the next step
    currentStepIndex.value = 3;
  } catch (error) {
    console.error('Error processing Step 3:', error);
    alert('An error occurred while setting up the program. Please try again.');
  } finally {
    processing.value = false;
  }
}

// Function to process Step 4: Execute Program
async function processStep4() {
  if (!isStep4Valid.value || !deal.value?.id) return;
  
  try {
    processing.value = true;
    processingMessage.value = 'Executing program...';
    processingProgress.value = 0;
    
    deal.value = await wizardSteps.executeProgram.process(
      deal.value.id,
      step4Data.value,
      progress => processingProgress.value = progress
    );
    
    // Update step data
    updateUIFromDeal();
    
    // Move to the next step
    currentStepIndex.value = 4;
  } catch (error) {
    console.error('Error processing Step 4:', error);
    alert('An error occurred while executing the program. Please try again.');
  } finally {
    processing.value = false;
  }
}

// Function to add a metric
function addMetric() {
  const key = `metric_${Object.keys(step5Data.value.outcome.metrics).length + 1}`;
  step5Data.value.outcome.metrics[key] = '';
}

// Function to update a metric key
function updateMetricKey(oldKey: string, event: Event) {
  const newKey = (event.target as HTMLInputElement).value;
  if (newKey && newKey !== oldKey) {
    const value = step5Data.value.outcome.metrics[oldKey];
    delete step5Data.value.outcome.metrics[oldKey];
    step5Data.value.outcome.metrics[newKey] = value;
  }
}

// Function to remove a metric
function removeMetric(key: string) {
  delete step5Data.value.outcome.metrics[key];
}

// Function to process Step 5: Verify Outcome
async function processStep5() {
  if (!isStep5Valid.value || !deal.value?.id) return;
  
  try {
    processing.value = true;
    processingMessage.value = 'Verifying outcome...';
    processingProgress.value = 0;
    
    deal.value = await wizardSteps.verifyOutcome.process(
      deal.value.id,
      step5Data.value,
      progress => processingProgress.value = progress
    );
    
    // Load the full response
    await loadFullResponse();
    
    // Move to the results view
    currentStepIndex.value = 5;
  } catch (error) {
    console.error('Error processing Step 5:', error);
    alert('An error occurred while verifying the outcome. Please try again.');
  } finally {
    processing.value = false;
  }
}

// Function to load the full response
async function loadFullResponse() {
  if (!deal.value?.id) return;
  
  try {
    const response = await wizardApiClient.getWizardResponse(deal.value.id);
    
    if (response.data.success) {
      fullResponse.value = response.data.data;
    }
  } catch (error) {
    console.error('Error loading full response:', error);
  }
}

// Function to update UI from deal data
function updateUIFromDeal() {
  if (!deal.value) return;
  
  // Update Step 1 data
  step1Data.value.problem = deal.value.problem || '';
  step1Data.value.category = deal.value.category || '';
  step1Data.value.sub_category = deal.value.sub_category || '';
  
  // Update Step 2 data
  if (deal.value.solution_options) {
    step2Data.value.solution_options = [...deal.value.solution_options];
  }
  
  // Update Step 3 data
  if (deal.value.stakeholders) {
    step3Data.value.stakeholders = [...deal.value.stakeholders];
  }
  
  // Update Step 4 data
  if (deal.value.execution_plan) {
    step4Data.value.execution_plan = { ...deal.value.execution_plan };
  }
  
  // Update Step 5 data
  if (deal.value.outcome) {
    step5Data.value.outcome = { ...deal.value.outcome };
  }
  
  if (deal.value.payout_status) {
    step5Data.value.payout_status = deal.value.payout_status as PayoutStatus;
  }
  
  if (deal.value.lessons_learned) {
    step5Data.value.lessons_learned = deal.value.lessons_learned;
  }
}

// Function to start a new wizard
function startNewWizard() {
  deal.value = null;
  fullResponse.value = null;
  currentStepIndex.value = 0;
  snapshots.value = [];
  currentSnapshot.value = null;
  
  // Reset all step data
  step1Data.value = {
    problem: '',
    category: '',
    sub_category: '',
    metadata: {}
  };
  
  step2Data.value = {
    solution_options: [],
    selected_solution: 0,
    metadata: {}
  };
  
  step3Data.value = {
    stakeholders: [],
    program_name: '',
    program_description: '',
    team_members: [],
    metadata: {}
  };
  
  step4Data.value = {
    execution_plan: {
      agents: [],
      tools: [],
      milestones: []
    },
    timeline: '',
    resources: '',
    metadata: {}
  };
  
  step5Data.value = {
    outcome: {
      verified: true,
      metrics: {}
    },
    payout_status: PayoutStatus.PENDING,
    lessons_learned: '',
    metadata: {}
  };
}

// Helper function to format dates
function formatDate(dateString?: string): string {
  if (!dateString) return 'Unknown';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  } catch {
    return dateString;
  }
}
</script>

<style scoped>
/* Wizard Container */
.wizard-container {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Wizard Header */
.wizard-header {
  margin-bottom: 30px;
  text-align: center;
}

.wizard-header h1 {
  margin-bottom: 20px;
  color: #3b82f6;
}

/* Step Indicators */
.step-indicators {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: 0 auto 40px;
}

.step-indicators::before {
  content: '';
  position: absolute;
  top: 24px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #e5e7eb;
  z-index: 1;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  cursor: pointer;
}

.step-indicator.active .step-number {
  background-color: #3b82f6;
  color: white;
}

.step-indicator.completed .step-number {
  background-color: #10b981;
  color: white;
}

.step-number {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.step-name {
  font-size: 0.875rem;
  color: #374151;
}

/* Wizard Step */
.wizard-step {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.wizard-step h2 {
  margin-bottom: 24px;
  color: #1f2937;
}

/* Form Elements */
.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #4b5563;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #3b82f6;
  outline: none;
}

.button-row {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

/* Buttons */
.btn-primary, .btn-secondary {
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-primary:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #4b5563;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

.btn-icon {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 1rem;
  padding: 5px;
}

.btn-icon:hover {
  color: #ef4444;
}

/* Solution Options */
.proposed-solutions {
  margin-bottom: 24px;
}

.proposed-solutions h3 {
  margin-bottom: 12px;
  font-size: 1.125rem;
  color: #4b5563;
}

.solution-option {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.solution-option:hover {
  border-color: #93c5fd;
}

.solution-option.selected {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.solution-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.solution-number {
  font-weight: 600;
  color: #1f2937;
}

.feasibility-badge {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 9999px;
  text-transform: uppercase;
  font-weight: 600;
}

.feasibility-badge.high {
  background-color: #d1fae5;
  color: #065f46;
}

.feasibility-badge.medium {
  background-color: #fef3c7;
  color: #92400e;
}

.feasibility-badge.low {
  background-color: #fee2e2;
  color: #b91c1c;
}

.feasibility-badge.unknown {
  background-color: #e5e7eb;
  color: #4b5563;
}

.custom-solution-input {
  display: flex;
  gap: 10px;
}

/* Stakeholders */
.stakeholder-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.stakeholder-inputs {
  display: flex;
  flex: 1;
  gap: 10px;
}

/* Radio Group */
.radio-group {
  display: flex;
  gap: 20px;
}

.radio-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-item input {
  margin-right: 8px;
}

/* Metrics Form */
.metrics-form {
  margin-top: 24px;
}

.metrics-form h3 {
  margin-bottom: 12px;
  font-size: 1.125rem;
  color: #4b5563;
}

.metric-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

/* Loading and Processing States */
.processing-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.processing-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.progress-bar {
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  margin: 16px 0 8px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #3b82f6;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  color: #6b7280;
}

.loading-data {
  text-align: center;
  padding: 20px;
  color: #6b7280;
}

/* Results View */
.results-view {
  padding-bottom: 40px;
}

.result-container {
  margin-top: 30px;
}

.result-tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 20px;
}

.tab-button {
  padding: 10px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.result-summary {
  margin-bottom: 30px;
}

.summary-item {
  margin-bottom: 10px;
  line-height: 1.5;
}

.summary-item strong {
  font-weight: 600;
  color: #4b5563;
}

.chain-steps {
  margin-top: 20px;
}

.chain-step {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.chain-step:last-child {
  border-bottom: none;
}

.step-number {
  background-color: #3b82f6;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content h5 {
  margin: 0 0 8px;
  font-size: 1rem;
  color: #1f2937;
}

.step-action {
  margin-top: 8px;
  font-size: 0.875rem;
  color: #6b7280;
}

.no-data {
  padding: 20px;
  text-align: center;
  color: #6b7280;
  font-style: italic;
}

/* JSON Formatting */
pre {
  background-color: #f9fafb;
  padding: 16px;
  border-radius: 6px;
  overflow: auto;
  font-family: monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  max-height: 400px;
}

/* Version History Sidebar */
.version-sidebar {
  position: fixed;
  top: 0;
  right: -350px;
  width: 350px;
  height: 100vh;
  background-color: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 900;
  display: flex;
  flex-direction: column;
}

.version-sidebar.open {
  right: 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.sidebar-header h3 {
  margin: 0;
  color: #1f2937;
}

.snapshot-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.snapshot-item {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.snapshot-item:hover {
  border-color: #93c5fd;
  background-color: #f9fafb;
}

.snapshot-item.current {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.snapshot-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.version-number {
  font-weight: 600;
  color: #1f2937;
}

.snapshot-step {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 9999px;
  background-color: #e5e7eb;
  color: #4b5563;
}

.snapshot-time {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 8px;
}

.snapshot-comment {
  font-size: 0.875rem;
  color: #4b5563;
}

.sidebar-actions {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.history-toggle-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-weight: 500;
  cursor: pointer;
  z-index: 800;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .wizard-container {
    padding: 10px;
  }
  
  .step-indicators {
    overflow-x: auto;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  
  .step-indicator {
    flex: 0 0 auto;
    margin: 0 10px;
  }
  
  .wizard-step {
    padding: 20px 15px;
  }
  
  .button-row {
    flex-direction: column;
    gap: 10px;
  }
  
  .button-row button {
    width: 100%;
  }
  
  .custom-solution-input {
    flex-direction: column;
  }
  
  .stakeholder-inputs {
    flex-direction: column;
  }
  
  .metric-item {
    flex-direction: column;
  }
  
  .version-sidebar {
    width: 300px;
  }
}
</style>