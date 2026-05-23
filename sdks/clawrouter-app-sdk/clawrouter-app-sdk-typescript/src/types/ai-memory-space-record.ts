import type { JsonValue } from './json-value';

/** Ai memory space record schema exposed by Claw Router. */
export interface AiMemorySpaceRecord {
  /** Auto extract enabled field on ai memory space record. */
  auto_extract_enabled?: boolean;
  /** Auto recall enabled field on ai memory space record. */
  auto_recall_enabled?: boolean;
  /** Created at field on ai memory space record. */
  created_at?: string;
  /** Data scope field on ai memory space record. */
  data_scope?: string;
  /** Deleted at field on ai memory space record. */
  deleted_at?: string;
  /** Deleted by field on ai memory space record. */
  deleted_by?: string;
  /** Entry count field on ai memory space record. */
  entry_count?: string;
  /** Id field on ai memory space record. */
  id?: string;
  /** Max injected tokens field on ai memory space record. */
  max_injected_tokens?: string;
  /** Memory enabled field on ai memory space record. */
  memory_enabled?: boolean;
  /** Metadata field on ai memory space record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai memory space record. */
  organization_id?: string;
  /** Owner id field on ai memory space record. */
  owner_id?: string;
  /** Owner type field on ai memory space record. */
  owner_type?: string;
  /** Retention policy field on ai memory space record. */
  retention_policy?: Record<string, JsonValue>;
  /** Review required field on ai memory space record. */
  review_required?: boolean;
  /** Sensitivity policy field on ai memory space record. */
  sensitivity_policy?: Record<string, JsonValue>;
  /** Space type field on ai memory space record. */
  space_type?: string;
  /** Status field on ai memory space record. */
  status?: string;
  /** Tenant id field on ai memory space record. */
  tenant_id?: string;
  /** Title field on ai memory space record. */
  title?: string;
  /** Updated at field on ai memory space record. */
  updated_at?: string;
  /** User id field on ai memory space record. */
  user_id?: string;
  /** Uuid field on ai memory space record. */
  uuid?: string;
  /** Version field on ai memory space record. */
  version?: string;
}
