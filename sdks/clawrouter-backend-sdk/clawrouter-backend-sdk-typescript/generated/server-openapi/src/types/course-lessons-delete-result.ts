import type { AdminCourseDeleteResponse } from './admin-course-delete-response';

/** Course lessons delete result schema exposed by Claw Router. */
export interface CourseLessonsDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on course lessons delete result. */
  data?: AdminCourseDeleteResponse;
  /** Human-readable response message. */
  msg?: string;
}
