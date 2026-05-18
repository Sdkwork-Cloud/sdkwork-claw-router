import type { JsonValue } from './json-value';

/** Ai agent memory record schema exposed by Claw Router. */
export interface AiAgentMemoryRecord {
  /** Agent id field on ai agent memory record. */
  agent_id?: string;
  /** Content ref field on ai agent memory record. */
  content_ref?: string;
  /** Created at field on ai agent memory record. */
  created_at?: string;
  /** Data scope field on ai agent memory record. */
  data_scope?: string;
  /** Deleted at field on ai agent memory record. */
  deleted_at?: string;
  /** Deleted by field on ai agent memory record. */
  deleted_by?: string;
  /** Embedding ref field on ai agent memory record. */
  embedding_ref?: string;
  /** Expires at field on ai agent memory record. */
  expires_at?: string;
  /** Id field on ai agent memory record. */
  id?: string;
  /** Last used at field on ai agent memory record. */
  last_used_at?: string;
  /** Memory hash field on ai agent memory record. */
  memory_hash?: string;
  /** Memory scope field on ai agent memory record. */
  memory_scope?: string;
  /** Memory type field on ai agent memory record. */
  memory_type?: string;
  /** Metadata field on ai agent memory record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai agent memory record. */
  organization_id?: string;
  /** Owner id field on ai agent memory record. */
  owner_id?: string;
  /** Owner type field on ai agent memory record. */
  owner_type?: string;
  /** Owner user id field on ai agent memory record. */
  owner_user_id?: string;
  /** Retention policy field on ai agent memory record. */
  retention_policy?: Record<string, JsonValue>;
  /** Status field on ai agent memory record. */
  status?: string;
  /** Tenant id field on ai agent memory record. */
  tenant_id?: string;
  /** Updated at field on ai agent memory record. */
  updated_at?: string;
  /** User id field on ai agent memory record. */
  user_id?: string;
  /** Uuid field on ai agent memory record. */
  uuid?: string;
  /** Version field on ai agent memory record. */
  version?: string;
}
