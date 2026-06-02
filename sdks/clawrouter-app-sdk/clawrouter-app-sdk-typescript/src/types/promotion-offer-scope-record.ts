/** Promotion offer scope record schema exposed by Claw Router. */
export interface PromotionOfferScopeRecord {
  /** Created at field on promotion offer scope record. */
  created_at: string;
  /** Id field on promotion offer scope record. */
  id?: string;
  /** Match mode field on promotion offer scope record. */
  match_mode: string;
  /** Offer version id field on promotion offer scope record. */
  offer_version_id: string;
  /** Organization id field on promotion offer scope record. */
  organization_id?: string;
  /** Priority field on promotion offer scope record. */
  priority: number;
  /** Scope type field on promotion offer scope record. */
  scope_type: string;
  /** Target code field on promotion offer scope record. */
  target_code?: string;
  /** Target id field on promotion offer scope record. */
  target_id?: string;
  /** Tenant id field on promotion offer scope record. */
  tenant_id: string;
  /** Updated at field on promotion offer scope record. */
  updated_at: string;
}
