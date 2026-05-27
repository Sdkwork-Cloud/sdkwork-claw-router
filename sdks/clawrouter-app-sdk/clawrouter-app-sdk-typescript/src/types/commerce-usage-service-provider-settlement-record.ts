import type { JsonValue } from './json-value';

/** Commerce usage service provider settlement record schema exposed by Claw Router. */
export interface CommerceUsageServiceProviderSettlementRecord {
  /** Amount field on commerce usage service provider settlement record. */
  amount?: string;
  /** Buyer account id field on commerce usage service provider settlement record. */
  buyer_account_id?: string;
  /** Buyer ledger entry id field on commerce usage service provider settlement record. */
  buyer_ledger_entry_id?: string;
  /** Buyer provider id field on commerce usage service provider settlement record. */
  buyer_provider_id?: string;
  /** Created at field on commerce usage service provider settlement record. */
  created_at?: string;
  /** Currency field on commerce usage service provider settlement record. */
  currency?: string;
  /** Direction field on commerce usage service provider settlement record. */
  direction?: string;
  /** Failure code field on commerce usage service provider settlement record. */
  failure_code?: string;
  /** Failure message field on commerce usage service provider settlement record. */
  failure_message?: string;
  /** Id field on commerce usage service provider settlement record. */
  id?: string;
  /** Legal hold field on commerce usage service provider settlement record. */
  legal_hold?: boolean;
  /** Metadata field on commerce usage service provider settlement record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on commerce usage service provider settlement record. */
  organization_id?: string;
  /** Payload hash field on commerce usage service provider settlement record. */
  payload_hash?: string;
  /** Request id field on commerce usage service provider settlement record. */
  request_id?: string;
  /** Retention until field on commerce usage service provider settlement record. */
  retention_until?: string;
  /** Seller account id field on commerce usage service provider settlement record. */
  seller_account_id?: string;
  /** Seller ledger entry id field on commerce usage service provider settlement record. */
  seller_ledger_entry_id?: string;
  /** Seller provider id field on commerce usage service provider settlement record. */
  seller_provider_id?: string;
  /** Settled at field on commerce usage service provider settlement record. */
  settled_at?: string;
  /** Settlement mode field on commerce usage service provider settlement record. */
  settlement_mode?: string;
  /** Settlement no field on commerce usage service provider settlement record. */
  settlement_no?: string;
  /** Settlement status field on commerce usage service provider settlement record. */
  settlement_status?: string;
  /** Status field on commerce usage service provider settlement record. */
  status?: string;
  /** Tenant id field on commerce usage service provider settlement record. */
  tenant_id?: string;
  /** Trace id field on commerce usage service provider settlement record. */
  trace_id?: string;
  /** Usage edge id field on commerce usage service provider settlement record. */
  usage_edge_id?: string;
  /** User id field on commerce usage service provider settlement record. */
  user_id?: string;
  /** Uuid field on commerce usage service provider settlement record. */
  uuid?: string;
}
