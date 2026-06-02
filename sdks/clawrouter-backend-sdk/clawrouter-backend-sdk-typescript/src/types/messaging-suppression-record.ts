import type { JsonValue } from './json-value';

/** Messaging suppression record schema exposed by Claw Router. */
export interface MessagingSuppressionRecord {
  /** Channel field on messaging suppression record. */
  channel?: string;
  /** Created at field on messaging suppression record. */
  created_at?: string;
  /** Data scope field on messaging suppression record. */
  data_scope?: string;
  /** Deleted at field on messaging suppression record. */
  deleted_at?: string;
  /** Deleted by field on messaging suppression record. */
  deleted_by?: string;
  /** Ends at field on messaging suppression record. */
  ends_at?: string;
  /** Id field on messaging suppression record. */
  id?: string;
  /** Metadata field on messaging suppression record. */
  metadata?: Record<string, JsonValue>;
  /** Note field on messaging suppression record. */
  note?: string;
  /** Organization id field on messaging suppression record. */
  organization_id?: string;
  /** Reason code field on messaging suppression record. */
  reason_code?: string;
  /** Scope id field on messaging suppression record. */
  scope_id?: string;
  /** Scope type field on messaging suppression record. */
  scope_type?: string;
  /** Source field on messaging suppression record. */
  source?: string;
  /** Starts at field on messaging suppression record. */
  starts_at?: string;
  /** Status field on messaging suppression record. */
  status?: string;
  /** Target hash field on messaging suppression record. */
  target_hash?: string;
  /** Target masked field on messaging suppression record. */
  target_masked?: string;
  /** Tenant id field on messaging suppression record. */
  tenant_id?: string;
  /** Updated at field on messaging suppression record. */
  updated_at?: string;
  /** Uuid field on messaging suppression record. */
  uuid?: string;
  /** Version field on messaging suppression record. */
  version?: string;
}
