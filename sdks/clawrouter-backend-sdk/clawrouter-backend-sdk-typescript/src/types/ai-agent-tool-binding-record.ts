import type { JsonValue } from './json-value';

/** Ai agent tool binding record schema exposed by Claw Router. */
export interface AiAgentToolBindingRecord {
  /** Agent id field on ai agent tool binding record. */
  agent_id?: string;
  /** Agent version id field on ai agent tool binding record. */
  agent_version_id?: string;
  /** Binding key field on ai agent tool binding record. */
  binding_key?: string;
  /** Binding type field on ai agent tool binding record. */
  binding_type?: string;
  /** Created at field on ai agent tool binding record. */
  created_at?: string;
  /** Credential ref field on ai agent tool binding record. */
  credential_ref?: string;
  /** Data scope field on ai agent tool binding record. */
  data_scope?: string;
  /** Deleted at field on ai agent tool binding record. */
  deleted_at?: string;
  /** Deleted by field on ai agent tool binding record. */
  deleted_by?: string;
  /** Enabled field on ai agent tool binding record. */
  enabled?: boolean;
  /** Health status field on ai agent tool binding record. */
  health_status?: string;
  /** Id field on ai agent tool binding record. */
  id?: string;
  /** Last checked at field on ai agent tool binding record. */
  last_checked_at?: string;
  /** Mcp server id field on ai agent tool binding record. */
  mcp_server_id?: string;
  /** Metadata field on ai agent tool binding record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai agent tool binding record. */
  organization_id?: string;
  /** Permission policy field on ai agent tool binding record. */
  permission_policy?: Record<string, JsonValue>;
  /** Runtime config field on ai agent tool binding record. */
  runtime_config?: Record<string, JsonValue>;
  /** Skill id field on ai agent tool binding record. */
  skill_id?: string;
  /** Status field on ai agent tool binding record. */
  status?: string;
  /** Tenant id field on ai agent tool binding record. */
  tenant_id?: string;
  /** Tool name field on ai agent tool binding record. */
  tool_name?: string;
  /** Updated at field on ai agent tool binding record. */
  updated_at?: string;
  /** Uuid field on ai agent tool binding record. */
  uuid?: string;
  /** Version field on ai agent tool binding record. */
  version?: string;
}
