import type { CourseEngagement } from './course-engagement';
import type { CourseInstructor } from './course-instructor';

/** Course item schema exposed by Claw Router. */
export interface CourseItem {
  /** Category field on course item. */
  category: string;
  /** Category label field on course item. */
  categoryLabel: string;
  /** Comment count field on course item. */
  commentCount: number;
  /** Content field on course item. */
  content: string;
  /** Content id field on course item. */
  contentId: number;
  /** Course code field on course item. */
  courseCode: string;
  /** Currency field on course item. */
  currency: string;
  /** Description field on course item. */
  description: string;
  /** Duration text field on course item. */
  durationText: string;
  /** Engagement field on course item. */
  engagement: CourseEngagement;
  /** External bvid field on course item. */
  externalBvid: string;
  /** Id field on course item. */
  id: string;
  /** Instructor field on course item. */
  instructor: CourseInstructor;
  /** Is collection field on course item. */
  isCollection: boolean;
  /** Lessons count field on course item. */
  lessonsCount: number;
  /** Level field on course item. */
  level: number;
  /** Level label field on course item. */
  levelLabel: string;
  /** Price amount field on course item. */
  priceAmount?: string | null;
  /** Published at field on course item. */
  publishedAt: string;
  /** Rating score field on course item. */
  ratingScore: number;
  /** Students count field on course item. */
  studentsCount: number;
  /** Tags field on course item. */
  tags: string[];
  /** Thumbnail url field on course item. */
  thumbnailUrl: string;
  /** Title field on course item. */
  title: string;
}
