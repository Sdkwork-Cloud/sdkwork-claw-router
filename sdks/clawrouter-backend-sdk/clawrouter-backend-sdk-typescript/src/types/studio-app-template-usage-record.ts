import type { JsonValue } from './json-value';

/** Studio app template usage record schema exposed by Claw Router. */
export interface StudioAppTemplateUsageRecord {
  /** Created at field on studio app template usage record. */
  created_at?: string;
  /** Data scope field on studio app template usage record. */
  data_scope?: string;
  /** Deleted at field on studio app template usage record. */
  deleted_at?: string;
  /** Deleted by field on studio app template usage record. */
  deleted_by?: string;
  /** Id field on studio app template usage record. */
  id?: string;
  /** Input snapshot field on studio app template usage record. */
  input_snapshot?: Record<string, JsonValue>;
  /** Metadata field on studio app template usage record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on studio app template usage record. */
  organization_id?: string;
  /** Output snapshot field on studio app template usage record. */
  output_snapshot?: Record<string, JsonValue>;
  /** Request id field on studio app template usage record. */
  request_id?: string;
  /** Status field on studio app template usage record. */
  status?: string;
  /** Target app id field on studio app template usage record. */
  target_app_id?: string;
  /** Template id field on studio app template usage record. */
  template_id?: string;
  /** Template version id field on studio app template usage record. */
  template_version_id?: string;
  /** Tenant id field on studio app template usage record. */
  tenant_id?: string;
  /** Updated at field on studio app template usage record. */
  updated_at?: string;
  /** Usage type field on studio app template usage record. */
  usage_type?: string;
  /** User id field on studio app template usage record. */
  user_id?: string;
  /** Uuid field on studio app template usage record. */
  uuid?: string;
  /** Version field on studio app template usage record. */
  version?: string;
}
