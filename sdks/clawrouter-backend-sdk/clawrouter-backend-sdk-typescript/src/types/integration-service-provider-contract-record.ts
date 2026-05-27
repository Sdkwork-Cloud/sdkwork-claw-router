import type { JsonValue } from './json-value';

/** Integration service provider contract record schema exposed by Claw Router. */
export interface IntegrationServiceProviderContractRecord {
  /** Buyer provider id field on integration service provider contract record. */
  buyer_provider_id?: string;
  /** Contract file ref field on integration service provider contract record. */
  contract_file_ref?: string;
  /** Contract no field on integration service provider contract record. */
  contract_no?: string;
  /** Contract type field on integration service provider contract record. */
  contract_type?: string;
  /** Created at field on integration service provider contract record. */
  created_at?: string;
  /** Current version id field on integration service provider contract record. */
  current_version_id?: string;
  /** Data scope field on integration service provider contract record. */
  data_scope?: string;
  /** Deleted at field on integration service provider contract record. */
  deleted_at?: string;
  /** Deleted by field on integration service provider contract record. */
  deleted_by?: string;
  /** Edge id field on integration service provider contract record. */
  edge_id?: string;
  /** Effective from field on integration service provider contract record. */
  effective_from?: string;
  /** Effective to field on integration service provider contract record. */
  effective_to?: string;
  /** Id field on integration service provider contract record. */
  id?: string;
  /** Metadata field on integration service provider contract record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on integration service provider contract record. */
  organization_id?: string;
  /** Seller provider id field on integration service provider contract record. */
  seller_provider_id?: string;
  /** Signed at field on integration service provider contract record. */
  signed_at?: string;
  /** Status field on integration service provider contract record. */
  status?: string;
  /** Tenant id field on integration service provider contract record. */
  tenant_id?: string;
  /** Updated at field on integration service provider contract record. */
  updated_at?: string;
  /** Uuid field on integration service provider contract record. */
  uuid?: string;
  /** Version field on integration service provider contract record. */
  version?: string;
}
