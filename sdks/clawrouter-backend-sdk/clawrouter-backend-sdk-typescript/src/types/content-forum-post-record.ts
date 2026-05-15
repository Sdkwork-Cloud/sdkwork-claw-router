import type { JsonValue } from './json-value';

/** Content forum post record schema exposed by Claw Router. */
export interface ContentForumPostRecord {
  /** Author id field on content forum post record. */
  author_id?: string;
  /** Author snapshot field on content forum post record. */
  author_snapshot?: Record<string, JsonValue>;
  /** Body field on content forum post record. */
  body?: string;
  /** Category field on content forum post record. */
  category?: string;
  /** Comment count field on content forum post record. */
  comment_count?: string;
  /** Content snippet field on content forum post record. */
  content_snippet?: string;
  /** Created at field on content forum post record. */
  created_at?: string;
  /** Data scope field on content forum post record. */
  data_scope?: string;
  /** Deleted at field on content forum post record. */
  deleted_at?: string;
  /** Deleted by field on content forum post record. */
  deleted_by?: string;
  /** Id field on content forum post record. */
  id?: string;
  /** Last replied at field on content forum post record. */
  last_replied_at?: string;
  /** Like count field on content forum post record. */
  like_count?: string;
  /** Metadata field on content forum post record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on content forum post record. */
  organization_id?: string;
  /** Owner id field on content forum post record. */
  owner_id?: string;
  /** Owner type field on content forum post record. */
  owner_type?: string;
  /** Pinned field on content forum post record. */
  pinned?: boolean;
  /** Status field on content forum post record. */
  status?: string;
  /** Tags field on content forum post record. */
  tags?: Record<string, JsonValue>;
  /** Tenant id field on content forum post record. */
  tenant_id?: string;
  /** Title field on content forum post record. */
  title?: string;
  /** Updated at field on content forum post record. */
  updated_at?: string;
  /** User id field on content forum post record. */
  user_id?: string;
  /** Uuid field on content forum post record. */
  uuid?: string;
  /** Version field on content forum post record. */
  version?: string;
  /** View count field on content forum post record. */
  view_count?: string;
}
