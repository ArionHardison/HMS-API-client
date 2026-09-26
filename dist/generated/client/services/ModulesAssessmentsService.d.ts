import type { AttendResource } from '../models/AttendResource';
import type { CreateAttendRequest } from '../models/CreateAttendRequest';
import type { CreateQuestionRequest } from '../models/CreateQuestionRequest';
import type { CreateResponseRequest } from '../models/CreateResponseRequest';
import type { CreateSurveyRequest } from '../models/CreateSurveyRequest';
import type { GeneratedSurveyResource } from '../models/GeneratedSurveyResource';
import type { ProtocolAssessmentQuestionsWithScoreResource } from '../models/ProtocolAssessmentQuestionsWithScoreResource';
import type { QuestionChoiceResource } from '../models/QuestionChoiceResource';
import type { QuestionResource } from '../models/QuestionResource';
import type { QuestionsListResource } from '../models/QuestionsListResource';
import type { ResponseResource } from '../models/ResponseResource';
import type { SurveyResource } from '../models/SurveyResource';
import type { UpdateAttendRequest } from '../models/UpdateAttendRequest';
import type { UpdateQuestionRequest } from '../models/UpdateQuestionRequest';
import type { UpdateResponseRequest } from '../models/UpdateResponseRequest';
import type { UpdateSurveyRequest } from '../models/UpdateSurveyRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class ModulesAssessmentsService {
    /**
     * Modules\Assessments\Http\Controllers\SurveyController@index
     * @returns any Success
     * @throws ApiError
     */
    static assessmentIndex({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: Array<SurveyResource>;
        links?: Record<string, any>;
        meta?: Record<string, any>;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\SurveyController@store
     * @returns any Success
     * @throws ApiError
     */
    static assessmentStore({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: CreateSurveyRequest;
    }): CancelablePromise<{
        data: SurveyResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\SurveyController@runGlobal
     * @returns any Success
     * @throws ApiError
     */
    static getApiAssessmentRunGlobalItemItem({ assessment, task, xDomain, }: {
        assessment: string;
        task: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: GeneratedSurveyResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\SurveyController@run
     * @returns any Success
     * @throws ApiError
     */
    static getApiAssessmentRunItemItem({ assessment, chain, xDomain, }: {
        assessment: string;
        chain: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: GeneratedSurveyResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\SurveyController@show
     * @returns any Success
     * @throws ApiError
     */
    static assessmentShow({ assessment, xDomain, }: {
        /**
         * Bound to model Survey
         */
        assessment: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: SurveyResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\SurveyController@update
     * @returns any Success
     * @throws ApiError
     */
    static assessmentUpdate({ assessment, xDomain, requestBody, }: {
        /**
         * Bound to model Survey
         */
        assessment: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: UpdateSurveyRequest;
    }): CancelablePromise<{
        data: SurveyResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\SurveyController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static assessmentDestroy({ assessment, xDomain, }: {
        /**
         * Bound to model Survey
         */
        assessment: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: SurveyResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\AttendController@index
     * @returns any Success
     * @throws ApiError
     */
    static attendIndex({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: Array<AttendResource>;
        links?: Record<string, any>;
        meta?: Record<string, any>;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\AttendController@store
     * @returns any Success
     * @throws ApiError
     */
    static attendStore({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: CreateAttendRequest;
    }): CancelablePromise<{
        data: AttendResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\AttendController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiAttendAll({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: AttendResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\AttendController@show
     * @returns any Success
     * @throws ApiError
     */
    static attendShow({ attend, xDomain, }: {
        attend: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: AttendResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\AttendController@update
     * @returns any Success
     * @throws ApiError
     */
    static attendUpdate({ attend, xDomain, requestBody, }: {
        attend: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: UpdateAttendRequest;
    }): CancelablePromise<{
        data: AttendResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\AttendController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static attendDestroy({ attend, xDomain, }: {
        attend: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: AttendResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\QuestionController@destroyChoice
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiChoiceItem({ choice, xDomain, }: {
        /**
         * Bound to model QuestionChoice
         */
        choice: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: QuestionChoiceResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\ProtocolIntegrationController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolAssessmentAll({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<Record<string, any>>;
    /**
     * Modules\Assessments\Http\Controllers\ProtocolIntegrationController@assessmentInstances
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolAssessmentItemInstancesItem({ assessment, xDomain, }: {
        assessment: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ProtocolAssessmentQuestionsWithScoreResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\QuestionController@index
     * method index not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static questionIndex({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<Record<string, any>>;
    /**
     * Modules\Assessments\Http\Controllers\QuestionController@store
     * @returns any Success
     * @throws ApiError
     */
    static questionStore({ xDomain, formData, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        formData: CreateQuestionRequest;
    }): CancelablePromise<{
        data: QuestionResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\QuestionController@all
     * method all not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static getApiQuestionAll({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<Record<string, any>>;
    /**
     * Modules\Assessments\Http\Controllers\QuestionController@getFullByAssessment
     * @returns any Success
     * @throws ApiError
     */
    static getApiQuestionByAssessmentFullItem({ assessment, xDomain, }: {
        assessment: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: QuestionsListResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\QuestionController@getByAssessment
     * @returns any Success
     * @throws ApiError
     */
    static getApiQuestionByAssessmentItem({ assessment, xDomain, }: {
        assessment: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: QuestionsListResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\QuestionController@show
     * @returns any Success
     * @throws ApiError
     */
    static questionShow({ question, xDomain, }: {
        /**
         * Bound to model Question
         */
        question: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: QuestionResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\QuestionController@update
     * @returns any Success
     * @throws ApiError
     */
    static questionUpdate({ question, xDomain, formData, }: {
        /**
         * Bound to model Question
         */
        question: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        formData: UpdateQuestionRequest;
    }): CancelablePromise<{
        data: QuestionResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\QuestionController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static questionDestroy({ question, xDomain, }: {
        /**
         * Bound to model Question
         */
        question: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: QuestionResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\ResponseController@index
     * @returns any Success
     * @throws ApiError
     */
    static responseIndex({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: Array<ResponseResource>;
        links?: Record<string, any>;
        meta?: Record<string, any>;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\ResponseController@store
     * @returns any Success
     * @throws ApiError
     */
    static responseStore({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: CreateResponseRequest;
    }): CancelablePromise<{
        data: ResponseResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\ResponseController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiResponseAll({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ResponseResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\ResponseController@store
     * @returns any Success
     * @throws ApiError
     */
    static postApiResponseStore({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: CreateResponseRequest;
    }): CancelablePromise<{
        data: ResponseResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\ResponseController@show
     * @returns any Success
     * @throws ApiError
     */
    static responseShow({ response, xDomain, }: {
        response: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ResponseResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\ResponseController@update
     * @returns any Success
     * @throws ApiError
     */
    static responseUpdate({ response, xDomain, requestBody, }: {
        response: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: UpdateResponseRequest;
    }): CancelablePromise<{
        data: ResponseResource;
    }>;
    /**
     * Modules\Assessments\Http\Controllers\ResponseController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static responseDestroy({ response, xDomain, }: {
        response: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ResponseResource;
    }>;
}
//# sourceMappingURL=ModulesAssessmentsService.d.ts.map