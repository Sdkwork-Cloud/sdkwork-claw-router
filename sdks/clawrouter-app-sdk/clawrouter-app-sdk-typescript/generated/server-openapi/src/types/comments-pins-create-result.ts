import type { ForumCommentItem } from './forum-comment-item';

/** Comments pins create result schema exposed by Claw Router. */
export interface CommentsPinsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on comments pins create result. */
  data?: ForumCommentItem;
  /** Human-readable response message. */
  msg?: string;
}
