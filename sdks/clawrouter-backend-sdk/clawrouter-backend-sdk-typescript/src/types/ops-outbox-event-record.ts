import type { JsonValue } from './json-value';

/** Ops outbox event record schema exposed by Claw Router. */
export interface OpsOutboxEventRecord {
  /** Aggregate id field on ops outbox event record. */
  aggregate_id?: string;
  /** Aggregate type field on ops outbox event record. */
  aggregate_type?: string;
  /** Aggregate uuid field on ops outbox event record. */
  aggregate_uuid?: string;
  /** Created at field on ops outbox event record. */
  created_at?: string;
  /** Event id field on ops outbox event record. */
  event_id?: string;
  /** Event payload field on ops outbox event record. */
  event_payload?: Record<string, JsonValue>;
  /** Event type field on ops outbox event record. */
  event_type?: string;
  /** Event version field on ops outbox event record. */
  event_version?: number;
  /** Failure reason field on ops outbox event record. */
  failure_reason?: string;
  /** Headers field on ops outbox event record. */
  headers?: Record<string, JsonValue>;
  /** Id field on ops outbox event record. */
  id?: string;
  /** Legal hold field on ops outbox event record. */
  legal_hold?: boolean;
  /** Metadata field on ops outbox event record. */
  metadata?: Record<string, JsonValue>;
  /** Next retry at field on ops outbox event record. */
  next_retry_at?: string;
  /** Organization id field on ops outbox event record. */
  organization_id?: string;
  /** Payload hash field on ops outbox event record. */
  payload_hash?: string;
  /** Publish status field on ops outbox event record. */
  publish_status?: string;
  /** Published at field on ops outbox event record. */
  published_at?: string;
  /** Request id field on ops outbox event record. */
  request_id?: string;
  /** Retention until field on ops outbox event record. */
  retention_until?: string;
  /** Retry count field on ops outbox event record. */
  retry_count?: number;
  /** Status field on ops outbox event record. */
  status?: string;
  /** Tenant id field on ops outbox event record. */
  tenant_id?: string;
  /** Trace id field on ops outbox event record. */
  trace_id?: string;
  /** User id field on ops outbox event record. */
  user_id?: string;
  /** Uuid field on ops outbox event record. */
  uuid?: string;
}
