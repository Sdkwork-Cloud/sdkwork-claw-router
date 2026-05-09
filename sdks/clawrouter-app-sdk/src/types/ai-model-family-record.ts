export interface AiModelFamilyRecord {
  color_token?: string;
  created_at?: string;
  data_scope?: string;
  default_model?: string;
  default_model_id?: string;
  deleted_at?: string;
  deleted_by?: string;
  description?: string;
  display_name: string;
  docs_url?: string;
  family_code: string;
  family_type?: string;
  icon_url?: string;
  id?: string;
  metadata?: Record<string, unknown>;
  model_count?: string;
  organization_id: string;
  primary_modality?: string;
  region_code: string;
  sort_order?: number;
  status: string;
  tenant_id: string;
  updated_at?: string;
  uuid: string;
  vendor_code: string;
  vendor_id?: string;
  version?: string;
}
