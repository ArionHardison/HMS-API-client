<template>
  <div class="healthcare-wizard">
    <div class="wizard-header healthcare">
      <h1>
        <span class="icon">🏥</span>
        Healthcare Initiative Wizard
      </h1>
      <p class="subtitle">Plan and execute impactful healthcare programs with AI assistance</p>
    </div>
    
    <!-- Wizard Component Using BEM Naming -->
    <div class="healthcare-wizard__container">
      <!-- Step 1: Define Problem (Healthcare-focused) -->
      <div v-if="currentStep === 1" class="healthcare-wizard__step">
        <h2>Step 1: Define Healthcare Challenge</h2>
        
        <div class="healthcare-wizard__form-group">
          <label for="healthcare-problem">What healthcare challenge are you addressing?</label>
          <textarea 
            id="healthcare-problem"
            v-model="step1.problem"
            class="healthcare-wizard__textarea"
            placeholder="E.g., High readmission rates for patients with chronic conditions"
            rows="4"
          ></textarea>
        </div>
        
        <div class="healthcare-wizard__form-row">
          <div class="healthcare-wizard__form-group">
            <label for="healthcare-category">Healthcare Domain</label>
            <select 
              id="healthcare-category"
              v-model="step1.category"
              class="healthcare-wizard__select"
            >
              <option value="">Select a domain</option>
              <option value="patient-care">Patient Care</option>
              <option value="healthcare-access">Healthcare Access</option>
              <option value="chronic-disease">Chronic Disease Management</option>
              <option value="mental-health">Mental Health</option>
              <option value="preventive-care">Preventive Care</option>
              <option value="public-health">Public Health</option>
              <option value="healthcare-administration">Healthcare Administration</option>
            </select>
          </div>
          
          <div class="healthcare-wizard__form-group">
            <label for="healthcare-subcategory">Specific Focus Area</label>
            <select 
              id="healthcare-subcategory"
              v-model="step1.sub_category"
              class="healthcare-wizard__select"
            >
              <option value="">Select focus area</option>
              <option v-if="step1.category === 'patient-care'" value="inpatient">Inpatient Care</option>
              <option v-if="step1.category === 'patient-care'" value="outpatient">Outpatient Care</option>
              <option v-if="step1.category === 'patient-care'" value="emergency">Emergency Care</option>
              <option v-if="step1.category === 'patient-care'" value="remote">Remote Patient Monitoring</option>
              
              <option v-if="step1.category === 'healthcare-access'" value="rural">Rural Healthcare</option>
              <option v-if="step1.category === 'healthcare-access'" value="underserved">Underserved Communities</option>
              <option v-if="step1.category === 'healthcare-access'" value="telehealth">Telehealth</option>
              
              <option v-if="step1.category === 'chronic-disease'" value="diabetes">Diabetes</option>
              <option v-if="step1.category === 'chronic-disease'" value="cardiovascular">Cardiovascular Disease</option>
              <option v-if="step1.category === 'chronic-disease'" value="respiratory">Respiratory Conditions</option>
              <option v-if="step1.category === 'chronic-disease'" value="autoimmune">Autoimmune Disorders</option>
              
              <option v-if="step1.category === 'mental-health'" value="depression">Depression & Anxiety</option>
              <option v-if="step1.category === 'mental-health'" value="substance">Substance Use Disorders</option>
              <option v-if="step1.category === 'mental-health'" value="community">Community Mental Health</option>
              
              <option v-if="step1.category === 'preventive-care'" value="screening">Screening Programs</option>
              <option v-if="step1.category === 'preventive-care'" value="immunization">Immunization</option>
              <option v-if="step1.category === 'preventive-care'" value="wellness">Wellness Programs</option>
              
              <option v-if="step1.category === 'public-health'" value="epidemiology">Disease Surveillance</option>
              <option v-if="step1.category === 'public-health'" value="disaster">Emergency Preparedness</option>
              <option v-if="step1.category === 'public-health'" value="health-policy">Health Policy</option>
              
              <option v-if="step1.category === 'healthcare-administration'" value="ehr">Electronic Health Records</option>
              <option v-if="step1.category === 'healthcare-administration'" value="billing">Medical Billing</option>
              <option v-if="step1.category === 'healthcare-administration'" value="quality">Quality Improvement</option>
            </select>
          </div>
        </div>
        
        <div class="healthcare-wizard__form-group">
          <label for="healthcare-population">Target Population</label>
          <input 
            id="healthcare-population"
            v-model="step1.metadata.target_population"
            class="healthcare-wizard__input"
            placeholder="E.g., Elderly patients with multiple chronic conditions"
          />
        </div>
        
        <div class="healthcare-wizard__form-group">
          <label for="healthcare-goals">Key Objectives (one per line)</label>
          <textarea 
            id="healthcare-goals"
            v-model="step1.metadata.objectives"
            class="healthcare-wizard__textarea"
            placeholder="E.g., 
