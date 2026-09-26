<template>
  <div class="education-wizard">
    <div class="wizard-header education">
      <h1>
        <span class="icon">🎓</span>
        Education Program Wizard
      </h1>
      <p class="subtitle">Design and implement effective educational programs with AI assistance</p>
    </div>
    
    <!-- Wizard Container -->
    <div class="education-wizard__container">
      <!-- Step 1: Define Problem (Education-focused) -->
      <div v-if="currentStep === 1" class="education-wizard__step">
        <h2>Step 1: Define Educational Challenge</h2>
        
        <div class="education-wizard__form-group">
          <label for="education-problem">What educational challenge are you addressing?</label>
          <textarea 
            id="education-problem"
            v-model="step1.problem"
            class="education-wizard__textarea"
            placeholder="E.g., Declining student engagement in STEM subjects at the middle school level"
            rows="4"
          ></textarea>
        </div>
        
        <div class="education-wizard__form-row">
          <div class="education-wizard__form-group">
            <label for="education-category">Educational Domain</label>
            <select 
              id="education-category"
              v-model="step1.category"
              class="education-wizard__select"
            >
              <option value="">Select a domain</option>
              <option value="k12-education">K-12 Education</option>
              <option value="higher-education">Higher Education</option>
              <option value="professional-development">Professional Development</option>
              <option value="special-education">Special Education</option>
              <option value="adult-education">Adult Education</option>
              <option value="educational-technology">Educational Technology</option>
            </select>
          </div>
          
          <div class="education-wizard__form-group">
            <label for="education-subcategory">Specific Focus Area</label>
            <select 
              id="education-subcategory"
              v-model="step1.sub_category"
              class="education-wizard__select"
            >
              <option value="">Select focus area</option>
              <option v-if="step1.category === 'k12-education'" value="elementary">Elementary Education</option>
              <option v-if="step1.category === 'k12-education'" value="middle-school">Middle School</option>
              <option v-if="step1.category === 'k12-education'" value="high-school">High School</option>
              <option v-if="step1.category === 'k12-education'" value="curriculum-design">Curriculum Design</option>
              
              <option v-if="step1.category === 'higher-education'" value="undergraduate">Undergraduate Programs</option>
              <option v-if="step1.category === 'higher-education'" value="graduate">Graduate Programs</option>
              <option v-if="step1.category === 'higher-education'" value="research">Research Integration</option>
              <option v-if="step1.category === 'higher-education'" value="online-learning">Online Learning</option>
              
              <option v-if="step1.category === 'professional-development'" value="teacher-training">Teacher Training</option>
              <option v-if="step1.category === 'professional-development'" value="leadership">Educational Leadership</option>
              <option v-if="step1.category === 'professional-development'" value="certification">Certification Programs</option>
              
              <option v-if="step1.category === 'special-education'" value="learning-disabilities">Learning Disabilities</option>
              <option v-if="step1.category === 'special-education'" value="gifted-education">Gifted Education</option>
              <option v-if="step1.category === 'special-education'" value="inclusive-classroom">Inclusive Classroom</option>
              
              <option v-if="step1.category === 'adult-education'" value="literacy">Adult Literacy</option>
              <option v-if="step1.category === 'adult-education'" value="ged">GED Preparation</option>
              <option v-if="step1.category === 'adult-education'" value="esl">ESL Programs</option>
              
              <option v-if="step1.category === 'educational-technology'" value="lms">Learning Management Systems</option>
              <option v-if="step1.category === 'educational-technology'" value="assessment-tools">Assessment Tools</option>
              <option v-if="step1.category === 'educational-technology'" value="interactive-content">Interactive Content</option>
            </select>
          </div>
        </div>
        
        <div class="education-wizard__form-group">
          <label for="education-subject">Subject Area (if applicable)</label>
          <select 
            id="education-subject"
            v-model="step1.metadata.subject_area"
            class="education-wizard__select"
          >
            <option value="">Select a subject</option>
            <option value="mathematics">Mathematics</option>
            <option value="science">Science</option>
            <option value="language-arts">Language Arts</option>
            <option value="social-studies">Social Studies</option>
            <option value="computer-science">Computer Science</option>
            <option value="arts">Arts & Music</option>
            <option value="physical-education">Physical Education</option>
            <option value="multiple">Multiple Subjects</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div class="education-wizard__form-group">
          <label for="education-audience">Target Audience</label>
          <input 
            id="education-audience"
            v-model="step1.metadata.target_audience"
            class="education-wizard__input"
            placeholder="E.g., Middle school students grades 6-8 in urban school districts"
          />
        </div>
        
        <div class="education-wizard__form-group">
          <label for="education-goals">Learning Objectives (one per line)</label>
          <textarea 
            id="education-goals"
            v-model="step1.metadata.learning_objectives"
            class="education-wizard__textarea"
            placeholder="E.g., 
