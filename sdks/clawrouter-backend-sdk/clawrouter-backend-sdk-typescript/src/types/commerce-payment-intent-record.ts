/** Commerce payment intent record schema exposed by Claw Router. */
export interface CommercePaymentIntentRecord {
  /** Amount field on commerce payment intent record. */
  amount: string;
  /** Created at field on commerce payment intent record. */
  created_at: string;
  /** Currency code field on commerce payment intent record. */
  currency_code: string;
  /** Idempotency key field on commerce payment intent record. */
  idempotency_key: string;
  /** Order id field on commerce payment intent record. */
  order_id: string;
  /** Organization id field on commerce payment intent record. */
  organization_id?: string;
  /** Owner user id field on commerce payment intent record. */
  owner_user_id: string;
  /** Provider field on commerce payment intent record. */
  provider: string;
  /** Request no field on commerce payment intent record. */
  request_no: string;
  /** Status field on commerce payment intent record. */
  status: string;
  /** Tenant id field on commerce payment intent record. */
  tenant_id: string;
  /** Updated at field on commerce payment intent record. */
  updated_at: string;
}
