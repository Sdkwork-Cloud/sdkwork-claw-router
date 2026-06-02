/** Commerce checkout session record schema exposed by Claw Router. */
export interface CommerceCheckoutSessionRecord {
  /** Checkout session no field on commerce checkout session record. */
  checkout_session_no: string;
  /** Created at field on commerce checkout session record. */
  created_at: string;
  /** Currency code field on commerce checkout session record. */
  currency_code: string;
  /** Expires at field on commerce checkout session record. */
  expires_at: string;
  /** Id field on commerce checkout session record. */
  id?: string;
  /** Idempotency key field on commerce checkout session record. */
  idempotency_key: string;
  /** Organization id field on commerce checkout session record. */
  organization_id?: string;
  /** Owner user id field on commerce checkout session record. */
  owner_user_id: string;
  /** Request hash field on commerce checkout session record. */
  request_hash: string;
  /** Source id field on commerce checkout session record. */
  source_id?: string;
  /** Source type field on commerce checkout session record. */
  source_type: string;
  /** Status field on commerce checkout session record. */
  status: string;
  /** Tenant id field on commerce checkout session record. */
  tenant_id: string;
  /** Updated at field on commerce checkout session record. */
  updated_at: string;
}
