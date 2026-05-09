import type { ForumCommentPage } from './forum-comment-page';

export interface FetchMyForumCommentsResult {
  /** Business response code. */
  code: string;
  data?: ForumCommentPage;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
