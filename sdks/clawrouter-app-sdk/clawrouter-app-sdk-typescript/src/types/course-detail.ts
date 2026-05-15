import type { CourseEngagement } from './course-engagement';
import type { CourseInstructor } from './course-instructor';
import type { CourseItem } from './course-item';
import type { CourseOverviewSource } from './course-overview-source';
import type { CourseSectionItem } from './course-section-item';

/** Course detail schema exposed by Claw Router. */
export interface CourseDetail {
  /** Category field on course detail. */
  category: string;
  /** Category label field on course detail. */
  categoryLabel: string;
  /** Comment count field on course detail. */
  commentCount: number;
  /** Content field on course detail. */
  content: string;
  /** Content id field on course detail. */
  contentId: number;
  /** Course code field on course detail. */
  courseCode: string;
  /** Currency field on course detail. */
  currency: string;
  /** Description field on course detail. */
  description: string;
  /** Duration text field on course detail. */
  durationText: string;
  /** Engagement field on course detail. */
  engagement: CourseEngagement;
  /** External bvid field on course detail. */
  externalBvid: string;
  /** Id field on course detail. */
  id: string;
  /** Instructor field on course detail. */
  instructor: CourseInstructor;
  /** Is collection field on course detail. */
  isCollection: boolean;
  /** Lessons count field on course detail. */
  lessonsCount: number;
  /** Level field on course detail. */
  level: number;
  /** Level label field on course detail. */
  levelLabel: string;
  /** Price amount field on course detail. */
  priceAmount?: string | null;
  /** Published at field on course detail. */
  publishedAt: string;
  /** Rating score field on course detail. */
  ratingScore: number;
  /** Related courses field on course detail. */
  relatedCourses: CourseItem[];
  /** Sections field on course detail. */
  sections: CourseSectionItem[];
  /** Source field on course detail. */
  source: CourseOverviewSource;
  /** Students count field on course detail. */
  studentsCount: number;
  /** Tags field on course detail. */
  tags: string[];
  /** Thumbnail url field on course detail. */
  thumbnailUrl: string;
  /** Title field on course detail. */
  title: string;
}
