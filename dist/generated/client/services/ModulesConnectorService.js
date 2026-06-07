"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModulesConnectorService = void 0;
const OpenAPI_1 = require("../core/OpenAPI");
const request_1 = require("../core/request");
class ModulesConnectorService {
    /**
     * Modules\Connector\Http\Controllers\ConnectorController@index
     * @returns any Success
     * @throws ApiError
     */
    static connectorIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/connector',
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Connector\Http\Controllers\ConnectorController@store
     * @returns any Success
     * @throws ApiError
     */
    static connectorStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/connector',
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
     * Modules\Connector\Http\Controllers\ConnectorController@execute
     * @returns post_api_connector_executeResponse Success
     * @throws ApiError
     */
    static postApiConnectorExecute({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/connector/execute',
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
     * Modules\Connector\Http\Controllers\ConnectorController@runGlobal
     * @returns get_api_connector_run_global_item_itemResponse Success
     * @throws ApiError
     */
    static getApiConnectorRunGlobalItemItem({ connector, task, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/connector/run-global/{connector}/{task}',
            path: {
                'connector': connector,
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
     * Modules\Connector\Http\Controllers\ConnectorController@run
     * @returns get_api_connector_run_item_itemResponse Success
     * @throws ApiError
     */
    static getApiConnectorRunItemItem({ connector, chain, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/connector/run/{connector}/{chain}',
            path: {
                'connector': connector,
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
     * Modules\Connector\Http\Controllers\ConnectorController@show
     * @returns any Success
     * @throws ApiError
     */
    static connectorShow({ connector, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/connector/{connector}',
            path: {
                'connector': connector,
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
     * Modules\Connector\Http\Controllers\ConnectorController@update
     * @returns any Success
     * @throws ApiError
     */
    static connectorUpdate({ connector, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/connector/{connector}',
            path: {
                'connector': connector,
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
     * Modules\Connector\Http\Controllers\ConnectorController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static connectorDestroy({ connector, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/connector/{connector}',
            path: {
                'connector': connector,
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
     * Modules\Connector\Http\Controllers\ConnectorController@discover
     * @returns get_api_connector_item_discoverResponse Success
     * @throws ApiError
     */
    static getApiConnectorItemDiscover({ connector, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/connector/{connector}/discover',
            path: {
                'connector': connector,
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
     * Modules\Connector\Http\Controllers\ConnectorController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolConnectorAll({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/connector/all',
            headers: {
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
exports.ModulesConnectorService = ModulesConnectorService;
//# sourceMappingURL=ModulesConnectorService.js.map