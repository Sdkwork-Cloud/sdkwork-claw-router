import type { CourseCategoryList } from './course-category-list';

/** Courses categories list result schema exposed by Claw Router. */
export interface CoursesCategoriesListResult {
  /** Business response code. */
  code: string;
  /** Data field on courses categories list result. */
  data?: CourseCategoryList;
  /** Human-readable response message. */
  msg?: string;
}
