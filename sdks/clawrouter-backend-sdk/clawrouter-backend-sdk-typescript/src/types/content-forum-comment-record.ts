import type { JsonValue } from './json-value';

/** Content forum comment record schema exposed by Claw Router. */
export interface ContentForumCommentRecord {
  /** Author id field on content forum comment record. */
  author_id?: string;
  /** Author snapshot field on content forum comment record. */
  author_snapshot?: Record<string, JsonValue>;
  /** Body field on content forum comment record. */
  body?: string;
  /** Course id field on content forum comment record. */
  course_id?: string;
  /** Created at field on content forum comment record. */
  created_at?: string;
  /** Data scope field on content forum comment record. */
  data_scope?: string;
  /** Deleted at field on content forum comment record. */
  deleted_at?: string;
  /** Deleted by field on content forum comment record. */
  deleted_by?: string;
  /** Id field on content forum comment record. */
  id?: string;
  /** Like count field on content forum comment record. */
  like_count?: string;
  /** Metadata field on content forum comment record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on content forum comment record. */
  organization_id?: string;
  /** Owner id field on content forum comment record. */
  owner_id?: string;
  /** Owner type field on content forum comment record. */
  owner_type?: string;
  /** Parent id field on content forum comment record. */
  parent_id?: string;
  /** Post id field on content forum comment record. */
  post_id?: string;
  /** Root id field on content forum comment record. */
  root_id?: string;
  /** Status field on content forum comment record. */
  status?: string;
  /** Target id field on content forum comment record. */
  target_id?: string;
  /** Target type field on content forum comment record. */
  target_type?: string;
  /** Tenant id field on content forum comment record. */
  tenant_id?: string;
  /** Updated at field on content forum comment record. */
  updated_at?: string;
  /** User id field on content forum comment record. */
  user_id?: string;
  /** Uuid field on content forum comment record. */
  uuid?: string;
  /** Version field on content forum comment record. */
  version?: string;
}
