/** Commerce payment method record schema exposed by Claw Router. */
export interface CommercePaymentMethodRecord {
  /** Created at field on commerce payment method record. */
  created_at: string;
  /** Display name field on commerce payment method record. */
  display_name: string;
  /** Id field on commerce payment method record. */
  id?: string;
  /** Idempotency key field on commerce payment method record. */
  idempotency_key: string;
  /** Method key field on commerce payment method record. */
  method_key: string;
  /** Organization id field on commerce payment method record. */
  organization_id?: string;
  /** Provider field on commerce payment method record. */
  provider: string;
  /** Request no field on commerce payment method record. */
  request_no: string;
  /** Sort weight field on commerce payment method record. */
  sort_weight: string;
  /** Status field on commerce payment method record. */
  status: string;
  /** Tenant id field on commerce payment method record. */
  tenant_id: string;
  /** Updated at field on commerce payment method record. */
  updated_at: string;
}
