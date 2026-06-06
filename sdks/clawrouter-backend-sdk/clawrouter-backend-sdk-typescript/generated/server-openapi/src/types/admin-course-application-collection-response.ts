import type { AdminCourseApplicationItem } from './admin-course-application-item';

/** Admin course application collection response schema exposed by Claw Router. */
export interface AdminCourseApplicationCollectionResponse {
  /** Items field on admin course application collection response. */
  items: AdminCourseApplicationItem[];
}
