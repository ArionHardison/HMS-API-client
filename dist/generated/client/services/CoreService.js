"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreService = void 0;
const OpenAPI_1 = require("../core/OpenAPI");
const request_1 = require("../core/request");
class CoreService {
    /**
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorsController@search
     * @returns any Success
     * @throws ApiError
     */
    static postApiAdminSearch({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/admin-search',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorsController@store
     * @returns any Success
     * @throws ApiError
     */
    static administratorStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/administrator',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorsController@show
     * @returns any Success
     * @throws ApiError
     */
    static administratorShow({ administrator, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/administrator/{administrator}',
            path: {
                'administrator': administrator,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorsController@update
     * @returns any Success
     * @throws ApiError
     */
    static administratorUpdate({ administrator, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/administrator/{administrator}',
            path: {
                'administrator': administrator,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorsController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static administratorDestroy({ administrator, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/administrator/{administrator}',
            path: {
                'administrator': administrator,
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
     * App\Http\Controllers\Core\AgentController@finishRegistration
     * @returns any Success
     * @throws ApiError
     */
    static postApiAgentAccountFinishRegistration({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/agent/account/finish-registration',
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
     * App\Http\Controllers\Core\AgentController@getAccountStatus
     * @returns any Success
     * @throws ApiError
     */
    static getApiAgentAccountGetStatus({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/agent/account/get-status',
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
     * App\Http\Controllers\Core\AgentController@confirmCode
     * @returns any Success
     * @throws ApiError
     */
    static postApiAgentAccountItemConfirmCode({ chain, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/agent/account/{chain}/confirm-code',
            path: {
                'chain': chain,
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
     * App\Http\Controllers\Core\AgentController@getAssignedExperts
     * @returns any Success
     * @throws ApiError
     */
    static getApiAgentCommunicateItemAssignedExperts({ chain, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/agent/communicate/{chain}/assigned-experts',
            path: {
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
     * App\Http\Controllers\Core\AgentController@getAgentStatus
     * @returns any Success
     * @throws ApiError
     */
    static getApiAgentCommunicateItemGetStatus({ chain, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/agent/communicate/{chain}/get-status',
            path: {
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
     * App\Http\Controllers\Core\AgentController@initializeAgent
     * @returns any Success
     * @throws ApiError
     */
    static getApiAgentCommunicateItemInitializeAgent({ chain, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/agent/communicate/{chain}/initialize-agent',
            path: {
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
     * App\Http\Controllers\Core\AgentController@getProgramInvites
     * @returns any Success
     * @throws ApiError
     */
    static getApiAgentCommunicateItemInvites({ chain, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/agent/communicate/{chain}/invites',
            path: {
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
     * App\Http\Controllers\Core\AgentController@getAgentMessages
     * @returns any Success
     * @throws ApiError
     */
    static postApiAgentCommunicateItemMessages({ chain, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/agent/communicate/{chain}/messages',
            path: {
                'chain': chain,
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
     * App\Http\Controllers\Core\AgentController@sendMessage
     * @returns any Success
     * @throws ApiError
     */
    static postApiAgentCommunicateItemSendMessage({ chain, xDomain, formData, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/agent/communicate/{chain}/send-message',
            path: {
                'chain': chain,
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
     * App\Http\Controllers\Core\AgentController@getAgentList
     * @returns any Success
     * @throws ApiError
     */
    static getApiAgentList({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/agent/list',
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
     * App\Http\Controllers\Core\AgentController@getProgramState
     * @returns any Success
     * @throws ApiError
     */
    static getApiAgentProgramStateItem({ chain, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/agent/program-state/{chain}',
            path: {
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
     * App\Http\Controllers\Core\AgentController@getProgramStatus
     * @returns any Success
     * @throws ApiError
     */
    static getApiAgentProgramStatusItem({ chain, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/agent/program-status/{chain}',
            path: {
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
     * App\Http\Controllers\Core\AgentController@retryProgramCreation
     * @returns any Success
     * @throws ApiError
     */
    static getApiAgentRetryCreationItem({ chain, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/agent/retry-creation/{chain}',
            path: {
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
     * App\Http\Controllers\Core\AiSettingsController@deleteModel
     * @returns post_api_ai_delete_modelResponse Success
     * @throws ApiError
     */
    static postApiAiDeleteModel({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/ai/delete-model',
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
     * App\Http\Controllers\Core\AiSettingsController@getListOfModels
     * @returns any Success
     * @throws ApiError
     */
    static getApiAiGetModels({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/ai/get-models',
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
     * App\Http\Controllers\Core\AiSettingsController@getListOfInstalledModels
     * @returns get_api_ai_get_models_listResponse Success
     * @throws ApiError
     */
    static getApiAiGetModelsList({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/ai/get-models-list',
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
     * App\Http\Controllers\Core\AiSettingsController@getSettings
     * @returns any Success
     * @throws ApiError
     */
    static getApiAiGetSettings({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/ai/get-settings',
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
     * App\Http\Controllers\Core\AiSettingsController@installModel
     * @returns post_api_ai_install_modelResponse Success
     * @throws ApiError
     */
    static postApiAiInstallModel({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/ai/install-model',
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
     * App\Http\Controllers\Core\AiSettingsController@checkInstallationStatus
     * @returns get_api_ai_installation_statusResponse Success
     * @throws ApiError
     */
    static getApiAiInstallationStatus({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/ai/installation-status',
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
     * App\Http\Controllers\Core\AiLogsController@index
     * @returns any Success
     * @throws ApiError
     */
    static adminAiLogIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/ai/log',
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
     * App\Http\Controllers\Core\AiLogsController@store
     * method store not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static adminAiLogStore({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/ai/log',
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
     * App\Http\Controllers\Core\AiLogsController@show
     * @returns any Success
     * @throws ApiError
     */
    static adminAiLogShow({ log, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/ai/log/{log}',
            path: {
                'log': log,
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
     * App\Http\Controllers\Core\AiLogsController@update
     * method update not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static adminAiLogUpdate({ log, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/ai/log/{log}',
            path: {
                'log': log,
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
     * App\Http\Controllers\Core\AiLogsController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static adminAiLogDestroy({ log, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/ai/log/{log}',
            path: {
                'log': log,
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
     * App\Http\Controllers\Core\PoliciesController@index
     * @returns any Success
     * @throws ApiError
     */
    static policyIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/ai/policy',
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
     * App\Http\Controllers\Core\PoliciesController@store
     * @returns policy_storeResponse Success
     * @throws ApiError
     */
    static policyStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/ai/policy',
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
     * App\Http\Controllers\Core\PoliciesController@deleteFile
     * @returns delete_api_ai_policy_file_itemResponse Success
     * @throws ApiError
     */
    static deleteApiAiPolicyFileItem({ file, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/ai/policy-file/{file}',
            path: {
                'file': file,
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
     * App\Http\Controllers\Core\PoliciesController@listByPrompt
     * @returns get_api_ai_policy_list_itemResponse Success
     * @throws ApiError
     */
    static getApiAiPolicyListItem({ prompt, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/ai/policy-list/{prompt}',
            path: {
                'prompt': prompt,
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
     * App\Http\Controllers\Core\PoliciesController@show
     * @returns policy_showResponse Success
     * @throws ApiError
     */
    static policyShow({ policy, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/ai/policy/{policy}',
            path: {
                'policy': policy,
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
     * App\Http\Controllers\Core\PoliciesController@update
     * @returns policy_updateResponse Success
     * @throws ApiError
     */
    static policyUpdate({ policy, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/ai/policy/{policy}',
            path: {
                'policy': policy,
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
     * App\Http\Controllers\Core\PoliciesController@destroy
     * @returns policy_destroyResponse Success
     * @throws ApiError
     */
    static policyDestroy({ policy, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/ai/policy/{policy}',
            path: {
                'policy': policy,
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
     * App\Http\Controllers\Core\PoliciesController@attachPrompt
     * @returns post_api_ai_policy_item_promptsResponse Success
     * @throws ApiError
     */
    static postApiAiPolicyItemPrompts({ policy, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/ai/policy/{policy}/prompts',
            path: {
                'policy': policy,
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
     * App\Http\Controllers\Core\PoliciesController@detachPrompt
     * @returns delete_api_ai_policy_item_prompts_itemResponse Success
     * @throws ApiError
     */
    static deleteApiAiPolicyItemPromptsItem({ policy, prompt, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/ai/policy/{policy}/prompts/{prompt}',
            path: {
                'policy': policy,
                'prompt': prompt,
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
     * App\Http\Controllers\Core\AiSettingsController@createPrompt
     * @returns any Success
     * @throws ApiError
     */
    static postApiAiPromptsCreate({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/ai/prompts/create',
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
     * App\Http\Controllers\Core\AiSettingsController@getPromptKeys
     * @returns any Success
     * @throws ApiError
     */
    static getApiAiPromptsKeywords({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/ai/prompts/keywords',
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
     * App\Http\Controllers\Core\AiSettingsController@indexPrompts
     * @returns any Success
     * @throws ApiError
     */
    static getApiAiPromptsList({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/ai/prompts/list',
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
     * App\Http\Controllers\Core\AiSettingsController@indexPolicies
     * @returns any Success
     * @throws ApiError
     */
    static getApiAiPromptsListPolicies({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/ai/prompts/list-policies',
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
     * App\Http\Controllers\Core\AiSettingsController@getRequiredList
     * @returns any Success
     * @throws ApiError
     */
    static getApiAiPromptsRequiredList({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/ai/prompts/required-list',
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
     * App\Http\Controllers\Core\AiSettingsController@getPrompt
     * @returns any Success
     * @throws ApiError
     */
    static getApiAiPromptsShowItem({ prompt, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/ai/prompts/show/{prompt}',
            path: {
                'prompt': prompt,
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
     * App\Http\Controllers\Core\AiSettingsController@updatePrompt
     * @returns any Success
     * @throws ApiError
     */
    static postApiAiPromptsUpdateItem({ prompt, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/ai/prompts/update/{prompt}',
            path: {
                'prompt': prompt,
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
     * App\Http\Controllers\Core\AiSettingsController@updatePrompt
     * @returns any Success
     * @throws ApiError
     */
    static putApiAiPromptsUpdateItem({ prompt, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/ai/prompts/update/{prompt}',
            path: {
                'prompt': prompt,
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
     * App\Http\Controllers\Core\AiSettingsController@saveSettings
     * @returns any Success
     * @throws ApiError
     */
    static postApiAiSaveSettings({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/ai/save-settings',
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
     * App\Http\Controllers\Core\Auth\LoginController@changeForcedPassword
     * @returns post_api_auth_change_forced_passwordResponse Success
     * @throws ApiError
     */
    static postApiAuthChangeForcedPassword({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/auth/change-forced-password',
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
     * App\Http\Controllers\Core\UsersController@authenticateAtTenant
     * method authenticateAtTenant not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static getApiAuthenticateAtItem({ tenant, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/authenticate-at/{tenant}',
            path: {
                'tenant': tenant,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectClientController@loadBoard
     * @returns any Success
     * @throws ApiError
     */
    static getApiBoard({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/board',
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
     * App\Http\Controllers\Core\Auth\LoginController@echoServerAuth
     * @returns post_api_broadcasting_authResponse Success
     * @throws ApiError
     */
    static postApiBroadcastingAuth({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/broadcasting/auth',
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
     * App\Http\Controllers\Core\ProtocolChainController@index
     * method index not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static chainIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/chain',
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
     * App\Http\Controllers\Core\ProtocolChainController@store
     * @returns any Success
     * @throws ApiError
     */
    static chainStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/chain',
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
     * App\Http\Controllers\Core\ProtocolChainController@switchParent
     * @returns any Success
     * @throws ApiError
     */
    static postApiChainSwitchParentItem({ protocol, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/chain/switch-parent/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\Core\ProtocolChainController@show
     * @returns any Success
     * @throws ApiError
     */
    static chainShow({ chain, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/chain/{chain}',
            path: {
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
     * App\Http\Controllers\Core\ProtocolChainController@update
     * @returns any Success
     * @throws ApiError
     */
    static chainUpdate({ chain, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/chain/{chain}',
            path: {
                'chain': chain,
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
     * App\Http\Controllers\Core\ProtocolChainController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static chainDestroy({ chain, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/chain/{chain}',
            path: {
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
     * App\Http\Controllers\Core\CoreChatController@broadcastMessage
     * @returns any Success
     * @throws ApiError
     */
    static postApiChatBroadcastMessage({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/chat/broadcast-message',
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
     * App\Http\Controllers\Core\CoreChatController@getBroadcastMessagesByType
     * @returns any Success
     * @throws ApiError
     */
    static getApiChatBroadcastMessagesItemItem({ type, xDomain, program, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/chat/broadcast-messages/{type}/{program}',
            path: {
                'type': type,
                'program': program,
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
     * App\Http\Controllers\Core\CoreChatController@deleteMessage
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiChatDeleteMessageItem({ message, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/chat/delete-message/{message}',
            path: {
                'message': message,
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
     * App\Http\Controllers\Core\CoreChatController@deleteChat
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiChatDeleteHatItem({ chat, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/chat/delete-сhat/{chat}',
            path: {
                'chat': chat,
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
     * App\Http\Controllers\Core\CoreChatController@findUserToChat
     * @returns any Success
     * @throws ApiError
     */
    static getApiChatFindUserItem({ search, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/chat/find-user/{search}',
            path: {
                'search': search,
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
     * App\Http\Controllers\Core\CoreChatController@getList
     * @returns any Success
     * @throws ApiError
     */
    static getApiChatGetListItem({ xDomain, search, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/chat/get-list/{search}',
            path: {
                'search': search,
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
     * App\Http\Controllers\Core\CoreChatController@getNewChat
     * @returns any Success
     * @throws ApiError
     */
    static getApiChatGetNewChatItem({ room, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/chat/get-new-chat/{room}',
            path: {
                'room': room,
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
     * App\Http\Controllers\Core\CoreChatController@getRoom
     * @returns any Success
     * @throws ApiError
     */
    static postApiChatGetRoom({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/chat/get-room',
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
     * App\Http\Controllers\Core\CoreChatController@getRoomById
     * @returns any Success
     * @throws ApiError
     */
    static getApiChatGetRoomByIdItem({ room, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/chat/get-room-by-id/{room}',
            path: {
                'room': room,
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
     * App\Http\Controllers\Core\CoreChatController@getMessagesByChat
     * @returns any Success
     * @throws ApiError
     */
    static getApiChatMessagesItemItem({ chat, xDomain, search, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/chat/messages/{chat}/{search}',
            path: {
                'chat': chat,
                'search': search,
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
     * App\Http\Controllers\Core\ProgramController@getChatPrograms
     * @returns any Success
     * @throws ApiError
     */
    static getApiChatPrograms({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/chat/programs',
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
     * App\Http\Controllers\Core\CoreChatController@sendMessage
     * @returns any Success
     * @throws ApiError
     */
    static postApiChatSendMessage({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/chat/send-message',
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
     * App\Http\Controllers\Core\CoreChatController@startSpecialChat
     * @returns any Success
     * @throws ApiError
     */
    static postApiChatStart({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/chat/start',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsContactsController@deleteContact
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiContactsDeleteItem({ contact, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/contacts/delete/{contact}',
            path: {
                'contact': contact,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsContactsController@findContacts
     * @returns any Success
     * @throws ApiError
     */
    static postApiContactsFindItem({ xDomain, requestBody, subproject, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/contacts/find/{subproject}',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsContactsController@hasContacts
     * @returns any Success
     * @throws ApiError
     */
    static getApiContactsHasContacts({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/contacts/has-contacts',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsContactsController@importContacts
     * @returns any Success
     * @throws ApiError
     */
    static postApiContactsImport({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/contacts/import',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsContactsController@index
     * @returns any Success
     * @throws ApiError
     */
    static postApiContactsList({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/contacts/list',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsContactsController@getContacts
     * @returns any Success
     * @throws ApiError
     */
    static getApiContactsRunningImport({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/contacts/running-import',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsContactsController@saveContacts
     * @returns any Success
     * @throws ApiError
     */
    static postApiContactsSave({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/contacts/save',
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
     * App\Http\Controllers\Core\Dashboard\CreatorsController@index
     * @returns any Success
     * @throws ApiError
     */
    static creatorIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/creator',
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
     * App\Http\Controllers\Core\Dashboard\CreatorsController@store
     * method store not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static creatorStore({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/creator',
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
     * App\Http\Controllers\Core\CreatorRequestController@index
     * @returns any Success
     * @throws ApiError
     */
    static creatorRequestIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/creator-request',
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
     * App\Http\Controllers\Core\CreatorRequestController@store
     * @returns any Success
     * @throws ApiError
     */
    static creatorRequestStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/creator-request',
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
     * App\Http\Controllers\Core\CreatorRequestController@checkStatus
     * @returns any Success
     * @throws ApiError
     */
    static getApiCreatorRequestStatus({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/creator-request/status',
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
     * App\Http\Controllers\Core\CreatorRequestController@show
     * @returns any Success
     * @throws ApiError
     */
    static creatorRequestShow({ creatorRequest, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/creator-request/{creator_request}',
            path: {
                'creator_request': creatorRequest,
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
     * App\Http\Controllers\Core\CreatorRequestController@update
     * @returns any Success
     * @throws ApiError
     */
    static creatorRequestUpdate({ creatorRequest, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/creator-request/{creator_request}',
            path: {
                'creator_request': creatorRequest,
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
     * App\Http\Controllers\Core\CreatorRequestController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static creatorRequestDestroy({ creatorRequest, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/creator-request/{creator_request}',
            path: {
                'creator_request': creatorRequest,
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
     * App\Http\Controllers\Core\Dashboard\CreatorsController@show
     * @returns any Success
     * @throws ApiError
     */
    static creatorShow({ creator, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/creator/{creator}',
            path: {
                'creator': creator,
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
     * App\Http\Controllers\Core\Dashboard\CreatorsController@update
     * @returns any Success
     * @throws ApiError
     */
    static creatorUpdate({ creator, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/creator/{creator}',
            path: {
                'creator': creator,
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
     * App\Http\Controllers\Core\Dashboard\CreatorsController@destroy
     * method destroy not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static creatorDestroy({ creator, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/creator/{creator}',
            path: {
                'creator': creator,
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
     * App\Http\Controllers\Core\Dashboard\ProgramsController@index
     * @returns any Success
     * @throws ApiError
     */
    static dashboardProgramIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/dashboard-program',
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
     * App\Http\Controllers\Core\Dashboard\ProgramsController@store
     * method store not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static dashboardProgramStore({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/dashboard-program',
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
     * App\Http\Controllers\Core\Dashboard\ProgramsController@show
     * @returns any Success
     * @throws ApiError
     */
    static dashboardProgramShow({ dashboardProgram, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/dashboard-program/{dashboard_program}',
            path: {
                'dashboard_program': dashboardProgram,
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
     * App\Http\Controllers\Core\Dashboard\ProgramsController@update
     * @returns any Success
     * @throws ApiError
     */
    static dashboardProgramUpdate({ dashboardProgram, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/dashboard-program/{dashboard_program}',
            path: {
                'dashboard_program': dashboardProgram,
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
     * App\Http\Controllers\Core\Dashboard\ProgramsController@destroy
     * method destroy not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static dashboardProgramDestroy({ dashboardProgram, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/dashboard-program/{dashboard_program}',
            path: {
                'dashboard_program': dashboardProgram,
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
     * App\Http\Controllers\CodifySubprojects\DashboardSettingsController@getSettings
     * @returns any Success
     * @throws ApiError
     */
    static getApiDashboardSettingsGet({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/dashboard-settings/get',
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
     * App\Http\Controllers\CodifySubprojects\DashboardSettingsController@saveSettings
     * @returns any Success
     * @throws ApiError
     */
    static postApiDashboardSettingsSave({ xDomain, formData, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/dashboard-settings/save',
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
     * App\Http\Controllers\Core\Auth\SocialLoginController@adminLoginBySocialToken
     * @returns any Success
     * @throws ApiError
     */
    static postApiDashboardAuthBySocialToken({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/dashboard/auth-by-social-token',
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
     * App\Http\Controllers\Core\Auth\SocialLoginController@adminAuthRegistration
     * method adminAuthRegistration not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static getApiDashboardAuthItem({ token, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/auth/{token}',
            path: {
                'token': token,
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
     * App\Http\Controllers\Core\Auth\SocialLoginController@createAdminLoginTransaction
     * @returns any Success
     * @throws ApiError
     */
    static postApiDashboardCreateLoginTransaction({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/dashboard/create-login-transaction',
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
     * App\Http\Controllers\Core\Auth\LoginController@adminJoin
     * @returns any Success
     * @throws ApiError
     */
    static postApiDashboardJoin({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/dashboard/join',
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
     * App\Http\Controllers\Core\Auth\LoginController@adminGetByToken
     * @returns any Success
     * @throws ApiError
     */
    static getApiDashboardJoinItem({ token, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/join/{token}',
            path: {
                'token': token,
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
     * App\Http\Controllers\Core\Auth\LoginController@adminLogin
     * @returns any Success
     * @throws ApiError
     */
    static postApiDashboardLogin({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/dashboard/login',
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
     * App\Http\Controllers\Core\DocumentationController@index
     * @returns any Success
     * @throws ApiError
     */
    static adminDocumentationIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/documentation',
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
     * App\Http\Controllers\Core\DocumentationController@store
     * @returns any Success
     * @throws ApiError
     */
    static adminDocumentationStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/documentation',
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
     * App\Http\Controllers\Core\DocumentationController@show
     * @returns any Success
     * @throws ApiError
     */
    static adminDocumentationShow({ documentation, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/documentation/{documentation}',
            path: {
                'documentation': documentation,
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
     * App\Http\Controllers\Core\DocumentationController@update
     * @returns any Success
     * @throws ApiError
     */
    static adminDocumentationUpdate({ documentation, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/documentation/{documentation}',
            path: {
                'documentation': documentation,
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
     * App\Http\Controllers\Core\DocumentationController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static adminDocumentationDestroy({ documentation, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/documentation/{documentation}',
            path: {
                'documentation': documentation,
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
     * App\Http\Controllers\CodifySubprojects\DomainInterfaceController@index
     * @returns any Success
     * @throws ApiError
     */
    static getApiDomainInterfaces({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/domain-interfaces',
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
     * App\Http\Controllers\CodifySubprojects\DomainInterfaceController@store
     * @returns any Success
     * @throws ApiError
     */
    static postApiDomainInterfaces({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/domain-interfaces',
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
     * App\Http\Controllers\CodifySubprojects\DomainInterfaceController@byDomain
     * @returns any Success
     * @throws ApiError
     */
    static getApiDomainInterfacesByDomainItem({ domain, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/domain-interfaces/by-domain/{domain}',
            path: {
                'domain': domain,
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
     * App\Http\Controllers\CodifySubprojects\DomainInterfaceController@show
     * @returns any Success
     * @throws ApiError
     */
    static getApiDomainInterfacesItem({ id, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/domain-interfaces/{id}',
            path: {
                'id': id,
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
     * App\Http\Controllers\CodifySubprojects\DomainInterfaceController@update
     * @returns any Success
     * @throws ApiError
     */
    static patchApiDomainInterfacesItem({ id, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PATCH',
            url: '/api/domain-interfaces/{id}',
            path: {
                'id': id,
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
     * App\Http\Controllers\CodifySubprojects\DomainInterfaceController@destroy
     * @returns delete_api_domain_interfaces_itemResponse Success
     * @throws ApiError
     */
    static deleteApiDomainInterfacesItem({ id, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/domain-interfaces/{id}',
            path: {
                'id': id,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsController@getSubprojectDomainSettings
     * @returns any Success
     * @throws ApiError
     */
    static getApiDomainSettingsItem({ id, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/domain-settings/{id}',
            path: {
                'id': id,
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
     * App\Http\Controllers\Core\UsersController@setFeatured
     * @returns any Success
     * @throws ApiError
     */
    static postApiFeaturedCreators({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/featured/creators',
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
     * App\Http\Controllers\Core\ProgramController@setFeatured
     * @returns any Success
     * @throws ApiError
     */
    static postApiFeaturedPrograms({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/featured/programs',
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
     * App\Http\Controllers\Core\FeesController@index
     * @returns any Success
     * @throws ApiError
     */
    static adminFeeIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/fees/fee',
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
     * App\Http\Controllers\Core\FeesController@store
     * @returns any Success
     * @throws ApiError
     */
    static adminFeeStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/fees/fee',
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
     * App\Http\Controllers\Core\FeesController@show
     * @returns any Success
     * @throws ApiError
     */
    static adminFeeShow({ fee, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/fees/fee/{fee}',
            path: {
                'fee': fee,
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
     * App\Http\Controllers\Core\FeesController@update
     * @returns any Success
     * @throws ApiError
     */
    static adminFeeUpdate({ fee, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/fees/fee/{fee}',
            path: {
                'fee': fee,
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
     * App\Http\Controllers\Core\FeesController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static adminFeeDestroy({ fee, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/fees/fee/{fee}',
            path: {
                'fee': fee,
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
     * App\Http\Controllers\Core\FeesController@findUsers
     * @returns any Success
     * @throws ApiError
     */
    static postApiFeesFindUsers({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/fees/find-users',
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
     * App\Http\Controllers\Core\FeesController@getSettings
     * @returns any Success
     * @throws ApiError
     */
    static getApiFeesGetSettings({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/fees/get-settings',
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
     * App\Http\Controllers\Core\FeesController@saveSettings
     * @returns any Success
     * @throws ApiError
     */
    static postApiFeesSaveSettings({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/fees/save-settings',
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
     * App\Http\Controllers\Core\Dashboard\FrontendController@show
     * @returns any Success
     * @throws ApiError
     */
    static getApiFrontendGetFrontend({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/frontend/get-frontend',
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
     * App\Http\Controllers\Core\Dashboard\FrontendController@update
     * @returns any Success
     * @throws ApiError
     */
    static putApiFrontendSaveFrontend({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/frontend/save-frontend',
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
     * App\Http\Controllers\Api\GovDirectoryController@agencyFooter
     * @returns get_api_gov_agency_footerResponse Success
     * @throws ApiError
     */
    static getApiGovAgencyFooter({ xDomain, hostname, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/gov/agency-footer',
            headers: {
                'X-Domain': xDomain,
            },
            query: {
                'hostname': hostname,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * App\Http\Controllers\Api\GovDirectoryController@cities
     * @returns get_api_gov_citiesResponse Success
     * @throws ApiError
     */
    static getApiGovCities({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/gov/cities',
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
     * App\Http\Controllers\Api\GovDirectoryController@cityAgencies
     * @returns any Success
     * @throws ApiError
     */
    static getApiGovCityAgencies({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/gov/city-agencies',
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
     * App\Http\Controllers\Api\GovDirectoryController@federalDirectory
     * @returns get_api_gov_federal_directoryResponse Success
     * @throws ApiError
     */
    static getApiGovFederalDirectory({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/gov/federal-directory',
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
     * App\Http\Controllers\Api\GovDirectoryController@states
     * @returns get_api_gov_statesResponse Success
     * @throws ApiError
     */
    static getApiGovStates({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/gov/states',
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
     * App\Http\Controllers\Api\GovDirectoryController@subprojects
     * @returns get_api_gov_subprojectsResponse Success
     * @throws ApiError
     */
    static getApiGovSubprojects({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/gov/subprojects',
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
     * App\Http\Controllers\Api\GovDirectoryController@subprojectByDomain
     * @returns get_api_gov_subprojects_by_domainResponse Success
     * @throws ApiError
     */
    static getApiGovSubprojectsByDomain({ xDomain, domain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/gov/subprojects/by-domain',
            headers: {
                'X-Domain': xDomain,
            },
            query: {
                'domain': domain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * App\Http\Controllers\Core\UsersController@featuredCreators
     * @returns any Success
     * @throws ApiError
     */
    static getApiHomeFeaturedCreators({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/home/featured-creators',
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
     * App\Http\Controllers\Core\ProgramController@featuredList
     * @returns any Success
     * @throws ApiError
     */
    static getApiHomeFeaturedPrograms({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/home/featured-programs',
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
     * App\Http\Controllers\Core\ProgramFeedbackController@index
     * @returns any Success
     * @throws ApiError
     */
    static getApiHomeFeedback({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/home/feedback',
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
     * App\Http\Controllers\Core\Dashboard\FrontendController@items
     * @returns any Success
     * @throws ApiError
     */
    static getApiHomeFrontendItem({ items, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/home/frontend/{items}',
            path: {
                'items': items,
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
     * App\Http\Controllers\Core\ProgramController@mostRecentPrograms
     * @returns any Success
     * @throws ApiError
     */
    static getApiHomeMostRecentPrograms({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/home/most-recent-programs',
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
     * App\Http\Controllers\Core\UI\StatisticItemsController@list
     * @returns any Success
     * @throws ApiError
     */
    static getApiHomeStatistic({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/home/statistic',
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
     * App\Http\Controllers\CodifySubprojects\AgentInterfaceUserController@getTokenData
     * @returns any Success
     * @throws ApiError
     */
    static getApiInterfaceAuthTokenItem({ token, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/interface/auth-token/{token}',
            path: {
                'token': token,
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
     * App\Http\Controllers\CodifySubprojects\AgentInterfaceUserController@getCode
     * @returns any Success
     * @throws ApiError
     */
    static getApiInterfaceAuthItem({ sessionKey, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/interface/auth/{sessionKey}',
            path: {
                'sessionKey': sessionKey,
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
     * App\Http\Controllers\CodifySubprojects\AgentInterfaceUserController@getSms
     * @returns any Success
     * @throws ApiError
     */
    static postApiInterfaceGetSms({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/interface/get-sms',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectClientController@loadInterface
     * @returns any Success
     * @throws ApiError
     */
    static getApiInterfaceLoadInterface({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/interface/load-interface',
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
     * App\Http\Controllers\CodifySubprojects\AgentInterfaceUserController@verifySmsCode
     * @returns any Success
     * @throws ApiError
     */
    static postApiInterfaceVerifyCode({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/interface/verify-code',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectClientController@leader
     * @returns any Success
     * @throws ApiError
     */
    static getApiLeader({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/leader',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectClientController@load
     * @returns any Success
     * @throws ApiError
     */
    static getApiLoad({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/load',
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
     * App\Http\Controllers\Core\Auth\LoginController@logout
     * @returns any Success
     * @throws ApiError
     */
    static getApiLogout({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/logout',
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
     * Closure
     * closure-based route; manual review needed
     * @returns any Success
     * @throws ApiError
     */
    static getApiMcpConnector({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/mcp/connector',
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
     * Closure
     * closure-based route; manual review needed
     * @returns any Success
     * @throws ApiError
     */
    static postApiMcpConnector({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/mcp/connector',
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
     * App\Http\Controllers\Core\NotificationController@deleteNotification
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiNotificationDeleteNotificationItem({ notification, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/notification/delete-notification/{notification}',
            path: {
                'notification': notification,
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
     * App\Http\Controllers\Core\NotificationController@index
     * @returns any Success
     * @throws ApiError
     */
    static getApiNotificationGet({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/notification/get',
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
     * App\Http\Controllers\Core\NotificationController@getUnreadNotificationsCount
     * @returns any Success
     * @throws ApiError
     */
    static getApiNotificationGetUnread({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/notification/get-unread',
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
     * App\Http\Controllers\Core\NotificationController@startTask
     * @returns any Success
     * @throws ApiError
     */
    static postApiNotificationStartTask({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/notification/start-task',
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
     * App\Http\Controllers\Core\SubscriptionController@deletePaymentMethod
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiPaymentDeletePaymentMethodItem({ id, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/payment/delete-payment-method/{id}',
            path: {
                'id': id,
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
     * App\Http\Controllers\Core\SubscriptionController@getPaymentMethod
     * @returns any Success
     * @throws ApiError
     */
    static getApiPaymentGetPaymentMethod({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/payment/get-payment-method',
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
     * App\Http\Controllers\Core\PaymentHistoryController@paymentHistoryProgramPurchases
     * @returns any Success
     * @throws ApiError
     */
    static getApiPaymentProgramPurchases({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/payment/program-purchases',
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
     * App\Http\Controllers\Core\PaymentHistoryController@retrievePurchasedItems
     * @returns any Success
     * @throws ApiError
     */
    static getApiPaymentPurchasedItems({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/payment/purchased-items',
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
     * App\Http\Controllers\Core\SubscriptionController@savePaymentMethod
     * @returns any Success
     * @throws ApiError
     */
    static postApiPaymentSavePaymentMethod({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/payment/save-payment-method',
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
     * App\Http\Controllers\Core\SubscriptionController@setupPaymentMethod
     * @returns any Success
     * @throws ApiError
     */
    static getApiPaymentSetupPaymentMethod({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/payment/setup-payment-method',
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
     * App\Http\Controllers\Core\PaymentHistoryController@paymentHistorySubscriptions
     * @returns any Success
     * @throws ApiError
     */
    static getApiPaymentSubscriptions({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/payment/subscriptions',
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
     * App\Http\Controllers\Core\ProtocolPersonalChainController@index
     * @returns any Success
     * @throws ApiError
     */
    static getApiPersonalChainByStatusItem({ xDomain, status, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/personal-chain/by-status/{status}',
            path: {
                'status': status,
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
     * App\Http\Controllers\Core\ProtocolPersonalChainController@cancelInvitationUserToPersonalChain
     * @returns any Success
     * @throws ApiError
     */
    static postApiPersonalChainCancelInvitation({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/personal-chain/cancel-invitation',
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
     * App\Http\Controllers\Core\ProtocolPersonalChainController@decline
     * @returns any Success
     * @throws ApiError
     */
    static getApiPersonalChainDeclineItemItem({ invite, xDomain, source, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/personal-chain/decline/{invite}/{source}',
            path: {
                'invite': invite,
                'source': source,
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
     * App\Http\Controllers\Core\ProgramFeedbackController@store
     * @returns any Success
     * @throws ApiError
     */
    static postApiPersonalChainFeedbackItem({ chain, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/personal-chain/feedback/{chain}',
            path: {
                'chain': chain,
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
     * App\Http\Controllers\Core\ProgramFeedbackController@show
     * @returns any Success
     * @throws ApiError
     */
    static getApiPersonalChainFeedbackItem({ chain, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/personal-chain/feedback/{chain}',
            path: {
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
     * App\Http\Controllers\Core\ProtocolPersonalChainController@findUsersToInvite
     * @returns any Success
     * @throws ApiError
     */
    static postApiPersonalChainFindUsersToInvite({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/personal-chain/find-users-to-invite',
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
     * App\Http\Controllers\Core\ProtocolPersonalChainController@finishedNotRated
     * @returns any Success
     * @throws ApiError
     */
    static getApiPersonalChainFinishedNotRated({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/personal-chain/finished-not-rated',
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
     * App\Http\Controllers\Core\ProtocolPersonalChainController@forceDefrost
     * @returns any Success
     * @throws ApiError
     */
    static getApiPersonalChainForceDefrostItem({ chain, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/personal-chain/force-defrost/{chain}',
            path: {
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
     * App\Http\Controllers\Core\ProtocolPersonalChainController@getRecommendation
     * @returns any Success
     * @throws ApiError
     */
    static getApiPersonalChainGetRecommended({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/personal-chain/get-recommended',
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
     * App\Http\Controllers\Core\ProtocolPersonalChainController@inviteUserToPersonalChain
     * @returns any Success
     * @throws ApiError
     */
    static postApiPersonalChainInvite({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/personal-chain/invite',
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
     * App\Http\Controllers\Core\ProtocolPersonalChainController@join
     * @returns any Success
     * @throws ApiError
     */
    static getApiPersonalChainJoinItemItem({ token, xDomain, source, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/personal-chain/join/{token}/{source}',
            path: {
                'token': token,
                'source': source,
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
     * App\Http\Controllers\Core\ProtocolPersonalChainController@lastChain
     * @returns any Success
     * @throws ApiError
     */
    static getApiPersonalChainLastChain({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/personal-chain/last-chain',
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
     * App\Http\Controllers\Core\ProtocolPersonalChainController@startProgram
     * @returns any Success
     * @throws ApiError
     */
    static postApiPersonalChainStartProgramItem({ chain, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/personal-chain/start-program/{chain}',
            path: {
                'chain': chain,
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
     * App\Http\Controllers\Core\GlobalModuleTaskController@getTask
     * @returns any Success
     * @throws ApiError
     */
    static getApiPersonalChainTaskItem({ taskId, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/personal-chain/task/{taskId}',
            path: {
                'taskId': taskId,
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
     * App\Http\Controllers\Core\ProtocolPersonalChainController@tasks
     * @returns any Success
     * @throws ApiError
     */
    static getApiPersonalChainTasks({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/personal-chain/tasks',
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
     * App\Http\Controllers\Core\ProtocolPersonalChainController@joinExistingUser
     * @returns any Success
     * @throws ApiError
     */
    static getApiPersonalChainUserJoinItem({ invite, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/personal-chain/user-join/{invite}',
            path: {
                'invite': invite,
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
     * App\Http\Controllers\Core\ProtocolPersonalChainController@rejectExistingUser
     * @returns any Success
     * @throws ApiError
     */
    static getApiPersonalChainUserRejectItem({ invite, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/personal-chain/user-reject/{invite}',
            path: {
                'invite': invite,
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
     * App\Http\Controllers\Core\ProtocolPersonalChainController@show
     * @returns any Success
     * @throws ApiError
     */
    static getApiPersonalChainItem({ personalChain, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/personal-chain/{personalChain}',
            path: {
                'personalChain': personalChain,
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
     * App\Http\Controllers\Core\ProtocolPersonalChainController@delete
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiPersonalChainItem({ personalChain, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/personal-chain/{personalChain}',
            path: {
                'personalChain': personalChain,
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
     * App\Http\Controllers\Api\PoliticianController@getByDomain
     * @returns get_api_politicians_by_domainResponse Success
     * @throws ApiError
     */
    static getApiPoliticiansByDomain({ xDomain, subprojectId, hostname, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/politicians-by-domain',
            headers: {
                'X-Domain': xDomain,
            },
            query: {
                'subproject_id': subprojectId,
                'hostname': hostname,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * App\Http\Controllers\Core\CategoryController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProgramCategories({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program-categories',
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
     * App\Http\Controllers\Core\CategoryController@index
     * @returns any Success
     * @throws ApiError
     */
    static adminProgramCategoryIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program-category',
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
     * App\Http\Controllers\Core\CategoryController@store
     * @returns any Success
     * @throws ApiError
     */
    static adminProgramCategoryStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/program-category',
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
     * App\Http\Controllers\Core\CategoryController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProgramCategoryAll({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program-category/all',
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
     * App\Http\Controllers\Core\CategoryController@show
     * @returns any Success
     * @throws ApiError
     */
    static adminProgramCategoryShow({ programCategory, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program-category/{program_category}',
            path: {
                'program_category': programCategory,
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
     * App\Http\Controllers\Core\CategoryController@update
     * @returns any Success
     * @throws ApiError
     */
    static adminProgramCategoryUpdate({ programCategory, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/program-category/{program_category}',
            path: {
                'program_category': programCategory,
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
     * App\Http\Controllers\Core\CategoryController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static adminProgramCategoryDestroy({ programCategory, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/program-category/{program_category}',
            path: {
                'program_category': programCategory,
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
     * App\Http\Controllers\Core\ProgramSaleController@index
     * method index not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static programSaleIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program-sale',
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
     * App\Http\Controllers\Core\ProgramSaleController@store
     * method store not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static programSaleStore({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/program-sale',
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
     * App\Http\Controllers\Core\ProgramSaleController@buy
     * @returns any Success
     * @throws ApiError
     */
    static postApiProgramSaleBuy({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/program-sale/buy',
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
     * App\Http\Controllers\Core\ProgramSaleController@displayAllSales
     * @returns any Success
     * @throws ApiError
     */
    static postApiProgramSaleList({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/program-sale/list',
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
     * App\Http\Controllers\Core\ProgramSaleController@displayAllSalesByAuthor
     * @returns any Success
     * @throws ApiError
     */
    static getApiProgramSaleListByAuthorItem({ username, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program-sale/list-by-author/{username}',
            path: {
                'username': username,
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
     * App\Http\Controllers\Core\ProgramSaleController@displayRandomAuthorSales
     * @returns any Success
     * @throws ApiError
     */
    static getApiProgramSaleListRandomItemItem({ username, ignore, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program-sale/list/random/{username}/{ignore}',
            path: {
                'username': username,
                'ignore': ignore,
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
     * App\Http\Controllers\Core\ProgramSaleController@teamMembersSalary
     * @returns any Success
     * @throws ApiError
     */
    static getApiProgramSaleSalaryItem({ program, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program-sale/salary/{program}',
            path: {
                'program': program,
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
     * App\Http\Controllers\Core\ProgramSaleController@tags
     * @returns any Success
     * @throws ApiError
     */
    static getApiProgramSaleTags({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program-sale/tags',
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
     * App\Http\Controllers\Core\ProgramSaleController@show
     * @returns any Success
     * @throws ApiError
     */
    static programSaleShow({ programSale, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program-sale/{program_sale}',
            path: {
                'program_sale': programSale,
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
     * App\Http\Controllers\Core\ProgramSaleController@update
     * method update not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static programSaleUpdate({ programSale, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/program-sale/{program_sale}',
            path: {
                'program_sale': programSale,
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
     * App\Http\Controllers\Core\ProgramSaleController@destroy
     * method destroy not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static programSaleDestroy({ programSale, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/program-sale/{program_sale}',
            path: {
                'program_sale': programSale,
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
     * App\Http\Controllers\Core\ProgramController@getStatus
     * @returns any Success
     * @throws ApiError
     */
    static getApiProgramStatusGetItem({ program, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program-status/get/{program}',
            path: {
                'program': program,
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
     * App\Http\Controllers\Core\ProgramController@setStatus
     * @returns any Success
     * @throws ApiError
     */
    static postApiProgramStatusSetItem({ program, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/program-status/set/{program}',
            path: {
                'program': program,
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
     * App\Http\Controllers\Core\SubCategoryController@index
     * @returns any Success
     * @throws ApiError
     */
    static adminProgramSubCategoryIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program-sub-category',
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
     * App\Http\Controllers\Core\SubCategoryController@store
     * @returns any Success
     * @throws ApiError
     */
    static adminProgramSubCategoryStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/program-sub-category',
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
     * App\Http\Controllers\Core\SubCategoryController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProgramSubCategoryAll({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program-sub-category/all',
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
     * App\Http\Controllers\Core\SubCategoryController@show
     * @returns any Success
     * @throws ApiError
     */
    static adminProgramSubCategoryShow({ programSubCategory, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program-sub-category/{program_sub_category}',
            path: {
                'program_sub_category': programSubCategory,
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
     * App\Http\Controllers\Core\SubCategoryController@update
     * @returns any Success
     * @throws ApiError
     */
    static adminProgramSubCategoryUpdate({ programSubCategory, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/program-sub-category/{program_sub_category}',
            path: {
                'program_sub_category': programSubCategory,
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
     * App\Http\Controllers\Core\SubCategoryController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static adminProgramSubCategoryDestroy({ programSubCategory, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/program-sub-category/{program_sub_category}',
            path: {
                'program_sub_category': programSubCategory,
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
     * App\Http\Controllers\Core\TagController@index
     * @returns any Success
     * @throws ApiError
     */
    static adminProgramTagIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program-tag',
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
     * App\Http\Controllers\Core\TagController@store
     * @returns any Success
     * @throws ApiError
     */
    static adminProgramTagStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/program-tag',
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
     * App\Http\Controllers\Core\TagController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProgramTagAll({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program-tag/all',
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
     * App\Http\Controllers\Core\TagController@show
     * @returns any Success
     * @throws ApiError
     */
    static adminProgramTagShow({ programTag, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program-tag/{program_tag}',
            path: {
                'program_tag': programTag,
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
     * App\Http\Controllers\Core\TagController@update
     * @returns any Success
     * @throws ApiError
     */
    static adminProgramTagUpdate({ programTag, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/program-tag/{program_tag}',
            path: {
                'program_tag': programTag,
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
     * App\Http\Controllers\Core\TagController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static adminProgramTagDestroy({ programTag, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/program-tag/{program_tag}',
            path: {
                'program_tag': programTag,
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
     * App\Http\Controllers\Core\ProgramController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProgramAll({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program/all',
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
     * App\Http\Controllers\Core\ProgramController@getUserChains
     * @returns any Success
     * @throws ApiError
     */
    static getApiProgramChainsItemItem({ program, user, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program/chains/{program}/{user}',
            path: {
                'program': program,
                'user': user,
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
     * App\Http\Controllers\Core\ProgramController@detachProtocol
     * @returns any Success
     * @throws ApiError
     */
    static postApiProgramDetachProtocol({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/program/detach-protocol',
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
     * App\Http\Controllers\Core\ProgramController@getProgramBookmarks
     * @returns any Success
     * @throws ApiError
     */
    static getApiProgramGetBookmarks({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program/get-bookmarks',
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
     * App\Http\Controllers\Core\ProgramController@history
     * @returns any Success
     * @throws ApiError
     */
    static getApiProgramHistory({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program/history',
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
     * App\Http\Controllers\Core\ProgramController@getHistoryByChain
     * @returns any Success
     * @throws ApiError
     */
    static getApiProgramHistoryItem({ chain, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program/history/{chain}',
            path: {
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
     * App\Http\Controllers\Core\ProgramController@lastPurchases
     * @returns any Success
     * @throws ApiError
     */
    static getApiProgramLastPurchases({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program/last-purchases',
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
     * App\Http\Controllers\Core\ProgramController@checkProgramData
     * @returns any Success
     * @throws ApiError
     */
    static postApiProgramProgramCheck({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/program/program-check',
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
     * App\Http\Controllers\Core\ProgramController@getDataToUse
     * @returns any Success
     * @throws ApiError
     */
    static getApiProgramProgramDataItem({ xDomain, program, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program/program-data/{program}',
            path: {
                'program': program,
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
     * App\Http\Controllers\Core\ProgramController@addTag
     * @returns any Success
     * @throws ApiError
     */
    static postApiProgramProgramAddTag({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/program/program/add-tag',
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
     * App\Http\Controllers\Core\ProgramController@deleteTag
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiProgramProgramDeleteTagItemItem({ program, tag, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/program/program/delete-tag/{program}/{tag}',
            path: {
                'program': program,
                'tag': tag,
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
     * App\Http\Controllers\Core\ProgramController@publications
     * @returns any Success
     * @throws ApiError
     */
    static getApiProgramPublicationsItem({ program, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program/publications/{program}',
            path: {
                'program': program,
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
     * App\Http\Controllers\Core\ProgramController@publish
     * @returns any Success
     * @throws ApiError
     */
    static postApiProgramPublish({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/program/publish',
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
     * App\Http\Controllers\Core\ProgramController@cancel
     * @returns any Success
     * @throws ApiError
     */
    static postApiProgramPublishCancel({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/program/publish/cancel',
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
     * App\Http\Controllers\Core\ProgramController@runPersonalProgram
     * @returns any Success
     * @throws ApiError
     */
    static postApiProgramRunPersonal({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/program/run-personal',
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
     * App\Http\Controllers\Core\ProgramController@searchPrograms
     * @returns any Success
     * @throws ApiError
     */
    static postApiProgramSearch({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/program/search',
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
     * App\Http\Controllers\Core\ProgramController@show
     * @returns any Success
     * @throws ApiError
     */
    static getApiProgramShowItem({ program, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program/show/{program}',
            path: {
                'program': program,
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
     * App\Http\Controllers\Core\ProgramController@getProgram
     * @returns any Success
     * @throws ApiError
     */
    static getApiProgramSimulationItem({ program, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program/simulation/{program}',
            path: {
                'program': program,
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
     * App\Http\Controllers\Core\ProgramController@toggleBookmark
     * @returns any Success
     * @throws ApiError
     */
    static postApiProgramToggleBookmark({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/program/toggle-bookmark',
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
     * App\Http\Controllers\Core\ProgramController@update
     * @returns any Success
     * @throws ApiError
     */
    static putApiProgramUpdateProgramItem({ program, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/program/update-program/{program}',
            path: {
                'program': program,
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
     * App\Http\Controllers\Core\ProgramController@getProgramAdditionalUsersSteps
     * @returns any Success
     * @throws ApiError
     */
    static getApiProgramUsersAdditionalStepsItemItem({ program, protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program/users-additional-steps/{program}/{protocol}',
            path: {
                'program': program,
                'protocol': protocol,
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
     * App\Http\Controllers\Core\ProgramController@getProgramUsersSteps
     * @returns any Success
     * @throws ApiError
     */
    static getApiProgramUsersStepsItem({ program, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program/users-steps/{program}',
            path: {
                'program': program,
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
     * App\Http\Controllers\Core\ProgramController@getProgramUsers
     * @returns any Success
     * @throws ApiError
     */
    static getApiProgramUsersItem({ program, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/program/users/{program}',
            path: {
                'program': program,
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
     * App\Http\Controllers\Core\ProgramController@validateAdditionalProtocol
     * @returns any Success
     * @throws ApiError
     */
    static postApiProgramValidateAdditionalProtocol({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/program/validate-additional-protocol',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectRolesController@index
     * @returns any Success
     * @throws ApiError
     */
    static projectRoleIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/project-role',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectRolesController@store
     * @returns any Success
     * @throws ApiError
     */
    static projectRoleStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/project-role',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectRolesController@getPermissions
     * @returns any Success
     * @throws ApiError
     */
    static getApiProjectRolePermissions({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/project-role/permissions',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectRolesController@show
     * @returns any Success
     * @throws ApiError
     */
    static projectRoleShow({ projectRole, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/project-role/{project_role}',
            path: {
                'project_role': projectRole,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectRolesController@update
     * @returns any Success
     * @throws ApiError
     */
    static projectRoleUpdate({ projectRole, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/project-role/{project_role}',
            path: {
                'project_role': projectRole,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectRolesController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static projectRoleDestroy({ projectRole, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/project-role/{project_role}',
            path: {
                'project_role': projectRole,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectSettingsController@getContent
     * @returns any Success
     * @throws ApiError
     */
    static getApiProjectSettingsContentShowItem({ xDomain, subproject, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/project-settings/content/show/{subproject}',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectSettingsController@saveContent
     * @returns any Success
     * @throws ApiError
     */
    static postApiProjectSettingsContentItem({ xDomain, requestBody, subproject, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/project-settings/content/{subproject}',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectSettingsController@getDomainSettings
     * @returns any Success
     * @throws ApiError
     */
    static getApiProjectSettingsDomainSettingsItem({ xDomain, subproject, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/project-settings/domain-settings/{subproject}',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectSettingsController@getDomains
     * @returns any Success
     * @throws ApiError
     */
    static getApiProjectSettingsDomainsShowItem({ xDomain, subproject, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/project-settings/domains/show/{subproject}',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectSettingsController@saveDomains
     * @returns any Success
     * @throws ApiError
     */
    static postApiProjectSettingsDomainsItem({ xDomain, requestBody, subproject, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/project-settings/domains/{subproject}',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectSettingsController@getLayout
     * @returns any Success
     * @throws ApiError
     */
    static getApiProjectSettingsLayoutShowItem({ xDomain, subproject, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/project-settings/layout/show/{subproject}',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectSettingsController@saveLayout
     * @returns any Success
     * @throws ApiError
     */
    static postApiProjectSettingsLayoutItem({ xDomain, requestBody, subproject, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/project-settings/layout/{subproject}',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectSettingsController@getSEO
     * @returns any Success
     * @throws ApiError
     */
    static getApiProjectSettingsSeoShowItem({ xDomain, subproject, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/project-settings/seo/show/{subproject}',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectSettingsController@saveSEO
     * @returns any Success
     * @throws ApiError
     */
    static postApiProjectSettingsSeoItem({ xDomain, requestBody, subproject, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/project-settings/seo/{subproject}',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectSettingsController@getTemplate
     * @returns any Success
     * @throws ApiError
     */
    static getApiProjectSettingsTemplateShowItem({ xDomain, subproject, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/project-settings/template/show/{subproject}',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectSettingsController@saveTemplate
     * @returns any Success
     * @throws ApiError
     */
    static postApiProjectSettingsTemplateItem({ xDomain, requestBody, subproject, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/project-settings/template/{subproject}',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\Core\ProtocolController@index
     * @returns any Success
     * @throws ApiError
     */
    static protocolIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol',
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
     * App\Http\Controllers\Core\ProtocolController@store
     * @returns any Success
     * @throws ApiError
     */
    static protocolStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/protocol',
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
     * App\Http\Controllers\Core\ProtocolCategoriesController@index
     * @returns any Success
     * @throws ApiError
     */
    static protocolCategoryIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol-category',
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
     * App\Http\Controllers\Core\ProtocolCategoriesController@store
     * @returns any Success
     * @throws ApiError
     */
    static protocolCategoryStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/protocol-category',
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
     * App\Http\Controllers\Core\ProtocolCategoriesController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolCategoryAll({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol-category/all',
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
     * App\Http\Controllers\Core\ProtocolCategoriesController@forAttachment
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolCategoryForAttachment({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol-category/for-attachment',
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
     * App\Http\Controllers\Core\ProtocolCategoriesController@show
     * @returns any Success
     * @throws ApiError
     */
    static protocolCategoryShow({ protocolCategory, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol-category/{protocol_category}',
            path: {
                'protocol_category': protocolCategory,
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
     * App\Http\Controllers\Core\ProtocolCategoriesController@update
     * @returns any Success
     * @throws ApiError
     */
    static protocolCategoryUpdate({ protocolCategory, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/protocol-category/{protocol_category}',
            path: {
                'protocol_category': protocolCategory,
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
     * App\Http\Controllers\Core\ProtocolCategoriesController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static protocolCategoryDestroy({ protocolCategory, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/protocol-category/{protocol_category}',
            path: {
                'protocol_category': protocolCategory,
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
     * App\Http\Controllers\Core\ProtocolEventController@getTriggers
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolEventTriggers({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol-event/triggers',
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
     * App\Http\Controllers\Core\ProtocolAIHelperController@addModuleToBranch
     * @returns any Success
     * @throws ApiError
     */
    static postApiProtocolAddModuleToBranch({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/protocol/add-module-to-branch',
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
     * App\Http\Controllers\Core\ProtocolAIHelperController@addModuleToPlan
     * @returns any Success
     * @throws ApiError
     */
    static postApiProtocolAddModuleToPlan({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/protocol/add-module-to-plan',
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
     * App\Http\Controllers\Core\ProtocolAIHelperController@createItem
     * @returns any Success
     * @throws ApiError
     */
    static postApiProtocolAiCreate({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/protocol/ai-create',
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
     * App\Http\Controllers\Core\ProtocolAIHelperController@createBranchPlan
     * @returns any Success
     * @throws ApiError
     */
    static postApiProtocolAiCreateBranch({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/protocol/ai-create-branch',
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
     * App\Http\Controllers\Core\ProtocolAIHelperController@aiRequestStatus
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolAiRequestStatusItem({ key, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/ai-request-status/{key}',
            path: {
                'key': key,
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
     * App\Http\Controllers\Core\ProtocolAIHelperController@createWhole
     * @returns any Success
     * @throws ApiError
     */
    static postApiProtocolAiWhole({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/protocol/ai-whole',
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
     * App\Http\Controllers\Core\ProtocolController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolAll({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/all',
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
     * App\Http\Controllers\Core\ProtocolController@byCategoryAll
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolByCategoryAllItem({ category, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/by-category-all/{category}',
            path: {
                'category': category,
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
     * App\Http\Controllers\Core\ProtocolController@index
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolByCategoryItem({ xDomain, category, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/by-category/{category}',
            path: {
                'category': category,
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
     * App\Http\Controllers\Core\ProtocolAIHelperController@getExistingBranchPlan
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolChainItemBranchPlanItemItem({ protocol, item, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/chain-item-branch-plan/{protocol}/{item}',
            path: {
                'protocol': protocol,
                'item': item,
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
     * App\Http\Controllers\Core\ProtocolController@checkUsage
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolCheckUsageItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/check-usage/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\Core\ProtocolAIHelperController@confirmPlan
     * @returns any Success
     * @throws ApiError
     */
    static postApiProtocolConfirmPlan({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/protocol/confirm-plan',
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
     * App\Http\Controllers\Core\ProtocolAIHelperController@deleteBranchModule
     * @returns any Success
     * @throws ApiError
     */
    static postApiProtocolDeleteBranchItem({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/protocol/delete-branch-item',
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
     * App\Http\Controllers\Core\ProtocolController@destroyGlobalModule
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiProtocolDeleteIntensiveItem({ global, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/protocol/delete-intensive/{global}',
            path: {
                'global': global,
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
     * App\Http\Controllers\Core\ProtocolAIHelperController@deleteModule
     * @returns any Success
     * @throws ApiError
     */
    static postApiProtocolDeletePlanItem({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/protocol/delete-plan-item',
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
     * App\Http\Controllers\Core\ProtocolAIHelperController@editPlanBranchModule
     * @returns any Success
     * @throws ApiError
     */
    static postApiProtocolEditPlanBranchModule({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/protocol/edit-plan-branch-module',
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
     * App\Http\Controllers\Core\ProtocolAIHelperController@editPlanModule
     * @returns any Success
     * @throws ApiError
     */
    static postApiProtocolEditPlanModule({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/protocol/edit-plan-module',
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
     * App\Http\Controllers\Core\ProtocolController@getProtocolErrors
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolErrorsItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/errors/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\Core\ProtocolController@getIntensiveModuleSettings
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolGetIntensiveModuleSettingsItemItem({ protocol, chain, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/get-intensive-module-settings/{protocol}/{chain}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\Core\ProtocolAIHelperController@getExistingPlan
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolGetPlanItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/get-plan/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\Core\ProtocolController@getProtocolSteps
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolGetStepsItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/get-steps/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\Core\ProtocolController@temporaryUserProtocol
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolGetTemporaryUser({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/get-temporary-user',
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
     * App\Http\Controllers\Core\ProtocolController@getIntensiveRoles
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolIntensiveModuleRolesItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/intensive-module/roles/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\Core\ProtocolController@globalModuleList
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolListIntensiveItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/list-intensive/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\Core\ProtocolController@modules
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolModulesItem({ xDomain, recurring, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/modules/{recurring}',
            path: {
                'recurring': recurring,
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
     * App\Http\Controllers\Core\ProtocolAIHelperController@moveBranchModuleDown
     * @returns any Success
     * @throws ApiError
     */
    static postApiProtocolMoveDownBranchItem({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/protocol/move-down-branch-item',
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
     * App\Http\Controllers\Core\ProtocolAIHelperController@moveModuleDown
     * @returns any Success
     * @throws ApiError
     */
    static postApiProtocolMoveDownPlanItem({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/protocol/move-down-plan-item',
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
     * App\Http\Controllers\Core\ProtocolAIHelperController@moveBranchModuleUp
     * @returns any Success
     * @throws ApiError
     */
    static postApiProtocolMoveUpBranchItem({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/protocol/move-up-branch-item',
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
     * App\Http\Controllers\Core\ProtocolAIHelperController@moveModuleUp
     * @returns any Success
     * @throws ApiError
     */
    static postApiProtocolMoveUpPlanItem({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/protocol/move-up-plan-item',
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
     * App\Http\Controllers\Core\ProtocolController@getNodeMembers
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolNodeMembersItem({ node, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/node-members/{node}',
            path: {
                'node': node,
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
     * App\Http\Controllers\Core\ProtocolAIHelperController@resetPlan
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiProtocolResetPlanItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/protocol/reset-plan/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\Core\ProtocolController@getQualificationsByRole
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolRoleQualificationsItem({ role, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/role-qualifications/{role}',
            path: {
                'role': role,
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
     * App\Http\Controllers\Core\ProtocolController@getRolesByType
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolRolesItem({ type, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/roles/{type}',
            path: {
                'type': type,
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
     * App\Http\Controllers\Core\ProtocolPricingController@show
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolSaleGetItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/sale/get/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\Core\ProtocolPricingController@salaries
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolSaleSalariesItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/sale/salaries/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\Core\ProtocolPricingController@store
     * @returns any Success
     * @throws ApiError
     */
    static postApiProtocolSaleSetSale({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/protocol/sale/set-sale',
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
     * App\Http\Controllers\Core\ProtocolPricingController@update
     * @returns any Success
     * @throws ApiError
     */
    static patchApiProtocolSaleUpdateItem({ protocol, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PATCH',
            url: '/api/protocol/sale/update/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\Core\ProtocolSettingsController@show
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolSettingsGetItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/settings/get/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\Core\ProtocolSettingsController@store
     * @returns any Success
     * @throws ApiError
     */
    static postApiProtocolSettingsSave({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/protocol/settings/save',
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
     * App\Http\Controllers\Core\ProtocolController@showGlobalModule
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolShowIntensiveItem({ module, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/show-intensive/{module}',
            path: {
                'module': module,
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
     * App\Http\Controllers\Core\ProtocolController@storeGlobalModule
     * @returns any Success
     * @throws ApiError
     */
    static postApiProtocolStoreIntensive({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/protocol/store-intensive',
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
     * App\Http\Controllers\Core\ProtocolController@switchChainMember
     * @returns any Success
     * @throws ApiError
     */
    static postApiProtocolSwitchMember({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/protocol/switch-member',
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
     * App\Http\Controllers\Core\ProtocolController@updateGlobalModule
     * @returns any Success
     * @throws ApiError
     */
    static postApiProtocolUpdateIntensiveItem({ module, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/protocol/update-intensive/{module}',
            path: {
                'module': module,
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
     * App\Http\Controllers\Core\ProtocolController@show
     * @returns any Success
     * @throws ApiError
     */
    static protocolShow({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\Core\ProtocolController@update
     * @returns any Success
     * @throws ApiError
     */
    static protocolUpdate({ protocol, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/protocol/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\Core\ProtocolController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static protocolDestroy({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/protocol/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\Core\ProvidersController@index
     * @returns any Success
     * @throws ApiError
     */
    static adminProviderIndex({ xDomain, q, perPage, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/provider',
            headers: {
                'X-Domain': xDomain,
            },
            query: {
                'q': q,
                'per_page': perPage,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * App\Http\Controllers\Core\ProvidersController@roles
     * @returns admin_provider_rolesResponse Success
     * @throws ApiError
     */
    static adminProviderRoles({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/provider/roles',
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
     * App\Http\Controllers\Core\Auth\SocialLoginController@authByToken
     * @returns any Success
     * @throws ApiError
     */
    static postApiPublicAuthBySocialToken({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/public/auth-by-social-token',
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
     * App\Http\Controllers\Core\Auth\RegisterController@finishSocialRegistration
     * @returns any Success
     * @throws ApiError
     */
    static postApiPublicAuthFinishSocialRegistration({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/public/auth/finish-social-registration',
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
     * App\Http\Controllers\Core\Auth\LoginController@newPassword
     * @returns any Success
     * @throws ApiError
     */
    static postApiPublicAuthNewPassword({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/public/auth/new-password',
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
     * App\Http\Controllers\Core\ProtocolPersonalChainController@getUserByInvite
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicAuthProtocolChainGetUserByInviteItemItem({ token, xDomain, source, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/auth/protocol-chain/get-user-by-invite/{token}/{source}',
            path: {
                'token': token,
                'source': source,
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
     * App\Http\Controllers\Core\Auth\LoginController@reset
     * @returns any Success
     * @throws ApiError
     */
    static postApiPublicAuthReset({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/public/auth/reset',
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
     * App\Http\Controllers\Core\Auth\LoginController@login
     * @returns any Success
     * @throws ApiError
     */
    static postApiPublicAuthSignIn({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/public/auth/sign-in',
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
     * App\Http\Controllers\Core\Auth\RegisterController@register
     * @returns any Success
     * @throws ApiError
     */
    static postApiPublicAuthSignUp({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/public/auth/sign-up',
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
     * App\Http\Controllers\Core\CodifyWizardController@getAnswers
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicCodifyAnswersItem({ key, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/codify/answers/{key}',
            path: {
                'key': key,
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
     * App\Http\Controllers\Core\CodifyWizardController@cancelCodifyRequest
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiPublicCodifyCancelItem({ key, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/public/codify/cancel/{key}',
            path: {
                'key': key,
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
     * App\Http\Controllers\Core\CodifyWizardController@codify
     * @returns any Success
     * @throws ApiError
     */
    static postApiPublicCodifyRun({ xDomain, formData, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/public/codify/run',
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
     * App\Http\Controllers\Core\CodifyWizardController@saveAnswer
     * @returns any Success
     * @throws ApiError
     */
    static postApiPublicCodifySaveAnswer({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/public/codify/save-answer',
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
     * App\Http\Controllers\Core\CodifyWizardController@startSession
     * @returns any Success
     * @throws ApiError
     */
    static postApiPublicCodifyStartSession({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/public/codify/start-session',
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
     * App\Http\Controllers\Core\CodifyWizardController@getRunningCodify
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicCodifyStateItem({ key, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/codify/state/{key}',
            path: {
                'key': key,
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
     * App\Http\Controllers\Core\WebsiteServiceController@contactUs
     * @returns any Success
     * @throws ApiError
     */
    static postApiPublicContact({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/public/contact',
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
     * App\Http\Controllers\Core\CountriesController@findAllowed
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicCountriesFindAllowed({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/countries/find-allowed',
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
     * App\Http\Controllers\Core\CountriesController@find
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicCountriesItem({ country, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/countries/{country}',
            path: {
                'country': country,
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
     * App\Http\Controllers\Core\Auth\SocialLoginController@createLoginTransaction
     * @returns any Success
     * @throws ApiError
     */
    static postApiPublicCreateLoginTransaction({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/public/create-login-transaction',
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
     * App\Http\Controllers\Core\UsersController@getCreators
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicCreators({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/creators',
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
     * App\Http\Controllers\Core\UsersController@getCreatorsByFilter
     * @returns any Success
     * @throws ApiError
     */
    static postApiPublicCreatorsFilter({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/public/creators/filter',
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
     * App\Http\Controllers\Core\ProgramFeedbackController@getRandomFeedback
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicDocumentationRandomFeedback({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/documentation/random-feedback',
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
     * App\Http\Controllers\Core\DocumentationController@search
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicDocumentationSearchItem({ xDomain, search, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/documentation/search/{search}',
            path: {
                'search': search,
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
     * App\Http\Controllers\Core\DocumentationController@show
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicDocumentationShowItem({ documentation, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/documentation/show/{documentation}',
            path: {
                'documentation': documentation,
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
     * App\Http\Controllers\Core\CategoryController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicGetProgramCategories({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/get-program-categories',
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
     * App\Http\Controllers\Core\ProgramController@getFeedback
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicGetProgramFeedbackItem({ program, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/get-program-feedback/{program}',
            path: {
                'program': program,
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
     * App\Http\Controllers\Core\CategoryController@shopCategories
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicGetProgramShopCategories({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/get-program-shop-categories',
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
     * App\Http\Controllers\Core\ProgramController@show
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicGetProgramItem({ program, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/get-program/{program}',
            path: {
                'program': program,
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
     * App\Http\Controllers\Core\ProgramSaleController@getRecentPrograms
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicGetPrograms({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/get-programs',
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
     * App\Http\Controllers\Core\UsersController@specialistRoles
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicGetRoles({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/get-roles',
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
     * App\Http\Controllers\Core\ProgramController@getUserFeaturedPrograms
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicGetUserFeaturedItem({ user, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/get-user-featured/{user}',
            path: {
                'user': user,
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
     * App\Http\Controllers\Core\ProgramController@getUserProgramsFeed
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicGetUserFeedItem({ user, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/get-user-feed/{user}',
            path: {
                'user': user,
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
     * App\Http\Controllers\Core\ImageController@getLogo
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicLogoItem({ tenant, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/logo/{tenant}',
            path: {
                'tenant': tenant,
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
     * App\Http\Controllers\Core\ProgramSaleController@getMoneyDistributions
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicProgramSaleMoneyDistributions({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/program-sale/money-distributions',
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
     * App\Http\Controllers\Core\UsersController@handleShortLink
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicShortLinkItem({ shortLink, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/short-link/{shortLink}',
            path: {
                'shortLink': shortLink,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsController@publicAll
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicSubprojects({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/subprojects',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsController@publicSearch
     * @returns any Success
     * @throws ApiError
     */
    static postApiPublicSubprojectsSearch({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/public/subprojects/search',
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
     * App\Http\Controllers\Core\UserTeamController@getInviteByToken
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicTeamGetInviteItem({ token, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/team/get-invite/{token}',
            path: {
                'token': token,
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
     * App\Http\Controllers\Core\UserTeamController@getInviteDataByToken
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicTeamGetInvitedDataItem({ token, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/team/get-invited-data/{token}',
            path: {
                'token': token,
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
     * App\Http\Controllers\Core\UserTeamController@rejectPotentialInvite
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiPublicTeamRejectInviteItem({ token, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/public/team/reject-invite/{token}',
            path: {
                'token': token,
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
     * App\Http\Controllers\Core\UsersController@getTopCreators
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicTopCreators({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/top-creators',
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
     * App\Http\Controllers\Core\CountriesController@getUserCountry
     * @returns any Success
     * @throws ApiError
     */
    static getApiPublicUserCountryItem({ id, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/public/user-country/{id}',
            path: {
                'id': id,
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
     * App\Http\Controllers\Core\Auth\SocialLoginController@verifyToken
     * @returns any Success
     * @throws ApiError
     */
    static postApiPublicVerifySocialToken({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/public/verify-social-token',
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
     * App\Http\Controllers\Core\Auth\VerificationController@resendVerificationMail
     * @returns any Success
     * @throws ApiError
     */
    static apiVerificationResend({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/resend-verify-email',
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
     * App\Http\Controllers\Core\RolesController@index
     * @returns any Success
     * @throws ApiError
     */
    static roleIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/role',
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
     * App\Http\Controllers\Core\RolesController@store
     * method store not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static roleStore({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/role',
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
     * App\Http\Controllers\Core\RolesController@show
     * method show not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static roleShow({ role, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/role/{role}',
            path: {
                'role': role,
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
     * App\Http\Controllers\Core\RolesController@update
     * method update not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static roleUpdate({ role, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/role/{role}',
            path: {
                'role': role,
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
     * App\Http\Controllers\Core\RolesController@destroy
     * method destroy not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static roleDestroy({ role, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/role/{role}',
            path: {
                'role': role,
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
     * App\Http\Controllers\Core\RolesController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiRolesToAssignAll({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/roles-to-assign/all',
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
     * App\Http\Controllers\Core\RolesController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiRolesAll({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/roles/all',
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
     * App\Http\Controllers\Core\ScheduleController@index
     * @returns any Success
     * @throws ApiError
     */
    static scheduleIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/schedule',
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
     * App\Http\Controllers\Core\ScheduleController@store
     * @returns any Success
     * @throws ApiError
     */
    static scheduleStore({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/schedule',
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
     * App\Http\Controllers\Core\ScheduleCallController@index
     * @returns any Success
     * @throws ApiError
     */
    static scheduleCallIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/schedule-call',
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
     * App\Http\Controllers\Core\ScheduleCallController@store
     * method store not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static scheduleCallStore({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/schedule-call',
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
     * App\Http\Controllers\Core\ScheduleCallController@show
     * method show not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static scheduleCallShow({ scheduleCall, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/schedule-call/{schedule_call}',
            path: {
                'schedule_call': scheduleCall,
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
     * App\Http\Controllers\Core\ScheduleCallController@update
     * method update not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static scheduleCallUpdate({ scheduleCall, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/schedule-call/{schedule_call}',
            path: {
                'schedule_call': scheduleCall,
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
     * App\Http\Controllers\Core\ScheduleCallController@destroy
     * method destroy not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static scheduleCallDestroy({ scheduleCall, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/schedule-call/{schedule_call}',
            path: {
                'schedule_call': scheduleCall,
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
     * App\Http\Controllers\Core\ScheduleController@show
     * method show not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static scheduleShow({ schedule, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/schedule/{schedule}',
            path: {
                'schedule': schedule,
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
     * App\Http\Controllers\Core\ScheduleController@update
     * method update not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static scheduleUpdate({ schedule, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/schedule/{schedule}',
            path: {
                'schedule': schedule,
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
     * App\Http\Controllers\Core\ScheduleController@destroy
     * method destroy not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static scheduleDestroy({ schedule, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/schedule/{schedule}',
            path: {
                'schedule': schedule,
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
     * App\Http\Controllers\Core\SearchController@search
     * @returns any Success
     * @throws ApiError
     */
    static getApiSearch({ xDomain, q, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/search',
            headers: {
                'X-Domain': xDomain,
            },
            query: {
                'q': q,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * App\Http\Controllers\Core\SeoPageController@index
     * @returns any Success
     * @throws ApiError
     */
    static seoPageIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/seo-page',
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
     * App\Http\Controllers\Core\SeoPageController@store
     * @returns any Success
     * @throws ApiError
     */
    static seoPageStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/seo-page',
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
     * App\Http\Controllers\Core\SeoPageController@destroyItem
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiSeoPageItemItem({ seoPageItem, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/seo-page/item/{seoPageItem}',
            path: {
                'seoPageItem': seoPageItem,
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
     * App\Http\Controllers\Core\SeoPageController@show
     * @returns any Success
     * @throws ApiError
     */
    static seoPageShow({ seoPage, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/seo-page/{seo_page}',
            path: {
                'seo_page': seoPage,
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
     * App\Http\Controllers\Core\SeoPageController@update
     * @returns any Success
     * @throws ApiError
     */
    static seoPageUpdate({ seoPage, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/seo-page/{seo_page}',
            path: {
                'seo_page': seoPage,
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
     * App\Http\Controllers\Core\SeoPageController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static seoPageDestroy({ seoPage, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/seo-page/{seo_page}',
            path: {
                'seo_page': seoPage,
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
     * App\Http\Controllers\Api\ShowcaseProjectsController@index
     * @returns any Success
     * @throws ApiError
     */
    static getApiShowcaseProjects({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/showcase/projects',
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
     * App\Http\Controllers\Core\UI\StatisticItemsController@index
     * @returns any Success
     * @throws ApiError
     */
    static adminStatisticIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/statistic',
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
     * App\Http\Controllers\Core\UI\StatisticItemsController@store
     * @returns any Success
     * @throws ApiError
     */
    static adminStatisticStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/statistic',
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
     * App\Http\Controllers\Core\UI\StatisticItemsController@show
     * @returns any Success
     * @throws ApiError
     */
    static adminStatisticShow({ statistic, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/statistic/{statistic}',
            path: {
                'statistic': statistic,
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
     * App\Http\Controllers\Core\UI\StatisticItemsController@update
     * @returns any Success
     * @throws ApiError
     */
    static adminStatisticUpdate({ statistic, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/statistic/{statistic}',
            path: {
                'statistic': statistic,
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
     * App\Http\Controllers\Core\UI\StatisticItemsController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static adminStatisticDestroy({ statistic, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/statistic/{statistic}',
            path: {
                'statistic': statistic,
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
     * App\Http\Controllers\Core\StripeConnectController@checkAccount
     * @returns any Success
     * @throws ApiError
     */
    static getApiStripeCheckAccount({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/stripe/check-account',
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
     * App\Http\Controllers\Core\StripeConnectController@connectToStripe
     * @returns any Success
     * @throws ApiError
     */
    static getApiStripeConnect({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/stripe/connect',
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
     * App\Http\Controllers\Core\StripeConnectController@deleteAccount
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiStripeDeleteAccount({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/stripe/delete-account',
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
     * App\Http\Controllers\Core\StripeConnectController@getTransactions
     * @returns any Success
     * @throws ApiError
     */
    static getApiStripeTransactions({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/stripe/transactions',
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
     * App\Http\Controllers\Core\StripeConnectController@withdrawMoney
     * @returns any Success
     * @throws ApiError
     */
    static getApiStripeWithdraw({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/stripe/withdraw',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsController@index
     * @returns any Success
     * @throws ApiError
     */
    static subprojectIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/subproject',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorAuthController@accountData
     * @returns any Success
     * @throws ApiError
     */
    static getApiSubprojectAdminAccountData({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/subproject-admin/account-data',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorWizardFlowController@storeContentStep
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectAdminClaimSubprojectItemContent({ subproject, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-admin/claim/subproject/{subproject}/content',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorWizardFlowController@storeDomainsStep
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectAdminClaimSubprojectItemDomains({ subproject, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-admin/claim/subproject/{subproject}/domains',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorWizardFlowController@storeLayoutStep
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectAdminClaimSubprojectItemLayout({ subproject, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-admin/claim/subproject/{subproject}/layout',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorWizardFlowController@storeSeoStep
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectAdminClaimSubprojectItemSeo({ subproject, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-admin/claim/subproject/{subproject}/seo',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorWizardFlowController@storeTeamStep
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectAdminClaimSubprojectItemTeam({ subproject, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-admin/claim/subproject/{subproject}/team',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorWizardFlowController@storeTemplateStep
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectAdminClaimSubprojectItemTemplate({ subproject, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-admin/claim/subproject/{subproject}/template',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorWizardFlowController@getWizardInstance
     * @returns any Success
     * @throws ApiError
     */
    static getApiSubprojectAdminClaimSubprojectItemWizardInstance({ subproject, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/subproject-admin/claim/subproject/{subproject}/wizard-instance',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorAuthController@confirmAdministratorAccount
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectAdminConfirmAccount({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-admin/confirm-account',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorAuthController@createAdministratorAccount
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectAdminCreateAccount({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-admin/create-account',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdminSubscriptionController@create
     * @returns any Success
     * @throws ApiError
     */
    static getApiSubprojectAdminCreateSubscription({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/subproject-admin/create-subscription',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorWizardFlowController@storeContentStep
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectAdminCreateSubprojectContent({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-admin/create/subproject/content',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorWizardFlowController@storeDomainsStep
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectAdminCreateSubprojectDomains({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-admin/create/subproject/domains',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorWizardFlowController@storeLayoutStep
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectAdminCreateSubprojectLayout({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-admin/create/subproject/layout',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorWizardFlowController@storeSeoStep
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectAdminCreateSubprojectSeo({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-admin/create/subproject/seo',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorWizardFlowController@storeTeamStep
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectAdminCreateSubprojectTeam({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-admin/create/subproject/team',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorWizardFlowController@storeTemplateStep
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectAdminCreateSubprojectTemplate({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-admin/create/subproject/template',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorWizardFlowController@findClaimableSubproject
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectAdminFindClaimable({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-admin/find-claimable',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorAuthController@getAllowedToSignUpCountries
     * @returns any Success
     * @throws ApiError
     */
    static getApiSubprojectAdminGetAllowedCountries({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/subproject-admin/get-allowed-countries',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorAuthController@login
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectAdminLogin({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-admin/login',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorWizardFlowController@startClaiming
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectAdminStartClaimingItemClaim({ subproject, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-admin/start-claiming/{subproject}/claim',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorWizardFlowController@hasContacts
     * @returns post_api_subproject_admin_subproject_has_contactsResponse Success
     * @throws ApiError
     */
    static postApiSubprojectAdminSubprojectHasContacts({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-admin/subproject/has-contacts',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdminSubscriptionController@status
     * @returns any Success
     * @throws ApiError
     */
    static getApiSubprojectAdminSubscriptionStatus({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/subproject-admin/subscription-status',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsController@search
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectSearch({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-search',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsController@getSubprojectSettings
     * @returns any Success
     * @throws ApiError
     */
    static getApiSubprojectSettings({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/subproject-settings',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectTeamController@deleteInvite
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiSubprojectTeamDeleteInviteItemItem({ id, xDomain, requestBody, subproject, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/subproject-team/delete-invite/{id}/{subproject}',
            path: {
                'id': id,
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectTeamController@getSubprojectTeamInvites
     * @returns any Success
     * @throws ApiError
     */
    static getApiSubprojectTeamGetInvitesItem({ xDomain, subproject, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/subproject-team/get-invites/{subproject}',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectTeamController@renewToken
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectTeamRenewTokenItem({ xDomain, requestBody, subproject, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-team/renew-token/{subproject}',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectTeamController@sendSubprojectTeamInvites
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectTeamSendInvitesItem({ xDomain, requestBody, subproject, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-team/send-invites/{subproject}',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectTeamController@updateInvitePermissions
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectTeamUpdatePermissionsItem({ xDomain, requestBody, subproject, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-team/update-permissions/{subproject}',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsController@getTypes
     * method getTypes not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static getApiSubprojectTypes({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/subproject-types',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsController@storeContentStep
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectWizardContentItem({ id, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-wizard/content/{id}',
            path: {
                'id': id,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsController@isWizardStarted
     * @returns any Success
     * @throws ApiError
     */
    static getApiSubprojectWizardCreationStarted({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/subproject-wizard/creation-started',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsController@storeDomainsStep
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectWizardDomainsItem({ id, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-wizard/domains/{id}',
            path: {
                'id': id,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsController@getWizardStepsInstance
     * @returns any Success
     * @throws ApiError
     */
    static getApiSubprojectWizardGet({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/subproject-wizard/get',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsController@storeLayoutStep
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectWizardLayoutItem({ id, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-wizard/layout/{id}',
            path: {
                'id': id,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsController@storeSeoStep
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectWizardSeoItem({ id, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-wizard/seo/{id}',
            path: {
                'id': id,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsController@storeTeamStep
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectWizardTeamItem({ id, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-wizard/team/{id}',
            path: {
                'id': id,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsController@storeTemplateStep
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectWizardTemplateItem({ id, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject-wizard/template/{id}',
            path: {
                'id': id,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiSubprojectAll({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/subproject/all',
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsController@deleteCategory
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubprojectDeleteCategoryItem({ subproject, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subproject/delete-category/{subproject}',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsController@show
     * @returns any Success
     * @throws ApiError
     */
    static subprojectShow({ subproject, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/subproject/{subproject}',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectsController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static subprojectDestroy({ subproject, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/subproject/{subproject}',
            path: {
                'subproject': subproject,
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
     * App\Http\Controllers\Core\SubscriptionController@cancelSubscription
     * @returns any Success
     * @throws ApiError
     */
    static getApiSubscriptionCancelItem({ subscription, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/subscription/cancel/{subscription}',
            path: {
                'subscription': subscription,
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
     * App\Http\Controllers\Core\SubscriptionController@store
     * @returns any Success
     * @throws ApiError
     */
    static postApiSubscriptionCreate({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/subscription/create',
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
     * App\Http\Controllers\Core\SubscriptionController@getMySubscribers
     * method getMySubscribers not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static getApiSubscriptionGetMySubscribers({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/subscription/get/my-subscribers',
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
     * App\Http\Controllers\Core\SubscriptionController@show
     * @returns any Success
     * @throws ApiError
     */
    static getApiSubscriptionGetItem({ user, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/subscription/get/{user}',
            path: {
                'user': user,
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
     * App\Http\Controllers\Core\SubscriptionController@getUserSubscription
     * @returns any Success
     * @throws ApiError
     */
    static getApiSubscriptionMySubscription({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/subscription/my-subscription',
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
     * App\Http\Controllers\Core\SubscriptionController@remove
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiSubscriptionRemoveItem({ subscription, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/subscription/remove/{subscription}',
            path: {
                'subscription': subscription,
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
     * App\Http\Controllers\Core\SubscriptionController@subscribe
     * @returns any Success
     * @throws ApiError
     */
    static getApiSubscriptionSubscribeItem({ subscription, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/subscription/subscribe/{subscription}',
            path: {
                'subscription': subscription,
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
     * App\Http\Controllers\Core\SubscriptionController@getUserSubscribers
     * @returns any Success
     * @throws ApiError
     */
    static getApiSubscriptionSubscribers({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/subscription/subscribers',
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
     * App\Http\Controllers\Core\SubscriptionController@getSubscribedToList
     * @returns any Success
     * @throws ApiError
     */
    static getApiSubscriptionSubscribes({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/subscription/subscribes',
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
     * App\Http\Controllers\Core\SubscriptionController@update
     * @returns any Success
     * @throws ApiError
     */
    static patchApiSubscriptionUpdateItem({ subscription, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PATCH',
            url: '/api/subscription/update/{subscription}',
            path: {
                'subscription': subscription,
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
     * App\Http\Controllers\CodifySubprojects\SubprojectAdministratorsController@teamSearch
     * @returns any Success
     * @throws ApiError
     */
    static postApiTeamSearch({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/team-search',
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
     * App\Http\Controllers\Core\UserTeamController@acceptInvite
     * @returns any Success
     * @throws ApiError
     */
    static postApiTeamAccept({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/team/accept',
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
     * App\Http\Controllers\Core\UserTeamController@acceptPotentialInvite
     * @returns any Success
     * @throws ApiError
     */
    static getApiTeamAcceptInviteItem({ token, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/team/accept-invite/{token}',
            path: {
                'token': token,
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
     * App\Http\Controllers\Core\UserTeamController@getMyTeam
     * @returns any Success
     * @throws ApiError
     */
    static getApiTeamAll({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/team/all',
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
     * App\Http\Controllers\Core\UserTeamController@handleRole
     * @returns any Success
     * @throws ApiError
     */
    static postApiTeamHandleRole({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/team/handle-role',
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
     * App\Http\Controllers\Core\UserTeamController@inviteMember
     * @returns any Success
     * @throws ApiError
     */
    static postApiTeamInvite({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/team/invite',
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
     * App\Http\Controllers\Core\UserTeamController@leaveTeam
     * @returns any Success
     * @throws ApiError
     */
    static postApiTeamLeave({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/team/leave',
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
     * App\Http\Controllers\Core\UserTeamController@index
     * @returns any Success
     * @throws ApiError
     */
    static getApiTeamListItem({ status, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/team/list/{status}',
            path: {
                'status': status,
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
     * App\Http\Controllers\Core\UserTeamController@member
     * @returns any Success
     * @throws ApiError
     */
    static getApiTeamMemberItem({ status, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/team/member/{status}',
            path: {
                'status': status,
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
     * App\Http\Controllers\Core\UserTeamController@inviteNetworkMember
     * @returns any Success
     * @throws ApiError
     */
    static postApiTeamNetworkInvite({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/team/network-invite',
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
     * App\Http\Controllers\Core\UserTeamController@invitePotentialMember
     * @returns any Success
     * @throws ApiError
     */
    static postApiTeamNetworkInvitePotential({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/team/network-invite-potential',
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
     * App\Http\Controllers\Core\UserTeamController@networkSearch
     * @returns any Success
     * @throws ApiError
     */
    static postApiTeamNetworkSearch({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/team/network-search',
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
     * App\Http\Controllers\Core\UserTeamController@rejectInvite
     * @returns any Success
     * @throws ApiError
     */
    static postApiTeamReject({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/team/reject',
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
     * App\Http\Controllers\Core\UserTeamController@removeMember
     * @returns any Success
     * @throws ApiError
     */
    static postApiTeamRemove({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/team/remove',
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
     * App\Http\Controllers\Core\UserTeamController@removePotentialMember
     * @returns any Success
     * @throws ApiError
     */
    static postApiTeamRemovePotential({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/team/remove-potential',
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
     * App\Http\Controllers\Core\UserTeamController@availableRoles
     * @returns any Success
     * @throws ApiError
     */
    static getApiTeamRoles({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/team/roles',
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
     * App\Http\Controllers\Core\UserTeamController@searchMembers
     * @returns any Success
     * @throws ApiError
     */
    static postApiTeamSearchMembers({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/team/search-members',
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
     * App\Http\Controllers\Core\UserTeamController@searchUsers
     * @returns any Success
     * @throws ApiError
     */
    static postApiTeamSearchUsers({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/team/search-users',
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
     * App\Http\Controllers\Core\TenantClaimController@complete
     * @returns any Success
     * @throws ApiError
     */
    static postApiTenantClaimComplete({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/tenant-claim/complete',
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
     * App\Http\Controllers\Core\TenantClaimController@details
     * @returns any Success
     * @throws ApiError
     */
    static getApiTenantClaimDetailsItem({ id, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/tenant-claim/details/{id}',
            path: {
                'id': id,
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
     * App\Http\Controllers\Core\TenantClaimController@initiate
     * @returns any Success
     * @throws ApiError
     */
    static postApiTenantClaimInitiate({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/tenant-claim/initiate',
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
     * App\Http\Controllers\Core\TenantClaimController@myClaim
     * @returns any Success
     * @throws ApiError
     */
    static getApiTenantClaimMyClaim({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/tenant-claim/my-claim',
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
     * App\Http\Controllers\Core\TenantClaimController@search
     * @returns any Success
     * @throws ApiError
     */
    static getApiTenantClaimSearch({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/tenant-claim/search',
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
     * App\Http\Controllers\Core\TenantClaimController@status
     * @returns any Success
     * @throws ApiError
     */
    static getApiTenantClaimStatusItem({ token, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/tenant-claim/status/{token}',
            path: {
                'token': token,
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
     * App\Http\Controllers\Core\TenantClaimController@verify
     * @returns any Success
     * @throws ApiError
     */
    static postApiTenantClaimVerify({ xDomain, formData, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/tenant-claim/verify',
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
     * App\Http\Controllers\Core\TenantInterfaceBlockController@index
     * @returns any Success
     * @throws ApiError
     */
    static getApiTenantInterfaceBlockByPageItem({ pageId, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/tenant-interface-block/by-page/{page_id}',
            path: {
                'page_id': pageId,
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
     * App\Http\Controllers\Core\TenantInterfacePageController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiTenantInterfacePageAllItem({ interfaceId, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/tenant-interface-page/all/{interface_id}',
            path: {
                'interface_id': interfaceId,
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
     * App\Http\Controllers\Core\TenantInterfacePageController@index
     * @returns any Success
     * @throws ApiError
     */
    static getApiTenantInterfacePageInterfaceItem({ interfaceId, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/tenant-interface-page/interface/{interface_id}',
            path: {
                'interface_id': interfaceId,
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
     * App\Http\Controllers\Core\TenantInterfaceController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiTenantInterfaceAll({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/tenant-interface/all',
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
     * App\Http\Controllers\Core\TenantRegistrationController@fees
     * @returns any Success
     * @throws ApiError
     */
    static getApiTenantRegistrationFees({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/tenant-registration/fees',
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
     * App\Http\Controllers\Api\TwitterController@timeline
     * @returns get_api_twitter_timelineResponse Success
     * @throws ApiError
     */
    static getApiTwitterTimeline({ xDomain, username, limit, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/twitter/timeline',
            headers: {
                'X-Domain': xDomain,
            },
            query: {
                'username': username,
                'limit': limit,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * App\Http\Controllers\Core\UsersController@index
     * @returns any Success
     * @throws ApiError
     */
    static adminUserIndex({ xDomain, q, perPage, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/user',
            headers: {
                'X-Domain': xDomain,
            },
            query: {
                'q': q,
                'per_page': perPage,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * App\Http\Controllers\Core\UsersController@store
     * @returns any Success
     * @throws ApiError
     */
    static adminUserStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/user',
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
     * App\Http\Controllers\Core\UsersController@changeCover
     * @returns any Success
     * @throws ApiError
     */
    static postApiUserChangeCoverItem({ user, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/user/change-cover/{user}',
            path: {
                'user': user,
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
     * App\Http\Controllers\Core\UsersController@changePhoto
     * @returns any Success
     * @throws ApiError
     */
    static postApiUserChangePhotoItem({ user, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/user/change-photo/{user}',
            path: {
                'user': user,
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
     * App\Http\Controllers\Core\UsersController@creatorDashboard
     * @returns any Success
     * @throws ApiError
     */
    static getApiUserCreatorDashboard({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/user/creator-dashboard',
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
     * App\Http\Controllers\Core\UsersController@creatorStats
     * @returns any Success
     * @throws ApiError
     */
    static getApiUserCreatorStats({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/user/creator-stats',
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
     * App\Http\Controllers\Core\UsersController@finishCodifyRegistration
     * @returns any Success
     * @throws ApiError
     */
    static postApiUserFinishCodifyRegistration({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/user/finish-codify-registration',
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
     * App\Http\Controllers\Core\UsersController@getUserData
     * @returns any Success
     * @throws ApiError
     */
    static getApiUserGetData({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/user/get-data',
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
     * App\Http\Controllers\Core\UsersController@getUserWalletBalance
     * @returns any Success
     * @throws ApiError
     */
    static getApiUserGetWallet({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/user/get-wallet',
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
     * App\Http\Controllers\Core\UsersController@setTimezone
     * @returns any Success
     * @throws ApiError
     */
    static postApiUserSetTimezone({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/user/set-timezone',
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
     * App\Http\Controllers\Core\UsersController@show
     * @returns any Success
     * @throws ApiError
     */
    static adminUserShow({ user, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/user/{user}',
            path: {
                'user': user,
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
     * App\Http\Controllers\Core\UsersController@update
     * @returns any Success
     * @throws ApiError
     */
    static adminUserUpdate({ user, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/user/{user}',
            path: {
                'user': user,
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
     * App\Http\Controllers\Core\UsersController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static adminUserDestroy({ user, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/user/{user}',
            path: {
                'user': user,
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
     * App\Http\Controllers\Core\UsersController@getAssignedTags
     * @returns any Success
     * @throws ApiError
     */
    static getApiUsersAssignedTagsItem({ category, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/users/assigned-tags/{category}',
            path: {
                'category': category,
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
     * App\Http\Controllers\Core\UsersController@requestBecomeCreator
     * method requestBecomeCreator not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static postApiUsersBecomeCreatorItem({ user, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/users/become-creator/{user}',
            path: {
                'user': user,
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
     * App\Http\Controllers\Core\UsersController@canCreator
     * @returns any Success
     * @throws ApiError
     */
    static getApiUsersCanCreatorItem({ user, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/users/can-creator/{user}',
            path: {
                'user': user,
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
     * App\Http\Controllers\Core\UsersController@changeCover
     * @returns any Success
     * @throws ApiError
     */
    static postApiUsersChangeCoverItem({ user, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/users/change-cover/{user}',
            path: {
                'user': user,
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
     * App\Http\Controllers\Core\UsersController@changePhoto
     * @returns any Success
     * @throws ApiError
     */
    static postApiUsersChangePhotoItem({ user, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/users/change-photo/{user}',
            path: {
                'user': user,
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
     * App\Http\Controllers\Core\UsersController@removeRole
     * @returns any Success
     * @throws ApiError
     */
    static postApiUsersDeleteRole({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/users/delete-role',
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
     * App\Http\Controllers\Core\UsersController@deleteAccount
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiUsersDeleteItem({ user, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/users/delete/{user}',
            path: {
                'user': user,
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
     * App\Http\Controllers\Core\UsersController@findUser
     * @returns any Success
     * @throws ApiError
     */
    static getApiUsersFindItem({ searchQuery, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/users/find/{searchQuery}',
            path: {
                'searchQuery': searchQuery,
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
     * App\Http\Controllers\Core\UsersController@getAvailableRoles
     * @returns any Success
     * @throws ApiError
     */
    static getApiUsersGetAvailableRoles({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/users/get-available-roles',
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
     * App\Http\Controllers\Core\UsersController@sendOneTimeCode
     * @returns any Success
     * @throws ApiError
     */
    static postApiUsersGetCode({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/users/get-code',
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
     * App\Http\Controllers\Core\UsersController@getFinancing
     * @returns any Success
     * @throws ApiError
     */
    static getApiUsersGetPricing({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/users/get-pricing',
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
     * App\Http\Controllers\Core\UsersController@getRestrictedUsers
     * @returns any Success
     * @throws ApiError
     */
    static getApiUsersGetRestrictedUsers({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/users/get-restricted-users',
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
     * App\Http\Controllers\Core\UsersController@getRoleCategories
     * @returns any Success
     * @throws ApiError
     */
    static getApiUsersGetRoleCategoryItem({ category, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/users/get-role-category/{category}',
            path: {
                'category': category,
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
     * App\Http\Controllers\Core\UsersController@getRoles
     * @returns any Success
     * @throws ApiError
     */
    static getApiUsersGetRoles({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/users/get-roles',
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
     * App\Http\Controllers\Core\UsersController@getUserSessions
     * @returns any Success
     * @throws ApiError
     */
    static getApiUsersGetSessions({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/users/get-sessions',
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
     * App\Http\Controllers\Core\UsersController@handleUserTag
     * @returns any Success
     * @throws ApiError
     */
    static postApiUsersHandleUserTag({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/users/handle-user-tag',
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
     * App\Http\Controllers\Core\UsersController@byUserId
     * @returns any Success
     * @throws ApiError
     */
    static getApiUsersIdItem({ user, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/users/id/{user}',
            path: {
                'user': user,
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
     * App\Http\Controllers\Core\UsersController@byUsername
     * @returns any Success
     * @throws ApiError
     */
    static getApiUsersNameItem({ username, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/users/name/{username}',
            path: {
                'username': username,
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
     * App\Http\Controllers\Core\ReferralSystemController@getReferralData
     * @returns any Success
     * @throws ApiError
     */
    static getApiUsersReferral({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/users/referral',
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
     * App\Http\Controllers\Core\ReferralSystemController@getReferralTransactions
     * @returns any Success
     * @throws ApiError
     */
    static getApiUsersReferralTransactions({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/users/referral/transactions',
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
     * App\Http\Controllers\Core\UsersController@getRestrictedUsers
     * @returns any Success
     * @throws ApiError
     */
    static getApiUsersRemoveRestrictionItem({ restriction, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/users/remove-restriction/{restriction}',
            path: {
                'restriction': restriction,
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
     * App\Http\Controllers\Core\UsersController@restrictUser
     * @returns any Success
     * @throws ApiError
     */
    static postApiUsersRestrictItem({ user, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/users/restrict/{user}',
            path: {
                'user': user,
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
     * App\Http\Controllers\Core\UsersController@setRole
     * @returns any Success
     * @throws ApiError
     */
    static postApiUsersSetRole({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/users/set-role',
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
     * App\Http\Controllers\Core\UsersController@updateBillingInformation
     * @returns any Success
     * @throws ApiError
     */
    static patchApiUsersUpdateBillingInfo({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PATCH',
            url: '/api/users/update-billing-info',
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
     * App\Http\Controllers\Core\UsersController@updatePassword
     * @returns any Success
     * @throws ApiError
     */
    static patchApiUsersUpdatePasswordItem({ user, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PATCH',
            url: '/api/users/update-password/{user}',
            path: {
                'user': user,
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
     * App\Http\Controllers\Core\UsersController@updatePhone
     * @returns any Success
     * @throws ApiError
     */
    static patchApiUsersUpdatePhone({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PATCH',
            url: '/api/users/update-phone',
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
     * App\Http\Controllers\Core\UsersController@updateInternalModulesPricing
     * @returns any Success
     * @throws ApiError
     */
    static postApiUsersUpdatePricing({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/users/update-pricing',
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
     * App\Http\Controllers\Core\UsersController@updateProfile
     * @returns any Success
     * @throws ApiError
     */
    static patchApiUsersUpdateItem({ user, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PATCH',
            url: '/api/users/update/{user}',
            path: {
                'user': user,
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
     * App\Http\Controllers\Core\Auth\VerificationController@verifyCode
     * @returns any Success
     * @throws ApiError
     */
    static postApiVerifyCode({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/verify-code',
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
     * App\Http\Controllers\Core\ProgramSaleController@handleWebhook
     * @returns any Success
     * @throws ApiError
     */
    static postApiWebhookStripePaymentHandle({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/webhook/stripe-payment/handle',
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
     * App\Http\Controllers\WizardController@getAssessmentAnswers
     * @returns any Success
     * @throws ApiError
     */
    static getApiWizardAssessmentAnswersItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/wizard/assessment/answers/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@getAssessmentQuestions
     * @returns any Success
     * @throws ApiError
     */
    static getApiWizardAssessmentQuestionsItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/wizard/assessment/questions/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@codify
     * @returns any Success
     * @throws ApiError
     */
    static postApiWizardCodifyItem({ protocol, xDomain, formData, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/wizard/codify/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@completeProfile
     * @returns any Success
     * @throws ApiError
     */
    static postApiWizardCompleteProfileItem({ protocol, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/wizard/complete-profile/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@confirmAccount
     * @returns any Success
     * @throws ApiError
     */
    static postApiWizardConfirmAccountItem({ protocol, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/wizard/confirm-account/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@confirmCode
     * @returns any Success
     * @throws ApiError
     */
    static postApiWizardConfirmCodeItem({ protocol, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/wizard/confirm-code/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@confirmWizardProgramData
     * @returns any Success
     * @throws ApiError
     */
    static postApiWizardConfirmPreviewItem({ protocol, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/wizard/confirm-preview/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@connectStripe
     * @returns any Success
     * @throws ApiError
     */
    static getApiWizardConnectStripeItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/wizard/connect-stripe/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@sendCreatorRequest
     * @returns any Success
     * @throws ApiError
     */
    static postApiWizardCreatorRequestItem({ protocol, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/wizard/creator-request/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@getProgramFinalizationState
     * @returns any Success
     * @throws ApiError
     */
    static getApiWizardFinalizationStateItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/wizard/finalization-state/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@getProtocolFinances
     * @returns any Success
     * @throws ApiError
     */
    static getApiWizardFinancesItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/wizard/finances/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@findMembersToInvite
     * @returns any Success
     * @throws ApiError
     */
    static postApiWizardFindMembers({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/wizard/find-members',
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
     * App\Http\Controllers\WizardController@getProtocolRoles
     * @returns any Success
     * @throws ApiError
     */
    static getApiWizardGetRequiredRolesItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/wizard/get-required-roles/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@getWizardState
     * @returns any Success
     * @throws ApiError
     */
    static getApiWizardGetStateItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/wizard/get-state/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@inviteMembersToPersonalProgram
     * @returns any Success
     * @throws ApiError
     */
    static postApiWizardInviteMembersItem({ protocol, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/wizard/invite-members/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@inviteUsersToProgram
     * @returns any Success
     * @throws ApiError
     */
    static postApiWizardInviteUsersItem({ protocol, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/wizard/invite-users/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@getWizardProgramData
     * @returns any Success
     * @throws ApiError
     */
    static getApiWizardProgramDataItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/wizard/program-data/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@publicProgramCreated
     * @returns any Success
     * @throws ApiError
     */
    static getApiWizardPublicProgramCreatedItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/wizard/public-program-created/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@publishProgramSettings
     * @returns any Success
     * @throws ApiError
     */
    static postApiWizardPublishProgramItem({ protocol, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/wizard/publish-program/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@retryCreation
     * @returns any Success
     * @throws ApiError
     */
    static getApiWizardRetryCreationItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/wizard/retry-creation/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@setProgramAgent
     * @returns any Success
     * @throws ApiError
     */
    static postApiWizardSetAgentItem({ protocol, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/wizard/set-agent/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@setProgramDistributionType
     * @returns any Success
     * @throws ApiError
     */
    static postApiWizardSetDistributionTypeItem({ protocol, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/wizard/set-distribution-type/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@setProtocolFinances
     * @returns any Success
     * @throws ApiError
     */
    static postApiWizardSetFinancesItem({ protocol, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/wizard/set-finances/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@startProgram
     * @returns any Success
     * @throws ApiError
     */
    static getApiWizardStartProgramItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/wizard/start-program/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@stepBack
     * @returns any Success
     * @throws ApiError
     */
    static getApiWizardStepBackItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/wizard/step-back/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@getRolesToInvite
     * @returns any Success
     * @throws ApiError
     */
    static getApiWizardTeamRolesToInviteItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/wizard/team/roles-to-invite/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\WizardController@validateInviteMail
     * @returns any Success
     * @throws ApiError
     */
    static postApiWizardValidateEmail({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/wizard/validate-email',
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
     * App\Http\Controllers\WizardController@verifyStripeConnection
     * @returns any Success
     * @throws ApiError
     */
    static getApiWizardVerifyStripeItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/wizard/verify-stripe/{protocol}',
            path: {
                'protocol': protocol,
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
     * App\Http\Controllers\CodifySubprojects\WorldLocationsController@findCity
     * @returns any Success
     * @throws ApiError
     */
    static postApiWorldLocationsCity({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/world-locations/city',
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
     * App\Http\Controllers\CodifySubprojects\WorldLocationsController@getCity
     * @returns any Success
     * @throws ApiError
     */
    static getApiWorldLocationsCityItem({ city, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/world-locations/city/{city}',
            path: {
                'city': city,
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
     * App\Http\Controllers\CodifySubprojects\WorldLocationsController@findCountry
     * @returns any Success
     * @throws ApiError
     */
    static postApiWorldLocationsCountry({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/world-locations/country',
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
     * App\Http\Controllers\CodifySubprojects\WorldLocationsController@getCountry
     * @returns any Success
     * @throws ApiError
     */
    static getApiWorldLocationsCountryItem({ country, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/world-locations/country/{country}',
            path: {
                'country': country,
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
     * App\Http\Controllers\CodifySubprojects\WorldLocationsController@findState
     * @returns any Success
     * @throws ApiError
     */
    static postApiWorldLocationsState({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/world-locations/state',
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
     * App\Http\Controllers\CodifySubprojects\WorldLocationsController@getState
     * @returns any Success
     * @throws ApiError
     */
    static getApiWorldLocationsStateItem({ state, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/world-locations/state/{state}',
            path: {
                'state': state,
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
     * App\Http\Controllers\Core\Auth\LoginController@echoServerAuth
     * @returns get_broadcasting_authResponse Success
     * @throws ApiError
     */
    static getBroadcastingAuth({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/broadcasting/auth',
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
exports.CoreService = CoreService;
//# sourceMappingURL=CoreService.js.map