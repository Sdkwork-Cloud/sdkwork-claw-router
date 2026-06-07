import type { AdminCourseRelationItem } from './admin-course-relation-item';

/** Admin course relation collection response schema exposed by Claw Router. */
export interface AdminCourseRelationCollectionResponse {
  /** Items field on admin course relation collection response. */
  items: AdminCourseRelationItem[];
}
