import type { AdminCourseRelationCollectionResponse } from './admin-course-relation-collection-response';

/** Courses relations replace result schema exposed by Claw Router. */
export interface CoursesRelationsReplaceResult {
  /** Business response code. */
  code: string;
  /** Data field on courses relations replace result. */
  data?: AdminCourseRelationCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
