export interface SystemInstallationStateRecord {
  catalog_version?: string;
  database_engine?: string;
  environment?: string;
  id?: string;
  installation_id?: string;
  installed_at?: string;
  last_checked_at?: string;
  metadata?: Record<string, unknown>;
  schema_version?: string;
  seed_profile?: string;
  status?: string;
  upgraded_at?: string;
}
