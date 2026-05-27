import type { AdminCourseLessonItem } from './admin-course-lesson-item';

/** Admin course lesson collection response schema exposed by Claw Router. */
export interface AdminCourseLessonCollectionResponse {
  /** Items field on admin course lesson collection response. */
  items: AdminCourseLessonItem[];
}
