import type { JsonValue } from './json-value';

/** Studio app template version record schema exposed by Claw Router. */
export interface StudioAppTemplateVersionRecord {
  /** App config schema field on studio app template version record. */
  app_config_schema?: Record<string, JsonValue>;
  /** Artifact id field on studio app template version record. */
  artifact_id?: string;
  /** Capability manifest field on studio app template version record. */
  capability_manifest?: Record<string, JsonValue>;
  /** Changelog field on studio app template version record. */
  changelog?: string;
  /** Created at field on studio app template version record. */
  created_at?: string;
  /** Data scope field on studio app template version record. */
  data_scope?: string;
  /** Default app config field on studio app template version record. */
  default_app_config?: Record<string, JsonValue>;
  /** Deleted at field on studio app template version record. */
  deleted_at?: string;
  /** Deleted by field on studio app template version record. */
  deleted_by?: string;
  /** Dependency manifest field on studio app template version record. */
  dependency_manifest?: Record<string, JsonValue>;
  /** Deprecated at field on studio app template version record. */
  deprecated_at?: string;
  /** File manifest field on studio app template version record. */
  file_manifest?: Record<string, JsonValue>;
  /** Id field on studio app template version record. */
  id?: string;
  /** Metadata field on studio app template version record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on studio app template version record. */
  organization_id?: string;
  /** Publish status field on studio app template version record. */
  publish_status?: string;
  /** Published at field on studio app template version record. */
  published_at?: string;
  /** Status field on studio app template version record. */
  status?: string;
  /** Template id field on studio app template version record. */
  template_id?: string;
  /** Tenant id field on studio app template version record. */
  tenant_id?: string;
  /** Updated at field on studio app template version record. */
  updated_at?: string;
  /** Uuid field on studio app template version record. */
  uuid?: string;
  /** Variable schema field on studio app template version record. */
  variable_schema?: Record<string, JsonValue>;
  /** Version field on studio app template version record. */
  version?: string;
  /** Version no field on studio app template version record. */
  version_no?: string;
}
