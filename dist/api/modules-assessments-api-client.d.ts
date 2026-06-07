/**
 * `Modules/Assessments` API client.
 *
 * Covers the 31 endpoints documented in `sdk/spec/endpoints.json` with
 * `module === "Modules/Assessments"`:
 *
 *   - 7 assessment endpoints (`assessment.{index,store,show,update,destroy}`
 *     plus `run-global/{assessment}/{task}` and `run/{assessment}/{chain}`)
 *   - 6 attend endpoints (`attend.{index,store,show,update,destroy}` plus
 *     `attend/all`)
 *   - 1 choice deletion (`/api/choice/{choice}`)
 *   - 2 protocol integrations (`/api/protocol/assessment/all` plus
 *     `/api/protocol/assessment/item-instances/{assessment}`)
 *   - 8 question endpoints (`question.{index,store,show,update,destroy}` plus
 *     `question/all`, `by-assessment`, `by-assessment-full`)
 *   - 7 response endpoints (`response.{index,store,show,update,destroy}` plus
 *     `response/all` and the parallel POST `response/store`)
 *
 * Naming policy: SDK methods are camelCase versions of the spec id minus
 * redundant prefixes; conflicts on bare `*.show` / `*.update` / `*.destroy`
 * across `assessment`, `attend`, `question`, `response` are namespaced
 * (`showAssessment`, `showAttend`, `showQuestion`, `showResponse`, etc).
 *
 * Class is named `AssessmentsModuleApiClient` to coexist with the legacy
 * `AssessmentsApiClient` in `hms-api-client.ts`. Do not refactor the legacy
 * client.
 *
 * Manifest oddity: `/api/response` (POST) and `/api/response/store` (POST)
 * both exist in the spec. The SDK exposes them as distinct methods
 * (`createResponse` and `storeResponse`) so callers can target either route.
 */
import { BaseApiClient } from '../api-client';
import type { ApiRequestOptions, ApiResponse } from '../api-client';
import type { AssessmentId, AssessmentItemInstanceResource, AssessmentResource, AssessmentsProtocolIntegrationResource, AttendId, AttendResource, ChainOrTaskId, ChoiceId, CreateAssessmentInput, CreateAttendInput, CreateQuestionInput, CreateResponseInput, QuestionId, QuestionResource, ResponseId, ResponseResource, RunAssessmentResponse } from '../types/modules-assessments';
/**
 * Public client over `/api/assessment*`, `/api/attend*`, `/api/choice*`,
 * `/api/protocol/assessment*`, `/api/question*`, `/api/response*`.
 * Subclasses `BaseApiClient` so it inherits auth / `X-Domain` / Laravel
 * `_method` override / `ApiError` normalization.
 */
