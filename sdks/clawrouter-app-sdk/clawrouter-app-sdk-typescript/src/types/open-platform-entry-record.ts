import type { JsonValue } from './json-value';

/** Open platform entry record schema exposed by Claw Router. */
export interface OpenPlatformEntryRecord {
  /** Account id field on open platform entry record. */
  account_id?: string;
  /** Created at field on open platform entry record. */
  created_at?: string;
  /** Data scope field on open platform entry record. */
  data_scope?: string;
  /** Deleted at field on open platform entry record. */
  deleted_at?: string;
  /** Deleted by field on open platform entry record. */
  deleted_by?: string;
  /** Entry key field on open platform entry record. */
  entry_key?: string;
  /** Entry type field on open platform entry record. */
  entry_type?: string;
  /** Entry url field on open platform entry record. */
  entry_url?: string;
  /** Id field on open platform entry record. */
  id?: string;
  /** Metadata field on open platform entry record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on open platform entry record. */
  organization_id?: string;
  /** Status field on open platform entry record. */
  status?: string;
  /** Tenant id field on open platform entry record. */
  tenant_id?: string;
  /** Updated at field on open platform entry record. */
  updated_at?: string;
  /** Uuid field on open platform entry record. */
  uuid?: string;
  /** Version field on open platform entry record. */
  version?: string;
}
