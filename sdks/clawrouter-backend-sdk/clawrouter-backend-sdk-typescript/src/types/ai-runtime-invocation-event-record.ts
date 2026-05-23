import type { JsonValue } from './json-value';

/** Ai runtime invocation event record schema exposed by Claw Router. */
export interface AiRuntimeInvocationEventRecord {
  /** Agent run id field on ai runtime invocation event record. */
  agent_run_id?: string;
  /** Agent run step id field on ai runtime invocation event record. */
  agent_run_step_id?: string;
  /** Agent session id field on ai runtime invocation event record. */
  agent_session_id?: string;
  /** Chat turn id field on ai runtime invocation event record. */
  chat_turn_id?: string;
  /** Conversation id field on ai runtime invocation event record. */
  conversation_id?: string;
  /** Created at field on ai runtime invocation event record. */
  created_at?: string;
  /** Event no field on ai runtime invocation event record. */
  event_no?: string;
  /** Event source field on ai runtime invocation event record. */
  event_source?: string;
  /** Event type field on ai runtime invocation event record. */
  event_type?: string;
  /** Id field on ai runtime invocation event record. */
  id?: string;
  /** Invocation id field on ai runtime invocation event record. */
  invocation_id?: string;
  /** Legal hold field on ai runtime invocation event record. */
  legal_hold?: boolean;
  /** Metadata field on ai runtime invocation event record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai runtime invocation event record. */
  organization_id?: string;
  /** Payload hash field on ai runtime invocation event record. */
  payload_hash?: string;
  /** Payload json field on ai runtime invocation event record. */
  payload_json?: Record<string, JsonValue>;
  /** Request id field on ai runtime invocation event record. */
  request_id?: string;
  /** Retention until field on ai runtime invocation event record. */
  retention_until?: string;
  /** Status field on ai runtime invocation event record. */
  status?: string;
  /** Tenant id field on ai runtime invocation event record. */
  tenant_id?: string;
  /** Text delta field on ai runtime invocation event record. */
  text_delta?: string;
  /** Trace id field on ai runtime invocation event record. */
  trace_id?: string;
  /** User id field on ai runtime invocation event record. */
  user_id?: string;
  /** Uuid field on ai runtime invocation event record. */
  uuid?: string;
}
