import type { ForumCommentItem } from './forum-comment-item';

/** Comments likes current delete result schema exposed by Claw Router. */
export interface CommentsLikesCurrentDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on comments likes current delete result. */
  data?: ForumCommentItem;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
