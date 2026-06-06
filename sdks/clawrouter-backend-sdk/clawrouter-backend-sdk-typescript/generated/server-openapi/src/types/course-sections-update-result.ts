import type { AdminCourseSectionMutationResponse } from './admin-course-section-mutation-response';

/** Course sections update result schema exposed by Claw Router. */
export interface CourseSectionsUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on course sections update result. */
  data?: AdminCourseSectionMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
