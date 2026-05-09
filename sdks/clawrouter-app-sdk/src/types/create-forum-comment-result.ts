import type { ForumCommentItem } from './forum-comment-item';

export interface CreateForumCommentResult {
  /** Business response code. */
  code: string;
  data?: ForumCommentItem;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
