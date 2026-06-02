import type { JsonValue } from './json-value';

/** Upload session record schema exposed by Claw Router. */
export interface UploadSessionRecord {
  /** Aborted at field on upload session record. */
  aborted_at?: string;
  /** Bucket id field on upload session record. */
  bucket_id?: string;
  /** Completed at field on upload session record. */
  completed_at?: string;
  /** Completed bytes field on upload session record. */
  completed_bytes?: string;
  /** Completed part count field on upload session record. */
  completed_part_count?: number;
  /** Content type field on upload session record. */
  content_type?: string;
  /** Created at field on upload session record. */
  created_at?: string;
  /** Data scope field on upload session record. */
  data_scope?: string;
  /** Deleted at field on upload session record. */
  deleted_at?: string;
  /** Deleted by field on upload session record. */
  deleted_by?: string;
  /** Expected sha 256 field on upload session record. */
  expected_sha256?: string;
  /** Expected size bytes field on upload session record. */
  expected_size_bytes?: string;
  /** Expires at field on upload session record. */
  expires_at?: string;
  /** Id field on upload session record. */
  id?: string;
  /** Idempotency key field on upload session record. */
  idempotency_key?: string;
  /** Logical scope field on upload session record. */
  logical_scope?: string;
  /** Metadata field on upload session record. */
  metadata?: Record<string, JsonValue>;
  /** Object key field on upload session record. */
  object_key?: string;
  /** Organization id field on upload session record. */
  organization_id?: string;
  /** Original filename field on upload session record. */
  original_filename?: string;
  /** Owner id field on upload session record. */
  owner_id?: string;
  /** Owner type field on upload session record. */
  owner_type?: string;
  /** Part count field on upload session record. */
  part_count?: number;
  /** Part size bytes field on upload session record. */
  part_size_bytes?: string;
  /** Provider id field on upload session record. */
  provider_id?: string;
  /** Request id field on upload session record. */
  request_id?: string;
  /** S 3 upload id field on upload session record. */
  s3_upload_id?: string;
  /** Status field on upload session record. */
  status?: string;
  /** Tenant id field on upload session record. */
  tenant_id?: string;
  /** Updated at field on upload session record. */
  updated_at?: string;
  /** Upload mode field on upload session record. */
  upload_mode?: string;
  /** Upload session no field on upload session record. */
  upload_session_no?: string;
  /** User id field on upload session record. */
  user_id?: string;
  /** Uuid field on upload session record. */
  uuid?: string;
  /** Version field on upload session record. */
  version?: string;
}
