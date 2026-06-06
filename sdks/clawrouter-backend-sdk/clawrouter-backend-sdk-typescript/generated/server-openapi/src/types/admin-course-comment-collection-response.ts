import type { AdminCourseCommentItem } from './admin-course-comment-item';

/** Admin course comment collection response schema exposed by Claw Router. */
export interface AdminCourseCommentCollectionResponse {
  /** Items field on admin course comment collection response. */
  items: AdminCourseCommentItem[];
}
