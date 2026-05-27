import type { JsonValue } from './json-value';

/** Messaging rate limit bucket record schema exposed by Claw Router. */
export interface MessagingRateLimitBucketRecord {
  /** Created at field on messaging rate limit bucket record. */
  created_at?: string;
  /** Data scope field on messaging rate limit bucket record. */
  data_scope?: string;
  /** Deleted at field on messaging rate limit bucket record. */
  deleted_at?: string;
  /** Deleted by field on messaging rate limit bucket record. */
  deleted_by?: string;
  /** Id field on messaging rate limit bucket record. */
  id?: string;
  /** Last event at field on messaging rate limit bucket record. */
  last_event_at?: string;
  /** Metadata field on messaging rate limit bucket record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on messaging rate limit bucket record. */
  organization_id?: string;
  /** Status field on messaging rate limit bucket record. */
  status?: string;
  /** Tenant id field on messaging rate limit bucket record. */
  tenant_id?: string;
  /** Updated at field on messaging rate limit bucket record. */
  updated_at?: string;
  /** Uuid field on messaging rate limit bucket record. */
  uuid?: string;
  /** Version field on messaging rate limit bucket record. */
  version?: string;
}
