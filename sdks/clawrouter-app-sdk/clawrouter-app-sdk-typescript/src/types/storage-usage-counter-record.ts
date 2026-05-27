import type { JsonValue } from './json-value';

/** Storage usage counter record schema exposed by Claw Router. */
export interface StorageUsageCounterRecord {
  /** App id field on storage usage counter record. */
  app_id?: string;
  /** Business domain field on storage usage counter record. */
  business_domain?: string;
  /** Created at field on storage usage counter record. */
  created_at?: string;
  /** Data scope field on storage usage counter record. */
  data_scope?: string;
  /** Deleted at field on storage usage counter record. */
  deleted_at?: string;
  /** Deleted by field on storage usage counter record. */
  deleted_by?: string;
  /** Id field on storage usage counter record. */
  id?: string;
  /** Metadata field on storage usage counter record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on storage usage counter record. */
  organization_id?: string;
  /** Owner id field on storage usage counter record. */
  owner_id?: string;
  /** Owner type field on storage usage counter record. */
  owner_type?: string;
  /** Scope id field on storage usage counter record. */
  scope_id?: string;
  /** Scope type field on storage usage counter record. */
  scope_type?: string;
  /** Space id field on storage usage counter record. */
  space_id?: string;
  /** Status field on storage usage counter record. */
  status?: string;
  /** Tenant id field on storage usage counter record. */
  tenant_id?: string;
  /** Updated at field on storage usage counter record. */
  updated_at?: string;
  /** User id field on storage usage counter record. */
  user_id?: string;
  /** Uuid field on storage usage counter record. */
  uuid?: string;
  /** Version field on storage usage counter record. */
  version?: string;
}
