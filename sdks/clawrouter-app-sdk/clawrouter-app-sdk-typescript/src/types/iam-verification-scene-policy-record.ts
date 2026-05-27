import type { JsonValue } from './json-value';

/** Iam verification scene policy record schema exposed by Claw Router. */
export interface IamVerificationScenePolicyRecord {
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
  /** Metadata field on iam verification scene policy record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on iam verification scene policy record. */
  organization_id?: string;
  /** Scene name field on iam verification scene policy record. */
  scene_name?: string;
  /** Status field on iam verification scene policy record. */
  status?: string;
  /** Tenant id field on iam verification scene policy record. */
  tenant_id?: string;
  /** Updated at field on iam verification scene policy record. */
  updated_at?: string;
  /** Uuid field on iam verification scene policy record. */
  uuid?: string;
  /** Version field on iam verification scene policy record. */
  version?: string;
}
