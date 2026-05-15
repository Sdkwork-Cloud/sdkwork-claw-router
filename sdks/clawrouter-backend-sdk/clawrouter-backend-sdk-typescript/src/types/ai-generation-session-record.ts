import type { JsonValue } from './json-value';

/** Ai generation session record schema exposed by Claw Router. */
export interface AiGenerationSessionRecord {
  /** Active modality field on ai generation session record. */
  active_modality?: string;
  /** Created at field on ai generation session record. */
  created_at?: string;
  /** Data scope field on ai generation session record. */
  data_scope?: string;
  /** Deleted at field on ai generation session record. */
  deleted_at?: string;
  /** Deleted by field on ai generation session record. */
  deleted_by?: string;
  /** Filter config field on ai generation session record. */
  filter_config?: Record<string, JsonValue>;
  /** Id field on ai generation session record. */
  id?: string;
  /** Last opened at field on ai generation session record. */
  last_opened_at?: string;
  /** Last prompt field on ai generation session record. */
  last_prompt?: string;
  /** Metadata field on ai generation session record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai generation session record. */
  organization_id?: string;
  /** Owner id field on ai generation session record. */
  owner_id?: string;
  /** Owner type field on ai generation session record. */
  owner_type?: string;
  /** Selected models field on ai generation session record. */
  selected_models?: Record<string, JsonValue>;
  /** Session code field on ai generation session record. */
  session_code?: string;
  /** Status field on ai generation session record. */
  status?: string;
  /** Tenant id field on ai generation session record. */
  tenant_id?: string;
  /** Title field on ai generation session record. */
  title?: string;
  /** Updated at field on ai generation session record. */
  updated_at?: string;
  /** User id field on ai generation session record. */
  user_id?: string;
  /** Uuid field on ai generation session record. */
  uuid?: string;
  /** Version field on ai generation session record. */
  version?: string;
}