export declare class AssessmentsModuleApiClient extends BaseApiClient {
    /** GET `/api/assessment`. (`assessment.index`) */
    listAssessments(opts?: ApiRequestOptions): Promise<ApiResponse<AssessmentResource[]>>;
    /** POST `/api/assessment`. (`assessment.store`) */
    createAssessment(body: CreateAssessmentInput, opts?: ApiRequestOptions): Promise<ApiResponse<AssessmentResource>>;
    /** GET `/api/assessment/run-global/{assessment}/{task}`. (`get.api.assessment.run-global.item.item`) */
    runAssessmentGlobal(assessment: AssessmentId, task: ChainOrTaskId, opts?: ApiRequestOptions): Promise<ApiResponse<RunAssessmentResponse>>;
    /** GET `/api/assessment/run/{assessment}/{chain}`. (`get.api.assessment.run.item.item`) */
    runAssessment(assessment: AssessmentId, chain: ChainOrTaskId, opts?: ApiRequestOptions): Promise<ApiResponse<RunAssessmentResponse>>;
    /** GET `/api/assessment/{assessment}`. (`assessment.show`) */
    showAssessment(assessment: AssessmentId, opts?: ApiRequestOptions): Promise<ApiResponse<AssessmentResource>>;
    /** PUT `/api/assessment/{assessment}` — POST + `?_method=PUT`. (`assessment.update`) */
    updateAssessment(assessment: AssessmentId, body: Partial<CreateAssessmentInput>, opts?: ApiRequestOptions): Promise<ApiResponse<AssessmentResource>>;
    /** DELETE `/api/assessment/{assessment}`. (`assessment.destroy`) */
    destroyAssessment(assessment: AssessmentId, opts?: ApiRequestOptions): Promise<ApiResponse<null>>;
    /** GET `/api/attend`. (`attend.index`) */
    listAttends(opts?: ApiRequestOptions): Promise<ApiResponse<AttendResource[]>>;
    /** POST `/api/attend`. (`attend.store`) */
    createAttend(body: CreateAttendInput, opts?: ApiRequestOptions): Promise<ApiResponse<AttendResource>>;
    /** GET `/api/attend/all`. (`get.api.attend.all`) */
    listAllAttends(opts?: ApiRequestOptions): Promise<ApiResponse<AttendResource[]>>;
    /** GET `/api/attend/{attend}`. (`attend.show`) */
    showAttend(attend: AttendId, opts?: ApiRequestOptions): Promise<ApiResponse<AttendResource>>;
    /** PUT `/api/attend/{attend}`. (`attend.update`) */
    updateAttend(attend: AttendId, body: Partial<CreateAttendInput>, opts?: ApiRequestOptions): Promise<ApiResponse<AttendResource>>;
    /** DELETE `/api/attend/{attend}`. (`attend.destroy`) */
    destroyAttend(attend: AttendId, opts?: ApiRequestOptions): Promise<ApiResponse<null>>;
    /** DELETE `/api/choice/{choice}`. (`delete.api.choice.item`) */
    destroyChoice(choice: ChoiceId, opts?: ApiRequestOptions): Promise<ApiResponse<null>>;
    /** GET `/api/protocol/assessment/all`. (`get.api.protocol.assessment.all`) */
    listProtocolAssessments(opts?: ApiRequestOptions): Promise<ApiResponse<AssessmentsProtocolIntegrationResource[]>>;
    /** GET `/api/protocol/assessment/item-instances/{assessment}`. (`get.api.protocol.assessment.item-instances.item`) */
    protocolItemInstances(assessment: AssessmentId, opts?: ApiRequestOptions): Promise<ApiResponse<AssessmentItemInstanceResource[]>>;
    /** GET `/api/question`. (`question.index`) */
    listQuestions(opts?: ApiRequestOptions): Promise<ApiResponse<QuestionResource[]>>;
    /** POST `/api/question`. (`question.store`) */
    createQuestion(body: CreateQuestionInput, opts?: ApiRequestOptions): Promise<ApiResponse<QuestionResource>>;
    /** GET `/api/question/all`. (`get.api.question.all`) */
    listAllQuestions(opts?: ApiRequestOptions): Promise<ApiResponse<QuestionResource[]>>;
    /** GET `/api/question/by-assessment-full/{assessment}`. (`get.api.question.by-assessment-full.item`) */
    questionsByAssessmentFull(assessment: AssessmentId, opts?: ApiRequestOptions): Promise<ApiResponse<QuestionResource[]>>;
    /** GET `/api/question/by-assessment/{assessment}`. (`get.api.question.by-assessment.item`) */
    questionsByAssessment(assessment: AssessmentId, opts?: ApiRequestOptions): Promise<ApiResponse<QuestionResource[]>>;
    /** GET `/api/question/{question}`. (`question.show`) */
    showQuestion(question: QuestionId, opts?: ApiRequestOptions): Promise<ApiResponse<QuestionResource>>;
    /** PUT `/api/question/{question}`. (`question.update`) */
    updateQuestion(question: QuestionId, body: Partial<CreateQuestionInput>, opts?: ApiRequestOptions): Promise<ApiResponse<QuestionResource>>;
    /** DELETE `/api/question/{question}`. (`question.destroy`) */
    destroyQuestion(question: QuestionId, opts?: ApiRequestOptions): Promise<ApiResponse<null>>;
    /** GET `/api/response`. (`response.index`) */
    listResponses(opts?: ApiRequestOptions): Promise<ApiResponse<ResponseResource[]>>;
    /** POST `/api/response`. (`response.store`) */
    createResponse(body: CreateResponseInput, opts?: ApiRequestOptions): Promise<ApiResponse<ResponseResource>>;
    /** GET `/api/response/all`. (`get.api.response.all`) */
    listAllResponses(opts?: ApiRequestOptions): Promise<ApiResponse<ResponseResource[]>>;
    /** POST `/api/response/store` — alternate creation route. (`post.api.response.store`) */
    storeResponse(body: CreateResponseInput, opts?: ApiRequestOptions): Promise<ApiResponse<ResponseResource>>;
    /** GET `/api/response/{response}`. (`response.show`) */
    showResponse(response: ResponseId, opts?: ApiRequestOptions): Promise<ApiResponse<ResponseResource>>;
    /** PUT `/api/response/{response}`. (`response.update`) */
    updateResponse(response: ResponseId, body: Partial<CreateResponseInput>, opts?: ApiRequestOptions): Promise<ApiResponse<ResponseResource>>;
    /** DELETE `/api/response/{response}`. (`response.destroy`) */
    destroyResponse(response: ResponseId, opts?: ApiRequestOptions): Promise<ApiResponse<null>>;
}
//# sourceMappingURL=modules-assessments-api-client.d.ts.map