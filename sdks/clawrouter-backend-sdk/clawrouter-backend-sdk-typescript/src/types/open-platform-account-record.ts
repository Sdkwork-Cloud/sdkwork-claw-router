import type { JsonValue } from './json-value';

/** Open platform account record schema exposed by Claw Router. */
export interface OpenPlatformAccountRecord {
  /** Account key field on open platform account record. */
  account_key?: string;
  /** Account type field on open platform account record. */
  account_type?: string;
  /** Aes key ref field on open platform account record. */
  aes_key_ref?: string;
  /** App id field on open platform account record. */
  app_id?: string;
  /** Created at field on open platform account record. */
  created_at?: string;
  /** Data scope field on open platform account record. */
  data_scope?: string;
  /** Default entry id field on open platform account record. */
  default_entry_id?: string;
  /** Deleted at field on open platform account record. */
  deleted_at?: string;
  /** Deleted by field on open platform account record. */
  deleted_by?: string;
  /** Id field on open platform account record. */
  id?: string;
  /** Metadata field on open platform account record. */
  metadata?: Record<string, JsonValue>;
  /** Name field on open platform account record. */
  name?: string;
  /** Organization id field on open platform account record. */
  organization_id?: string;
  /** Provider field on open platform account record. */
  provider?: string;
  /** Qr default field on open platform account record. */
  qr_default?: boolean;
  /** Secret ref field on open platform account record. */
  secret_ref?: string;
  /** Status field on open platform account record. */
  status?: string;
  /** Tenant id field on open platform account record. */
  tenant_id?: string;
  /** Token ref field on open platform account record. */
  token_ref?: string;
  /** Updated at field on open platform account record. */
  updated_at?: string;
  /** Uuid field on open platform account record. */
  uuid?: string;
  /** Version field on open platform account record. */
  version?: string;
}
