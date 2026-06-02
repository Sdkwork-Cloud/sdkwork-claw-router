import unittest
import json
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
APP_OPENAPI_PATH = ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json"


class ForumRuntimeStandardTest(unittest.TestCase):
    def test_forum_pages_use_live_sdk_backed_catalog_module(self) -> None:
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

        self.assertIn("export const FORUM_CONTENT_SOURCE", catalog_source)
        self.assertIn("Live forum content", catalog_source)
        self.assertNotIn("FORUM_CONTENT_SNAPSHOT_SOURCE", catalog_source)
        self.assertNotIn("export const FORUM_POSTS", catalog_source)
        self.assertNotRegex(catalog_source, r"observedAt:\s*['\"]2026-05-03['\"]")
        self.assertIn("export function filterForumPostsForCatalog", catalog_source)
        self.assertIn("export function deriveForumCatalogViewModel", catalog_source)
        self.assertIn("export function deriveForumPostDetailView", catalog_source)
        self.assertIn("export function formatForumCount", catalog_source)

        self.assertIn("deriveForumCatalogViewModel", forum_view_source)
        self.assertIn("forumService.fetchForumFeeds", forum_view_source)
        self.assertIn("forumService.fetchForumOverview", forum_view_source)
        self.assertNotIn("FORUM_POSTS", forum_view_source)
        self.assertNotIn("const forumSeedPosts", forum_view_source)
        self.assertNotIn("forumSeedPosts.filter", forum_view_source)
        self.assertNotIn("const categories =", forum_view_source)

        self.assertIn("deriveForumPostDetailView", post_view_source)
        self.assertIn("forumService.fetchForumFeedDetail", post_view_source)
        self.assertIn("forumService.fetchForumComments", post_view_source)
        self.assertNotIn("FORUM_POSTS", post_view_source)
        self.assertNotIn("const forumSeedPostDetail", post_view_source)
        self.assertNotIn("const post = forumSeedPostDetail", post_view_source)

        self.assertIn("forum content source metadata is live and database-backed", runtime_test_source)
        self.assertIn("forum runtime pages do not use curated static data as live fallback", runtime_test_source)
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

        self.assertNotIn("Published snapshot", combined)
        self.assertNotIn("FORUM_POSTS", combined)
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

        self.assertIn("getClawRouterAppSdkClient().content.feeds", service_source)
        self.assertIn("getClawRouterAppSdkClient().content.comments", service_source)
        self.assertIn("getClawRouterAppSdkClient().content.users.current.comments", service_source)
        self.assertNotIn("getClawRouterAppSdkClient().feed", service_source)
        self.assertNotIn("getClawRouterAppSdkClient().comment", service_source)
        self.assertIn("contentType?: 'all' | 'feeds' | 'FEEDS'", service_source)
        self.assertIn("query.contentType", service_source)
        self.assertNotIn("fetchForumFeedCategories", service_source)
        self.assertNotIn("ForumCollectFeedRequest", service_source)
        self.assertNotIn("query.type,\n      undefined,\n      query.keyword", service_source)
        self.assertNotIn("contentType: 'feeds' | 'comments' | 'FEEDS' | 'COMMENTS';\n  contentId: number;\n  content: string;\n  parentId", service_source)

    def test_forum_openapi_matches_generated_content_feed_contract_shape(self) -> None:
        spec = json.loads(APP_OPENAPI_PATH.read_text(encoding="utf-8"))
        paths = spec["paths"]

        feed_id_paths = [
            "/app/v3/api/content/feeds/{id}",
            "/app/v3/api/content/feeds/{id}/likes",
            "/app/v3/api/content/feeds/{id}/likes/current",
            "/app/v3/api/content/feeds/{id}/collections",
            "/app/v3/api/content/feeds/{id}/collections/current",
            "/app/v3/api/content/feeds/{id}/shares",
        ]
        for path in feed_id_paths:
            with self.subTest(path=path):
                self.assertIn(path, paths)

        self.assertFalse(
            any("{feedId}" in path for path in paths),
            "forum feed OpenAPI paths must use the generated SDK path variable name {id}",
        )

        def query_names(path: str, method: str = "get") -> list[str]:
            return [
                parameter["name"]
                for parameter in paths[path][method]["parameters"]
                if parameter["in"] == "query"
            ]

        self.assertEqual(
            "/app/v3/api/content/feeds/search" in paths,
            False,
            "forum search must be expressed through GET /content/feeds?q=... rather than a separate search route",
        )
        self.assertEqual(
            ["type", "content_type", "q", "author_id", "page", "page_size"],
            query_names("/app/v3/api/content/feeds"),
        )
        self.assertEqual(["limit"], query_names("/app/v3/api/content/feeds/hot"))
        self.assertEqual(["limit"], query_names("/app/v3/api/content/feeds/recommend"))
        self.assertEqual(["limit"], query_names("/app/v3/api/content/feeds/top"))
        self.assertEqual(["limit"], query_names("/app/v3/api/content/feeds/most_viewed"))
        self.assertEqual(["limit"], query_names("/app/v3/api/content/feeds/most_liked"))
        self.assertEqual(["page", "page_size"], query_names("/app/v3/api/content/feeds/category/{categoryId}"))
        for path in [
            "/app/v3/api/content/feeds",
            "/app/v3/api/content/feeds/hot",
            "/app/v3/api/content/feeds/recommend",
            "/app/v3/api/content/feeds/top",
            "/app/v3/api/content/feeds/category/{categoryId}",
            "/app/v3/api/content/feeds/most_viewed",
            "/app/v3/api/content/feeds/most_liked",
        ]:
            with self.subTest(feed_list_path=path):
                result_ref = paths[path]["get"]["responses"]["200"]["content"]["application/json"]["schema"]["$ref"]
                result_schema = spec["components"]["schemas"][result_ref.rsplit("/", 1)[1]]
                data_schema = result_schema["properties"]["data"]
                self.assertEqual(
                    [{"$ref": "#/components/schemas/ForumFeedItemList"}],
                    data_schema["allOf"],
                    "generated content feed list endpoints return PlusApiResult<List<ForumFeedItem>>",
                )
                list_schema = spec["components"]["schemas"]["ForumFeedItemList"]
                self.assertEqual(
                    {
                        "type": "array",
                        "items": {"$ref": "#/components/schemas/ForumFeedItem"},
                    },
                    {key: list_schema[key] for key in ("type", "items")},
                    "generated content feed list endpoints return PlusApiResult<List<ForumFeedItem>>",
                )

        feed_id_schema = spec["components"]["schemas"]["ForumFeedItem"]["properties"]["id"]
        self.assertEqual(
            {"type": "integer", "format": "int64", "minimum": 1},
            {key: feed_id_schema[key] for key in ("type", "format", "minimum")},
            "ForumFeedItem.id must remain a numeric int64 instead of a string route id",
        )
        feed_item = spec["components"]["schemas"]["ForumFeedItem"]
        self.assertEqual(
            {
                "id",
                "title",
                "content",
                "summary",
                "cover",
                "contentType",
                "categoryId",
                "tags",
                "author",
                "viewCount",
                "likeCount",
                "commentCount",
                "shareCount",
                "isLiked",
                "isCollected",
                "isTop",
                "isHot",
                "isRecommended",
                "createdAt",
                "updatedAt",
            },
            set(feed_item["properties"]),
            "ForumFeedItem response fields must stay consumer-facing and must not expose PlusFeeds persistence-only fields",
        )
        self.assertEqual(
            [{"$ref": "#/components/schemas/MediaResource"}],
            feed_item["properties"]["cover"]["allOf"],
            "ForumFeedItem.cover must remain a MediaResource object until UI display extracts a concrete URL",
        )
        self.assertNotIn("coverImage", feed_item["properties"])
        self.assertNotIn("contentId", feed_item["properties"])
        self.assertNotIn("favoriteCount", feed_item["properties"])

        collect = paths["/app/v3/api/content/feeds/{id}/collections"]["post"]
        self.assertNotIn("requestBody", collect)
        self.assertIn(
            "folder_id",
            [parameter["name"] for parameter in collect["parameters"] if parameter["in"] == "query"],
        )
        folder_id_parameter = next(
            parameter for parameter in collect["parameters"] if parameter["in"] == "query" and parameter["name"] == "folder_id"
        )
        self.assertEqual(False, folder_id_parameter["required"])
        self.assertEqual(
            {"type": "integer", "format": "int64", "minimum": 1},
            folder_id_parameter["schema"],
        )
        self.assertNotIn(
            "/app/v3/api/content/feeds/categories",
            paths,
            "generated content feed API does not expose an app feed categories endpoint",
        )
        for path, method, result_schema in [
            ("/app/v3/api/content/feeds/{id}", "delete", "FeedsDeleteResult"),
            ("/app/v3/api/content/feeds/{id}/collections/current", "get", "FeedsCollectionsCurrentRetrieveResult"),
        ]:
            with self.subTest(path=path, method=method):
                self.assertEqual(
                    {"$ref": f"#/components/schemas/{result_schema}"},
                    paths[path][method]["responses"]["200"]["content"]["application/json"]["schema"],
                )
                self.assertEqual(
                    [{"$ref": "#/components/schemas/ForumBooleanResponse"}],
                    spec["components"]["schemas"][result_schema]["properties"]["data"]["allOf"],
                    "feed boolean endpoints return PlusApiResult<Boolean>, represented as a boolean response payload",
                )
        boolean_schema = spec["components"]["schemas"]["ForumBooleanResponse"]
        self.assertEqual("boolean", boolean_schema["type"])
        self.assertNotIn("properties", boolean_schema)

    def test_forum_openapi_matches_content_feed_create_validation_contract(self) -> None:
        spec = json.loads(APP_OPENAPI_PATH.read_text(encoding="utf-8"))
        schemas = spec["components"]["schemas"]
        create_feed = schemas["ForumCreateFeedRequest"]

        def assert_schema_includes(actual: dict, expected: dict) -> None:
            for key, value in expected.items():
                self.assertEqual(value, actual.get(key), f"schema field {key} must match generated validation contract")

        self.assertEqual(["content"], create_feed["required"])
        self.assertEqual(
            {
                "title",
                "content",
                "categoryId",
                "images",
                "tags",
                "source",
                "sourceUrl",
            },
            set(create_feed["properties"]),
            "Forum create feed request must match the generated content API without summary or local-only DTO fields",
        )
        assert_schema_includes(create_feed["properties"]["title"], {"type": "string", "maxLength": 255})
        assert_schema_includes(
            create_feed["properties"]["content"],
            {"type": "string", "minLength": 1, "maxLength": 2000},
        )
        assert_schema_includes(
            create_feed["properties"]["categoryId"],
            {"type": "integer", "format": "int64", "minimum": 0},
        )
        assert_schema_includes(create_feed["properties"]["images"], {"type": "array", "maxItems": 20})
        self.assertEqual(
            {"$ref": "#/components/schemas/MediaResource"},
            create_feed["properties"]["images"]["items"],
            "Forum create-feed images must preserve MediaResource objects instead of bare URL strings",
        )
        assert_schema_includes(create_feed["properties"]["tags"], {"type": "array", "maxItems": 20})
        assert_schema_includes(
            create_feed["properties"]["tags"]["items"],
            {"type": "string", "minLength": 1, "maxLength": 64},
        )
        assert_schema_includes(create_feed["properties"]["source"], {"type": "string", "maxLength": 100})
        assert_schema_includes(create_feed["properties"]["sourceUrl"], {"type": "string", "maxLength": 500})
        self.assertNotIn("summary", create_feed["properties"])

    def test_forum_frontend_service_preserves_content_request_validation_contract(self) -> None:
        service_source = (FORUM_PACKAGE / "src" / "forumService.ts").read_text(encoding="utf-8")
        runtime_test_source = (ROOT / "apps" / "sdkwork-claw-router-portal" / "forum-runtime.test.ts").read_text(
            encoding="utf-8"
        )

        self.assertIn("optionalNonNegativeInteger(input.categoryId, 'categoryId')", service_source)
        self.assertIn("optionalPositiveInteger(input.contentId, 'contentId')", service_source)
        self.assertIn("MAX_FEED_IMAGE_COUNT = 20", service_source)
        self.assertIn("MAX_FEED_TAG_COUNT = 20", service_source)
        self.assertIn("MAX_FEED_TAG_LENGTH = 64", service_source)
        self.assertIn("images?: ClawRouterMediaResource[];", service_source)
        self.assertIn(
            "normalizeMediaResourceList(input.images, 'images', MAX_FEED_IMAGE_COUNT)",
            service_source,
        )
        self.assertIn(
            "normalizeStringList(input.tags, 'tags', MAX_FEED_TAG_COUNT, MAX_FEED_TAG_LENGTH)",
            service_source,
        )
        self.assertIn("throw new Error('Forum boolean response is missing boolean data')", service_source)
        self.assertNotIn("readBoolean(readApiRecord(result), 'ok'", service_source)
        self.assertNotIn("categoryId: input.categoryId", service_source)
        self.assertNotIn("contentId: input.contentId", service_source)
        self.assertNotIn("slice(0, maxItems)", service_source)

        for expected_case in [
            "categoryId must be greater than or equal to 0",
            "images must contain at most 20 items",
            "images item must be a MediaResource",
            "tags must contain at most 20 items",
            "tags item must be at most 64 characters",
            "contentId must be a positive integer",
            "deviceInfo must be at most 512 characters",
            "folderId must be a positive integer",
            "forum service rejects stale ok-wrapper feed boolean results",
        ]:
            with self.subTest(expected_case=expected_case):
                self.assertIn(expected_case, runtime_test_source)

    def test_forum_openapi_matches_generated_content_comment_contract_shape(self) -> None:
        spec = json.loads(APP_OPENAPI_PATH.read_text(encoding="utf-8"))
        paths = spec["paths"]
        schemas = spec["components"]["schemas"]

        create_comment = schemas["ForumCreateCommentRequest"]
        self.assertEqual(
            ["contentType", "contentId", "content"],
            create_comment["required"],
        )
        self.assertEqual(
            {"contentType", "contentId", "content", "deviceInfo"},
            set(create_comment["properties"]),
            "Forum create request must match the generated content API without parentId/ipAddress",
        )
        self.assertNotIn("parentId", create_comment["properties"])
        self.assertNotIn("ipAddress", create_comment["properties"])

        reply_comment = schemas["ForumReplyCommentRequest"]
        self.assertEqual(["content"], reply_comment["required"])
        self.assertEqual(
            {"content", "deviceInfo"},
            set(reply_comment["properties"]),
            "Forum reply request must match the generated content API without content identity or external parent fields",
        )
        for stale_field in ("contentType", "contentId", "parentId", "ipAddress"):
            with self.subTest(stale_field=stale_field):
                self.assertNotIn(stale_field, reply_comment["properties"])

        delete_comment = paths["/app/v3/api/content/comments/{commentId}"]["delete"]
        self.assertEqual(
            {"$ref": "#/components/schemas/CommentsDeleteResult"},
            delete_comment["responses"]["200"]["content"]["application/json"]["schema"],
            "OpenAPI operations must use operation-specific generated result wrappers while preserving Void semantics as NoData.",
        )
        delete_result = schemas["CommentsDeleteResult"]
        self.assertEqual(
            [{"$ref": "#/components/schemas/NoData"}],
            delete_result["properties"]["data"]["allOf"],
        )
        self.assertNotIn(
            "/app/v3/api/comments/{commentId}",
            paths,
            "comment delete must live under the generated /content/comments namespace only",
        )
        self.assertEqual({}, schemas["NoData"]["properties"])
        self.assertEqual({"code", "msg", "message", "data"}, set(schemas["PlusApiResult"]["properties"]))
        self.assertEqual(
            [{"$ref": "#/components/schemas/NoData"}],
            schemas["PlusApiResult"]["properties"]["data"]["allOf"],
        )

    def test_rust_forum_ports_do_not_keep_removed_feed_categories_capability(self) -> None:
        rust_sources = [
            ROOT / "services" / "sdkwork-claw-product" / "src" / "ports" / "forum_store.rs",
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_forum.rs",
            ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "sqlite" / "forum_store.rs",
            ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "postgres" / "forum_store.rs",
        ]
        for source_path in rust_sources:
            with self.subTest(source_path=source_path):
                self.assertNotIn(
                    "load_feed_categories",
                    source_path.read_text(encoding="utf-8"),
                    "generated content feed API has no /feeds/categories app API, so Rust ports must not keep that removed capability",
                )

    def test_rust_forum_feed_item_matches_generated_feed_item_fields(self) -> None:
        port_source = (ROOT / "services" / "sdkwork-claw-product" / "src" / "ports" / "forum_store.rs").read_text(
            encoding="utf-8"
        )
        start = port_source.index("pub struct ForumFeedItem")
        end = port_source.index("#[derive(Debug, Clone, Default, Serialize, PartialEq, Eq)]", start + 1)
        struct_source = port_source[start:end]

        self.assertIn("pub id: i64", struct_source)
        self.assertIn("pub cover: Value", struct_source)
        self.assertIn("pub is_collected: bool", struct_source)
        self.assertNotIn("cover_image", struct_source)
        self.assertNotIn("pub content_id", struct_source)
        self.assertNotIn("pub favorite_count", struct_source)

    def test_rust_forum_media_persistence_rejects_legacy_url_field_fallbacks(self) -> None:
        for store_path in [
            ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "sqlite" / "forum_store.rs",
            ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "postgres" / "forum_store.rs",
        ]:
            with self.subTest(store_path=store_path):
                store_source = store_path.read_text(encoding="utf-8")
                self.assertIn("cover_resources", store_source)
                self.assertIn("value_to_media_resource", store_source)
                self.assertNotIn('object.get("assetUrl")', store_source)
                self.assertNotIn("coverImage", store_source)

    def test_rust_forum_api_uses_only_generated_pagination_parameter_names(self) -> None:
        api_source = (ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_forum.rs").read_text(
            encoding="utf-8"
        )

        self.assertNotIn("page_no: Option", api_source)
        self.assertNotIn("query.page_no", api_source)
        self.assertIn("page_size: Option", api_source)
        self.assertIn("query.page_size", api_source)
        self.assertNotIn("pageSize: Option", api_source)
        self.assertNotIn("query.pageSize", api_source)
        self.assertNotIn(".or(query.limit)", api_source)
        for store_path in [
            ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "sqlite" / "forum_store.rs",
            ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "postgres" / "forum_store.rs",
        ]:
            with self.subTest(store_path=store_path):
                store_source = store_path.read_text(encoding="utf-8")
                self.assertNotIn(".limit\n                .or(query.size)", store_source)
                self.assertIn(".size\n                .or(query.limit)", store_source)
        for removed_route in [
            '"/app/v3/api/content/feeds/list"',
            '"/app/v3/api/content/feeds/search"',
            '"/app/v3/api/content/feeds/check_collected/{id}"',
            '"/app/v3/api/content/feeds/collect/{id}"',
            '"/app/v3/api/content/feeds/share/{id}"',
            '"/app/v3/api/content/comments/list"',
            '"/app/v3/api/content/comments/mine"',
            '"/app/v3/api/content/comments/{comment_id}/like"',
            '"/app/v3/api/content/comments/{comment_id}/pin"',
        ]:
            with self.subTest(removed_route=removed_route):
                self.assertNotIn(removed_route, api_source)
        self.assertIn("const DEFAULT_REPLY_PAGE_SIZE: i64 = 10;", api_source)

    def test_forum_production_smoke_covers_route_and_chunk_semantics(self) -> None:
        smoke_path = ROOT / "apps" / "sdkwork-claw-router-portal" / "scripts" / "smoke-production-browser.mjs"
        product_test_path = ROOT / "scripts" / "run-claw-router-product.test.mjs"
        catalog_path = FORUM_PACKAGE / "src" / "forumCatalog.ts"

        smoke_source = smoke_path.read_text(encoding="utf-8")
        product_test_source = product_test_path.read_text(encoding="utf-8")
        catalog_source = catalog_path.read_text(encoding="utf-8")

        self.assertIn('pathName: "/forum"', smoke_source)
        self.assertIn('pathName: "/forum?__browser-smoke-live-empty=1"', smoke_source)
        self.assertIn('pathName: "/forum/__browser-smoke-missing"', smoke_source)
        self.assertNotIn('appSdkFixtureMode: APP_SDK_FIXTURE_MODE', smoke_source[
            smoke_source.index('pathName: "/forum"'):smoke_source.index('pathName: "/apps"')
        ])
        self.assertNotIn("Published snapshot", smoke_source)
        self.assertNotIn("BROWSER_SMOKE_FORUM_FEEDS", smoke_source)
        self.assertNotIn("resolveForumAppSdkFixture", smoke_source)
        self.assertIn("Live community feed", smoke_source)
        self.assertIn("No discussions found", smoke_source)
        self.assertIn("Community links are not configured.", smoke_source)
        self.assertIn("FORUM_CONTENT_SOURCE", catalog_source)
        self.assertIn("deriveForumCatalogViewModel", catalog_source)
        self.assertIn("deriveForumPostDetailView", catalog_source)
        self.assertIn("portal production browser DOM smoke", product_test_source)
        self.assertIn("/forum?__browser-smoke-live-empty=1", product_test_source)
        self.assertIn("/forum/__browser-smoke-missing", product_test_source)

    def _route_entry(self, classification: dict, route: str) -> dict:
        for entry in classification.get("routes", []):
            if isinstance(entry, dict) and entry.get("route") == route:
                return entry
        self.fail(f"Missing frontend route classification for {route}.")


if __name__ == "__main__":
    unittest.main()
