import type { JsonValue } from './json-value';

/** Analytics service provider daily record schema exposed by Claw Router. */
export interface AnalyticsServiceProviderDailyRecord {
  /** Ancestor provider id field on analytics service provider daily record. */
  ancestor_provider_id?: string;
  /** Created at field on analytics service provider daily record. */
  created_at?: string;
  /** Currency field on analytics service provider daily record. */
  currency?: string;
  /** Expense amount field on analytics service provider daily record. */
  expense_amount?: string;
  /** Failure count field on analytics service provider daily record. */
  failure_count?: string;
  /** Id field on analytics service provider daily record. */
  id?: string;
  /** Income amount field on analytics service provider daily record. */
  income_amount?: string;
  /** Margin amount field on analytics service provider daily record. */
  margin_amount?: string;
  /** Metadata field on analytics service provider daily record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on analytics service provider daily record. */
  organization_id?: string;
  /** Provider id field on analytics service provider daily record. */
  provider_id?: string;
  /** Rebuild version field on analytics service provider daily record. */
  rebuild_version?: string;
  /** Report date field on analytics service provider daily record. */
  report_date?: string;
  /** Request count field on analytics service provider daily record. */
  request_count?: string;
  /** Source id field on analytics service provider daily record. */
  source_id?: string;
  /** Source type field on analytics service provider daily record. */
  source_type?: string;
  /** Source version field on analytics service provider daily record. */
  source_version?: string;
  /** Status field on analytics service provider daily record. */
  status?: string;
  /** Success count field on analytics service provider daily record. */
  success_count?: string;
  /** Tenant id field on analytics service provider daily record. */
  tenant_id?: string;
  /** Token count field on analytics service provider daily record. */
  token_count?: string;
  /** Updated at field on analytics service provider daily record. */
  updated_at?: string;
  /** Upstream cost amount field on analytics service provider daily record. */
  upstream_cost_amount?: string;
  /** Uuid field on analytics service provider daily record. */
  uuid?: string;
}
