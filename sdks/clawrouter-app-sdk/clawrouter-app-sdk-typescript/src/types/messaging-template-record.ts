import type { JsonValue } from './json-value';

/** Messaging template record schema exposed by Claw Router. */
export interface MessagingTemplateRecord {
  /** Created at field on messaging template record. */
  created_at?: string;
  /** Current version id field on messaging template record. */
  current_version_id?: string;
  /** Data scope field on messaging template record. */
  data_scope?: string;
  /** Deleted at field on messaging template record. */
  deleted_at?: string;
  /** Deleted by field on messaging template record. */
  deleted_by?: string;
  /** Description field on messaging template record. */
  description?: string;
  /** Id field on messaging template record. */
  id?: string;
  /** Metadata field on messaging template record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on messaging template record. */
  organization_id?: string;
  /** Owner app id field on messaging template record. */
  owner_app_id?: string;
  /** Status field on messaging template record. */
  status?: string;
  /** Tenant id field on messaging template record. */
  tenant_id?: string;
  /** Updated at field on messaging template record. */
  updated_at?: string;
  /** Uuid field on messaging template record. */
  uuid?: string;
  /** Version field on messaging template record. */
  version?: string;
}
