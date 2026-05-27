import type { JsonValue } from './json-value';

/** Messaging template version record schema exposed by Claw Router. */
export interface MessagingTemplateVersionRecord {
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
  /** Retired at field on messaging template version record. */
  retired_at?: string;
  /** Status field on messaging template version record. */
  status?: string;
  /** Subject template field on messaging template version record. */
  subject_template?: string;
  /** Tenant id field on messaging template version record. */
  tenant_id?: string;
  /** Text template field on messaging template version record. */
  text_template?: string;
  /** Updated at field on messaging template version record. */
  updated_at?: string;
  /** Uuid field on messaging template version record. */
  uuid?: string;
  /** Version field on messaging template version record. */
  version?: string;
}
