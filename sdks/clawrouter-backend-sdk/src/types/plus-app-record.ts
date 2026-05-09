export interface PlusAppRecord {
  access_url?: string;
  app_type?: string;
  bundle_id?: string;
  description?: string;
  download_url?: string;
  icon?: Record<string, unknown>;
  icon_url?: string;
  install_config?: Record<string, unknown>;
  install_platforms?: Record<string, unknown>;
  install_skill?: Record<string, unknown>;
  package_name?: string;
  platforms?: Record<string, unknown>;
  project_id?: string;
  release_notes?: Record<string, unknown>;
  resource_list?: Record<string, unknown>;
  store_url?: string;
  user_id?: string;
  version?: string;
}
