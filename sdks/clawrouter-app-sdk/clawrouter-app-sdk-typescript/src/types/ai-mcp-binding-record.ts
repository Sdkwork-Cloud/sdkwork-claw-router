import type { JsonValue } from './json-value';

/** Ai mcp binding record schema exposed by Claw Router. */
export interface AiMcpBindingRecord {
  /** Created at field on ai mcp binding record. */
  created_at?: string;
  /** Data scope field on ai mcp binding record. */
  data_scope?: string;
  /** Deleted at field on ai mcp binding record. */
  deleted_at?: string;
  /** Deleted by field on ai mcp binding record. */
  deleted_by?: string;
  /** Id field on ai mcp binding record. */
  id?: string;
  /** Metadata field on ai mcp binding record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai mcp binding record. */
  organization_id?: string;
  /** Owner id field on ai mcp binding record. */
  owner_id?: string;
  /** Owner type field on ai mcp binding record. */
  owner_type?: string;
  /** Server id field on ai mcp binding record. */
  server_id?: string;
  /** Server revision id field on ai mcp binding record. */
  server_revision_id?: string;
  /** Status field on ai mcp binding record. */
  status?: string;
  /** Tenant id field on ai mcp binding record. */
  tenant_id?: string;
  /** Tool id field on ai mcp binding record. */
  tool_id?: string;
  /** Updated at field on ai mcp binding record. */
  updated_at?: string;
  /** Uuid field on ai mcp binding record. */
  uuid?: string;
  /** Version field on ai mcp binding record. */
  version?: string;
}
