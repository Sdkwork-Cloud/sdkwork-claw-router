import type { JsonValue } from './json-value';

/** Messaging template variant record schema exposed by Claw Router. */
export interface MessagingTemplateVariantRecord {
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
  /** Metadata field on messaging template variant record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on messaging template variant record. */
  organization_id?: string;
  /** Status field on messaging template variant record. */
  status?: string;
  /** Tenant id field on messaging template variant record. */
  tenant_id?: string;
  /** Updated at field on messaging template variant record. */
  updated_at?: string;
  /** Uuid field on messaging template variant record. */
  uuid?: string;
  /** Version field on messaging template variant record. */
  version?: string;
}
