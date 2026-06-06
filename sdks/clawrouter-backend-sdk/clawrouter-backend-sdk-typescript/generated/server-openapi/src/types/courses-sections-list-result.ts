import type { AdminCourseSectionCollectionResponse } from './admin-course-section-collection-response';

/** Courses sections list result schema exposed by Claw Router. */
export interface CoursesSectionsListResult {
  /** Business response code. */
  code: string;
  /** Data field on courses sections list result. */
  data?: AdminCourseSectionCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
