import type { JsonValue } from './json-value';

/** Iam gateway risk rule record schema exposed by Claw Router. */
export interface IamGatewayRiskRuleRecord {
  /** Action field on iam gateway risk rule record. */
  action?: string;
  /** Block duration seconds field on iam gateway risk rule record. */
  block_duration_seconds?: string;
  /** Burst limit field on iam gateway risk rule record. */
  burst_limit?: string;
  /** Created at field on iam gateway risk rule record. */
  created_at?: string;
  /** Data scope field on iam gateway risk rule record. */
  data_scope?: string;
  /** Deleted at field on iam gateway risk rule record. */
  deleted_at?: string;
  /** Deleted by field on iam gateway risk rule record. */
  deleted_by?: string;
  /** Effective from field on iam gateway risk rule record. */
  effective_from?: string;
  /** Effective to field on iam gateway risk rule record. */
  effective_to?: string;
  /** Hit count field on iam gateway risk rule record. */
  hit_count?: string;
  /** Id field on iam gateway risk rule record. */
  id?: string;
  /** Last hit at field on iam gateway risk rule record. */
  last_hit_at?: string;
  /** Match mode field on iam gateway risk rule record. */
  match_mode?: string;
  /** Metadata field on iam gateway risk rule record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on iam gateway risk rule record. */
  organization_id?: string;
  /** Priority field on iam gateway risk rule record. */
  priority?: number;
  /** Reason field on iam gateway risk rule record. */
  reason?: string;
  /** Requests per day field on iam gateway risk rule record. */
  requests_per_day?: string;
  /** Requests per minute field on iam gateway risk rule record. */
  requests_per_minute?: string;
  /** Requests per second field on iam gateway risk rule record. */
  requests_per_second?: string;
  /** Rule category field on iam gateway risk rule record. */
  rule_category?: string;
  /** Rule name field on iam gateway risk rule record. */
  rule_name?: string;
  /** Rule type field on iam gateway risk rule record. */
  rule_type?: string;
  /** Scope id field on iam gateway risk rule record. */
  scope_id?: string;
  /** Scope type field on iam gateway risk rule record. */
  scope_type?: string;
  /** Status field on iam gateway risk rule record. */
  status?: string;
  /** Target type field on iam gateway risk rule record. */
  target_type?: string;
  /** Target value field on iam gateway risk rule record. */
  target_value?: string;
  /** Target value cipher ref field on iam gateway risk rule record. */
  target_value_cipher_ref?: string;
  /** Target value hash field on iam gateway risk rule record. */
  target_value_hash?: string;
  /** Target value masked field on iam gateway risk rule record. */
  target_value_masked?: string;
  /** Tenant id field on iam gateway risk rule record. */
  tenant_id?: string;
  /** Tokens per minute field on iam gateway risk rule record. */
  tokens_per_minute?: string;
  /** Updated at field on iam gateway risk rule record. */
  updated_at?: string;
  /** Uuid field on iam gateway risk rule record. */
  uuid?: string;
  /** Version field on iam gateway risk rule record. */
  version?: string;
}
