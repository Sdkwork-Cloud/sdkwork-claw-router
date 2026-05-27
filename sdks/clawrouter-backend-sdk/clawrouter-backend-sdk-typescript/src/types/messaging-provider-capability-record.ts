import type { JsonValue } from './json-value';

/** Messaging provider capability record schema exposed by Claw Router. */
export interface MessagingProviderCapabilityRecord {
  /** Created at field on messaging provider capability record. */
  created_at?: string;
  /** Data scope field on messaging provider capability record. */
  data_scope?: string;
  /** Deleted at field on messaging provider capability record. */
  deleted_at?: string;
  /** Deleted by field on messaging provider capability record. */
  deleted_by?: string;
  /** Id field on messaging provider capability record. */
  id?: string;
  /** Last verified at field on messaging provider capability record. */
  last_verified_at?: string;
  /** Metadata field on messaging provider capability record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on messaging provider capability record. */
  organization_id?: string;
  /** Status field on messaging provider capability record. */
  status?: string;
  /** Tenant id field on messaging provider capability record. */
  tenant_id?: string;
  /** Updated at field on messaging provider capability record. */
  updated_at?: string;
  /** Uuid field on messaging provider capability record. */
  uuid?: string;
  /** Version field on messaging provider capability record. */
  version?: string;
}
