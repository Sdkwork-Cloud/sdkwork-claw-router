import type { AdminCourseApplicationReviewResponse } from './admin-course-application-review-response';

/** Course applications review result schema exposed by Claw Router. */
export interface CourseApplicationsReviewResult {
  /** Business response code. */
  code: string;
  /** Data field on course applications review result. */
  data?: AdminCourseApplicationReviewResponse;
  /** Human-readable response message. */
  msg?: string;
}
