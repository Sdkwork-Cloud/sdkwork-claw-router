import type { AdminCourseDeleteResponse } from './admin-course-delete-response';

/** Course sections delete result schema exposed by Claw Router. */
export interface CourseSectionsDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on course sections delete result. */
  data?: AdminCourseDeleteResponse;
  /** Human-readable response message. */
  msg?: string;
}
