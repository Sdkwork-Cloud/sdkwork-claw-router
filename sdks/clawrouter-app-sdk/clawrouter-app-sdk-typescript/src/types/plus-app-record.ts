import type { JsonValue } from './json-value';
import type { MediaResource } from './media-resource';

/** Plus app record schema exposed by Claw Router. */
export interface PlusAppRecord {
  /** Access url field on plus app record. */
  access_url?: string;
  /** App type field on plus app record. */
  app_type?: string;
  /** Artifact field on plus app record. */
  artifact?: MediaResource;
  /** Bundle id field on plus app record. */
  bundle_id?: string;
  /** Config field on plus app record. */
  config?: Record<string, JsonValue>;
  /** Created at field on plus app record. */
  created_at?: string;
  /** Data scope field on plus app record. */
  data_scope?: number;
  /** Description field on plus app record. */
  description?: string;
  /** Icon field on plus app record. */
  icon?: MediaResource;
  /** Id field on plus app record. */
  id?: string;
  /** Install config field on plus app record. */
  install_config?: Record<string, JsonValue>;
  /** Install platforms field on plus app record. */
  install_platforms?: Record<string, JsonValue>;
  /** Install skill field on plus app record. */
  install_skill?: Record<string, JsonValue>;
  /** Name field on plus app record. */
  name?: string;
  /** Organization id field on plus app record. */
  organization_id?: string;
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
  /** Status field on plus app record. */
  status?: number;
  /** Store url field on plus app record. */
  store_url?: string;
  /** Tenant id field on plus app record. */
  tenant_id?: string;
  /** Updated at field on plus app record. */
  updated_at?: string;
  /** User id field on plus app record. */
  user_id?: string;
  /** Uuid field on plus app record. */
  uuid?: string;
  /** V field on plus app record. */
  v?: string;
  /** Version field on plus app record. */
  version?: string;
}
