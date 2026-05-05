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
import type {
  AssessmentId,
  AssessmentItemInstanceResource,
  AssessmentResource,
  AssessmentsProtocolIntegrationResource,
  AttendId,
  AttendResource,
  ChainOrTaskId,
  ChoiceId,
  CreateAssessmentInput,
  CreateAttendInput,
  CreateQuestionInput,
  CreateResponseInput,
  QuestionId,
  QuestionResource,
  ResponseId,
  ResponseResource,
  RunAssessmentResponse,
} from '../types/modules-assessments';

/**
 * Public client over `/api/assessment*`, `/api/attend*`, `/api/choice*`,
 * `/api/protocol/assessment*`, `/api/question*`, `/api/response*`.
 * Subclasses `BaseApiClient` so it inherits auth / `X-Domain` / Laravel
 * `_method` override / `ApiError` normalization.
 */
export class AssessmentsModuleApiClient extends BaseApiClient {
  // ---------------------------------------------------------------------------
  // assessment resource
  // ---------------------------------------------------------------------------

  /** GET `/api/assessment`. (`assessment.index`) */
  listAssessments(opts?: ApiRequestOptions): Promise<ApiResponse<AssessmentResource[]>> {
    return this.get<AssessmentResource[]>('/api/assessment', undefined, opts);
  }

