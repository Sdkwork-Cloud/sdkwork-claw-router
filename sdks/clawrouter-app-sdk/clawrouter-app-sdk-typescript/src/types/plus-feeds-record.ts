import type { JsonValue } from './json-value';

/** Plus feeds record schema exposed by Claw Router. */
export interface PlusFeedsRecord {
  /** Author field on plus feeds record. */
  author?: Record<string, JsonValue>;
  /** Category id field on plus feeds record. */
  category_id?: string;
  /** Comment count field on plus feeds record. */
  comment_count?: string;
  /** Content id field on plus feeds record. */
  content_id?: string;
  /** Content type field on plus feeds record. */
  content_type?: number;
  /** Cover resources field on plus feeds record. */
  cover_resources?: Record<string, JsonValue>;
  /** Created at field on plus feeds record. */
  created_at?: string;
  /** Data scope field on plus feeds record. */
  data_scope?: number;
  /** Favorite count field on plus feeds record. */
  favorite_count?: string;
  /** Id field on plus feeds record. */
  id?: string;
  /** Is hot field on plus feeds record. */
  is_hot?: boolean;
  /** Is recommended field on plus feeds record. */
  is_recommended?: boolean;
  /** Is top field on plus feeds record. */
  is_top?: boolean;
  /** Like count field on plus feeds record. */
  like_count?: string;
  /** Organization id field on plus feeds record. */
  organization_id?: string;
  /** Publish time field on plus feeds record. */
  publish_time?: string;
  /** Resource list field on plus feeds record. */
  resource_list?: Record<string, JsonValue>;
  /** Share count field on plus feeds record. */
  share_count?: string;
  /** Sort order field on plus feeds record. */
  sort_order?: number;
  /** Source field on plus feeds record. */
  source?: string;
  /** Source url field on plus feeds record. */
  source_url?: string;
  /** Status field on plus feeds record. */
  status?: number;
  /** Summary field on plus feeds record. */
  summary?: string;
  /** Tags field on plus feeds record. */
  tags?: Record<string, JsonValue>;
  /** Tenant id field on plus feeds record. */
  tenant_id?: string;
  /** Title field on plus feeds record. */
  title?: string;
  /** Updated at field on plus feeds record. */
  updated_at?: string;
  /** User id field on plus feeds record. */
  user_id?: string;
  /** Uuid field on plus feeds record. */
  uuid?: string;
  /** V field on plus feeds record. */
  v?: string;
  /** View count field on plus feeds record. */
  view_count?: string;
}
