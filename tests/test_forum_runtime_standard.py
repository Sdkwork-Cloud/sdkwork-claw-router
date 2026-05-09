import unittest
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]
FORUM_PACKAGE = (
    ROOT
    / "apps"
    / "sdkwork-claw-router-portal"
    / "packages"
    / "sdkwork-claw-router-forum"
)
CLASSIFICATION_PATH = ROOT / "docs" / "schema-registry" / "frontend-route-classification.yaml"
STATIC_SOURCE_PATH = ROOT / "docs" / "schema-registry" / "frontend-static-source-snapshots.yaml"


class ForumRuntimeStandardTest(unittest.TestCase):
    def test_forum_pages_use_testable_content_snapshot_module(self) -> None:
        catalog_path = FORUM_PACKAGE / "src" / "forumCatalog.ts"
        forum_view_path = FORUM_PACKAGE / "src" / "components" / "ForumView.tsx"
        post_view_path = FORUM_PACKAGE / "src" / "components" / "ForumPostView.tsx"
        runtime_test_path = ROOT / "apps" / "sdkwork-claw-router-portal" / "forum-runtime.test.ts"
        verifier_path = ROOT / "scripts" / "verify-claw-router-product.mjs"

        self.assertTrue(catalog_path.exists(), "Forum business logic must live in a pure content catalog module.")
        self.assertTrue(runtime_test_path.exists(), "Forum runtime behavior must have executable Node tests.")

        catalog_source = catalog_path.read_text(encoding="utf-8")
        forum_view_source = forum_view_path.read_text(encoding="utf-8")
        post_view_source = post_view_path.read_text(encoding="utf-8")
        runtime_test_source = runtime_test_path.read_text(encoding="utf-8")
        verifier_source = verifier_path.read_text(encoding="utf-8")

        self.assertIn("export const FORUM_CONTENT_SNAPSHOT_SOURCE", catalog_source)
        self.assertRegex(catalog_source, r"observedAt:\s*['\"]2026-05-03['\"]")
        self.assertIn("export const FORUM_POSTS", catalog_source)
        self.assertIn("export function filterForumPostsForCatalog", catalog_source)
        self.assertIn("export function deriveForumCatalogViewModel", catalog_source)
        self.assertIn("export function deriveForumPostDetailView", catalog_source)
        self.assertIn("export function formatForumCount", catalog_source)

        self.assertIn("deriveForumCatalogViewModel", forum_view_source)
        self.assertIn("FORUM_POSTS", forum_view_source)
        self.assertNotIn("const forumSeedPosts", forum_view_source)
        self.assertNotIn("forumSeedPosts.filter", forum_view_source)
        self.assertNotIn("const categories =", forum_view_source)

        self.assertIn("deriveForumPostDetailView", post_view_source)
        self.assertIn("FORUM_POSTS", post_view_source)
        self.assertNotIn("const forumSeedPostDetail", post_view_source)
        self.assertNotIn("const post = forumSeedPostDetail", post_view_source)

        self.assertIn("forum content snapshot metadata is explicit", runtime_test_source)
        self.assertIn("deriveForumPostDetailView", runtime_test_source)
        self.assertIn("portal forum runtime tests", verifier_source)
        self.assertIn("apps/sdkwork-claw-router-portal/forum-runtime.test.ts", verifier_source)

    def test_forum_components_have_no_runtime_drift_or_corrupt_copy(self) -> None:
        combined = "\n".join(
            path.read_text(encoding="utf-8")
            for path in (FORUM_PACKAGE / "src" / "components").glob("*.tsx")
        )

        self.assertNotIn("Math.random", combined)
        self.assertNotIn("new Date()", combined)
        self.assertNotIn("toLocaleString", combined)
        self.assertNotIn("toLocaleDateString", combined)
        self.assertNotIn("window.location.href", combined)
        self.assertNotIn("éˆ¥?", combined)
        self.assertNotIn("é¦ƒ", combined)
        self.assertNotIn("ç‘™", combined)
        self.assertNotIn("éŽ¶", combined)

        self.assertIn("Published snapshot", combined)
        self.assertIn("Related discussions", combined)
        self.assertIn("Discussion", combined)

    def test_forum_catalog_controls_have_accessible_empty_state(self) -> None:
        forum_view_path = FORUM_PACKAGE / "src" / "components" / "ForumView.tsx"
        forum_view_source = forum_view_path.read_text(encoding="utf-8")

        self.assertIn('aria-label={t(\'forum.searchPlaceholder\')}', forum_view_source)
        self.assertIn('type="button"', forum_view_source)
        self.assertIn("view.filteredPosts.length === 0", forum_view_source)
        self.assertIn("No discussions found", forum_view_source)
        self.assertIn("Try a different search or category filter.", forum_view_source)

    def test_forum_route_classification_is_app_sdk_backed_runtime(self) -> None:
        classification = yaml.safe_load(CLASSIFICATION_PATH.read_text(encoding="utf-8"))
        forum_route = self._route_entry(classification, "/forum")
        detail_route = self._route_entry(classification, "/forum/:id")
        expected_service = "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-forum/src/forumService.ts"
        expected_contract = "docs/schema-registry/frontend-field-contracts.yaml"

        for route in [forum_route, detail_route]:
            with self.subTest(route=route["route"]):
                self.assertEqual("sdk_backed_business_runtime", route["delivery_kind"])
                self.assertEqual("app", route["api_surface"])
                self.assertNotIn("static_delivery", route)
                self.assertIn(expected_service, route["evidence"])
                self.assertIn(expected_contract, route["evidence"])

        self.assertEqual(["/forum"], detail_route["operation_routes"])

    def test_forum_service_exposes_complete_runtime_operation_surface(self) -> None:
        service_source = (FORUM_PACKAGE / "src" / "forumService.ts").read_text(encoding="utf-8")
        required_operations = [
            "fetchForumFeeds",
            "fetchForumFeedDetail",
            "createForumFeed",
            "deleteForumFeed",
            "likeForumFeed",
            "unlikeForumFeed",
            "collectForumFeed",
            "uncollectForumFeed",
            "shareForumFeed",
            "fetchHotForumFeeds",
            "fetchRecommendedForumFeeds",
            "searchForumFeeds",
            "fetchTopForumFeeds",
            "fetchCategoryForumFeeds",
            "fetchMostViewedForumFeeds",
            "fetchMostLikedForumFeeds",
            "fetchForumFeedCategories",
            "checkForumFeedCollected",
            "fetchForumComments",
            "fetchForumCommentReplies",
            "fetchForumCommentDetail",
            "fetchMyForumComments",
            "fetchForumCommentStatistics",
            "createForumComment",
            "replyForumComment",
            "deleteForumComment",
            "likeForumComment",
            "unlikeForumComment",
            "pinForumComment",
            "unpinForumComment",
        ]

        for operation in required_operations:
            with self.subTest(operation=operation):
                self.assertIn(f"async {operation}", service_source)

        self.assertIn("getClawRouterAppSdkClient().feed", service_source)
        self.assertIn("getClawRouterAppSdkClient().comment", service_source)

    def test_forum_production_smoke_covers_route_and_chunk_semantics(self) -> None:
        smoke_path = ROOT / "apps" / "sdkwork-claw-router-portal" / "scripts" / "smoke-production-browser.mjs"
        product_test_path = ROOT / "scripts" / "run-claw-router-product.test.mjs"
        catalog_path = FORUM_PACKAGE / "src" / "forumCatalog.ts"

        smoke_source = smoke_path.read_text(encoding="utf-8")
        product_test_source = product_test_path.read_text(encoding="utf-8")
        catalog_source = catalog_path.read_text(encoding="utf-8")

        self.assertIn('pathName: "/forum"', smoke_source)
        self.assertIn('pathName: "/forum/1"', smoke_source)
        self.assertIn('pathName: "/forum?__browser-smoke-category=1"', smoke_source)
        self.assertIn('pathName: "/forum?__browser-smoke-search=1"', smoke_source)
        self.assertIn('pathName: "/forum?__browser-smoke-empty=1"', smoke_source)
        self.assertIn('pathName: "/forum?__browser-smoke-sort=1"', smoke_source)
        self.assertIn('pathName: "/forum?__browser-smoke-card-click=1"', smoke_source)
        self.assertIn('pathName: "/forum/1?__browser-smoke-detail=1"', smoke_source)
        self.assertIn('pathName: "/forum/1?__browser-smoke-related=1"', smoke_source)
        self.assertIn('pathName: "/forum/__browser-smoke-missing"', smoke_source)
        self.assertIn("Published snapshot: 2026-05-03", smoke_source)
        self.assertIn("Related discussions", smoke_source)
        self.assertIn("FORUM_CONTENT_SNAPSHOT_SOURCE", catalog_source)
        self.assertIn("deriveForumCatalogViewModel", catalog_source)
        self.assertIn("deriveForumPostDetailView", catalog_source)
        self.assertIn("portal production browser DOM smoke", product_test_source)
        self.assertIn("/forum/1?__browser-smoke-detail=1", product_test_source)

    def _route_entry(self, classification: dict, route: str) -> dict:
        for entry in classification.get("routes", []):
            if isinstance(entry, dict) and entry.get("route") == route:
                return entry
        self.fail(f"Missing frontend route classification for {route}.")


if __name__ == "__main__":
    unittest.main()
