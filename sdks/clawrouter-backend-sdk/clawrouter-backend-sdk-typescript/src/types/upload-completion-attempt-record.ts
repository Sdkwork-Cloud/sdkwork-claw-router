import type { JsonValue } from './json-value';

/** Upload completion attempt record schema exposed by Claw Router. */
export interface UploadCompletionAttemptRecord {
  /** Attempt no field on upload completion attempt record. */
  attempt_no?: number;
  /** Completion status field on upload completion attempt record. */
  completion_status?: string;
  /** Created at field on upload completion attempt record. */
  created_at?: string;
  /** Error code field on upload completion attempt record. */
  error_code?: string;
  /** Error message masked field on upload completion attempt record. */
  error_message_masked?: string;
  /** Id field on upload completion attempt record. */
  id?: string;
  /** Legal hold field on upload completion attempt record. */
  legal_hold?: boolean;
  /** Metadata field on upload completion attempt record. */
  metadata?: Record<string, JsonValue>;
  /** Object blob id field on upload completion attempt record. */
  object_blob_id?: string;
  /** Organization id field on upload completion attempt record. */
  organization_id?: string;
  /** Payload hash field on upload completion attempt record. */
  payload_hash?: string;
  /** Provider request id field on upload completion attempt record. */
  provider_request_id?: string;
  /** Request id field on upload completion attempt record. */
  request_id?: string;
  /** Retention until field on upload completion attempt record. */
  retention_until?: string;
  /** Status field on upload completion attempt record. */
  status?: string;
  /** Tenant id field on upload completion attempt record. */
  tenant_id?: string;
  /** Trace id field on upload completion attempt record. */
  trace_id?: string;
  /** Upload session id field on upload completion attempt record. */
  upload_session_id?: string;
  /** User id field on upload completion attempt record. */
  user_id?: string;
  /** Uuid field on upload completion attempt record. */
  uuid?: string;
}
