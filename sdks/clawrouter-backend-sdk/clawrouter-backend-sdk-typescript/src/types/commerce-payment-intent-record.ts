/** Commerce payment intent record schema exposed by Claw Router. */
export interface CommercePaymentIntentRecord {
  /** Amount field on commerce payment intent record. */
  amount: string;
  /** Captured amount field on commerce payment intent record. */
  captured_amount: string;
  /** Created at field on commerce payment intent record. */
  created_at: string;
  /** Currency code field on commerce payment intent record. */
  currency_code: string;
  /** Id field on commerce payment intent record. */
  id?: string;
  /** Idempotency key field on commerce payment intent record. */
  idempotency_key: string;
  /** Merchant order no field on commerce payment intent record. */
  merchant_order_no: string;
  /** Metadata json field on commerce payment intent record. */
  metadata_json?: string;
  /** Next action json field on commerce payment intent record. */
  next_action_json?: string;
  /** Order id field on commerce payment intent record. */
  order_id: string;
  /** Organization id field on commerce payment intent record. */
  organization_id?: string;
  /** Owner user id field on commerce payment intent record. */
  owner_user_id: string;
  /** Payment method field on commerce payment intent record. */
  payment_method: string;
  /** Provider field on commerce payment intent record. */
  provider: string;
  /** Provider code field on commerce payment intent record. */
  provider_code: string;
  /** Provider native json field on commerce payment intent record. */
  provider_native_json?: string;
  /** Refunded amount field on commerce payment intent record. */
  refunded_amount: string;
  /** Request no field on commerce payment intent record. */
  request_no: string;
  /** Scene code field on commerce payment intent record. */
  scene_code: string;
  /** Status field on commerce payment intent record. */
  status: string;
  /** Subject field on commerce payment intent record. */
  subject: string;
  /** Tenant id field on commerce payment intent record. */
  tenant_id: string;
  /** Updated at field on commerce payment intent record. */
  updated_at: string;
}
