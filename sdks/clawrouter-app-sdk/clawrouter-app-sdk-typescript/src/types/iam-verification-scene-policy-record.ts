import type { JsonValue } from './json-value';

/** Iam verification scene policy record schema exposed by Claw Router. */
export interface IamVerificationScenePolicyRecord {
  /** Allowed channels field on iam verification scene policy record. */
  allowed_channels?: Record<string, JsonValue>;
  /** Code charset field on iam verification scene policy record. */
  code_charset?: string;
  /** Code length field on iam verification scene policy record. */
  code_length?: number;
  /** Created at field on iam verification scene policy record. */
  created_at?: string;
  /** Data scope field on iam verification scene policy record. */
  data_scope?: string;
  /** Default channel field on iam verification scene policy record. */
  default_channel?: string;
  /** Deleted at field on iam verification scene policy record. */
  deleted_at?: string;
  /** Deleted by field on iam verification scene policy record. */
  deleted_by?: string;
  /** Id field on iam verification scene policy record. */
  id?: string;
  /** Max send per hour field on iam verification scene policy record. */
  max_send_per_hour?: number;
  /** Max verify attempts field on iam verification scene policy record. */
  max_verify_attempts?: number;
  /** Metadata field on iam verification scene policy record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on iam verification scene policy record. */
  organization_id?: string;
  /** Resend interval seconds field on iam verification scene policy record. */
  resend_interval_seconds?: number;
  /** Risk policy field on iam verification scene policy record. */
  risk_policy?: Record<string, JsonValue>;
  /** Rollout policy field on iam verification scene policy record. */
  rollout_policy?: Record<string, JsonValue>;
  /** Scene code field on iam verification scene policy record. */
  scene_code?: string;
  /** Scene name field on iam verification scene policy record. */
  scene_name?: string;
  /** Status field on iam verification scene policy record. */
  status?: string;
  /** Target binding required field on iam verification scene policy record. */
  target_binding_required?: boolean;
  /** Template code field on iam verification scene policy record. */
  template_code?: string;
  /** Tenant id field on iam verification scene policy record. */
  tenant_id?: string;
  /** Ttl seconds field on iam verification scene policy record. */
  ttl_seconds?: number;
  /** Updated at field on iam verification scene policy record. */
  updated_at?: string;
  /** Uuid field on iam verification scene policy record. */
  uuid?: string;
  /** Version field on iam verification scene policy record. */
  version?: string;
}
