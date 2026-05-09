export interface CommerceUsagePricingPlanRecord {
  created_at?: string;
  data_scope?: string;
  deleted_at?: string;
  deleted_by?: string;
  effective_from?: string;
  effective_to?: string;
  id?: string;
  included_quota?: string;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  overage_pricing_id?: string;
  plan_code?: string;
  plan_name?: string;
  pricing_mode?: string;
  product_id?: string;
  rate_multiplier?: string;
  sku_id?: string;
  status?: string;
  tenant_id?: string;
  updated_at?: string;
  uuid?: string;
  version?: string;
  vip_level_id?: string;
}
