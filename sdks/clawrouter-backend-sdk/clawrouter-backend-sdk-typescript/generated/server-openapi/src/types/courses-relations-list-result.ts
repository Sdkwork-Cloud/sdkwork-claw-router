import type { AdminCourseRelationCollectionResponse } from './admin-course-relation-collection-response';

/** Courses relations list result schema exposed by Claw Router. */
export interface CoursesRelationsListResult {
  /** Business response code. */
  code: string;
  /** Data field on courses relations list result. */
  data?: AdminCourseRelationCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
