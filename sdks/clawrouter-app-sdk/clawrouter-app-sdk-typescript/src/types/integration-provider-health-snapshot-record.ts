import type { JsonValue } from './json-value';

/** Integration provider health snapshot record schema exposed by Claw Router. */
export interface IntegrationProviderHealthSnapshotRecord {
  /** Channel id field on integration provider health snapshot record. */
  channel_id?: string;
  /** Check type field on integration provider health snapshot record. */
  check_type?: string;
  /** Checked at field on integration provider health snapshot record. */
  checked_at?: string;
  /** Created at field on integration provider health snapshot record. */
  created_at?: string;
  /** Error code field on integration provider health snapshot record. */
  error_code?: string;
  /** Error message masked field on integration provider health snapshot record. */
  error_message_masked?: string;
  /** Health status field on integration provider health snapshot record. */
  health_status?: string;
  /** Http status field on integration provider health snapshot record. */
  http_status?: number;
  /** Id field on integration provider health snapshot record. */
  id?: string;
  /** Latency ms field on integration provider health snapshot record. */
  latency_ms?: number;
  /** Legal hold field on integration provider health snapshot record. */
  legal_hold?: boolean;
  /** Metadata field on integration provider health snapshot record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on integration provider health snapshot record. */
  organization_id?: string;
  /** Payload hash field on integration provider health snapshot record. */
  payload_hash?: string;
  /** Provider account id field on integration provider health snapshot record. */
  provider_account_id?: string;
  /** Provider id field on integration provider health snapshot record. */
  provider_id?: string;
  /** Quota snapshot field on integration provider health snapshot record. */
  quota_snapshot?: Record<string, JsonValue>;
  /** Request id field on integration provider health snapshot record. */
  request_id?: string;
  /** Retention until field on integration provider health snapshot record. */
  retention_until?: string;
  /** Status field on integration provider health snapshot record. */
  status?: string;
  /** Tenant id field on integration provider health snapshot record. */
  tenant_id?: string;
  /** Trace id field on integration provider health snapshot record. */
  trace_id?: string;
  /** User id field on integration provider health snapshot record. */
  user_id?: string;
  /** Uuid field on integration provider health snapshot record. */
  uuid?: string;
}
