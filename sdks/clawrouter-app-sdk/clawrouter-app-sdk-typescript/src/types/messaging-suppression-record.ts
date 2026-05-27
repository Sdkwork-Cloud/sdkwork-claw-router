import type { JsonValue } from './json-value';

/** Messaging suppression record schema exposed by Claw Router. */
export interface MessagingSuppressionRecord {
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
  /** Status field on messaging suppression record. */
  status?: string;
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
