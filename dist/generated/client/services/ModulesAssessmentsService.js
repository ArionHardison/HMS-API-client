"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModulesAssessmentsService = void 0;
const OpenAPI_1 = require("../core/OpenAPI");
const request_1 = require("../core/request");
class ModulesAssessmentsService {
    /**
     * Modules\Assessments\Http\Controllers\SurveyController@index
     * @returns any Success
     * @throws ApiError
     */
    static assessmentIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/assessment',
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\SurveyController@store
     * @returns any Success
     * @throws ApiError
     */
    static assessmentStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/assessment',
            headers: {
                'X-Domain': xDomain,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\SurveyController@runGlobal
     * @returns any Success
     * @throws ApiError
     */
    static getApiAssessmentRunGlobalItemItem({ assessment, task, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/assessment/run-global/{assessment}/{task}',
            path: {
                'assessment': assessment,
                'task': task,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\SurveyController@run
     * @returns any Success
     * @throws ApiError
     */
    static getApiAssessmentRunItemItem({ assessment, chain, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/assessment/run/{assessment}/{chain}',
            path: {
                'assessment': assessment,
                'chain': chain,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\SurveyController@show
     * @returns any Success
     * @throws ApiError
     */
    static assessmentShow({ assessment, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/assessment/{assessment}',
            path: {
                'assessment': assessment,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\SurveyController@update
     * @returns any Success
     * @throws ApiError
     */
    static assessmentUpdate({ assessment, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/assessment/{assessment}',
            path: {
                'assessment': assessment,
            },
            headers: {
                'X-Domain': xDomain,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\SurveyController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static assessmentDestroy({ assessment, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/assessment/{assessment}',
            path: {
                'assessment': assessment,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\AttendController@index
     * @returns any Success
     * @throws ApiError
     */
    static attendIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/attend',
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\AttendController@store
     * @returns any Success
     * @throws ApiError
     */
    static attendStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/attend',
            headers: {
                'X-Domain': xDomain,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\AttendController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiAttendAll({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/attend/all',
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\AttendController@show
     * @returns any Success
     * @throws ApiError
     */
    static attendShow({ attend, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/attend/{attend}',
            path: {
                'attend': attend,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\AttendController@update
     * @returns any Success
     * @throws ApiError
     */
    static attendUpdate({ attend, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/attend/{attend}',
            path: {
                'attend': attend,
            },
            headers: {
                'X-Domain': xDomain,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\AttendController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static attendDestroy({ attend, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/attend/{attend}',
            path: {
                'attend': attend,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\QuestionController@destroyChoice
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiChoiceItem({ choice, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/choice/{choice}',
            path: {
                'choice': choice,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\ProtocolIntegrationController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolAssessmentAll({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/assessment/all',
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\ProtocolIntegrationController@assessmentInstances
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolAssessmentItemInstancesItem({ assessment, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/assessment/item-instances/{assessment}',
            path: {
                'assessment': assessment,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\QuestionController@index
     * method index not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static questionIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/question',
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\QuestionController@store
     * @returns any Success
     * @throws ApiError
     */
    static questionStore({ xDomain, formData, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/question',
            headers: {
                'X-Domain': xDomain,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\QuestionController@all
     * method all not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static getApiQuestionAll({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/question/all',
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\QuestionController@getFullByAssessment
     * @returns any Success
     * @throws ApiError
     */
    static getApiQuestionByAssessmentFullItem({ assessment, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/question/by-assessment-full/{assessment}',
            path: {
                'assessment': assessment,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\QuestionController@getByAssessment
     * @returns any Success
     * @throws ApiError
     */
    static getApiQuestionByAssessmentItem({ assessment, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/question/by-assessment/{assessment}',
            path: {
                'assessment': assessment,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\QuestionController@show
     * @returns any Success
     * @throws ApiError
     */
    static questionShow({ question, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/question/{question}',
            path: {
                'question': question,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\QuestionController@update
     * @returns any Success
     * @throws ApiError
     */
    static questionUpdate({ question, xDomain, formData, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/question/{question}',
            path: {
                'question': question,
            },
            headers: {
                'X-Domain': xDomain,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\QuestionController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static questionDestroy({ question, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/question/{question}',
            path: {
                'question': question,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\ResponseController@index
     * @returns any Success
     * @throws ApiError
     */
    static responseIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/response',
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\ResponseController@store
     * @returns any Success
     * @throws ApiError
     */
    static responseStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/response',
            headers: {
                'X-Domain': xDomain,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\ResponseController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiResponseAll({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/response/all',
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\ResponseController@store
     * @returns any Success
     * @throws ApiError
     */
    static postApiResponseStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/response/store',
            headers: {
                'X-Domain': xDomain,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\ResponseController@show
     * @returns any Success
     * @throws ApiError
     */
    static responseShow({ response, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/response/{response}',
            path: {
                'response': response,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\ResponseController@update
     * @returns any Success
     * @throws ApiError
     */
    static responseUpdate({ response, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/response/{response}',
            path: {
                'response': response,
            },
            headers: {
                'X-Domain': xDomain,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Assessments\Http\Controllers\ResponseController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static responseDestroy({ response, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/response/{response}',
            path: {
                'response': response,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
}
exports.ModulesAssessmentsService = ModulesAssessmentsService;
//# sourceMappingURL=ModulesAssessmentsService.js.map