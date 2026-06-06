import json
import unittest
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]
CONTRACT_PATH = ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
BACKEND_OPENAPI_PATH = ROOT / "generated" / "openapi" / "clawrouter-backend-openapi.json"
BACKEND_CONTENT_API_PATH = (
    ROOT
    / "sdks"
    / "clawrouter-backend-sdk"
    / "clawrouter-backend-sdk-typescript"
    / "src"
    / "api"
    / "content.ts"
)
PORTAL_PACKAGE_ROOT = (
    ROOT
    / "apps"
    / "sdkwork-clawrouter-pc"
    / "packages"
    / "sdkwork-clawrouter-pc-admin-courses"
)


class AdminCourseRuntimeStandardTest(unittest.TestCase):
    def test_backend_course_management_contract_is_complete(self) -> None:
        contract = yaml.safe_load(CONTRACT_PATH.read_text(encoding="utf-8"))
        operations = {
            operation["operation"]: operation
            for operation in contract.get("frontend_operations", [])
            if operation.get("module") == "admin-courses"
        }

        expected = {
            "fetchCourseDashboard": ("GET", "/backend/v3/api/content/courses/dashboard"),
            "fetchAdminCourses": ("GET", "/backend/v3/api/content/courses"),
            "createAdminCourse": ("POST", "/backend/v3/api/content/courses"),
            "updateAdminCourse": ("PATCH", "/backend/v3/api/content/courses/{courseId}"),
            "deleteAdminCourse": ("DELETE", "/backend/v3/api/content/courses/{courseId}"),
            "fetchAdminCourseSections": ("GET", "/backend/v3/api/content/courses/{courseId}/sections"),
            "createAdminCourseSection": ("POST", "/backend/v3/api/content/courses/{courseId}/sections"),
            "updateAdminCourseSection": ("PATCH", "/backend/v3/api/content/course-sections/{sectionId}"),
            "deleteAdminCourseSection": ("DELETE", "/backend/v3/api/content/course-sections/{sectionId}"),
            "fetchAdminCourseLessons": ("GET", "/backend/v3/api/content/courses/{courseId}/lessons"),
            "createAdminCourseLesson": ("POST", "/backend/v3/api/content/courses/{courseId}/lessons"),
            "updateAdminCourseLesson": ("PATCH", "/backend/v3/api/content/course-lessons/{lessonId}"),
            "deleteAdminCourseLesson": ("DELETE", "/backend/v3/api/content/course-lessons/{lessonId}"),
            "fetchAdminCourseRelations": ("GET", "/backend/v3/api/content/courses/{courseId}/relations"),
            "replaceAdminCourseRelations": ("PUT", "/backend/v3/api/content/courses/{courseId}/relations"),
            "fetchAdminCourseApplications": ("GET", "/backend/v3/api/content/course-applications"),
            "reviewAdminCourseApplication": ("PATCH", "/backend/v3/api/content/course-applications/{applicationId}/review"),
            "fetchAdminCourseComments": ("GET", "/backend/v3/api/content/courses/comments"),
            "moderateAdminCourseComment": ("PATCH", "/backend/v3/api/content/courses/comments/{commentId}/moderation"),
            "fetchAdminCourseEngagement": ("GET", "/backend/v3/api/content/courses/engagement"),
        }

        self.assertEqual(set(expected), set(operations))
        for operation_name, (method, path) in expected.items():
            with self.subTest(operation=operation_name):
                operation = operations[operation_name]
                self.assertEqual("backend", operation["api_surface"])
                self.assertEqual(method, operation["api_method"])
                self.assertEqual(path, operation["api_path"])
                self.assertEqual("content", operation["sdk_domain"])
                self.assertEqual("admin-courses", operation["module"])
                self.assertEqual("/admin/courses", operation["route"])
                if method in {"POST", "PATCH", "PUT", "DELETE"}:
                    self.assertFalse(operation["request_id_header"])
                    self.assertIn("ops_audit_log", operation.get("write_tables", []))

        self.assertEqual(
            ["content_course"],
            operations["fetchAdminCourses"]["read_sources"],
        )
        self.assertIn("content_course_section", operations["fetchAdminCourseSections"]["read_sources"])
        self.assertIn("content_course_lesson", operations["fetchAdminCourseLessons"]["read_sources"])
        self.assertIn("content_course_relation", operations["fetchAdminCourseRelations"]["read_sources"])
        self.assertIn("content_course_application", operations["fetchAdminCourseApplications"]["read_sources"])
        self.assertIn("content_forum_comment", operations["fetchAdminCourseComments"]["read_sources"])
        self.assertIn("content_reaction", operations["fetchAdminCourseEngagement"]["read_sources"])

    def test_backend_openapi_and_sdk_expose_generated_course_center_client(self) -> None:
        openapi = json.loads(BACKEND_OPENAPI_PATH.read_text(encoding="utf-8"))
        content_sdk = BACKEND_CONTENT_API_PATH.read_text(encoding="utf-8")

        for path, method, operation_id in [
            ("/backend/v3/api/content/courses/dashboard", "get", "courses.dashboard.retrieve"),
            ("/backend/v3/api/content/courses", "get", "courses.list"),
            ("/backend/v3/api/content/courses", "post", "courses.create"),
            ("/backend/v3/api/content/courses/{courseId}", "patch", "courses.update"),
            ("/backend/v3/api/content/courses/{courseId}", "delete", "courses.delete"),
            ("/backend/v3/api/content/courses/{courseId}/sections", "get", "courses.sections.list"),
            ("/backend/v3/api/content/courses/{courseId}/sections", "post", "courses.sections.create"),
            ("/backend/v3/api/content/course-sections/{sectionId}", "patch", "courseSections.update"),
            ("/backend/v3/api/content/course-sections/{sectionId}", "delete", "courseSections.delete"),
            ("/backend/v3/api/content/courses/{courseId}/lessons", "get", "courses.lessons.list"),
            ("/backend/v3/api/content/courses/{courseId}/lessons", "post", "courses.lessons.create"),
            ("/backend/v3/api/content/course-lessons/{lessonId}", "patch", "courseLessons.update"),
            ("/backend/v3/api/content/course-lessons/{lessonId}", "delete", "courseLessons.delete"),
            ("/backend/v3/api/content/courses/{courseId}/relations", "get", "courses.relations.list"),
            ("/backend/v3/api/content/courses/{courseId}/relations", "put", "courses.relations.replace"),
            ("/backend/v3/api/content/course-applications", "get", "courseApplications.list"),
            ("/backend/v3/api/content/course-applications/{applicationId}/review", "patch", "courseApplications.review"),
            ("/backend/v3/api/content/courses/comments", "get", "courseComments.list"),
            ("/backend/v3/api/content/courses/comments/{commentId}/moderation", "patch", "courseComments.moderate"),
            ("/backend/v3/api/content/courses/engagement", "get", "courseEngagement.list"),
        ]:
            with self.subTest(path=path, method=method):
                operation = openapi["paths"][path][method]
                self.assertEqual(operation_id, operation["operationId"])
                self.assertEqual(["content"], operation["tags"])

        for token in [
            "public readonly courses: ContentCoursesApi;",
            "public readonly courseApplications: ContentCourseApplicationsApi;",
            "public readonly courseComments: ContentCourseCommentsApi;",
            "public readonly courseEngagement: ContentCourseEngagementApi;",
            "public readonly dashboard: ContentCoursesDashboardApi;",
            "public readonly sections: ContentCoursesSectionsApi;",
            "public readonly lessons: ContentCoursesLessonsApi;",
            "public readonly relations: ContentCoursesRelationsApi;",
            "backendApiPath(`/content/courses`)",
            "backendApiPath(`/content/course-applications`)",
        ]:
            self.assertIn(token, content_sdk)

    def test_portal_course_package_has_strict_backend_sdk_boundary(self) -> None:
        manifest = json.loads((PORTAL_PACKAGE_ROOT / "package.json").read_text(encoding="utf-8"))
        service = (PORTAL_PACKAGE_ROOT / "src" / "courseAdminService.ts").read_text(encoding="utf-8")
        view = (PORTAL_PACKAGE_ROOT / "src" / "index.tsx").read_text(encoding="utf-8")

        self.assertEqual("sdkwork-clawrouter-pc-admin-courses", manifest["name"])
        self.assertEqual("module", manifest["type"])
        self.assertEqual("tsc --noEmit", manifest["scripts"]["typecheck"])
        self.assertIn("getClawRouterBackendSdkClient().content.courses.dashboard.retrieve", service)
        self.assertIn("getClawRouterBackendSdkClient().content.courseApplications.list", service)
        self.assertNotIn("fetch(", service)
        self.assertNotIn("axios", service)
        self.assertNotIn("getClawRouterAppSdkClient", service)
        self.assertIn("export function CourseAdmin", view)
        self.assertIn("CourseAdminService.fetchDashboard", view)
        self.assertIn("CourseAdminService.fetchCourses", view)


if __name__ == "__main__":
    unittest.main()
