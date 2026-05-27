import type { JsonValue } from './json-value';

/** Object tag record schema exposed by Claw Router. */
export interface ObjectTagRecord {
  /** Created at field on object tag record. */
  created_at?: string;
  /** Data scope field on object tag record. */
  data_scope?: string;
  /** Deleted at field on object tag record. */
  deleted_at?: string;
  /** Deleted by field on object tag record. */
  deleted_by?: string;
  /** Id field on object tag record. */
  id?: string;
  /** Metadata field on object tag record. */
  metadata?: Record<string, JsonValue>;
  /** Object blob id field on object tag record. */
  object_blob_id?: string;
  /** Organization id field on object tag record. */
  organization_id?: string;
  /** Status field on object tag record. */
  status?: string;
  /** Tag key field on object tag record. */
  tag_key?: string;
  /** Tag value field on object tag record. */
  tag_value?: string;
  /** Tenant id field on object tag record. */
  tenant_id?: string;
  /** Updated at field on object tag record. */
  updated_at?: string;
  /** Uuid field on object tag record. */
  uuid?: string;
  /** Version field on object tag record. */
  version?: string;
}
