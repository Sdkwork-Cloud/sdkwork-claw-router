/** Commerce payment attempt record schema exposed by Claw Router. */
export interface CommercePaymentAttemptRecord {
  /** Amount field on commerce payment attempt record. */
  amount: string;
  /** Callback payload field on commerce payment attempt record. */
  callback_payload?: string;
  /** Created at field on commerce payment attempt record. */
  created_at: string;
  /** Currency code field on commerce payment attempt record. */
  currency_code: string;
  /** Order id field on commerce payment attempt record. */
  order_id: string;
  /** Organization id field on commerce payment attempt record. */
  organization_id?: string;
  /** Out trade no field on commerce payment attempt record. */
  out_trade_no: string;
  /** Owner user id field on commerce payment attempt record. */
  owner_user_id: string;
  /** Paid at field on commerce payment attempt record. */
  paid_at?: string;
  /** Payment intent id field on commerce payment attempt record. */
  payment_intent_id: string;
  /** Provider field on commerce payment attempt record. */
  provider: string;
  /** Status field on commerce payment attempt record. */
  status: string;
  /** Tenant id field on commerce payment attempt record. */
  tenant_id: string;
  /** Updated at field on commerce payment attempt record. */
  updated_at: string;
}
