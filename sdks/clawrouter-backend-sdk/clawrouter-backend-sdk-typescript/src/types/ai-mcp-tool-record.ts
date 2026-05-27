import type { JsonValue } from './json-value';

/** Ai mcp tool record schema exposed by Claw Router. */
export interface AiMcpToolRecord {
  /** Created at field on ai mcp tool record. */
  created_at?: string;
  /** Data scope field on ai mcp tool record. */
  data_scope?: string;
  /** Deleted at field on ai mcp tool record. */
  deleted_at?: string;
  /** Deleted by field on ai mcp tool record. */
  deleted_by?: string;
  /** Description field on ai mcp tool record. */
  description?: string;
  /** Discovered at field on ai mcp tool record. */
  discovered_at?: string;
  /** Id field on ai mcp tool record. */
  id?: string;
  /** Last invoked at field on ai mcp tool record. */
  last_invoked_at?: string;
  /** Metadata field on ai mcp tool record. */
  metadata?: Record<string, JsonValue>;
  /** Name field on ai mcp tool record. */
  name?: string;
  /** Organization id field on ai mcp tool record. */
  organization_id?: string;
  /** Schema hash field on ai mcp tool record. */
  schema_hash?: string;
  /** Server id field on ai mcp tool record. */
  server_id?: string;
  /** Server revision id field on ai mcp tool record. */
  server_revision_id?: string;
  /** Status field on ai mcp tool record. */
  status?: string;
  /** Tenant id field on ai mcp tool record. */
  tenant_id?: string;
  /** Tool key field on ai mcp tool record. */
  tool_key?: string;
  /** Updated at field on ai mcp tool record. */
  updated_at?: string;
  /** Uuid field on ai mcp tool record. */
  uuid?: string;
  /** Version field on ai mcp tool record. */
  version?: string;
}
