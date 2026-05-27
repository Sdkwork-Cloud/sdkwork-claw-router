import type { JsonValue } from './json-value';

/** Storage reconciliation run record schema exposed by Claw Router. */
export interface StorageReconciliationRunRecord {
  /** Bucket id field on storage reconciliation run record. */
  bucket_id?: string;
  /** Check mode field on storage reconciliation run record. */
  check_mode?: string;
  /** Completed at field on storage reconciliation run record. */
  completed_at?: string;
  /** Created at field on storage reconciliation run record. */
  created_at?: string;
  /** Data scope field on storage reconciliation run record. */
  data_scope?: string;
  /** Deleted at field on storage reconciliation run record. */
  deleted_at?: string;
  /** Deleted by field on storage reconciliation run record. */
  deleted_by?: string;
  /** Id field on storage reconciliation run record. */
  id?: string;
  /** Idempotency key field on storage reconciliation run record. */
  idempotency_key?: string;
  /** Metadata field on storage reconciliation run record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on storage reconciliation run record. */
  organization_id?: string;
  /** Provider id field on storage reconciliation run record. */
  provider_id?: string;
  /** Request id field on storage reconciliation run record. */
  request_id?: string;
  /** Requested by field on storage reconciliation run record. */
  requested_by?: string;
  /** Run type field on storage reconciliation run record. */
  run_type?: string;
  /** Status field on storage reconciliation run record. */
  status?: string;
  /** Tenant id field on storage reconciliation run record. */
  tenant_id?: string;
  /** Updated at field on storage reconciliation run record. */
  updated_at?: string;
  /** Uuid field on storage reconciliation run record. */
  uuid?: string;
  /** Version field on storage reconciliation run record. */
  version?: string;
}
