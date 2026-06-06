import type { CourseLessonItem } from './course-lesson-item';

/** Course section item schema exposed by Claw Router. */
export interface CourseSectionItem {
  /** Description field on course section item. */
  description: string;
  /** Duration seconds field on course section item. */
  durationSeconds: string;
  /** Id field on course section item. */
  id: string;
  /** Lesson count field on course section item. */
  lessonCount: string;
  /** Lessons field on course section item. */
  lessons: CourseLessonItem[];
  /** Section id field on course section item. */
  sectionId: string;
  /** Section no field on course section item. */
  sectionNo: string;
  /** Sort order field on course section item. */
  sortOrder: string;
  /** Title field on course section item. */
  title: string;
}
