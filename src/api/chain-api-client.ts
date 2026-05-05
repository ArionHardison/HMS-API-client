/**
 * ChainApiClient — covers `/api/chain*` (6 endpoints). All `auth: api`.
 *
 * NOTE: `/api/personal-chain/*` is owned by `personal-chain-wizard-api-client`
 * and is NOT included here.
 *
 * Source of truth: `sdk/spec/endpoints.json`.
 */

import { BaseApiClient, type ApiResponse } from '../api-client';
import type {
  ChainRecord,
  CreateChainRequest,
  SwitchChainParentRequest,
  UpdateChainRequest,
} from '../types/chain';

export type {
  ChainRecord,
  CreateChainRequest,
  SwitchChainParentRequest,
  UpdateChainRequest,
};

/** `wrapper: "data"` empty acknowledgement payload. */
export interface EmptyOk {
  [key: string]: unknown;
}

export class ChainApiClient extends BaseApiClient {
  /** GET /api/chain — list. */
  async listChains(): Promise<ApiResponse<ChainRecord[]>> {
    return this.get<ChainRecord[]>('/api/chain');
  }

  /** POST /api/chain — store. */
  async createChain(body: CreateChainRequest): Promise<ApiResponse<ChainRecord>> {
    return this.post<ChainRecord>('/api/chain', body);
  }

  /** GET /api/chain/{chain} — show. */
  async showChain(chain: number | string): Promise<ApiResponse<ChainRecord>> {
    return this.get<ChainRecord>(
      `/api/chain/${encodeURIComponent(String(chain))}`,
    );
  }

  /** PUT /api/chain/{chain} — POST + `?_method=PUT`. */
  async updateChain(
    chain: number | string,
    body: UpdateChainRequest,
  ): Promise<ApiResponse<ChainRecord>> {
    return this.put<ChainRecord>(
      `/api/chain/${encodeURIComponent(String(chain))}`,
      body,
    );
  }

  /** DELETE /api/chain/{chain} — destroy. */
  async destroyChain(chain: number | string): Promise<ApiResponse<EmptyOk>> {
    return this.delete<EmptyOk>(
      `/api/chain/${encodeURIComponent(String(chain))}`,
    );
  }

  /** POST /api/chain/switch-parent/{protocol} — re-parent a chain protocol. */
  async switchChainParent(
    protocol: number | string,
    body: SwitchChainParentRequest = {},
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>(
      `/api/chain/switch-parent/${encodeURIComponent(String(protocol))}`,
      body,
    );
  }
}
