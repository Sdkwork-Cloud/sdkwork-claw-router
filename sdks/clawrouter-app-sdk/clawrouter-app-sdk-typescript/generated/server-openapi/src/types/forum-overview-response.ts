import type { ForumCommunityLink } from './forum-community-link';
import type { ForumOverviewSource } from './forum-overview-source';
import type { ForumOverviewStats } from './forum-overview-stats';

/** Forum overview response schema exposed by Claw Router. */
export interface ForumOverviewResponse {
  /** Community links field on forum overview response. */
  communityLinks: ForumCommunityLink[];
  /** Source field on forum overview response. */
  source: ForumOverviewSource;
  /** Stats field on forum overview response. */
  stats: ForumOverviewStats;
}
