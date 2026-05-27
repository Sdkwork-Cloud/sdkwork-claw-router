import type { JsonValue } from './json-value';

/** Storage default bucket policy record schema exposed by Claw Router. */
export interface StorageDefaultBucketPolicyRecord {
  /** Bucket id field on storage default bucket policy record. */
  bucket_id?: string;
  /** Bucket logical scope field on storage default bucket policy record. */
  bucket_logical_scope?: string;
  /** Created at field on storage default bucket policy record. */
  created_at?: string;
  /** Data scope field on storage default bucket policy record. */
  data_scope?: string;
  /** Deleted at field on storage default bucket policy record. */
  deleted_at?: string;
  /** Deleted by field on storage default bucket policy record. */
  deleted_by?: string;
  /** Id field on storage default bucket policy record. */
  id?: string;
  /** Logical scope field on storage default bucket policy record. */
  logical_scope?: string;
  /** Metadata field on storage default bucket policy record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on storage default bucket policy record. */
  organization_id?: string;
  /** Reason field on storage default bucket policy record. */
  reason?: string;
  /** Request id field on storage default bucket policy record. */
  request_id?: string;
  /** Status field on storage default bucket policy record. */
  status?: string;
  /** Tenant id field on storage default bucket policy record. */
  tenant_id?: string;
  /** Updated at field on storage default bucket policy record. */
  updated_at?: string;
  /** Updated by field on storage default bucket policy record. */
  updated_by?: string;
  /** Uuid field on storage default bucket policy record. */
  uuid?: string;
  /** Version field on storage default bucket policy record. */
  version?: string;
}
