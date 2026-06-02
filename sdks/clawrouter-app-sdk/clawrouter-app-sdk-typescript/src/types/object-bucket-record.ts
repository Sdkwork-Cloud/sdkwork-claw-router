import type { JsonValue } from './json-value';

/** Object bucket record schema exposed by Claw Router. */
export interface ObjectBucketRecord {
  /** Bucket name field on object bucket record. */
  bucket_name?: string;
  /** Bucket region field on object bucket record. */
  bucket_region?: string;
  /** Created at field on object bucket record. */
  created_at?: string;
  /** Data residency region field on object bucket record. */
  data_residency_region?: string;
  /** Data scope field on object bucket record. */
  data_scope?: string;
  /** Default encryption mode field on object bucket record. */
  default_encryption_mode?: string;
  /** Default storage class field on object bucket record. */
  default_storage_class?: string;
  /** Deleted at field on object bucket record. */
  deleted_at?: string;
  /** Deleted by field on object bucket record. */
  deleted_by?: string;
  /** Id field on object bucket record. */
  id?: string;
  /** Idempotency key field on object bucket record. */
  idempotency_key?: string;
  /** Kms key ref field on object bucket record. */
  kms_key_ref?: string;
  /** Lifecycle enabled field on object bucket record. */
  lifecycle_enabled?: boolean;
  /** Logical scope field on object bucket record. */
  logical_scope?: string;
  /** Metadata field on object bucket record. */
  metadata?: Record<string, JsonValue>;
  /** Object key prefix field on object bucket record. */
  object_key_prefix?: string;
  /** Object lock enabled field on object bucket record. */
  object_lock_enabled?: boolean;
  /** Organization id field on object bucket record. */
  organization_id?: string;
  /** Provider id field on object bucket record. */
  provider_id?: string;
  /** Public access blocked field on object bucket record. */
  public_access_blocked?: boolean;
  /** Request id field on object bucket record. */
  request_id?: string;
  /** Status field on object bucket record. */
  status?: string;
  /** Tenant id field on object bucket record. */
  tenant_id?: string;
  /** Updated at field on object bucket record. */
  updated_at?: string;
  /** Uuid field on object bucket record. */
  uuid?: string;
  /** Version field on object bucket record. */
  version?: string;
  /** Versioning enabled field on object bucket record. */
  versioning_enabled?: boolean;
}
