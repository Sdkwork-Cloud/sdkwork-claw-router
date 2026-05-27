import type { AdminCourseLessonMutationResponse } from './admin-course-lesson-mutation-response';

/** Courses lessons create result schema exposed by Claw Router. */
export interface CoursesLessonsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on courses lessons create result. */
  data?: AdminCourseLessonMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
