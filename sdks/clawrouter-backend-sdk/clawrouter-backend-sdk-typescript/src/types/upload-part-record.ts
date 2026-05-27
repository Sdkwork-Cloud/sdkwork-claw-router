import type { JsonValue } from './json-value';

/** Upload part record schema exposed by Claw Router. */
export interface UploadPartRecord {
  /** Created at field on upload part record. */
  created_at?: string;
  /** Data scope field on upload part record. */
  data_scope?: string;
  /** Deleted at field on upload part record. */
  deleted_at?: string;
  /** Deleted by field on upload part record. */
  deleted_by?: string;
  /** Id field on upload part record. */
  id?: string;
  /** Metadata field on upload part record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on upload part record. */
  organization_id?: string;
  /** Part etag field on upload part record. */
  part_etag?: string;
  /** Part number field on upload part record. */
  part_number?: number;
  /** Part sha 256 field on upload part record. */
  part_sha256?: string;
  /** Presigned url expires at field on upload part record. */
  presigned_url_expires_at?: string;
  /** Status field on upload part record. */
  status?: string;
  /** Tenant id field on upload part record. */
  tenant_id?: string;
  /** Updated at field on upload part record. */
  updated_at?: string;
  /** Upload session id field on upload part record. */
  upload_session_id?: string;
  /** Uploaded at field on upload part record. */
  uploaded_at?: string;
  /** Uuid field on upload part record. */
  uuid?: string;
  /** Version field on upload part record. */
  version?: string;
}
