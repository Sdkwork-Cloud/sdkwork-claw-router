import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class AppCenterRuntimeStandardTest(unittest.TestCase):
    def test_app_center_runtime_uses_generated_app_sdk_boundary(self) -> None:
        package = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-app-center"
        )
        runtime_path = package / "src" / "appRuntime.ts"
        service_path = package / "src" / "services" / "appService.ts"
        package_manifest_path = package / "package.json"
        list_path = package / "src" / "pages" / "AppCenter.tsx"
        detail_path = package / "src" / "pages" / "AppDetails.tsx"
        preview_path = package / "src" / "components" / "AppCenterPreview.tsx"
        runtime_test_path = ROOT / "apps" / "sdkwork-claw-router-portal" / "app-runtime.test.ts"
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

        self.assertIn("getClawRouterAppSdkClient().app.getApps", service_source)
        self.assertIn("getClawRouterAppSdkClient().app.getAppById", service_source)
        self.assertIn("getClawRouterAppSdkClient().app.getCategories", service_source)
        self.assertIn("normalizeAppApiRecord", service_source)
        self.assertIn("filterAppsForCatalog", service_source)
        self.assertIn(
            "@sdkwork/clawrouter-app-sdk",
            package_manifest.get("dependencies", {}),
            "App Center public store service must declare the generated app SDK it imports.",
        )
        self.assertIn(
            "@sdkwork/clawrouter-backend-sdk",
            package_manifest.get("dependencies", {}),
            "App Center admin service must declare the generated backend SDK it imports.",
        )

        for page_source in [list_source, detail_source, preview_source]:
            self.assertNotIn("from '../data/apps'", page_source)
            self.assertNotIn("apps.data.${", page_source)

        self.assertIn("deriveAppCatalogViewModel", list_source)
        self.assertIn("deriveAppDetailView", detail_source)
        self.assertIn("app runtime normalizes app SDK records", runtime_test_source)
        self.assertIn("portal app center runtime tests", verifier_source)
        self.assertIn("apps/sdkwork-claw-router-portal/app-runtime.test.ts", verifier_source)

    def test_app_center_uses_precise_app_sdk_response_contracts(self) -> None:
        contract = (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(
            encoding="utf-8"
        )
        openapi = (ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json").read_text(
            encoding="utf-8"
        )
        app_api = (ROOT / "sdks" / "clawrouter-app-sdk" / "src" / "api" / "app.ts").read_text(
            encoding="utf-8"
        )
        app_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-app-center"
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
            "GetAppsResult",
            "GetAppByIdResult",
            "AppGetCategoriesResult",
        ]:
            self.assertIn(f'"{result_name}"', openapi)

        self.assertIn('"$ref": "#/components/schemas/AppCatalogResponse"', openapi)
        self.assertIn('"$ref": "#/components/schemas/AppDetailResponse"', openapi)
        self.assertIn('"$ref": "#/components/schemas/AppCategoriesResponse"', openapi)

        self.assertIn("async getApps(pageNo?: number, pageSize?: number, keyword?: string, status?: 'ACTIVE' | 'INACTIVE', startTime?: string, endTime?: string): Promise<GetAppsResult>", app_api)
        self.assertIn("get<GetAppsResult>", app_api)
        self.assertIn("async getAppById(appId: string | number): Promise<GetAppByIdResult>", app_api)
        self.assertIn("get<GetAppByIdResult>", app_api)
        self.assertIn("async getCategories(): Promise<AppGetCategoriesResult>", app_api)
        self.assertIn("get<AppGetCategoriesResult>", app_api)
        self.assertIn("buildQueryString", app_api)
        self.assertIn("appendQueryString(appApiPath(`/app/store`), query)", app_api)
        self.assertNotIn("status?: string", app_api)
        self.assertNotIn("getApps(params?: QueryParams): Promise<PlusApiResult>", app_api)
        self.assertNotIn("getAppById(appId: string | number, params?: QueryParams): Promise<PlusApiResult>", app_api)
        self.assertNotIn("getCategories(params?: QueryParams): Promise<PlusApiResult>", app_api)

        result_checks = {
            "get-apps-result.ts": "data?: AppCatalogResponse;",
            "get-app-by-id-result.ts": "data?: AppDetailResponse;",
            "app-get-categories-result.ts": "data?: AppCategoriesResponse;",
        }
        for file_name, expected in result_checks.items():
            result_path = ROOT / "sdks" / "clawrouter-app-sdk" / "src" / "types" / file_name
            self.assertTrue(result_path.exists(), file_name)
            self.assertIn(expected, result_path.read_text(encoding="utf-8"))

        self.assertIn("AppCatalogResponse as SdkAppCatalogResponse", app_service)
        self.assertIn("AppDetailResponse as SdkAppDetailResponse", app_service)
        self.assertIn("AppCategoriesResponse as SdkAppCategoriesResponse", app_service)
        self.assertIn("const items: SdkAppCatalogResponse['items']", app_service)
        self.assertIn("const item: SdkAppDetailResponse", app_service)
        self.assertIn("const items: SdkAppCategoriesResponse['items']", app_service)
        self.assertIn("type AppCatalogStatus = 'ACTIVE' | 'INACTIVE';", app_service)
        self.assertIn("function optionalAppCatalogStatus", app_service)
        self.assertIn("appCatalogQueryArguments(filters)", app_service)
        self.assertNotIn("case 'ENABLED':", app_service)
        self.assertNotIn("case 'DISABLED':", app_service)
        self.assertNotIn("case '1':", app_service)
        self.assertNotIn("case '0':", app_service)
        self.assertNotIn("status.toUpperCase()", app_service)

    def test_admin_app_management_contract_and_backend_sdk_boundary_are_complete(self) -> None:
        contract = (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(
            encoding="utf-8"
        )
        openapi = (ROOT / "generated" / "openapi" / "clawrouter-backend-openapi.json").read_text(
            encoding="utf-8"
        )
        backend_app_api_path = ROOT / "sdks" / "clawrouter-backend-sdk" / "src" / "api" / "app.ts"
        admin_service_path = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-app-center"
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
        self.assertIn("api_path: /backend/v3/api/app/list", contract)
        self.assertIn("api_path: /backend/v3/api/app/{appId}", contract)
        self.assertIn("name: AdminAppListResponse", contract)
        self.assertIn("name: AdminAppItemResponse", contract)
        self.assertIn("name: AdminAppMutationResponse", contract)
        self.assertIn("name: AdminAppCreateRequest", contract)
        self.assertIn("name: AdminAppUpdateRequest", contract)
        self.assertIn("name: AdminAppConfigStandard", contract)
        self.assertIn("name: AdminAppConfig", contract)

        for operation_id in [
            "fetchApps",
            "createApp",
            "fetchApp",
            "updateApp",
            "deleteApp",
            "enableApp",
            "disableApp",
            "publishApp",
            "offlineApp",
        ]:
            self.assertIn(f'"operationId": "{operation_id}"', openapi)

        self.assertIn('"/backend/v3/api/app/list"', openapi)
        self.assertIn('"/backend/v3/api/app/{appId}"', openapi)
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
        self.assertTrue(backend_app_api_path.exists(), "backend SDK must generate an app API module.")
        backend_app_api = backend_app_api_path.read_text(encoding="utf-8")
        self.assertIn("async fetchApps(body?: AdminAppListRequest, xRequestId?: string): Promise<FetchAppsResult>", backend_app_api)
        self.assertIn("async createApp(body: AdminAppCreateRequest, xRequestId?: string): Promise<CreateAppResult>", backend_app_api)
        self.assertIn("async fetchApp(appId: string | number, xRequestId?: string): Promise<FetchAppResult>", backend_app_api)
        self.assertIn("async updateApp(appId: string | number, body: AdminAppUpdateRequest, xRequestId?: string): Promise<UpdateAppResult>", backend_app_api)
        self.assertIn("async deleteApp(appId: string | number, xRequestId?: string): Promise<DeleteAppResult>", backend_app_api)
        self.assertIn("async enableApp(appId: string | number, body?: OperationRequest, xRequestId?: string): Promise<EnableAppResult>", backend_app_api)
        self.assertIn("async disableApp(appId: string | number, body?: OperationRequest, xRequestId?: string): Promise<DisableAppResult>", backend_app_api)
        self.assertIn("async publishApp(appId: string | number, body?: OperationRequest, xRequestId?: string): Promise<PublishAppResult>", backend_app_api)
        self.assertIn("async offlineApp(appId: string | number, body?: OperationRequest, xRequestId?: string): Promise<OfflineAppResult>", backend_app_api)

        backend_create_request = (
            ROOT / "sdks" / "clawrouter-backend-sdk" / "src" / "types" / "admin-app-create-request.ts"
        ).read_text(encoding="utf-8")
        backend_update_request = (
            ROOT / "sdks" / "clawrouter-backend-sdk" / "src" / "types" / "admin-app-update-request.ts"
        ).read_text(encoding="utf-8")
        backend_config_type = (
            ROOT / "sdks" / "clawrouter-backend-sdk" / "src" / "types" / "admin-app-config.ts"
        )
        backend_config_standard_type = (
            ROOT / "sdks" / "clawrouter-backend-sdk" / "src" / "types" / "admin-app-config-standard.ts"
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
        self.assertIn("getClawRouterBackendSdkClient().app.fetchApps", admin_service)
        self.assertIn("getClawRouterBackendSdkClient().app.createApp", admin_service)
        self.assertIn("getClawRouterBackendSdkClient().app.fetchApp", admin_service)
        self.assertIn("getClawRouterBackendSdkClient().app.updateApp", admin_service)
        self.assertIn("getClawRouterBackendSdkClient().app.deleteApp", admin_service)
        self.assertIn("getClawRouterBackendSdkClient().app.enableApp", admin_service)
        self.assertIn("getClawRouterBackendSdkClient().app.disableApp", admin_service)
        self.assertIn("getClawRouterBackendSdkClient().app.publishApp", admin_service)
        self.assertIn("getClawRouterBackendSdkClient().app.offlineApp", admin_service)
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
            "Authenticated positive-organization app sessions may read same-tenant public organization_id = 0 app projections; tenant isolation is always enforced.",
            "Path parameter appId accepts either the stable appKey or numeric plus_app.id and applies the same ACTIVE/PUBLISHED and public organization_id = 0 visibility rules as getApps.",
        ]

        for expected in expected_contract_phrases:
            self.assertIn(expected, contract)
            self.assertIn(expected, openapi)

    def test_admin_app_management_page_exposes_complete_plus_app_payload_fields(self) -> None:
        app_admin_source = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-app-center"
            / "src"
            / "pages"
            / "AppAdmin.tsx"
        ).read_text(encoding="utf-8")
        admin_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-app-center"
            / "src"
            / "services"
            / "adminAppService.ts"
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

        for label in [
            'label="App Key"',
            'label="Icon"',
            'label="Resource List"',
            'label="Config"',
            'label="Platforms"',
            'label="Install Platforms"',
            'label="Install Skill"',
            'label="Install Config"',
            'label="Release Notes"',
        ]:
            self.assertIn(label, app_admin_source)

    def test_admin_app_management_page_uses_backend_query_filters(self) -> None:
        app_admin_source = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-app-center"
            / "src"
            / "pages"
            / "AppAdmin.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("AdminAppService.fetchApps(adminAppQuery)", app_admin_source)
        self.assertIn("const adminAppQuery = useMemo", app_admin_source)
        self.assertIn("keyword: normalizedKeyword", app_admin_source)
        self.assertIn("status: status || undefined", app_admin_source)
        self.assertIn("marketStatus: marketStatus || undefined", app_admin_source)
        self.assertIn("pageNo: 1", app_admin_source)
        self.assertIn("pageSize: 100", app_admin_source)
        self.assertIn("useEffect(() =>", app_admin_source)
        self.assertIn("void loadApps();", app_admin_source)
        self.assertIn("}, [loadApps]);", app_admin_source)

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
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-app-center"
            / "src"
            / "pages"
            / "AppAdmin.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("defaultValue={isEdit ? app?.version ?? '' : app?.version ?? '1.0.0'}", app_admin_source)
        self.assertIn("defaultValue={isEdit ? app?.appType ?? '' : app?.appType ?? 'web'}", app_admin_source)
        self.assertNotIn("defaultValue={app?.version ?? '1.0.0'}", app_admin_source)
        self.assertNotIn("defaultValue={app?.appType ?? 'web'}", app_admin_source)

    def test_admin_app_management_has_stable_route_navigation_and_package_export(self) -> None:
        portal = ROOT / "apps" / "sdkwork-claw-router-portal"
        app_source = (portal / "src" / "App.tsx").read_text(encoding="utf-8")
        admin_layout_source = (portal / "src" / "AdminLayout.tsx").read_text(encoding="utf-8")
        app_center_index = (
            portal
            / "packages"
            / "sdkwork-claw-router-app-center"
            / "src"
            / "index.ts"
        ).read_text(encoding="utf-8")

        self.assertIn(
            "const AppAdmin = lazyRoute(() => import('sdkwork-claw-router-app-center'), 'AppAdmin');",
            app_source,
        )
        self.assertIn('<Route path="app" element={<AppAdmin />} />', app_source)
        self.assertIn("{ path: '/admin/app'", admin_layout_source)
        self.assertIn("label: 'App Store'", admin_layout_source)
        self.assertIn("Package className=\"w-4 h-4\"", admin_layout_source)
        self.assertIn("export * from './pages/AppAdmin';", app_center_index)

    def test_app_center_sdk_routes_have_retryable_error_states(self) -> None:
        package = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-app-center"
        )
        list_source = (package / "src" / "pages" / "AppCenter.tsx").read_text(encoding="utf-8")
        detail_source = (package / "src" / "pages" / "AppDetails.tsx").read_text(encoding="utf-8")
        preview_source = (package / "src" / "components" / "AppCenterPreview.tsx").read_text(encoding="utf-8")
        commons_runtime_test = (
            ROOT / "apps" / "sdkwork-claw-router-portal" / "commons-runtime.test.ts"
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
                self.assertIn("Failed to load", source)
                self.assertNotIn("console.error", source)

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
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-app-center"
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

        expected_source = "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-app-center/src/appRuntime.ts"
        service_source = "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-app-center/src/services/appService.ts"
        old_source = "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-app-center/src/data/apps.ts"

        self.assertIn("route: /apps", contracts)
        self.assertIn(f"source: {expected_source}", contracts)
        self.assertIn(f"source: {service_source}", contracts)
        self.assertNotIn(f"source: {old_source}", contracts)
        self.assertIn('"source": "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-app-center/src/appRuntime.ts"', field_audit)
        self.assertNotIn('"source": "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-app-center/src/data/apps.ts"', field_audit)
        self.assertIn("/app/v3/api/app/store", operation_audit)
        self.assertIn("/app/v3/api/app/store/{appId}", operation_audit)
        self.assertIn("delivery_kind: sdk_backed_business_runtime", route_classification)
        self.assertIn("/apps/:id", route_classification)

    def test_app_center_production_smoke_covers_route_and_runtime_chunk_semantics(self) -> None:
        smoke_source = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "scripts"
            / "smoke-production-browser.mjs"
        ).read_text(encoding="utf-8")
        product_test_source = (
            ROOT / "scripts" / "run-claw-router-product.test.mjs"
        ).read_text(encoding="utf-8")
        service_source = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-app-center"
            / "src"
            / "services"
            / "appService.ts"
        ).read_text(encoding="utf-8")
        runtime_source = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-app-center"
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
        self.assertIn("/app/v3/api/app/store", smoke_source)
        self.assertIn("Browser Smoke App", smoke_source)
        self.assertIn("Browser smoke apps unavailable", smoke_source)
        self.assertIn("Browser smoke app details unavailable", smoke_source)
        self.assertIn("Browser smoke apps transient failure", smoke_source)
        self.assertIn("Apps could not be loaded", smoke_source)
        self.assertIn("App details could not be loaded", smoke_source)
        self.assertNotIn("server responded with a status of 502 (Bad Gateway)", smoke_source)

        self.assertIn("getClawRouterAppSdkClient().app.getApps", service_source)
        self.assertIn("getClawRouterAppSdkClient().app.getAppById", service_source)
        self.assertIn("normalizeAppApiRecord", runtime_source)
        self.assertIn("deriveAppCatalogViewModel", runtime_source)
        self.assertIn("deriveAppDetailView", runtime_source)
        self.assertIn("formatAppDateLabel", runtime_source)

        self.assertIn("portal production browser DOM smoke", product_test_source)
        self.assertIn("smoke-production-browser.mjs", product_test_source)
        self.assertIn(r"/apps\?__browser-smoke-retry", product_test_source)

    def test_app_center_auxiliary_scripts_do_not_depend_on_removed_seed_data(self) -> None:
        extractor_source = (
            ROOT / "apps" / "sdkwork-claw-router-portal" / "app" / "applet" / "extract_data.mjs"
        ).read_text(encoding="utf-8")
        apply_translations_source = (
            ROOT / "apps" / "sdkwork-claw-router-portal" / "app" / "applet" / "apply_translations.mjs"
        ).read_text(encoding="utf-8")

        self.assertNotIn("packages/sdkwork-claw-router-app-center/src/data/apps.ts", extractor_source)
        self.assertNotIn("apps.data.", extractor_source)
        self.assertNotIn("apps.data.", apply_translations_source)
        self.assertNotIn("require(", extractor_source)

    def test_app_center_runtime_fields_are_not_overridden_by_static_sample_translations(self) -> None:
        i18n_source = (
            ROOT / "apps" / "sdkwork-claw-router-portal" / "packages" / "sdkwork-claw-router-i18n" / "src" / "index.ts"
        ).read_text(encoding="utf-8")

        self.assertNotIn("apps.data.", i18n_source)

    def test_app_details_uses_real_release_download_urls_without_fake_progress(self) -> None:
        app_details = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-app-center"
            / "src"
            / "pages"
            / "AppDetails.tsx"
        ).read_text(encoding="utf-8")
        app_runtime = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-app-center"
            / "src"
            / "appRuntime.ts"
        ).read_text(encoding="utf-8")
        app_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-app-center"
            / "src"
            / "services"
            / "appService.ts"
        ).read_text(encoding="utf-8")
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")

        self.assertIn("getClawRouterAppSdkClient().app.getAppById", app_service)
        self.assertIn("downloadUrl: readString(item, 'downloadUrl')", app_runtime)
        self.assertIn("plus_app: [name, description, icon_url, resource_list, platforms, install_config, release_notes, download_url]", contract)
        self.assertIn("studio_catalog_artifact: [target_type, target_id, version, artifact_size_bytes, artifact_url, published_at]", contract)

        self.assertIn("isReleaseDownloadable(", app_details)
        self.assertIn("getReleaseDownloadUrl(", app_details)
        self.assertIn("href={downloadUrl}", app_details)
        self.assertIn("target=\"_blank\"", app_details)
        self.assertIn("rel=\"noreferrer\"", app_details)
        self.assertIn("Download unavailable", app_details)
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


if __name__ == "__main__":
    unittest.main()
