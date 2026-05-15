import type { ForumCommentItem } from './forum-comment-item';

/** Comments reply create result schema exposed by Claw Router. */
export interface CommentsReplyCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on comments reply create result. */
  data?: ForumCommentItem;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
