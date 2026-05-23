import type { JsonValue } from './json-value';

/** Ai memory event record schema exposed by Claw Router. */
export interface AiMemoryEventRecord {
  /** Actor id field on ai memory event record. */
  actor_id?: string;
  /** Actor type field on ai memory event record. */
  actor_type?: string;
  /** After json field on ai memory event record. */
  after_json?: Record<string, JsonValue>;
  /** Before json field on ai memory event record. */
  before_json?: Record<string, JsonValue>;
  /** Conversation id field on ai memory event record. */
  conversation_id?: string;
  /** Created at field on ai memory event record. */
  created_at?: string;
  /** Decision reason field on ai memory event record. */
  decision_reason?: string;
  /** Event type field on ai memory event record. */
  event_type?: string;
  /** Id field on ai memory event record. */
  id?: string;
  /** Invocation id field on ai memory event record. */
  invocation_id?: string;
  /** Legal hold field on ai memory event record. */
  legal_hold?: boolean;
  /** Memory id field on ai memory event record. */
  memory_id?: string;
  /** Metadata field on ai memory event record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai memory event record. */
  organization_id?: string;
  /** Payload hash field on ai memory event record. */
  payload_hash?: string;
  /** Request id field on ai memory event record. */
  request_id?: string;
  /** Retention until field on ai memory event record. */
  retention_until?: string;
  /** Space id field on ai memory event record. */
  space_id?: string;
  /** Status field on ai memory event record. */
  status?: string;
  /** Tenant id field on ai memory event record. */
  tenant_id?: string;
  /** Trace id field on ai memory event record. */
  trace_id?: string;
  /** Turn id field on ai memory event record. */
  turn_id?: string;
  /** User id field on ai memory event record. */
  user_id?: string;
  /** Uuid field on ai memory event record. */
  uuid?: string;
}
