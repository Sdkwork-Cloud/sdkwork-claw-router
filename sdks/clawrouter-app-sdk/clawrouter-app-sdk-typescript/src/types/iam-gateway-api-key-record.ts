import type { JsonValue } from './json-value';

/** Iam gateway api key record schema exposed by Claw Router. */
export interface IamGatewayApiKeyRecord {
  /** Channel group id field on iam gateway api key record. */
  channel_group_id?: string;
  /** Created at field on iam gateway api key record. */
  created_at?: string;
  /** Data scope field on iam gateway api key record. */
  data_scope?: string;
  /** Deleted at field on iam gateway api key record. */
  deleted_at?: string;
  /** Deleted by field on iam gateway api key record. */
  deleted_by?: string;
  /** Environment field on iam gateway api key record. */
  environment?: string;
  /** Expire at field on iam gateway api key record. */
  expire_at?: string;
  /** Hash alg field on iam gateway api key record. */
  hash_alg?: string;
  /** Id field on iam gateway api key record. */
  id?: string;
  /** Idempotency key field on iam gateway api key record. */
  idempotency_key?: string;
  /** Key display masked field on iam gateway api key record. */
  key_display_masked?: string;
  /** Key hash field on iam gateway api key record. */
  key_hash?: string;
  /** Key prefix field on iam gateway api key record. */
  key_prefix?: string;
  /** Last revealed at field on iam gateway api key record. */
  last_revealed_at?: string;
  /** Last used at field on iam gateway api key record. */
  last_used_at?: string;
  /** Last used ip hash field on iam gateway api key record. */
  last_used_ip_hash?: string;
  /** Last used ip masked field on iam gateway api key record. */
  last_used_ip_masked?: string;
  /** Last used ip region field on iam gateway api key record. */
  last_used_ip_region?: string;
  /** Legacy api key id field on iam gateway api key record. */
  legacy_api_key_id?: string;
  /** Metadata field on iam gateway api key record. */
  metadata?: Record<string, JsonValue>;
  /** Name field on iam gateway api key record. */
  name?: string;
  /** Organization id field on iam gateway api key record. */
  organization_id?: string;
  /** Owner id field on iam gateway api key record. */
  owner_id?: string;
  /** Owner type field on iam gateway api key record. */
  owner_type?: string;
  /** Policy id field on iam gateway api key record. */
  policy_id?: string;
  /** Quota policy id field on iam gateway api key record. */
  quota_policy_id?: string;
  /** Rate limit policy id field on iam gateway api key record. */
  rate_limit_policy_id?: string;
  /** Revoked at field on iam gateway api key record. */
  revoked_at?: string;
  /** Revoked by field on iam gateway api key record. */
  revoked_by?: string;
  /** Rotated from key id field on iam gateway api key record. */
  rotated_from_key_id?: string;
  /** Secret version field on iam gateway api key record. */
  secret_version?: string;
  /** Status field on iam gateway api key record. */
  status?: string;
  /** Tenant id field on iam gateway api key record. */
  tenant_id?: string;
  /** Updated at field on iam gateway api key record. */
  updated_at?: string;
  /** User id field on iam gateway api key record. */
  user_id?: string;
  /** Uuid field on iam gateway api key record. */
  uuid?: string;
  /** Version field on iam gateway api key record. */
  version?: string;
}
