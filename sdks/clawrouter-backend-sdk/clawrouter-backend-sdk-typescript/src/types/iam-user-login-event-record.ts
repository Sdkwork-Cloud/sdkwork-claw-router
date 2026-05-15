import type { JsonValue } from './json-value';

/** Iam user login event record schema exposed by Claw Router. */
export interface IamUserLoginEventRecord {
  /** Auth method field on iam user login event record. */
  auth_method?: string;
  /** Auth provider field on iam user login event record. */
  auth_provider?: string;
  /** Client ip hash field on iam user login event record. */
  client_ip_hash?: string;
  /** Client ip masked field on iam user login event record. */
  client_ip_masked?: string;
  /** Client ip region field on iam user login event record. */
  client_ip_region?: string;
  /** Created at field on iam user login event record. */
  created_at?: string;
  /** Device fingerprint hash field on iam user login event record. */
  device_fingerprint_hash?: string;
  /** Device label field on iam user login event record. */
  device_label?: string;
  /** Failure reason code field on iam user login event record. */
  failure_reason_code?: string;
  /** Id field on iam user login event record. */
  id?: string;
  /** Legal hold field on iam user login event record. */
  legal_hold?: boolean;
  /** Login result field on iam user login event record. */
  login_result?: string;
  /** Metadata field on iam user login event record. */
  metadata?: Record<string, JsonValue>;
  /** Mfa verified field on iam user login event record. */
  mfa_verified?: boolean;
  /** Occurred at field on iam user login event record. */
  occurred_at?: string;
  /** Organization id field on iam user login event record. */
  organization_id?: string;
  /** Payload hash field on iam user login event record. */
  payload_hash?: string;
  /** Request id field on iam user login event record. */
  request_id?: string;
  /** Retention until field on iam user login event record. */
  retention_until?: string;
  /** Risk level field on iam user login event record. */
  risk_level?: string;
  /** Session id hash field on iam user login event record. */
  session_id_hash?: string;
  /** Status field on iam user login event record. */
  status?: string;
  /** Tenant id field on iam user login event record. */
  tenant_id?: string;
  /** Trace id field on iam user login event record. */
  trace_id?: string;
  /** User agent hash field on iam user login event record. */
  user_agent_hash?: string;
  /** User id field on iam user login event record. */
  user_id?: string;
  /** Uuid field on iam user login event record. */
  uuid?: string;
}
