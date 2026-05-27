import type { JsonValue } from './json-value';

/** Commerce usage service provider statement record schema exposed by Claw Router. */
export interface CommerceUsageServiceProviderStatementRecord {
  /** Buyer provider id field on commerce usage service provider statement record. */
  buyer_provider_id?: string;
  /** Created at field on commerce usage service provider statement record. */
  created_at?: string;
  /** Currency field on commerce usage service provider statement record. */
  currency?: string;
  /** Due at field on commerce usage service provider statement record. */
  due_at?: string;
  /** Generated at field on commerce usage service provider statement record. */
  generated_at?: string;
  /** Id field on commerce usage service provider statement record. */
  id?: string;
  /** Invoice id field on commerce usage service provider statement record. */
  invoice_id?: string;
  /** Metadata field on commerce usage service provider statement record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on commerce usage service provider statement record. */
  organization_id?: string;
  /** Paid at field on commerce usage service provider statement record. */
  paid_at?: string;
  /** Payable amount field on commerce usage service provider statement record. */
  payable_amount?: string;
  /** Payment status field on commerce usage service provider statement record. */
  payment_status?: string;
  /** Period field on commerce usage service provider statement record. */
  period?: string;
  /** Period end field on commerce usage service provider statement record. */
  period_end?: string;
  /** Period start field on commerce usage service provider statement record. */
  period_start?: string;
  /** Rebuild version field on commerce usage service provider statement record. */
  rebuild_version?: string;
  /** Receivable amount field on commerce usage service provider statement record. */
  receivable_amount?: string;
  /** Seller provider id field on commerce usage service provider statement record. */
  seller_provider_id?: string;
  /** Source id field on commerce usage service provider statement record. */
  source_id?: string;
  /** Source type field on commerce usage service provider statement record. */
  source_type?: string;
  /** Source version field on commerce usage service provider statement record. */
  source_version?: string;
  /** Statement no field on commerce usage service provider statement record. */
  statement_no?: string;
  /** Statement status field on commerce usage service provider statement record. */
  statement_status?: string;
  /** Status field on commerce usage service provider statement record. */
  status?: string;
  /** Tenant id field on commerce usage service provider statement record. */
  tenant_id?: string;
  /** Total requests field on commerce usage service provider statement record. */
  total_requests?: string;
  /** Total tokens field on commerce usage service provider statement record. */
  total_tokens?: string;
  /** Updated at field on commerce usage service provider statement record. */
  updated_at?: string;
  /** Uuid field on commerce usage service provider statement record. */
  uuid?: string;
}
