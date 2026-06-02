import type { JsonValue } from './json-value';

/** Messaging template variant record schema exposed by Claw Router. */
export interface MessagingTemplateVariantRecord {
  /** Body template field on messaging template variant record. */
  body_template?: string;
  /** Channel field on messaging template variant record. */
  channel?: string;
  /** Content format field on messaging template variant record. */
  content_format?: string;
  /** Created at field on messaging template variant record. */
  created_at?: string;
  /** Data scope field on messaging template variant record. */
  data_scope?: string;
  /** Deleted at field on messaging template variant record. */
  deleted_at?: string;
  /** Deleted by field on messaging template variant record. */
  deleted_by?: string;
  /** Id field on messaging template variant record. */
  id?: string;
  /** Length limit field on messaging template variant record. */
  length_limit?: number;
  /** Locale field on messaging template variant record. */
  locale?: string;
  /** Metadata field on messaging template variant record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on messaging template variant record. */
  organization_id?: string;
  /** Provider payload schema field on messaging template variant record. */
  provider_payload_schema?: Record<string, JsonValue>;
  /** Render options field on messaging template variant record. */
  render_options?: Record<string, JsonValue>;
  /** Status field on messaging template variant record. */
  status?: string;
  /** Template version id field on messaging template variant record. */
  template_version_id?: string;
  /** Tenant id field on messaging template variant record. */
  tenant_id?: string;
  /** Updated at field on messaging template variant record. */
  updated_at?: string;
  /** Uuid field on messaging template variant record. */
  uuid?: string;
  /** Version field on messaging template variant record. */
  version?: string;
}
