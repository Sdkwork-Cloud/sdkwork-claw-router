import type { AdminCourseCommentCollectionResponse } from './admin-course-comment-collection-response';

/** Course comments moderate result schema exposed by Claw Router. */
export interface CourseCommentsModerateResult {
  /** Business response code. */
  code: string;
  /** Data field on course comments moderate result. */
  data?: AdminCourseCommentCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
