import type { JsonValue } from './json-value';

/** Ai rate limit bucket record schema exposed by Claw Router. */
export interface AiRateLimitBucketRecord {
  /** Bucket key field on ai rate limit bucket record. */
  bucket_key?: string;
  /** Created at field on ai rate limit bucket record. */
  created_at?: string;
  /** Current count field on ai rate limit bucket record. */
  current_count?: string;
  /** Current tokens field on ai rate limit bucket record. */
  current_tokens?: string;
  /** Id field on ai rate limit bucket record. */
  id?: string;
  /** Last request at field on ai rate limit bucket record. */
  last_request_at?: string;
  /** Metadata field on ai rate limit bucket record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai rate limit bucket record. */
  organization_id?: string;
  /** Quota policy id field on ai rate limit bucket record. */
  quota_policy_id?: string;
  /** Rebuild version field on ai rate limit bucket record. */
  rebuild_version?: string;
  /** Remaining count field on ai rate limit bucket record. */
  remaining_count?: string;
  /** Remaining tokens field on ai rate limit bucket record. */
  remaining_tokens?: string;
  /** Source id field on ai rate limit bucket record. */
  source_id?: string;
  /** Source type field on ai rate limit bucket record. */
  source_type?: string;
  /** Source version field on ai rate limit bucket record. */
  source_version?: string;
  /** Status field on ai rate limit bucket record. */
  status?: string;
  /** Subject id field on ai rate limit bucket record. */
  subject_id?: string;
  /** Subject type field on ai rate limit bucket record. */
  subject_type?: string;
  /** Tenant id field on ai rate limit bucket record. */
  tenant_id?: string;
  /** Updated at field on ai rate limit bucket record. */
  updated_at?: string;
  /** Uuid field on ai rate limit bucket record. */
  uuid?: string;
  /** Window end field on ai rate limit bucket record. */
  window_end?: string;
  /** Window start field on ai rate limit bucket record. */
  window_start?: string;
}
