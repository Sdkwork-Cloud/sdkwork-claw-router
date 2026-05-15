import type { JsonValue } from './json-value';

/** Plus app record schema exposed by Claw Router. */
export interface PlusAppRecord {
  /** Access url field on plus app record. */
  access_url?: string;
  /** App type field on plus app record. */
  app_type?: string;
  /** Bundle id field on plus app record. */
  bundle_id?: string;
  /** Description field on plus app record. */
  description?: string;
  /** Download url field on plus app record. */
  download_url?: string;
  /** Icon field on plus app record. */
  icon?: Record<string, JsonValue>;
  /** Icon url field on plus app record. */
  icon_url?: string;
  /** Install config field on plus app record. */
  install_config?: Record<string, JsonValue>;
  /** Install platforms field on plus app record. */
  install_platforms?: Record<string, JsonValue>;
  /** Install skill field on plus app record. */
  install_skill?: Record<string, JsonValue>;
  /** Package name field on plus app record. */
  package_name?: string;
  /** Platforms field on plus app record. */
  platforms?: Record<string, JsonValue>;
  /** Project id field on plus app record. */
  project_id?: string;
  /** Release notes field on plus app record. */
  release_notes?: Record<string, JsonValue>;
  /** Resource list field on plus app record. */
  resource_list?: Record<string, JsonValue>;
  /** Store url field on plus app record. */
  store_url?: string;
  /** User id field on plus app record. */
  user_id?: string;
  /** Version field on plus app record. */
  version?: string;
}
