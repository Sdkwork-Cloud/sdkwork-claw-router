import type { JsonValue } from './json-value';

/** Promotion discount application record schema exposed by Claw Router. */
export interface PromotionDiscountApplicationRecord {
  /** Application no field on promotion discount application record. */
  application_no: string;
  /** Applied at field on promotion discount application record. */
  applied_at?: string;
  /** Budget account id field on promotion discount application record. */
  budget_account_id?: string;
  /** Created at field on promotion discount application record. */
  created_at: string;
  /** Currency code field on promotion discount application record. */
  currency_code: string;
  /** Discount amount minor field on promotion discount application record. */
  discount_amount_minor: string;
  /** Failure code field on promotion discount application record. */
  failure_code?: string;
  /** Failure message field on promotion discount application record. */
  failure_message?: string;
  /** Id field on promotion discount application record. */
  id?: string;
  /** Idempotency key field on promotion discount application record. */
  idempotency_key: string;
  /** Offer id field on promotion discount application record. */
  offer_id: string;
  /** Offer version id field on promotion discount application record. */
  offer_version_id: string;
  /** Order id field on promotion discount application record. */
  order_id: string;
  /** Order no field on promotion discount application record. */
  order_no?: string;
  /** Organization id field on promotion discount application record. */
  organization_id?: string;
  /** Payment id field on promotion discount application record. */
  payment_id?: string;
  /** Released at field on promotion discount application record. */
  released_at?: string;
  /** Request no field on promotion discount application record. */
  request_no: string;
  /** Reservation expires at field on promotion discount application record. */
  reservation_expires_at?: string;
  /** Reserved at field on promotion discount application record. */
  reserved_at?: string;
  /** Rolled back at field on promotion discount application record. */
  rolled_back_at?: string;
  /** Rule snapshot json field on promotion discount application record. */
  rule_snapshot_json?: Record<string, JsonValue>;
  /** Settled at field on promotion discount application record. */
  settled_at?: string;
  /** Status field on promotion discount application record. */
  status: string;
  /** Stock id field on promotion discount application record. */
  stock_id?: string;
  /** Subject id field on promotion discount application record. */
  subject_id: string;
  /** Subject type field on promotion discount application record. */
  subject_type: string;
  /** Tenant id field on promotion discount application record. */
  tenant_id: string;
  /** Updated at field on promotion discount application record. */
  updated_at: string;
  /** User coupon id field on promotion discount application record. */
  user_coupon_id?: string;
}
