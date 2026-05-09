export interface AiModelVendorRecord {
  capabilities?: Record<string, unknown>;
  color_token?: string;
  country_region?: string;
  created_at?: string;
  data_scope?: string;
  deleted_at?: string;
  deleted_by?: string;
  description?: string;
  display_name: string;
  docs_url?: string;
  icon_url?: string;
  id?: string;
  legal_name?: string;
  logo_url?: string;
  metadata?: Record<string, unknown>;
  model_families?: Record<string, unknown>;
  open_source?: boolean;
  organization_id: string;
  sort_order?: number;
  status: string;
  tenant_id: string;
  updated_at?: string;
  uuid: string;
  vendor_code: string;
  vendor_type?: string;
  version?: string;
  website_url?: string;
}
