import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ModulesChallengeService {
    /**
     * Modules\Challenge\Http\Controllers\ChallengeController@index
     * @returns any Success
     * @throws ApiError
     */
    static challengeIndex({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/challenge',
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
     * Modules\Challenge\Http\Controllers\ChallengeController@store
     * @returns any Success
     * @throws ApiError
     */
    static challengeStore({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/challenge',
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
     * Modules\Challenge\Http\Controllers\AttachedChallengeController@finish
     * @returns any Success
     * @throws ApiError
     */
    static getApiChallengeFinishItem({ attached, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/challenge/finish/{attached}',
            path: {
                'attached': attached,
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
     * Modules\Challenge\Http\Controllers\AttachedChallengeController@getGlobalTasks
     * @returns any Success
     * @throws ApiError
     */
    static getApiChallengeGetChallengeGlobalTasksItemItem({ challenge, task, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/challenge/get-challenge-global-tasks/{challenge}/{task}',
            path: {
                'challenge': challenge,
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
     * Modules\Challenge\Http\Controllers\AttachedChallengeController@getTasks
     * @returns any Success
     * @throws ApiError
     */
    static getApiChallengeGetChallengeTasksItemItem({ challenge, chain, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/challenge/get-challenge-tasks/{challenge}/{chain}',
            path: {
                'challenge': challenge,
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
     * Modules\Challenge\Http\Controllers\AttachedChallengeController@get
     * @returns any Success
     * @throws ApiError
     */
    static getApiChallengeGetChallengeItemItem({ challenge, chain, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/challenge/get-challenge/{challenge}/{chain}',
            path: {
                'challenge': challenge,
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
     * Modules\Challenge\Http\Controllers\AttachedChallengeController@getGlobalChallenge
     * @returns any Success
     * @throws ApiError
     */
    static getApiChallengeGetGlobalChallengeItemItem({ challenge, task, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/challenge/get-global-challenge/{challenge}/{task}',
            path: {
                'challenge': challenge,
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
     * Modules\Challenge\Http\Controllers\ChallengeController@getTypes
     * @returns any Success
     * @throws ApiError
     */
    static getApiChallengeGetTypes({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/challenge/get-types',
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
     * Modules\Challenge\Http\Controllers\AttachedChallengeController@recordVideo
     * method recordVideo not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static postApiChallengeRecordVideo({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/challenge/record-video',
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
     * Modules\Challenge\Http\Controllers\AttachedChallengeController@run
     * @returns any Success
     * @throws ApiError
     */
    static postApiChallengeRun({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/challenge/run',
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
     * Modules\Challenge\Http\Controllers\AttachedChallengeController@runGlobal
     * @returns any Success
     * @throws ApiError
     */
    static postApiChallengeRunGlobal({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/challenge/run-global',
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
     * Modules\Challenge\Http\Controllers\AttachedChallengeController@setResult
     * @returns any Success
     * @throws ApiError
     */
    static postApiChallengeSetResultItem({ result, xDomain, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/challenge/set-result/{result}',
            path: {
                'result': result,
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
     * Modules\Challenge\Http\Controllers\AttachedChallengeController@startTask
     * @returns any Success
     * @throws ApiError
     */
    static postApiChallengeStartTask({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/challenge/start-task',
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
     * Modules\Challenge\Http\Controllers\ChallengeController@destroyTask
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiChallengeTaskDestroyItem({ task, xDomain, }) {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/challenge/task/destroy/{task}',
            path: {
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
     * Modules\Challenge\Http\Controllers\ChallengeController@show
     * @returns any Success
     * @throws ApiError
     */
    static challengeShow({ challenge, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/challenge/{challenge}',
            path: {
                'challenge': challenge,
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
     * Modules\Challenge\Http\Controllers\ChallengeController@update
     * @returns any Success
     * @throws ApiError
     */
    static challengeUpdate({ challenge, xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/challenge/{challenge}',
            path: {
                'challenge': challenge,
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
     * Modules\Challenge\Http\Controllers\ChallengeController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static challengeDestroy({ challenge, xDomain, }) {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/challenge/{challenge}',
            path: {
                'challenge': challenge,
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
     * Modules\Challenge\Http\Controllers\ChallengeController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolChallengeAll({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/protocol/challenge/all',
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
//# sourceMappingURL=ModulesChallengeService.js.map