import type { JsonValue } from './json-value';

/** Commerce invoice event record schema exposed by Claw Router. */
export interface CommerceInvoiceEventRecord {
  /** Actor id field on commerce invoice event record. */
  actor_id?: string;
  /** Actor type field on commerce invoice event record. */
  actor_type: string;
  /** Created at field on commerce invoice event record. */
  created_at: string;
  /** Event no field on commerce invoice event record. */
  event_no: string;
  /** Event type field on commerce invoice event record. */
  event_type: string;
  /** From status field on commerce invoice event record. */
  from_status?: string;
  /** Id field on commerce invoice event record. */
  id?: string;
  /** Idempotency key field on commerce invoice event record. */
  idempotency_key: string;
  /** Invoice id field on commerce invoice event record. */
  invoice_id: string;
  /** Message field on commerce invoice event record. */
  message?: string;
  /** Organization id field on commerce invoice event record. */
  organization_id?: string;
  /** Payload json field on commerce invoice event record. */
  payload_json?: Record<string, JsonValue>;
  /** Reason code field on commerce invoice event record. */
  reason_code?: string;
  /** Request id field on commerce invoice event record. */
  request_id?: string;
  /** Tenant id field on commerce invoice event record. */
  tenant_id: string;
  /** To status field on commerce invoice event record. */
  to_status: string;
}
