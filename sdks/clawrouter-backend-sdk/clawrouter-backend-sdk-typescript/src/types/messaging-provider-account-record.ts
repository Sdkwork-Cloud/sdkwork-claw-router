import type { JsonValue } from './json-value';

/** Messaging provider account record schema exposed by Claw Router. */
export interface MessagingProviderAccountRecord {
  /** Account code field on messaging provider account record. */
  account_code: string;
  /** Account name field on messaging provider account record. */
  account_name: string;
  /** Auth type field on messaging provider account record. */
  auth_type?: string;
  /** Base url field on messaging provider account record. */
  base_url?: string;
  /** Channel field on messaging provider account record. */
  channel: string;
  /** Created at field on messaging provider account record. */
  created_at?: string;
  /** Credential hash field on messaging provider account record. */
  credential_hash?: string;
  /** Credential ref field on messaging provider account record. */
  credential_ref?: string;
  /** Credential version field on messaging provider account record. */
  credential_version?: string;
  /** Data scope field on messaging provider account record. */
  data_scope?: string;
  /** Deleted at field on messaging provider account record. */
  deleted_at?: string;
  /** Deleted by field on messaging provider account record. */
  deleted_by?: string;
  /** Delivery purpose field on messaging provider account record. */
  delivery_purpose?: string;
  /** Health status field on messaging provider account record. */
  health_status?: string;
  /** Id field on messaging provider account record. */
  id?: string;
  /** Last used at field on messaging provider account record. */
  last_used_at?: string;
  /** Last verified at field on messaging provider account record. */
  last_verified_at?: string;
  /** Masked label field on messaging provider account record. */
  masked_label?: string;
  /** Metadata field on messaging provider account record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on messaging provider account record. */
  organization_id: string;
  /** Provider code field on messaging provider account record. */
  provider_code: string;
  /** Provider id field on messaging provider account record. */
  provider_id?: string;
  /** Status field on messaging provider account record. */
  status: string;
  /** Tenant id field on messaging provider account record. */
  tenant_id: string;
  /** Updated at field on messaging provider account record. */
  updated_at?: string;
  /** Uuid field on messaging provider account record. */
  uuid: string;
  /** Version field on messaging provider account record. */
  version?: string;
}
