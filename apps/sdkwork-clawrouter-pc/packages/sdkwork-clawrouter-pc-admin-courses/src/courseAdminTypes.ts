export type CourseAdminSectionId =
  | 'dashboard'
  | 'catalog'
  | 'sections'
  | 'lessons'
  | 'relations'
  | 'applications'
  | 'comments'
  | 'engagement';

export type CourseAdminSectionGroup = 'Overview' | 'Assets' | 'Distribution' | 'Governance';

export interface AdminCourseListParams {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: string;
}