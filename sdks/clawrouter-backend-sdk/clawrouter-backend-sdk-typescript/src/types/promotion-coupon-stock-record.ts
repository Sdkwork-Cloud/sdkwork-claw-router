/** Promotion coupon stock record schema exposed by Claw Router. */
export interface PromotionCouponStockRecord {
  /** Activation status field on promotion coupon stock record. */
  activation_status: string;
  /** Budget account id field on promotion coupon stock record. */
  budget_account_id?: string;
  /** Budget stop threshold bps field on promotion coupon stock record. */
  budget_stop_threshold_bps?: number;
  /** Budget warning threshold bps field on promotion coupon stock record. */
  budget_warning_threshold_bps?: number;
  /** Can resend field on promotion coupon stock record. */
  can_resend: boolean;
  /** Cancel until field on promotion coupon stock record. */
  cancel_until?: string;
  /** Code mode field on promotion coupon stock record. */
  code_mode: string;
  /** Code prefix field on promotion coupon stock record. */
  code_prefix?: string;
  /** Created at field on promotion coupon stock record. */
  created_at: string;
  /** Created by field on promotion coupon stock record. */
  created_by?: string;
  /** Currency code field on promotion coupon stock record. */
  currency_code: string;
  /** Expires at field on promotion coupon stock record. */
  expires_at?: string;
  /** Issue channel field on promotion coupon stock record. */
  issue_channel: string;
  /** Max claims per natural person field on promotion coupon stock record. */
  max_claims_per_natural_person?: number;
  /** Max claims per subject field on promotion coupon stock record. */
  max_claims_per_subject?: number;
  /** Name field on promotion coupon stock record. */
  name: string;
  /** Offer id field on promotion coupon stock record. */
  offer_id: string;
  /** Offer version id field on promotion coupon stock record. */
  offer_version_id: string;
  /** Organization id field on promotion coupon stock record. */
  organization_id?: string;
  /** Overspend policy field on promotion coupon stock record. */
  overspend_policy: string;
  /** Per subject limit field on promotion coupon stock record. */
  per_subject_limit?: string;
  /** Starts at field on promotion coupon stock record. */
  starts_at?: string;
  /** Status field on promotion coupon stock record. */
  status: string;
  /** Stock creator merchant id field on promotion coupon stock record. */
  stock_creator_merchant_id?: string;
  /** Stock no field on promotion coupon stock record. */
  stock_no: string;
  /** Stock type field on promotion coupon stock record. */
  stock_type: string;
  /** Tenant id field on promotion coupon stock record. */
  tenant_id: string;
  /** Title field on promotion coupon stock record. */
  title: string;
  /** Total quantity field on promotion coupon stock record. */
  total_quantity?: string;
  /** Updated at field on promotion coupon stock record. */
  updated_at: string;
  /** Updated by field on promotion coupon stock record. */
  updated_by?: string;
}
