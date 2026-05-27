import type { JsonValue } from './json-value';

/** Messaging send attempt record schema exposed by Claw Router. */
export interface MessagingSendAttemptRecord {
  /** Created at field on messaging send attempt record. */
  created_at?: string;
  /** Failure code field on messaging send attempt record. */
  failure_code?: string;
  /** Failure message masked field on messaging send attempt record. */
  failure_message_masked?: string;
  /** Http status field on messaging send attempt record. */
  http_status?: number;
  /** Id field on messaging send attempt record. */
  id?: string;
  /** Latency ms field on messaging send attempt record. */
  latency_ms?: number;
  /** Legal hold field on messaging send attempt record. */
  legal_hold?: boolean;
  /** Metadata field on messaging send attempt record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on messaging send attempt record. */
  organization_id?: string;
  /** Payload hash field on messaging send attempt record. */
  payload_hash?: string;
  /** Provider message id field on messaging send attempt record. */
  provider_message_id?: string;
  /** Provider request id field on messaging send attempt record. */
  provider_request_id?: string;
  /** Provider status field on messaging send attempt record. */
  provider_status?: string;
  /** Request id field on messaging send attempt record. */
  request_id?: string;
  /** Retention until field on messaging send attempt record. */
  retention_until?: string;
  /** Retry after at field on messaging send attempt record. */
  retry_after_at?: string;
  /** Status field on messaging send attempt record. */
  status?: string;
  /** Tenant id field on messaging send attempt record. */
  tenant_id?: string;
  /** Trace id field on messaging send attempt record. */
  trace_id?: string;
  /** User id field on messaging send attempt record. */
  user_id?: string;
  /** Uuid field on messaging send attempt record. */
  uuid?: string;
}
