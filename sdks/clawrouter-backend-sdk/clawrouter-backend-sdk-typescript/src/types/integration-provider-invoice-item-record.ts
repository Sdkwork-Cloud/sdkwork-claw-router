import type { JsonValue } from './json-value';

/** Integration provider invoice item record schema exposed by Claw Router. */
export interface IntegrationProviderInvoiceItemRecord {
  /** Amount field on integration provider invoice item record. */
  amount?: string;
  /** Billing meter code field on integration provider invoice item record. */
  billing_meter_code?: string;
  /** Created at field on integration provider invoice item record. */
  created_at?: string;
  /** Currency field on integration provider invoice item record. */
  currency?: string;
  /** Id field on integration provider invoice item record. */
  id?: string;
  /** Import id field on integration provider invoice item record. */
  import_id?: string;
  /** Legal hold field on integration provider invoice item record. */
  legal_hold?: boolean;
  /** Match status field on integration provider invoice item record. */
  match_status?: string;
  /** Metadata field on integration provider invoice item record. */
  metadata?: Record<string, JsonValue>;
  /** Model field on integration provider invoice item record. */
  model?: string;
  /** Organization id field on integration provider invoice item record. */
  organization_id?: string;
  /** Payload hash field on integration provider invoice item record. */
  payload_hash?: string;
  /** Provider request id field on integration provider invoice item record. */
  provider_request_id?: string;
  /** Provider usage id field on integration provider invoice item record. */
  provider_usage_id?: string;
  /** Quantity field on integration provider invoice item record. */
  quantity?: string;
  /** Raw payload hash field on integration provider invoice item record. */
  raw_payload_hash?: string;
  /** Request id field on integration provider invoice item record. */
  request_id?: string;
  /** Retention until field on integration provider invoice item record. */
  retention_until?: string;
  /** Status field on integration provider invoice item record. */
  status?: string;
  /** Tenant id field on integration provider invoice item record. */
  tenant_id?: string;
  /** Trace id field on integration provider invoice item record. */
  trace_id?: string;
  /** User id field on integration provider invoice item record. */
  user_id?: string;
  /** Uuid field on integration provider invoice item record. */
  uuid?: string;
}
