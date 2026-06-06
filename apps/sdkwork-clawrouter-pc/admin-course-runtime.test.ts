import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

test("admin course center is an independent admin module with header and routes", () => {
  const appSource = readPortalFile("./src/App.tsx");
  const registrySource = readPortalFile("./src/adminModuleRegistry.ts");
  const packageJson = readPortalFile("./package.json");
  const i18nSource = readPortalFile("./packages/sdkwork-clawrouter-pc-i18n/src/index.ts");

  assert.match(appSource, /import\('sdkwork-clawrouter-pc-admin-courses'\)/);
  assert.match(appSource, /const CourseAdmin = lazyRoute<AdminSectionRouteProps>\(\(\) => import\('sdkwork-clawrouter-pc-admin-courses'\), 'CourseAdmin'\)/);
  assert.match(appSource, /<Route path="courses" element=\{<Navigate to="\/admin\/courses\/dashboard" replace \/>\} \/>/);
  for (const route of ["dashboard", "catalog", "sections", "lessons", "relations", "applications", "comments", "engagement"]) {
    assert.match(appSource, new RegExp(`<Route path="courses/${route}" element=\\{<CourseAdmin sectionId="${route}" />\\} />`));
  }

  assert.match(packageJson, /"sdkwork-clawrouter-pc-admin-courses": "workspace:\*"/);
  assert.match(registrySource, /export type AdminModuleId =[\s\S]*'courseCenter'/);
  assert.match(registrySource, /id: 'courseCenter'/);
  assert.match(registrySource, /nameKey: 'admin.header.courseCenter'/);
  assert.match(registrySource, /defaultPath: '\/admin\/courses\/dashboard'/);
  assert.match(registrySource, /pathPrefixes: \['\/admin\/courses'\]/);

  assert.match(registrySource, /moduleId: 'courseCenter'/);
  for (const key of [
    "admin.menu.courseCenter.overview",
    "admin.menu.courseCenter.assets",
    "admin.menu.courseCenter.distribution",
    "admin.menu.courseCenter.governance",
    "admin.menu.courseDashboard",
    "admin.menu.courseCatalog",
    "admin.menu.courseSections",
    "admin.menu.courseLessons",
    "admin.menu.courseRelations",
    "admin.menu.courseApplications",
    "admin.menu.courseComments",
    "admin.menu.courseEngagement",
  ]) {
    assert.match(registrySource + i18nSource, new RegExp(escapeRegExp(key)));
  }
});

test("admin course package uses generated backend SDK and owns only course management", () => {
  const packageJson = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-courses/package.json");
  const pageSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-courses/src/index.tsx");
  const shellSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-courses/src/components/CoursePageShell.tsx");
  const tableControlsSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-courses/src/components/CourseTableControls.tsx");
  const splitPageSource = [
    "./packages/sdkwork-clawrouter-pc-admin-courses/src/pages/CourseApplicationsPage.tsx",
    "./packages/sdkwork-clawrouter-pc-admin-courses/src/pages/CourseCatalogPage.tsx",
    "./packages/sdkwork-clawrouter-pc-admin-courses/src/pages/CourseCommentsPage.tsx",
    "./packages/sdkwork-clawrouter-pc-admin-courses/src/pages/CourseDashboardPage.tsx",
    "./packages/sdkwork-clawrouter-pc-admin-courses/src/pages/CourseEngagementPage.tsx",
    "./packages/sdkwork-clawrouter-pc-admin-courses/src/pages/CourseLessonsPage.tsx",
    "./packages/sdkwork-clawrouter-pc-admin-courses/src/pages/CourseRelationsPage.tsx",
    "./packages/sdkwork-clawrouter-pc-admin-courses/src/pages/CourseSectionsPage.tsx",
  ].map(readPortalFile).join("\n");
  const packageSource = `${pageSource}\n${splitPageSource}`;
  const serviceSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-courses/src/courseAdminService.ts");

  assert.match(packageJson, /"name": "sdkwork-clawrouter-pc-admin-courses"/);
  assert.match(packageJson, /"type": "module"/);
  assert.match(packageJson, /"typecheck": "tsc --noEmit"/);
  assert.match(pageSource, /export function CourseAdmin/);
  assert.match(packageSource, /CourseAdminService\.fetchDashboard/);
  assert.match(packageSource, /CourseAdminService\.fetchCourses/);
  assert.match(packageSource, /CourseAdminService\.fetchApplications/);
  assert.match(packageSource, /CourseAdminService\.fetchComments/);
  assert.match(pageSource, /className="flex h-full min-h-0 flex-col gap-4 overflow-hidden"/);
  assert.match(shellSource, /className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden"/);
  assert.match(tableControlsSource, /className=\{\['min-h-0 flex-1 overflow-auto rounded-xl/);

  assert.match(serviceSource, /getClawRouterBackendSdkClient\(\)\.content\.courses\.dashboard\.retrieve\(/);
  assert.match(serviceSource, /getClawRouterBackendSdkClient\(\)\.content\.courses\.list\(/);
  assert.match(serviceSource, /getClawRouterBackendSdkClient\(\)\.content\.courses\.sections\.list\(/);
  assert.match(serviceSource, /getClawRouterBackendSdkClient\(\)\.content\.courses\.lessons\.list\(/);
  assert.match(serviceSource, /getClawRouterBackendSdkClient\(\)\.content\.courses\.relations\.list\(/);
  assert.match(serviceSource, /getClawRouterBackendSdkClient\(\)\.content\.courseApplications\.list\(/);
  assert.match(serviceSource, /getClawRouterBackendSdkClient\(\)\.content\.courseComments\.list\(/);
  assert.match(serviceSource, /getClawRouterBackendSdkClient\(\)\.content\.courseEngagement\.list\(/);

  for (const forbidden of [
    "fetch(",
    "axios",
    "XMLHttpRequest",
    "getClawRouterAppSdkClient",
    "commerce.",
    "wallet.",
    "payments.",
    "orders.",
  ]) {
    assert.doesNotMatch(serviceSource, new RegExp(escapeRegExp(forbidden)));
  }
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
