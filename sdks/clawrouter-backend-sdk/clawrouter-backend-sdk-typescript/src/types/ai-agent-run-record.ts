import type { JsonValue } from './json-value';

/** Ai agent run record schema exposed by Claw Router. */
export interface AiAgentRunRecord {
  /** Agent id field on ai agent run record. */
  agent_id?: string;
  /** Agent version id field on ai agent run record. */
  agent_version_id?: string;
  /** Audio seconds field on ai agent run record. */
  audio_seconds?: string;
  /** Cached tokens field on ai agent run record. */
  cached_tokens?: string;
  /** Cancelled at field on ai agent run record. */
  cancelled_at?: string;
  /** Completed at field on ai agent run record. */
  completed_at?: string;
  /** Completion tokens field on ai agent run record. */
  completion_tokens?: string;
  /** Created at field on ai agent run record. */
  created_at?: string;
  /** Error message masked field on ai agent run record. */
  error_message_masked?: string;
  /** Execution mode field on ai agent run record. */
  execution_mode?: string;
  /** Failed at field on ai agent run record. */
  failed_at?: string;
  /** Id field on ai agent run record. */
  id?: string;
  /** Image count field on ai agent run record. */
  image_count?: string;
  /** Input message field on ai agent run record. */
  input_message?: string;
  /** Legal hold field on ai agent run record. */
  legal_hold?: boolean;
  /** Metadata field on ai agent run record. */
  metadata?: Record<string, JsonValue>;
  /** Metering status field on ai agent run record. */
  metering_status?: string;
  /** Organization id field on ai agent run record. */
  organization_id?: string;
  /** Output message field on ai agent run record. */
  output_message?: string;
  /** Payload hash field on ai agent run record. */
  payload_hash?: string;
  /** Planner model field on ai agent run record. */
  planner_model?: string;
  /** Prompt tokens field on ai agent run record. */
  prompt_tokens?: string;
  /** Request id field on ai agent run record. */
  request_id?: string;
  /** Retention until field on ai agent run record. */
  retention_until?: string;
  /** Run status field on ai agent run record. */
  run_status?: string;
  /** Run uuid field on ai agent run record. */
  run_uuid?: string;
  /** Source surface field on ai agent run record. */
  source_surface?: string;
  /** Started at field on ai agent run record. */
  started_at?: string;
  /** Status field on ai agent run record. */
  status?: string;
  /** Target modality field on ai agent run record. */
  target_modality?: string;
  /** Tenant id field on ai agent run record. */
  tenant_id?: string;
  /** Total steps field on ai agent run record. */
  total_steps?: number;
  /** Total tokens field on ai agent run record. */
  total_tokens?: string;
  /** Trace id field on ai agent run record. */
  trace_id?: string;
  /** Usage fact id field on ai agent run record. */
  usage_fact_id?: string;
  /** User id field on ai agent run record. */
  user_id?: string;
  /** Uuid field on ai agent run record. */
  uuid?: string;
  /** Video seconds field on ai agent run record. */
  video_seconds?: string;
}
