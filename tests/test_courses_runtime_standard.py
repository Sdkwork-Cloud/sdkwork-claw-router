import json
import re
import unittest
from pathlib import Path

import yaml

from tools.schema_registry_loader import render_schema_registry


ROOT = Path(__file__).resolve().parents[1]
COURSES_PACKAGE = (
    ROOT
    / "apps"
    / "sdkwork-claw-router-portal"
    / "packages"
    / "sdkwork-claw-router-courses"
)
CLASSIFICATION_PATH = ROOT / "docs" / "schema-registry" / "frontend-route-classification.yaml"
APP_OPENAPI_PATH = ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json"


class CoursesRuntimeStandardTest(unittest.TestCase):
    def test_courses_pages_use_live_course_service_and_generated_app_sdk(self) -> None:
        catalog_path = COURSES_PACKAGE / "src" / "courseCatalog.ts"
        data_path = COURSES_PACKAGE / "src" / "data.ts"
        service_path = COURSES_PACKAGE / "src" / "courseService.ts"
        courses_view_path = COURSES_PACKAGE / "src" / "components" / "CoursesView.tsx"
        detail_view_path = COURSES_PACKAGE / "src" / "components" / "CourseDetailView.tsx"
        runtime_test_path = ROOT / "apps" / "sdkwork-claw-router-portal" / "courses-runtime.test.ts"
        verifier_path = ROOT / "scripts" / "verify-claw-router-product.mjs"

        self.assertTrue(catalog_path.exists(), "Courses view model helpers must stay testable and pure.")
        self.assertTrue(service_path.exists(), "Courses runtime data must be loaded through a courseService SDK boundary.")
        self.assertTrue(runtime_test_path.exists(), "Courses runtime behavior must have executable Node tests.")

        catalog_source = catalog_path.read_text(encoding="utf-8")
        data_source = data_path.read_text(encoding="utf-8")
        service_source = service_path.read_text(encoding="utf-8")
        courses_view_source = courses_view_path.read_text(encoding="utf-8")
        detail_view_source = detail_view_path.read_text(encoding="utf-8")
        runtime_test_source = runtime_test_path.read_text(encoding="utf-8")
        verifier_source = verifier_path.read_text(encoding="utf-8")

        self.assertIn("export function filterCoursesForCatalog", catalog_source)
        self.assertIn("export function deriveCourseCatalogViewModel", catalog_source)
        self.assertIn("export function deriveCourseDetailView", catalog_source)
        self.assertIn("export function deriveCoursePlaylist", catalog_source)
        self.assertIn("export function buildBilibiliEmbedUrl", catalog_source)
        self.assertIn("export function deriveCourseEngagementMetrics", catalog_source)
        self.assertNotIn("COURSE_CATALOG as courseCatalog", data_source)

        self.assertIn("getClawRouterAppSdkClient", service_source)
        self.assertIn("fetchCourses", service_source)
        self.assertIn("fetchCourseDetail", service_source)
        self.assertIn("fetchCourseCategories", service_source)
        self.assertIn("fetchCourseOverview", service_source)
        self.assertIn("submitCourseApplication", service_source)
        self.assertIn("uploadCourseApplicationVideo", service_source)
        self.assertIn(".content.applications.create", service_source)
        self.assertIn(".content.applications.videos.create", service_source)
        self.assertIn("file: input.file", service_source)
        self.assertIn("fileName: normalizeUploadFileName(input)", service_source)
        self.assertNotIn("const request = new FormData()", service_source)
        self.assertNotIn("request.append('file'", service_source)
        self.assertNotIn("fetch(", service_source)
        self.assertNotIn("axios", service_source)
        self.assertNotIn("Authorization", service_source)

        self.assertIn("deriveCourseCatalogViewModel", courses_view_source)
        self.assertIn("courseService.fetchCourses", courses_view_source)
        self.assertIn("courseService.fetchCourseCategories", courses_view_source)
        self.assertNotIn("COURSE_CATALOG", courses_view_source)
        self.assertNotIn("new Set(courseCatalog.map", courses_view_source)
        self.assertNotIn("courseCatalog.filter", courses_view_source)

        self.assertIn("deriveCourseDetailView", detail_view_source)
        self.assertIn("courseService.fetchCourseDetail", detail_view_source)
        self.assertNotIn("COURSE_CATALOG", detail_view_source)
        self.assertNotIn("courseCatalog.find", detail_view_source)
        self.assertNotIn("courseCatalog.filter", detail_view_source)

        self.assertIn("course API service normalizes live SDK payloads", runtime_test_source)
        self.assertIn("course detail lesson selection switches the active lesson video", runtime_test_source)
        self.assertIn("course seed catalog is focused on AI coding and AI creation learning", runtime_test_source)
        self.assertIn("course detail lesson selection supports local uploaded video playback metadata", runtime_test_source)
        self.assertIn("course application submission is normalized through generated app SDK", runtime_test_source)
        self.assertIn("course application video upload is normalized through generated app SDK", runtime_test_source)
        self.assertIn("selectCourseLesson", service_source)
        self.assertIn("deriveCourseDetailView", runtime_test_source)
        self.assertIn("portal courses runtime tests", verifier_source)
        self.assertIn("apps/sdkwork-claw-router-portal/courses-runtime.test.ts", verifier_source)

    def test_courses_backend_contract_and_seed_are_real_runtime_sources(self) -> None:
        required_paths = [
            ROOT / "services" / "sdkwork-claw-product" / "src" / "ports" / "course_store.rs",
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_course.rs",
            ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "course_seed.rs",
            ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "sqlite" / "course_store.rs",
            ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "postgres" / "course_store.rs",
            ROOT / "data" / "courses" / "course-seed.json",
        ]
        for path in required_paths:
            with self.subTest(path=path):
                self.assertTrue(path.exists(), f"{path} must exist for live course runtime data.")

        installer_source = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "installer.rs"
        ).read_text(encoding="utf-8")
        self.assertIn("bundled_course_seed_payload", installer_source)
        self.assertIn("import_sqlite_course_seed", installer_source)
        self.assertIn("import_postgres_course_seed", installer_source)
        self.assertIn("sqlite_course_seed_complete", installer_source)
        self.assertIn("postgres_course_seed_complete", installer_source)

        app_api_source = (ROOT / "services" / "sdkwork-claw-app-api" / "src" / "lib.rs").read_text(encoding="utf-8")
        self.assertIn("SqliteCourseStore", app_api_source)
        self.assertIn("PostgresCourseStore", app_api_source)
        self.assertIn("app_course_router_with_read_store", app_api_source)

    def test_courses_app_openapi_contract_exposes_live_course_paths(self) -> None:
        openapi = json.loads(APP_OPENAPI_PATH.read_text(encoding="utf-8"))
        paths = openapi.get("paths", {})
        required_paths = {
            "/app/v3/api/courses",
            "/app/v3/api/courses/overview",
            "/app/v3/api/courses/categories",
            "/app/v3/api/courses/{courseId}",
        }
        self.assertTrue(required_paths.issubset(paths.keys()))
        operations = {
            path: next(iter(methods.values()))
            for path, methods in paths.items()
            if path in required_paths and isinstance(methods, dict)
        }
        operation_ids = {operation.get("operationId") for operation in operations.values()}
        self.assertIn("courses.list", operation_ids)
        self.assertIn("courses.overview.retrieve", operation_ids)
        self.assertIn("courses.categories.list", operation_ids)
        self.assertIn("courses.retrieve", operation_ids)

    def test_courses_detail_components_have_no_runtime_drift_or_corrupt_copy(self) -> None:
        component_sources = {
            path.name: path.read_text(encoding="utf-8")
            for path in (COURSES_PACKAGE / "src" / "components" / "course-detail").glob("*.tsx")
        }
        combined = "\n".join(component_sources.values())

        self.assertNotIn("Math.random", combined)
        self.assertNotIn("new Date()", combined)
        self.assertNotIn("toLocaleDateString", combined)
        self.assertNotIn("player.bilibili.com/player.html?bvid=${", combined)
        self.assertNotIn("src={`//", combined)
        self.assertNotIn("{ course: any }", combined)
        self.assertNotIn("relatedCourses }: { relatedCourses: any[] }", combined)
        self.assertNotIn("instructor }: { instructor: any", combined)

        mojibake_tokens = [
            bytes.fromhex(hex_token).decode("utf-8", errors="ignore")
            for hex_token in [
                "c3a6c2b6",
                "c3ae",
                "c3a2e282ac",
                "c3a9c5a0",
                "c3a7c2bb",
                "c3a5c2af",
                "c3a3e282ac",
            ]
        ]
        for mojibake_token in mojibake_tokens:
            with self.subTest(token=mojibake_token):
                self.assertNotIn(mojibake_token, combined)

        self.assertIn("useTranslation", component_sources["CourseInfo.tsx"])
        self.assertIn("courses.aboutThisCourse", component_sources["CourseInfo.tsx"])
        self.assertNotIn("Course overview", component_sources["CourseInfo.tsx"])
        self.assertIn("About This Course", combined)
        self.assertIn("Course lessons", combined)
        self.assertIn("Related courses", combined)
        self.assertIn("Discussion", combined)

    def test_courses_playlist_lessons_drive_video_selection(self) -> None:
        playlist_path = COURSES_PACKAGE / "src" / "components" / "course-detail" / "CoursePlaylist.tsx"
        detail_view_path = COURSES_PACKAGE / "src" / "components" / "CourseDetailView.tsx"
        service_path = COURSES_PACKAGE / "src" / "courseService.ts"
        playlist_source = playlist_path.read_text(encoding="utf-8")
        detail_view_source = detail_view_path.read_text(encoding="utf-8")
        service_source = service_path.read_text(encoding="utf-8")

        self.assertIn("onLessonSelect", playlist_source)
        self.assertIn("aria-label={`Play lesson ${lesson.number}: ${lesson.title}`}", playlist_source)
        self.assertIn("aria-pressed={lesson.active}", playlist_source)
        self.assertIn("onLessonSelect={handleLessonSelect}", detail_view_source)
        self.assertIn("selectCourseLesson(current.detail, lessonId)", detail_view_source)
        self.assertIn("function buildCourseLessonEmbedUrl", service_source)
        self.assertIn("externalBvid", service_source)
        self.assertNotIn("className={`group flex items-center justify-between gap-2 px-2.5 py-2", playlist_source)

    def test_courses_catalog_cards_are_keyboard_accessible_navigation_controls(self) -> None:
        courses_view_path = COURSES_PACKAGE / "src" / "components" / "CoursesView.tsx"
        courses_view_source = courses_view_path.read_text(encoding="utf-8")

        self.assertIn("<motion.button", courses_view_source)
        self.assertIn('type="button"', courses_view_source)
        self.assertIn("aria-label={`Open course ${course.title}`}", courses_view_source)
        self.assertNotIn("onClick={() => navigate(`/courses/${course.id}`)}\n                  className=", courses_view_source)
        self.assertNotIn('<button className="absolute inset-0 flex items-center justify-center', courses_view_source)

    def test_courses_route_classification_is_live_sdk_backed_runtime(self) -> None:
        classification = yaml.safe_load(CLASSIFICATION_PATH.read_text(encoding="utf-8"))
        courses_route = self._route_entry(classification, "/courses")
        detail_route = self._route_entry(classification, "/courses/:id")

        for route in [courses_route, detail_route]:
            with self.subTest(route=route["route"]):
                self.assertEqual("sdk_backed_business_runtime", route["delivery_kind"])
                self.assertEqual("app", route["api_surface"])
                self.assertNotIn("static_delivery", route)
                self.assertIn("generated/openapi/clawrouter-app-openapi.json", route["evidence"])
        self.assertIn(
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-courses/src/courseService.ts",
            route["evidence"],
        )
        self.assertIn("/courses", courses_route["operation_routes"])
        self.assertIn("/courses/:id", detail_route["operation_routes"])

    def test_courses_source_files_have_no_mojibake_copy(self) -> None:
        checked_paths = [
            *(COURSES_PACKAGE / "src").rglob("*.ts"),
            *(COURSES_PACKAGE / "src").rglob("*.tsx"),
            ROOT / "data" / "courses" / "course-seed.json",
            ROOT / "apps" / "sdkwork-claw-router-portal" / "courses-runtime.test.ts",
            ROOT / "services" / "sdkwork-claw-product" / "tests" / "app_course_api.rs",
            ROOT / "services" / "sdkwork-claw-product" / "tests" / "sqlite_course_store.rs",
        ]
        mojibake_tokens = [
            "\ufffd",
            "\u00c3",
            "\u00c2",
            "\u00e2\u20ac",
            "\u00ee",
            "\u00ef",
            "\u00e9\u008d",
            "\u00e7\u2019",
            "\u00e6\u00b6",
            "\u00e5\u00a1",
        ]
        for path in checked_paths:
            source = path.read_text(encoding="utf-8")
            for token in mojibake_tokens:
                with self.subTest(path=path, token=token.encode("unicode_escape").decode("ascii")):
                    self.assertNotIn(token, source)

    def test_courses_production_smoke_covers_route_and_chunk_semantics(self) -> None:
        smoke_path = ROOT / "apps" / "sdkwork-claw-router-portal" / "scripts" / "smoke-production-browser.mjs"
        product_test_path = ROOT / "scripts" / "run-claw-router-product.test.mjs"
        catalog_path = COURSES_PACKAGE / "src" / "courseCatalog.ts"

        smoke_source = smoke_path.read_text(encoding="utf-8")
        product_test_source = product_test_path.read_text(encoding="utf-8")
        catalog_source = catalog_path.read_text(encoding="utf-8")

        self.assertIn('pathName: "/courses"', smoke_source)
        self.assertIn('pathName: "/courses/c1"', smoke_source)
        self.assertIn('pathName: "/courses?__browser-smoke-category=1"', smoke_source)
        self.assertIn('pathName: "/courses?__browser-smoke-level=1"', smoke_source)
        self.assertIn('pathName: "/courses?__browser-smoke-search=1"', smoke_source)
        self.assertIn('pathName: "/courses?__browser-smoke-card-click=1"', smoke_source)
        self.assertIn('pathName: "/courses/c1?__browser-smoke-detail=1"', smoke_source)
        self.assertIn('pathName: "/courses/c1?__browser-smoke-lesson-grid=1"', smoke_source)
        self.assertIn('pathName: "/courses/c1?__browser-smoke-related=1"', smoke_source)
        self.assertIn('pathName: "/courses/__browser-smoke-missing"', smoke_source)
        self.assertIn("Curated course content snapshot", smoke_source)
        self.assertIn("Course lessons", smoke_source)
        self.assertIn("buildBilibiliEmbedUrl", catalog_source)

    def test_courses_seed_is_ai_learning_catalog(self) -> None:
        seed_path = ROOT / "data" / "courses" / "course-seed.json"
        seed = json.loads(seed_path.read_text(encoding="utf-8"))
        category_codes = [category["code"] for category in seed["categories"]]
        category_names = [category["name"] for category in seed["categories"]]
        categories = {category["code"]: category["name"] for category in seed["categories"]}
        courses = seed["courses"]
        lessons = seed["lessons"]
        combined = json.dumps(seed, ensure_ascii=False)
        public_root = ROOT / "apps" / "sdkwork-claw-router-portal" / "public"

        self.assertIn("ai-coding", categories)
        self.assertIn("ai-image-creation", categories)
        self.assertIn("ai-video-creation", categories)
        self.assertIn("openclaw-agent", categories)
        self.assertIn("agent-workflow", categories)
        self.assertIn("ai-short-drama", categories)
        self.assertEqual(len(category_codes), len(set(category_codes)), "course category codes must be unique")
        self.assertEqual(len(category_names), len(set(category_names)), "course category names must be unique")
        self.assertGreaterEqual(len(courses), 200)
        self.assertGreaterEqual(len(lessons), len(courses) * 3)
        self.assertIn("Claude Code", combined)
        self.assertIn("Codex", combined)
        self.assertIn("OpenClaw", combined)
        self.assertIn("\u667a\u80fd\u4f53", combined)
        self.assertIn("\u77ed\u5267", combined)
        self.assertIn("\u5373\u68a6", combined)
        self.assertIn("\u56fe\u7247\u5236\u4f5c", combined)
        self.assertIn("\u89c6\u9891\u5236\u4f5c", combined)
        self.assertFalse(re.search(r"https?://images\.unsplash\.com", combined))
        self.assertFalse(re.search(r"https?://i\.pravatar\.cc", combined))
        self.assertTrue(
            any(lesson.get("sourceProvider") == "bilibili" and lesson.get("externalBvid") for lesson in lessons),
            "seed lessons must include embeddable Bilibili videos",
        )
        self.assertTrue(
            any(lesson.get("sourceProvider") == "local" and lesson.get("videoUrl", "").startswith("/uploads/courses/") for lesson in lessons),
            "seed lessons must include a local uploaded video tutorial URL",
        )
        for course in courses:
            self.assertIn(course["category"], categories, f"{course['courseCode']} must use a declared course category")
            thumbnail = course.get("thumbnailUrl", "")
            self.assertRegex(
                thumbnail,
                r"^/assets/courses/covers/[a-z0-9-]+\.svg$",
                f"{course['courseCode']} must use a stable local course cover asset",
            )
            self.assertTrue(
                (public_root / thumbnail.lstrip("/")).is_file(),
                f"{course['courseCode']} cover asset must exist in portal public assets",
            )
            course_lessons = [lesson for lesson in lessons if lesson.get("courseCode") == course["courseCode"]]
            with self.subTest(course=course["courseCode"]):
                self.assertEqual(course["lessonsCount"], len(course_lessons))
                self.assertGreaterEqual(
                    sum(1 for lesson in course_lessons if lesson.get("sourceProvider") == "bilibili" and lesson.get("externalBvid", "").startswith("BV")),
                    1,
                    "each course must include at least one embeddable Bilibili lesson",
                )
                self.assertGreaterEqual(
                    sum(1 for lesson in course_lessons if lesson.get("sourceProvider") == "local" and lesson.get("videoUrl", "").startswith("/uploads/courses/")),
                    1,
                    "each course must include at least one local uploaded video lesson",
                )

    def test_course_application_dialog_uses_standard_seed_categories(self) -> None:
        seed_path = ROOT / "data" / "courses" / "course-seed.json"
        application_dialog_path = COURSES_PACKAGE / "src" / "components" / "CourseApplicationDialog.tsx"
        seed = json.loads(seed_path.read_text(encoding="utf-8"))
        application_dialog_source = application_dialog_path.read_text(encoding="utf-8")

        self.assertIn("COURSE_APPLICATION_CATEGORIES.map", application_dialog_source)
        for category in seed["categories"]:
            with self.subTest(category=category["code"]):
                self.assertRegex(
                    application_dialog_source,
                    rf"code:\s*['\"]{re.escape(category['code'])}['\"]",
                    "course upload applications must offer every standard course category",
                )

    def test_courses_application_contract_and_video_player_are_standardized(self) -> None:
        app_api_path = ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_course.rs"
        ports_path = ROOT / "services" / "sdkwork-claw-product" / "src" / "ports" / "course_store.rs"
        sqlite_store_path = ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "sqlite" / "course_store.rs"
        postgres_store_path = ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "postgres" / "course_store.rs"
        schema_path = ROOT / "docs" / "schema-registry" / "sdkwork-claw-router.tables.yaml"
        frontend_contract_path = ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        catalog_path = COURSES_PACKAGE / "src" / "courseCatalog.ts"
        product_test_path = ROOT / "scripts" / "run-claw-router-product.test.mjs"
        video_player_path = COURSES_PACKAGE / "src" / "components" / "course-detail" / "VideoPlayer.tsx"
        courses_view_path = COURSES_PACKAGE / "src" / "components" / "CoursesView.tsx"
        application_dialog_path = COURSES_PACKAGE / "src" / "components" / "CourseApplicationDialog.tsx"
        service_path = COURSES_PACKAGE / "src" / "courseService.ts"
        generated_content_api_path = ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "api" / "content.ts"
        gateway_path = ROOT / "services" / "sdkwork-claw-gateway" / "src" / "edge_server.rs"

        app_api_source = app_api_path.read_text(encoding="utf-8")
        ports_source = ports_path.read_text(encoding="utf-8")
        sqlite_store_source = sqlite_store_path.read_text(encoding="utf-8")
        postgres_store_source = postgres_store_path.read_text(encoding="utf-8")
        schema_source = render_schema_registry(schema_path)
        frontend_contract_source = frontend_contract_path.read_text(encoding="utf-8")
        catalog_source = catalog_path.read_text(encoding="utf-8")
        product_test_source = product_test_path.read_text(encoding="utf-8")
        video_player_source = video_player_path.read_text(encoding="utf-8")
        courses_view_source = courses_view_path.read_text(encoding="utf-8")
        application_dialog_source = application_dialog_path.read_text(encoding="utf-8")
        service_source = service_path.read_text(encoding="utf-8")
        generated_content_api_source = generated_content_api_path.read_text(encoding="utf-8")
        gateway_source = gateway_path.read_text(encoding="utf-8")

        self.assertIn('/app/v3/api/courses/applications', app_api_source)
        self.assertIn("post(submit_course_application)", app_api_source)
        self.assertIn('/app/v3/api/courses/applications/videos', app_api_source)
        self.assertIn("post(upload_course_application_video)", app_api_source)
        self.assertIn('/uploads/courses/{*filePath}', app_api_source)
        self.assertIn("get(serve_course_upload_asset)", app_api_source)
        self.assertIn("CourseApplicationCommandStore", ports_source)
        self.assertIn("CreateCourseApplicationCommand", ports_source)
        self.assertIn("content_course_application", sqlite_store_source)
        self.assertIn("content_course_application", postgres_store_source)
        self.assertIn("content_course_application", schema_source)
        self.assertIn("submitCourseApplication", frontend_contract_source)
        self.assertIn("uploadCourseApplicationVideo", frontend_contract_source)
        self.assertIn("course_application_request", frontend_contract_source)
        self.assertIn("course_application_video_upload_request", frontend_contract_source)
        self.assertIn("course_application_video_upload_response", frontend_contract_source)
        self.assertIn("request_content_type: multipart/form-data", frontend_contract_source)
        upload_operation_contract = self._frontend_operation_contract(
            frontend_contract_path,
            "uploadCourseApplicationVideo",
        )
        self.assertEqual([], upload_operation_contract.get("read_sources"))
        self.assertEqual([], upload_operation_contract.get("write_tables"))
        self.assertEqual(
            ["course_application_video_uploads"],
            upload_operation_contract.get("file_targets"),
        )
        openapi = json.loads(APP_OPENAPI_PATH.read_text(encoding="utf-8"))
        application_operation = openapi["paths"]["/app/v3/api/courses/applications"]["post"]
        self.assertEqual("applications.create", application_operation["operationId"])
        self.assertIn("content_course_application", application_operation.get("x-write-tables", []))
        upload_operation = openapi["paths"]["/app/v3/api/courses/applications/videos"]["post"]
        self.assertEqual("applications.videos.create", upload_operation["operationId"])
        self.assertEqual([], upload_operation.get("x-read-sources"))
        self.assertEqual([], upload_operation.get("x-write-tables"))
        self.assertEqual(["course_application_video_uploads"], upload_operation.get("x-file-targets"))
        self.assertEqual(
            ["multipart/form-data"],
            list(upload_operation["requestBody"]["content"].keys()),
        )
        self.assertEqual(
            "#/components/schemas/CourseApplicationVideoUploadRequest",
            upload_operation["requestBody"]["content"]["multipart/form-data"]["schema"]["$ref"],
        )
        upload_result_ref = upload_operation["responses"]["200"]["content"]["application/json"]["schema"]["$ref"]
        upload_result_name = upload_result_ref.rsplit("/", 1)[-1]
        upload_result_schema = openapi["components"]["schemas"][upload_result_name]
        self.assertEqual(
            "#/components/schemas/CourseApplicationVideoUploadResponse",
            upload_result_schema["properties"]["data"]["allOf"][0]["$ref"],
        )
        self.assertIn("CourseApplicationVideoUploadResponse", json.dumps(openapi["components"]["schemas"]))
        self.assertIn("public readonly videos", generated_content_api_source)
        self.assertIn("async create(body: CourseApplicationVideoUploadRequest)", generated_content_api_source)
        self.assertNotIn("async create(body: FormData)", generated_content_api_source)
        self.assertIn("multipart/form-data", generated_content_api_source)
        self.assertIn("uploadCourseApplicationVideo", service_source)
        self.assertIn(".content.applications.videos.create", service_source)
        self.assertIn("<video", video_player_source)
        self.assertIn("controls", video_player_source)
        self.assertIn("video.sourceProvider === 'local'", video_player_source)
        self.assertIn("CourseApplicationDialog", courses_view_source)
        self.assertIn("onUploadVideo={courseService.uploadCourseApplicationVideo}", courses_view_source)
        self.assertIn("onUploadVideo", application_dialog_source)
        self.assertIn('type="file"', application_dialog_source)
        self.assertIn('accept="video/mp4,video/webm,video/quicktime,video/x-m4v,.mp4,.webm,.mov,.m4v"', application_dialog_source)
        self.assertIn('path == "/uploads/courses" || path.starts_with("/uploads/courses/")', gateway_source)
        self.assertIn("Some(&self.app_base_url)", gateway_source)
        self.assertIn("deriveCourseDetailView", catalog_source)
        self.assertIn("COURSE_CONTENT_SNAPSHOT_SOURCE", catalog_source)
        self.assertIn("portal production browser DOM smoke", product_test_source)
        self.assertIn("/courses/c1?__browser-smoke-detail=1", product_test_source)

    def _route_entry(self, classification: dict, route: str) -> dict:
        for entry in classification.get("routes", []):
            if isinstance(entry, dict) and entry.get("route") == route:
                return entry
        self.fail(f"Missing frontend route classification for {route}.")

    def _frontend_operation_contract(self, path: Path, operation: str) -> dict:
        contract = yaml.safe_load(path.read_text(encoding="utf-8"))
        for entry in contract.get("frontend_operations", []):
            if isinstance(entry, dict) and entry.get("operation") == operation:
                return entry
        self.fail(f"Missing frontend operation contract for {operation}.")


if __name__ == "__main__":
    unittest.main()
