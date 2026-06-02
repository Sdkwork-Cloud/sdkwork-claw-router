import type { JsonValue } from './json-value';

/** Messaging rate limit bucket record schema exposed by Claw Router. */
export interface MessagingRateLimitBucketRecord {
  /** Channel field on messaging rate limit bucket record. */
  channel?: string;
  /** Created at field on messaging rate limit bucket record. */
  created_at?: string;
  /** Data scope field on messaging rate limit bucket record. */
  data_scope?: string;
  /** Deleted at field on messaging rate limit bucket record. */
  deleted_at?: string;
  /** Deleted by field on messaging rate limit bucket record. */
  deleted_by?: string;
  /** Device hash field on messaging rate limit bucket record. */
  device_hash?: string;
  /** Id field on messaging rate limit bucket record. */
  id?: string;
  /** Ip hash field on messaging rate limit bucket record. */
  ip_hash?: string;
  /** Last event at field on messaging rate limit bucket record. */
  last_event_at?: string;
  /** Metadata field on messaging rate limit bucket record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on messaging rate limit bucket record. */
  organization_id?: string;
  /** Reject count field on messaging rate limit bucket record. */
  reject_count?: number;
  /** Scene code field on messaging rate limit bucket record. */
  scene_code?: string;
  /** Send count field on messaging rate limit bucket record. */
  send_count?: number;
  /** Status field on messaging rate limit bucket record. */
  status?: string;
  /** Target hash field on messaging rate limit bucket record. */
  target_hash?: string;
  /** Tenant id field on messaging rate limit bucket record. */
  tenant_id?: string;
  /** Updated at field on messaging rate limit bucket record. */
  updated_at?: string;
  /** Uuid field on messaging rate limit bucket record. */
  uuid?: string;
  /** Verify count field on messaging rate limit bucket record. */
  verify_count?: number;
  /** Version field on messaging rate limit bucket record. */
  version?: string;
  /** Window seconds field on messaging rate limit bucket record. */
  window_seconds?: number;
  /** Window start field on messaging rate limit bucket record. */
  window_start?: string;
}
