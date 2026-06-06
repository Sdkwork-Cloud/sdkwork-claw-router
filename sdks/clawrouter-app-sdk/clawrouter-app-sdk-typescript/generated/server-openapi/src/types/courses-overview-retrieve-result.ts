import type { CourseOverview } from './course-overview';

/** Courses overview retrieve result schema exposed by Claw Router. */
export interface CoursesOverviewRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on courses overview retrieve result. */
  data?: CourseOverview;
  /** Human-readable response message. */
  msg?: string;
}
