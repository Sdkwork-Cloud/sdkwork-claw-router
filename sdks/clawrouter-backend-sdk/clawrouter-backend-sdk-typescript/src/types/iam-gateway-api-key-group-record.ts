import type { JsonValue } from './json-value';

/** Iam gateway api key group record schema exposed by Claw Router. */
export interface IamGatewayApiKeyGroupRecord {
  /** Allowed origin field on iam gateway api key group record. */
  allowed_origin?: Record<string, JsonValue>;
  /** Billing type field on iam gateway api key group record. */
  billing_type?: string;
  /** Capacity limit field on iam gateway api key group record. */
  capacity_limit?: string;
  /** Code field on iam gateway api key group record. */
  code?: string;
  /** Created at field on iam gateway api key group record. */
  created_at?: string;
  /** Data scope field on iam gateway api key group record. */
  data_scope?: string;
  /** Default policy id field on iam gateway api key group record. */
  default_policy_id?: string;
  /** Default quota policy id field on iam gateway api key group record. */
  default_quota_policy_id?: string;
  /** Deleted at field on iam gateway api key group record. */
  deleted_at?: string;
  /** Deleted by field on iam gateway api key group record. */
  deleted_by?: string;
  /** Description field on iam gateway api key group record. */
  description?: string;
  /** Environment field on iam gateway api key group record. */
  environment?: string;
  /** Group type field on iam gateway api key group record. */
  group_type?: string;
  /** Id field on iam gateway api key group record. */
  id?: string;
  /** Metadata field on iam gateway api key group record. */
  metadata?: Record<string, JsonValue>;
  /** Name field on iam gateway api key group record. */
  name?: string;
  /** Official price multiplier field on iam gateway api key group record. */
  official_price_multiplier?: string;
  /** Organization id field on iam gateway api key group record. */
  organization_id?: string;
  /** Price reference mode field on iam gateway api key group record. */
  price_reference_mode?: string;
  /** Pricing plan code field on iam gateway api key group record. */
  pricing_plan_code?: string;
  /** Pricing plan id field on iam gateway api key group record. */
  pricing_plan_id?: string;
  /** Provider code field on iam gateway api key group record. */
  provider_code?: string;
  /** Rate multiplier field on iam gateway api key group record. */
  rate_multiplier?: string;
  /** Status field on iam gateway api key group record. */
  status?: string;
  /** Tenant id field on iam gateway api key group record. */
  tenant_id?: string;
  /** Updated at field on iam gateway api key group record. */
  updated_at?: string;
  /** Uuid field on iam gateway api key group record. */
  uuid?: string;
  /** Version field on iam gateway api key group record. */
  version?: string;
}
