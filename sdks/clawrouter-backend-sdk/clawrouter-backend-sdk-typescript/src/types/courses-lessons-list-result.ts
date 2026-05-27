import type { AdminCourseLessonCollectionResponse } from './admin-course-lesson-collection-response';

/** Courses lessons list result schema exposed by Claw Router. */
export interface CoursesLessonsListResult {
  /** Business response code. */
  code: string;
  /** Data field on courses lessons list result. */
  data?: AdminCourseLessonCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
