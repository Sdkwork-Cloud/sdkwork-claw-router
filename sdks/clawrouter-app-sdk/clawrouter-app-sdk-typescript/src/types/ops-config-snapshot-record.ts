import type { JsonValue } from './json-value';

/** Ops config snapshot record schema exposed by Claw Router. */
export interface OpsConfigSnapshotRecord {
  /** Config hash field on ops config snapshot record. */
  config_hash?: string;
  /** Config payload field on ops config snapshot record. */
  config_payload?: Record<string, JsonValue>;
  /** Config scope field on ops config snapshot record. */
  config_scope?: string;
  /** Config type field on ops config snapshot record. */
  config_type?: string;
  /** Created at field on ops config snapshot record. */
  created_at?: string;
  /** Id field on ops config snapshot record. */
  id?: string;
  /** Legal hold field on ops config snapshot record. */
  legal_hold?: boolean;
  /** Metadata field on ops config snapshot record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ops config snapshot record. */
  organization_id?: string;
  /** Payload hash field on ops config snapshot record. */
  payload_hash?: string;
  /** Published at field on ops config snapshot record. */
  published_at?: string;
  /** Published by field on ops config snapshot record. */
  published_by?: string;
  /** Request id field on ops config snapshot record. */
  request_id?: string;
  /** Retention until field on ops config snapshot record. */
  retention_until?: string;
  /** Rollback from snapshot id field on ops config snapshot record. */
  rollback_from_snapshot_id?: string;
  /** Snapshot no field on ops config snapshot record. */
  snapshot_no?: string;
  /** Source ids field on ops config snapshot record. */
  source_ids?: Record<string, JsonValue>;
  /** Source table field on ops config snapshot record. */
  source_table?: string;
  /** Status field on ops config snapshot record. */
  status?: string;
  /** Tenant id field on ops config snapshot record. */
  tenant_id?: string;
  /** Trace id field on ops config snapshot record. */
  trace_id?: string;
  /** User id field on ops config snapshot record. */
  user_id?: string;
  /** Uuid field on ops config snapshot record. */
  uuid?: string;
}
