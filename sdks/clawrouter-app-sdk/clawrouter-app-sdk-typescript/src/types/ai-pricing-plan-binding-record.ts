import type { JsonValue } from './json-value';

/** Ai pricing plan binding record schema exposed by Claw Router. */
export interface AiPricingPlanBindingRecord {
  /** Binding source field on ai pricing plan binding record. */
  binding_source?: string;
  /** Created at field on ai pricing plan binding record. */
  created_at?: string;
  /** Data scope field on ai pricing plan binding record. */
  data_scope?: string;
  /** Deleted at field on ai pricing plan binding record. */
  deleted_at?: string;
  /** Deleted by field on ai pricing plan binding record. */
  deleted_by?: string;
  /** Effective from field on ai pricing plan binding record. */
  effective_from: string;
  /** Effective to field on ai pricing plan binding record. */
  effective_to?: string;
  /** Id field on ai pricing plan binding record. */
  id?: string;
  /** Metadata field on ai pricing plan binding record. */
  metadata?: Record<string, JsonValue>;
  /** Multiplier override field on ai pricing plan binding record. */
  multiplier_override?: string;
  /** Organization id field on ai pricing plan binding record. */
  organization_id: string;
  /** Pricing plan code field on ai pricing plan binding record. */
  pricing_plan_code?: string;
  /** Pricing plan id field on ai pricing plan binding record. */
  pricing_plan_id: string;
  /** Priority field on ai pricing plan binding record. */
  priority: number;
  /** Quota policy id field on ai pricing plan binding record. */
  quota_policy_id?: string;
  /** Rpm override field on ai pricing plan binding record. */
  rpm_override?: string;
  /** Status field on ai pricing plan binding record. */
  status: string;
  /** Subject code field on ai pricing plan binding record. */
  subject_code?: string;
  /** Subject id field on ai pricing plan binding record. */
  subject_id?: string;
  /** Subject type field on ai pricing plan binding record. */
  subject_type: string;
  /** Tenant id field on ai pricing plan binding record. */
  tenant_id: string;
  /** Tpm override field on ai pricing plan binding record. */
  tpm_override?: string;
  /** Updated at field on ai pricing plan binding record. */
  updated_at?: string;
  /** Uuid field on ai pricing plan binding record. */
  uuid: string;
  /** Version field on ai pricing plan binding record. */
  version?: string;
}
