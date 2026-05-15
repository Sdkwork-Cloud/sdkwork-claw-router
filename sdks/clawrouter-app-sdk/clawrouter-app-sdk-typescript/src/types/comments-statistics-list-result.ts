import type { ForumCommentStatistics } from './forum-comment-statistics';

/** Comments statistics list result schema exposed by Claw Router. */
export interface CommentsStatisticsListResult {
  /** Business response code. */
  code: string;
  /** Data field on comments statistics list result. */
  data?: ForumCommentStatistics;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
