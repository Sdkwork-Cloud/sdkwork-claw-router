import type { JsonValue } from './json-value';

/** Commerce payment webhook delivery record schema exposed by Claw Router. */
export interface CommercePaymentWebhookDeliveryRecord {
  /** Created at field on commerce payment webhook delivery record. */
  created_at: string;
  /** Delivery no field on commerce payment webhook delivery record. */
  delivery_no: string;
  /** Delivery status field on commerce payment webhook delivery record. */
  delivery_status: string;
  /** Event id field on commerce payment webhook delivery record. */
  event_id: string;
  /** Failure code field on commerce payment webhook delivery record. */
  failure_code?: string;
  /** Failure message field on commerce payment webhook delivery record. */
  failure_message?: string;
  /** Headers json field on commerce payment webhook delivery record. */
  headers_json?: Record<string, JsonValue>;
  /** Nonce field on commerce payment webhook delivery record. */
  nonce: string;
  /** Normalized event id field on commerce payment webhook delivery record. */
  normalized_event_id?: string;
  /** Organization id field on commerce payment webhook delivery record. */
  organization_id?: string;
  /** Payload digest field on commerce payment webhook delivery record. */
  payload_digest: string;
  /** Payload ref field on commerce payment webhook delivery record. */
  payload_ref?: string;
  /** Processed at field on commerce payment webhook delivery record. */
  processed_at?: string;
  /** Provider account id field on commerce payment webhook delivery record. */
  provider_account_id?: string;
  /** Provider code field on commerce payment webhook delivery record. */
  provider_code: string;
  /** Received at field on commerce payment webhook delivery record. */
  received_at: string;
  /** Request timestamp field on commerce payment webhook delivery record. */
  request_timestamp?: string;
  /** Signature field on commerce payment webhook delivery record. */
  signature?: string;
  /** Signature algorithm field on commerce payment webhook delivery record. */
  signature_algorithm?: string;
  /** Source ip field on commerce payment webhook delivery record. */
  source_ip?: string;
  /** Tenant id field on commerce payment webhook delivery record. */
  tenant_id: string;
  /** Updated at field on commerce payment webhook delivery record. */
  updated_at: string;
  /** User agent field on commerce payment webhook delivery record. */
  user_agent?: string;
  /** Verification status field on commerce payment webhook delivery record. */
  verification_status: string;
  /** Verified at field on commerce payment webhook delivery record. */
  verified_at?: string;
}
