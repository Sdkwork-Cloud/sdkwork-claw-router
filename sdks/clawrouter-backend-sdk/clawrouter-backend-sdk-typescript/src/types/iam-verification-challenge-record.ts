import type { JsonValue } from './json-value';

/** Iam verification challenge record schema exposed by Claw Router. */
export interface IamVerificationChallengeRecord {
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
  /** Id field on iam verification challenge record. */
  id?: string;
  /** Locked until field on iam verification challenge record. */
  locked_until?: string;
  /** Metadata field on iam verification challenge record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on iam verification challenge record. */
  organization_id?: string;
  /** Salt ref field on iam verification challenge record. */
  salt_ref?: string;
  /** Status field on iam verification challenge record. */
  status?: string;
  /** Target masked field on iam verification challenge record. */
  target_masked?: string;
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
  /** Version field on iam verification challenge record. */
  version?: string;
}
