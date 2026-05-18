import type { JsonValue } from './json-value';

/** Ai agent mcp server record schema exposed by Claw Router. */
export interface AiAgentMcpServerRecord {
  /** Connection config field on ai agent mcp server record. */
  connection_config?: Record<string, JsonValue>;
  /** Created at field on ai agent mcp server record. */
  created_at?: string;
  /** Credential ref field on ai agent mcp server record. */
  credential_ref?: string;
  /** Data scope field on ai agent mcp server record. */
  data_scope?: string;
  /** Deleted at field on ai agent mcp server record. */
  deleted_at?: string;
  /** Deleted by field on ai agent mcp server record. */
  deleted_by?: string;
  /** Description field on ai agent mcp server record. */
  description?: string;
  /** Health status field on ai agent mcp server record. */
  health_status?: string;
  /** Id field on ai agent mcp server record. */
  id?: string;
  /** Last checked at field on ai agent mcp server record. */
  last_checked_at?: string;
  /** Last error masked field on ai agent mcp server record. */
  last_error_masked?: string;
  /** Metadata field on ai agent mcp server record. */
  metadata?: Record<string, JsonValue>;
  /** Name field on ai agent mcp server record. */
  name?: string;
  /** Organization id field on ai agent mcp server record. */
  organization_id?: string;
  /** Permission policy field on ai agent mcp server record. */
  permission_policy?: Record<string, JsonValue>;
  /** Prompt catalog field on ai agent mcp server record. */
  prompt_catalog?: Record<string, JsonValue>;
  /** Resource catalog field on ai agent mcp server record. */
  resource_catalog?: Record<string, JsonValue>;
  /** Server code field on ai agent mcp server record. */
  server_code?: string;
  /** Status field on ai agent mcp server record. */
  status?: string;
  /** Tenant id field on ai agent mcp server record. */
  tenant_id?: string;
  /** Tool catalog field on ai agent mcp server record. */
  tool_catalog?: Record<string, JsonValue>;
  /** Transport type field on ai agent mcp server record. */
  transport_type?: string;
  /** Updated at field on ai agent mcp server record. */
  updated_at?: string;
  /** Uuid field on ai agent mcp server record. */
  uuid?: string;
  /** Version field on ai agent mcp server record. */
  version?: string;
}
