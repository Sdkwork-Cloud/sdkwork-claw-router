import type { CourseItem } from './course-item';

/** Course list response schema exposed by Claw Router. */
export interface CourseListResponse {
  /** Content field on course list response. */
  content: CourseItem[];
  /** Items field on course list response. */
  items: CourseItem[];
  /** Page field on course list response. */
  page: string;
  /** Size field on course list response. */
  size: string;
  /** Total elements field on course list response. */
  totalElements: string;
}
