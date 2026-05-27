import type { JsonValue } from './json-value';

/** Integration service provider closure record schema exposed by Claw Router. */
export interface IntegrationServiceProviderClosureRecord {
  /** Ancestor provider id field on integration service provider closure record. */
  ancestor_provider_id?: string;
  /** Created at field on integration service provider closure record. */
  created_at?: string;
  /** Data scope field on integration service provider closure record. */
  data_scope?: string;
  /** Deleted at field on integration service provider closure record. */
  deleted_at?: string;
  /** Deleted by field on integration service provider closure record. */
  deleted_by?: string;
  /** Depth field on integration service provider closure record. */
  depth?: number;
  /** Descendant provider id field on integration service provider closure record. */
  descendant_provider_id?: string;
  /** Direct edge id field on integration service provider closure record. */
  direct_edge_id?: string;
  /** Effective from field on integration service provider closure record. */
  effective_from?: string;
  /** Effective to field on integration service provider closure record. */
  effective_to?: string;
  /** Id field on integration service provider closure record. */
  id?: string;
  /** Metadata field on integration service provider closure record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on integration service provider closure record. */
  organization_id?: string;
  /** Path field on integration service provider closure record. */
  path?: string;
  /** Status field on integration service provider closure record. */
  status?: string;
  /** Tenant id field on integration service provider closure record. */
  tenant_id?: string;
  /** Updated at field on integration service provider closure record. */
  updated_at?: string;
  /** Uuid field on integration service provider closure record. */
  uuid?: string;
  /** Version field on integration service provider closure record. */
  version?: string;
}
