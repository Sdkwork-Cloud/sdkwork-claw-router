/** Promotion budget account record schema exposed by Claw Router. */
export interface PromotionBudgetAccountRecord {
  /** Budget no field on promotion budget account record. */
  budget_no: string;
  /** Budget type field on promotion budget account record. */
  budget_type: string;
  /** Created at field on promotion budget account record. */
  created_at: string;
  /** Created by field on promotion budget account record. */
  created_by?: string;
  /** Currency code field on promotion budget account record. */
  currency_code: string;
  /** Lock mode field on promotion budget account record. */
  lock_mode: string;
  /** Offer id field on promotion budget account record. */
  offer_id: string;
  /** Offer version id field on promotion budget account record. */
  offer_version_id?: string;
  /** Organization id field on promotion budget account record. */
  organization_id?: string;
  /** Overrun amount minor field on promotion budget account record. */
  overrun_amount_minor: string;
  /** Planned amount minor field on promotion budget account record. */
  planned_amount_minor: string;
  /** Status field on promotion budget account record. */
  status: string;
  /** Stock id field on promotion budget account record. */
  stock_id?: string;
  /** Tenant id field on promotion budget account record. */
  tenant_id: string;
  /** Updated at field on promotion budget account record. */
  updated_at: string;
  /** Updated by field on promotion budget account record. */
  updated_by?: string;
}
