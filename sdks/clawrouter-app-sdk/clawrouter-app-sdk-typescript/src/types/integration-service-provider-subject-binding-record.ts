import type { JsonValue } from './json-value';

/** Integration service provider subject binding record schema exposed by Claw Router. */
export interface IntegrationServiceProviderSubjectBindingRecord {
  /** Binding priority field on integration service provider subject binding record. */
  binding_priority?: number;
  /** Created at field on integration service provider subject binding record. */
  created_at?: string;
  /** Data scope field on integration service provider subject binding record. */
  data_scope?: string;
  /** Deleted at field on integration service provider subject binding record. */
  deleted_at?: string;
  /** Deleted by field on integration service provider subject binding record. */
  deleted_by?: string;
  /** Effective from field on integration service provider subject binding record. */
  effective_from?: string;
  /** Effective to field on integration service provider subject binding record. */
  effective_to?: string;
  /** Id field on integration service provider subject binding record. */
  id?: string;
  /** Metadata field on integration service provider subject binding record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on integration service provider subject binding record. */
  organization_id?: string;
  /** Service provider id field on integration service provider subject binding record. */
  service_provider_id?: string;
  /** Status field on integration service provider subject binding record. */
  status?: string;
  /** Subject code field on integration service provider subject binding record. */
  subject_code?: string;
  /** Subject id field on integration service provider subject binding record. */
  subject_id?: string;
  /** Subject type field on integration service provider subject binding record. */
  subject_type?: string;
  /** Tenant id field on integration service provider subject binding record. */
  tenant_id?: string;
  /** Updated at field on integration service provider subject binding record. */
  updated_at?: string;
  /** Uuid field on integration service provider subject binding record. */
  uuid?: string;
  /** Version field on integration service provider subject binding record. */
  version?: string;
}
