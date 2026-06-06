import type { CourseOverviewSource } from './course-overview-source';
import type { CourseOverviewStats } from './course-overview-stats';

/** Course overview schema exposed by Claw Router. */
export interface CourseOverview {
  /** Source field on course overview. */
  source: CourseOverviewSource;
  /** Stats field on course overview. */
  stats: CourseOverviewStats;
}
