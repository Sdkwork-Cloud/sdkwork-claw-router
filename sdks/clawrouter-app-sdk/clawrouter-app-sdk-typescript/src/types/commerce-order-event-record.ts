import type { JsonValue } from './json-value';

/** Commerce order event record schema exposed by Claw Router. */
export interface CommerceOrderEventRecord {
  /** Actor id field on commerce order event record. */
  actor_id?: string;
  /** Actor type field on commerce order event record. */
  actor_type: string;
  /** Created at field on commerce order event record. */
  created_at: string;
  /** Event no field on commerce order event record. */
  event_no: string;
  /** Event type field on commerce order event record. */
  event_type: string;
  /** From status field on commerce order event record. */
  from_status?: string;
  /** Id field on commerce order event record. */
  id?: string;
  /** Idempotency key field on commerce order event record. */
  idempotency_key: string;
  /** Message field on commerce order event record. */
  message?: string;
  /** Order id field on commerce order event record. */
  order_id: string;
  /** Organization id field on commerce order event record. */
  organization_id?: string;
  /** Payload json field on commerce order event record. */
  payload_json?: Record<string, JsonValue>;
  /** Reason code field on commerce order event record. */
  reason_code?: string;
  /** Request id field on commerce order event record. */
  request_id?: string;
  /** Tenant id field on commerce order event record. */
  tenant_id: string;
  /** To status field on commerce order event record. */
  to_status: string;
}
