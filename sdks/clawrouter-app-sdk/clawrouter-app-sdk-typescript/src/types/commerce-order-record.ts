/** Commerce order record schema exposed by Claw Router. */
export interface CommerceOrderRecord {
  /** Cancelled at field on commerce order record. */
  cancelled_at?: string;
  /** Created at field on commerce order record. */
  created_at: string;
  /** Currency code field on commerce order record. */
  currency_code: string;
  /** Expired at field on commerce order record. */
  expired_at?: string;
  /** Id field on commerce order record. */
  id?: string;
  /** Idempotency key field on commerce order record. */
  idempotency_key: string;
  /** Order no field on commerce order record. */
  order_no: string;
  /** Organization id field on commerce order record. */
  organization_id?: string;
  /** Owner user id field on commerce order record. */
  owner_user_id: string;
  /** Paid at field on commerce order record. */
  paid_at?: string;
  /** Request no field on commerce order record. */
  request_no: string;
  /** Status field on commerce order record. */
  status: string;
  /** Subject field on commerce order record. */
  subject: string;
  /** Tenant id field on commerce order record. */
  tenant_id: string;
  /** Updated at field on commerce order record. */
  updated_at: string;
}
