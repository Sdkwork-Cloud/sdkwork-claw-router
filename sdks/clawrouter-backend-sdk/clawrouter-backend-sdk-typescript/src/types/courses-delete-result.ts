import type { AdminCourseDeleteResponse } from './admin-course-delete-response';

/** Courses delete result schema exposed by Claw Router. */
export interface CoursesDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on courses delete result. */
  data?: AdminCourseDeleteResponse;
  /** Human-readable response message. */
  msg?: string;
}
