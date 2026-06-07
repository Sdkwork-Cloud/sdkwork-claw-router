import type { AdminCourseMutationResponse } from './admin-course-mutation-response';

/** Courses update result schema exposed by Claw Router. */
export interface CoursesUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on courses update result. */
  data?: AdminCourseMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
