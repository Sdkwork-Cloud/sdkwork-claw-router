import type { JsonValue } from './json-value';

/** Ai routing decision log record schema exposed by Claw Router. */
export interface AiRoutingDecisionLogRecord {
  /** Api key id field on ai routing decision log record. */
  api_key_id?: string;
  /** Candidate snapshot field on ai routing decision log record. */
  candidate_snapshot?: Record<string, JsonValue>;
  /** Capability field on ai routing decision log record. */
  capability?: string;
  /** Created at field on ai routing decision log record. */
  created_at?: string;
  /** Decision latency ms field on ai routing decision log record. */
  decision_latency_ms?: number;
  /** Decision mode field on ai routing decision log record. */
  decision_mode?: string;
  /** Decision reason field on ai routing decision log record. */
  decision_reason?: Record<string, JsonValue>;
  /** Fallback chain field on ai routing decision log record. */
  fallback_chain?: Record<string, JsonValue>;
  /** Id field on ai routing decision log record. */
  id?: string;
  /** Legacy api key id field on ai routing decision log record. */
  legacy_api_key_id?: string;
  /** Legal hold field on ai routing decision log record. */
  legal_hold?: boolean;
  /** Metadata field on ai routing decision log record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai routing decision log record. */
  organization_id?: string;
  /** Payload hash field on ai routing decision log record. */
  payload_hash?: string;
  /** Policy id field on ai routing decision log record. */
  policy_id?: string;
  /** Profile id field on ai routing decision log record. */
  profile_id?: string;
  /** Request id field on ai routing decision log record. */
  request_id?: string;
  /** Requested model field on ai routing decision log record. */
  requested_model?: string;
  /** Resolved model field on ai routing decision log record. */
  resolved_model?: string;
  /** Retention until field on ai routing decision log record. */
  retention_until?: string;
  /** Rule id field on ai routing decision log record. */
  rule_id?: string;
  /** Selected account id field on ai routing decision log record. */
  selected_account_id?: string;
  /** Selected channel id field on ai routing decision log record. */
  selected_channel_id?: string;
  /** Selected provider id field on ai routing decision log record. */
  selected_provider_id?: string;
  /** Status field on ai routing decision log record. */
  status?: string;
  /** Tenant id field on ai routing decision log record. */
  tenant_id?: string;
  /** Trace id field on ai routing decision log record. */
  trace_id?: string;
  /** User id field on ai routing decision log record. */
  user_id?: string;
  /** Uuid field on ai routing decision log record. */
  uuid?: string;
}