- Reduce 30-day readmission rates by 25%
- Improve medication adherence
- Enhance patient education"
            rows="3"
          ></textarea>
        </div>
        
        <div class="healthcare-wizard__metrics">
          <h3>Suggested Healthcare Metrics</h3>
          <div class="healthcare-wizard__metrics-list">
            <div 
              v-for="(metric, index) in suggestedMetrics" 
              :key="index" 
              class="healthcare-wizard__metric-item"
            >
              <label class="healthcare-wizard__checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="metric.selected"
                  class="healthcare-wizard__checkbox"
                />
                <span>{{ metric.name }}</span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="healthcare-wizard__button-row">
          <button 
            @click="processStep1"
            :disabled="!isStep1Valid"
            class="healthcare-wizard__button healthcare-wizard__button--primary"
          >
            Analyze Healthcare Challenge
          </button>
        </div>
      </div>
      
      <!-- Step 2: Codify Solution (Healthcare-focused) -->
      <div v-if="currentStep === 2" class="healthcare-wizard__step">
        <h2>Step 2: Healthcare Solution Approach</h2>
        
        <div v-if="deal?.solution_options?.length" class="healthcare-wizard__solutions">
          <div class="healthcare-wizard__evidence-note">
            <div class="healthcare-wizard__evidence-icon">🔍</div>
            <p>The following approaches have been generated based on evidence-based practices and healthcare literature review.</p>
          </div>
          
          <div 
            v-for="(solution, index) in deal.solution_options" 
            :key="index"
            :class="['healthcare-wizard__solution-card', { 'selected': step2.selected_solution === index }]"
            @click="step2.selected_solution = index"
          >
            <div class="healthcare-wizard__solution-header">
              <div class="healthcare-wizard__solution-title">Approach {{ index + 1 }}</div>
              <div :class="['healthcare-wizard__badge', solution.feasibility.toLowerCase()]">
                {{ solution.feasibility }} Feasibility
              </div>
            </div>
            <p class="healthcare-wizard__solution-description">{{ solution.description }}</p>
            <div v-if="solutionMetadata[index]" class="healthcare-wizard__solution-metadata">
              <div class="healthcare-wizard__evidence-level">
                <strong>Evidence Level:</strong> {{ solutionMetadata[index].evidence_level }}
              </div>
              <div class="healthcare-wizard__timeframe">
                <strong>Implementation Timeframe:</strong> {{ solutionMetadata[index].timeframe }}
              </div>
              <div class="healthcare-wizard__resource-intensity">
                <strong>Resource Intensity:</strong> {{ solutionMetadata[index].resource_intensity }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="healthcare-wizard__form-group">
          <label for="healthcare-custom-solution">Propose Alternative Approach</label>
          <textarea 
            id="healthcare-custom-solution"
            v-model="customSolution.description"
            class="healthcare-wizard__textarea"
            placeholder="Describe your alternative healthcare solution approach..."
            rows="3"
          ></textarea>
          <div class="healthcare-wizard__form-row healthcare-wizard__custom-solution-controls">
            <select 
              v-model="customSolution.feasibility"
              class="healthcare-wizard__select"
            >
              <option value="HIGH">High Feasibility</option>
              <option value="MEDIUM">Medium Feasibility</option>
              <option value="LOW">Low Feasibility</option>
              <option value="UNKNOWN">Unknown Feasibility</option>
            </select>
            <button 
              @click="addCustomSolution"
              :disabled="!customSolution.description"
              class="healthcare-wizard__button healthcare-wizard__button--secondary"
            >
              Add Alternative Approach
            </button>
          </div>
        </div>
        
        <div class="healthcare-wizard__button-row">
          <button 
            @click="currentStep = 1"
            class="healthcare-wizard__button healthcare-wizard__button--outline"
          >
            Back
          </button>
          <button 
            @click="processStep2"
            :disabled="!isStep2Valid"
            class="healthcare-wizard__button healthcare-wizard__button--primary"
          >
            Develop Healthcare Program
          </button>
        </div>
      </div>
      
      <!-- Step 3: Setup Program (Healthcare-focused) -->
      <div v-if="currentStep === 3" class="healthcare-wizard__step">
        <h2>Step 3: Healthcare Program Design</h2>
        
        <div class="healthcare-wizard__form-group">
          <label for="healthcare-program-name">Program Name</label>
          <input 
            id="healthcare-program-name"
            v-model="step3.program_name"
            class="healthcare-wizard__input"
            placeholder="E.g., Chronic Care Transition Support Initiative"
          />
        </div>
        
        <div class="healthcare-wizard__form-group">
          <label for="healthcare-program-description">Program Description</label>
          <textarea 
            id="healthcare-program-description"
            v-model="step3.program_description"
            class="healthcare-wizard__textarea"
            placeholder="Describe your healthcare program..."
            rows="3"
          ></textarea>
        </div>
        
        <div class="healthcare-wizard__section">
          <h3>Healthcare Stakeholders</h3>
          <div class="healthcare-wizard__stakeholders">
            <div 
              v-for="(stakeholder, index) in step3.stakeholders" 
              :key="index"
              class="healthcare-wizard__stakeholder-item"
            >
              <div class="healthcare-wizard__stakeholder-inputs">
                <input 
                  v-model="stakeholder.name"
                  class="healthcare-wizard__input"
                  placeholder="Stakeholder name or role"
                />
                <select 
                  v-model="stakeholder.role"
                  class="healthcare-wizard__select"
                >
                  <option value="">Select role type</option>
                  <option value="healthcare-provider">Healthcare Provider</option>
                  <option value="patient">Patient/Patient Group</option>
                  <option value="payer">Insurance/Payer</option>
                  <option value="government">Government/Regulatory</option>
                  <option value="community">Community Organization</option>
                  <option value="technology">Technology Partner</option>
                  <option value="academic">Academic/Research</option>
                  <option value="other">Other</option>
                </select>
                <div class="healthcare-wizard__engagement-slider">
                  <label>Engagement: {{ stakeholder.engagement_level || 5 }}</label>
                  <input 
                    type="range" 
                    v-model.number="stakeholder.engagement_level" 
                    min="1" 
                    max="10"
                    class="healthcare-wizard__slider"
                  />
                </div>
              </div>
              <button 
                @click="removeStakeholder(index)"
                class="healthcare-wizard__button healthcare-wizard__button--icon"
                title="Remove stakeholder"
              >
                ✕
              </button>
            </div>
            <button 
              @click="addStakeholder"
              class="healthcare-wizard__button healthcare-wizard__button--secondary"
            >
              Add Healthcare Stakeholder
            </button>
          </div>
        </div>
        
        <div class="healthcare-wizard__section">
          <h3>Healthcare Team Expertise</h3>
          <div class="healthcare-wizard__expertise-items">
            <div 
              v-for="(expertise, index) in step3.expertise" 
              :key="index"
              class="healthcare-wizard__expertise-item"
            >
              <div class="healthcare-wizard__expertise-inputs">
                <select 
                  v-model="expertise.stakeholder"
                  class="healthcare-wizard__select"
                  title="Select stakeholder providing this expertise"
                >
                  <option value="">Select stakeholder</option>
                  <option 
                    v-for="stakeholder in step3.stakeholders" 
                    :key="stakeholder.name"
                    :value="stakeholder.name"
                  >
                    {{ stakeholder.name }}
                  </option>
                </select>
                <input 
                  v-model="expertise.domain"
                  class="healthcare-wizard__input"
                  placeholder="Expertise domain (e.g., Diabetes Management)"
                />
              </div>
              <textarea 
                v-model="expertiseResponsibilities[index]"
                class="healthcare-wizard__textarea healthcare-wizard__textarea--small"
                placeholder="Key responsibilities (one per line)"
                rows="2"
                @input="updateResponsibilities(index)"
              ></textarea>
              <button 
                @click="removeExpertise(index)"
                class="healthcare-wizard__button healthcare-wizard__button--icon"
                title="Remove expertise"
              >
                ✕
              </button>
            </div>
            <button 
              @click="addExpertise"
              class="healthcare-wizard__button healthcare-wizard__button--secondary"
            >
              Add Required Expertise
            </button>
          </div>
        </div>
        
        <div class="healthcare-wizard__button-row">
          <button 
            @click="currentStep = 2"
            class="healthcare-wizard__button healthcare-wizard__button--outline"
          >
            Back
          </button>
          <button 
            @click="processStep3"
            :disabled="!isStep3Valid"
            class="healthcare-wizard__button healthcare-wizard__button--primary"
          >
            Plan Implementation
          </button>
        </div>
      </div>
      
      <!-- Step 4: Execute Program (Healthcare-focused) -->
      <div v-if="currentStep === 4" class="healthcare-wizard__step">
        <h2>Step 4: Healthcare Implementation Plan</h2>
        
        <div class="healthcare-wizard__section">
          <h3>Implementation Timeline</h3>
          <div class="healthcare-wizard__timeline">
            <div class="healthcare-wizard__phases">
              <div 
                v-for="(phase, index) in implementationPhases" 
                :key="index"
                class="healthcare-wizard__phase"
              >
                <div class="healthcare-wizard__phase-header">
                  <span class="healthcare-wizard__phase-label">Phase {{ index + 1 }}</span>
                  <span class="healthcare-wizard__phase-duration">{{ phase.duration }}</span>
                </div>
                <input 
                  v-model="phase.name"
                  class="healthcare-wizard__input"
                  placeholder="Phase name"
                />
                <textarea 
                  v-model="phase.description"
                  class="healthcare-wizard__textarea healthcare-wizard__textarea--small"
                  placeholder="Phase activities"
                  rows="2"
                ></textarea>
              </div>
              <button 
                @click="addImplementationPhase"
                class="healthcare-wizard__button healthcare-wizard__button--secondary"
              >
                Add Phase
              </button>
            </div>
          </div>
        </div>
        
        <div class="healthcare-wizard__section">
          <h3>Healthcare Tools & Resources</h3>
          <div class="healthcare-wizard__form-group">
            <label for="healthcare-tools">Tools Required (one per line)</label>
            <textarea 
              id="healthcare-tools"
              v-model="toolsText"
              class="healthcare-wizard__textarea"
              placeholder="E.g.,
- Electronic Health Record system
- Remote patient monitoring devices
- Patient education materials
- Telehealth platform"
              rows="4"
              @input="updateTools"
            ></textarea>
          </div>
        </div>
        
        <div class="healthcare-wizard__section">
          <h3>Healthcare Milestones</h3>
          <div class="healthcare-wizard__milestones">
            <div 
              v-for="(milestone, index) in milestonesArray" 
              :key="index"
              class="healthcare-wizard__milestone-item"
            >
              <div class="healthcare-wizard__milestone-content">
                <input 
                  v-model="milestone.name"
                  class="healthcare-wizard__input"
                  placeholder="Milestone name"
                />
                <div class="healthcare-wizard__milestone-meta">
                  <input 
                    type="date"
                    v-model="milestone.date"
                    class="healthcare-wizard__date"
                  />
                  <select 
                    v-model="milestone.priority"
                    class="healthcare-wizard__select healthcare-wizard__select--small"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>
              <button 
                @click="removeMilestone(index)"
                class="healthcare-wizard__button healthcare-wizard__button--icon"
                title="Remove milestone"
              >
                ✕
              </button>
            </div>
            <button 
              @click="addMilestone"
              class="healthcare-wizard__button healthcare-wizard__button--secondary"
            >
              Add Milestone
            </button>
          </div>
        </div>
        
        <div class="healthcare-wizard__button-row">
          <button 
            @click="currentStep = 3"
            class="healthcare-wizard__button healthcare-wizard__button--outline"
          >
            Back
          </button>
          <button 
            @click="processStep4"
            :disabled="!isStep4Valid"
            class="healthcare-wizard__button healthcare-wizard__button--primary"
          >
            Verify Outcomes
          </button>
        </div>
      </div>
      
      <!-- Step 5: Verify Outcome (Healthcare-focused) -->
      <div v-if="currentStep === 5" class="healthcare-wizard__step">
        <h2>Step 5: Healthcare Outcomes Verification</h2>
        
        <div class="healthcare-wizard__section">
          <div class="healthcare-wizard__form-group">
            <label>Were the healthcare objectives achieved?</label>
            <div class="healthcare-wizard__radio-group">
              <label class="healthcare-wizard__radio">
                <input 
                  type="radio"
                  v-model="step5.outcome.verified"
                  :value="true"
                  name="outcome_verified"
                />
                <span>Yes, objectives were achieved</span>
              </label>
              <label class="healthcare-wizard__radio">
                <input 
                  type="radio"
                  v-model="step5.outcome.verified"
                  :value="false"
                  name="outcome_verified"
                />
                <span>No, objectives were not achieved</span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="healthcare-wizard__section">
          <h3>Healthcare Metrics & Outcomes</h3>
          <div class="healthcare-wizard__metrics-results">
            <div 
              v-for="(value, key) in step5.outcome.metrics" 
              :key="key"
              class="healthcare-wizard__metric-result"
            >
              <div class="healthcare-wizard__metric-inputs">
                <input 
                  :value="key"
                  @input="updateMetricKey(key, $event)"
                  class="healthcare-wizard__input"
                  placeholder="Metric name (e.g., Readmission Rate)"
                />
                <input 
                  v-model="step5.outcome.metrics[key]"
                  class="healthcare-wizard__input"
                  placeholder="Value (e.g., 15% reduction)"
                />
              </div>
              <button 
                @click="removeMetric(key)"
                class="healthcare-wizard__button healthcare-wizard__button--icon"
                title="Remove metric"
              >
                ✕
              </button>
            </div>
            <button 
              @click="addMetric"
              class="healthcare-wizard__button healthcare-wizard__button--secondary"
            >
              Add Healthcare Metric
            </button>
          </div>
        </div>
        
        <div class="healthcare-wizard__section">
          <h3>Clinical Impact Assessment</h3>
          <div class="healthcare-wizard__form-group">
            <label for="clinical-impact">Describe the clinical impact of the program</label>
            <textarea 
              id="clinical-impact"
              v-model="step5.metadata.clinical_impact"
              class="healthcare-wizard__textarea"
              placeholder="E.g., The program demonstrated significant improvements in medication adherence and reduced emergency department visits for patients with chronic conditions."
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div class="healthcare-wizard__section">
          <h3>Patient Outcome Assessment</h3>
          <div class="healthcare-wizard__form-group">
            <label for="patient-outcomes">Describe patient outcomes and experience</label>
            <textarea 
              id="patient-outcomes"
              v-model="step5.metadata.patient_outcomes"
              class="healthcare-wizard__textarea"
              placeholder="E.g., Patient satisfaction scores increased by 35%, with particularly positive feedback about the telehealth components and personalized education materials."
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div class="healthcare-wizard__form-group">
          <label for="healthcare-lessons-learned">Lessons Learned & Best Practices</label>
          <textarea 
            id="healthcare-lessons-learned"
            v-model="step5.lessons_learned"
            class="healthcare-wizard__textarea"
            placeholder="Document key insights, challenges overcome, and recommendations for future healthcare initiatives..."
            rows="4"
          ></textarea>
        </div>
        
        <div class="healthcare-wizard__button-row">
          <button 
            @click="currentStep = 4"
            class="healthcare-wizard__button healthcare-wizard__button--outline"
          >
            Back
          </button>
          <button 
            @click="processStep5"
            :disabled="!isStep5Valid"
            class="healthcare-wizard__button healthcare-wizard__button--primary"
          >
            Complete Healthcare Initiative
          </button>
        </div>
      </div>
      
      <!-- Results View -->
      <div v-if="currentStep === 6" class="healthcare-wizard__results">
        <div class="healthcare-wizard__success-banner">
          <div class="healthcare-wizard__success-icon">✓</div>
          <h2>Healthcare Initiative Successfully Completed</h2>
          <p>Your healthcare program has been defined, implemented, and evaluated.</p>
        </div>
        
        <div v-if="fullResponse" class="healthcare-wizard__results-summary">
          <div class="healthcare-wizard__tabs">
            <button 
              v-for="tab in resultTabs" 
              :key="tab.id"
              :class="['healthcare-wizard__tab', { active: activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>
          
          <div class="healthcare-wizard__tab-content">
            <!-- Summary Tab -->
            <div v-if="activeTab === 'summary'" class="healthcare-wizard__summary">
              <div class="healthcare-wizard__summary-card">
                <h3>Healthcare Initiative Overview</h3>
                <div class="healthcare-wizard__summary-item">
                  <strong>Challenge:</strong> {{ fullResponse.deal.problem }}
                </div>
                <div class="healthcare-wizard__summary-item">
                  <strong>Domain:</strong> {{ formatCategory(fullResponse.deal.category) }}
                  <span v-if="fullResponse.deal.sub_category">
                    / {{ formatSubcategory(fullResponse.deal.sub_category) }}
                  </span>
                </div>
                <div class="healthcare-wizard__summary-item">
                  <strong>Approach:</strong> {{ selectedSolutionDescription }}
                </div>
                <div class="healthcare-wizard__summary-item">
                  <strong>Program Name:</strong> {{ fullResponse.program.name }}
                </div>
                <div class="healthcare-wizard__summary-item">
                  <strong>Outcome Status:</strong>
                  <span :class="['healthcare-wizard__status', fullResponse.deal.outcome?.verified ? 'success' : 'warning']">
                    {{ fullResponse.deal.outcome?.verified ? 'Objectives Achieved' : 'Objectives Not Fully Met' }}
                  </span>
                </div>
              </div>
              
              <div class="healthcare-wizard__metrics-summary">
                <h3>Key Healthcare Metrics</h3>
                <div class="healthcare-wizard__metrics-grid">
                  <div 
                    v-for="(value, key) in fullResponse.deal.outcome?.metrics" 
                    :key="key"
                    class="healthcare-wizard__metric-card"
                  >
                    <div class="healthcare-wizard__metric-value">{{ value }}</div>
                    <div class="healthcare-wizard__metric-name">{{ key }}</div>
                  </div>
                </div>
              </div>
              
              <div class="healthcare-wizard__lessons-card">
                <h3>Lessons Learned</h3>
                <p>{{ fullResponse.deal.lessons_learned }}</p>
              </div>
            </div>
            
            <!-- Details Tabs (Deal, Program, Protocol) -->
            <div v-if="activeTab === 'deal'" class="healthcare-wizard__details">
              <pre>{{ JSON.stringify(fullResponse.deal, null, 2) }}</pre>
            </div>
            
            <div v-if="activeTab === 'program'" class="healthcare-wizard__details">
              <pre>{{ JSON.stringify(fullResponse.program, null, 2) }}</pre>
            </div>
            
            <div v-if="activeTab === 'protocol'" class="healthcare-wizard__details">
              <pre>{{ JSON.stringify(fullResponse.protocol, null, 2) }}</pre>
            </div>
            
            <!-- Healthcare-specific data visualization -->
            <div v-if="activeTab === 'visualization'" class="healthcare-wizard__visualization">
              <div class="healthcare-wizard__data-visualization">
                <h3>Visualized Outcomes</h3>
                <p>Data visualization would be implemented here with charts showing metrics and outcomes.</p>
                <div class="healthcare-wizard__placeholder-chart">
                  <div class="healthcare-wizard__chart-title">Patient Outcome Improvements</div>
                  <div class="healthcare-wizard__chart-placeholder"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="healthcare-wizard__button-row healthcare-wizard__final-actions">
          <button 
            @click="downloadResults"
            class="healthcare-wizard__button healthcare-wizard__button--secondary"
          >
            Download Report
          </button>
          <button 
            @click="startNewHealthcareWizard"
            class="healthcare-wizard__button healthcare-wizard__button--primary"
          >
            Start New Healthcare Initiative
          </button>
        </div>
      </div>
      
      <!-- Processing Overlay -->
      <div v-if="processing" class="healthcare-wizard__overlay">
        <div class="healthcare-wizard__processing">
          <div class="healthcare-wizard__spinner"></div>
          <h3>{{ processingMessage }}</h3>
          <div v-if="processingProgress > 0" class="healthcare-wizard__progress">
            <div class="healthcare-wizard__progress-bar" :style="{ width: `${processingProgress}%` }"></div>
          </div>
          <div v-if="processingProgress > 0" class="healthcare-wizard__progress-text">
            {{ Math.round(processingProgress) }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { 
  wizardApiClient, 
  wizardSteps,
  DealData, 
  FeasibilityRating,
  PayoutStatus,
  SolutionOptionData,
  StakeholderData,
  ExpertiseData 
} from '../../api/wizard-api-client';
import { useWizardStore } from '../../stores/wizard';
import { useNotificationStore } from '../../stores/notifications';
import { useAuth } from '../../stores/auth';
import { useForm } from '../../composables/useForm';
import { useApi } from '../../composables/useApi';
import { useLocalStorage } from '../../composables';

// Store management
const wizardStore = useWizardStore();
const notificationStore = useNotificationStore();
const authStore = useAuthStore();

// Destructure store state
const {
  currentDeal: deal,
  currentStep,
  isProcessing: processing,
  processingMessage,
  progress: processingProgress,
  isCurrentStepValid,
  canSubmit: canProceed
} = storeToRefs(wizardStore);

// Local state
const fullResponse = ref<any>(null);
const activeTab = ref('summary');

// Persistent state for draft saving
const {
  state: draftData,
  update: updateDraft,
  clear: clearDraft
} = useLocalStorage('healthcare-wizard-draft', {
  step1: {},
  step2: {},
  step3: {},
  step4: {},
  step5: {},
  lastSaved: null
});

// Auto-save functionality
const autoSaveEnabled = ref(true);
let autoSaveInterval: NodeJS.Timeout | null = null;

// Healthcare-specific data
const suggestedMetrics = ref([
  { name: 'Readmission Rate', selected: true },
  { name: 'Quality of Life Score', selected: true },
  { name: 'Medication Adherence', selected: true },
  { name: 'Patient Satisfaction', selected: false },
  { name: 'ED Visit Frequency', selected: false },
  { name: 'Cost of Care', selected: false },
  { name: 'Provider Efficiency', selected: false },
  { name: 'Clinical Outcomes', selected: false }
]);

// Mock solution metadata (would come from AI response in production)
const solutionMetadata = ref([
  { 
    evidence_level: 'Strong (Level 1)',
    timeframe: '6-12 months',
    resource_intensity: 'Medium' 
  },
  { 
    evidence_level: 'Moderate (Level 2)',
    timeframe: '3-6 months',
    resource_intensity: 'Low' 
  },
  { 
    evidence_level: 'Emerging (Level 3)',
    timeframe: '12-18 months',
    resource_intensity: 'High' 
  }
]);

// Implementation phases
const implementationPhases = ref([
  { name: 'Planning & Design', duration: '2 months', description: 'Stakeholder engagement, resource allocation, protocol development' },
  { name: 'Pilot Implementation', duration: '3 months', description: 'Small-scale testing with 50 patients, process refinement' },
  { name: 'Full Deployment', duration: '6 months', description: 'Scaled implementation, staff training, patient enrollment' }
]);

// Add implementation phase
function addImplementationPhase() {
  implementationPhases.value.push({
    name: '',
    duration: '',
    description: ''
  });
}

// Milestones
const milestonesArray = ref([
  { name: 'Protocol Finalization', date: '', priority: 'high' },
  { name: 'Staff Training Complete', date: '', priority: 'high' },
  { name: 'Pilot Group Enrolled', date: '', priority: 'medium' },
  { name: 'First Quarterly Review', date: '', priority: 'medium' }
]);

// Add milestone
function addMilestone() {
  milestonesArray.value.push({
    name: '',
    date: '',
    priority: 'medium'
  });
}

// Remove milestone
function removeMilestone(index: number) {
  milestonesArray.value.splice(index, 1);
}

// Result tabs
const resultTabs = [
  { id: 'summary', label: 'Summary' },
  { id: 'deal', label: 'Deal Details' },
  { id: 'program', label: 'Program Details' },
  { id: 'protocol', label: 'Protocol Details' },
  { id: 'visualization', label: 'Visualizations' }
];

// Step 1 data
const step1 = ref({
  problem: '',
  category: '',
  sub_category: '',
  metadata: {
    target_population: '',
    objectives: ''
  }
});

// Step 2 data
const step2 = ref({
  solution_options: [] as SolutionOptionData[],
  selected_solution: 0,
  metadata: {}
});

const customSolution = ref({
  description: '',
  feasibility: FeasibilityRating.MEDIUM
});

// Step 3 data
const step3 = ref({
  stakeholders: [
    { name: 'Primary Care Physicians', role: 'healthcare-provider', engagement_level: 8 },
    { name: 'Chronic Disease Patients', role: 'patient', engagement_level: 7 }
  ] as StakeholderData[],
  program_name: '',
  program_description: '',
  expertise: [] as ExpertiseData[],
  team_members: [],
  metadata: {}
});

// Expertise responsibilities text fields
const expertiseResponsibilities = ref<string[]>([]);

// Update responsibilities from text
function updateResponsibilities(index: number) {
  if (!step3.value.expertise[index]) return;
  
  const lines = expertiseResponsibilities.value[index]?.split('\n').filter(line => line.trim()) || [];
  step3.value.expertise[index].responsibilities = lines;
}

// Add expertise
function addExpertise() {
  step3.value.expertise.push({
    stakeholder: '',
    domain: '',
    responsibilities: []
  });
  
  expertiseResponsibilities.value.push('');
}

// Remove expertise
function removeExpertise(index: number) {
  step3.value.expertise.splice(index, 1);
  expertiseResponsibilities.value.splice(index, 1);
}

// Step 4 data
const step4 = ref({
  execution_plan: {
    agents: [] as string[],
    tools: [] as string[],
    milestones: [] as string[]
  },
  timeline: '',
  resources: '',
  metadata: {}
});

// Tools text for easier editing
const toolsText = ref('');

// Update tools array from text
function updateTools() {
  const lines = toolsText.value.split('\n').filter(line => line.trim().length > 0);
  step4.value.execution_plan.tools = lines.map(line => {
    return line.trim().startsWith('- ') ? line.trim().substring(2) : line.trim();
  });
}

// Step 5 data
const step5 = ref({
  // Set from the running program's execution instance before Step 5:
  // the api grades at POST /wizard/deal/{deal}/verify/{execution}.
  execution_id: undefined as number | string | undefined,
  outcome: {
    verified: true,
    metrics: {}
  },
  payout_status: PayoutStatus.PENDING,
  lessons_learned: '',
  metadata: {
    clinical_impact: '',
    patient_outcomes: ''
  }
});

// Computed properties for validation
const isStep1Valid = computed(() => {
  return step1.value.problem.length >= 10 && !!step1.value.category;
});

const isStep2Valid = computed(() => {
  return step2.value.solution_options.length > 0;
});

const isStep3Valid = computed(() => {
  return (
    step3.value.stakeholders.length > 0 &&
    step3.value.program_name.length > 0 &&
    step3.value.program_description.length > 0
  );
});

const isStep4Valid = computed(() => {
  return (
    step4.value.execution_plan.tools.length > 0 &&
    milestonesArray.value.length > 0 &&
    implementationPhases.value.length > 0
  );
});

const isStep5Valid = computed(() => {
  return (
    step5.value.lessons_learned.length > 0 &&
    Object.keys(step5.value.outcome.metrics).length > 0
  );
});

// Selected solution description
const selectedSolutionDescription = computed(() => {
  if (!deal.value?.solution_options?.length) return '';
  
  const index = step2.value.selected_solution;
  return deal.value.solution_options[index]?.description || '';
});

// Helper functions
function formatCategory(category: string): string {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatSubcategory(subcategory: string): string {
  return subcategory
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Initialize
function initializeData() {
  // Initialize step3 expertise based on the first stakeholder
  if (step3.value.stakeholders.length > 0 && step3.value.expertise.length === 0) {
    step3.value.expertise.push({
      stakeholder: step3.value.stakeholders[0].name,
      domain: 'Clinical Care',
      responsibilities: ['Patient assessment', 'Treatment planning', 'Care coordination']
    });
    
    expertiseResponsibilities.value.push('Patient assessment\nTreatment planning\nCare coordination');
  }
  
  // Initialize step5 metrics based on suggestedMetrics
  if (Object.keys(step5.value.outcome.metrics).length === 0) {
    suggestedMetrics.value.forEach((metric, index) => {
      if (metric.selected) {
        step5.value.outcome.metrics[metric.name] = '';
      }
    });
  }
}

// Call initialize
initializeData();

// Update tools text from execution plan
watch(() => deal.value?.execution_plan?.tools, (newTools) => {
  if (newTools && newTools.length > 0) {
    toolsText.value = newTools.map(tool => `- ${tool}`).join('\n');
  }
}, { immediate: true });

// Step processing functions
async function processStep1() {
  if (!isStep1Valid.value) return;
  
  try {
    processing.value = true;
    processingMessage.value = 'Analyzing healthcare challenge...';
    processingProgress.value = 0;
    
    // If we have a deal, update it; otherwise start a new wizard
    if (deal.value?.id) {
      deal.value = await wizardSteps.defineProblems.process(
        deal.value.id,
        step1.value,
        progress => processingProgress.value = progress
      );
    } else {
      const response = await wizardApiClient.startWizard(step1.value);
      
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
    currentStep.value = 2;
  } catch (error) {
    console.error('Error processing Step 1:', error);
    alert('An error occurred while analyzing the healthcare challenge. Please try again.');
  } finally {
    processing.value = false;
  }
}

// Function to add a custom solution
function addCustomSolution() {
  if (!customSolution.value.description) return;
  
  step2.value.solution_options.push({
    description: customSolution.value.description,
    feasibility: customSolution.value.feasibility as FeasibilityRating
  });
  
  // Reset the form
  customSolution.value = {
    description: '',
    feasibility: FeasibilityRating.MEDIUM
  };
}

async function processStep2() {
  if (!isStep2Valid.value || !deal.value?.id) return;
  
  try {
    processing.value = true;
    processingMessage.value = 'Developing healthcare solution approach...';
    processingProgress.value = 0;
    
    deal.value = await wizardSteps.codifySolution.process(
      deal.value.id,
      step2.value,
      progress => processingProgress.value = progress
    );
    
    // Update step data
    updateUIFromDeal();
    
    // Move to the next step
    currentStep.value = 3;
  } catch (error) {
    console.error('Error processing Step 2:', error);
    alert('An error occurred while developing the healthcare solution. Please try again.');
  } finally {
    processing.value = false;
  }
}

// Function to add a stakeholder
function addStakeholder() {
  step3.value.stakeholders.push({ 
    name: '', 
    role: '',
    engagement_level: 5
  });
}

// Function to remove a stakeholder
function removeStakeholder(index: number) {
  step3.value.stakeholders.splice(index, 1);
}

async function processStep3() {
  if (!isStep3Valid.value || !deal.value?.id) return;
  
  try {
    processing.value = true;
    processingMessage.value = 'Configuring healthcare program...';
    processingProgress.value = 0;
    
    deal.value = await wizardSteps.setupProgram.process(
      deal.value.id,
      step3.value,
      progress => processingProgress.value = progress
    );
    
    // Update step data
    updateUIFromDeal();
    
    // Move to the next step
    currentStep.value = 4;
  } catch (error) {
    console.error('Error processing Step 3:', error);
    alert('An error occurred while setting up the healthcare program. Please try again.');
  } finally {
    processing.value = false;
  }
}

async function processStep4() {
  if (!isStep4Valid.value || !deal.value?.id) return;
  
  try {
    processing.value = true;
    processingMessage.value = 'Developing implementation plan...';
    processingProgress.value = 0;
    
    // Update execution plan with milestones
    step4.value.execution_plan.milestones = milestonesArray.value.map(m => m.name);
    
    // Add timeline based on phases
    step4.value.timeline = implementationPhases.value.map(p => 
      `${p.name} (${p.duration}): ${p.description}`
    ).join('\n');
    
    deal.value = await wizardSteps.executeProgram.process(
      deal.value.id,
      step4.value,
      progress => processingProgress.value = progress
    );
    
    // Update step data
    updateUIFromDeal();
    
    // Move to the next step
    currentStep.value = 5;
  } catch (error) {
    console.error('Error processing Step 4:', error);
    alert('An error occurred while developing the implementation plan. Please try again.');
  } finally {
    processing.value = false;
  }
}

// Function to add a metric
function addMetric() {
  const key = `Metric ${Object.keys(step5.value.outcome.metrics).length + 1}`;
  step5.value.outcome.metrics[key] = '';
}

// Function to update a metric key
function updateMetricKey(oldKey: string, event: Event) {
  const newKey = (event.target as HTMLInputElement).value;
  if (newKey && newKey !== oldKey) {
    const value = step5.value.outcome.metrics[oldKey];
    delete step5.value.outcome.metrics[oldKey];
    step5.value.outcome.metrics[newKey] = value;
  }
}

// Function to remove a metric
function removeMetric(key: string) {
  delete step5.value.outcome.metrics[key];
}

async function processStep5() {
  if (!isStep5Valid.value || !deal.value?.id) return;
  
  try {
    processing.value = true;
    processingMessage.value = 'Verifying healthcare outcomes...';
    processingProgress.value = 0;
    
    deal.value = await wizardSteps.verifyOutcome.process(
      deal.value.id,
      step5.value,
      progress => processingProgress.value = progress
    );
    
    // Load the full response
    await loadFullResponse();
    
    // Move to the results view
    currentStep.value = 6;
  } catch (error) {
    console.error('Error processing Step 5:', error);
    alert('An error occurred while verifying the outcomes. Please try again.');
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
  if (deal.value.problem) step1.value.problem = deal.value.problem;
  if (deal.value.category) step1.value.category = deal.value.category;
  if (deal.value.sub_category) step1.value.sub_category = deal.value.sub_category;
  
  // Update Step 2 data
  if (deal.value.solution_options) {
    step2.value.solution_options = [...deal.value.solution_options];
  }
  
  // Update Step 3 data
  if (deal.value.stakeholders) {
    step3.value.stakeholders = [...deal.value.stakeholders];
  }
  
  // Update Step 4 data
  if (deal.value.execution_plan) {
    step4.value.execution_plan = { ...deal.value.execution_plan };
  }
  
  // Update Step 5 data
  if (deal.value.outcome) {
    step5.value.outcome = { ...deal.value.outcome };
  }
  
  if (deal.value.payout_status) {
    step5.value.payout_status = deal.value.payout_status as PayoutStatus;
  }
  
  if (deal.value.lessons_learned) {
    step5.value.lessons_learned = deal.value.lessons_learned;
  }
}

// Download results (mock function)
function downloadResults() {
  alert('Healthcare initiative report would be downloaded here.');
  
  // In a real implementation, would generate a PDF or other document format
  // with comprehensive healthcare program details, outcomes, and visualizations
}

// Function to start a new wizard
function startNewHealthcareWizard() {
  deal.value = null;
  fullResponse.value = null;
  currentStep.value = 1;
  
  // Reset all step data (simplified version)
  step1.value = {
    problem: '',
    category: '',
    sub_category: '',
    metadata: {
      target_population: '',
      objectives: ''
    }
  };
  
  step2.value = {
    solution_options: [],
    selected_solution: 0,
    metadata: {}
  };
  
  // Reset with some default stakeholders for healthcare context
  step3.value = {
    stakeholders: [
      { name: 'Primary Care Physicians', role: 'healthcare-provider', engagement_level: 8 },
      { name: 'Chronic Disease Patients', role: 'patient', engagement_level: 7 }
    ],
    program_name: '',
    program_description: '',
    expertise: [],
    team_members: [],
    metadata: {}
  };
  
  expertiseResponsibilities.value = [];
  
  step4.value = {
    execution_plan: {
      agents: [],
      tools: [],
      milestones: []
    },
    timeline: '',
    resources: '',
    metadata: {}
  };
  
  step5.value = {
    outcome: {
      verified: true,
      metrics: {}
    },
    payout_status: PayoutStatus.PENDING,
    lessons_learned: '',
    metadata: {
      clinical_impact: '',
      patient_outcomes: ''
    }
  };
  
  // Reset tools text
  toolsText.value = '';
  
  // Reinitialize
  initializeData();
}
</script>

<style scoped>
/* Healthcare Wizard - BEM Architecture */
.healthcare-wizard {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #374151;
  max-width: 1200px;
  margin: 0 auto;
}

/* Healthcare Wizard Header */
.healthcare-wizard .wizard-header.healthcare {
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem 0;
  background: linear-gradient(135deg, #e8f5fe, #f0f9ff);
  border-radius: 8px;
}

.healthcare-wizard .wizard-header h1 {
  color: #0284c7;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.healthcare-wizard .wizard-header .icon {
  margin-right: 0.75rem;
}

.healthcare-wizard .subtitle {
  color: #6b7280;
  font-size: 1.125rem;
  margin: 0;
}

/* Container */
.healthcare-wizard__container {
  position: relative;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Step */
.healthcare-wizard__step {
  padding: 2rem;
}

.healthcare-wizard__step h2 {
  color: #0284c7;
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.75rem;
}

/* Section */
.healthcare-wizard__section {
  margin-bottom: 2rem;
}

.healthcare-wizard__section h3 {
  color: #374151;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

/* Form Groups */
.healthcare-wizard__form-group {
  margin-bottom: 1.5rem;
}

.healthcare-wizard__form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4b5563;
}

.healthcare-wizard__form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.healthcare-wizard__form-row .healthcare-wizard__form-group {
  flex: 1;
  margin-bottom: 0;
}

/* Form Controls */
.healthcare-wizard__input,
.healthcare-wizard__select,
.healthcare-wizard__textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.healthcare-wizard__input:focus,
.healthcare-wizard__select:focus,
.healthcare-wizard__textarea:focus {
  outline: none;
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
}

.healthcare-wizard__textarea--small {
  min-height: 60px;
}

.healthcare-wizard__select--small {
  max-width: 150px;
}

.healthcare-wizard__date {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

/* Healthcare Metrics */
.healthcare-wizard__metrics {
  background-color: #f3f4f6;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.healthcare-wizard__metrics h3 {
  margin-top: 0;
  color: #374151;
}

.healthcare-wizard__metrics-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.healthcare-wizard__metric-item {
  margin-bottom: 0.5rem;
}

.healthcare-wizard__checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.healthcare-wizard__checkbox {
  margin-right: 0.5rem;
}

/* Healthcare Solutions */
.healthcare-wizard__solutions {
  margin-bottom: 1.5rem;
}

.healthcare-wizard__evidence-note {
  display: flex;
  align-items: center;
  background-color: #f0f9ff;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.healthcare-wizard__evidence-icon {
  font-size: 1.5rem;
  margin-right: 0.75rem;
  color: #0284c7;
}

.healthcare-wizard__evidence-note p {
  margin: 0;
  color: #075985;
  font-size: 0.875rem;
}

.healthcare-wizard__solution-card {
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.healthcare-wizard__solution-card:hover {
  border-color: #93c5fd;
}

.healthcare-wizard__solution-card.selected {
  border-color: #0284c7;
  background-color: #f0f9ff;
}

.healthcare-wizard__solution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.healthcare-wizard__solution-title {
  font-weight: 600;
  color: #1f2937;
}

.healthcare-wizard__badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  text-transform: uppercase;
  font-weight: 600;
}

.healthcare-wizard__badge.high {
  background-color: #d1fae5;
  color: #065f46;
}

.healthcare-wizard__badge.medium {
  background-color: #fef3c7;
  color: #92400e;
}

.healthcare-wizard__badge.low {
  background-color: #fee2e2;
  color: #b91c1c;
}

.healthcare-wizard__badge.unknown {
  background-color: #e5e7eb;
  color: #4b5563;
}

.healthcare-wizard__solution-description {
  margin-bottom: 0.75rem;
}

.healthcare-wizard__solution-metadata {
  font-size: 0.875rem;
  color: #6b7280;
  padding-top: 0.75rem;
  border-top: 1px dashed #e5e7eb;
}

.healthcare-wizard__evidence-level,
.healthcare-wizard__timeframe,
.healthcare-wizard__resource-intensity {
  margin-bottom: 0.25rem;
}

.healthcare-wizard__custom-solution-controls {
  align-items: center;
}

/* Stakeholders */
.healthcare-wizard__stakeholders {
  margin-bottom: 1.5rem;
}

.healthcare-wizard__stakeholder-item {
  display: flex;
  margin-bottom: 1rem;
  gap: 0.75rem;
  align-items: flex-start;
}

.healthcare-wizard__stakeholder-inputs {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.5rem;
}

.healthcare-wizard__engagement-slider {
  margin-top: 0.5rem;
}

.healthcare-wizard__slider {
  width: 100%;
}

/* Expertise */
.healthcare-wizard__expertise-items {
  margin-bottom: 1.5rem;
}

.healthcare-wizard__expertise-item {
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.healthcare-wizard__expertise-inputs {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

/* Timeline */
.healthcare-wizard__timeline {
  margin-bottom: 1.5rem;
}

.healthcare-wizard__phases {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.healthcare-wizard__phase {
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #0284c7;
}

.healthcare-wizard__phase-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.healthcare-wizard__phase-label {
  font-weight: 600;
  color: #0284c7;
}

.healthcare-wizard__phase-duration {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Milestones */
.healthcare-wizard__milestones {
  margin-bottom: 1.5rem;
}

.healthcare-wizard__milestone-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.healthcare-wizard__milestone-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.healthcare-wizard__milestone-meta {
  display: flex;
  gap: 0.75rem;
}

/* Radio Group */
.healthcare-wizard__radio-group {
  display: flex;
  gap: 1.5rem;
  margin: 0.5rem 0;
}

.healthcare-wizard__radio {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.healthcare-wizard__radio input {
  margin-right: 0.5rem;
}

/* Metrics Results */
.healthcare-wizard__metrics-results {
  margin-bottom: 1.5rem;
}

.healthcare-wizard__metric-result {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.healthcare-wizard__metric-inputs {
  display: flex;
  flex: 1;
  gap: 0.75rem;
}

/* Buttons */
.healthcare-wizard__button-row {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.healthcare-wizard__button {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.healthcare-wizard__button--primary {
  background-color: #0284c7;
  color: white;
}

.healthcare-wizard__button--primary:hover {
  background-color: #0369a1;
}

.healthcare-wizard__button--primary:disabled {
  background-color: #bfdbfe;
  cursor: not-allowed;
}

.healthcare-wizard__button--secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.healthcare-wizard__button--secondary:hover {
  background-color: #e5e7eb;
}

.healthcare-wizard__button--outline {
  background-color: transparent;
  border: 1px solid #d1d5db;
  color: #4b5563;
}

.healthcare-wizard__button--outline:hover {
  background-color: #f9fafb;
}

.healthcare-wizard__button--icon {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
}

.healthcare-wizard__button--icon:hover {
  color: #ef4444;
}

/* Processing Overlay */
.healthcare-wizard__overlay {
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

.healthcare-wizard__processing {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.healthcare-wizard__spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #0284c7;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: healthcare-spinner 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes healthcare-spinner {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.healthcare-wizard__progress {
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  margin: 1rem 0 0.5rem;
  overflow: hidden;
}

.healthcare-wizard__progress-bar {
  height: 100%;
  background-color: #0284c7;
  transition: width 0.3s ease;
}

.healthcare-wizard__progress-text {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Results View */
.healthcare-wizard__results {
  padding: 2rem;
}

.healthcare-wizard__success-banner {
  background-color: #f0fdf4;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 2rem;
  border: 1px solid #d1fae5;
}

.healthcare-wizard__success-icon {
  font-size: 2.5rem;
  color: #10b981;
  background-color: #d1fae5;
  width: 60px;
  height: 60px;
  line-height: 60px;
  border-radius: 50%;
  margin: 0 auto 1rem;
}

.healthcare-wizard__success-banner h2 {
  color: #065f46;
  margin-bottom: 0.5rem;
}

.healthcare-wizard__success-banner p {
  color: #047857;
  margin: 0;
}

.healthcare-wizard__results-summary {
  margin-top: 2rem;
}

.healthcare-wizard__tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.healthcare-wizard__tab {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.healthcare-wizard__tab.active {
  color: #0284c7;
  border-bottom-color: #0284c7;
}

.healthcare-wizard__tab-content {
  padding: 1rem 0;
}

.healthcare-wizard__summary-card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.healthcare-wizard__summary-card h3 {
  margin-top: 0;
  color: #0284c7;
  margin-bottom: 1rem;
}

.healthcare-wizard__summary-item {
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.healthcare-wizard__summary-item strong {
  color: #4b5563;
  font-weight: 600;
}

.healthcare-wizard__status {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.healthcare-wizard__status.success {
  background-color: #d1fae5;
  color: #065f46;
}

.healthcare-wizard__status.warning {
  background-color: #fef3c7;
  color: #92400e;
}

.healthcare-wizard__metrics-summary {
  margin-bottom: 1.5rem;
}

.healthcare-wizard__metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.healthcare-wizard__metric-card {
  background-color: #f0f9ff;
  border-radius: 8px;
  padding: 1.25rem;
  text-align: center;
}

.healthcare-wizard__metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0284c7;
  margin-bottom: 0.5rem;
}

.healthcare-wizard__metric-name {
  color: #6b7280;
  font-size: 0.875rem;
}

.healthcare-wizard__lessons-card {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
}

.healthcare-wizard__lessons-card h3 {
  margin-top: 0;
  color: #4b5563;
  margin-bottom: 1rem;
}

.healthcare-wizard__final-actions {
  margin-top: 2rem;
  justify-content: center;
  gap: 1rem;
}

/* Healthcare Data Visualization */
.healthcare-wizard__visualization {
  padding: 1.5rem;
}

.healthcare-wizard__data-visualization {
  text-align: center;
}

.healthcare-wizard__placeholder-chart {
  background-color: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.healthcare-wizard__chart-title {
  font-weight: 600;
  margin-bottom: 1rem;
  color: #4b5563;
}

.healthcare-wizard__chart-placeholder {
  height: 200px;
  background: linear-gradient(to right, #bfdbfe 10%, #93c5fd 25%, #60a5fa 45%, #3b82f6 75%, #2563eb 100%);
  border-radius: 6px;
  position: relative;
}

.healthcare-wizard__chart-placeholder::after {
  content: "Chart visualization would appear here";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: 500;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.healthcare-wizard__details pre {
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  overflow: auto;
  font-size: 0.875rem;
  max-height: 400px;
  border: 1px solid #e5e7eb;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .healthcare-wizard__form-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .healthcare-wizard__stakeholder-inputs {
    flex-direction: column;
  }
  
  .healthcare-wizard__expertise-inputs {
    flex-direction: column;
  }
  
  .healthcare-wizard__milestone-content {
    flex-direction: column;
  }
  
  .healthcare-wizard__tab {
    padding: 0.75rem 0.5rem;
    font-size: 0.875rem;
  }
  
  .healthcare-wizard__metrics-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .healthcare-wizard__button-row {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .healthcare-wizard__button-row button {
    width: 100%;
  }
}
</style>