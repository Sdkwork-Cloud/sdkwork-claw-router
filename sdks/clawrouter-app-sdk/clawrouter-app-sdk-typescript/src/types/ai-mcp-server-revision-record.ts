import type { JsonValue } from './json-value';

/** Ai mcp server revision record schema exposed by Claw Router. */
export interface AiMcpServerRevisionRecord {
  /** Args json field on ai mcp server revision record. */
  args_json?: Record<string, JsonValue>;
  /** Auth type field on ai mcp server revision record. */
  auth_type?: string;
  /** Command field on ai mcp server revision record. */
  command?: string;
  /** Config hash field on ai mcp server revision record. */
  config_hash?: string;
  /** Created at field on ai mcp server revision record. */
  created_at?: string;
  /** Created by field on ai mcp server revision record. */
  created_by?: string;
  /** Data scope field on ai mcp server revision record. */
  data_scope?: string;
  /** Deleted at field on ai mcp server revision record. */
  deleted_at?: string;
  /** Deleted by field on ai mcp server revision record. */
  deleted_by?: string;
  /** Deprecated at field on ai mcp server revision record. */
  deprecated_at?: string;
  /** Endpoint url field on ai mcp server revision record. */
  endpoint_url?: string;
  /** Env schema field on ai mcp server revision record. */
  env_schema?: Record<string, JsonValue>;
  /** Id field on ai mcp server revision record. */
  id?: string;
  /** Lifecycle status field on ai mcp server revision record. */
  lifecycle_status?: string;
  /** Metadata field on ai mcp server revision record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai mcp server revision record. */
  organization_id?: string;
  /** Published at field on ai mcp server revision record. */
  published_at?: string;
  /** Retry policy field on ai mcp server revision record. */
  retry_policy?: Record<string, JsonValue>;
  /** Revision no field on ai mcp server revision record. */
  revision_no?: string;
  /** Secret ref field on ai mcp server revision record. */
  secret_ref?: string;
  /** Server id field on ai mcp server revision record. */
  server_id?: string;
  /** Status field on ai mcp server revision record. */
  status?: string;
  /** Tenant id field on ai mcp server revision record. */
  tenant_id?: string;
  /** Timeout ms field on ai mcp server revision record. */
  timeout_ms?: number;
  /** Transport field on ai mcp server revision record. */
  transport?: string;
  /** Updated at field on ai mcp server revision record. */
  updated_at?: string;
  /** Uuid field on ai mcp server revision record. */
  uuid?: string;
  /** Version field on ai mcp server revision record. */
  version?: string;
}
