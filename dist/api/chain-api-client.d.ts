/**
 * ChainApiClient — covers `/api/chain*` (6 endpoints). All `auth: api`.
 *
 * NOTE: `/api/personal-chain/*` is owned by `personal-chain-wizard-api-client`
 * and is NOT included here.
 *
 * Source of truth: `sdk/spec/endpoints.json`.
 */
import { BaseApiClient, type ApiResponse } from '../api-client';
import type { ChainRecord, CreateChainRequest, SwitchChainParentRequest, UpdateChainRequest } from '../types/chain';
export type { ChainRecord, CreateChainRequest, SwitchChainParentRequest, UpdateChainRequest, };
/** `wrapper: "data"` empty acknowledgement payload. */
export interface EmptyOk {
    [key: string]: unknown;
}
export declare class ChainApiClient extends BaseApiClient {
    /** GET /api/chain — list. */
    listChains(): Promise<ApiResponse<ChainRecord[]>>;
    /** POST /api/chain — store. */
    createChain(body: CreateChainRequest): Promise<ApiResponse<ChainRecord>>;
    /** GET /api/chain/{chain} — show. */
    showChain(chain: number | string): Promise<ApiResponse<ChainRecord>>;
    /** PUT /api/chain/{chain} — POST + `?_method=PUT`. */
    updateChain(chain: number | string, body: UpdateChainRequest): Promise<ApiResponse<ChainRecord>>;
    /** DELETE /api/chain/{chain} — destroy. */
    destroyChain(chain: number | string): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/chain/switch-parent/{protocol} — re-parent a chain protocol. */
    switchChainParent(protocol: number | string, body?: SwitchChainParentRequest): Promise<ApiResponse<EmptyOk>>;
}
//# sourceMappingURL=chain-api-client.d.ts.map