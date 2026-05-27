import type { JsonValue } from './json-value';

/** Integration service provider edge record schema exposed by Claw Router. */
export interface IntegrationServiceProviderEdgeRecord {
  /** Buyer provider id field on integration service provider edge record. */
  buyer_provider_id?: string;
  /** Contract no field on integration service provider edge record. */
  contract_no?: string;
  /** Contract snapshot field on integration service provider edge record. */
  contract_snapshot?: Record<string, JsonValue>;
  /** Created at field on integration service provider edge record. */
  created_at?: string;
  /** Data scope field on integration service provider edge record. */
  data_scope?: string;
  /** Deleted at field on integration service provider edge record. */
  deleted_at?: string;
  /** Deleted by field on integration service provider edge record. */
  deleted_by?: string;
  /** Edge no field on integration service provider edge record. */
  edge_no?: string;
  /** Edge type field on integration service provider edge record. */
  edge_type?: string;
  /** Effective from field on integration service provider edge record. */
  effective_from?: string;
  /** Effective to field on integration service provider edge record. */
  effective_to?: string;
  /** Id field on integration service provider edge record. */
  id?: string;
  /** Metadata field on integration service provider edge record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on integration service provider edge record. */
  organization_id?: string;
  /** Seller provider id field on integration service provider edge record. */
  seller_provider_id?: string;
  /** Settlement mode field on integration service provider edge record. */
  settlement_mode?: string;
  /** Status field on integration service provider edge record. */
  status?: string;
  /** Tenant id field on integration service provider edge record. */
  tenant_id?: string;
  /** Updated at field on integration service provider edge record. */
  updated_at?: string;
  /** Uuid field on integration service provider edge record. */
  uuid?: string;
  /** Version field on integration service provider edge record. */
  version?: string;
}
