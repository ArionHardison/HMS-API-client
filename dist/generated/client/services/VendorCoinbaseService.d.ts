import type { CancelablePromise } from '../core/CancelablePromise';
export declare class VendorCoinbaseService {
    /**
     * Shakurov\Coinbase\Http\Controllers\WebhookController
     * controller file not located
     * @returns any Success
     * @throws ApiError
     */
    static coinbaseWebhook({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<Record<string, any>>;
}
//# sourceMappingURL=VendorCoinbaseService.d.ts.map