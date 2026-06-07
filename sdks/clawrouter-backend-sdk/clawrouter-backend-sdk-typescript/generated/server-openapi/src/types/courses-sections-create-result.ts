import type { AdminCourseSectionMutationResponse } from './admin-course-section-mutation-response';

/** Courses sections create result schema exposed by Claw Router. */
export interface CoursesSectionsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on courses sections create result. */
  data?: AdminCourseSectionMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
