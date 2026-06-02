import type { JsonValue } from './json-value';

/** Ai runtime usage link record schema exposed by Claw Router. */
export interface AiRuntimeUsageLinkRecord {
  /** Agent run id field on ai runtime usage link record. */
  agent_run_id?: string;
  /** Agent run step id field on ai runtime usage link record. */
  agent_run_step_id?: string;
  /** Agent run step id key field on ai runtime usage link record. */
  agent_run_step_id_key?: string;
  /** Agent session id field on ai runtime usage link record. */
  agent_session_id?: string;
  /** Cached tokens field on ai runtime usage link record. */
  cached_tokens?: string;
  /** Chat item id field on ai runtime usage link record. */
  chat_item_id?: string;
  /** Chat turn id field on ai runtime usage link record. */
  chat_turn_id?: string;
  /** Conversation id field on ai runtime usage link record. */
  conversation_id?: string;
  /** Cost amount field on ai runtime usage link record. */
  cost_amount?: string;
  /** Created at field on ai runtime usage link record. */
  created_at?: string;
  /** Currency field on ai runtime usage link record. */
  currency?: string;
  /** Id field on ai runtime usage link record. */
  id?: string;
  /** Input tokens field on ai runtime usage link record. */
  input_tokens?: string;
  /** Legal hold field on ai runtime usage link record. */
  legal_hold?: boolean;
  /** Message id field on ai runtime usage link record. */
  message_id?: string;
  /** Metadata field on ai runtime usage link record. */
  metadata?: Record<string, JsonValue>;
  /** Model field on ai runtime usage link record. */
  model?: string;
  /** Occurred at field on ai runtime usage link record. */
  occurred_at?: string;
  /** Organization id field on ai runtime usage link record. */
  organization_id?: string;
  /** Output tokens field on ai runtime usage link record. */
  output_tokens?: string;
  /** Payload hash field on ai runtime usage link record. */
  payload_hash?: string;
  /** Provider field on ai runtime usage link record. */
  provider?: string;
  /** Reasoning tokens field on ai runtime usage link record. */
  reasoning_tokens?: string;
  /** Request id field on ai runtime usage link record. */
  request_id?: string;
  /** Retention until field on ai runtime usage link record. */
  retention_until?: string;
  /** Runtime invocation id field on ai runtime usage link record. */
  runtime_invocation_id?: string;
  /** Status field on ai runtime usage link record. */
  status?: string;
  /** Tenant id field on ai runtime usage link record. */
  tenant_id?: string;
  /** Total tokens field on ai runtime usage link record. */
  total_tokens?: string;
  /** Trace id field on ai runtime usage link record. */
  trace_id?: string;
  /** Usage fact id field on ai runtime usage link record. */
  usage_fact_id?: string;
  /** Usage type field on ai runtime usage link record. */
  usage_type?: string;
  /** User id field on ai runtime usage link record. */
  user_id?: string;
  /** Uuid field on ai runtime usage link record. */
  uuid?: string;
}
