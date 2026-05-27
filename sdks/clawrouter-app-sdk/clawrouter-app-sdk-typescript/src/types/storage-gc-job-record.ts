import type { JsonValue } from './json-value';

/** Storage gc job record schema exposed by Claw Router. */
export interface StorageGcJobRecord {
  /** Completed at field on storage gc job record. */
  completed_at?: string;
  /** Created at field on storage gc job record. */
  created_at?: string;
  /** Cursor token field on storage gc job record. */
  cursor_token?: string;
  /** Data scope field on storage gc job record. */
  data_scope?: string;
  /** Deleted at field on storage gc job record. */
  deleted_at?: string;
  /** Deleted by field on storage gc job record. */
  deleted_by?: string;
  /** Id field on storage gc job record. */
  id?: string;
  /** Idempotency key field on storage gc job record. */
  idempotency_key?: string;
  /** Job type field on storage gc job record. */
  job_type?: string;
  /** Metadata field on storage gc job record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on storage gc job record. */
  organization_id?: string;
  /** Request id field on storage gc job record. */
  request_id?: string;
  /** Requested by field on storage gc job record. */
  requested_by?: string;
  /** Started at field on storage gc job record. */
  started_at?: string;
  /** Status field on storage gc job record. */
  status?: string;
  /** Tenant id field on storage gc job record. */
  tenant_id?: string;
  /** Updated at field on storage gc job record. */
  updated_at?: string;
  /** Uuid field on storage gc job record. */
  uuid?: string;
  /** Version field on storage gc job record. */
  version?: string;
}
