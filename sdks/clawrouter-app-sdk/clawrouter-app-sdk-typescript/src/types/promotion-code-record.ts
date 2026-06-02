/** Promotion code record schema exposed by Claw Router. */
export interface PromotionCodeRecord {
  /** Activated at field on promotion code record. */
  activated_at?: string;
  /** Activation status field on promotion code record. */
  activation_status: string;
  /** Can resend field on promotion code record. */
  can_resend: boolean;
  /** Cancel until field on promotion code record. */
  cancel_until?: string;
  /** Canceled at field on promotion code record. */
  canceled_at?: string;
  /** Channel code field on promotion code record. */
  channel_code?: string;
  /** Claim code hash field on promotion code record. */
  claim_code_hash?: string;
  /** Claim code suffix field on promotion code record. */
  claim_code_suffix?: string;
  /** Claimed quantity field on promotion code record. */
  claimed_quantity: string;
  /** Code no field on promotion code record. */
  code_no: string;
  /** Code type field on promotion code record. */
  code_type: string;
  /** Created at field on promotion code record. */
  created_at: string;
  /** Created by field on promotion code record. */
  created_by?: string;
  /** Currency code field on promotion code record. */
  currency_code: string;
  /** Expires at field on promotion code record. */
  expires_at?: string;
  /** Id field on promotion code record. */
  id?: string;
  /** Max claims field on promotion code record. */
  max_claims: string;
  /** Offer id field on promotion code record. */
  offer_id: string;
  /** Offer version id field on promotion code record. */
  offer_version_id: string;
  /** Organization id field on promotion code record. */
  organization_id?: string;
  /** Promotion code hash field on promotion code record. */
  promotion_code_hash: string;
  /** Promotion code last 4 field on promotion code record. */
  promotion_code_last4?: string;
  /** Starts at field on promotion code record. */
  starts_at?: string;
  /** Status field on promotion code record. */
  status: string;
  /** Stock id field on promotion code record. */
  stock_id: string;
  /** Tenant id field on promotion code record. */
  tenant_id: string;
  /** Updated at field on promotion code record. */
  updated_at: string;
  /** Updated by field on promotion code record. */
  updated_by?: string;
}
