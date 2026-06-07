/**
 * ChainApiClient — covers `/api/chain*` (6 endpoints). All `auth: api`.
 *
 * NOTE: `/api/personal-chain/*` is owned by `personal-chain-wizard-api-client`
 * and is NOT included here.
 *
 * Source of truth: `sdk/spec/endpoints.json`.
 */
import { BaseApiClient } from '../api-client';
export class ChainApiClient extends BaseApiClient {
    /** GET /api/chain — list. */
    async listChains() {
        return this.get('/api/chain');
    }
    /** POST /api/chain — store. */
    async createChain(body) {
        return this.post('/api/chain', body);
    }
    /** GET /api/chain/{chain} — show. */
    async showChain(chain) {
        return this.get(`/api/chain/${encodeURIComponent(String(chain))}`);
    }
    /** PUT /api/chain/{chain} — POST + `?_method=PUT`. */
    async updateChain(chain, body) {
        return this.put(`/api/chain/${encodeURIComponent(String(chain))}`, body);
    }
    /** DELETE /api/chain/{chain} — destroy. */
    async destroyChain(chain) {
        return this.delete(`/api/chain/${encodeURIComponent(String(chain))}`);
    }
    /** POST /api/chain/switch-parent/{protocol} — re-parent a chain protocol. */
    async switchChainParent(protocol, body = {}) {
        return this.post(`/api/chain/switch-parent/${encodeURIComponent(String(protocol))}`, body);
    }
}
//# sourceMappingURL=chain-api-client.js.map