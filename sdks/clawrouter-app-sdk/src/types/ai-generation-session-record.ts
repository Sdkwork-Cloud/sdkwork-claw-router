export interface AiGenerationSessionRecord {
  active_modality?: string;
  created_at?: string;
  data_scope?: string;
  deleted_at?: string;
  deleted_by?: string;
  filter_config?: Record<string, unknown>;
  id?: string;
  last_opened_at?: string;
  last_prompt?: string;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  owner_id?: string;
  owner_type?: string;
  selected_models?: Record<string, unknown>;
  session_code?: string;
  status?: string;
  tenant_id?: string;
  title?: string;
  updated_at?: string;
  user_id?: string;
  uuid?: string;
  version?: string;
}
