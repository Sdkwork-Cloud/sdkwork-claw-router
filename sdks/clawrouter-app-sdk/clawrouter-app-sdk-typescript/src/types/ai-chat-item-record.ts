import type { JsonValue } from './json-value';

/** Ai chat item record schema exposed by Claw Router. */
export interface AiChatItemRecord {
  /** Completed at field on ai chat item record. */
  completed_at?: string;
  /** Content json field on ai chat item record. */
  content_json?: Record<string, JsonValue>;
  /** Content text field on ai chat item record. */
  content_text?: string;
  /** Conversation id field on ai chat item record. */
  conversation_id?: string;
  /** Created at field on ai chat item record. */
  created_at?: string;
  /** Direction field on ai chat item record. */
  direction?: string;
  /** Id field on ai chat item record. */
  id?: string;
  /** Item type field on ai chat item record. */
  item_type?: string;
  /** Legal hold field on ai chat item record. */
  legal_hold?: boolean;
  /** Metadata field on ai chat item record. */
  metadata?: Record<string, JsonValue>;
  /** Model field on ai chat item record. */
  model?: string;
  /** Organization id field on ai chat item record. */
  organization_id?: string;
  /** Parent item id field on ai chat item record. */
  parent_item_id?: string;
  /** Payload hash field on ai chat item record. */
  payload_hash?: string;
  /** Provider field on ai chat item record. */
  provider?: string;
  /** Provider call id field on ai chat item record. */
  provider_call_id?: string;
  /** Provider item id field on ai chat item record. */
  provider_item_id?: string;
  /** Provider response id field on ai chat item record. */
  provider_response_id?: string;
  /** Raw provider json field on ai chat item record. */
  raw_provider_json?: Record<string, JsonValue>;
  /** Request id field on ai chat item record. */
  request_id?: string;
  /** Retention until field on ai chat item record. */
  retention_until?: string;
  /** Role field on ai chat item record. */
  role?: string;
  /** Runtime field on ai chat item record. */
  runtime?: string;
  /** Runtime invocation id field on ai chat item record. */
  runtime_invocation_id?: string;
  /** Sequence no field on ai chat item record. */
  sequence_no?: string;
  /** Status field on ai chat item record. */
  status?: string;
  /** Tenant id field on ai chat item record. */
  tenant_id?: string;
  /** Trace id field on ai chat item record. */
  trace_id?: string;
  /** Turn id field on ai chat item record. */
  turn_id?: string;
  /** User id field on ai chat item record. */
  user_id?: string;
  /** Uuid field on ai chat item record. */
  uuid?: string;
}
