import type { ForumCommentItem } from './forum-comment-item';

/** Comments pins current delete result schema exposed by Claw Router. */
export interface CommentsPinsCurrentDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on comments pins current delete result. */
  data?: ForumCommentItem;
  /** Human-readable response message. */
  msg?: string;
}
