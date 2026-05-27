import type { JsonValue } from './json-value';

/** Studio app template record schema exposed by Claw Router. */
export interface StudioAppTemplateRecord {
  /** App config schema field on studio app template record. */
  app_config_schema?: Record<string, JsonValue>;
  /** Capability manifest field on studio app template record. */
  capability_manifest?: Record<string, JsonValue>;
  /** Category code field on studio app template record. */
  category_code?: string;
  /** Category id field on studio app template record. */
  category_id?: string;
  /** Cover url field on studio app template record. */
  cover_url?: string;
  /** Created at field on studio app template record. */
  created_at?: string;
  /** Current version id field on studio app template record. */
  current_version_id?: string;
  /** Data scope field on studio app template record. */
  data_scope?: string;
  /** Default app config field on studio app template record. */
  default_app_config?: Record<string, JsonValue>;
  /** Deleted at field on studio app template record. */
  deleted_at?: string;
  /** Deleted by field on studio app template record. */
  deleted_by?: string;
  /** Dependency manifest field on studio app template record. */
  dependency_manifest?: Record<string, JsonValue>;
  /** Deprecated at field on studio app template record. */
  deprecated_at?: string;
  /** Description field on studio app template record. */
  description?: string;
  /** Featured field on studio app template record. */
  featured?: boolean;
  /** Framework field on studio app template record. */
  framework?: string;
  /** Git ref field on studio app template record. */
  git_ref?: string;
  /** Git repo url field on studio app template record. */
  git_repo_url?: string;
  /** Git sub path field on studio app template record. */
  git_sub_path?: string;
  /** Icon url field on studio app template record. */
  icon_url?: string;
  /** Id field on studio app template record. */
  id?: string;
  /** Language field on studio app template record. */
  language?: string;
  /** Metadata field on studio app template record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on studio app template record. */
  organization_id?: string;
  /** Owner user id field on studio app template record. */
  owner_user_id?: string;
  /** Publish status field on studio app template record. */
  publish_status?: string;
  /** Published at field on studio app template record. */
  published_at?: string;
  /** Runtime field on studio app template record. */
  runtime?: string;
  /** Sort weight field on studio app template record. */
  sort_weight?: number;
  /** Source app id field on studio app template record. */
  source_app_id?: string;
  /** Status field on studio app template record. */
  status?: string;
  /** Template code field on studio app template record. */
  template_code?: string;
  /** Template name field on studio app template record. */
  template_name?: string;
  /** Template no field on studio app template record. */
  template_no?: string;
  /** Template type field on studio app template record. */
  template_type?: string;
  /** Tenant id field on studio app template record. */
  tenant_id?: string;
  /** Updated at field on studio app template record. */
  updated_at?: string;
  /** Uuid field on studio app template record. */
  uuid?: string;
  /** Variable schema field on studio app template record. */
  variable_schema?: Record<string, JsonValue>;
  /** Version field on studio app template record. */
  version?: string;
  /** Visibility field on studio app template record. */
  visibility?: string;
}
