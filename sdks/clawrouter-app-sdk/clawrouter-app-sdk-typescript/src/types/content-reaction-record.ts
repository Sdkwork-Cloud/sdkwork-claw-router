import type { JsonValue } from './json-value';

/** Content reaction record schema exposed by Claw Router. */
export interface ContentReactionRecord {
  /** Cancelled at field on content reaction record. */
  cancelled_at?: string;
  /** Client ip hash field on content reaction record. */
  client_ip_hash?: string;
  /** Created at field on content reaction record. */
  created_at?: string;
  /** Id field on content reaction record. */
  id?: string;
  /** Legal hold field on content reaction record. */
  legal_hold?: boolean;
  /** Metadata field on content reaction record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on content reaction record. */
  organization_id?: string;
  /** Payload hash field on content reaction record. */
  payload_hash?: string;
  /** Reaction type field on content reaction record. */
  reaction_type?: string;
  /** Reaction value field on content reaction record. */
  reaction_value?: string;
  /** Request id field on content reaction record. */
  request_id?: string;
  /** Retention until field on content reaction record. */
  retention_until?: string;
  /** Status field on content reaction record. */
  status?: string;
  /** Target id field on content reaction record. */
  target_id?: string;
  /** Target type field on content reaction record. */
  target_type?: string;
  /** Tenant id field on content reaction record. */
  tenant_id?: string;
  /** Trace id field on content reaction record. */
  trace_id?: string;
  /** User agent hash field on content reaction record. */
  user_agent_hash?: string;
  /** User id field on content reaction record. */
  user_id?: string;
  /** Uuid field on content reaction record. */
  uuid?: string;
}
