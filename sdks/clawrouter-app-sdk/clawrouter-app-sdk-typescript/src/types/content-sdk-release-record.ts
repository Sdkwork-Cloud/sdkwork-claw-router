import type { JsonValue } from './json-value';

/** Content sdk release record schema exposed by Claw Router. */
export interface ContentSdkReleaseRecord {
  /** Api system field on content sdk release record. */
  api_system?: string;
  /** Artifact manifest field on content sdk release record. */
  artifact_manifest?: Record<string, JsonValue>;
  /** Created at field on content sdk release record. */
  created_at?: string;
  /** Data scope field on content sdk release record. */
  data_scope?: string;
  /** Default base url field on content sdk release record. */
  default_base_url?: string;
  /** Deleted at field on content sdk release record. */
  deleted_at?: string;
  /** Deleted by field on content sdk release record. */
  deleted_by?: string;
  /** Docs url field on content sdk release record. */
  docs_url?: string;
  /** Example code field on content sdk release record. */
  example_code?: string;
  /** Example manifest field on content sdk release record. */
  example_manifest?: Record<string, JsonValue>;
  /** Github url field on content sdk release record. */
  github_url?: string;
  /** Id field on content sdk release record. */
  id?: string;
  /** Import code field on content sdk release record. */
  import_code?: string;
  /** Init code field on content sdk release record. */
  init_code?: string;
  /** Install command field on content sdk release record. */
  install_command?: string;
  /** Language field on content sdk release record. */
  language?: string;
  /** Language description field on content sdk release record. */
  language_description?: string;
  /** Language icon field on content sdk release record. */
  language_icon?: string;
  /** Metadata field on content sdk release record. */
  metadata?: Record<string, JsonValue>;
  /** Openapi snapshot id field on content sdk release record. */
  openapi_snapshot_id?: string;
  /** Organization id field on content sdk release record. */
  organization_id?: string;
  /** Package manager field on content sdk release record. */
  package_manager?: string;
  /** Package name field on content sdk release record. */
  package_name?: string;
  /** Published at field on content sdk release record. */
  published_at?: string;
  /** Source repo field on content sdk release record. */
  source_repo?: string;
  /** Status field on content sdk release record. */
  status?: string;
  /** Tenant id field on content sdk release record. */
  tenant_id?: string;
  /** Updated at field on content sdk release record. */
  updated_at?: string;
  /** Uuid field on content sdk release record. */
  uuid?: string;
  /** Version field on content sdk release record. */
  version?: string;
}
