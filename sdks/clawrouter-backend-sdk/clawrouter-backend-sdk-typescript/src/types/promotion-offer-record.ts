/** Promotion offer record schema exposed by Claw Router. */
export interface PromotionOfferRecord {
  /** Audience scope field on promotion offer record. */
  audience_scope: string;
  /** Combinability field on promotion offer record. */
  combinability: string;
  /** Created at field on promotion offer record. */
  created_at: string;
  /** Created by field on promotion offer record. */
  created_by?: string;
  /** Current offer version id field on promotion offer record. */
  current_offer_version_id?: string;
  /** Description field on promotion offer record. */
  description?: string;
  /** Ends at field on promotion offer record. */
  ends_at?: string;
  /** Name field on promotion offer record. */
  name: string;
  /** Offer code field on promotion offer record. */
  offer_code: string;
  /** Offer no field on promotion offer record. */
  offer_no: string;
  /** Offer type field on promotion offer record. */
  offer_type: string;
  /** Organization id field on promotion offer record. */
  organization_id?: string;
  /** Starts at field on promotion offer record. */
  starts_at?: string;
  /** Status field on promotion offer record. */
  status: string;
  /** Tenant id field on promotion offer record. */
  tenant_id: string;
  /** Updated at field on promotion offer record. */
  updated_at: string;
  /** Updated by field on promotion offer record. */
  updated_by?: string;
}