- Increase student engagement in STEM subjects
- Improve conceptual understanding of scientific principles
- Develop critical thinking skills through inquiry-based learning"
            rows="3"
          ></textarea>
        </div>
        
        <div class="education-wizard__metrics">
          <h3>Educational Success Metrics</h3>
          <div class="education-wizard__metrics-list">
            <div 
              v-for="(metric, index) in educationMetrics" 
              :key="index" 
              class="education-wizard__metric-item"
            >
              <label class="education-wizard__checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="metric.selected"
                  class="education-wizard__checkbox"
                />
                <span>{{ metric.name }}</span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="education-wizard__button-row">
          <button 
            @click="processStep1"
            :disabled="!isStep1Valid"
            class="education-wizard__button education-wizard__button--primary"
          >
            Analyze Educational Challenge
          </button>
        </div>
      </div>
      
      <!-- Step 2: Codify Solution (Education-focused) -->
      <div v-if="currentStep === 2" class="education-wizard__step">
        <h2>Step 2: Educational Approach</h2>
        
        <div v-if="deal?.solution_options?.length" class="education-wizard__solutions">
          <div class="education-wizard__evidence-note">
            <div class="education-wizard__evidence-icon">🔍</div>
            <p>The following approaches have been generated based on educational research and evidence-based practices.</p>
          </div>
          
          <div 
            v-for="(solution, index) in deal.solution_options" 
            :key="index"
            :class="['education-wizard__solution-card', { 'selected': step2.selected_solution === index }]"
            @click="step2.selected_solution = index"
          >
            <div class="education-wizard__solution-header">
              <div class="education-wizard__solution-title">Approach {{ index + 1 }}</div>
              <div :class="['education-wizard__badge', solution.feasibility.toLowerCase()]">
                {{ solution.feasibility }} Feasibility
              </div>
            </div>
            <p class="education-wizard__solution-description">{{ solution.description }}</p>
            <div v-if="solutionMetadata[index]" class="education-wizard__solution-metadata">
              <div class="education-wizard__evidence-level">
                <strong>Research Base:</strong> {{ solutionMetadata[index].research_base }}
              </div>
              <div class="education-wizard__timeframe">
                <strong>Implementation Timeframe:</strong> {{ solutionMetadata[index].timeframe }}
              </div>
              <div class="education-wizard__resource-intensity">
                <strong>Resource Requirements:</strong> {{ solutionMetadata[index].resource_requirements }}
              </div>
              <div class="education-wizard__pedagogical">
                <strong>Pedagogical Approach:</strong> {{ solutionMetadata[index].pedagogical_approach }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="education-wizard__form-group">
          <label for="education-custom-solution">Propose Alternative Approach</label>
          <textarea 
            id="education-custom-solution"
            v-model="customSolution.description"
            class="education-wizard__textarea"
            placeholder="Describe your alternative educational approach..."
            rows="3"
          ></textarea>
          <div class="education-wizard__form-row education-wizard__custom-solution-controls">
            <select 
              v-model="customSolution.feasibility"
              class="education-wizard__select"
            >
              <option value="HIGH">High Feasibility</option>
              <option value="MEDIUM">Medium Feasibility</option>
              <option value="LOW">Low Feasibility</option>
              <option value="UNKNOWN">Unknown Feasibility</option>
            </select>
            <button 
              @click="addCustomSolution"
              :disabled="!customSolution.description"
              class="education-wizard__button education-wizard__button--secondary"
            >
              Add Alternative Approach
            </button>
          </div>
        </div>
        
        <div class="education-wizard__button-row">
          <button 
            @click="currentStep = 1"
            class="education-wizard__button education-wizard__button--outline"
          >
            Back
          </button>
          <button 
            @click="processStep2"
            :disabled="!isStep2Valid"
            class="education-wizard__button education-wizard__button--primary"
          >
            Develop Educational Program
          </button>
        </div>
      </div>
      
      <!-- Step 3: Setup Program (Education-focused) -->
      <div v-if="currentStep === 3" class="education-wizard__step">
        <h2>Step 3: Educational Program Design</h2>
        
        <div class="education-wizard__form-group">
          <label for="education-program-name">Program Name</label>
          <input 
            id="education-program-name"
            v-model="step3.program_name"
            class="education-wizard__input"
            placeholder="E.g., Interactive STEM Learning Initiative"
          />
        </div>
        
        <div class="education-wizard__form-group">
          <label for="education-program-description">Program Description</label>
          <textarea 
            id="education-program-description"
            v-model="step3.program_description"
            class="education-wizard__textarea"
            placeholder="Describe your educational program..."
            rows="3"
          ></textarea>
        </div>
        
        <div class="education-wizard__section">
          <h3>Education Stakeholders</h3>
          <div class="education-wizard__stakeholders">
            <div 
              v-for="(stakeholder, index) in step3.stakeholders" 
              :key="index"
              class="education-wizard__stakeholder-item"
            >
              <div class="education-wizard__stakeholder-inputs">
                <input 
                  v-model="stakeholder.name"
                  class="education-wizard__input"
                  placeholder="Stakeholder name or role"
                />
                <select 
                  v-model="stakeholder.role"
                  class="education-wizard__select"
                >
                  <option value="">Select role type</option>
                  <option value="educators">Educators/Teachers</option>
                  <option value="administrators">Administrators</option>
                  <option value="students">Students</option>
                  <option value="parents">Parents/Guardians</option>
                  <option value="curriculum">Curriculum Specialists</option>
                  <option value="technology">Technology Staff</option>
                  <option value="community">Community Partners</option>
                  <option value="government">Government/Regulation</option>
                  <option value="other">Other</option>
                </select>
                <div class="education-wizard__engagement-slider">
                  <label>Engagement: {{ stakeholder.engagement_level || 5 }}</label>
                  <input 
                    type="range" 
                    v-model.number="stakeholder.engagement_level" 
                    min="1" 
                    max="10"
                    class="education-wizard__slider"
                  />
                </div>
              </div>
              <button 
                @click="removeStakeholder(index)"
                class="education-wizard__button education-wizard__button--icon"
                title="Remove stakeholder"
              >
                ✕
              </button>
            </div>
            <button 
              @click="addStakeholder"
              class="education-wizard__button education-wizard__button--secondary"
            >
              Add Education Stakeholder
            </button>
          </div>
        </div>
        
        <div class="education-wizard__section">
          <h3>Required Expertise</h3>
          <div class="education-wizard__expertise-items">
            <div 
              v-for="(expertise, index) in step3.expertise" 
              :key="index"
              class="education-wizard__expertise-item"
            >
              <div class="education-wizard__expertise-inputs">
                <select 
                  v-model="expertise.stakeholder"
                  class="education-wizard__select"
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
                  class="education-wizard__input"
                  placeholder="Expertise domain (e.g., Instructional Design)"
                />
              </div>
              <textarea 
                v-model="expertiseResponsibilities[index]"
                class="education-wizard__textarea education-wizard__textarea--small"
                placeholder="Key responsibilities (one per line)"
                rows="2"
                @input="updateResponsibilities(index)"
              ></textarea>
              <button 
                @click="removeExpertise(index)"
                class="education-wizard__button education-wizard__button--icon"
                title="Remove expertise"
              >
                ✕
              </button>
            </div>
            <button 
              @click="addExpertise"
              class="education-wizard__button education-wizard__button--secondary"
            >
              Add Required Expertise
            </button>
          </div>
        </div>
        
        <div class="education-wizard__form-group">
          <label for="educational-standards">Educational Standards Alignment</label>
          <textarea 
            id="educational-standards"
            v-model="step3.metadata.educational_standards"
            class="education-wizard__textarea"
            placeholder="E.g., Common Core Standards, NGSS, State-specific standards..."
            rows="2"
          ></textarea>
        </div>
        
        <div class="education-wizard__button-row">
          <button 
            @click="currentStep = 2"
            class="education-wizard__button education-wizard__button--outline"
          >
            Back
          </button>
          <button 
            @click="processStep3"
            :disabled="!isStep3Valid"
            class="education-wizard__button education-wizard__button--primary"
          >
            Plan Implementation
          </button>
        </div>
      </div>
      
      <!-- Step 4: Execute Program (Education-focused) -->
      <div v-if="currentStep === 4" class="education-wizard__step">
        <h2>Step 4: Educational Implementation Plan</h2>
        
        <div class="education-wizard__section">
          <h3>Implementation Timeline</h3>
          <div class="education-wizard__timeline">
            <div class="education-wizard__phases">
              <div 
                v-for="(phase, index) in implementationPhases" 
                :key="index"
                class="education-wizard__phase"
              >
                <div class="education-wizard__phase-header">
                  <span class="education-wizard__phase-label">Phase {{ index + 1 }}</span>
                  <span class="education-wizard__phase-duration">{{ phase.duration }}</span>
                </div>
                <input 
                  v-model="phase.name"
                  class="education-wizard__input"
                  placeholder="Phase name"
                />
                <textarea 
                  v-model="phase.description"
                  class="education-wizard__textarea education-wizard__textarea--small"
                  placeholder="Phase activities"
                  rows="2"
                ></textarea>
              </div>
              <button 
                @click="addImplementationPhase"
                class="education-wizard__button education-wizard__button--secondary"
              >
                Add Phase
              </button>
            </div>
          </div>
        </div>
        
        <div class="education-wizard__section">
          <h3>Educational Resources</h3>
          <div class="education-wizard__form-group">
            <label for="education-tools">Resources Required (one per line)</label>
            <textarea 
              id="education-tools"
              v-model="toolsText"
              class="education-wizard__textarea"
              placeholder="E.g.,
- Curriculum materials
- Digital learning platform
- Teacher professional development workshops
- Assessment tools
- Learning space modifications"
              rows="4"
              @input="updateTools"
            ></textarea>
          </div>
        </div>
        
        <div class="education-wizard__section">
          <h3>Program Milestones</h3>
          <div class="education-wizard__milestones">
            <div 
              v-for="(milestone, index) in milestonesArray" 
              :key="index"
              class="education-wizard__milestone-item"
            >
              <div class="education-wizard__milestone-content">
                <input 
                  v-model="milestone.name"
                  class="education-wizard__input"
                  placeholder="Milestone name"
                />
                <div class="education-wizard__milestone-meta">
                  <input 
                    type="date"
                    v-model="milestone.date"
                    class="education-wizard__date"
                  />
                  <select 
                    v-model="milestone.priority"
                    class="education-wizard__select education-wizard__select--small"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>
              <button 
                @click="removeMilestone(index)"
                class="education-wizard__button education-wizard__button--icon"
                title="Remove milestone"
              >
                ✕
              </button>
            </div>
            <button 
              @click="addMilestone"
              class="education-wizard__button education-wizard__button--secondary"
            >
              Add Milestone
            </button>
          </div>
        </div>
        
        <div class="education-wizard__form-group">
          <label for="educational-assessment">Assessment Strategy</label>
          <textarea 
            id="educational-assessment"
            v-model="step4.metadata.assessment_strategy"
            class="education-wizard__textarea"
            placeholder="Describe how you will assess the effectiveness of the program..."
            rows="3"
          ></textarea>
        </div>
        
        <div class="education-wizard__button-row">
          <button 
            @click="currentStep = 3"
            class="education-wizard__button education-wizard__button--outline"
          >
            Back
          </button>
          <button 
            @click="processStep4"
            :disabled="!isStep4Valid"
            class="education-wizard__button education-wizard__button--primary"
          >
            Verify Educational Outcomes
          </button>
        </div>
      </div>
      
      <!-- Step 5: Verify Outcome (Education-focused) -->
      <div v-if="currentStep === 5" class="education-wizard__step">
        <h2>Step 5: Educational Outcomes Verification</h2>
        
        <div class="education-wizard__section">
          <div class="education-wizard__form-group">
            <label>Were the educational objectives achieved?</label>
            <div class="education-wizard__radio-group">
              <label class="education-wizard__radio">
                <input 
                  type="radio"
                  v-model="step5.outcome.verified"
                  :value="true"
                  name="outcome_verified"
                />
                <span>Yes, objectives were achieved</span>
              </label>
              <label class="education-wizard__radio">
                <input 
                  type="radio"
                  v-model="step5.outcome.verified"
                  :value="false"
                  name="outcome_verified"
                />
                <span>No, objectives were not fully achieved</span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="education-wizard__section">
          <h3>Learning Metrics & Outcomes</h3>
          <div class="education-wizard__metrics-results">
            <div 
              v-for="(value, key) in step5.outcome.metrics" 
              :key="key"
              class="education-wizard__metric-result"
            >
              <div class="education-wizard__metric-inputs">
                <input 
                  :value="key"
                  @input="updateMetricKey(key, $event)"
                  class="education-wizard__input"
                  placeholder="Metric name (e.g., Student Engagement)"
                />
                <input 
                  v-model="step5.outcome.metrics[key]"
                  class="education-wizard__input"
                  placeholder="Value (e.g., 35% improvement)"
                />
              </div>
              <button 
                @click="removeMetric(key)"
                class="education-wizard__button education-wizard__button--icon"
                title="Remove metric"
              >
                ✕
              </button>
            </div>
            <button 
              @click="addMetric"
              class="education-wizard__button education-wizard__button--secondary"
            >
              Add Learning Metric
            </button>
          </div>
        </div>
        
        <div class="education-wizard__section">
          <h3>Student Impact Assessment</h3>
          <div class="education-wizard__form-group">
            <label for="student-impact">Describe the impact on student learning</label>
            <textarea 
              id="student-impact"
              v-model="step5.metadata.student_impact"
              class="education-wizard__textarea"
              placeholder="E.g., Students demonstrated increased engagement with STEM content, with 82% reporting greater interest in pursuing STEM activities outside of class."
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div class="education-wizard__section">
          <h3>Educator Feedback</h3>
          <div class="education-wizard__form-group">
            <label for="educator-feedback">Summarize feedback from educators</label>
            <textarea 
              id="educator-feedback"
              v-model="step5.metadata.educator_feedback"
              class="education-wizard__textarea"
              placeholder="E.g., Teachers reported that the new curriculum materials were easy to implement and effectively supported differentiated instruction."
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div class="education-wizard__form-group">
          <label for="education-lessons-learned">Lessons Learned & Best Practices</label>
          <textarea 
            id="education-lessons-learned"
            v-model="step5.lessons_learned"
            class="education-wizard__textarea"
            placeholder="Document key insights, challenges overcome, and recommendations for future educational initiatives..."
            rows="4"
          ></textarea>
        </div>
        
        <div class="education-wizard__button-row">
          <button 
            @click="currentStep = 4"
            class="education-wizard__button education-wizard__button--outline"
          >
            Back
          </button>
          <button 
            @click="processStep5"
            :disabled="!isStep5Valid"
            class="education-wizard__button education-wizard__button--primary"
          >
            Complete Educational Program
          </button>
        </div>
      </div>
      
      <!-- Results View -->
      <div v-if="currentStep === 6" class="education-wizard__results">
        <div class="education-wizard__success-banner">
          <div class="education-wizard__success-icon">✓</div>
          <h2>Educational Program Successfully Completed</h2>
          <p>Your educational program has been defined, implemented, and evaluated.</p>
        </div>
        
        <div v-if="fullResponse" class="education-wizard__results-summary">
          <div class="education-wizard__tabs">
            <button 
              v-for="tab in resultTabs" 
              :key="tab.id"
              :class="['education-wizard__tab', { active: activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>
          
          <div class="education-wizard__tab-content">
            <!-- Summary Tab -->
            <div v-if="activeTab === 'summary'" class="education-wizard__summary">
              <div class="education-wizard__summary-card">
                <h3>Educational Program Overview</h3>
                <div class="education-wizard__summary-item">
                  <strong>Challenge:</strong> {{ fullResponse.deal.problem }}
                </div>
                <div class="education-wizard__summary-item">
                  <strong>Domain:</strong> {{ formatCategory(fullResponse.deal.category) }}
                  <span v-if="fullResponse.deal.sub_category">
                    / {{ formatSubcategory(fullResponse.deal.sub_category) }}
                  </span>
                </div>
                <div class="education-wizard__summary-item">
                  <strong>Approach:</strong> {{ selectedSolutionDescription }}
                </div>
                <div class="education-wizard__summary-item">
                  <strong>Program Name:</strong> {{ fullResponse.program.name }}
                </div>
                <div class="education-wizard__summary-item">
                  <strong>Outcome Status:</strong>
                  <span :class="['education-wizard__status', fullResponse.deal.outcome?.verified ? 'success' : 'warning']">
                    {{ fullResponse.deal.outcome?.verified ? 'Objectives Achieved' : 'Objectives Not Fully Met' }}
                  </span>
                </div>
              </div>
              
              <div class="education-wizard__metrics-summary">
                <h3>Key Learning Metrics</h3>
                <div class="education-wizard__metrics-grid">
                  <div 
                    v-for="(value, key) in fullResponse.deal.outcome?.metrics" 
                    :key="key"
                    class="education-wizard__metric-card"
                  >
                    <div class="education-wizard__metric-value">{{ value }}</div>
                    <div class="education-wizard__metric-name">{{ key }}</div>
                  </div>
                </div>
              </div>
              
              <div class="education-wizard__lessons-card">
                <h3>Lessons Learned</h3>
                <p>{{ fullResponse.deal.lessons_learned }}</p>
              </div>
            </div>
            
            <!-- Details Tabs (Deal, Program, Protocol) -->
            <div v-if="activeTab === 'deal'" class="education-wizard__details">
              <pre>{{ JSON.stringify(fullResponse.deal, null, 2) }}</pre>
            </div>
            
            <div v-if="activeTab === 'program'" class="education-wizard__details">
              <pre>{{ JSON.stringify(fullResponse.program, null, 2) }}</pre>
            </div>
            
            <div v-if="activeTab === 'protocol'" class="education-wizard__details">
              <pre>{{ JSON.stringify(fullResponse.protocol, null, 2) }}</pre>
            </div>
            
            <!-- Learning Pathway Visualization -->
            <div v-if="activeTab === 'visualization'" class="education-wizard__visualization">
              <div class="education-wizard__data-visualization">
                <h3>Learning Pathway Visualization</h3>
                <p>Data visualization would be implemented here with charts showing learning metrics and outcomes.</p>
                <div class="education-wizard__placeholder-chart">
                  <div class="education-wizard__chart-title">Student Learning Outcomes</div>
                  <div class="education-wizard__chart-placeholder"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="education-wizard__button-row education-wizard__final-actions">
          <button 
            @click="downloadResults"
            class="education-wizard__button education-wizard__button--secondary"
          >
            Download Report
          </button>
          <button 
            @click="startNewEducationWizard"
            class="education-wizard__button education-wizard__button--primary"
          >
            Start New Educational Program
          </button>
        </div>
      </div>
      
      <!-- Processing Overlay -->
      <div v-if="processing" class="education-wizard__overlay">
        <div class="education-wizard__processing">
          <div class="education-wizard__spinner"></div>
          <h3>{{ processingMessage }}</h3>
          <div v-if="processingProgress > 0" class="education-wizard__progress">
            <div class="education-wizard__progress-bar" :style="{ width: `${processingProgress}%` }"></div>
          </div>
          <div v-if="processingProgress > 0" class="education-wizard__progress-text">
            {{ Math.round(processingProgress) }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
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

// State management
const currentStep = ref(1);
const deal = ref<DealData | null>(null);
const processing = ref(false);
const processingMessage = ref('');
const processingProgress = ref(0);
const fullResponse = ref<any>(null);
const activeTab = ref('summary');

// Education-specific data
const educationMetrics = ref([
  { name: 'Student Engagement', selected: true },
  { name: 'Academic Achievement', selected: true },
  { name: 'Learning Objectives Mastery', selected: true },
  { name: 'Participation Rate', selected: false },
  { name: 'Educator Satisfaction', selected: false },
  { name: 'Parent/Guardian Feedback', selected: false },
  { name: 'Long-term Retention', selected: false },
  { name: 'Skill Application', selected: false }
]);

// Mock solution metadata (would come from AI response in production)
const solutionMetadata = ref([
  { 
    research_base: 'Strong - Multiple studies',
    timeframe: '1 academic semester',
    resource_requirements: 'Medium',
    pedagogical_approach: 'Inquiry-based learning' 
  },
  { 
    research_base: 'Moderate - Initial studies',
    timeframe: '6-8 weeks',
    resource_requirements: 'Low',
    pedagogical_approach: 'Project-based learning'
  },
  { 
    research_base: 'Emerging - Pilot programs',
    timeframe: 'Full academic year',
    resource_requirements: 'High',
    pedagogical_approach: 'Personalized learning'
  }
]);

// Implementation phases
const implementationPhases = ref([
  { name: 'Planning & Preparation', duration: '4 weeks', description: 'Curriculum development, teacher training, resource gathering' },
  { name: 'Pilot Implementation', duration: '8 weeks', description: 'Initial rollout with a small group, iterative feedback' },
  { name: 'Full Implementation', duration: '16 weeks', description: 'Complete program deployment, ongoing support' },
  { name: 'Assessment & Refinement', duration: '4 weeks', description: 'Data collection, analysis, program adjustments' }
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
  { name: 'Curriculum Development Complete', date: '', priority: 'high' },
  { name: 'Teacher Training Completed', date: '', priority: 'high' },
  { name: 'Pilot Group Selection', date: '', priority: 'medium' },
  { name: 'Mid-term Assessment', date: '', priority: 'medium' },
  { name: 'Program Evaluation', date: '', priority: 'high' }
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
  { id: 'visualization', label: 'Learning Pathway' }
];

// Step 1 data
const step1 = ref({
  problem: '',
  category: '',
  sub_category: '',
  metadata: {
    subject_area: '',
    target_audience: '',
    learning_objectives: ''
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
    { name: 'Classroom Teachers', role: 'educators', engagement_level: 9 },
    { name: 'School Administration', role: 'administrators', engagement_level: 7 }
  ] as StakeholderData[],
  program_name: '',
  program_description: '',
  expertise: [] as ExpertiseData[],
  team_members: [],
  metadata: {
    educational_standards: ''
  }
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
  metadata: {
    assessment_strategy: ''
  }
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
    student_impact: '',
    educator_feedback: ''
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
      domain: 'Curriculum Implementation',
      responsibilities: ['Lesson delivery', 'Student assessment', 'Adaptation for diverse learners']
    });
    
    expertiseResponsibilities.value.push('Lesson delivery\nStudent assessment\nAdaptation for diverse learners');
    
    step3.value.expertise.push({
      stakeholder: step3.value.stakeholders[1].name,
      domain: 'Program Oversight',
      responsibilities: ['Resource allocation', 'Scheduling', 'Staff coordination']
    });
    
    expertiseResponsibilities.value.push('Resource allocation\nScheduling\nStaff coordination');
  }
  
  // Initialize step5 metrics based on educationMetrics
  if (Object.keys(step5.value.outcome.metrics).length === 0) {
    educationMetrics.value.forEach((metric, index) => {
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
    processingMessage.value = 'Analyzing educational challenge...';
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
    alert('An error occurred while analyzing the educational challenge. Please try again.');
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
    processingMessage.value = 'Developing educational approach...';
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
    alert('An error occurred while developing the educational approach. Please try again.');
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
    processingMessage.value = 'Configuring educational program...';
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
    alert('An error occurred while setting up the educational program. Please try again.');
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
    processingMessage.value = 'Verifying educational outcomes...';
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
    alert('An error occurred while verifying the educational outcomes. Please try again.');
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
  alert('Educational program report would be downloaded here.');
  
  // In a real implementation, would generate a PDF or other document format
  // with comprehensive program details, outcomes, and visualizations
}

// Function to start a new wizard
function startNewEducationWizard() {
  deal.value = null;
  fullResponse.value = null;
  currentStep.value = 1;
  
  // Reset all step data (simplified version)
  step1.value = {
    problem: '',
    category: '',
    sub_category: '',
    metadata: {
      subject_area: '',
      target_audience: '',
      learning_objectives: ''
    }
  };
  
  step2.value = {
    solution_options: [],
    selected_solution: 0,
    metadata: {}
  };
  
  // Reset with some default stakeholders for education context
  step3.value = {
    stakeholders: [
      { name: 'Classroom Teachers', role: 'educators', engagement_level: 9 },
      { name: 'School Administration', role: 'administrators', engagement_level: 7 }
    ],
    program_name: '',
    program_description: '',
    expertise: [],
    team_members: [],
    metadata: {
      educational_standards: ''
    }
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
    metadata: {
      assessment_strategy: ''
    }
  };
  
  step5.value = {
    outcome: {
      verified: true,
      metrics: {}
    },
    payout_status: PayoutStatus.PENDING,
    lessons_learned: '',
    metadata: {
      student_impact: '',
      educator_feedback: ''
    }
  };
  
  // Reset tools text
  toolsText.value = '';
  
  // Reinitialize
  initializeData();
}
</script>

<style scoped>
/* Education Wizard - BEM Architecture */
.education-wizard {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #374151;
  max-width: 1200px;
  margin: 0 auto;
}

/* Education Wizard Header */
.education-wizard .wizard-header.education {
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem 0;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border-radius: 8px;
}

.education-wizard .wizard-header h1 {
  color: #16a34a;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.education-wizard .wizard-header .icon {
  margin-right: 0.75rem;
}

.education-wizard .subtitle {
  color: #6b7280;
  font-size: 1.125rem;
  margin: 0;
}

/* Container */
.education-wizard__container {
  position: relative;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Step */
.education-wizard__step {
  padding: 2rem;
}

.education-wizard__step h2 {
  color: #16a34a;
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.75rem;
}

/* Section */
.education-wizard__section {
  margin-bottom: 2rem;
}

.education-wizard__section h3 {
  color: #374151;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

/* Form Groups */
.education-wizard__form-group {
  margin-bottom: 1.5rem;
}

.education-wizard__form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4b5563;
}

.education-wizard__form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.education-wizard__form-row .education-wizard__form-group {
  flex: 1;
  margin-bottom: 0;
}

/* Form Controls */
.education-wizard__input,
.education-wizard__select,
.education-wizard__textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.education-wizard__input:focus,
.education-wizard__select:focus,
.education-wizard__textarea:focus {
  outline: none;
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.education-wizard__textarea--small {
  min-height: 60px;
}

.education-wizard__select--small {
  max-width: 150px;
}

.education-wizard__date {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

/* Education Metrics */
.education-wizard__metrics {
  background-color: #f3f4f6;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.education-wizard__metrics h3 {
  margin-top: 0;
  color: #374151;
}

.education-wizard__metrics-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.education-wizard__metric-item {
  margin-bottom: 0.5rem;
}

.education-wizard__checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.education-wizard__checkbox {
  margin-right: 0.5rem;
}

/* Education Solutions */
.education-wizard__solutions {
  margin-bottom: 1.5rem;
}

.education-wizard__evidence-note {
  display: flex;
  align-items: center;
  background-color: #f0fdf4;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.education-wizard__evidence-icon {
  font-size: 1.5rem;
  margin-right: 0.75rem;
  color: #16a34a;
}

.education-wizard__evidence-note p {
  margin: 0;
  color: #166534;
  font-size: 0.875rem;
}

.education-wizard__solution-card {
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.education-wizard__solution-card:hover {
  border-color: #a7f3d0;
}

.education-wizard__solution-card.selected {
  border-color: #16a34a;
  background-color: #f0fdf4;
}

.education-wizard__solution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.education-wizard__solution-title {
  font-weight: 600;
  color: #1f2937;
}

.education-wizard__badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  text-transform: uppercase;
  font-weight: 600;
}

.education-wizard__badge.high {
  background-color: #d1fae5;
  color: #065f46;
}

.education-wizard__badge.medium {
  background-color: #fef3c7;
  color: #92400e;
}

.education-wizard__badge.low {
  background-color: #fee2e2;
  color: #b91c1c;
}

.education-wizard__badge.unknown {
  background-color: #e5e7eb;
  color: #4b5563;
}

.education-wizard__solution-description {
  margin-bottom: 0.75rem;
}

.education-wizard__solution-metadata {
  font-size: 0.875rem;
  color: #6b7280;
  padding-top: 0.75rem;
  border-top: 1px dashed #e5e7eb;
}

.education-wizard__evidence-level,
.education-wizard__timeframe,
.education-wizard__resource-intensity,
.education-wizard__pedagogical {
  margin-bottom: 0.25rem;
}

.education-wizard__custom-solution-controls {
  align-items: center;
}

/* Stakeholders */
.education-wizard__stakeholders {
  margin-bottom: 1.5rem;
}

.education-wizard__stakeholder-item {
  display: flex;
  margin-bottom: 1rem;
  gap: 0.75rem;
  align-items: flex-start;
}

.education-wizard__stakeholder-inputs {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.5rem;
}

.education-wizard__engagement-slider {
  margin-top: 0.5rem;
}

.education-wizard__slider {
  width: 100%;
}

/* Expertise */
.education-wizard__expertise-items {
  margin-bottom: 1.5rem;
}

.education-wizard__expertise-item {
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.education-wizard__expertise-inputs {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

/* Timeline */
.education-wizard__timeline {
  margin-bottom: 1.5rem;
}

.education-wizard__phases {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.education-wizard__phase {
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #16a34a;
}

.education-wizard__phase-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.education-wizard__phase-label {
  font-weight: 600;
  color: #16a34a;
}

.education-wizard__phase-duration {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Milestones */
.education-wizard__milestones {
  margin-bottom: 1.5rem;
}

.education-wizard__milestone-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.education-wizard__milestone-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.education-wizard__milestone-meta {
  display: flex;
  gap: 0.75rem;
}

/* Radio Group */
.education-wizard__radio-group {
  display: flex;
  gap: 1.5rem;
  margin: 0.5rem 0;
}

.education-wizard__radio {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.education-wizard__radio input {
  margin-right: 0.5rem;
}

/* Metrics Results */
.education-wizard__metrics-results {
  margin-bottom: 1.5rem;
}

.education-wizard__metric-result {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.education-wizard__metric-inputs {
  display: flex;
  flex: 1;
  gap: 0.75rem;
}

/* Buttons */
.education-wizard__button-row {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.education-wizard__button {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.education-wizard__button--primary {
  background-color: #16a34a;
  color: white;
}

.education-wizard__button--primary:hover {
  background-color: #15803d;
}

.education-wizard__button--primary:disabled {
  background-color: #a7f3d0;
  cursor: not-allowed;
}

.education-wizard__button--secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.education-wizard__button--secondary:hover {
  background-color: #e5e7eb;
}

.education-wizard__button--outline {
  background-color: transparent;
  border: 1px solid #d1d5db;
  color: #4b5563;
}

.education-wizard__button--outline:hover {
  background-color: #f9fafb;
}

.education-wizard__button--icon {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
}

.education-wizard__button--icon:hover {
  color: #ef4444;
}

/* Processing Overlay */
.education-wizard__overlay {
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

.education-wizard__processing {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.education-wizard__spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #16a34a;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: education-spinner 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes education-spinner {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.education-wizard__progress {
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  margin: 1rem 0 0.5rem;
  overflow: hidden;
}

.education-wizard__progress-bar {
  height: 100%;
  background-color: #16a34a;
  transition: width 0.3s ease;
}

.education-wizard__progress-text {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Results View */
.education-wizard__results {
  padding: 2rem;
}

.education-wizard__success-banner {
  background-color: #f0fdf4;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 2rem;
  border: 1px solid #d1fae5;
}

.education-wizard__success-icon {
  font-size: 2.5rem;
  color: #16a34a;
  background-color: #d1fae5;
  width: 60px;
  height: 60px;
  line-height: 60px;
  border-radius: 50%;
  margin: 0 auto 1rem;
}

.education-wizard__success-banner h2 {
  color: #166534;
  margin-bottom: 0.5rem;
}

.education-wizard__success-banner p {
  color: #15803d;
  margin: 0;
}

.education-wizard__results-summary {
  margin-top: 2rem;
}

.education-wizard__tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.education-wizard__tab {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.education-wizard__tab.active {
  color: #16a34a;
  border-bottom-color: #16a34a;
}

.education-wizard__tab-content {
  padding: 1rem 0;
}

.education-wizard__summary-card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.education-wizard__summary-card h3 {
  margin-top: 0;
  color: #16a34a;
  margin-bottom: 1rem;
}

.education-wizard__summary-item {
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.education-wizard__summary-item strong {
  color: #4b5563;
  font-weight: 600;
}

.education-wizard__status {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.education-wizard__status.success {
  background-color: #d1fae5;
  color: #065f46;
}

.education-wizard__status.warning {
  background-color: #fef3c7;
  color: #92400e;
}

.education-wizard__metrics-summary {
  margin-bottom: 1.5rem;
}

.education-wizard__metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.education-wizard__metric-card {
  background-color: #f0fdf4;
  border-radius: 8px;
  padding: 1.25rem;
  text-align: center;
}

.education-wizard__metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #16a34a;
  margin-bottom: 0.5rem;
}

.education-wizard__metric-name {
  color: #6b7280;
  font-size: 0.875rem;
}

.education-wizard__lessons-card {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
}

.education-wizard__lessons-card h3 {
  margin-top: 0;
  color: #4b5563;
  margin-bottom: 1rem;
}

.education-wizard__final-actions {
  margin-top: 2rem;
  justify-content: center;
  gap: 1rem;
}

/* Education Data Visualization */
.education-wizard__visualization {
  padding: 1.5rem;
}

.education-wizard__data-visualization {
  text-align: center;
}

.education-wizard__placeholder-chart {
  background-color: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.education-wizard__chart-title {
  font-weight: 600;
  margin-bottom: 1rem;
  color: #4b5563;
}

.education-wizard__chart-placeholder {
  height: 200px;
  background: linear-gradient(to right, #a7f3d0 10%, #6ee7b7 25%, #34d399 45%, #10b981 75%, #059669 100%);
  border-radius: 6px;
  position: relative;
}

.education-wizard__chart-placeholder::after {
  content: "Learning metrics visualization would appear here";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: 500;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.education-wizard__details pre {
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
  .education-wizard__form-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .education-wizard__stakeholder-inputs {
    flex-direction: column;
  }
  
  .education-wizard__expertise-inputs {
    flex-direction: column;
  }
  
  .education-wizard__milestone-content {
    flex-direction: column;
  }
  
  .education-wizard__tab {
    padding: 0.75rem 0.5rem;
    font-size: 0.875rem;
  }
  
  .education-wizard__metrics-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .education-wizard__button-row {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .education-wizard__button-row button {
    width: 100%;
  }
}
</style>