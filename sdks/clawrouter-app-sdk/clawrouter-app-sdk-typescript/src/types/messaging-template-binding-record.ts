import type { JsonValue } from './json-value';

/** Messaging template binding record schema exposed by Claw Router. */
export interface MessagingTemplateBindingRecord {
  /** Created at field on messaging template binding record. */
  created_at?: string;
  /** Data scope field on messaging template binding record. */
  data_scope?: string;
  /** Deleted at field on messaging template binding record. */
  deleted_at?: string;
  /** Deleted by field on messaging template binding record. */
  deleted_by?: string;
  /** Id field on messaging template binding record. */
  id?: string;
  /** Last synced at field on messaging template binding record. */
  last_synced_at?: string;
  /** Metadata field on messaging template binding record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on messaging template binding record. */
  organization_id?: string;
  /** Provider template version field on messaging template binding record. */
  provider_template_version?: string;
  /** Rejection reason field on messaging template binding record. */
  rejection_reason?: string;
  /** Status field on messaging template binding record. */
  status?: string;
  /** Sync payload hash field on messaging template binding record. */
  sync_payload_hash?: string;
  /** Tenant id field on messaging template binding record. */
  tenant_id?: string;
  /** Updated at field on messaging template binding record. */
  updated_at?: string;
  /** Uuid field on messaging template binding record. */
  uuid?: string;
  /** Version field on messaging template binding record. */
  version?: string;
}
