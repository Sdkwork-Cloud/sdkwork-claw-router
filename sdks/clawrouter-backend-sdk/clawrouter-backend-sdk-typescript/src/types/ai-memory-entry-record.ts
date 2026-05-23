import type { JsonValue } from './json-value';

/** Ai memory entry record schema exposed by Claw Router. */
export interface AiMemoryEntryRecord {
  /** Confidence score field on ai memory entry record. */
  confidence_score?: string;
  /** Content json field on ai memory entry record. */
  content_json?: Record<string, JsonValue>;
  /** Content text field on ai memory entry record. */
  content_text?: string;
  /** Created at field on ai memory entry record. */
  created_at?: string;
  /** Created by field on ai memory entry record. */
  created_by?: string;
  /** Data scope field on ai memory entry record. */
  data_scope?: string;
  /** Deleted at field on ai memory entry record. */
  deleted_at?: string;
  /** Deleted by field on ai memory entry record. */
  deleted_by?: string;
  /** Expires at field on ai memory entry record. */
  expires_at?: string;
  /** Id field on ai memory entry record. */
  id?: string;
  /** Importance score field on ai memory entry record. */
  importance_score?: string;
  /** Last recalled at field on ai memory entry record. */
  last_recalled_at?: string;
  /** Memory code field on ai memory entry record. */
  memory_code?: string;
  /** Memory type field on ai memory entry record. */
  memory_type?: string;
  /** Metadata field on ai memory entry record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai memory entry record. */
  organization_id?: string;
  /** Owner id field on ai memory entry record. */
  owner_id?: string;
  /** Owner type field on ai memory entry record. */
  owner_type?: string;
  /** Recall count field on ai memory entry record. */
  recall_count?: string;
  /** Sensitivity level field on ai memory entry record. */
  sensitivity_level?: string;
  /** Source conversation id field on ai memory entry record. */
  source_conversation_id?: string;
  /** Source invocation id field on ai memory entry record. */
  source_invocation_id?: string;
  /** Source item id field on ai memory entry record. */
  source_item_id?: string;
  /** Source kind field on ai memory entry record. */
  source_kind?: string;
  /** Source turn id field on ai memory entry record. */
  source_turn_id?: string;
  /** Space id field on ai memory entry record. */
  space_id?: string;
  /** Status field on ai memory entry record. */
  status?: string;
  /** Subject key field on ai memory entry record. */
  subject_key?: string;
  /** Subject type field on ai memory entry record. */
  subject_type?: string;
  /** Supersedes memory id field on ai memory entry record. */
  supersedes_memory_id?: string;
  /** Tenant id field on ai memory entry record. */
  tenant_id?: string;
  /** Trust level field on ai memory entry record. */
  trust_level?: string;
  /** Updated at field on ai memory entry record. */
  updated_at?: string;
  /** User id field on ai memory entry record. */
  user_id?: string;
  /** Uuid field on ai memory entry record. */
  uuid?: string;
  /** Valid from field on ai memory entry record. */
  valid_from?: string;
  /** Valid until field on ai memory entry record. */
  valid_until?: string;
  /** Version field on ai memory entry record. */
  version?: string;
  /** Version no field on ai memory entry record. */
  version_no?: string;
}