  /** POST `/api/assessment`. (`assessment.store`) */
  createAssessment(
    body: CreateAssessmentInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<AssessmentResource>> {
    return this.post<AssessmentResource>('/api/assessment', body, opts);
  }

  /** GET `/api/assessment/run-global/{assessment}/{task}`. (`get.api.assessment.run-global.item.item`) */
  runAssessmentGlobal(
    assessment: AssessmentId,
    task: ChainOrTaskId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<RunAssessmentResponse>> {
    return this.get<RunAssessmentResponse>(
      `/api/assessment/run-global/${encodeURIComponent(String(assessment))}/${encodeURIComponent(String(task))}`,
      undefined,
      opts,
    );
  }

  /** GET `/api/assessment/run/{assessment}/{chain}`. (`get.api.assessment.run.item.item`) */
  runAssessment(
    assessment: AssessmentId,
    chain: ChainOrTaskId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<RunAssessmentResponse>> {
    return this.get<RunAssessmentResponse>(
      `/api/assessment/run/${encodeURIComponent(String(assessment))}/${encodeURIComponent(String(chain))}`,
      undefined,
      opts,
    );
  }

  /** GET `/api/assessment/{assessment}`. (`assessment.show`) */
  showAssessment(
    assessment: AssessmentId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<AssessmentResource>> {
    return this.get<AssessmentResource>(
      `/api/assessment/${encodeURIComponent(String(assessment))}`,
      undefined,
      opts,
    );
  }

  /** PUT `/api/assessment/{assessment}` — POST + `?_method=PUT`. (`assessment.update`) */
  updateAssessment(
    assessment: AssessmentId,
    body: Partial<CreateAssessmentInput>,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<AssessmentResource>> {
    return this.put<AssessmentResource>(
      `/api/assessment/${encodeURIComponent(String(assessment))}`,
      body,
      opts,
    );
  }

  /** DELETE `/api/assessment/{assessment}`. (`assessment.destroy`) */
  destroyAssessment(
    assessment: AssessmentId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<null>> {
    return this.delete<null>(
      `/api/assessment/${encodeURIComponent(String(assessment))}`,
      opts,
    );
  }

  // ---------------------------------------------------------------------------
  // attend resource
  // ---------------------------------------------------------------------------

  /** GET `/api/attend`. (`attend.index`) */
  listAttends(opts?: ApiRequestOptions): Promise<ApiResponse<AttendResource[]>> {
    return this.get<AttendResource[]>('/api/attend', undefined, opts);
  }

  /** POST `/api/attend`. (`attend.store`) */
  createAttend(
    body: CreateAttendInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<AttendResource>> {
    return this.post<AttendResource>('/api/attend', body, opts);
  }

  /** GET `/api/attend/all`. (`get.api.attend.all`) */
  listAllAttends(opts?: ApiRequestOptions): Promise<ApiResponse<AttendResource[]>> {
    return this.get<AttendResource[]>('/api/attend/all', undefined, opts);
  }

  /** GET `/api/attend/{attend}`. (`attend.show`) */
  showAttend(attend: AttendId, opts?: ApiRequestOptions): Promise<ApiResponse<AttendResource>> {
    return this.get<AttendResource>(`/api/attend/${encodeURIComponent(String(attend))}`, undefined, opts);
  }

  /** PUT `/api/attend/{attend}`. (`attend.update`) */
  updateAttend(
    attend: AttendId,
    body: Partial<CreateAttendInput>,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<AttendResource>> {
    return this.put<AttendResource>(`/api/attend/${encodeURIComponent(String(attend))}`, body, opts);
  }

  /** DELETE `/api/attend/{attend}`. (`attend.destroy`) */
  destroyAttend(attend: AttendId, opts?: ApiRequestOptions): Promise<ApiResponse<null>> {
    return this.delete<null>(`/api/attend/${encodeURIComponent(String(attend))}`, opts);
  }

  // ---------------------------------------------------------------------------
  // choice
  // ---------------------------------------------------------------------------

  /** DELETE `/api/choice/{choice}`. (`delete.api.choice.item`) */
  destroyChoice(choice: ChoiceId, opts?: ApiRequestOptions): Promise<ApiResponse<null>> {
    return this.delete<null>(`/api/choice/${encodeURIComponent(String(choice))}`, opts);
  }

  // ---------------------------------------------------------------------------
  // protocol integration
  // ---------------------------------------------------------------------------

  /** GET `/api/protocol/assessment/all`. (`get.api.protocol.assessment.all`) */
  listProtocolAssessments(
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<AssessmentsProtocolIntegrationResource[]>> {
    return this.get<AssessmentsProtocolIntegrationResource[]>('/api/protocol/assessment/all', undefined, opts);
  }

  /** GET `/api/protocol/assessment/item-instances/{assessment}`. (`get.api.protocol.assessment.item-instances.item`) */
  protocolItemInstances(
    assessment: AssessmentId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<AssessmentItemInstanceResource[]>> {
    return this.get<AssessmentItemInstanceResource[]>(
      `/api/protocol/assessment/item-instances/${encodeURIComponent(String(assessment))}`,
      undefined,
      opts,
    );
  }

  // ---------------------------------------------------------------------------
  // question resource
  // ---------------------------------------------------------------------------

  /** GET `/api/question`. (`question.index`) */
  listQuestions(opts?: ApiRequestOptions): Promise<ApiResponse<QuestionResource[]>> {
    return this.get<QuestionResource[]>('/api/question', undefined, opts);
  }

  /** POST `/api/question`. (`question.store`) */
  createQuestion(
    body: CreateQuestionInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<QuestionResource>> {
    return this.post<QuestionResource>('/api/question', body, opts);
  }

  /** GET `/api/question/all`. (`get.api.question.all`) */
  listAllQuestions(opts?: ApiRequestOptions): Promise<ApiResponse<QuestionResource[]>> {
    return this.get<QuestionResource[]>('/api/question/all', undefined, opts);
  }

  /** GET `/api/question/by-assessment-full/{assessment}`. (`get.api.question.by-assessment-full.item`) */
  questionsByAssessmentFull(
    assessment: AssessmentId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<QuestionResource[]>> {
    return this.get<QuestionResource[]>(
      `/api/question/by-assessment-full/${encodeURIComponent(String(assessment))}`,
      undefined,
      opts,
    );
  }

  /** GET `/api/question/by-assessment/{assessment}`. (`get.api.question.by-assessment.item`) */
  questionsByAssessment(
    assessment: AssessmentId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<QuestionResource[]>> {
    return this.get<QuestionResource[]>(
      `/api/question/by-assessment/${encodeURIComponent(String(assessment))}`,
      undefined,
      opts,
    );
  }

  /** GET `/api/question/{question}`. (`question.show`) */
  showQuestion(question: QuestionId, opts?: ApiRequestOptions): Promise<ApiResponse<QuestionResource>> {
    return this.get<QuestionResource>(`/api/question/${encodeURIComponent(String(question))}`, undefined, opts);
  }

  /** PUT `/api/question/{question}`. (`question.update`) */
  updateQuestion(
    question: QuestionId,
    body: Partial<CreateQuestionInput>,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<QuestionResource>> {
    return this.put<QuestionResource>(`/api/question/${encodeURIComponent(String(question))}`, body, opts);
  }

  /** DELETE `/api/question/{question}`. (`question.destroy`) */
  destroyQuestion(question: QuestionId, opts?: ApiRequestOptions): Promise<ApiResponse<null>> {
    return this.delete<null>(`/api/question/${encodeURIComponent(String(question))}`, opts);
  }

  // ---------------------------------------------------------------------------
  // response resource (note `/api/response` POST and `/api/response/store` POST coexist)
  // ---------------------------------------------------------------------------

  /** GET `/api/response`. (`response.index`) */
  listResponses(opts?: ApiRequestOptions): Promise<ApiResponse<ResponseResource[]>> {
    return this.get<ResponseResource[]>('/api/response', undefined, opts);
  }

  /** POST `/api/response`. (`response.store`) */
  createResponse(
    body: CreateResponseInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ResponseResource>> {
    return this.post<ResponseResource>('/api/response', body, opts);
  }

  /** GET `/api/response/all`. (`get.api.response.all`) */
  listAllResponses(opts?: ApiRequestOptions): Promise<ApiResponse<ResponseResource[]>> {
    return this.get<ResponseResource[]>('/api/response/all', undefined, opts);
  }

  /** POST `/api/response/store` — alternate creation route. (`post.api.response.store`) */
  storeResponse(
    body: CreateResponseInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ResponseResource>> {
    return this.post<ResponseResource>('/api/response/store', body, opts);
  }

  /** GET `/api/response/{response}`. (`response.show`) */
  showResponse(response: ResponseId, opts?: ApiRequestOptions): Promise<ApiResponse<ResponseResource>> {
    return this.get<ResponseResource>(`/api/response/${encodeURIComponent(String(response))}`, undefined, opts);
  }

  /** PUT `/api/response/{response}`. (`response.update`) */
  updateResponse(
    response: ResponseId,
    body: Partial<CreateResponseInput>,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ResponseResource>> {
    return this.put<ResponseResource>(`/api/response/${encodeURIComponent(String(response))}`, body, opts);
  }

  /** DELETE `/api/response/{response}`. (`response.destroy`) */
  destroyResponse(response: ResponseId, opts?: ApiRequestOptions): Promise<ApiResponse<null>> {
    return this.delete<null>(`/api/response/${encodeURIComponent(String(response))}`, opts);
  }
}
