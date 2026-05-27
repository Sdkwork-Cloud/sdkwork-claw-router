import type { AdminCourseSectionItem } from './admin-course-section-item';

/** Admin course section collection response schema exposed by Claw Router. */
export interface AdminCourseSectionCollectionResponse {
  /** Items field on admin course section collection response. */
  items: AdminCourseSectionItem[];
}
