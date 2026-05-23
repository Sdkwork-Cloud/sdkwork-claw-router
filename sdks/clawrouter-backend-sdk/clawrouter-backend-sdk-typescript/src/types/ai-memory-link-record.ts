import type { JsonValue } from './json-value';

/** Ai memory link record schema exposed by Claw Router. */
export interface AiMemoryLinkRecord {
  /** Agent run id field on ai memory link record. */
  agent_run_id?: string;
  /** Agent run step id field on ai memory link record. */
  agent_run_step_id?: string;
  /** Agent session id field on ai memory link record. */
  agent_session_id?: string;
  /** Chat item id field on ai memory link record. */
  chat_item_id?: string;
  /** Chat turn id field on ai memory link record. */
  chat_turn_id?: string;
  /** Conversation id field on ai memory link record. */
  conversation_id?: string;
  /** Created at field on ai memory link record. */
  created_at?: string;
  /** Id field on ai memory link record. */
  id?: string;
  /** Injected text snapshot field on ai memory link record. */
  injected_text_snapshot?: string;
  /** Legal hold field on ai memory link record. */
  legal_hold?: boolean;
  /** Link type field on ai memory link record. */
  link_type?: string;
  /** Memory id field on ai memory link record. */
  memory_id?: string;
  /** Memory space id field on ai memory link record. */
  memory_space_id?: string;
  /** Message id field on ai memory link record. */
  message_id?: string;
  /** Metadata field on ai memory link record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai memory link record. */
  organization_id?: string;
  /** Payload hash field on ai memory link record. */
  payload_hash?: string;
  /** Policy decision field on ai memory link record. */
  policy_decision?: string;
  /** Recall query field on ai memory link record. */
  recall_query?: string;
  /** Recall rank field on ai memory link record. */
  recall_rank?: number;
  /** Recall score field on ai memory link record. */
  recall_score?: string;
  /** Request id field on ai memory link record. */
  request_id?: string;
  /** Retention until field on ai memory link record. */
  retention_until?: string;
  /** Runtime invocation id field on ai memory link record. */
  runtime_invocation_id?: string;
  /** Status field on ai memory link record. */
  status?: string;
  /** Tenant id field on ai memory link record. */
  tenant_id?: string;
  /** Token count field on ai memory link record. */
  token_count?: string;
  /** Trace id field on ai memory link record. */
  trace_id?: string;
  /** User id field on ai memory link record. */
  user_id?: string;
  /** Uuid field on ai memory link record. */
  uuid?: string;
}
