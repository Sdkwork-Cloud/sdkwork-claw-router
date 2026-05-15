import type { JsonValue } from './json-value';

/** Content announcement record schema exposed by Claw Router. */
export interface ContentAnnouncementRecord {
  /** Announcement type field on content announcement record. */
  announcement_type?: string;
  /** Audience filter field on content announcement record. */
  audience_filter?: Record<string, JsonValue>;
  /** Content field on content announcement record. */
  content?: string;
  /** Created at field on content announcement record. */
  created_at?: string;
  /** Data scope field on content announcement record. */
  data_scope?: string;
  /** Deleted at field on content announcement record. */
  deleted_at?: string;
  /** Deleted by field on content announcement record. */
  deleted_by?: string;
  /** Effective from field on content announcement record. */
  effective_from?: string;
  /** Effective to field on content announcement record. */
  effective_to?: string;
  /** Id field on content announcement record. */
  id?: string;
  /** Metadata field on content announcement record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on content announcement record. */
  organization_id?: string;
  /** Pinned field on content announcement record. */
  pinned?: boolean;
  /** Published at field on content announcement record. */
  published_at?: string;
  /** Status field on content announcement record. */
  status?: string;
  /** Target scope field on content announcement record. */
  target_scope?: string;
  /** Tenant id field on content announcement record. */
  tenant_id?: string;
  /** Title field on content announcement record. */
  title?: string;
  /** Updated at field on content announcement record. */
  updated_at?: string;
  /** Uuid field on content announcement record. */
  uuid?: string;
  /** Version field on content announcement record. */
  version?: string;
}
