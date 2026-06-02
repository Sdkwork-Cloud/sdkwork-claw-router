import type { JsonValue } from './json-value';

/** Ai prompt record schema exposed by Claw Router. */
export interface AiPromptRecord {
  /** Category code field on ai prompt record. */
  category_code?: string;
  /** Category id field on ai prompt record. */
  category_id?: string;
  /** Created at field on ai prompt record. */
  created_at?: string;
  /** Data scope field on ai prompt record. */
  data_scope?: string;
  /** Deleted at field on ai prompt record. */
  deleted_at?: string;
  /** Deleted by field on ai prompt record. */
  deleted_by?: string;
  /** Deprecated at field on ai prompt record. */
  deprecated_at?: string;
  /** Description field on ai prompt record. */
  description?: string;
  /** Id field on ai prompt record. */
  id?: string;
  /** Latest version id field on ai prompt record. */
  latest_version_id?: string;
  /** Metadata field on ai prompt record. */
  metadata?: Record<string, JsonValue>;
  /** Name field on ai prompt record. */
  name?: string;
  /** Organization id field on ai prompt record. */
  organization_id?: string;
  /** Owner user id field on ai prompt record. */
  owner_user_id?: string;
  /** Prompt key field on ai prompt record. */
  prompt_key?: string;
  /** Prompt type field on ai prompt record. */
  prompt_type?: string;
  /** Published at field on ai prompt record. */
  published_at?: string;
  /** Published version id field on ai prompt record. */
  published_version_id?: string;
  /** Status field on ai prompt record. */
  status?: string;
  /** Tags field on ai prompt record. */
  tags?: Record<string, JsonValue>;
  /** Tenant id field on ai prompt record. */
  tenant_id?: string;
  /** Updated at field on ai prompt record. */
  updated_at?: string;
  /** Uuid field on ai prompt record. */
  uuid?: string;
  /** Version field on ai prompt record. */
  version?: string;
  /** Visibility field on ai prompt record. */
  visibility?: string;
}
