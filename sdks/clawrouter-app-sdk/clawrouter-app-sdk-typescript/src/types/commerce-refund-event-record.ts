import type { JsonValue } from './json-value';

/** Commerce refund event record schema exposed by Claw Router. */
export interface CommerceRefundEventRecord {
  /** Actor id field on commerce refund event record. */
  actor_id?: string;
  /** Actor type field on commerce refund event record. */
  actor_type: string;
  /** Created at field on commerce refund event record. */
  created_at: string;
  /** Event no field on commerce refund event record. */
  event_no: string;
  /** Event type field on commerce refund event record. */
  event_type: string;
  /** From status field on commerce refund event record. */
  from_status?: string;
  /** Idempotency key field on commerce refund event record. */
  idempotency_key: string;
  /** Message field on commerce refund event record. */
  message?: string;
  /** Organization id field on commerce refund event record. */
  organization_id?: string;
  /** Payload json field on commerce refund event record. */
  payload_json?: Record<string, JsonValue>;
  /** Reason code field on commerce refund event record. */
  reason_code?: string;
  /** Refund id field on commerce refund event record. */
  refund_id: string;
  /** Request id field on commerce refund event record. */
  request_id?: string;
  /** Tenant id field on commerce refund event record. */
  tenant_id: string;
  /** To status field on commerce refund event record. */
  to_status: string;
}
