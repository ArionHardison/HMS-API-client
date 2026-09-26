import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VendorCoinbaseService {
    /**
     * Shakurov\Coinbase\Http\Controllers\WebhookController
     * controller file not located
     * @returns any Success
     * @throws ApiError
     */
    static coinbaseWebhook({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/coinbase/webhook',
            headers: {
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
//# sourceMappingURL=VendorCoinbaseService.js.map