import type { ForumBooleanResult } from './forum-boolean-result';

export interface DeleteForumCommentResult {
  /** Business response code. */
  code: string;
  data?: ForumBooleanResult;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
