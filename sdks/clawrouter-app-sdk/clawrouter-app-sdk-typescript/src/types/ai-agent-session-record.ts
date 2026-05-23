import type { JsonValue } from './json-value';

/** Ai agent session record schema exposed by Claw Router. */
export interface AiAgentSessionRecord {
  /** Agent id field on ai agent session record. */
  agent_id?: string;
  /** Agent version id field on ai agent session record. */
  agent_version_id?: string;
  /** Approval policy field on ai agent session record. */
  approval_policy?: string;
  /** Chat conversation id field on ai agent session record. */
  chat_conversation_id?: string;
  /** Created at field on ai agent session record. */
  created_at?: string;
  /** Cwd field on ai agent session record. */
  cwd?: string;
  /** Data scope field on ai agent session record. */
  data_scope?: string;
  /** Default model field on ai agent session record. */
  default_model?: string;
  /** Deleted at field on ai agent session record. */
  deleted_at?: string;
  /** Deleted by field on ai agent session record. */
  deleted_by?: string;
  /** Execution mode field on ai agent session record. */
  execution_mode?: string;
  /** Forked from run id field on ai agent session record. */
  forked_from_run_id?: string;
  /** Forked from step id field on ai agent session record. */
  forked_from_step_id?: string;
  /** Git branch field on ai agent session record. */
  git_branch?: string;
  /** Git commit field on ai agent session record. */
  git_commit?: string;
  /** Id field on ai agent session record. */
  id?: string;
  /** Last active at field on ai agent session record. */
  last_active_at?: string;
  /** Last run id field on ai agent session record. */
  last_run_id?: string;
  /** Last step id field on ai agent session record. */
  last_step_id?: string;
  /** Memory space id field on ai agent session record. */
  memory_space_id?: string;
  /** Metadata field on ai agent session record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai agent session record. */
  organization_id?: string;
  /** Owner id field on ai agent session record. */
  owner_id?: string;
  /** Owner type field on ai agent session record. */
  owner_type?: string;
  /** Parent session id field on ai agent session record. */
  parent_session_id?: string;
  /** Permission mode field on ai agent session record. */
  permission_mode?: string;
  /** Provider conversation id field on ai agent session record. */
  provider_conversation_id?: string;
  /** Provider session id field on ai agent session record. */
  provider_session_id?: string;
  /** Repository id field on ai agent session record. */
  repository_id?: string;
  /** Resume strategy field on ai agent session record. */
  resume_strategy?: string;
  /** Run count field on ai agent session record. */
  run_count?: string;
  /** Runtime field on ai agent session record. */
  runtime?: string;
  /** Runtime state storage key field on ai agent session record. */
  runtime_state_storage_key?: string;
  /** Sandbox policy field on ai agent session record. */
  sandbox_policy?: string;
  /** Session code field on ai agent session record. */
  session_code?: string;
  /** Session kind field on ai agent session record. */
  session_kind?: string;
  /** Source surface field on ai agent session record. */
  source_surface?: string;
  /** Status field on ai agent session record. */
  status?: string;
  /** Step count field on ai agent session record. */
  step_count?: string;
  /** Summary field on ai agent session record. */
  summary?: string;
  /** Tenant id field on ai agent session record. */
  tenant_id?: string;
  /** Title field on ai agent session record. */
  title?: string;
  /** Tool call count field on ai agent session record. */
  tool_call_count?: string;
  /** Updated at field on ai agent session record. */
  updated_at?: string;
  /** User id field on ai agent session record. */
  user_id?: string;
  /** Uuid field on ai agent session record. */
  uuid?: string;
  /** Version field on ai agent session record. */
  version?: string;
  /** Visibility field on ai agent session record. */
  visibility?: string;
  /** Workspace id field on ai agent session record. */
  workspace_id?: string;
}
