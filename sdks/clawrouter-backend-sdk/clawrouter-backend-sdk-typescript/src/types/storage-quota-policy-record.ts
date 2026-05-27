import type { JsonValue } from './json-value';

/** Storage quota policy record schema exposed by Claw Router. */
export interface StorageQuotaPolicyRecord {
  /** Created at field on storage quota policy record. */
  created_at?: string;
  /** Data scope field on storage quota policy record. */
  data_scope?: string;
  /** Deleted at field on storage quota policy record. */
  deleted_at?: string;
  /** Deleted by field on storage quota policy record. */
  deleted_by?: string;
  /** Enforcement field on storage quota policy record. */
  enforcement?: string;
  /** Id field on storage quota policy record. */
  id?: string;
  /** Idempotency key field on storage quota policy record. */
  idempotency_key?: string;
  /** Metadata field on storage quota policy record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on storage quota policy record. */
  organization_id?: string;
  /** Quota limit bytes field on storage quota policy record. */
  quota_limit_bytes?: string;
  /** Request id field on storage quota policy record. */
  request_id?: string;
  /** Scope id field on storage quota policy record. */
  scope_id?: string;
  /** Scope type field on storage quota policy record. */
  scope_type?: string;
  /** Single file limit bytes field on storage quota policy record. */
  single_file_limit_bytes?: string;
  /** Status field on storage quota policy record. */
  status?: string;
  /** Tenant id field on storage quota policy record. */
  tenant_id?: string;
  /** Updated at field on storage quota policy record. */
  updated_at?: string;
  /** Uuid field on storage quota policy record. */
  uuid?: string;
  /** Version field on storage quota policy record. */
  version?: string;
}
