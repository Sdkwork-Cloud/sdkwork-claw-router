import type { JsonValue } from './json-value';

/** Integration service provider contract version record schema exposed by Claw Router. */
export interface IntegrationServiceProviderContractVersionRecord {
  /** Approval status field on integration service provider contract version record. */
  approval_status?: string;
  /** Approved at field on integration service provider contract version record. */
  approved_at?: string;
  /** Approved by field on integration service provider contract version record. */
  approved_by?: string;
  /** Contract id field on integration service provider contract version record. */
  contract_id?: string;
  /** Contract payload field on integration service provider contract version record. */
  contract_payload?: Record<string, JsonValue>;
  /** Created at field on integration service provider contract version record. */
  created_at?: string;
  /** Data scope field on integration service provider contract version record. */
  data_scope?: string;
  /** Deleted at field on integration service provider contract version record. */
  deleted_at?: string;
  /** Deleted by field on integration service provider contract version record. */
  deleted_by?: string;
  /** Id field on integration service provider contract version record. */
  id?: string;
  /** Metadata field on integration service provider contract version record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on integration service provider contract version record. */
  organization_id?: string;
  /** Published at field on integration service provider contract version record. */
  published_at?: string;
  /** Requested by field on integration service provider contract version record. */
  requested_by?: string;
  /** Status field on integration service provider contract version record. */
  status?: string;
  /** Tenant id field on integration service provider contract version record. */
  tenant_id?: string;
  /** Updated at field on integration service provider contract version record. */
  updated_at?: string;
  /** Uuid field on integration service provider contract version record. */
  uuid?: string;
  /** Version field on integration service provider contract version record. */
  version?: string;
  /** Version hash field on integration service provider contract version record. */
  version_hash?: string;
  /** Version no field on integration service provider contract version record. */
  version_no?: number;
}
