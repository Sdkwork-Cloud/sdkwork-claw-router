import type { JsonValue } from './json-value';

/** Ops alert event record schema exposed by Claw Router. */
export interface OpsAlertEventRecord {
  /** Alert no field on ops alert event record. */
  alert_no?: string;
  /** Alert status field on ops alert event record. */
  alert_status?: string;
  /** Created at field on ops alert event record. */
  created_at?: string;
  /** First seen at field on ops alert event record. */
  first_seen_at?: string;
  /** Id field on ops alert event record. */
  id?: string;
  /** Last seen at field on ops alert event record. */
  last_seen_at?: string;
  /** Legal hold field on ops alert event record. */
  legal_hold?: boolean;
  /** Message field on ops alert event record. */
  message?: string;
  /** Metadata field on ops alert event record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ops alert event record. */
  organization_id?: string;
  /** Payload hash field on ops alert event record. */
  payload_hash?: string;
  /** Request id field on ops alert event record. */
  request_id?: string;
  /** Resolved at field on ops alert event record. */
  resolved_at?: string;
  /** Resolved by field on ops alert event record. */
  resolved_by?: string;
  /** Retention until field on ops alert event record. */
  retention_until?: string;
  /** Severity field on ops alert event record. */
  severity?: string;
  /** Source field on ops alert event record. */
  source?: string;
  /** Status field on ops alert event record. */
  status?: string;
  /** Tenant id field on ops alert event record. */
  tenant_id?: string;
  /** Title field on ops alert event record. */
  title?: string;
  /** Trace id field on ops alert event record. */
  trace_id?: string;
  /** User id field on ops alert event record. */
  user_id?: string;
  /** Uuid field on ops alert event record. */
  uuid?: string;
}
