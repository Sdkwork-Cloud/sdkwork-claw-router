import type { JsonValue } from './json-value';

/** Storage usage ledger record schema exposed by Claw Router. */
export interface StorageUsageLedgerRecord {
  /** App id field on storage usage ledger record. */
  app_id?: string;
  /** Business domain field on storage usage ledger record. */
  business_domain?: string;
  /** Created at field on storage usage ledger record. */
  created_at?: string;
  /** Delta file count field on storage usage ledger record. */
  delta_file_count?: string;
  /** Delta logical bytes field on storage usage ledger record. */
  delta_logical_bytes?: string;
  /** Delta physical bytes field on storage usage ledger record. */
  delta_physical_bytes?: string;
  /** Delta reserved bytes field on storage usage ledger record. */
  delta_reserved_bytes?: string;
  /** Id field on storage usage ledger record. */
  id?: string;
  /** Idempotency key field on storage usage ledger record. */
  idempotency_key?: string;
  /** Legal hold field on storage usage ledger record. */
  legal_hold?: boolean;
  /** Metadata field on storage usage ledger record. */
  metadata?: Record<string, JsonValue>;
  /** Occurred at field on storage usage ledger record. */
  occurred_at?: string;
  /** Organization id field on storage usage ledger record. */
  organization_id?: string;
  /** Payload hash field on storage usage ledger record. */
  payload_hash?: string;
  /** Reason field on storage usage ledger record. */
  reason?: string;
  /** Request id field on storage usage ledger record. */
  request_id?: string;
  /** Retention until field on storage usage ledger record. */
  retention_until?: string;
  /** Scope id field on storage usage ledger record. */
  scope_id?: string;
  /** Scope type field on storage usage ledger record. */
  scope_type?: string;
  /** Space id field on storage usage ledger record. */
  space_id?: string;
  /** Status field on storage usage ledger record. */
  status?: string;
  /** Tenant id field on storage usage ledger record. */
  tenant_id?: string;
  /** Trace id field on storage usage ledger record. */
  trace_id?: string;
  /** Usage event type field on storage usage ledger record. */
  usage_event_type?: string;
  /** User id field on storage usage ledger record. */
  user_id?: string;
  /** Uuid field on storage usage ledger record. */
  uuid?: string;
}
