import type { ForumCommentDetail } from './forum-comment-detail';

export interface FetchForumCommentDetailResult {
  /** Business response code. */
  code: string;
  data?: ForumCommentDetail;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
