import type { JsonValue } from './json-value';

/** Ai agent version record schema exposed by Claw Router. */
export interface AiAgentVersionRecord {
  /** Agent id field on ai agent version record. */
  agent_id?: string;
  /** Config hash field on ai agent version record. */
  config_hash?: string;
  /** Created at field on ai agent version record. */
  created_at?: string;
  /** Data scope field on ai agent version record. */
  data_scope?: string;
  /** Deleted at field on ai agent version record. */
  deleted_at?: string;
  /** Deleted by field on ai agent version record. */
  deleted_by?: string;
  /** Id field on ai agent version record. */
  id?: string;
  /** Mcp policy field on ai agent version record. */
  mcp_policy?: Record<string, JsonValue>;
  /** Memory policy field on ai agent version record. */
  memory_policy?: Record<string, JsonValue>;
  /** Metadata field on ai agent version record. */
  metadata?: Record<string, JsonValue>;
  /** Model policy field on ai agent version record. */
  model_policy?: Record<string, JsonValue>;
  /** Organization id field on ai agent version record. */
  organization_id?: string;
  /** Published at field on ai agent version record. */
  published_at?: string;
  /** Published by field on ai agent version record. */
  published_by?: string;
  /** Release status field on ai agent version record. */
  release_status?: string;
  /** Runtime policy field on ai agent version record. */
  runtime_policy?: Record<string, JsonValue>;
  /** Skill policy field on ai agent version record. */
  skill_policy?: Record<string, JsonValue>;
  /** Status field on ai agent version record. */
  status?: string;
  /** System prompt field on ai agent version record. */
  system_prompt?: string;
  /** Tenant id field on ai agent version record. */
  tenant_id?: string;
  /** Tool policy field on ai agent version record. */
  tool_policy?: Record<string, JsonValue>;
  /** Updated at field on ai agent version record. */
  updated_at?: string;
  /** Uuid field on ai agent version record. */
  uuid?: string;
  /** Version field on ai agent version record. */
  version?: string;
  /** Version no field on ai agent version record. */
  version_no?: string;
}
