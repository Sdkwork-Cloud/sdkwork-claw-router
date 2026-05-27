import type { JsonValue } from './json-value';

/** Commerce usage service provider adjustment record schema exposed by Claw Router. */
export interface CommerceUsageServiceProviderAdjustmentRecord {
  /** Adjustment no field on commerce usage service provider adjustment record. */
  adjustment_no?: string;
  /** Adjustment type field on commerce usage service provider adjustment record. */
  adjustment_type?: string;
  /** Amount field on commerce usage service provider adjustment record. */
  amount?: string;
  /** Approval status field on commerce usage service provider adjustment record. */
  approval_status?: string;
  /** Approved by field on commerce usage service provider adjustment record. */
  approved_by?: string;
  /** Buyer provider id field on commerce usage service provider adjustment record. */
  buyer_provider_id?: string;
  /** Created at field on commerce usage service provider adjustment record. */
  created_at?: string;
  /** Currency field on commerce usage service provider adjustment record. */
  currency?: string;
  /** Id field on commerce usage service provider adjustment record. */
  id?: string;
  /** Legal hold field on commerce usage service provider adjustment record. */
  legal_hold?: boolean;
  /** Metadata field on commerce usage service provider adjustment record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on commerce usage service provider adjustment record. */
  organization_id?: string;
  /** Payload hash field on commerce usage service provider adjustment record. */
  payload_hash?: string;
  /** Reason code field on commerce usage service provider adjustment record. */
  reason_code?: string;
  /** Reason message field on commerce usage service provider adjustment record. */
  reason_message?: string;
  /** Request id field on commerce usage service provider adjustment record. */
  request_id?: string;
  /** Retention until field on commerce usage service provider adjustment record. */
  retention_until?: string;
  /** Seller provider id field on commerce usage service provider adjustment record. */
  seller_provider_id?: string;
  /** Settled ledger entry id field on commerce usage service provider adjustment record. */
  settled_ledger_entry_id?: string;
  /** Statement id field on commerce usage service provider adjustment record. */
  statement_id?: string;
  /** Status field on commerce usage service provider adjustment record. */
  status?: string;
  /** Tenant id field on commerce usage service provider adjustment record. */
  tenant_id?: string;
  /** Trace id field on commerce usage service provider adjustment record. */
  trace_id?: string;
  /** Usage edge id field on commerce usage service provider adjustment record. */
  usage_edge_id?: string;
  /** User id field on commerce usage service provider adjustment record. */
  user_id?: string;
  /** Uuid field on commerce usage service provider adjustment record. */
  uuid?: string;
}
