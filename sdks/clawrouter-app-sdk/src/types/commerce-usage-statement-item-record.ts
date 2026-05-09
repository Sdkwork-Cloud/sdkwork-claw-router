export interface CommerceUsageStatementItemRecord {
  asset_count?: string;
  breakdown_payload?: Record<string, unknown>;
  cost_amount?: string;
  created_at?: string;
  currency?: string;
  duration_seconds?: string;
  id?: string;
  item_type?: string;
  metadata?: Record<string, unknown>;
  modality?: string;
  model?: string;
  model_list?: Record<string, unknown>;
  organization_id?: string;
  provider_code?: string;
  rebuild_version?: string;
  request_count?: string;
  source_id?: string;
  source_type?: string;
  source_usage_fact_ids?: Record<string, unknown>;
  source_version?: string;
  statement_id?: string;
  status?: string;
  tenant_id?: string;
  token_count?: string;
  updated_at?: string;
  usage_text?: string;
  uuid?: string;
}
