import type { AdminCourseApplicationCollectionResponse } from './admin-course-application-collection-response';

/** Course applications list result schema exposed by Claw Router. */
export interface CourseApplicationsListResult {
  /** Business response code. */
  code: string;
  /** Data field on course applications list result. */
  data?: AdminCourseApplicationCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
