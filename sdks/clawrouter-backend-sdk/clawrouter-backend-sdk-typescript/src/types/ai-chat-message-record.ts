import type { JsonValue } from './json-value';

/** Ai chat message record schema exposed by Claw Router. */
export interface AiChatMessageRecord {
  /** Content json field on ai chat message record. */
  content_json?: Record<string, JsonValue>;
  /** Content text field on ai chat message record. */
  content_text?: string;
  /** Conversation id field on ai chat message record. */
  conversation_id?: string;
  /** Created at field on ai chat message record. */
  created_at?: string;
  /** Direction field on ai chat message record. */
  direction?: string;
  /** Finish reason field on ai chat message record. */
  finish_reason?: string;
  /** Id field on ai chat message record. */
  id?: string;
  /** Item id field on ai chat message record. */
  item_id?: string;
  /** Legal hold field on ai chat message record. */
  legal_hold?: boolean;
  /** Message kind field on ai chat message record. */
  message_kind?: string;
  /** Message no field on ai chat message record. */
  message_no?: string;
  /** Metadata field on ai chat message record. */
  metadata?: Record<string, JsonValue>;
  /** Model field on ai chat message record. */
  model?: string;
  /** Organization id field on ai chat message record. */
  organization_id?: string;
  /** Payload hash field on ai chat message record. */
  payload_hash?: string;
  /** Provider field on ai chat message record. */
  provider?: string;
  /** Raw provider json field on ai chat message record. */
  raw_provider_json?: Record<string, JsonValue>;
  /** Request id field on ai chat message record. */
  request_id?: string;
  /** Retention until field on ai chat message record. */
  retention_until?: string;
  /** Role field on ai chat message record. */
  role?: string;
  /** Runtime field on ai chat message record. */
  runtime?: string;
  /** Runtime invocation id field on ai chat message record. */
  runtime_invocation_id?: string;
  /** Status field on ai chat message record. */
  status?: string;
  /** Tenant id field on ai chat message record. */
  tenant_id?: string;
  /** Token count field on ai chat message record. */
  token_count?: string;
  /** Trace id field on ai chat message record. */
  trace_id?: string;
  /** Turn id field on ai chat message record. */
  turn_id?: string;
  /** Usage link id field on ai chat message record. */
  usage_link_id?: string;
  /** User id field on ai chat message record. */
  user_id?: string;
  /** Uuid field on ai chat message record. */
  uuid?: string;
}
