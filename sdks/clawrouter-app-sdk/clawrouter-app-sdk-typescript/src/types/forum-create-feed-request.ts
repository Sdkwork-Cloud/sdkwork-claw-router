/** Forum create feed request schema exposed by Claw Router. */
export interface ForumCreateFeedRequest {
  /** Category id field on forum create feed request. */
  categoryId?: number;
  /** Content field on forum create feed request. */
  content: string;
  /** Images field on forum create feed request. */
  images?: string[];
  /** Source field on forum create feed request. */
  source?: string;
  /** Source url field on forum create feed request. */
  sourceUrl?: string;
  /** Tags field on forum create feed request. */
  tags?: string[];
  /** Title field on forum create feed request. */
  title?: string;
}
