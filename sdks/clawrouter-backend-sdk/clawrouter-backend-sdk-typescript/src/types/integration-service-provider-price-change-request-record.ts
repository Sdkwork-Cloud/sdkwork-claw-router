import type { JsonValue } from './json-value';

/** Integration service provider price change request record schema exposed by Claw Router. */
export interface IntegrationServiceProviderPriceChangeRequestRecord {
  /** After hash field on integration service provider price change request record. */
  after_hash?: string;
  /** Approval status field on integration service provider price change request record. */
  approval_status?: string;
  /** Approved by field on integration service provider price change request record. */
  approved_by?: string;
  /** Before hash field on integration service provider price change request record. */
  before_hash?: string;
  /** Buyer provider id field on integration service provider price change request record. */
  buyer_provider_id?: string;
  /** Change no field on integration service provider price change request record. */
  change_no?: string;
  /** Change type field on integration service provider price change request record. */
  change_type?: string;
  /** Created at field on integration service provider price change request record. */
  created_at?: string;
  /** Data scope field on integration service provider price change request record. */
  data_scope?: string;
  /** Deleted at field on integration service provider price change request record. */
  deleted_at?: string;
  /** Deleted by field on integration service provider price change request record. */
  deleted_by?: string;
  /** Draft payload field on integration service provider price change request record. */
  draft_payload?: Record<string, JsonValue>;
  /** Effective from field on integration service provider price change request record. */
  effective_from?: string;
  /** Id field on integration service provider price change request record. */
  id?: string;
  /** Metadata field on integration service provider price change request record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on integration service provider price change request record. */
  organization_id?: string;
  /** Published at field on integration service provider price change request record. */
  published_at?: string;
  /** Requested by field on integration service provider price change request record. */
  requested_by?: string;
  /** Seller provider id field on integration service provider price change request record. */
  seller_provider_id?: string;
  /** Status field on integration service provider price change request record. */
  status?: string;
  /** Tenant id field on integration service provider price change request record. */
  tenant_id?: string;
  /** Updated at field on integration service provider price change request record. */
  updated_at?: string;
  /** Uuid field on integration service provider price change request record. */
  uuid?: string;
  /** Version field on integration service provider price change request record. */
  version?: string;
}
