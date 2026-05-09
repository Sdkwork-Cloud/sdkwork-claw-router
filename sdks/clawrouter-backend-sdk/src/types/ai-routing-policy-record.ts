export interface AiRoutingPolicyRecord {
  capability?: string;
  cost_ceiling?: string;
  created_at?: string;
  currency?: string;
  data_scope?: string;
  default_profile_id?: string;
  deleted_at?: string;
  deleted_by?: string;
  fallback_mode?: string;
  id?: string;
  metadata?: Record<string, unknown>;
  name?: string;
  organization_id?: string;
  policy_code?: string;
  policy_scope?: string;
  slo_latency_ms?: number;
  slo_success_rate?: string;
  status?: string;
  subject_id?: string;
  tenant_id?: string;
  updated_at?: string;
  uuid?: string;
  version?: string;
}
