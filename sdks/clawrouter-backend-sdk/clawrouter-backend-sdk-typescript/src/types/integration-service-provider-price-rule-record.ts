import type { JsonValue } from './json-value';

/** Integration service provider price rule record schema exposed by Claw Router. */
export interface IntegrationServiceProviderPriceRuleRecord {
  /** Billing meter code field on integration service provider price rule record. */
  billing_meter_code?: string;
  /** Buyer provider id field on integration service provider price rule record. */
  buyer_provider_id?: string;
  /** Catalog key field on integration service provider price rule record. */
  catalog_key?: string;
  /** Channel id field on integration service provider price rule record. */
  channel_id?: string;
  /** Created at field on integration service provider price rule record. */
  created_at?: string;
  /** Data scope field on integration service provider price rule record. */
  data_scope?: string;
  /** Deleted at field on integration service provider price rule record. */
  deleted_at?: string;
  /** Deleted by field on integration service provider price rule record. */
  deleted_by?: string;
  /** Edge id field on integration service provider price rule record. */
  edge_id?: string;
  /** Effective from field on integration service provider price rule record. */
  effective_from?: string;
  /** Effective to field on integration service provider price rule record. */
  effective_to?: string;
  /** Id field on integration service provider price rule record. */
  id?: string;
  /** Metadata field on integration service provider price rule record. */
  metadata?: Record<string, JsonValue>;
  /** Minimum charge field on integration service provider price rule record. */
  minimum_charge?: string;
  /** Model field on integration service provider price rule record. */
  model?: string;
  /** Organization id field on integration service provider price rule record. */
  organization_id?: string;
  /** Price plan id field on integration service provider price rule record. */
  price_plan_id?: string;
  /** Priority field on integration service provider price rule record. */
  priority?: number;
  /** Provider code field on integration service provider price rule record. */
  provider_code?: string;
  /** Rounding mode field on integration service provider price rule record. */
  rounding_mode?: string;
  /** Seller provider id field on integration service provider price rule record. */
  seller_provider_id?: string;
  /** Status field on integration service provider price rule record. */
  status?: string;
  /** Tenant id field on integration service provider price rule record. */
  tenant_id?: string;
  /** Token kind field on integration service provider price rule record. */
  token_kind?: string;
  /** Unit price field on integration service provider price rule record. */
  unit_price?: string;
  /** Unit size field on integration service provider price rule record. */
  unit_size?: string;
  /** Updated at field on integration service provider price rule record. */
  updated_at?: string;
  /** Uuid field on integration service provider price rule record. */
  uuid?: string;
  /** Version field on integration service provider price rule record. */
  version?: string;
}
