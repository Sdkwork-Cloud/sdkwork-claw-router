import type { ForumCommentStatistics } from './forum-comment-statistics';

export interface FetchForumCommentStatisticsResult {
  /** Business response code. */
  code: string;
  data?: ForumCommentStatistics;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
