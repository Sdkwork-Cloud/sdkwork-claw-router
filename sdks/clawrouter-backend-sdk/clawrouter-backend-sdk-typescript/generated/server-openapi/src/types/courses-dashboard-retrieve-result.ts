import type { AdminCourseDashboardResponse } from './admin-course-dashboard-response';

/** Courses dashboard retrieve result schema exposed by Claw Router. */
export interface CoursesDashboardRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on courses dashboard retrieve result. */
  data?: AdminCourseDashboardResponse;
  /** Human-readable response message. */
  msg?: string;
}
