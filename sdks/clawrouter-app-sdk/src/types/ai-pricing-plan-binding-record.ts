export interface AiPricingPlanBindingRecord {
  binding_source?: string;
  created_at?: string;
  data_scope?: string;
  deleted_at?: string;
  deleted_by?: string;
  effective_from: string;
  effective_to?: string;
  id?: string;
  metadata?: Record<string, unknown>;
  multiplier_override?: string;
  organization_id: string;
  pricing_plan_code?: string;
  pricing_plan_id: string;
  priority: number;
  quota_policy_id?: string;
  rpm_override?: string;
  status: string;
  subject_code?: string;
  subject_id?: string;
  subject_type: string;
  tenant_id: string;
  tpm_override?: string;
  updated_at?: string;
  uuid: string;
  version?: string;
}
