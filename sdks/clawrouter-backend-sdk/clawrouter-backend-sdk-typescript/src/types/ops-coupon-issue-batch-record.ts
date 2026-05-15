import type { JsonValue } from './json-value';

/** Ops coupon issue batch record schema exposed by Claw Router. */
export interface OpsCouponIssueBatchRecord {
  /** Audience filter field on ops coupon issue batch record. */
  audience_filter?: Record<string, JsonValue>;
  /** Available count field on ops coupon issue batch record. */
  available_count?: string;
  /** Batch no field on ops coupon issue batch record. */
  batch_no?: string;
  /** Campaign code field on ops coupon issue batch record. */
  campaign_code?: string;
  /** Claimed count field on ops coupon issue batch record. */
  claimed_count?: string;
  /** Code pattern field on ops coupon issue batch record. */
  code_pattern?: string;
  /** Code prefix field on ops coupon issue batch record. */
  code_prefix?: string;
  /** Coupon id field on ops coupon issue batch record. */
  coupon_id?: string;
  /** Coupon template id field on ops coupon issue batch record. */
  coupon_template_id?: string;
  /** Created at field on ops coupon issue batch record. */
  created_at?: string;
  /** Created by field on ops coupon issue batch record. */
  created_by?: string;
  /** Data scope field on ops coupon issue batch record. */
  data_scope?: string;
  /** Deleted at field on ops coupon issue batch record. */
  deleted_at?: string;
  /** Deleted by field on ops coupon issue batch record. */
  deleted_by?: string;
  /** Expire at field on ops coupon issue batch record. */
  expire_at?: string;
  /** Generated at field on ops coupon issue batch record. */
  generated_at?: string;
  /** Generated count field on ops coupon issue batch record. */
  generated_count?: string;
  /** Generation status field on ops coupon issue batch record. */
  generation_status?: string;
  /** Id field on ops coupon issue batch record. */
  id?: string;
  /** Metadata field on ops coupon issue batch record. */
  metadata?: Record<string, JsonValue>;
  /** Name field on ops coupon issue batch record. */
  name?: string;
  /** Organization id field on ops coupon issue batch record. */
  organization_id?: string;
  /** Requested count field on ops coupon issue batch record. */
  requested_count?: string;
  /** Status field on ops coupon issue batch record. */
  status?: string;
  /** Tenant id field on ops coupon issue batch record. */
  tenant_id?: string;
  /** Updated at field on ops coupon issue batch record. */
  updated_at?: string;
  /** Used count field on ops coupon issue batch record. */
  used_count?: string;
  /** Uuid field on ops coupon issue batch record. */
  uuid?: string;
  /** Version field on ops coupon issue batch record. */
  version?: string;
  /** Voided count field on ops coupon issue batch record. */
  voided_count?: string;
}
