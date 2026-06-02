import type { JsonValue } from './json-value';

/** Messaging send request record schema exposed by Claw Router. */
export interface MessagingSendRequestRecord {
  /** Accepted at field on messaging send request record. */
  accepted_at?: string;
  /** App id field on messaging send request record. */
  app_id?: string;
  /** Channel field on messaging send request record. */
  channel?: string;
  /** Created at field on messaging send request record. */
  created_at?: string;
  /** Delivered at field on messaging send request record. */
  delivered_at?: string;
  /** Delivery purpose field on messaging send request record. */
  delivery_purpose?: string;
  /** Delivery status field on messaging send request record. */
  delivery_status?: string;
  /** Dry run field on messaging send request record. */
  dry_run?: boolean;
  /** Expires at field on messaging send request record. */
  expires_at?: string;
  /** Failed at field on messaging send request record. */
  failed_at?: string;
  /** Id field on messaging send request record. */
  id?: string;
  /** Idempotency key field on messaging send request record. */
  idempotency_key?: string;
  /** Legal hold field on messaging send request record. */
  legal_hold?: boolean;
  /** Metadata field on messaging send request record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on messaging send request record. */
  organization_id?: string;
  /** Payload hash field on messaging send request record. */
  payload_hash?: string;
  /** Render hash field on messaging send request record. */
  render_hash?: string;
  /** Request id field on messaging send request record. */
  request_id?: string;
  /** Request no field on messaging send request record. */
  request_no?: string;
  /** Request payload redacted field on messaging send request record. */
  request_payload_redacted?: Record<string, JsonValue>;
  /** Resolved provider account id field on messaging send request record. */
  resolved_provider_account_id?: string;
  /** Resolved route rule id field on messaging send request record. */
  resolved_route_rule_id?: string;
  /** Resolved sender identity id field on messaging send request record. */
  resolved_sender_identity_id?: string;
  /** Retention until field on messaging send request record. */
  retention_until?: string;
  /** Scene code field on messaging send request record. */
  scene_code?: string;
  /** Scheduled at field on messaging send request record. */
  scheduled_at?: string;
  /** Sent at field on messaging send request record. */
  sent_at?: string;
  /** Status field on messaging send request record. */
  status?: string;
  /** Target hash field on messaging send request record. */
  target_hash?: string;
  /** Target masked field on messaging send request record. */
  target_masked?: string;
  /** Target type field on messaging send request record. */
  target_type?: string;
  /** Template variant id field on messaging send request record. */
  template_variant_id?: string;
  /** Template version id field on messaging send request record. */
  template_version_id?: string;
  /** Tenant id field on messaging send request record. */
  tenant_id?: string;
  /** Trace id field on messaging send request record. */
  trace_id?: string;
  /** User id field on messaging send request record. */
  user_id?: string;
  /** Uuid field on messaging send request record. */
  uuid?: string;
}
