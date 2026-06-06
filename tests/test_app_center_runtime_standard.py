import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class AppCenterRuntimeStandardTest(unittest.TestCase):
    def test_app_center_runtime_uses_generated_app_sdk_boundary(self) -> None:
        package = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-app-center"
        )
        runtime_path = package / "src" / "appRuntime.ts"
        service_path = package / "src" / "services" / "appService.ts"
        package_manifest_path = package / "package.json"
        list_path = package / "src" / "pages" / "AppCenter.tsx"
        detail_path = package / "src" / "pages" / "AppDetails.tsx"
        preview_path = package / "src" / "components" / "AppCenterPreview.tsx"
        runtime_test_path = ROOT / "apps" / "sdkwork-clawrouter-pc" / "app-runtime.test.ts"
        verifier_path = ROOT / "scripts" / "verify-claw-router-product.mjs"

        self.assertTrue(runtime_path.exists(), "App Center runtime mapping must live in a pure module.")
        self.assertTrue(runtime_test_path.exists(), "App Center runtime behavior must have executable Node tests.")

        runtime_source = runtime_path.read_text(encoding="utf-8")
        service_source = service_path.read_text(encoding="utf-8")
        package_manifest = json.loads(package_manifest_path.read_text(encoding="utf-8"))
        list_source = list_path.read_text(encoding="utf-8")
        detail_source = detail_path.read_text(encoding="utf-8")
        preview_source = preview_path.read_text(encoding="utf-8")
        runtime_test_source = runtime_test_path.read_text(encoding="utf-8")
        verifier_source = verifier_path.read_text(encoding="utf-8")

        self.assertIn("export type App", runtime_source)
        self.assertIn("export type AppRelease", runtime_source)
        self.assertIn("export function normalizeAppApiRecord", runtime_source)
        self.assertIn("export function filterAppsForCatalog", runtime_source)
        self.assertIn("export function deriveAppCatalogViewModel", runtime_source)
        self.assertIn("export function deriveAppDetailView", runtime_source)
        self.assertIn("export function formatAppDateLabel", runtime_source)

        self.assertIn("getClawRouterAppSdkClient().platform.apps.store.list", service_source)
        self.assertIn("getClawRouterAppSdkClient().platform.apps.store.retrieve", service_source)
        self.assertIn("getClawRouterAppSdkClient().platform.apps.store.categories.list", service_source)
        self.assertIn("normalizeAppApiRecord", service_source)
        self.assertIn("toAppCatalogQueryParams", service_source)
        self.assertNotIn("filterAppsForCatalog(", service_source)
        self.assertIn(
            "sdkwork-clawrouter-pc-commons",
            package_manifest.get("dependencies", {}),
            "App Center must consume generated SDKs through the shared runtime boundary.",
        )

        for page_source in [list_source, detail_source, preview_source]:
            self.assertNotIn("from '../data/apps'", page_source)
            self.assertNotIn("apps.data.${", page_source)

        self.assertIn("deriveAppCatalogViewModel", list_source)
        self.assertIn("deriveAppDetailView", detail_source)
        self.assertIn("app runtime normalizes app SDK records", runtime_test_source)
        self.assertIn("portal app center runtime tests", verifier_source)
        self.assertIn("apps/sdkwork-clawrouter-pc/app-runtime.test.ts", verifier_source)

    def test_app_center_uses_precise_app_sdk_response_contracts(self) -> None:
        contract = (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(
            encoding="utf-8"
        )
        openapi = (ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json").read_text(
            encoding="utf-8"
        )
        app_api = (ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "api" / "platform.ts").read_text(
            encoding="utf-8"
        )
        app_service = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-app-center"
            / "src"
            / "services"
            / "appService.ts"
        ).read_text(encoding="utf-8")

        for schema_name in [
            "AppCatalogResponse",
            "AppCatalogItem",
            "AppReleaseItem",
            "AppDetailResponse",
            "AppCategoriesResponse",
        ]:
            self.assertIn(f"name: {schema_name}", contract)
            self.assertIn(f'"{schema_name}"', openapi)

        for result_name in [
            "AppsStoreListResult",
            "AppsStoreRetrieveResult",
            "AppsStoreCategoriesListResult",
        ]:
            self.assertIn(f'"{result_name}"', openapi)

        self.assertIn('"$ref": "#/components/schemas/AppCatalogResponse"', openapi)
        self.assertIn('"$ref": "#/components/schemas/AppDetailResponse"', openapi)
        self.assertIn('"$ref": "#/components/schemas/AppCategoriesResponse"', openapi)

        self.assertIn("q?: string;", app_api)
        self.assertIn("category?: string;", app_api)
        self.assertIn("platformType?: 'Desktop' | 'Mobile' | 'Web' | 'Mini Program';", app_api)
        self.assertIn("platformTypes?: ('Desktop' | 'Mobile' | 'Web' | 'Mini Program')[];", app_api)
        self.assertIn("sort?: 'popular_desc' | 'rating_desc' | 'newest_desc';", app_api)
        self.assertIn("get<AppsStoreListResult>", app_api)
        self.assertIn("async retrieve(appId: string): Promise<AppsStoreRetrieveResult>", app_api)
        self.assertIn("get<AppsStoreRetrieveResult>", app_api)
        self.assertIn("async list(): Promise<AppsStoreCategoriesListResult>", app_api)
        self.assertIn("get<AppsStoreCategoriesListResult>", app_api)
        self.assertIn("buildQueryString", app_api)
        self.assertIn("appendQueryString(appApiPath(`/platform/apps/store`), query)", app_api)
        self.assertIn("{ name: 'q', value: params?.q", app_api)
        self.assertIn("{ name: 'category', value: params?.category", app_api)
        self.assertIn("{ name: 'platform_type', value: params?.platformType", app_api)
        self.assertIn("{ name: 'platform_types', value: params?.platformTypes", app_api)
        self.assertIn("{ name: 'sort', value: params?.sort", app_api)
        self.assertNotIn("searchQuery?: string;", app_api)
        self.assertNotIn("search_query", app_api)
        self.assertNotIn("getApps(params?: QueryParams): Promise<PlusApiResult>", app_api)
        self.assertNotIn("getAppById(appId: string, params?: QueryParams): Promise<PlusApiResult>", app_api)
        self.assertNotIn("getCategories(params?: QueryParams): Promise<PlusApiResult>", app_api)

        result_checks = {
            "apps-store-list-result.ts": "data?: AppCatalogResponse;",
            "apps-store-retrieve-result.ts": "data?: AppDetailResponse;",
            "apps-store-categories-list-result.ts": "data?: AppCategoriesResponse;",
        }
        for file_name, expected in result_checks.items():
            result_path = ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "types" / file_name
            self.assertTrue(result_path.exists(), file_name)
            self.assertIn(expected, result_path.read_text(encoding="utf-8"))

        self.assertIn("AppCatalogResponse as SdkAppCatalogResponse", app_service)
        self.assertIn("AppDetailResponse as SdkAppDetailResponse", app_service)
        self.assertIn("AppCategoriesResponse as SdkAppCategoriesResponse", app_service)
        self.assertIn("const items: SdkAppCatalogResponse['items']", app_service)
        self.assertIn("total: readOptionalNonNegativeInteger", app_service)
        self.assertIn("hasNextPage: readOptionalBoolean", app_service)
        self.assertIn("const item: SdkAppDetailResponse", app_service)
        self.assertIn("const items: SdkAppCategoriesResponse['items']", app_service)
        self.assertIn("type AppCatalogStatus = 'ACTIVE' | 'INACTIVE';", app_service)
        self.assertIn("function optionalAppCatalogStatus", app_service)
        self.assertIn("const query = toAppCatalogQueryParams(filters)", app_service)
        self.assertIn("getClawRouterAppSdkClient().platform.apps.store.list(query)", app_service)
        self.assertIn("page: optionalPositiveInteger(filters.page, 'page')", app_service)
        self.assertIn("pageSize: optionalBoundedPositiveInteger(filters.pageSize, 'pageSize'", app_service)
        self.assertIn("category: optionalSingleCategory(filters.categories)", app_service)
        self.assertIn("platformTypes: optionalPlatformTypes(filters.platformTypes)", app_service)
        self.assertIn("sort: optionalAppCatalogSort(filters.sortBy)", app_service)
        self.assertIn("searchQuery,", app_service)
        self.assertNotIn("case 'ENABLED':", app_service)
        self.assertNotIn("case 'DISABLED':", app_service)
        self.assertNotIn("case '1':", app_service)
        self.assertNotIn("case '0':", app_service)
        self.assertNotIn("status.toUpperCase()", app_service)

    def test_public_app_store_release_artifacts_are_media_resources(self) -> None:
        contract = (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(
            encoding="utf-8"
        )
        openapi = (ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json").read_text(
            encoding="utf-8"
        )
        sdk_release_type = (
            ROOT
            / "sdks"
            / "clawrouter-app-sdk"
            / "clawrouter-app-sdk-typescript"
            / "src"
            / "types"
            / "app-release-item.ts"
        ).read_text(encoding="utf-8")
        release_port = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "ports"
            / "app_store_read_store.rs"
        ).read_text(encoding="utf-8")
        catalog_mapping = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "app_catalog_mapping.rs"
        ).read_text(encoding="utf-8")
        release_schema = contract[contract.index("app_release_item:"):contract.index("app_catalog_item:")]

        self.assertIn("- artifact", release_schema)
        self.assertIn("artifact:\n        $ref: '#/components/schemas/MediaResource'", release_schema)
        self.assertNotIn("downloadUrl", release_schema)
        self.assertIn('"artifact":', openapi)
        self.assertIn("import type { MediaResource } from './media-resource';", sdk_release_type)
        self.assertIn("artifact: MediaResource;", sdk_release_type)
        self.assertNotIn("downloadUrl", sdk_release_type)

        self.assertIn("pub artifact: Value,", release_port)
        self.assertNotIn("pub download_url: String,", release_port)
        self.assertIn("artifact: catalog_artifact_media_resource(artifact),", catalog_mapping)
        self.assertIn("let artifact = json_release_artifact(object)?;", catalog_mapping)
        release_artifact_reader_start = catalog_mapping.index("fn json_release_artifact")
        release_artifact_reader = catalog_mapping[
            release_artifact_reader_start:
            catalog_mapping.index("fn app_category(", release_artifact_reader_start)
        ]
        self.assertIn('get("artifact")', release_artifact_reader)
        self.assertIn('get("resource")', release_artifact_reader)
        self.assertNotIn('object_string(object, "downloadUrl")', release_artifact_reader)
        self.assertNotIn('object_string(object, "download_url")', release_artifact_reader)
        self.assertNotIn('object_string(object, "url")', release_artifact_reader)
        self.assertNotIn("value_to_media_resource", release_artifact_reader)
        self.assertNotIn("media_resource_from_url", release_artifact_reader)

    def test_admin_app_management_contract_and_backend_sdk_boundary_are_complete(self) -> None:
        contract = (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(
            encoding="utf-8"
        )
        openapi = (ROOT / "generated" / "openapi" / "clawrouter-backend-openapi.json").read_text(
            encoding="utf-8"
        )
        backend_app_api_path = ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "api" / "platform.ts"
        admin_service_path = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-app-center"
            / "src"
            / "services"
            / "adminAppService.ts"
        )
        api_mod_source = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "mod.rs"
        ).read_text(encoding="utf-8")
        api_admin_app_source = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "admin_app.rs"
        ).read_text(encoding="utf-8")

        self.assertIn("route: /admin/app", contract)
        self.assertIn("api_path: /backend/v3/api/platform/apps", contract)
        self.assertIn("api_path: /backend/v3/api/platform/apps/{appId}", contract)
        self.assertIn("name: AdminAppListResponse", contract)
        self.assertIn("name: AdminAppItemResponse", contract)
        self.assertIn("name: AdminAppMutationResponse", contract)
        self.assertIn("name: AdminAppCreateRequest", contract)
        self.assertIn("name: AdminAppUpdateRequest", contract)
        self.assertIn("name: AdminAppConfigStandard", contract)
        self.assertIn("name: AdminAppConfig", contract)

        for operation_id in [
            "apps.list",
            "apps.create",
            "apps.retrieve",
            "apps.update",
            "apps.delete",
            "apps.enable",
            "apps.disable",
            "apps.publish",
            "apps.unpublish",
        ]:
            self.assertIn(f'"operationId": "{operation_id}"', openapi)

        self.assertIn('"/backend/v3/api/platform/apps"', openapi)
        self.assertIn('"/backend/v3/api/platform/apps/{appId}/unpublish"', openapi)
        self.assertIn('"/backend/v3/api/platform/apps/{appId}"', openapi)
        self.assertIn('"AdminAppListResponse"', openapi)
        self.assertIn('"AdminAppItemResponse"', openapi)
        self.assertIn('"AdminAppMutationResponse"', openapi)
        self.assertIn('"AdminAppCreateRequest"', openapi)
        self.assertIn('"AdminAppUpdateRequest"', openapi)
        self.assertIn('"AdminAppConfigStandard"', openapi)
        self.assertIn('"AdminAppConfig"', openapi)
        self.assertIn('"$ref": "#/components/schemas/AdminAppConfig"', openapi)
        self.assertIn('"$ref": "#/components/schemas/AdminAppConfigStandard"', openapi)
        self.assertIn('"pattern": "^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"', openapi)
        self.assertIn('"required": [\n          "appKey"\n        ]', openapi)

        self.assertIn("pub use admin_app::admin_app_router_with_store;", api_mod_source)
        self.assertIn("pub fn admin_app_router_with_store", api_admin_app_source)
        self.assertTrue(backend_app_api_path.exists(), "backend SDK must generate a platform API module.")
        backend_app_api = backend_app_api_path.read_text(encoding="utf-8")
        self.assertIn("async list(params?: PlatformAppsListParams): Promise<AppsListResult>", backend_app_api)
        self.assertIn("{ name: 'q', value: params?.q", backend_app_api)
        self.assertIn("{ name: 'market_status', value: params?.marketStatus", backend_app_api)
        self.assertIn("{ name: 'category_id', value: params?.categoryId", backend_app_api)
        self.assertNotIn("AdminAppListRequest", backend_app_api)
        self.assertIn("async create(body: AdminAppCreateRequest): Promise<AppsCreateResult>", backend_app_api)
        self.assertIn("async retrieve(appId: string): Promise<AppsRetrieveResult>", backend_app_api)
        self.assertIn("async update(appId: string, body: AdminAppUpdateRequest): Promise<AppsUpdateResult>", backend_app_api)
        self.assertIn("async delete(appId: string): Promise<AppsDeleteResult>", backend_app_api)
        self.assertIn("async enable(appId: string): Promise<AppsEnableResult>", backend_app_api)
        self.assertIn("async disable(appId: string): Promise<AppsDisableResult>", backend_app_api)
        self.assertIn("async publish(appId: string): Promise<AppsPublishResult>", backend_app_api)
        self.assertIn("async unpublish(appId: string): Promise<AppsUnpublishResult>", backend_app_api)

        backend_create_request = (
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "types" / "admin-app-create-request.ts"
        ).read_text(encoding="utf-8")
        backend_update_request = (
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "types" / "admin-app-update-request.ts"
        ).read_text(encoding="utf-8")
        backend_config_type = (
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "types" / "admin-app-config.ts"
        )
        backend_config_standard_type = (
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "types" / "admin-app-config-standard.ts"
        )
        self.assertTrue(backend_config_type.exists(), "backend SDK must generate a typed AdminAppConfig.")
        self.assertTrue(
            backend_config_standard_type.exists(),
            "backend SDK must generate a typed AdminAppConfigStandard.",
        )
        self.assertIn("import type { AdminAppConfig }", backend_create_request)
        self.assertIn("config: AdminAppConfig;", backend_create_request)
        self.assertIn("config?: AdminAppConfig;", backend_update_request)
        self.assertIn("standard: AdminAppConfigStandard;", backend_config_type.read_text(encoding="utf-8"))
        self.assertIn("appKey: string;", backend_config_standard_type.read_text(encoding="utf-8"))

        self.assertTrue(admin_service_path.exists(), "admin app service must provide the frontend SDK boundary.")
        admin_service = admin_service_path.read_text(encoding="utf-8")
        self.assertIn("getClawRouterBackendSdkClient().platform.apps.list", admin_service)
        self.assertIn("getClawRouterBackendSdkClient().platform.apps.create", admin_service)
        self.assertIn("getClawRouterBackendSdkClient().platform.apps.retrieve", admin_service)
        self.assertIn("getClawRouterBackendSdkClient().platform.apps.update", admin_service)
        self.assertIn("getClawRouterBackendSdkClient().platform.apps.delete", admin_service)
        self.assertIn("getClawRouterBackendSdkClient().platform.apps.enable", admin_service)
        self.assertIn("getClawRouterBackendSdkClient().platform.apps.disable", admin_service)
        self.assertIn("getClawRouterBackendSdkClient().platform.apps.publish", admin_service)
        self.assertIn("getClawRouterBackendSdkClient().platform.apps.unpublish", admin_service)
        self.assertIn("categoryId?: unknown;", admin_service)
        self.assertIn("request.categoryId = positiveInteger(input.categoryId, 'categoryId'", admin_service)
        self.assertIn("readOptionalNonNegativeInteger", admin_service)
        self.assertIn("readOptionalBoolean", admin_service)
        self.assertNotIn("fetch(", admin_service)
        self.assertNotIn("axios", admin_service)
        self.assertNotIn("/backend/v3/api", admin_service)
        self.assertNotIn("normalized === 'ENABLED'", admin_service)
        self.assertNotIn("normalized === 'DISABLED'", admin_service)
        self.assertNotIn("normalized === '1'", admin_service)
        self.assertNotIn("normalized === '0'", admin_service)
        self.assertNotIn("toUpperCase()", admin_service)
        self.assertIn("normalized === 'DRAFT'", admin_service)
        self.assertIn("normalized === 'PUBLISHED'", admin_service)
        self.assertIn("normalized === 'OFFLINE'", admin_service)

    def test_admin_app_openapi_documents_runtime_and_market_status_separation(self) -> None:
        contract = (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(
            encoding="utf-8"
        )
        openapi = (ROOT / "generated" / "openapi" / "clawrouter-backend-openapi.json").read_text(
            encoding="utf-8"
        )

        for expected in [
            "Sets PlusApp runtime status to ACTIVE without changing config.portal.marketStatus.",
            "Sets PlusApp runtime status to INACTIVE without changing config.portal.marketStatus.",
            "Sets config.portal.marketStatus to PUBLISHED without changing PlusApp runtime status.",
            "Sets config.portal.marketStatus to OFFLINE without changing PlusApp runtime status.",
        ]:
            self.assertIn(expected, contract)
            self.assertIn(expected, openapi)

    def test_admin_app_artifact_fields_are_media_resource_objects(self) -> None:
        contract = (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(
            encoding="utf-8"
        )
        openapi = (ROOT / "generated" / "openapi" / "clawrouter-backend-openapi.json").read_text(
            encoding="utf-8"
        )
        backend_create_request = (
            ROOT
            / "sdks"
            / "clawrouter-backend-sdk"
            / "clawrouter-backend-sdk-typescript"
            / "src"
            / "types"
            / "admin-app-create-request.ts"
        ).read_text(encoding="utf-8")
        backend_update_request = (
            ROOT
            / "sdks"
            / "clawrouter-backend-sdk"
            / "clawrouter-backend-sdk-typescript"
            / "src"
            / "types"
            / "admin-app-update-request.ts"
        ).read_text(encoding="utf-8")
        backend_item_response = (
            ROOT
            / "sdks"
            / "clawrouter-backend-sdk"
            / "clawrouter-backend-sdk-typescript"
            / "src"
            / "types"
            / "admin-app-item-response.ts"
        ).read_text(encoding="utf-8")
        admin_service = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-app-center"
            / "src"
            / "services"
            / "adminAppService.ts"
        ).read_text(encoding="utf-8")
        app_admin_source = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-app-center"
            / "src"
            / "pages"
            / "AppAdmin.tsx"
        ).read_text(encoding="utf-8")
        api_admin_app_source = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "admin_app.rs"
        ).read_text(encoding="utf-8")
        admin_app_port = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "ports" / "admin_app_store.rs"
        ).read_text(encoding="utf-8")

        admin_item_schema = contract[contract.index("admin_app_item:"):contract.index("admin_app_category_item:")]
        self.assertIn("artifact:\n        $ref: '#/components/schemas/MediaResource'", admin_item_schema)
        self.assertNotIn("downloadUrl", admin_item_schema)
        self.assertIn('"artifact":', openapi)

        for sdk_type in [backend_create_request, backend_update_request, backend_item_response]:
            self.assertIn("import type { MediaResource }", sdk_type)
            self.assertIn("artifact", sdk_type)
            self.assertNotIn("downloadUrl", sdk_type)

        self.assertIn("artifact?: ClawRouterMediaResource | null;", admin_service)
        self.assertIn("artifact: readMediaResource(item.artifact)", admin_service)
        self.assertIn("input.artifact", admin_service)
        self.assertNotIn("downloadUrl: string", admin_service)
        self.assertNotIn("downloadUrl?: string", admin_service)
        self.assertNotIn("readNullableString(item, 'downloadUrl')", admin_service)
        self.assertNotIn("normalizeNullableUrl(input.downloadUrl", admin_service)

        self.assertIn("readMediaResourceUrl(app.artifact)", app_admin_source)
        self.assertIn('name="artifact"', app_admin_source)
        self.assertNotIn("app.downloadUrl", app_admin_source)
        self.assertNotIn('name="downloadUrl"', app_admin_source)

        self.assertIn("artifact: Option<Value>", api_admin_app_source)
        self.assertIn("artifact: item.artifact", api_admin_app_source)
        self.assertNotIn("download_url: Option<String>", api_admin_app_source)
        self.assertIn("pub artifact: Option<Value>", admin_app_port)
        self.assertNotIn("pub download_url: Option<String>", admin_app_port)
        self.assertNotIn("pub download_url: Option<Option<String>>", admin_app_port)

    def test_public_app_store_contract_documents_stable_identity_and_public_projection(self) -> None:
        contract = (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(
            encoding="utf-8"
        )
        openapi = (ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json").read_text(
            encoding="utf-8"
        )

        expected_contract_phrases = [
            "Stable application identity from plus_app.config.standard.appKey when present; falls back to plus_app.id only when appKey is absent.",
            "Returns public App Store entries where PlusApp runtime status is ACTIVE and config.portal.marketStatus is PUBLISHED.",
            "Path parameter appId accepts either the stable appKey or numeric plus_app.id and applies the same ACTIVE/PUBLISHED and public organization_id = 0 visibility rules as getApps.",
        ]

        for expected in expected_contract_phrases:
            self.assertIn(expected, contract)
            self.assertIn(expected, openapi)
        for expected in [
            "Authenticated positive-organization app sessions may read same-tenant public organization_id = 0 app projections;",
            "tenant isolation is always enforced.",
        ]:
            self.assertIn(expected, contract)
            self.assertIn(expected, openapi)

    def test_admin_app_management_page_exposes_complete_plus_app_payload_fields(self) -> None:
        app_admin_source = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-app-center"
            / "src"
            / "pages"
            / "AppAdmin.tsx"
        ).read_text(encoding="utf-8")
        admin_service = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-app-center"
            / "src"
            / "services"
            / "adminAppService.ts"
        ).read_text(encoding="utf-8")
        i18n_source = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-i18n"
            / "src"
            / "resources"
            / "admin"
            / "app-center.ts"
        ).read_text(encoding="utf-8")

        for field_name in [
            "appKey",
            "icon",
            "resourceList",
            "config",
            "platforms",
            "installPlatforms",
            "installSkill",
            "installConfig",
            "releaseNotes",
        ]:
            with self.subTest(field=field_name):
                self.assertIn(f"name=\"{field_name}\"", app_admin_source)
                self.assertIn(f"'{field_name}'", admin_service)

        for label_key, english_label in [
            ("admin.app.fields.appKey", "App Key"),
            ("admin.app.fields.icon", "Icon"),
            ("admin.app.fields.resourceList", "Resource List"),
            ("admin.app.fields.config", "Config"),
            ("admin.app.fields.platforms", "Platforms"),
            ("admin.app.fields.installPlatforms", "Install Platforms"),
            ("admin.app.fields.installSkill", "Install Skill"),
            ("admin.app.fields.installConfig", "Install Config"),
            ("admin.app.fields.releaseNotes", "Release Notes"),
        ]:
            self.assertIn(f"label={{t('{label_key}')}}", app_admin_source)
            self.assertIn(f'"{label_key}": "{english_label}"', i18n_source)

    def test_admin_app_management_page_uses_backend_query_filters(self) -> None:
        app_admin_source = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-app-center"
            / "src"
            / "pages"
            / "AppAdmin.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("AdminAppService.fetchApps(adminAppQuery)", app_admin_source)
        self.assertIn("const adminAppQuery = useMemo", app_admin_source)
        self.assertIn("searchQuery: normalizedKeyword", app_admin_source)
        self.assertIn("status: status || undefined", app_admin_source)
        self.assertIn("marketStatus: marketStatus || undefined", app_admin_source)
        self.assertIn("categoryId: selectedCategoryId || undefined", app_admin_source)
        self.assertIn("page,", app_admin_source)
        self.assertIn("pageSize,", app_admin_source)
        self.assertIn("useEffect(() =>", app_admin_source)
        self.assertIn("void loadApps();", app_admin_source)
        self.assertIn("}, [activeTab, loadApps]);", app_admin_source)

        forbidden_local_filter_tokens = [
            "return apps.filter((app)",
            "normalizedKeyword)",
            ".join(' ')",
            ".includes(normalizedKeyword)",
        ]
        for token in forbidden_local_filter_tokens:
            self.assertNotIn(token, app_admin_source)

    def test_admin_app_edit_form_does_not_inject_create_defaults(self) -> None:
        app_admin_source = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-app-center"
            / "src"
            / "pages"
            / "AppAdmin.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("defaultValue={isEdit ? app?.version ?? '' : app?.version ?? '1.0.0'}", app_admin_source)
        self.assertIn("defaultValue={isEdit ? app?.appType ?? '' : app?.appType ?? 'web'}", app_admin_source)
        self.assertNotIn("defaultValue={app?.version ?? '1.0.0'}", app_admin_source)
        self.assertNotIn("defaultValue={app?.appType ?? 'web'}", app_admin_source)

    def test_admin_app_management_has_stable_route_navigation_and_package_export(self) -> None:
        portal = ROOT / "apps" / "sdkwork-clawrouter-pc"
        app_source = (portal / "src" / "App.tsx").read_text(encoding="utf-8")
        admin_registry_source = (portal / "src" / "adminModuleRegistry.ts").read_text(encoding="utf-8")
        core_navigation_source = (
            portal
            / "packages"
            / "sdkwork-clawrouter-pc-i18n"
            / "src"
            / "resources"
            / "admin"
            / "core-navigation.ts"
        ).read_text(encoding="utf-8")
        app_center_index = (
            portal
            / "packages"
            / "sdkwork-clawrouter-pc-app-center"
            / "src"
            / "index.ts"
        ).read_text(encoding="utf-8")

        self.assertIn(
            "const AppAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-app-center'), 'AppAdmin');",
            app_source,
        )
        self.assertIn('<Route path="app" element={<AppAdmin />} />', app_source)
        self.assertIn("defaultPath: '/admin/app'", admin_registry_source)
        self.assertIn("itemBlock({ path: '/admin/app', labelKey: 'admin.menu.appStore', icon: Package })", admin_registry_source)
        self.assertIn('"admin.menu.appStore": "App Store"', core_navigation_source)
        self.assertIn("export * from './pages/AppAdmin';", app_center_index)

    def test_app_center_sdk_routes_have_retryable_error_states(self) -> None:
        package = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-app-center"
        )
        list_source = (package / "src" / "pages" / "AppCenter.tsx").read_text(encoding="utf-8")
        detail_source = (package / "src" / "pages" / "AppDetails.tsx").read_text(encoding="utf-8")
        preview_source = (package / "src" / "components" / "AppCenterPreview.tsx").read_text(encoding="utf-8")
        commons_runtime_test = (
            ROOT / "apps" / "sdkwork-clawrouter-pc" / "commons-runtime.test.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("getLoadErrorMessage returns Error messages", commons_runtime_test)

        required_sources = {
            "AppCenter.tsx": list_source,
            "AppDetails.tsx": detail_source,
            "AppCenterPreview.tsx": preview_source,
        }

        for name, source in required_sources.items():
            with self.subTest(component=name):
                self.assertIn("BusinessStatePanel", source)
                self.assertIn("getLoadErrorMessage", source)
                self.assertIn("loadError", source)
                self.assertIn("catch", source)
                self.assertIn("onRetry", source)
                self.assertNotIn("console.error", source)

        self.assertIn("apps.errors.loadFallback", list_source)
        self.assertIn("apps.errors.categoriesLoadFallback", list_source)
        self.assertIn("Failed to load app details.", detail_source)
        self.assertIn("Failed to load featured apps.", preview_source)

        for source in [list_source, detail_source]:
            self.assertIn("finally", source)

        self.assertIn("loadCategories", list_source)
        self.assertIn("categoryLoadError", list_source)
        self.assertIn("loadApps", list_source)
        self.assertIn("data-business-state={loadError ? 'error' : undefined}", list_source)
        self.assertIn("loadAppDetails", detail_source)
        self.assertIn("setSelectedRelease(fetchedApp?.releases[0] ?? null)", detail_source)
        self.assertIn("loadPreviewApps", preview_source)

    def test_app_center_has_no_static_seed_or_browser_runtime_drift(self) -> None:
        package = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-app-center"
        )
        data_path = package / "src" / "data" / "apps.ts"
        list_source = (package / "src" / "pages" / "AppCenter.tsx").read_text(encoding="utf-8")
        detail_source = (package / "src" / "pages" / "AppDetails.tsx").read_text(encoding="utf-8")
        preview_source = (package / "src" / "components" / "AppCenterPreview.tsx").read_text(encoding="utf-8")
        service_source = (package / "src" / "services" / "appService.ts").read_text(encoding="utf-8")
        runtime_source = (package / "src" / "appRuntime.ts").read_text(encoding="utf-8")
        combined_components = f"{list_source}\n{detail_source}\n{preview_source}"

        self.assertFalse(data_path.exists(), "App Center must not ship static seed data for SDK-backed routes.")

        for forbidden_component_token in [
            "new Date(",
            "toLocaleDateString",
            "toLocaleString",
            "Math.random",
            "setTimeout(",
            "setInterval(",
            "APPS",
            "../data/apps",
            "apps.data.${",
        ]:
            self.assertNotIn(forbidden_component_token, combined_components)

        for forbidden_service_token in [
            "fetch(",
            "axios",
            "/app/v3/api",
            "Authorization",
            "APPS",
            "new Date(",
            "../data/apps",
        ]:
            self.assertNotIn(forbidden_service_token, service_source)

        for forbidden_runtime_token in [
            "toLocaleDateString",
            "toLocaleString",
            "Math.random",
            "setTimeout(",
        ]:
            self.assertNotIn(forbidden_runtime_token, runtime_source)

    def test_app_center_contract_evidence_points_to_runtime_shape_not_seed_data(self) -> None:
        contracts = (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(encoding="utf-8")
        field_audit = (ROOT / "generated" / "schema" / "frontend" / "frontend-field-audit.json").read_text(encoding="utf-8")
        operation_audit = (ROOT / "generated" / "schema" / "frontend" / "frontend-operation-audit.json").read_text(encoding="utf-8")
        route_classification = (ROOT / "docs" / "schema-registry" / "frontend-route-classification.yaml").read_text(encoding="utf-8")

        expected_source = "apps/sdkwork-clawrouter-pc/packages/sdkwork-clawrouter-pc-app-center/src/appRuntime.ts"
        service_source = "apps/sdkwork-clawrouter-pc/packages/sdkwork-clawrouter-pc-app-center/src/services/appService.ts"
        old_source = "apps/sdkwork-clawrouter-pc/packages/sdkwork-clawrouter-pc-app-center/src/data/apps.ts"

        self.assertIn("route: /apps", contracts)
        self.assertIn(f"source: {expected_source}", contracts)
        self.assertIn(f"source: {service_source}", contracts)
        self.assertNotIn(f"source: {old_source}", contracts)
        self.assertIn('"source": "apps/sdkwork-clawrouter-pc/packages/sdkwork-clawrouter-pc-app-center/src/appRuntime.ts"', field_audit)
        self.assertNotIn('"source": "apps/sdkwork-clawrouter-pc/packages/sdkwork-clawrouter-pc-app-center/src/data/apps.ts"', field_audit)
        self.assertIn("/app/v3/api/platform/apps/store", operation_audit)
        self.assertIn("/app/v3/api/platform/apps/store/{appId}", operation_audit)
        self.assertIn("delivery_kind: sdk_backed_business_runtime", route_classification)
        self.assertIn("/apps/:id", route_classification)

    def test_app_center_production_smoke_covers_route_and_runtime_chunk_semantics(self) -> None:
        smoke_source = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "scripts"
            / "smoke-production-browser.mjs"
        ).read_text(encoding="utf-8")
        product_test_source = (
            ROOT / "scripts" / "run-claw-router-product.test.mjs"
        ).read_text(encoding="utf-8")
        service_source = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-app-center"
            / "src"
            / "services"
            / "appService.ts"
        ).read_text(encoding="utf-8")
        runtime_source = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-app-center"
            / "src"
            / "appRuntime.ts"
        ).read_text(encoding="utf-8")

        self.assertIn('pathName: "/apps"', smoke_source)
        self.assertIn('pathName: "/apps/app-1"', smoke_source)
        self.assertIn('pathName: "/apps/__browser-smoke-success"', smoke_source)
        self.assertIn('pathName: "/apps?__browser-smoke-empty=1"', smoke_source)
        self.assertIn('pathName: "/apps?__browser-smoke-filter=1"', smoke_source)
        self.assertIn('pathName: "/apps?__browser-smoke-categories=1"', smoke_source)
        self.assertIn('pathName: "/apps?__browser-smoke-retry=1"', smoke_source)
        self.assertIn("APP_SDK_FIXTURE_MODE", smoke_source)
        self.assertIn("APP_SDK_FAILURE_FIXTURE_MODE", smoke_source)
        self.assertIn("BROWSER_SMOKE_APP_RECORD", smoke_source)
        self.assertIn('artifact: mediaResource("https://apps.example.test/browser-smoke-app", "archive")', smoke_source)
        self.assertNotIn('downloadUrl: "https://apps.example.test/browser-smoke-app"', smoke_source)
        self.assertNotIn('artifactUrl: "https://apps.example.test/browser-smoke-app"', smoke_source)
        self.assertIn("/app/v3/api/platform/apps/store", smoke_source)
        self.assertIn("Browser Smoke App", smoke_source)
        self.assertIn("Browser smoke apps unavailable", smoke_source)
        self.assertIn("Browser smoke app details unavailable", smoke_source)
        self.assertIn("Browser smoke apps transient failure", smoke_source)
        self.assertIn("Apps could not be loaded", smoke_source)
        self.assertIn("App details could not be loaded", smoke_source)
        self.assertNotIn("server responded with a status of 502 (Bad Gateway)", smoke_source)

        self.assertIn("getClawRouterAppSdkClient().platform.apps.store.list", service_source)
        self.assertIn("getClawRouterAppSdkClient().platform.apps.store.retrieve", service_source)
        self.assertIn("normalizeAppApiRecord", runtime_source)
        self.assertIn("deriveAppCatalogViewModel", runtime_source)
        self.assertIn("deriveAppDetailView", runtime_source)
        self.assertIn("formatAppDateLabel", runtime_source)

        self.assertIn("portal production browser DOM smoke", product_test_source)
        self.assertIn("smoke-production-browser.mjs", product_test_source)
        self.assertIn(r"/apps\?__browser-smoke-retry", product_test_source)

    def test_app_center_auxiliary_scripts_do_not_depend_on_removed_seed_data(self) -> None:
        extractor_source = (
            ROOT / "apps" / "sdkwork-clawrouter-pc" / "app" / "applet" / "extract_data.mjs"
        ).read_text(encoding="utf-8")
        apply_translations_source = (
            ROOT / "apps" / "sdkwork-clawrouter-pc" / "app" / "applet" / "apply_translations.mjs"
        ).read_text(encoding="utf-8")

        self.assertNotIn("packages/sdkwork-clawrouter-pc-app-center/src/data/apps.ts", extractor_source)
        self.assertNotIn("apps.data.", extractor_source)
        self.assertNotIn("apps.data.", apply_translations_source)
        self.assertNotIn("require(", extractor_source)

    def test_app_center_runtime_fields_are_not_overridden_by_static_sample_translations(self) -> None:
        i18n_source = (
            ROOT / "apps" / "sdkwork-clawrouter-pc" / "packages" / "sdkwork-clawrouter-pc-i18n" / "src" / "index.ts"
        ).read_text(encoding="utf-8")

        self.assertNotIn("apps.data.", i18n_source)

    def test_app_details_uses_real_release_download_urls_without_fake_progress(self) -> None:
        app_details = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-app-center"
            / "src"
            / "pages"
            / "AppDetails.tsx"
        ).read_text(encoding="utf-8")
        app_runtime = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-app-center"
            / "src"
            / "appRuntime.ts"
        ).read_text(encoding="utf-8")
        app_service = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-app-center"
            / "src"
            / "services"
            / "appService.ts"
        ).read_text(encoding="utf-8")
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")
        app_sdk_plus_app_record = (
            ROOT
            / "sdks"
            / "clawrouter-app-sdk"
            / "clawrouter-app-sdk-typescript"
            / "src"
            / "types"
            / "plus-app-record.ts"
        ).read_text(encoding="utf-8")
        backend_sdk_plus_app_record = (
            ROOT
            / "sdks"
            / "clawrouter-backend-sdk"
            / "clawrouter-backend-sdk-typescript"
            / "src"
            / "types"
            / "plus-app-record.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("getClawRouterAppSdkClient().platform.apps.store.retrieve", app_service)
        self.assertIn("artifact?: ClawRouterMediaResource", app_runtime)
        self.assertIn("readMediaResource(item.artifact)", app_runtime)
        self.assertIn("readMediaResource(item.artifactResourceSnapshot)", app_runtime)
        self.assertIn("readMediaResourceUrl(release?.artifact)", app_runtime)
        self.assertNotIn("downloadUrl: readString(item, 'downloadUrl')", app_runtime)
        self.assertNotIn("downloadUrl: string", app_runtime)
        for sdk_record in [app_sdk_plus_app_record, backend_sdk_plus_app_record]:
            self.assertIn("import type { MediaResource }", sdk_record)
            self.assertIn("artifact?: MediaResource;", sdk_record)
            self.assertNotIn("download_url", sdk_record)
        for token in (
            "plus_app:",
            "- icon_media_resource_id",
            "- icon_object_blob_id",
            "- icon_resource_snapshot",
            "- resource_list",
            "- platforms",
            "- install_config",
            "- release_notes",
            "studio_catalog_artifact:",
            "- target_type",
            "- target_id",
            "- version",
            "- artifact_size_bytes",
            "- artifact_media_resource_id",
            "- artifact_object_blob_id",
            "- artifact_resource_snapshot",
            "- published_at",
        ):
            self.assertIn(token, contract)
        self.assertNotIn("- download_url", contract)

        self.assertIn("isReleaseDownloadable(", app_details)
        self.assertIn("getReleaseDownloadHref(", app_details)
        self.assertIn("href={downloadHref}", app_details)
        self.assertIn("target=\"_blank\"", app_details)
        self.assertIn("rel=\"noreferrer\"", app_details)
        self.assertIn("common.actions.downloadUnavailable", app_details)
        self.assertIn("setSelectedRelease(release)", app_details)

        for forbidden_fake_download in [
            "Simulate download progress",
            "isDownloading",
            "downloadProgress",
            "setInterval(",
            "setTimeout(",
            "Math.random()",
            "Loader2",
            "handleDownload(",
        ]:
            self.assertNotIn(forbidden_fake_download, app_details)

    def test_plus_app_registry_is_not_bound_to_legacy_java_media_url_contract(self) -> None:
        registry = (ROOT / "docs" / "schema-registry" / "tables" / "003-legacy.yaml").read_text(
            encoding="utf-8"
        )
        plus_app_section = registry[
            registry.index("- table: plus_app") : registry.index("- table: plus_category")
        ]
        self.assertIn("profile: router_owned_standard", plus_app_section)
        self.assertIn("write_owner: sdkwork-claw-product", plus_app_section)
        self.assertIn("compatibility_rule: canonical_media_resource_contract", plus_app_section)
        self.assertNotIn("java_contract:", plus_app_section)
        self.assertNotIn("keep_physical_structure_identical", plus_app_section)

        legacy_audit = json.loads(
            (ROOT / "generated" / "schema" / "legacy" / "java-legacy-contract-audit.json").read_text(
                encoding="utf-8"
            )
        )
        audited_tables = [item["table"] for item in legacy_audit.get("tables", [])]
        self.assertNotIn(
            "plus_app",
            audited_tables,
            "plus_app is router-owned now; Java legacy audit must not reintroduce icon_url/download_url.",
        )

    def test_official_sdks_do_not_reintroduce_legacy_plus_app_media_url_fields(self) -> None:
        sdk_root = ROOT / "sdks"
        text_suffixes = {
            ".cs",
            ".dart",
            ".go",
            ".java",
            ".json",
            ".kt",
            ".md",
            ".py",
            ".rs",
            ".swift",
            ".ts",
            ".yaml",
            ".yml",
        }
        sdk_families = [
            "clawrouter-app-sdk",
            "clawrouter-backend-sdk",
            "clawrouter-open-sdk",
        ]
        forbidden_tokens = ("download_url", "downloadUrl", "icon_url", "iconUrl")
        offenders: list[str] = []

        scan_roots: list[Path] = []
        for family in sdk_families:
            family_root = sdk_root / family
            scan_roots.append(family_root / f"{family}-typescript" / "src")
            scan_roots.extend(family_root.glob(f"{family}-*/generated/server-openapi"))

        for root in scan_roots:
            if not root.exists():
                continue
            for path in root.rglob("*"):
                if not path.is_file() or path.suffix not in text_suffixes:
                    continue
                source = path.read_text(encoding="utf-8", errors="ignore")
                if any(token in source for token in forbidden_tokens):
                    offenders.append(path.relative_to(ROOT).as_posix())

        self.assertEqual(
            [],
            offenders,
            "official generated SDK outputs must not expose legacy PlusApp media URL fields.",
        )


if __name__ == "__main__":
    unittest.main()
