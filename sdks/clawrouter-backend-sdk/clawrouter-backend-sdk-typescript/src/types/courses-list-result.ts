import type { AdminCourseCollectionResponse } from './admin-course-collection-response';

/** Courses list result schema exposed by Claw Router. */
export interface CoursesListResult {
  /** Business response code. */
  code: string;
  /** Data field on courses list result. */
  data?: AdminCourseCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
