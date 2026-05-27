import type { JsonValue } from './json-value';

/** Ai mcp server record schema exposed by Claw Router. */
export interface AiMcpServerRecord {
  /** Category code field on ai mcp server record. */
  category_code?: string;
  /** Category id field on ai mcp server record. */
  category_id?: string;
  /** Created at field on ai mcp server record. */
  created_at?: string;
  /** Data scope field on ai mcp server record. */
  data_scope?: string;
  /** Deleted at field on ai mcp server record. */
  deleted_at?: string;
  /** Deleted by field on ai mcp server record. */
  deleted_by?: string;
  /** Deprecated at field on ai mcp server record. */
  deprecated_at?: string;
  /** Description field on ai mcp server record. */
  description?: string;
  /** Id field on ai mcp server record. */
  id?: string;
  /** Last checked at field on ai mcp server record. */
  last_checked_at?: string;
  /** Last error masked field on ai mcp server record. */
  last_error_masked?: string;
  /** Latest revision id field on ai mcp server record. */
  latest_revision_id?: string;
  /** Metadata field on ai mcp server record. */
  metadata?: Record<string, JsonValue>;
  /** Name field on ai mcp server record. */
  name?: string;
  /** Organization id field on ai mcp server record. */
  organization_id?: string;
  /** Owner user id field on ai mcp server record. */
  owner_user_id?: string;
  /** Published at field on ai mcp server record. */
  published_at?: string;
  /** Published revision id field on ai mcp server record. */
  published_revision_id?: string;
  /** Server key field on ai mcp server record. */
  server_key?: string;
  /** Status field on ai mcp server record. */
  status?: string;
  /** Tenant id field on ai mcp server record. */
  tenant_id?: string;
  /** Transport field on ai mcp server record. */
  transport?: string;
  /** Updated at field on ai mcp server record. */
  updated_at?: string;
  /** Uuid field on ai mcp server record. */
  uuid?: string;
  /** Version field on ai mcp server record. */
  version?: string;
  /** Visibility field on ai mcp server record. */
  visibility?: string;
}
