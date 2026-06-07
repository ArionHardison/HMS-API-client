"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorCoinbaseService = void 0;
const OpenAPI_1 = require("../core/OpenAPI");
const request_1 = require("../core/request");
class VendorCoinbaseService {
    /**
     * Shakurov\Coinbase\Http\Controllers\WebhookController
     * controller file not located
     * @returns any Success
     * @throws ApiError
     */
    static coinbaseWebhook({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
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
exports.VendorCoinbaseService = VendorCoinbaseService;
//# sourceMappingURL=VendorCoinbaseService.js.map