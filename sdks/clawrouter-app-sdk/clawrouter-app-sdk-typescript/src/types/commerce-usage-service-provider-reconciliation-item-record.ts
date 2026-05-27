import type { JsonValue } from './json-value';

/** Commerce usage service provider reconciliation item record schema exposed by Claw Router. */
export interface CommerceUsageServiceProviderReconciliationItemRecord {
  /** Created at field on commerce usage service provider reconciliation item record. */
  created_at?: string;
  /** Difference amount field on commerce usage service provider reconciliation item record. */
  difference_amount?: string;
  /** External amount field on commerce usage service provider reconciliation item record. */
  external_amount?: string;
  /** Id field on commerce usage service provider reconciliation item record. */
  id?: string;
  /** Internal amount field on commerce usage service provider reconciliation item record. */
  internal_amount?: string;
  /** Legal hold field on commerce usage service provider reconciliation item record. */
  legal_hold?: boolean;
  /** Match status field on commerce usage service provider reconciliation item record. */
  match_status?: string;
  /** Metadata field on commerce usage service provider reconciliation item record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on commerce usage service provider reconciliation item record. */
  organization_id?: string;
  /** Payload hash field on commerce usage service provider reconciliation item record. */
  payload_hash?: string;
  /** Provider invoice item id field on commerce usage service provider reconciliation item record. */
  provider_invoice_item_id?: string;
  /** Reason code field on commerce usage service provider reconciliation item record. */
  reason_code?: string;
  /** Request id field on commerce usage service provider reconciliation item record. */
  request_id?: string;
  /** Resolution status field on commerce usage service provider reconciliation item record. */
  resolution_status?: string;
  /** Retention until field on commerce usage service provider reconciliation item record. */
  retention_until?: string;
  /** Run id field on commerce usage service provider reconciliation item record. */
  run_id?: string;
  /** Statement item id field on commerce usage service provider reconciliation item record. */
  statement_item_id?: string;
  /** Status field on commerce usage service provider reconciliation item record. */
  status?: string;
  /** Tenant id field on commerce usage service provider reconciliation item record. */
  tenant_id?: string;
  /** Trace id field on commerce usage service provider reconciliation item record. */
  trace_id?: string;
  /** Usage edge id field on commerce usage service provider reconciliation item record. */
  usage_edge_id?: string;
  /** Usage fact id field on commerce usage service provider reconciliation item record. */
  usage_fact_id?: string;
  /** User id field on commerce usage service provider reconciliation item record. */
  user_id?: string;
  /** Uuid field on commerce usage service provider reconciliation item record. */
  uuid?: string;
}
