import type { JsonValue } from './json-value';

/** Plus favorite record schema exposed by Claw Router. */
export interface PlusFavoriteRecord {
  /** Folder id field on plus favorite record. */
  folder_id?: string;
  /** Image field on plus favorite record. */
  image?: Record<string, JsonValue>;
  /** Last viewed at field on plus favorite record. */
  last_viewed_at?: string;
  /** Remark field on plus favorite record. */
  remark?: string;
  /** Tags field on plus favorite record. */
  tags?: string;
  /** Title field on plus favorite record. */
  title?: string;
  /** User id field on plus favorite record. */
  user_id?: string;
}
