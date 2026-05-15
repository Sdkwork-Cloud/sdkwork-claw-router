import type { JsonValue } from './json-value';

/** Content course application record schema exposed by Claw Router. */
export interface ContentCourseApplicationRecord {
  /** Category field on content course application record. */
  category?: string;
  /** Contact email field on content course application record. */
  contact_email?: string;
  /** Contact name field on content course application record. */
  contact_name?: string;
  /** Created at field on content course application record. */
  created_at?: string;
  /** Data scope field on content course application record. */
  data_scope?: string;
  /** Deleted at field on content course application record. */
  deleted_at?: string;
  /** Deleted by field on content course application record. */
  deleted_by?: string;
  /** Description field on content course application record. */
  description?: string;
  /** External bvid field on content course application record. */
  external_bvid?: string;
  /** Id field on content course application record. */
  id?: string;
  /** Metadata field on content course application record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on content course application record. */
  organization_id?: string;
  /** Owner id field on content course application record. */
  owner_id?: string;
  /** Owner type field on content course application record. */
  owner_type?: string;
  /** Review comment field on content course application record. */
  review_comment?: string;
  /** Reviewed at field on content course application record. */
  reviewed_at?: string;
  /** Reviewed by field on content course application record. */
  reviewed_by?: string;
  /** Source provider field on content course application record. */
  source_provider?: string;
  /** Status field on content course application record. */
  status?: string;
  /** Submitted at field on content course application record. */
  submitted_at?: string;
  /** Tenant id field on content course application record. */
  tenant_id?: string;
  /** Title field on content course application record. */
  title?: string;
  /** Updated at field on content course application record. */
  updated_at?: string;
  /** User id field on content course application record. */
  user_id?: string;
  /** Uuid field on content course application record. */
  uuid?: string;
  /** Version field on content course application record. */
  version?: string;
  /** Video url field on content course application record. */
  video_url?: string;
}
