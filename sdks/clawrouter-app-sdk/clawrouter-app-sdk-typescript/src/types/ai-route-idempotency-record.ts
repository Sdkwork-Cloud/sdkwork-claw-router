import type { JsonValue } from './json-value';

/** Ai route idempotency record schema exposed by Claw Router. */
export interface AiRouteIdempotencyRecord {
  /** Api key id field on ai route idempotency record. */
  api_key_id: string;
  /** Channel group id field on ai route idempotency record. */
  channel_group_id?: string;
  /** Channel id field on ai route idempotency record. */
  channel_id?: string;
  /** Created at field on ai route idempotency record. */
  created_at?: string;
  /** Data scope field on ai route idempotency record. */
  data_scope?: string;
  /** Deleted at field on ai route idempotency record. */
  deleted_at?: string;
  /** Deleted by field on ai route idempotency record. */
  deleted_by?: string;
  /** Endpoint id field on ai route idempotency record. */
  endpoint_id?: string;
  /** Expires at field on ai route idempotency record. */
  expires_at?: string;
  /** Id field on ai route idempotency record. */
  id?: string;
  /** Idempotency key field on ai route idempotency record. */
  idempotency_key: string;
  /** Metadata field on ai route idempotency record. */
  metadata?: Record<string, JsonValue>;
  /** Object id field on ai route idempotency record. */
  object_id?: string;
  /** Object type field on ai route idempotency record. */
  object_type?: string;
  /** Organization id field on ai route idempotency record. */
  organization_id: string;
  /** Request hash field on ai route idempotency record. */
  request_hash: string;
  /** Response status field on ai route idempotency record. */
  response_status?: number;
  /** Route strategy field on ai route idempotency record. */
  route_strategy?: string;
  /** Status field on ai route idempotency record. */
  status: string;
  /** Tenant id field on ai route idempotency record. */
  tenant_id: string;
  /** Updated at field on ai route idempotency record. */
  updated_at?: string;
  /** Uuid field on ai route idempotency record. */
  uuid: string;
  /** Version field on ai route idempotency record. */
  version?: string;
}
