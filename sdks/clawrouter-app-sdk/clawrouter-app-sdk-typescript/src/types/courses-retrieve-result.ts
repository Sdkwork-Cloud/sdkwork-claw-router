import type { CourseDetail } from './course-detail';

/** Courses retrieve result schema exposed by Claw Router. */
export interface CoursesRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on courses retrieve result. */
  data?: CourseDetail;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
