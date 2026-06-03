import { CourseDashboardPage } from './pages/CourseDashboardPage';
import { CourseCatalogPage } from './pages/CourseCatalogPage';
import { CourseSectionsPage } from './pages/CourseSectionsPage';
import { CourseLessonsPage } from './pages/CourseLessonsPage';
import { CourseRelationsPage } from './pages/CourseRelationsPage';
import { CourseApplicationsPage } from './pages/CourseApplicationsPage';
import { CourseCommentsPage } from './pages/CourseCommentsPage';
import { CourseEngagementPage } from './pages/CourseEngagementPage';
import type { CourseAdminSectionId } from './courseAdminTypes';

type CourseAdminProps = {
  sectionId?: string;
};

function resolveSectionId(sectionId: string | undefined): CourseAdminSectionId {
  const valid = new Set<CourseAdminSectionId>([
    'dashboard', 'catalog', 'sections', 'lessons',
    'relations', 'applications', 'comments', 'engagement',
  ]);
  return valid.has(sectionId as CourseAdminSectionId) ? sectionId as CourseAdminSectionId : 'dashboard';
}

export function CourseAdmin({ sectionId }: CourseAdminProps) {
  const activeSection = resolveSectionId(sectionId);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
      {activeSection === 'dashboard' ? (
        <CourseDashboardPage />
      ) : activeSection === 'catalog' ? (
        <CourseCatalogPage />
      ) : activeSection === 'sections' ? (
        <CourseSectionsPage />
      ) : activeSection === 'lessons' ? (
        <CourseLessonsPage />
      ) : activeSection === 'relations' ? (
        <CourseRelationsPage />
      ) : activeSection === 'applications' ? (
        <CourseApplicationsPage />
      ) : activeSection === 'comments' ? (
        <CourseCommentsPage />
      ) : (
        <CourseEngagementPage />
      )}
    </div>
  );
}

export default CourseAdmin;
