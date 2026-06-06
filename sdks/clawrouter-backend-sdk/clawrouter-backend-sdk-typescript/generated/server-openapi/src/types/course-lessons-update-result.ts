import type { AdminCourseLessonMutationResponse } from './admin-course-lesson-mutation-response';

/** Course lessons update result schema exposed by Claw Router. */
export interface CourseLessonsUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on course lessons update result. */
  data?: AdminCourseLessonMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
