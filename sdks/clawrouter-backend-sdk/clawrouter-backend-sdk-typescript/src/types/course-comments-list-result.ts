import type { AdminCourseCommentCollectionResponse } from './admin-course-comment-collection-response';

/** Course comments list result schema exposed by Claw Router. */
export interface CourseCommentsListResult {
  /** Business response code. */
  code: string;
  /** Data field on course comments list result. */
  data?: AdminCourseCommentCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
