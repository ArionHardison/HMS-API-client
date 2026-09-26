"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentsModuleApiClient = void 0;
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
const api_client_1 = require("../api-client");
/**
 * Public client over `/api/assessment*`, `/api/attend*`, `/api/choice*`,
 * `/api/protocol/assessment*`, `/api/question*`, `/api/response*`.
 * Subclasses `BaseApiClient` so it inherits auth / `X-Domain` / Laravel
 * `_method` override / `ApiError` normalization.
 */
class AssessmentsModuleApiClient extends api_client_1.BaseApiClient {
    // ---------------------------------------------------------------------------
    // assessment resource
    // ---------------------------------------------------------------------------
    /** GET `/api/assessment`. (`assessment.index`) */
    listAssessments(opts) {
        return this.get('/api/assessment', undefined, opts);
    }
    /** POST `/api/assessment`. (`assessment.store`) */
    createAssessment(body, opts) {
        return this.post('/api/assessment', body, opts);
    }
    /** GET `/api/assessment/run-global/{assessment}/{task}`. (`get.api.assessment.run-global.item.item`) */
    runAssessmentGlobal(assessment, task, opts) {
        return this.get(`/api/assessment/run-global/${encodeURIComponent(String(assessment))}/${encodeURIComponent(String(task))}`, undefined, opts);
    }
    /** GET `/api/assessment/run/{assessment}/{chain}`. (`get.api.assessment.run.item.item`) */
    runAssessment(assessment, chain, opts) {
        return this.get(`/api/assessment/run/${encodeURIComponent(String(assessment))}/${encodeURIComponent(String(chain))}`, undefined, opts);
    }
    /** GET `/api/assessment/{assessment}`. (`assessment.show`) */
    showAssessment(assessment, opts) {
        return this.get(`/api/assessment/${encodeURIComponent(String(assessment))}`, undefined, opts);
    }
    /** PUT `/api/assessment/{assessment}` — POST + `?_method=PUT`. (`assessment.update`) */
    updateAssessment(assessment, body, opts) {
        return this.put(`/api/assessment/${encodeURIComponent(String(assessment))}`, body, opts);
    }
    /** DELETE `/api/assessment/{assessment}`. (`assessment.destroy`) */
    destroyAssessment(assessment, opts) {
        return this.delete(`/api/assessment/${encodeURIComponent(String(assessment))}`, opts);
    }
    // ---------------------------------------------------------------------------
    // attend resource
    // ---------------------------------------------------------------------------
    /** GET `/api/attend`. (`attend.index`) */
    listAttends(opts) {
        return this.get('/api/attend', undefined, opts);
    }
    /** POST `/api/attend`. (`attend.store`) */
    createAttend(body, opts) {
        return this.post('/api/attend', body, opts);
    }
    /** GET `/api/attend/all`. (`get.api.attend.all`) */
    listAllAttends(opts) {
        return this.get('/api/attend/all', undefined, opts);
    }
    /** GET `/api/attend/{attend}`. (`attend.show`) */
    showAttend(attend, opts) {
        return this.get(`/api/attend/${encodeURIComponent(String(attend))}`, undefined, opts);
    }
    /** PUT `/api/attend/{attend}`. (`attend.update`) */
    updateAttend(attend, body, opts) {
        return this.put(`/api/attend/${encodeURIComponent(String(attend))}`, body, opts);
    }
    /** DELETE `/api/attend/{attend}`. (`attend.destroy`) */
    destroyAttend(attend, opts) {
        return this.delete(`/api/attend/${encodeURIComponent(String(attend))}`, opts);
    }
    // ---------------------------------------------------------------------------
    // choice
    // ---------------------------------------------------------------------------
    /** DELETE `/api/choice/{choice}`. (`delete.api.choice.item`) */
    destroyChoice(choice, opts) {
        return this.delete(`/api/choice/${encodeURIComponent(String(choice))}`, opts);
    }
    // ---------------------------------------------------------------------------
    // protocol integration
    // ---------------------------------------------------------------------------
    /** GET `/api/protocol/assessment/all`. (`get.api.protocol.assessment.all`) */
    listProtocolAssessments(opts) {
        return this.get('/api/protocol/assessment/all', undefined, opts);
    }
    /** GET `/api/protocol/assessment/item-instances/{assessment}`. (`get.api.protocol.assessment.item-instances.item`) */
    protocolItemInstances(assessment, opts) {
        return this.get(`/api/protocol/assessment/item-instances/${encodeURIComponent(String(assessment))}`, undefined, opts);
    }
    // ---------------------------------------------------------------------------
    // question resource
    // ---------------------------------------------------------------------------
    /** GET `/api/question`. (`question.index`) */
    listQuestions(opts) {
        return this.get('/api/question', undefined, opts);
    }
    /** POST `/api/question`. (`question.store`) */
    createQuestion(body, opts) {
        return this.post('/api/question', body, opts);
    }
    /** GET `/api/question/all`. (`get.api.question.all`) */
    listAllQuestions(opts) {
        return this.get('/api/question/all', undefined, opts);
    }
    /** GET `/api/question/by-assessment-full/{assessment}`. (`get.api.question.by-assessment-full.item`) */
    questionsByAssessmentFull(assessment, opts) {
        return this.get(`/api/question/by-assessment-full/${encodeURIComponent(String(assessment))}`, undefined, opts);
    }
    /** GET `/api/question/by-assessment/{assessment}`. (`get.api.question.by-assessment.item`) */
    questionsByAssessment(assessment, opts) {
        return this.get(`/api/question/by-assessment/${encodeURIComponent(String(assessment))}`, undefined, opts);
    }
    /** GET `/api/question/{question}`. (`question.show`) */
    showQuestion(question, opts) {
        return this.get(`/api/question/${encodeURIComponent(String(question))}`, undefined, opts);
    }
    /** PUT `/api/question/{question}`. (`question.update`) */
    updateQuestion(question, body, opts) {
        return this.put(`/api/question/${encodeURIComponent(String(question))}`, body, opts);
    }
    /** DELETE `/api/question/{question}`. (`question.destroy`) */
    destroyQuestion(question, opts) {
        return this.delete(`/api/question/${encodeURIComponent(String(question))}`, opts);
    }
    // ---------------------------------------------------------------------------
    // response resource (note `/api/response` POST and `/api/response/store` POST coexist)
    // ---------------------------------------------------------------------------
    /** GET `/api/response`. (`response.index`) */
    listResponses(opts) {
        return this.get('/api/response', undefined, opts);
    }
    /** POST `/api/response`. (`response.store`) */
    createResponse(body, opts) {
        return this.post('/api/response', body, opts);
    }
    /** GET `/api/response/all`. (`get.api.response.all`) */
    listAllResponses(opts) {
        return this.get('/api/response/all', undefined, opts);
    }
    /** POST `/api/response/store` — alternate creation route. (`post.api.response.store`) */
    storeResponse(body, opts) {
        return this.post('/api/response/store', body, opts);
    }
    /** GET `/api/response/{response}`. (`response.show`) */
    showResponse(response, opts) {
        return this.get(`/api/response/${encodeURIComponent(String(response))}`, undefined, opts);
    }
    /** PUT `/api/response/{response}`. (`response.update`) */
    updateResponse(response, body, opts) {
        return this.put(`/api/response/${encodeURIComponent(String(response))}`, body, opts);
    }
    /** DELETE `/api/response/{response}`. (`response.destroy`) */
    destroyResponse(response, opts) {
        return this.delete(`/api/response/${encodeURIComponent(String(response))}`, opts);
    }
}
exports.AssessmentsModuleApiClient = AssessmentsModuleApiClient;
//# sourceMappingURL=modules-assessments-api-client.js.map