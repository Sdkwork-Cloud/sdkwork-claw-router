import type { JsonValue } from './json-value';

/** Ai channel group record schema exposed by Claw Router. */
export interface AiChannelGroupRecord {
  /** Allowed origin field on ai channel group record. */
  allowed_origin?: Record<string, JsonValue>;
  /** Billing type field on ai channel group record. */
  billing_type?: string;
  /** Capacity limit field on ai channel group record. */
  capacity_limit?: string;
  /** Created at field on ai channel group record. */
  created_at?: string;
  /** Data scope field on ai channel group record. */
  data_scope?: string;
  /** Deleted at field on ai channel group record. */
  deleted_at?: string;
  /** Deleted by field on ai channel group record. */
  deleted_by?: string;
  /** Description field on ai channel group record. */
  description?: string;
  /** Environment field on ai channel group record. */
  environment?: string;
  /** Group code field on ai channel group record. */
  group_code: string;
  /** Group name field on ai channel group record. */
  group_name: string;
  /** Group type field on ai channel group record. */
  group_type?: string;
  /** Id field on ai channel group record. */
  id?: string;
  /** Metadata field on ai channel group record. */
  metadata?: Record<string, JsonValue>;
  /** Official price multiplier field on ai channel group record. */
  official_price_multiplier?: string;
  /** Organization id field on ai channel group record. */
  organization_id: string;
  /** Price reference mode field on ai channel group record. */
  price_reference_mode?: string;
  /** Pricing plan code field on ai channel group record. */
  pricing_plan_code?: string;
  /** Pricing plan id field on ai channel group record. */
  pricing_plan_id?: string;
  /** Provider code field on ai channel group record. */
  provider_code?: string;
  /** Quota policy id field on ai channel group record. */
  quota_policy_id?: string;
  /** Rate limit policy id field on ai channel group record. */
  rate_limit_policy_id?: string;
  /** Rate multiplier field on ai channel group record. */
  rate_multiplier?: string;
  /** Routing policy id field on ai channel group record. */
  routing_policy_id?: string;
  /** Status field on ai channel group record. */
  status: string;
  /** Tenant id field on ai channel group record. */
  tenant_id: string;
  /** Updated at field on ai channel group record. */
  updated_at?: string;
  /** Uuid field on ai channel group record. */
  uuid: string;
  /** Version field on ai channel group record. */
  version?: string;
}
