import type { JsonValue } from './json-value';

/** Iam verification attempt record schema exposed by Claw Router. */
export interface IamVerificationAttemptRecord {
  /** Challenge id field on iam verification attempt record. */
  challenge_id?: string;
  /** Created at field on iam verification attempt record. */
  created_at?: string;
  /** Device hash field on iam verification attempt record. */
  device_hash?: string;
  /** Failure reason field on iam verification attempt record. */
  failure_reason?: string;
  /** Id field on iam verification attempt record. */
  id?: string;
  /** Ip hash field on iam verification attempt record. */
  ip_hash?: string;
  /** Legal hold field on iam verification attempt record. */
  legal_hold?: boolean;
  /** Metadata field on iam verification attempt record. */
  metadata?: Record<string, JsonValue>;
  /** Occurred at field on iam verification attempt record. */
  occurred_at?: string;
  /** Organization id field on iam verification attempt record. */
  organization_id?: string;
  /** Payload hash field on iam verification attempt record. */
  payload_hash?: string;
  /** Request id field on iam verification attempt record. */
  request_id?: string;
  /** Result field on iam verification attempt record. */
  result?: string;
  /** Retention until field on iam verification attempt record. */
  retention_until?: string;
  /** Risk snapshot field on iam verification attempt record. */
  risk_snapshot?: Record<string, JsonValue>;
  /** Scene code field on iam verification attempt record. */
  scene_code?: string;
  /** Status field on iam verification attempt record. */
  status?: string;
  /** Target hash field on iam verification attempt record. */
  target_hash?: string;
  /** Target type field on iam verification attempt record. */
  target_type?: string;
  /** Tenant id field on iam verification attempt record. */
  tenant_id?: string;
  /** Trace id field on iam verification attempt record. */
  trace_id?: string;
  /** User id field on iam verification attempt record. */
  user_id?: string;
  /** Uuid field on iam verification attempt record. */
  uuid?: string;
}
