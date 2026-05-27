import type { AdminCourseEngagementCollectionResponse } from './admin-course-engagement-collection-response';

/** Course engagement list result schema exposed by Claw Router. */
export interface CourseEngagementListResult {
  /** Business response code. */
  code: string;
  /** Data field on course engagement list result. */
  data?: AdminCourseEngagementCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
