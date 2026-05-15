import type { CourseListResponse } from './course-list-response';

/** Courses list result schema exposed by Claw Router. */
export interface CoursesListResult {
  /** Business response code. */
  code: string;
  /** Data field on courses list result. */
  data?: CourseListResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
