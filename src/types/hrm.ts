/**
 * Types for `HrmApiClient` — the HRM relay module.
 *
 * Source of truth: `Modules/Hrm/Routes/api.php`, `HrmRelayController`,
 * `HrmRelayRequest`. Single endpoint, `auth:api` +
 * `abilities:hrm:relay` + `idempotency`. Returns HTTP 202.
 */

/**
 * Body for `POST /api/v1/integrations/hrm/relay` (HrmRelayRequest).
 *
 * `event` is the full topic routing key and must match
 * `/^(workforce|training|hrm)\./` server-side. `payload` is forwarded to the
 * resolved topic exchange verbatim, so it is typed loosely.
 */
export interface HrmRelayRequest {
  event: string;
  payload: Record<string, unknown>;
}

/** 202 body for `POST /api/v1/integrations/hrm/relay`. */
export interface HrmRelayResponse {
  accepted: boolean;
  event: string;
  /** Resolved RabbitMQ exchange: `training.events` or `workforce.events`. */
  exchange: string;
}
