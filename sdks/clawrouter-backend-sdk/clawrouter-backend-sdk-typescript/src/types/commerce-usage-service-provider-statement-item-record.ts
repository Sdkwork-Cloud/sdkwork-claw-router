import type { JsonValue } from './json-value';

/** Commerce usage service provider statement item record schema exposed by Claw Router. */
export interface CommerceUsageServiceProviderStatementItemRecord {
  /** Amount field on commerce usage service provider statement item record. */
  amount?: string;
  /** Billing meter code field on commerce usage service provider statement item record. */
  billing_meter_code?: string;
  /** Created at field on commerce usage service provider statement item record. */
  created_at?: string;
  /** Currency field on commerce usage service provider statement item record. */
  currency?: string;
  /** Id field on commerce usage service provider statement item record. */
  id?: string;
  /** Metadata field on commerce usage service provider statement item record. */
  metadata?: Record<string, JsonValue>;
  /** Model field on commerce usage service provider statement item record. */
  model?: string;
  /** Organization id field on commerce usage service provider statement item record. */
  organization_id?: string;
  /** Quantity field on commerce usage service provider statement item record. */
  quantity?: string;
  /** Rebuild version field on commerce usage service provider statement item record. */
  rebuild_version?: string;
  /** Request count field on commerce usage service provider statement item record. */
  request_count?: string;
  /** Source id field on commerce usage service provider statement item record. */
  source_id?: string;
  /** Source type field on commerce usage service provider statement item record. */
  source_type?: string;
  /** Source usage fact ids field on commerce usage service provider statement item record. */
  source_usage_fact_ids?: Record<string, JsonValue>;
  /** Source version field on commerce usage service provider statement item record. */
  source_version?: string;
  /** Statement id field on commerce usage service provider statement item record. */
  statement_id?: string;
  /** Status field on commerce usage service provider statement item record. */
  status?: string;
  /** Tenant id field on commerce usage service provider statement item record. */
  tenant_id?: string;
  /** Token count field on commerce usage service provider statement item record. */
  token_count?: string;
  /** Token kind field on commerce usage service provider statement item record. */
  token_kind?: string;
  /** Updated at field on commerce usage service provider statement item record. */
  updated_at?: string;
  /** Usage edge id field on commerce usage service provider statement item record. */
  usage_edge_id?: string;
  /** Uuid field on commerce usage service provider statement item record. */
  uuid?: string;
}
