import type { JsonValue } from './json-value';

/** Iam verification challenge record schema exposed by Claw Router. */
export interface IamVerificationChallengeRecord {
  /** Challenge status field on iam verification challenge record. */
  challenge_status?: string;
  /** Channel field on iam verification challenge record. */
  channel?: string;
  /** Code hash field on iam verification challenge record. */
  code_hash?: string;
  /** Code id field on iam verification challenge record. */
  code_id?: string;
  /** Consumed at field on iam verification challenge record. */
  consumed_at?: string;
  /** Created at field on iam verification challenge record. */
  created_at?: string;
  /** Data scope field on iam verification challenge record. */
  data_scope?: string;
  /** Deleted at field on iam verification challenge record. */
  deleted_at?: string;
  /** Deleted by field on iam verification challenge record. */
  deleted_by?: string;
  /** Delivery request id field on iam verification challenge record. */
  delivery_request_id?: string;
  /** Expires at field on iam verification challenge record. */
  expires_at?: string;
  /** Hash algorithm field on iam verification challenge record. */
  hash_algorithm?: string;
  /** Id field on iam verification challenge record. */
  id?: string;
  /** Locked until field on iam verification challenge record. */
  locked_until?: string;
  /** Metadata field on iam verification challenge record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on iam verification challenge record. */
  organization_id?: string;
  /** Policy snapshot field on iam verification challenge record. */
  policy_snapshot?: Record<string, JsonValue>;
  /** Salt ref field on iam verification challenge record. */
  salt_ref?: string;
  /** Scene code field on iam verification challenge record. */
  scene_code?: string;
  /** Status field on iam verification challenge record. */
  status?: string;
  /** Target hash field on iam verification challenge record. */
  target_hash?: string;
  /** Target masked field on iam verification challenge record. */
  target_masked?: string;
  /** Target type field on iam verification challenge record. */
  target_type?: string;
  /** Tenant id field on iam verification challenge record. */
  tenant_id?: string;
  /** Updated at field on iam verification challenge record. */
  updated_at?: string;
  /** User id field on iam verification challenge record. */
  user_id?: string;
  /** Uuid field on iam verification challenge record. */
  uuid?: string;
  /** Verified at field on iam verification challenge record. */
  verified_at?: string;
  /** Verify attempts field on iam verification challenge record. */
  verify_attempts?: number;
  /** Version field on iam verification challenge record. */
  version?: string;
}
