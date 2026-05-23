import type { JsonValue } from './json-value';

/** Ai runtime invocation record schema exposed by Claw Router. */
export interface AiRuntimeInvocationRecord {
  /** Agent run id field on ai runtime invocation record. */
  agent_run_id?: string;
  /** Agent run step id field on ai runtime invocation record. */
  agent_run_step_id?: string;
  /** Agent session id field on ai runtime invocation record. */
  agent_session_id?: string;
  /** Approval policy field on ai runtime invocation record. */
  approval_policy?: string;
  /** Attempt no field on ai runtime invocation record. */
  attempt_no?: number;
  /** Chat item id field on ai runtime invocation record. */
  chat_item_id?: string;
  /** Chat turn id field on ai runtime invocation record. */
  chat_turn_id?: string;
  /** Completed at field on ai runtime invocation record. */
  completed_at?: string;
  /** Conversation id field on ai runtime invocation record. */
  conversation_id?: string;
  /** Created at field on ai runtime invocation record. */
  created_at?: string;
  /** Cwd field on ai runtime invocation record. */
  cwd?: string;
  /** Endpoint field on ai runtime invocation record. */
  endpoint?: string;
  /** Error code field on ai runtime invocation record. */
  error_code?: string;
  /** Error message masked field on ai runtime invocation record. */
  error_message_masked?: string;
  /** Error type field on ai runtime invocation record. */
  error_type?: string;
  /** Exit code field on ai runtime invocation record. */
  exit_code?: string;
  /** Finish reason field on ai runtime invocation record. */
  finish_reason?: string;
  /** Id field on ai runtime invocation record. */
  id?: string;
  /** Invocation no field on ai runtime invocation record. */
  invocation_no?: string;
  /** Invocation type field on ai runtime invocation record. */
  invocation_type?: string;
  /** Latency ms field on ai runtime invocation record. */
  latency_ms?: string;
  /** Legal hold field on ai runtime invocation record. */
  legal_hold?: boolean;
  /** Metadata field on ai runtime invocation record. */
  metadata?: Record<string, JsonValue>;
  /** Model field on ai runtime invocation record. */
  model?: string;
  /** Organization id field on ai runtime invocation record. */
  organization_id?: string;
  /** Payload hash field on ai runtime invocation record. */
  payload_hash?: string;
  /** Permission mode field on ai runtime invocation record. */
  permission_mode?: string;
  /** Provider field on ai runtime invocation record. */
  provider?: string;
  /** Provider conversation id field on ai runtime invocation record. */
  provider_conversation_id?: string;
  /** Provider response id field on ai runtime invocation record. */
  provider_response_id?: string;
  /** Provider session id field on ai runtime invocation record. */
  provider_session_id?: string;
  /** Provider step id field on ai runtime invocation record. */
  provider_step_id?: string;
  /** Request id field on ai runtime invocation record. */
  request_id?: string;
  /** Request json field on ai runtime invocation record. */
  request_json?: Record<string, JsonValue>;
  /** Response json field on ai runtime invocation record. */
  response_json?: Record<string, JsonValue>;
  /** Retention until field on ai runtime invocation record. */
  retention_until?: string;
  /** Runtime field on ai runtime invocation record. */
  runtime?: string;
  /** Sandbox policy field on ai runtime invocation record. */
  sandbox_policy?: string;
  /** Started at field on ai runtime invocation record. */
  started_at?: string;
  /** Status field on ai runtime invocation record. */
  status?: string;
  /** Tenant id field on ai runtime invocation record. */
  tenant_id?: string;
  /** Tool call id field on ai runtime invocation record. */
  tool_call_id?: string;
  /** Tool name field on ai runtime invocation record. */
  tool_name?: string;
  /** Trace id field on ai runtime invocation record. */
  trace_id?: string;
  /** Ttft ms field on ai runtime invocation record. */
  ttft_ms?: string;
  /** Usage json field on ai runtime invocation record. */
  usage_json?: Record<string, JsonValue>;
  /** User id field on ai runtime invocation record. */
  user_id?: string;
  /** Uuid field on ai runtime invocation record. */
  uuid?: string;
}
