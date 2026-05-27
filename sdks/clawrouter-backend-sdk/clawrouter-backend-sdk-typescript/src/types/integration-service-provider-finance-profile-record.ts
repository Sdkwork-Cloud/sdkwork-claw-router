import type { JsonValue } from './json-value';

/** Integration service provider finance profile record schema exposed by Claw Router. */
export interface IntegrationServiceProviderFinanceProfileRecord {
  /** Billing cycle field on integration service provider finance profile record. */
  billing_cycle?: string;
  /** Created at field on integration service provider finance profile record. */
  created_at?: string;
  /** Credit limit amount field on integration service provider finance profile record. */
  credit_limit_amount?: string;
  /** Currency field on integration service provider finance profile record. */
  currency?: string;
  /** Data scope field on integration service provider finance profile record. */
  data_scope?: string;
  /** Deleted at field on integration service provider finance profile record. */
  deleted_at?: string;
  /** Deleted by field on integration service provider finance profile record. */
  deleted_by?: string;
  /** Id field on integration service provider finance profile record. */
  id?: string;
  /** Invoice title id field on integration service provider finance profile record. */
  invoice_title_id?: string;
  /** Metadata field on integration service provider finance profile record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on integration service provider finance profile record. */
  organization_id?: string;
  /** Payment terms days field on integration service provider finance profile record. */
  payment_terms_days?: number;
  /** Service provider id field on integration service provider finance profile record. */
  service_provider_id?: string;
  /** Settlement day field on integration service provider finance profile record. */
  settlement_day?: number;
  /** Settlement mode field on integration service provider finance profile record. */
  settlement_mode?: string;
  /** Status field on integration service provider finance profile record. */
  status?: string;
  /** Suspend threshold amount field on integration service provider finance profile record. */
  suspend_threshold_amount?: string;
  /** Tax profile ref field on integration service provider finance profile record. */
  tax_profile_ref?: string;
  /** Tenant id field on integration service provider finance profile record. */
  tenant_id?: string;
  /** Updated at field on integration service provider finance profile record. */
  updated_at?: string;
  /** Uuid field on integration service provider finance profile record. */
  uuid?: string;
  /** Version field on integration service provider finance profile record. */
  version?: string;
  /** Warning threshold amount field on integration service provider finance profile record. */
  warning_threshold_amount?: string;
}
