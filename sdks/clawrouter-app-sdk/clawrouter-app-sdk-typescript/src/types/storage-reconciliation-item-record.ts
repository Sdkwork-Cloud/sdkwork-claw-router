import type { JsonValue } from './json-value';

/** Storage reconciliation item record schema exposed by Claw Router. */
export interface StorageReconciliationItemRecord {
  /** Actual hash field on storage reconciliation item record. */
  actual_hash?: string;
  /** Actual size bytes field on storage reconciliation item record. */
  actual_size_bytes?: string;
  /** Bucket id field on storage reconciliation item record. */
  bucket_id?: string;
  /** Created at field on storage reconciliation item record. */
  created_at?: string;
  /** Expected hash field on storage reconciliation item record. */
  expected_hash?: string;
  /** Expected size bytes field on storage reconciliation item record. */
  expected_size_bytes?: string;
  /** Id field on storage reconciliation item record. */
  id?: string;
  /** Issue type field on storage reconciliation item record. */
  issue_type?: string;
  /** Legal hold field on storage reconciliation item record. */
  legal_hold?: boolean;
  /** Metadata field on storage reconciliation item record. */
  metadata?: Record<string, JsonValue>;
  /** Object blob id field on storage reconciliation item record. */
  object_blob_id?: string;
  /** Object key field on storage reconciliation item record. */
  object_key?: string;
  /** Organization id field on storage reconciliation item record. */
  organization_id?: string;
  /** Payload hash field on storage reconciliation item record. */
  payload_hash?: string;
  /** Repair payload field on storage reconciliation item record. */
  repair_payload?: Record<string, JsonValue>;
  /** Repair status field on storage reconciliation item record. */
  repair_status?: string;
  /** Request id field on storage reconciliation item record. */
  request_id?: string;
  /** Retention until field on storage reconciliation item record. */
  retention_until?: string;
  /** Run id field on storage reconciliation item record. */
  run_id?: string;
  /** Status field on storage reconciliation item record. */
  status?: string;
  /** Tenant id field on storage reconciliation item record. */
  tenant_id?: string;
  /** Trace id field on storage reconciliation item record. */
  trace_id?: string;
  /** User id field on storage reconciliation item record. */
  user_id?: string;
  /** Uuid field on storage reconciliation item record. */
  uuid?: string;
}
