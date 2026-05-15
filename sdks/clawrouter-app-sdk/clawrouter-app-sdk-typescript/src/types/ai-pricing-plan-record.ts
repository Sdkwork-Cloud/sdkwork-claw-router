import type { JsonValue } from './json-value';

/** Ai pricing plan record schema exposed by Claw Router. */
export interface AiPricingPlanRecord {
  /** Base price side field on ai pricing plan record. */
  base_price_side: string;
  /** Base pricing scope field on ai pricing plan record. */
  base_pricing_scope?: string;
  /** Billing mode field on ai pricing plan record. */
  billing_mode?: string;
  /** Created at field on ai pricing plan record. */
  created_at?: string;
  /** Currency field on ai pricing plan record. */
  currency: string;
  /** Data scope field on ai pricing plan record. */
  data_scope?: string;
  /** Default markup amount field on ai pricing plan record. */
  default_markup_amount?: string;
  /** Default multiplier field on ai pricing plan record. */
  default_multiplier?: string;
  /** Default reference price id field on ai pricing plan record. */
  default_reference_price_id?: string;
  /** Deleted at field on ai pricing plan record. */
  deleted_at?: string;
  /** Deleted by field on ai pricing plan record. */
  deleted_by?: string;
  /** Description field on ai pricing plan record. */
  description?: string;
  /** Effective from field on ai pricing plan record. */
  effective_from: string;
  /** Effective to field on ai pricing plan record. */
  effective_to?: string;
  /** Fallback mode field on ai pricing plan record. */
  fallback_mode?: string;
  /** Id field on ai pricing plan record. */
  id?: string;
  /** Metadata field on ai pricing plan record. */
  metadata?: Record<string, JsonValue>;
  /** Min charge amount field on ai pricing plan record. */
  min_charge_amount?: string;
  /** Organization id field on ai pricing plan record. */
  organization_id: string;
  /** Plan code field on ai pricing plan record. */
  plan_code: string;
  /** Plan name field on ai pricing plan record. */
  plan_name: string;
  /** Plan scope field on ai pricing plan record. */
  plan_scope?: string;
  /** Price version field on ai pricing plan record. */
  price_version?: string;
  /** Priority field on ai pricing plan record. */
  priority?: number;
  /** Rounding mode field on ai pricing plan record. */
  rounding_mode?: string;
  /** Status field on ai pricing plan record. */
  status: string;
  /** Tenant id field on ai pricing plan record. */
  tenant_id: string;
  /** Updated at field on ai pricing plan record. */
  updated_at?: string;
  /** Uuid field on ai pricing plan record. */
  uuid: string;
  /** Version field on ai pricing plan record. */
  version?: string;
}
