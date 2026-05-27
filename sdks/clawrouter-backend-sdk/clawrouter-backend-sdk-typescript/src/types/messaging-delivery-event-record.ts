import type { JsonValue } from './json-value';

/** Messaging delivery event record schema exposed by Claw Router. */
export interface MessagingDeliveryEventRecord {
  /** Created at field on messaging delivery event record. */
  created_at?: string;
  /** Id field on messaging delivery event record. */
  id?: string;
  /** Legal hold field on messaging delivery event record. */
  legal_hold?: boolean;
  /** Metadata field on messaging delivery event record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on messaging delivery event record. */
  organization_id?: string;
  /** Payload hash field on messaging delivery event record. */
  payload_hash?: string;
  /** Provider message id field on messaging delivery event record. */
  provider_message_id?: string;
  /** Request id field on messaging delivery event record. */
  request_id?: string;
  /** Retention until field on messaging delivery event record. */
  retention_until?: string;
  /** Send attempt id field on messaging delivery event record. */
  send_attempt_id?: string;
  /** Status field on messaging delivery event record. */
  status?: string;
  /** Tenant id field on messaging delivery event record. */
  tenant_id?: string;
  /** Trace id field on messaging delivery event record. */
  trace_id?: string;
  /** User id field on messaging delivery event record. */
  user_id?: string;
  /** Uuid field on messaging delivery event record. */
  uuid?: string;
}
