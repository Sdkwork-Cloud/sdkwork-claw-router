import type { JsonValue } from './json-value';

/** Storage usage snapshot record schema exposed by Claw Router. */
export interface StorageUsageSnapshotRecord {
  /** App id field on storage usage snapshot record. */
  app_id?: string;
  /** Business domain field on storage usage snapshot record. */
  business_domain?: string;
  /** Created at field on storage usage snapshot record. */
  created_at?: string;
  /** Data scope field on storage usage snapshot record. */
  data_scope?: string;
  /** Deleted at field on storage usage snapshot record. */
  deleted_at?: string;
  /** Deleted by field on storage usage snapshot record. */
  deleted_by?: string;
  /** Id field on storage usage snapshot record. */
  id?: string;
  /** Metadata field on storage usage snapshot record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on storage usage snapshot record. */
  organization_id?: string;
  /** Scope id field on storage usage snapshot record. */
  scope_id?: string;
  /** Scope type field on storage usage snapshot record. */
  scope_type?: string;
  /** Snapshot type field on storage usage snapshot record. */
  snapshot_type?: string;
  /** Space id field on storage usage snapshot record. */
  space_id?: string;
  /** Status field on storage usage snapshot record. */
  status?: string;
  /** Tenant id field on storage usage snapshot record. */
  tenant_id?: string;
  /** Updated at field on storage usage snapshot record. */
  updated_at?: string;
  /** User id field on storage usage snapshot record. */
  user_id?: string;
  /** Uuid field on storage usage snapshot record. */
  uuid?: string;
  /** Version field on storage usage snapshot record. */
  version?: string;
}
