export interface AiRoutingRuleRecord {
  candidate_channels?: Record<string, unknown>;
  constraints?: Record<string, unknown>;
  created_at?: string;
  data_scope?: string;
  deleted_at?: string;
  deleted_by?: string;
  effective_from?: string;
  effective_to?: string;
  fallback_chain?: Record<string, unknown>;
  id?: string;
  match_expression?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  priority?: number;
  profile_id?: string;
  rate_limit_policy_id?: string;
  rule_code?: string;
  status?: string;
  target_model?: string;
  tenant_id?: string;
  updated_at?: string;
  uuid?: string;
  version?: string;
}
