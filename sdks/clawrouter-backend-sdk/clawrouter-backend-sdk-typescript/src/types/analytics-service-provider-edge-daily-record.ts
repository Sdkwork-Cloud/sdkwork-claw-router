import type { JsonValue } from './json-value';

/** Analytics service provider edge daily record schema exposed by Claw Router. */
export interface AnalyticsServiceProviderEdgeDailyRecord {
  /** Billing meter code field on analytics service provider edge daily record. */
  billing_meter_code?: string;
  /** Buyer provider id field on analytics service provider edge daily record. */
  buyer_provider_id?: string;
  /** Catalog key field on analytics service provider edge daily record. */
  catalog_key?: string;
  /** Created at field on analytics service provider edge daily record. */
  created_at?: string;
  /** Currency field on analytics service provider edge daily record. */
  currency?: string;
  /** Edge id field on analytics service provider edge daily record. */
  edge_id?: string;
  /** Expense amount field on analytics service provider edge daily record. */
  expense_amount?: string;
  /** Id field on analytics service provider edge daily record. */
  id?: string;
  /** Income amount field on analytics service provider edge daily record. */
  income_amount?: string;
  /** Margin amount field on analytics service provider edge daily record. */
  margin_amount?: string;
  /** Metadata field on analytics service provider edge daily record. */
  metadata?: Record<string, JsonValue>;
  /** Model field on analytics service provider edge daily record. */
  model?: string;
  /** Organization id field on analytics service provider edge daily record. */
  organization_id?: string;
  /** Rebuild version field on analytics service provider edge daily record. */
  rebuild_version?: string;
  /** Report date field on analytics service provider edge daily record. */
  report_date?: string;
  /** Request count field on analytics service provider edge daily record. */
  request_count?: string;
  /** Seller provider id field on analytics service provider edge daily record. */
  seller_provider_id?: string;
  /** Source id field on analytics service provider edge daily record. */
  source_id?: string;
  /** Source type field on analytics service provider edge daily record. */
  source_type?: string;
  /** Source version field on analytics service provider edge daily record. */
  source_version?: string;
  /** Status field on analytics service provider edge daily record. */
  status?: string;
  /** Tenant id field on analytics service provider edge daily record. */
  tenant_id?: string;
  /** Token count field on analytics service provider edge daily record. */
  token_count?: string;
  /** Token kind field on analytics service provider edge daily record. */
  token_kind?: string;
  /** Updated at field on analytics service provider edge daily record. */
  updated_at?: string;
  /** Uuid field on analytics service provider edge daily record. */
  uuid?: string;
}
