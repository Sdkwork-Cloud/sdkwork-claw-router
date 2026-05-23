import type { JsonValue } from './json-value';

/** Ai chat context snapshot record schema exposed by Claw Router. */
export interface AiChatContextSnapshotRecord {
  /** Context json field on ai chat context snapshot record. */
  context_json?: Record<string, JsonValue>;
  /** Conversation id field on ai chat context snapshot record. */
  conversation_id?: string;
  /** Created at field on ai chat context snapshot record. */
  created_at?: string;
  /** Excluded item ids field on ai chat context snapshot record. */
  excluded_item_ids?: Record<string, JsonValue>;
  /** Excluded memory ids field on ai chat context snapshot record. */
  excluded_memory_ids?: Record<string, JsonValue>;
  /** Id field on ai chat context snapshot record. */
  id?: string;
  /** Included item ids field on ai chat context snapshot record. */
  included_item_ids?: Record<string, JsonValue>;
  /** Included memory ids field on ai chat context snapshot record. */
  included_memory_ids?: Record<string, JsonValue>;
  /** Input token estimate field on ai chat context snapshot record. */
  input_token_estimate?: string;
  /** Legal hold field on ai chat context snapshot record. */
  legal_hold?: boolean;
  /** Memory pack field on ai chat context snapshot record. */
  memory_pack?: Record<string, JsonValue>;
  /** Memory token count field on ai chat context snapshot record. */
  memory_token_count?: string;
  /** Metadata field on ai chat context snapshot record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai chat context snapshot record. */
  organization_id?: string;
  /** Payload hash field on ai chat context snapshot record. */
  payload_hash?: string;
  /** Previous response id field on ai chat context snapshot record. */
  previous_response_id?: string;
  /** Provider conversation id field on ai chat context snapshot record. */
  provider_conversation_id?: string;
  /** Request id field on ai chat context snapshot record. */
  request_id?: string;
  /** Retention until field on ai chat context snapshot record. */
  retention_until?: string;
  /** Runtime invocation id field on ai chat context snapshot record. */
  runtime_invocation_id?: string;
  /** Snapshot no field on ai chat context snapshot record. */
  snapshot_no?: number;
  /** Status field on ai chat context snapshot record. */
  status?: string;
  /** Strategy field on ai chat context snapshot record. */
  strategy?: string;
  /** Tenant id field on ai chat context snapshot record. */
  tenant_id?: string;
  /** Trace id field on ai chat context snapshot record. */
  trace_id?: string;
  /** Truncation reason field on ai chat context snapshot record. */
  truncation_reason?: string;
  /** Turn id field on ai chat context snapshot record. */
  turn_id?: string;
  /** User id field on ai chat context snapshot record. */
  user_id?: string;
  /** Uuid field on ai chat context snapshot record. */
  uuid?: string;
}
