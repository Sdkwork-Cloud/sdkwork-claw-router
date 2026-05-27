/** Admin course dashboard schema exposed by Claw Router. */
export interface AdminCourseDashboard {
  /** Draft courses field on admin course dashboard. */
  draftCourses: number;
  /** Id field on admin course dashboard. */
  id: string;
  /** Published courses field on admin course dashboard. */
  publishedCourses: number;
  /** Review queue field on admin course dashboard. */
  reviewQueue: number;
  /** Total comments field on admin course dashboard. */
  totalComments: number;
  /** Total courses field on admin course dashboard. */
  totalCourses: number;
  /** Total engagement field on admin course dashboard. */
  totalEngagement: number;
  /** Total lessons field on admin course dashboard. */
  totalLessons: number;
  /** Total students field on admin course dashboard. */
  totalStudents: number;
}
