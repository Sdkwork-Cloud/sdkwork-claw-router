import type { ForumCommentPage } from './forum-comment-page';

/** Comments replies list result schema exposed by Claw Router. */
export interface CommentsRepliesListResult {
  /** Business response code. */
  code: string;
  /** Data field on comments replies list result. */
  data?: ForumCommentPage;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
