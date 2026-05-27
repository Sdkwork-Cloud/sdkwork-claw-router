import type { AdminCourseMutationResponse } from './admin-course-mutation-response';

/** Courses create result schema exposed by Claw Router. */
export interface CoursesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on courses create result. */
  data?: AdminCourseMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
