import type { ForumCommentItem } from './forum-comment-item';

/** Comments likes create result schema exposed by Claw Router. */
export interface CommentsLikesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on comments likes create result. */
  data?: ForumCommentItem;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
