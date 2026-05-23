import type { ForumCommentPage } from './forum-comment-page';

/** Comments list result schema exposed by Claw Router. */
export interface CommentsListResult {
  /** Business response code. */
  code: string;
  /** Data field on comments list result. */
  data?: ForumCommentPage;
  /** Human-readable response message. */
  msg?: string;
}
