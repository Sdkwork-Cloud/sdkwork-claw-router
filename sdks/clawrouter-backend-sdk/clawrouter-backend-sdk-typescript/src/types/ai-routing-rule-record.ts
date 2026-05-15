import type { JsonValue } from './json-value';

/** Ai routing rule record schema exposed by Claw Router. */
export interface AiRoutingRuleRecord {
  /** Candidate channels field on ai routing rule record. */
  candidate_channels?: Record<string, JsonValue>;
  /** Constraints field on ai routing rule record. */
  constraints?: Record<string, JsonValue>;
  /** Created at field on ai routing rule record. */
  created_at?: string;
  /** Data scope field on ai routing rule record. */
  data_scope?: string;
  /** Deleted at field on ai routing rule record. */
  deleted_at?: string;
  /** Deleted by field on ai routing rule record. */
  deleted_by?: string;
  /** Effective from field on ai routing rule record. */
  effective_from?: string;
  /** Effective to field on ai routing rule record. */
  effective_to?: string;
  /** Fallback chain field on ai routing rule record. */
  fallback_chain?: Record<string, JsonValue>;
  /** Id field on ai routing rule record. */
  id?: string;
  /** Match expression field on ai routing rule record. */
  match_expression?: Record<string, JsonValue>;
  /** Metadata field on ai routing rule record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai routing rule record. */
  organization_id?: string;
  /** Priority field on ai routing rule record. */
  priority?: number;
  /** Profile id field on ai routing rule record. */
  profile_id?: string;
  /** Rate limit policy id field on ai routing rule record. */
  rate_limit_policy_id?: string;
  /** Rule code field on ai routing rule record. */
  rule_code?: string;
  /** Status field on ai routing rule record. */
  status?: string;
  /** Target model field on ai routing rule record. */
  target_model?: string;
  /** Tenant id field on ai routing rule record. */
  tenant_id?: string;
  /** Updated at field on ai routing rule record. */
  updated_at?: string;
  /** Uuid field on ai routing rule record. */
  uuid?: string;
  /** Version field on ai routing rule record. */
  version?: string;
}
