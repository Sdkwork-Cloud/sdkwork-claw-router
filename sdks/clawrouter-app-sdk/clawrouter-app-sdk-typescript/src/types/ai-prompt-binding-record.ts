import type { JsonValue } from './json-value';

/** Ai prompt binding record schema exposed by Claw Router. */
export interface AiPromptBindingRecord {
  /** Binding role field on ai prompt binding record. */
  binding_role?: string;
  /** Created at field on ai prompt binding record. */
  created_at?: string;
  /** Data scope field on ai prompt binding record. */
  data_scope?: string;
  /** Deleted at field on ai prompt binding record. */
  deleted_at?: string;
  /** Deleted by field on ai prompt binding record. */
  deleted_by?: string;
  /** Id field on ai prompt binding record. */
  id?: string;
  /** Metadata field on ai prompt binding record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai prompt binding record. */
  organization_id?: string;
  /** Owner id field on ai prompt binding record. */
  owner_id?: string;
  /** Owner type field on ai prompt binding record. */
  owner_type?: string;
  /** Prompt id field on ai prompt binding record. */
  prompt_id?: string;
  /** Prompt version id field on ai prompt binding record. */
  prompt_version_id?: string;
  /** Status field on ai prompt binding record. */
  status?: string;
  /** Tenant id field on ai prompt binding record. */
  tenant_id?: string;
  /** Updated at field on ai prompt binding record. */
  updated_at?: string;
  /** Uuid field on ai prompt binding record. */
  uuid?: string;
  /** Version field on ai prompt binding record. */
  version?: string;
}
