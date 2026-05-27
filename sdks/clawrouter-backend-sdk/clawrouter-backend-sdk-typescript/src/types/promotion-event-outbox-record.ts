import type { JsonValue } from './json-value';

/** Promotion event outbox record schema exposed by Claw Router. */
export interface PromotionEventOutboxRecord {
  /** Aggregate id field on promotion event outbox record. */
  aggregate_id: string;
  /** Aggregate type field on promotion event outbox record. */
  aggregate_type: string;
  /** Created at field on promotion event outbox record. */
  created_at: string;
  /** Event no field on promotion event outbox record. */
  event_no: string;
  /** Event type field on promotion event outbox record. */
  event_type: string;
  /** Event version field on promotion event outbox record. */
  event_version: number;
  /** Next retry at field on promotion event outbox record. */
  next_retry_at?: string;
  /** Occurred at field on promotion event outbox record. */
  occurred_at: string;
  /** Organization id field on promotion event outbox record. */
  organization_id?: string;
  /** Payload hash field on promotion event outbox record. */
  payload_hash?: string;
  /** Payload json field on promotion event outbox record. */
  payload_json: Record<string, JsonValue>;
  /** Published at field on promotion event outbox record. */
  published_at?: string;
  /** Status field on promotion event outbox record. */
  status: string;
  /** Tenant id field on promotion event outbox record. */
  tenant_id: string;
}
