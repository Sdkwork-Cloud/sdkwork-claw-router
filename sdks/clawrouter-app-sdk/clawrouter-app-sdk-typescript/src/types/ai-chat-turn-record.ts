import type { JsonValue } from './json-value';

/** Ai chat turn record schema exposed by Claw Router. */
export interface AiChatTurnRecord {
  /** Agent id field on ai chat turn record. */
  agent_id?: string;
  /** Agent session id field on ai chat turn record. */
  agent_session_id?: string;
  /** Branch id field on ai chat turn record. */
  branch_id?: string;
  /** Cached token total field on ai chat turn record. */
  cached_token_total?: string;
  /** Completed at field on ai chat turn record. */
  completed_at?: string;
  /** Context snapshot id field on ai chat turn record. */
  context_snapshot_id?: string;
  /** Conversation id field on ai chat turn record. */
  conversation_id?: string;
  /** Cost amount field on ai chat turn record. */
  cost_amount?: string;
  /** Created at field on ai chat turn record. */
  created_at?: string;
  /** Currency field on ai chat turn record. */
  currency?: string;
  /** Endpoint field on ai chat turn record. */
  endpoint?: string;
  /** Final output item id field on ai chat turn record. */
  final_output_item_id?: string;
  /** Id field on ai chat turn record. */
  id?: string;
  /** Input item id field on ai chat turn record. */
  input_item_id?: string;
  /** Input token total field on ai chat turn record. */
  input_token_total?: string;
  /** Legal hold field on ai chat turn record. */
  legal_hold?: boolean;
  /** Metadata field on ai chat turn record. */
  metadata?: Record<string, JsonValue>;
  /** Model field on ai chat turn record. */
  model?: string;
  /** Organization id field on ai chat turn record. */
  organization_id?: string;
  /** Output token total field on ai chat turn record. */
  output_token_total?: string;
  /** Parent turn id field on ai chat turn record. */
  parent_turn_id?: string;
  /** Payload hash field on ai chat turn record. */
  payload_hash?: string;
  /** Provider field on ai chat turn record. */
  provider?: string;
  /** Reasoning token total field on ai chat turn record. */
  reasoning_token_total?: string;
  /** Request id field on ai chat turn record. */
  request_id?: string;
  /** Request snapshot field on ai chat turn record. */
  request_snapshot?: Record<string, JsonValue>;
  /** Response snapshot field on ai chat turn record. */
  response_snapshot?: Record<string, JsonValue>;
  /** Retention until field on ai chat turn record. */
  retention_until?: string;
  /** Runtime invocation id field on ai chat turn record. */
  runtime_invocation_id?: string;
  /** Started at field on ai chat turn record. */
  started_at?: string;
  /** Status field on ai chat turn record. */
  status?: string;
  /** Streaming field on ai chat turn record. */
  streaming?: boolean;
  /** Tenant id field on ai chat turn record. */
  tenant_id?: string;
  /** Trace id field on ai chat turn record. */
  trace_id?: string;
  /** Turn no field on ai chat turn record. */
  turn_no?: string;
  /** Usage snapshot field on ai chat turn record. */
  usage_snapshot?: Record<string, JsonValue>;
  /** User id field on ai chat turn record. */
  user_id?: string;
  /** Uuid field on ai chat turn record. */
  uuid?: string;
}
