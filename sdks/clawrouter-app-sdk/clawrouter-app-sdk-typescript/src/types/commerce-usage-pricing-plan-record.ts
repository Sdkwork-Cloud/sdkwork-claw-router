import type { JsonValue } from './json-value';

/** Commerce usage pricing plan record schema exposed by Claw Router. */
export interface CommerceUsagePricingPlanRecord {
  /** Created at field on commerce usage pricing plan record. */
  created_at?: string;
  /** Data scope field on commerce usage pricing plan record. */
  data_scope?: string;
  /** Deleted at field on commerce usage pricing plan record. */
  deleted_at?: string;
  /** Deleted by field on commerce usage pricing plan record. */
  deleted_by?: string;
  /** Effective from field on commerce usage pricing plan record. */
  effective_from?: string;
  /** Effective to field on commerce usage pricing plan record. */
  effective_to?: string;
  /** Id field on commerce usage pricing plan record. */
  id?: string;
  /** Included quota field on commerce usage pricing plan record. */
  included_quota?: string;
  /** Metadata field on commerce usage pricing plan record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on commerce usage pricing plan record. */
  organization_id?: string;
  /** Overage pricing id field on commerce usage pricing plan record. */
  overage_pricing_id?: string;
  /** Plan code field on commerce usage pricing plan record. */
  plan_code?: string;
  /** Plan name field on commerce usage pricing plan record. */
  plan_name?: string;
  /** Pricing mode field on commerce usage pricing plan record. */
  pricing_mode?: string;
  /** Product id field on commerce usage pricing plan record. */
  product_id?: string;
  /** Rate multiplier field on commerce usage pricing plan record. */
  rate_multiplier?: string;
  /** Sku id field on commerce usage pricing plan record. */
  sku_id?: string;
  /** Status field on commerce usage pricing plan record. */
  status?: string;
  /** Tenant id field on commerce usage pricing plan record. */
  tenant_id?: string;
  /** Updated at field on commerce usage pricing plan record. */
  updated_at?: string;
  /** Uuid field on commerce usage pricing plan record. */
  uuid?: string;
  /** Version field on commerce usage pricing plan record. */
  version?: string;
  /** Vip level id field on commerce usage pricing plan record. */
  vip_level_id?: string;
}
