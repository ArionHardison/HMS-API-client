import type { KPIParameterValidationResource } from '../models/KPIParameterValidationResource';
import type { KPIRoundResultsResource } from '../models/KPIRoundResultsResource';
import type { KPISettingsPreparedResource } from '../models/KPISettingsPreparedResource';
import type { KPISettingsResource } from '../models/KPISettingsResource';
import type { KPITaskResource } from '../models/KPITaskResource';
import type { ProtocolOnboardingResource } from '../models/ProtocolOnboardingResource';
import type { SaveKPIResultsRequest } from '../models/SaveKPIResultsRequest';
import type { SaveKPIRoundResultsRequest } from '../models/SaveKPIRoundResultsRequest';
import type { SaveKPISettingsRequest } from '../models/SaveKPISettingsRequest';
import type { StoreOnboardingRequest } from '../models/StoreOnboardingRequest';
import type { UserDevicesResource } from '../models/UserDevicesResource';
import type { ValidateParametersRequest } from '../models/ValidateParametersRequest';
import type { WithingsDeviceResource } from '../models/WithingsDeviceResource';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class ModulesKpiService {
    /**
     * Modules\KPI\Http\Controllers\KPISetupController@getSetup
     * @returns any Success
     * @throws ApiError
     */
    static getApiKpiGetSetupItemItem({ chain, protocol, xDomain, }: {
        chain: string;
        protocol: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: KPISettingsPreparedResource;
    }>;
    /**
     * Modules\KPI\Http\Controllers\KPISetupController@getStepParameters
     * @returns any Success
     * @throws ApiError
     */
    static getApiKpiGetItem({ chain, xDomain, }: {
        /**
         * Bound to model ProtocolPersonalChain
         */
        chain: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: KPITaskResource;
    }>;
    /**
     * Modules\KPI\Http\Controllers\KPISetupController@removeRule
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiKpiRemoveRuleItem({ rule, xDomain, }: {
        /**
         * Bound to model KPISettingsExecution
         */
        rule: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: KPISettingsResource;
    }>;
    /**
     * Modules\KPI\Http\Controllers\KPISetupController@saveChainItemKPISettings
     * @returns any Success
     * @throws ApiError
     */
    static postApiKpiSave({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: SaveKPISettingsRequest;
    }): CancelablePromise<{
        data: KPISettingsResource;
    }>;
    /**
     * Modules\KPI\Http\Controllers\KPISetupController@saveRoundResults
     * @returns any Success
     * @throws ApiError
     */
    static postApiKpiSaveRoundResults({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: SaveKPIRoundResultsRequest;
    }): CancelablePromise<{
        data: KPIRoundResultsResource;
    }>;
    /**
     * Modules\KPI\Http\Controllers\KPISetupController@saveSetup
     * @returns any Success
     * @throws ApiError
     */
    static postApiKpiSaveSetup({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: SaveKPIResultsRequest;
    }): CancelablePromise<{
        data: KPISettingsResource;
    }>;
    /**
     * Modules\KPI\Http\Controllers\KPISetupController@validateParameters
     * @returns any Success
     * @throws ApiError
     */
    static postApiKpiValidateParameters({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: ValidateParametersRequest;
    }): CancelablePromise<{
        data: KPIParameterValidationResource;
    }>;
    /**
     * Modules\KPI\Http\Controllers\KPIController@getOnboarding
     * @returns any Success
     * @throws ApiError
     */
    static getApiOnboardingGetItem({ protocol, xDomain, }: {
        protocol: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ProtocolOnboardingResource;
    }>;
    /**
     * Modules\KPI\Http\Controllers\KPIController@storeOnboarding
     * @returns any Success
     * @throws ApiError
     */
    static postApiOnboardingSaveItem({ protocol, xDomain, requestBody, }: {
        protocol: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: StoreOnboardingRequest;
    }): CancelablePromise<{
        data: ProtocolOnboardingResource;
    }>;
    /**
     * Modules\KPI\Http\Controllers\UserDeviceController@getUserDevices
     * @returns any Success
     * @throws ApiError
     */
    static getApiUserDevicesList({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: UserDevicesResource;
    }>;
    /**
     * Modules\KPI\Http\Controllers\WithingsController@redirectToWithings
     * @returns any Success
     * @throws ApiError
     */
    static getApiWithingsAuth({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: WithingsDeviceResource;
    }>;
    /**
     * Modules\KPI\Http\Controllers\WithingsController@handleCallback
     * @returns any Success
     * @throws ApiError
     */
    static getApiWithingsCallback({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: WithingsDeviceResource;
    }>;
    /**
     * Modules\KPI\Http\Controllers\WithingsController@getData
     * @returns any Success
     * @throws ApiError
     */
    static postApiWithingsWebhook({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: WithingsDeviceResource;
    }>;
}
//# sourceMappingURL=ModulesKpiService.d.ts.map