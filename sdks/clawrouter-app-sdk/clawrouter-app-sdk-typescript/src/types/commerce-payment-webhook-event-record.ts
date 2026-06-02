/** Commerce payment webhook event record schema exposed by Claw Router. */
export interface CommercePaymentWebhookEventRecord {
  /** Created at field on commerce payment webhook event record. */
  created_at: string;
  /** Event id field on commerce payment webhook event record. */
  event_id: string;
  /** Id field on commerce payment webhook event record. */
  id?: string;
  /** Idempotency key field on commerce payment webhook event record. */
  idempotency_key: string;
  /** Message field on commerce payment webhook event record. */
  message?: string;
  /** Nonce field on commerce payment webhook event record. */
  nonce: string;
  /** Organization id field on commerce payment webhook event record. */
  organization_id?: string;
  /** Out trade no field on commerce payment webhook event record. */
  out_trade_no: string;
  /** Payload digest field on commerce payment webhook event record. */
  payload_digest: string;
  /** Processed at field on commerce payment webhook event record. */
  processed_at?: string;
  /** Provider field on commerce payment webhook event record. */
  provider: string;
  /** Request no field on commerce payment webhook event record. */
  request_no: string;
  /** Request timestamp field on commerce payment webhook event record. */
  request_timestamp?: string;
  /** Signature field on commerce payment webhook event record. */
  signature?: string;
  /** Status field on commerce payment webhook event record. */
  status: string;
  /** Tenant id field on commerce payment webhook event record. */
  tenant_id: string;
  /** Transaction id field on commerce payment webhook event record. */
  transaction_id?: string;
  /** Updated at field on commerce payment webhook event record. */
  updated_at: string;
}
