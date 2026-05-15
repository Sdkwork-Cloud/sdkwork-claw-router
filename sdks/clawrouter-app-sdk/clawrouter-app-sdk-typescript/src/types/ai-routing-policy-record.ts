import type { JsonValue } from './json-value';

/** Ai routing policy record schema exposed by Claw Router. */
export interface AiRoutingPolicyRecord {
  /** Capability field on ai routing policy record. */
  capability?: string;
  /** Cost ceiling field on ai routing policy record. */
  cost_ceiling?: string;
  /** Created at field on ai routing policy record. */
  created_at?: string;
  /** Currency field on ai routing policy record. */
  currency?: string;
  /** Data scope field on ai routing policy record. */
  data_scope?: string;
  /** Default profile id field on ai routing policy record. */
  default_profile_id?: string;
  /** Deleted at field on ai routing policy record. */
  deleted_at?: string;
  /** Deleted by field on ai routing policy record. */
  deleted_by?: string;
  /** Fallback mode field on ai routing policy record. */
  fallback_mode?: string;
  /** Id field on ai routing policy record. */
  id?: string;
  /** Metadata field on ai routing policy record. */
  metadata?: Record<string, JsonValue>;
  /** Name field on ai routing policy record. */
  name?: string;
  /** Organization id field on ai routing policy record. */
  organization_id?: string;
  /** Policy code field on ai routing policy record. */
  policy_code?: string;
  /** Policy scope field on ai routing policy record. */
  policy_scope?: string;
  /** Slo latency ms field on ai routing policy record. */
  slo_latency_ms?: number;
  /** Slo success rate field on ai routing policy record. */
  slo_success_rate?: string;
  /** Status field on ai routing policy record. */
  status?: string;
  /** Subject id field on ai routing policy record. */
  subject_id?: string;
  /** Tenant id field on ai routing policy record. */
  tenant_id?: string;
  /** Updated at field on ai routing policy record. */
  updated_at?: string;
  /** Uuid field on ai routing policy record. */
  uuid?: string;
  /** Version field on ai routing policy record. */
  version?: string;
}
