import type { JsonValue } from './json-value';

/** Messaging template version record schema exposed by Claw Router. */
export interface MessagingTemplateVersionRecord {
  /** Content hash field on messaging template version record. */
  content_hash?: string;
  /** Created at field on messaging template version record. */
  created_at?: string;
  /** Data scope field on messaging template version record. */
  data_scope?: string;
  /** Deleted at field on messaging template version record. */
  deleted_at?: string;
  /** Deleted by field on messaging template version record. */
  deleted_by?: string;
  /** Html template field on messaging template version record. */
  html_template?: string;
  /** Id field on messaging template version record. */
  id?: string;
  /** Metadata field on messaging template version record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on messaging template version record. */
  organization_id?: string;
  /** Published at field on messaging template version record. */
  published_at?: string;
  /** Render engine field on messaging template version record. */
  render_engine?: string;
  /** Retired at field on messaging template version record. */
  retired_at?: string;
  /** Review status field on messaging template version record. */
  review_status?: string;
  /** Status field on messaging template version record. */
  status?: string;
  /** Subject template field on messaging template version record. */
  subject_template?: string;
  /** Template id field on messaging template version record. */
  template_id?: string;
  /** Tenant id field on messaging template version record. */
  tenant_id?: string;
  /** Text template field on messaging template version record. */
  text_template?: string;
  /** Updated at field on messaging template version record. */
  updated_at?: string;
  /** Uuid field on messaging template version record. */
  uuid?: string;
  /** Variable schema field on messaging template version record. */
  variable_schema?: Record<string, JsonValue>;
  /** Version field on messaging template version record. */
  version?: string;
  /** Version no field on messaging template version record. */
  version_no?: number;
}
