import type { JsonValue } from './json-value';

/** Open platform manifest record schema exposed by Claw Router. */
export interface OpenPlatformManifestRecord {
  /** Account type field on open platform manifest record. */
  account_type?: string;
  /** Callback schema field on open platform manifest record. */
  callback_schema?: Record<string, JsonValue>;
  /** Capability schema field on open platform manifest record. */
  capability_schema?: Record<string, JsonValue>;
  /** Created at field on open platform manifest record. */
  created_at?: string;
  /** Data scope field on open platform manifest record. */
  data_scope?: string;
  /** Deleted at field on open platform manifest record. */
  deleted_at?: string;
  /** Deleted by field on open platform manifest record. */
  deleted_by?: string;
  /** Entry schema field on open platform manifest record. */
  entry_schema?: Record<string, JsonValue>;
  /** Id field on open platform manifest record. */
  id?: string;
  /** Manifest key field on open platform manifest record. */
  manifest_key?: string;
  /** Metadata field on open platform manifest record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on open platform manifest record. */
  organization_id?: string;
  /** Provider field on open platform manifest record. */
  provider?: string;
  /** Sort order field on open platform manifest record. */
  sort_order?: number;
  /** Status field on open platform manifest record. */
  status?: string;
  /** Tenant id field on open platform manifest record. */
  tenant_id?: string;
  /** Updated at field on open platform manifest record. */
  updated_at?: string;
  /** Uuid field on open platform manifest record. */
  uuid?: string;
  /** Version field on open platform manifest record. */
  version?: string;
}
