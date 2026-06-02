import type { JsonValue } from './json-value';

/** Object blob record schema exposed by Claw Router. */
export interface ObjectBlobRecord {
  /** Bucket id field on object blob record. */
  bucket_id?: string;
  /** Content sha 256 field on object blob record. */
  content_sha256?: string;
  /** Content type field on object blob record. */
  content_type?: string;
  /** Created at field on object blob record. */
  created_at?: string;
  /** Data scope field on object blob record. */
  data_scope?: string;
  /** Deleted at field on object blob record. */
  deleted_at?: string;
  /** Deleted by field on object blob record. */
  deleted_by?: string;
  /** Encryption mode field on object blob record. */
  encryption_mode?: string;
  /** Id field on object blob record. */
  id?: string;
  /** Kms key ref field on object blob record. */
  kms_key_ref?: string;
  /** Last verified at field on object blob record. */
  last_verified_at?: string;
  /** Legal hold field on object blob record. */
  legal_hold?: boolean;
  /** Metadata field on object blob record. */
  metadata?: Record<string, JsonValue>;
  /** Object key field on object blob record. */
  object_key?: string;
  /** Organization id field on object blob record. */
  organization_id?: string;
  /** Original filename field on object blob record. */
  original_filename?: string;
  /** Owner id field on object blob record. */
  owner_id?: string;
  /** Owner type field on object blob record. */
  owner_type?: string;
  /** Physical size bytes field on object blob record. */
  physical_size_bytes?: string;
  /** Provider id field on object blob record. */
  provider_id?: string;
  /** Retention until field on object blob record. */
  retention_until?: string;
  /** Size bytes field on object blob record. */
  size_bytes?: string;
  /** Status field on object blob record. */
  status?: string;
  /** Storage class field on object blob record. */
  storage_class?: string;
  /** Storage etag field on object blob record. */
  storage_etag?: string;
  /** Tenant id field on object blob record. */
  tenant_id?: string;
  /** Updated at field on object blob record. */
  updated_at?: string;
  /** User id field on object blob record. */
  user_id?: string;
  /** Uuid field on object blob record. */
  uuid?: string;
  /** Version field on object blob record. */
  version?: string;
  /** Version id field on object blob record. */
  version_id?: string;
}
