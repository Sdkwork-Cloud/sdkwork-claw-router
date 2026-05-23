import type { JsonValue } from './json-value';

/** Commerce usage settlement record schema exposed by Claw Router. */
export interface CommerceUsageSettlementRecord {
  /** Account id field on commerce usage settlement record. */
  account_id?: string;
  /** Account ledger entry id field on commerce usage settlement record. */
  account_ledger_entry_id?: string;
  /** Amount field on commerce usage settlement record. */
  amount?: string;
  /** Asset type field on commerce usage settlement record. */
  asset_type?: string;
  /** Created at field on commerce usage settlement record. */
  created_at?: string;
  /** Currency field on commerce usage settlement record. */
  currency?: string;
  /** Direction field on commerce usage settlement record. */
  direction?: string;
  /** Failure code field on commerce usage settlement record. */
  failure_code?: string;
  /** Failure message field on commerce usage settlement record. */
  failure_message?: string;
  /** Id field on commerce usage settlement record. */
  id?: string;
  /** Legal hold field on commerce usage settlement record. */
  legal_hold?: boolean;
  /** Metadata field on commerce usage settlement record. */
  metadata?: Record<string, JsonValue>;
  /** Order id field on commerce usage settlement record. */
  order_id?: string;
  /** Organization id field on commerce usage settlement record. */
  organization_id?: string;
  /** Payload hash field on commerce usage settlement record. */
  payload_hash?: string;
  /** Payment id field on commerce usage settlement record. */
  payment_id?: string;
  /** Points field on commerce usage settlement record. */
  points?: string;
  /** Price snapshot field on commerce usage settlement record. */
  price_snapshot?: Record<string, JsonValue>;
  /** Request id field on commerce usage settlement record. */
  request_id?: string;
  /** Retention until field on commerce usage settlement record. */
  retention_until?: string;
  /** Settled at field on commerce usage settlement record. */
  settled_at?: string;
  /** Settlement no field on commerce usage settlement record. */
  settlement_no?: string;
  /** Settlement status field on commerce usage settlement record. */
  settlement_status?: string;
  /** Status field on commerce usage settlement record. */
  status?: string;
  /** Tenant id field on commerce usage settlement record. */
  tenant_id?: string;
  /** Tokens field on commerce usage settlement record. */
  tokens?: string;
  /** Trace id field on commerce usage settlement record. */
  trace_id?: string;
  /** Usage fact id field on commerce usage settlement record. */
  usage_fact_id?: string;
  /** User id field on commerce usage settlement record. */
  user_id?: string;
  /** Uuid field on commerce usage settlement record. */
  uuid?: string;
}
