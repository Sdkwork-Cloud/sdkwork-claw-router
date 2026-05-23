import type { ForumCommentPage } from './forum-comment-page';

/** Users current comments list result schema exposed by Claw Router. */
export interface UsersCurrentCommentsListResult {
  /** Business response code. */
  code: string;
  /** Data field on users current comments list result. */
  data?: ForumCommentPage;
  /** Human-readable response message. */
  msg?: string;
}
