import type { JsonValue } from './json-value';

/** Ai usage service provider chain record schema exposed by Claw Router. */
export interface AiUsageServiceProviderChainRecord {
  /** Chain depth field on ai usage service provider chain record. */
  chain_depth?: number;
  /** Chain hash field on ai usage service provider chain record. */
  chain_hash?: string;
  /** Chain path snapshot field on ai usage service provider chain record. */
  chain_path_snapshot?: Record<string, JsonValue>;
  /** Created at field on ai usage service provider chain record. */
  created_at?: string;
  /** Id field on ai usage service provider chain record. */
  id?: string;
  /** Leaf provider id field on ai usage service provider chain record. */
  leaf_provider_id?: string;
  /** Legal hold field on ai usage service provider chain record. */
  legal_hold?: boolean;
  /** Metadata field on ai usage service provider chain record. */
  metadata?: Record<string, JsonValue>;
  /** Occurred at field on ai usage service provider chain record. */
  occurred_at?: string;
  /** Organization id field on ai usage service provider chain record. */
  organization_id?: string;
  /** Payload hash field on ai usage service provider chain record. */
  payload_hash?: string;
  /** Request id field on ai usage service provider chain record. */
  request_id?: string;
  /** Resolved subject id field on ai usage service provider chain record. */
  resolved_subject_id?: string;
  /** Resolved subject type field on ai usage service provider chain record. */
  resolved_subject_type?: string;
  /** Retention until field on ai usage service provider chain record. */
  retention_until?: string;
  /** Root provider id field on ai usage service provider chain record. */
  root_provider_id?: string;
  /** Status field on ai usage service provider chain record. */
  status?: string;
  /** Tenant id field on ai usage service provider chain record. */
  tenant_id?: string;
  /** Trace id field on ai usage service provider chain record. */
  trace_id?: string;
  /** Usage fact id field on ai usage service provider chain record. */
  usage_fact_id?: string;
  /** User id field on ai usage service provider chain record. */
  user_id?: string;
  /** Uuid field on ai usage service provider chain record. */
  uuid?: string;
}
