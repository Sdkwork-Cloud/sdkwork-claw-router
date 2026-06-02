import type { JsonValue } from './json-value';

/** Messaging template record schema exposed by Claw Router. */
export interface MessagingTemplateRecord {
  /** Category field on messaging template record. */
  category?: string;
  /** Channel field on messaging template record. */
  channel?: string;
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
  /** Delivery purpose field on messaging template record. */
  delivery_purpose?: string;
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
  /** Publish status field on messaging template record. */
  publish_status?: string;
  /** Scene code field on messaging template record. */
  scene_code?: string;
  /** Status field on messaging template record. */
  status?: string;
  /** Template code field on messaging template record. */
  template_code?: string;
  /** Template name field on messaging template record. */
  template_name?: string;
  /** Tenant id field on messaging template record. */
  tenant_id?: string;
  /** Updated at field on messaging template record. */
  updated_at?: string;
  /** Uuid field on messaging template record. */
  uuid?: string;
  /** Version field on messaging template record. */
  version?: string;
}
