import type { JsonValue } from './json-value';

/** Ai agent run step record schema exposed by Claw Router. */
export interface AiAgentRunStepRecord {
  /** Agent id field on ai agent run step record. */
  agent_id?: string;
  /** Agent version id field on ai agent run step record. */
  agent_version_id?: string;
  /** Audio seconds field on ai agent run step record. */
  audio_seconds?: string;
  /** Cached tokens field on ai agent run step record. */
  cached_tokens?: string;
  /** Completed at field on ai agent run step record. */
  completed_at?: string;
  /** Completion tokens field on ai agent run step record. */
  completion_tokens?: string;
  /** Created at field on ai agent run step record. */
  created_at?: string;
  /** Error message masked field on ai agent run step record. */
  error_message_masked?: string;
  /** Id field on ai agent run step record. */
  id?: string;
  /** Image count field on ai agent run step record. */
  image_count?: string;
  /** Input snapshot field on ai agent run step record. */
  input_snapshot?: Record<string, JsonValue>;
  /** Latency ms field on ai agent run step record. */
  latency_ms?: number;
  /** Legal hold field on ai agent run step record. */
  legal_hold?: boolean;
  /** Mcp server id field on ai agent run step record. */
  mcp_server_id?: string;
  /** Metadata field on ai agent run step record. */
  metadata?: Record<string, JsonValue>;
  /** Model field on ai agent run step record. */
  model?: string;
  /** Organization id field on ai agent run step record. */
  organization_id?: string;
  /** Output snapshot field on ai agent run step record. */
  output_snapshot?: Record<string, JsonValue>;
  /** Payload hash field on ai agent run step record. */
  payload_hash?: string;
  /** Prompt tokens field on ai agent run step record. */
  prompt_tokens?: string;
  /** Request id field on ai agent run step record. */
  request_id?: string;
  /** Retention until field on ai agent run step record. */
  retention_until?: string;
  /** Run id field on ai agent run step record. */
  run_id?: string;
  /** Runtime invocation id field on ai agent run step record. */
  runtime_invocation_id?: string;
  /** Skill id field on ai agent run step record. */
  skill_id?: string;
  /** Started at field on ai agent run step record. */
  started_at?: string;
  /** Status field on ai agent run step record. */
  status?: string;
  /** Step index field on ai agent run step record. */
  step_index?: number;
  /** Step status field on ai agent run step record. */
  step_status?: string;
  /** Step type field on ai agent run step record. */
  step_type?: string;
  /** Tenant id field on ai agent run step record. */
  tenant_id?: string;
  /** Title field on ai agent run step record. */
  title?: string;
  /** Tool binding id field on ai agent run step record. */
  tool_binding_id?: string;
  /** Tool name field on ai agent run step record. */
  tool_name?: string;
  /** Total tokens field on ai agent run step record. */
  total_tokens?: string;
  /** Trace id field on ai agent run step record. */
  trace_id?: string;
  /** Usage fact id field on ai agent run step record. */
  usage_fact_id?: string;
  /** Usage json field on ai agent run step record. */
  usage_json?: Record<string, JsonValue>;
  /** User id field on ai agent run step record. */
  user_id?: string;
  /** Uuid field on ai agent run step record. */
  uuid?: string;
  /** Video seconds field on ai agent run step record. */
  video_seconds?: string;
}
