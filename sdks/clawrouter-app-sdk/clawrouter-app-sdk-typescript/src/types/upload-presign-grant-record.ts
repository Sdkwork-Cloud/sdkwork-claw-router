import type { JsonValue } from './json-value';

/** Upload presign grant record schema exposed by Claw Router. */
export interface UploadPresignGrantRecord {
  /** Bucket id field on upload presign grant record. */
  bucket_id?: string;
  /** Canonical headers field on upload presign grant record. */
  canonical_headers?: Record<string, JsonValue>;
  /** Consumed at field on upload presign grant record. */
  consumed_at?: string;
  /** Created at field on upload presign grant record. */
  created_at?: string;
  /** Expires at field on upload presign grant record. */
  expires_at?: string;
  /** Id field on upload presign grant record. */
  id?: string;
  /** Legal hold field on upload presign grant record. */
  legal_hold?: boolean;
  /** Metadata field on upload presign grant record. */
  metadata?: Record<string, JsonValue>;
  /** Method field on upload presign grant record. */
  method?: string;
  /** Object key field on upload presign grant record. */
  object_key?: string;
  /** Organization id field on upload presign grant record. */
  organization_id?: string;
  /** Payload hash field on upload presign grant record. */
  payload_hash?: string;
  /** Provider id field on upload presign grant record. */
  provider_id?: string;
  /** Request id field on upload presign grant record. */
  request_id?: string;
  /** Retention until field on upload presign grant record. */
  retention_until?: string;
  /** Signed headers field on upload presign grant record. */
  signed_headers?: Record<string, JsonValue>;
  /** Status field on upload presign grant record. */
  status?: string;
  /** Tenant id field on upload presign grant record. */
  tenant_id?: string;
  /** Trace id field on upload presign grant record. */
  trace_id?: string;
  /** Upload part id field on upload presign grant record. */
  upload_part_id?: string;
  /** Upload session id field on upload presign grant record. */
  upload_session_id?: string;
  /** User id field on upload presign grant record. */
  user_id?: string;
  /** Uuid field on upload presign grant record. */
  uuid?: string;
}
