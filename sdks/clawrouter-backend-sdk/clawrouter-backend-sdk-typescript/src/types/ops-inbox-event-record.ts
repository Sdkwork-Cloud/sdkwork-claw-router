import type { JsonValue } from './json-value';

/** Ops inbox event record schema exposed by Claw Router. */
export interface OpsInboxEventRecord {
  /** Consumer name field on ops inbox event record. */
  consumer_name?: string;
  /** Created at field on ops inbox event record. */
  created_at?: string;
  /** Event type field on ops inbox event record. */
  event_type?: string;
  /** Event version field on ops inbox event record. */
  event_version?: number;
  /** Failure reason field on ops inbox event record. */
  failure_reason?: string;
  /** Id field on ops inbox event record. */
  id?: string;
  /** Legal hold field on ops inbox event record. */
  legal_hold?: boolean;
  /** Message id field on ops inbox event record. */
  message_id?: string;
  /** Metadata field on ops inbox event record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ops inbox event record. */
  organization_id?: string;
  /** Payload hash field on ops inbox event record. */
  payload_hash?: string;
  /** Process status field on ops inbox event record. */
  process_status?: string;
  /** Processed at field on ops inbox event record. */
  processed_at?: string;
  /** Request id field on ops inbox event record. */
  request_id?: string;
  /** Retention until field on ops inbox event record. */
  retention_until?: string;
  /** Retry count field on ops inbox event record. */
  retry_count?: number;
  /** Source system field on ops inbox event record. */
  source_system?: string;
  /** Status field on ops inbox event record. */
  status?: string;
  /** Tenant id field on ops inbox event record. */
  tenant_id?: string;
  /** Trace id field on ops inbox event record. */
  trace_id?: string;
  /** User id field on ops inbox event record. */
  user_id?: string;
  /** Uuid field on ops inbox event record. */
  uuid?: string;
}
