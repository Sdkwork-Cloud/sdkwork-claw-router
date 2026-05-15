import type { JsonValue } from './json-value';

/** Plus feeds record schema exposed by Claw Router. */
export interface PlusFeedsRecord {
  /** Author field on plus feeds record. */
  author?: Record<string, JsonValue>;
  /** Cover images field on plus feeds record. */
  cover_images?: Record<string, JsonValue>;
  /** Publish time field on plus feeds record. */
  publish_time?: string;
  /** Resource list field on plus feeds record. */
  resource_list?: Record<string, JsonValue>;
  /** Source field on plus feeds record. */
  source?: string;
  /** Source url field on plus feeds record. */
  source_url?: string;
  /** Summary field on plus feeds record. */
  summary?: string;
  /** Tags field on plus feeds record. */
  tags?: Record<string, JsonValue>;
  /** User id field on plus feeds record. */
  user_id?: string;
}
