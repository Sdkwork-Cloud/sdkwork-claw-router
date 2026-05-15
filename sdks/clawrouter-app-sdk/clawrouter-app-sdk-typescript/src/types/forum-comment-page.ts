import type { ForumCommentItem } from './forum-comment-item';

/** Forum comment page schema exposed by Claw Router. */
export interface ForumCommentPage {
  /** Content field on forum comment page. */
  content: ForumCommentItem[];
  /** Items field on forum comment page. */
  items: ForumCommentItem[];
  /** Page field on forum comment page. */
  page: number;
  /** Size field on forum comment page. */
  size: number;
  /** Total elements field on forum comment page. */
  totalElements: number;
}
