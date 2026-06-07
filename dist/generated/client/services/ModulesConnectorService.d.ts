import type { ConnectorResource } from '../models/ConnectorResource';
import type { CreateConnectorRequest } from '../models/CreateConnectorRequest';
import type { get_api_connector_item_discoverResponse } from '../models/get_api_connector_item_discoverResponse';
import type { get_api_connector_run_global_item_itemResponse } from '../models/get_api_connector_run_global_item_itemResponse';
import type { get_api_connector_run_item_itemResponse } from '../models/get_api_connector_run_item_itemResponse';
import type { post_api_connector_executeBody } from '../models/post_api_connector_executeBody';
import type { post_api_connector_executeResponse } from '../models/post_api_connector_executeResponse';
import type { UpdateConnectorRequest } from '../models/UpdateConnectorRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class ModulesConnectorService {
    /**
     * Modules\Connector\Http\Controllers\ConnectorController@index
     * @returns any Success
     * @throws ApiError
     */
    static connectorIndex({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: Array<ConnectorResource>;
        links?: Record<string, any>;
        meta?: Record<string, any>;
    }>;
    /**
     * Modules\Connector\Http\Controllers\ConnectorController@store
     * @returns any Success
     * @throws ApiError
     */
    static connectorStore({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: CreateConnectorRequest;
    }): CancelablePromise<{
        data: ConnectorResource;
    }>;
    /**
     * Modules\Connector\Http\Controllers\ConnectorController@execute
     * @returns post_api_connector_executeResponse Success
     * @throws ApiError
     */
    static postApiConnectorExecute({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: post_api_connector_executeBody;
    }): CancelablePromise<post_api_connector_executeResponse>;
    /**
     * Modules\Connector\Http\Controllers\ConnectorController@runGlobal
     * @returns get_api_connector_run_global_item_itemResponse Success
     * @throws ApiError
     */
    static getApiConnectorRunGlobalItemItem({ connector, task, xDomain, }: {
        connector: string;
        task: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<get_api_connector_run_global_item_itemResponse>;
    /**
     * Modules\Connector\Http\Controllers\ConnectorController@run
     * @returns get_api_connector_run_item_itemResponse Success
     * @throws ApiError
     */
    static getApiConnectorRunItemItem({ connector, chain, xDomain, }: {
        connector: string;
        chain: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<get_api_connector_run_item_itemResponse>;
    /**
     * Modules\Connector\Http\Controllers\ConnectorController@show
     * @returns any Success
     * @throws ApiError
     */
    static connectorShow({ connector, xDomain, }: {
        /**
         * Bound to model Connector
         */
        connector: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ConnectorResource;
    }>;
    /**
     * Modules\Connector\Http\Controllers\ConnectorController@update
     * @returns any Success
     * @throws ApiError
     */
    static connectorUpdate({ connector, xDomain, requestBody, }: {
        /**
         * Bound to model Connector
         */
        connector: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: UpdateConnectorRequest;
    }): CancelablePromise<{
        data: ConnectorResource;
    }>;
    /**
     * Modules\Connector\Http\Controllers\ConnectorController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static connectorDestroy({ connector, xDomain, }: {
        /**
         * Bound to model Connector
         */
        connector: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ConnectorResource;
    }>;
    /**
     * Modules\Connector\Http\Controllers\ConnectorController@discover
     * @returns get_api_connector_item_discoverResponse Success
     * @throws ApiError
     */
    static getApiConnectorItemDiscover({ connector, xDomain, }: {
        /**
         * Bound to model Connector
         */
        connector: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<get_api_connector_item_discoverResponse>;
    /**
     * Modules\Connector\Http\Controllers\ConnectorController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolConnectorAll({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ConnectorResource;
    }>;
}
//# sourceMappingURL=ModulesConnectorService.d.ts.map