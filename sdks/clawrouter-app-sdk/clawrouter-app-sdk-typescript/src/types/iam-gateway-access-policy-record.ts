import type { JsonValue } from './json-value';

/** Iam gateway access policy record schema exposed by Claw Router. */
export interface IamGatewayAccessPolicyRecord {
  /** Allowed capabilities field on iam gateway access policy record. */
  allowed_capabilities?: Record<string, JsonValue>;
  /** Allowed models field on iam gateway access policy record. */
  allowed_models?: Record<string, JsonValue>;
  /** Created at field on iam gateway access policy record. */
  created_at?: string;
  /** Data retention mode field on iam gateway access policy record. */
  data_retention_mode?: string;
  /** Data scope field on iam gateway access policy record. */
  data_scope?: string;
  /** Deleted at field on iam gateway access policy record. */
  deleted_at?: string;
  /** Deleted by field on iam gateway access policy record. */
  deleted_by?: string;
  /** Denied capabilities field on iam gateway access policy record. */
  denied_capabilities?: Record<string, JsonValue>;
  /** Denied models field on iam gateway access policy record. */
  denied_models?: Record<string, JsonValue>;
  /** Effective from field on iam gateway access policy record. */
  effective_from?: string;
  /** Effective to field on iam gateway access policy record. */
  effective_to?: string;
  /** Id field on iam gateway access policy record. */
  id?: string;
  /** Ip allowlist field on iam gateway access policy record. */
  ip_allowlist?: Record<string, JsonValue>;
  /** Ip denylist field on iam gateway access policy record. */
  ip_denylist?: Record<string, JsonValue>;
  /** Ip rule count field on iam gateway access policy record. */
  ip_rule_count?: number;
  /** Max context tokens field on iam gateway access policy record. */
  max_context_tokens?: string;
  /** Metadata field on iam gateway access policy record. */
  metadata?: Record<string, JsonValue>;
  /** Name field on iam gateway access policy record. */
  name?: string;
  /** Network policy mode field on iam gateway access policy record. */
  network_policy_mode?: string;
  /** Organization id field on iam gateway access policy record. */
  organization_id?: string;
  /** Policy type field on iam gateway access policy record. */
  policy_type?: string;
  /** Region allowlist field on iam gateway access policy record. */
  region_allowlist?: Record<string, JsonValue>;
  /** Status field on iam gateway access policy record. */
  status?: string;
  /** Subject id field on iam gateway access policy record. */
  subject_id?: string;
  /** Subject ref hash field on iam gateway access policy record. */
  subject_ref_hash?: string;
  /** Subject ref masked field on iam gateway access policy record. */
  subject_ref_masked?: string;
  /** Subject type field on iam gateway access policy record. */
  subject_type?: string;
  /** Tenant id field on iam gateway access policy record. */
  tenant_id?: string;
  /** Updated at field on iam gateway access policy record. */
  updated_at?: string;
  /** Uuid field on iam gateway access policy record. */
  uuid?: string;
  /** Version field on iam gateway access policy record. */
  version?: string;
}
