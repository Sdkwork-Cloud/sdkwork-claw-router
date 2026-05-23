import type { ForumCommentItem } from './forum-comment-item';

/** Comments create result schema exposed by Claw Router. */
export interface CommentsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on comments create result. */
  data?: ForumCommentItem;
  /** Human-readable response message. */
  msg?: string;
}
