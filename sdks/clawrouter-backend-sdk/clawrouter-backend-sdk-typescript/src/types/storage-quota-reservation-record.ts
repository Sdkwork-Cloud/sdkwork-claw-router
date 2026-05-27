import type { JsonValue } from './json-value';

/** Storage quota reservation record schema exposed by Claw Router. */
export interface StorageQuotaReservationRecord {
  /** Created at field on storage quota reservation record. */
  created_at?: string;
  /** Data scope field on storage quota reservation record. */
  data_scope?: string;
  /** Deleted at field on storage quota reservation record. */
  deleted_at?: string;
  /** Deleted by field on storage quota reservation record. */
  deleted_by?: string;
  /** Expires at field on storage quota reservation record. */
  expires_at?: string;
  /** Id field on storage quota reservation record. */
  id?: string;
  /** Idempotency key field on storage quota reservation record. */
  idempotency_key?: string;
  /** Metadata field on storage quota reservation record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on storage quota reservation record. */
  organization_id?: string;
  /** Released at field on storage quota reservation record. */
  released_at?: string;
  /** Reservation no field on storage quota reservation record. */
  reservation_no?: string;
  /** Scope id field on storage quota reservation record. */
  scope_id?: string;
  /** Scope type field on storage quota reservation record. */
  scope_type?: string;
  /** Status field on storage quota reservation record. */
  status?: string;
  /** Tenant id field on storage quota reservation record. */
  tenant_id?: string;
  /** Updated at field on storage quota reservation record. */
  updated_at?: string;
  /** Upload session id field on storage quota reservation record. */
  upload_session_id?: string;
  /** Uuid field on storage quota reservation record. */
  uuid?: string;
  /** Version field on storage quota reservation record. */
  version?: string;
}
