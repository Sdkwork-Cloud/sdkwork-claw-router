export interface IntegrationChannelModelRecord {
  capability?: string;
  catalog_key?: string;
  channel_id?: string;
  created_at?: string;
  data_scope?: string;
  default_parameters?: Record<string, unknown>;
  deleted_at?: string;
  deleted_by?: string;
  effective_from?: string;
  effective_to?: string;
  id?: string;
  max_input_tokens?: string;
  max_output_tokens?: string;
  metadata?: Record<string, unknown>;
  model?: string;
  model_aliases?: Record<string, unknown>;
  model_id?: string;
  organization_id?: string;
  provider_model?: string;
  status?: string;
  supports_streaming?: boolean;
  supports_tools?: boolean;
  tenant_id?: string;
  updated_at?: string;
  uuid?: string;
  vendor_code?: string;
  version?: string;
}
