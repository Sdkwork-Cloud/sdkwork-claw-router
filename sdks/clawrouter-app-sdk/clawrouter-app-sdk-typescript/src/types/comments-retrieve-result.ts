import type { ForumCommentDetail } from './forum-comment-detail';

/** Comments retrieve result schema exposed by Claw Router. */
export interface CommentsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on comments retrieve result. */
  data?: ForumCommentDetail;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
