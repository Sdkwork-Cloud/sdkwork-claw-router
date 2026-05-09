import unittest
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]
COURSES_PACKAGE = (
    ROOT
    / "apps"
    / "sdkwork-claw-router-portal"
    / "packages"
    / "sdkwork-claw-router-courses"
)
CLASSIFICATION_PATH = ROOT / "docs" / "schema-registry" / "frontend-route-classification.yaml"


class CoursesRuntimeStandardTest(unittest.TestCase):
    def test_courses_pages_use_testable_content_snapshot_module(self) -> None:
        catalog_path = COURSES_PACKAGE / "src" / "courseCatalog.ts"
        data_path = COURSES_PACKAGE / "src" / "data.ts"
        courses_view_path = COURSES_PACKAGE / "src" / "components" / "CoursesView.tsx"
        detail_view_path = COURSES_PACKAGE / "src" / "components" / "CourseDetailView.tsx"
        runtime_test_path = ROOT / "apps" / "sdkwork-claw-router-portal" / "courses-runtime.test.ts"
        verifier_path = ROOT / "scripts" / "verify-claw-router-product.mjs"

        self.assertTrue(catalog_path.exists(), "Courses business logic must live in a pure content catalog module.")
        self.assertTrue(runtime_test_path.exists(), "Courses runtime behavior must have executable Node tests.")

        catalog_source = catalog_path.read_text(encoding="utf-8")
        data_source = data_path.read_text(encoding="utf-8")
        courses_view_source = courses_view_path.read_text(encoding="utf-8")
        detail_view_source = detail_view_path.read_text(encoding="utf-8")
        runtime_test_source = runtime_test_path.read_text(encoding="utf-8")
        verifier_source = verifier_path.read_text(encoding="utf-8")

        self.assertIn("export const COURSE_CONTENT_SNAPSHOT_SOURCE", catalog_source)
        self.assertRegex(catalog_source, r"observedAt:\s*['\"]2026-05-03['\"]")
        self.assertIn("export const COURSE_CATALOG", catalog_source)
        self.assertIn("export function filterCoursesForCatalog", catalog_source)
        self.assertIn("export function deriveCourseCatalogViewModel", catalog_source)
        self.assertIn("export function deriveCourseDetailView", catalog_source)
        self.assertIn("export function deriveCoursePlaylist", catalog_source)
        self.assertIn("export function buildBilibiliEmbedUrl", catalog_source)
        self.assertIn("export function deriveCourseEngagementMetrics", catalog_source)
        self.assertIn("COURSE_CATALOG as courseCatalog", data_source)

        self.assertIn("deriveCourseCatalogViewModel", courses_view_source)
        self.assertIn("COURSE_CATALOG", courses_view_source)
        self.assertNotIn("new Set(courseCatalog.map", courses_view_source)
        self.assertNotIn("courseCatalog.filter", courses_view_source)

        self.assertIn("deriveCourseDetailView", detail_view_source)
        self.assertNotIn("courseCatalog.find", detail_view_source)
        self.assertNotIn("courseCatalog.filter", detail_view_source)

        self.assertIn("course content snapshot metadata is explicit", runtime_test_source)
        self.assertIn("deriveCourseDetailView", runtime_test_source)
        self.assertIn("portal courses runtime tests", verifier_source)
        self.assertIn("apps/sdkwork-claw-router-portal/courses-runtime.test.ts", verifier_source)

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

        for mojibake_token in ["æ¶", "î", "â€", "éŠ", "ç»", "å¯", "ã€"]:
            with self.subTest(token=mojibake_token):
                self.assertNotIn(mojibake_token, combined)

        self.assertIn("useTranslation", component_sources["CourseInfo.tsx"])
        self.assertIn("courses.aboutThisCourse", component_sources["CourseInfo.tsx"])
        self.assertNotIn("Course overview", component_sources["CourseInfo.tsx"])
        self.assertIn("About This Course", combined)
        self.assertIn("Course lessons", combined)
        self.assertIn("Related courses", combined)
        self.assertIn("Discussion", combined)

    def test_courses_catalog_cards_are_keyboard_accessible_navigation_controls(self) -> None:
        courses_view_path = COURSES_PACKAGE / "src" / "components" / "CoursesView.tsx"
        courses_view_source = courses_view_path.read_text(encoding="utf-8")

        self.assertIn("<motion.button", courses_view_source)
        self.assertIn('type="button"', courses_view_source)
        self.assertIn("aria-label={`Open course ${course.title}`}", courses_view_source)
        self.assertNotIn("onClick={() => navigate(`/courses/${course.id}`)}\n                  className=", courses_view_source)
        self.assertNotIn('<button className="absolute inset-0 flex items-center justify-center', courses_view_source)

    def test_courses_route_classification_remains_release_bound_static_content(self) -> None:
        classification = yaml.safe_load(CLASSIFICATION_PATH.read_text(encoding="utf-8"))
        courses_route = self._route_entry(classification, "/courses")
        detail_route = self._route_entry(classification, "/courses/:id")

        for route in [courses_route, detail_route]:
            with self.subTest(route=route["route"]):
                self.assertEqual("schema_provenanced_content", route["delivery_kind"])
                self.assertEqual("curated_seed_content", route["static_delivery"]["mode"])
                self.assertEqual("manual_content_release", route["static_delivery"]["refresh_policy"])
                self.assertEqual("release_bound", route["static_delivery"]["max_staleness"])
                self.assertIn(
                    "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-courses/src/courseCatalog.ts",
                    route["evidence"],
                )

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
        self.assertIn("deriveCourseDetailView", catalog_source)
        self.assertIn("COURSE_CONTENT_SNAPSHOT_SOURCE", catalog_source)
        self.assertIn("portal production browser DOM smoke", product_test_source)
        self.assertIn("/courses/c1?__browser-smoke-detail=1", product_test_source)

    def _route_entry(self, classification: dict, route: str) -> dict:
        for entry in classification.get("routes", []):
            if isinstance(entry, dict) and entry.get("route") == route:
                return entry
        self.fail(f"Missing frontend route classification for {route}.")


if __name__ == "__main__":
    unittest.main()
