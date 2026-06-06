import type { AdminCourseItem } from './admin-course-item';

/** Admin course collection response schema exposed by Claw Router. */
export interface AdminCourseCollectionResponse {
  /** Items field on admin course collection response. */
  items: AdminCourseItem[];
}
