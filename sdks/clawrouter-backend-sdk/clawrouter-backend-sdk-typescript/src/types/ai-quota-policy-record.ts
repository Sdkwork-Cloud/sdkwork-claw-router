import type { JsonValue } from './json-value';

/** Ai quota policy record schema exposed by Claw Router. */
export interface AiQuotaPolicyRecord {
  /** Block duration seconds field on ai quota policy record. */
  block_duration_seconds?: string;
  /** Burst limit field on ai quota policy record. */
  burst_limit?: string;
  /** Created at field on ai quota policy record. */
  created_at?: string;
  /** Data scope field on ai quota policy record. */
  data_scope?: string;
  /** Deleted at field on ai quota policy record. */
  deleted_at?: string;
  /** Deleted by field on ai quota policy record. */
  deleted_by?: string;
  /** Effective from field on ai quota policy record. */
  effective_from?: string;
  /** Effective to field on ai quota policy record. */
  effective_to?: string;
  /** Exhausted at field on ai quota policy record. */
  exhausted_at?: string;
  /** Group id field on ai quota policy record. */
  group_id?: string;
  /** Id field on ai quota policy record. */
  id?: string;
  /** Metadata field on ai quota policy record. */
  metadata?: Record<string, JsonValue>;
  /** Model field on ai quota policy record. */
  model?: string;
  /** Name field on ai quota policy record. */
  name?: string;
  /** Organization id field on ai quota policy record. */
  organization_id?: string;
  /** Policy code field on ai quota policy record. */
  policy_code?: string;
  /** Quota limit field on ai quota policy record. */
  quota_limit?: string;
  /** Quota period field on ai quota policy record. */
  quota_period?: string;
  /** Quota unit field on ai quota policy record. */
  quota_unit?: string;
  /** Requests per day field on ai quota policy record. */
  requests_per_day?: string;
  /** Requests per minute field on ai quota policy record. */
  requests_per_minute?: string;
  /** Requests per second field on ai quota policy record. */
  requests_per_second?: string;
  /** Reset mode field on ai quota policy record. */
  reset_mode?: string;
  /** Scope id field on ai quota policy record. */
  scope_id?: string;
  /** Scope type field on ai quota policy record. */
  scope_type?: string;
  /** Status field on ai quota policy record. */
  status?: string;
  /** Subject id field on ai quota policy record. */
  subject_id?: string;
  /** Subject ref hash field on ai quota policy record. */
  subject_ref_hash?: string;
  /** Subject ref masked field on ai quota policy record. */
  subject_ref_masked?: string;
  /** Subject type field on ai quota policy record. */
  subject_type?: string;
  /** Tenant id field on ai quota policy record. */
  tenant_id?: string;
  /** Tokens per minute field on ai quota policy record. */
  tokens_per_minute?: string;
  /** Updated at field on ai quota policy record. */
  updated_at?: string;
  /** Uuid field on ai quota policy record. */
  uuid?: string;
  /** Version field on ai quota policy record. */
  version?: string;
}
