import type { JsonValue } from './json-value';

/** Integration service provider price plan record schema exposed by Claw Router. */
export interface IntegrationServiceProviderPricePlanRecord {
  /** Base amount source field on integration service provider price plan record. */
  base_amount_source?: string;
  /** Buyer provider id field on integration service provider price plan record. */
  buyer_provider_id?: string;
  /** Created at field on integration service provider price plan record. */
  created_at?: string;
  /** Currency field on integration service provider price plan record. */
  currency?: string;
  /** Data scope field on integration service provider price plan record. */
  data_scope?: string;
  /** Default markup amount field on integration service provider price plan record. */
  default_markup_amount?: string;
  /** Default multiplier field on integration service provider price plan record. */
  default_multiplier?: string;
  /** Deleted at field on integration service provider price plan record. */
  deleted_at?: string;
  /** Deleted by field on integration service provider price plan record. */
  deleted_by?: string;
  /** Edge id field on integration service provider price plan record. */
  edge_id?: string;
  /** Effective from field on integration service provider price plan record. */
  effective_from?: string;
  /** Effective to field on integration service provider price plan record. */
  effective_to?: string;
  /** Fallback mode field on integration service provider price plan record. */
  fallback_mode?: string;
  /** Id field on integration service provider price plan record. */
  id?: string;
  /** Metadata field on integration service provider price plan record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on integration service provider price plan record. */
  organization_id?: string;
  /** Plan code field on integration service provider price plan record. */
  plan_code?: string;
  /** Plan name field on integration service provider price plan record. */
  plan_name?: string;
  /** Pricing mode field on integration service provider price plan record. */
  pricing_mode?: string;
  /** Seller provider id field on integration service provider price plan record. */
  seller_provider_id?: string;
  /** Status field on integration service provider price plan record. */
  status?: string;
  /** Tenant id field on integration service provider price plan record. */
  tenant_id?: string;
  /** Updated at field on integration service provider price plan record. */
  updated_at?: string;
  /** Uuid field on integration service provider price plan record. */
  uuid?: string;
  /** Version field on integration service provider price plan record. */
  version?: string;
}
