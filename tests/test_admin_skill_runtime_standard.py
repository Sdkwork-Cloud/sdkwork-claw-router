import json
import unittest
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]
CONTRACT_PATH = ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
BACKEND_OPENAPI_PATH = ROOT / "generated" / "openapi" / "clawrouter-backend-openapi.json"
BACKEND_SKILL_API_PATH = ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "api" / "ecosystem.ts"
BACKEND_SDK_PATH = ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "sdk.ts"
PORTAL_PACKAGE_ROOT = (
    ROOT
    / "apps"
    / "sdkwork-clawrouter-pc"
    / "packages"
    / "sdkwork-clawrouter-pc-admin-skill"
)


class AdminSkillRuntimeStandardTest(unittest.TestCase):
    def test_backend_skill_management_contract_is_complete(self) -> None:
        contract = yaml.safe_load(CONTRACT_PATH.read_text(encoding="utf-8"))
        schema_defs = contract["x_response_entities"]
        operations = {
            operation["operation"]: operation
            for operation in contract.get("frontend_operations", [])
            if operation.get("route") == "/admin/skill"
        }

        expected = {
            "fetchSkillCategories": ("GET", "/backend/v3/api/ecosystem/skills/categories"),
            "createSkillCategory": ("POST", "/backend/v3/api/ecosystem/skills/categories"),
            "fetchSkillPackages": ("GET", "/backend/v3/api/ecosystem/skills/package"),
            "getSkillPackage": ("GET", "/backend/v3/api/ecosystem/skills/package/{packageId}"),
            "createSkillPackage": ("POST", "/backend/v3/api/ecosystem/skills/package"),
            "updateSkillPackage": ("PUT", "/backend/v3/api/ecosystem/skills/package/{packageId}"),
            "deleteSkillPackage": ("DELETE", "/backend/v3/api/ecosystem/skills/package/{packageId}"),
            "enableSkillPackage": ("POST", "/backend/v3/api/ecosystem/skills/package/{packageId}/enable"),
            "disableSkillPackage": ("POST", "/backend/v3/api/ecosystem/skills/package/{packageId}/disable"),
            "fetchSkills": ("GET", "/backend/v3/api/ecosystem/skills"),
            "getSkill": ("GET", "/backend/v3/api/ecosystem/skills/{skillId}"),
            "createSkill": ("POST", "/backend/v3/api/ecosystem/skills"),
            "updateSkill": ("PUT", "/backend/v3/api/ecosystem/skills/{skillId}"),
            "deleteSkill": ("DELETE", "/backend/v3/api/ecosystem/skills/{skillId}"),
            "enableSkill": ("POST", "/backend/v3/api/ecosystem/skills/{skillId}/enable"),
            "disableSkill": ("POST", "/backend/v3/api/ecosystem/skills/{skillId}/disable"),
            "publishSkill": ("POST", "/backend/v3/api/ecosystem/skills/{skillId}/publish"),
            "offlineSkill": ("POST", "/backend/v3/api/ecosystem/skills/{skillId}/unpublish"),
            "approveSkill": ("POST", "/backend/v3/api/ecosystem/skills/{skillId}/review/approve"),
            "rejectSkill": ("POST", "/backend/v3/api/ecosystem/skills/{skillId}/review/reject"),
            "fetchSkillAssets": ("GET", "/backend/v3/api/ecosystem/skills/{skillId}/assets"),
            "getSkillAsset": ("GET", "/backend/v3/api/ecosystem/skills/{skillId}/assets/{assetId}"),
            "createSkillAsset": ("POST", "/backend/v3/api/ecosystem/skills/{skillId}/assets"),
            "updateSkillAsset": ("PUT", "/backend/v3/api/ecosystem/skills/{skillId}/assets/{assetId}"),
            "deleteSkillAsset": ("DELETE", "/backend/v3/api/ecosystem/skills/{skillId}/assets/{assetId}"),
            "fetchSkillArtifacts": ("GET", "/backend/v3/api/ecosystem/skills/{skillId}/artifacts"),
            "getSkillArtifact": ("GET", "/backend/v3/api/ecosystem/skills/{skillId}/artifacts/{artifactId}"),
            "createSkillArtifact": ("POST", "/backend/v3/api/ecosystem/skills/{skillId}/artifacts"),
            "updateSkillArtifact": ("PUT", "/backend/v3/api/ecosystem/skills/{skillId}/artifacts/{artifactId}"),
            "deleteSkillArtifact": ("DELETE", "/backend/v3/api/ecosystem/skills/{skillId}/artifacts/{artifactId}"),
        }

        self.assertEqual(set(expected), set(operations))
        for operation_name, (method, path) in expected.items():
            with self.subTest(operation=operation_name):
                operation = operations[operation_name]
                self.assertEqual("backend", operation["api_surface"])
                self.assertEqual(method, operation["api_method"])
                self.assertEqual(path, operation["api_path"])
                if operation_name in {"fetchSkillCategories", "createSkillCategory"}:
                    self.assertIn("c_category", operation["read_sources"])
                elif "SkillPackage" in operation_name:
                    self.assertIn("ai_agent_skill_package", operation["read_sources"])
                else:
                    self.assertIn("ai_agent_skill", operation["read_sources"])
                if method in {"POST", "PUT", "DELETE"} and operation_name not in {"fetchSkills", "fetchSkillPackages"}:
                    self.assertIn("ops_audit_log", operation.get("write_tables", []))

        self.assertEqual("AdminSkillCategoryListResponse", operations["fetchSkillCategories"]["response_schema"]["name"])
        self.assertEqual("AdminSkillCategoryCreateRequest", operations["createSkillCategory"]["request_schema"]["name"])
        self.assertNotIn("request_schema", operations["fetchSkillPackages"])
        self.assertEqual(
            ["q", "enabled", "category_id", "page", "page_size"],
            [parameter["name"] for parameter in operations["fetchSkillPackages"]["query_parameters"]],
        )
        self.assertEqual("AdminSkillPackageListResponse", operations["fetchSkillPackages"]["response_schema"]["name"])
        self.assertEqual("AdminSkillPackageCreateRequest", operations["createSkillPackage"]["request_schema"]["name"])
        self.assertEqual("AdminSkillPackageUpdateRequest", operations["updateSkillPackage"]["request_schema"]["name"])
        self.assertEqual("AdminSkillPackageDeleteResponse", operations["deleteSkillPackage"]["response_schema"]["name"])
        self.assertNotIn("request_schema", operations["fetchSkills"])
        self.assertEqual(
            ["q", "market_status", "review_status", "visibility", "enabled", "category_id", "page", "page_size"],
            [parameter["name"] for parameter in operations["fetchSkills"]["query_parameters"]],
        )
        self.assertEqual("AdminSkillListResponse", operations["fetchSkills"]["response_schema"]["name"])
        self.assertEqual("AdminSkillCreateRequest", operations["createSkill"]["request_schema"]["name"])
        self.assertEqual("AdminSkillUpdateRequest", operations["updateSkill"]["request_schema"]["name"])
        self.assertEqual("AdminSkillReviewRequest", operations["approveSkill"]["request_schema"]["name"])
        self.assertEqual("AdminSkillReviewRequest", operations["rejectSkill"]["request_schema"]["name"])
        self.assertEqual("AdminSkillDeleteResponse", operations["deleteSkill"]["response_schema"]["name"])
        self.assertEqual("AdminSkillAssetListResponse", operations["fetchSkillAssets"]["response_schema"]["name"])
        self.assertEqual("AdminSkillAssetMutationResponse", operations["getSkillAsset"]["response_schema"]["name"])
        self.assertEqual("AdminSkillAssetCreateRequest", operations["createSkillAsset"]["request_schema"]["name"])
        self.assertEqual("AdminSkillAssetUpdateRequest", operations["updateSkillAsset"]["request_schema"]["name"])
        self.assertEqual("AdminSkillAssetDeleteResponse", operations["deleteSkillAsset"]["response_schema"]["name"])
        self.assertEqual("AdminSkillArtifactListResponse", operations["fetchSkillArtifacts"]["response_schema"]["name"])
        self.assertEqual("AdminSkillArtifactMutationResponse", operations["getSkillArtifact"]["response_schema"]["name"])
        self.assertEqual("AdminSkillArtifactCreateRequest", operations["createSkillArtifact"]["request_schema"]["name"])
        self.assertEqual("AdminSkillArtifactUpdateRequest", operations["updateSkillArtifact"]["request_schema"]["name"])
        self.assertEqual("AdminSkillArtifactDeleteResponse", operations["deleteSkillArtifact"]["response_schema"]["name"])
        schemas = {
            "AdminSkillItem": schema_defs["admin_skill_item"],
            "AdminSkillCreateRequest": operations["createSkill"]["request_schema"],
            "AdminSkillUpdateRequest": operations["updateSkill"]["request_schema"],
        }
        package_schemas = {
            "AdminSkillPackageItem": schema_defs["admin_skill_package_item"],
            "AdminSkillPackageCreateRequest": operations["createSkillPackage"]["request_schema"],
            "AdminSkillPackageUpdateRequest": operations["updateSkillPackage"]["request_schema"],
        }
        for schema_name, schema in package_schemas.items():
            with self.subTest(schema=schema_name):
                self.assertIn("packageKey", schema["properties"])
                self.assertEqual("^[A-Za-z0-9_-]+$", schema["properties"]["packageKey"]["pattern"])
                self.assertIn("categoryId", schema["properties"])
                self.assertIn("tags", schema["properties"])
        for schema_name, schema in schemas.items():
            source_type = schema["properties"]["sourceType"]
            self.assertEqual(["OFFICIAL", "COMMUNITY", "ENTERPRISE", "PRIVATE", "CUSTOM"], source_type["enum"])
            visibility = schema["properties"]["visibility"]
            self.assertEqual(["PUBLIC", "PRIVATE", "UNLISTED"], visibility["enum"])
            if schema_name != "AdminSkillUpdateRequest":
                self.assertEqual(
                    ["DRAFT", "PUBLISHED", "OFFLINE", "DEPRECATED"],
                    schema["properties"]["marketStatus"]["enum"],
                )
        asset_item = schema_defs["admin_skill_asset_item"]
        artifact_item = schema_defs["admin_skill_artifact_item"]
        self.assertEqual([35], asset_item["properties"]["targetType"]["enum"])
        self.assertEqual([35], artifact_item["properties"]["targetType"]["enum"])
        self.assertEqual("sha256:[a-f0-9]{64}$", artifact_item["properties"]["checksumHash"]["pattern"].lstrip("^"))
        self.assertIn("frameworks", artifact_item["properties"])
        for operation_name in [
            "createSkillAsset",
            "updateSkillAsset",
            "deleteSkillAsset",
            "createSkillArtifact",
            "updateSkillArtifact",
            "deleteSkillArtifact",
        ]:
            self.assertFalse(operations[operation_name]["request_id_header"])

    def test_backend_skill_openapi_and_sdk_expose_generated_skill_client(self) -> None:
        openapi = json.loads(BACKEND_OPENAPI_PATH.read_text(encoding="utf-8"))

        for path, method, operation_id in [
            ("/backend/v3/api/ecosystem/skills/categories", "get", "skills.categories.list"),
            ("/backend/v3/api/ecosystem/skills/categories", "post", "skills.categories.create"),
            ("/backend/v3/api/ecosystem/skills/package", "get", "skills.package.list"),
            ("/backend/v3/api/ecosystem/skills/package/{packageId}", "get", "skills.package.retrieve"),
            ("/backend/v3/api/ecosystem/skills/package", "post", "skills.package.create"),
            ("/backend/v3/api/ecosystem/skills/package/{packageId}", "put", "skills.package.update"),
            ("/backend/v3/api/ecosystem/skills/package/{packageId}", "delete", "skills.package.delete"),
            ("/backend/v3/api/ecosystem/skills/package/{packageId}/enable", "post", "skills.package.enable"),
            ("/backend/v3/api/ecosystem/skills/package/{packageId}/disable", "post", "skills.package.disable"),
            ("/backend/v3/api/ecosystem/skills", "get", "skills.list"),
            ("/backend/v3/api/ecosystem/skills/{skillId}", "get", "skills.retrieve"),
            ("/backend/v3/api/ecosystem/skills", "post", "skills.create"),
            ("/backend/v3/api/ecosystem/skills/{skillId}", "put", "skills.update"),
            ("/backend/v3/api/ecosystem/skills/{skillId}", "delete", "skills.delete"),
            ("/backend/v3/api/ecosystem/skills/{skillId}/enable", "post", "skills.enable"),
            ("/backend/v3/api/ecosystem/skills/{skillId}/disable", "post", "skills.disable"),
            ("/backend/v3/api/ecosystem/skills/{skillId}/publish", "post", "skills.publish"),
            ("/backend/v3/api/ecosystem/skills/{skillId}/unpublish", "post", "skills.unpublish"),
            ("/backend/v3/api/ecosystem/skills/{skillId}/review/approve", "post", "skills.review.approve"),
            ("/backend/v3/api/ecosystem/skills/{skillId}/review/reject", "post", "skills.review.reject"),
            ("/backend/v3/api/ecosystem/skills/{skillId}/assets", "get", "skills.assets.list"),
            ("/backend/v3/api/ecosystem/skills/{skillId}/assets/{assetId}", "get", "skills.assets.retrieve"),
            ("/backend/v3/api/ecosystem/skills/{skillId}/assets", "post", "skills.assets.create"),
            ("/backend/v3/api/ecosystem/skills/{skillId}/assets/{assetId}", "put", "skills.assets.update"),
            ("/backend/v3/api/ecosystem/skills/{skillId}/assets/{assetId}", "delete", "skills.assets.delete"),
            ("/backend/v3/api/ecosystem/skills/{skillId}/artifacts", "get", "skills.artifacts.list"),
            ("/backend/v3/api/ecosystem/skills/{skillId}/artifacts/{artifactId}", "get", "skills.artifacts.retrieve"),
            ("/backend/v3/api/ecosystem/skills/{skillId}/artifacts", "post", "skills.artifacts.create"),
            ("/backend/v3/api/ecosystem/skills/{skillId}/artifacts/{artifactId}", "put", "skills.artifacts.update"),
            ("/backend/v3/api/ecosystem/skills/{skillId}/artifacts/{artifactId}", "delete", "skills.artifacts.delete"),
        ]:
            with self.subTest(path=path, method=method):
                operation = openapi["paths"][path][method]
                self.assertEqual(operation_id, operation["operationId"])
                self.assertEqual(["ecosystem"], operation["tags"])

        for schema_name in [
            "AdminSkillItem",
            "AdminSkillCategoryItem",
            "AdminSkillPackageItem",
            "AdminSkillPackageCreateRequest",
            "AdminSkillPackageUpdateRequest",
            "AdminSkillPackageMutationResponse",
            "AdminSkillPackageDeleteResponse",
            "AdminSkillCreateRequest",
            "AdminSkillUpdateRequest",
            "AdminSkillReviewRequest",
            "AdminSkillMutationResponse",
            "AdminSkillDeleteResponse",
            "AdminSkillAssetItem",
            "AdminSkillAssetListResponse",
            "AdminSkillAssetCreateRequest",
            "AdminSkillAssetUpdateRequest",
            "AdminSkillAssetMutationResponse",
            "AdminSkillAssetDeleteResponse",
            "AdminSkillArtifactItem",
            "AdminSkillArtifactListResponse",
            "AdminSkillArtifactCreateRequest",
            "AdminSkillArtifactUpdateRequest",
            "AdminSkillArtifactMutationResponse",
            "AdminSkillArtifactDeleteResponse",
        ]:
            self.assertIn(schema_name, openapi["components"]["schemas"])

        skill_api = BACKEND_SKILL_API_PATH.read_text(encoding="utf-8")
        sdk = BACKEND_SDK_PATH.read_text(encoding="utf-8")
        item_type = (ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "types" / "admin-skill-item.ts").read_text(
            encoding="utf-8"
        )
        create_type = (
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "types" / "admin-skill-create-request.ts"
        ).read_text(encoding="utf-8")
        package_type = (
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "types" / "admin-skill-package-item.ts"
        ).read_text(encoding="utf-8")
        asset_type = (
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "types" / "admin-skill-asset-item.ts"
        ).read_text(encoding="utf-8")
        artifact_type = (
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "types" / "admin-skill-artifact-item.ts"
        ).read_text(encoding="utf-8")

        for method in [
            "list()",
            "create(body: AdminSkillCategoryCreateRequest",
            "list(params?: EcosystemSkillsPackageListParams",
            "retrieve(packageId: string)",
            "create(body: AdminSkillPackageCreateRequest",
            "update(packageId: string, body: AdminSkillPackageUpdateRequest",
            "delete(packageId: string)",
            "enable(packageId: string, params?: EcosystemSkillsPackageEnableParams)",
            "disable(packageId: string, params?: EcosystemSkillsPackageDisableParams)",
            "list(params?: EcosystemSkillsListParams",
            "retrieve(skillId: string)",
            "create(body: AdminSkillCreateRequest",
            "update(skillId: string, body: AdminSkillUpdateRequest",
            "delete(skillId: string)",
            "enable(skillId: string, params?: EcosystemSkillsEnableParams)",
            "disable(skillId: string, params?: EcosystemSkillsDisableParams)",
            "publish(skillId: string, params?: EcosystemSkillsPublishParams)",
            "unpublish(skillId: string, params?: EcosystemSkillsUnpublishParams)",
            "approve(skillId: string, body: AdminSkillReviewRequest",
            "reject(skillId: string, body: AdminSkillReviewRequest",
            "list(skillId: string)",
            "retrieve(skillId: string, assetId: string)",
            "create(skillId: string, body: AdminSkillAssetCreateRequest",
            "update(skillId: string, assetId: string, body: AdminSkillAssetUpdateRequest",
            "delete(skillId: string, assetId: string",
            "retrieve(skillId: string, artifactId: string)",
            "create(skillId: string, body: AdminSkillArtifactCreateRequest",
            "update(skillId: string, artifactId: string, body: AdminSkillArtifactUpdateRequest",
            "delete(skillId: string, artifactId: string",
        ]:
            self.assertIn(f"async {method}", skill_api)

        for resource in [
            "public readonly categories: EcosystemSkillsCategoriesApi;",
            "public readonly package: EcosystemSkillsPackageApi;",
            "public readonly assets: EcosystemSkillsAssetsApi;",
            "public readonly artifacts: EcosystemSkillsArtifactsApi;",
            "public readonly review: EcosystemSkillsReviewApi;",
        ]:
            self.assertIn(resource, skill_api)

        for legacy_method in [
            "async fetchSkillAssets(",
            "async getSkillAsset(",
            "async updateSkillAsset(",
            "async deleteSkillAsset(",
            "async fetchSkillArtifacts(",
            "async getSkillArtifact(",
            "async updateSkillArtifact(",
            "async deleteSkillArtifact(",
        ]:
            self.assertNotIn(legacy_method, skill_api)

        self.assertIn("public readonly ecosystem: EcosystemApi;", sdk)
        self.assertIn("this.ecosystem = createEcosystemApi(this.httpClient);", sdk)
        self.assertIn("AdminSkillCreateRequest", skill_api)
        self.assertIn("AdminSkillUpdateRequest", skill_api)
        self.assertIn("AdminSkillPackageCreateRequest", skill_api)
        self.assertIn("AdminSkillPackageUpdateRequest", skill_api)
        self.assertIn("AdminSkillReviewRequest", skill_api)
        self.assertIn("packageKey: string;", package_type)
        self.assertIn("enabled: boolean;", package_type)
        self.assertIn("sourceType: 'OFFICIAL' | 'COMMUNITY' | 'ENTERPRISE' | 'PRIVATE' | 'CUSTOM';", item_type)
        self.assertIn("marketStatus: 'DRAFT' | 'PUBLISHED' | 'OFFLINE' | 'DEPRECATED';", item_type)
        self.assertIn("visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';", item_type)
        self.assertIn("sourceType?: 'OFFICIAL' | 'COMMUNITY' | 'ENTERPRISE' | 'PRIVATE' | 'CUSTOM';", create_type)
        self.assertIn("targetType: 35;", asset_type)
        self.assertIn("skillId: string;", asset_type)
        self.assertIn("checksumHash?: string | null;", artifact_type)
        self.assertIn("frameworks: string[];", artifact_type)

    def test_portal_admin_skill_package_uses_backend_sdk_boundary(self) -> None:
        service_path = PORTAL_PACKAGE_ROOT / "src" / "skillService.ts"
        page_path = PORTAL_PACKAGE_ROOT / "src" / "index.tsx"
        package_path = PORTAL_PACKAGE_ROOT / "package.json"
        app_path = ROOT / "apps" / "sdkwork-clawrouter-pc" / "src" / "App.tsx"
        admin_layout_path = ROOT / "apps" / "sdkwork-clawrouter-pc" / "src" / "AdminLayout.tsx"
        runtime_test_path = ROOT / "apps" / "sdkwork-clawrouter-pc" / "admin-skill-runtime.test.ts"
        browser_smoke_path = ROOT / "apps" / "sdkwork-clawrouter-pc" / "scripts" / "smoke-production-browser.mjs"

        for path in [service_path, page_path, package_path, runtime_test_path, browser_smoke_path]:
            self.assertTrue(path.exists(), str(path))

        service = service_path.read_text(encoding="utf-8")
        page = page_path.read_text(encoding="utf-8")
        app = app_path.read_text(encoding="utf-8")
        admin_layout = admin_layout_path.read_text(encoding="utf-8")
        runtime_test = runtime_test_path.read_text(encoding="utf-8")
        browser_smoke = browser_smoke_path.read_text(encoding="utf-8")

        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.list", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.categories.list", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.categories.create", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.package.list", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.package.retrieve", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.package.create", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.package.update", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.package.delete", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.package.enable", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.package.disable", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.create", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.retrieve", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.update", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.delete", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.review.approve", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.review.reject", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.publish", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.unpublish", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.enable", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.disable", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.assets.list", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.assets.retrieve", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.assets.create", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.assets.update", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.assets.delete", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.artifacts.list", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.artifacts.retrieve", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.artifacts.create", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.artifacts.update", service)
        self.assertIn("getClawRouterBackendSdkClient().ecosystem.skills.artifacts.delete", service)
        self.assertIn("sourceType: \"COMMUNITY\"", runtime_test)
        self.assertIn("sourceType: \"OFFICIAL\"", runtime_test)
        self.assertIn("value=\"COMMUNITY\"", page)
        self.assertIn('<option value="UNLISTED">Unlisted</option>', page)
        self.assertIn("normalized === 'OFFICIAL'", service)
        self.assertIn("normalized === 'DEPRECATED'", service)
        self.assertIn("normalized === 'UNLISTED'", service)
        self.assertNotIn("fetch(", service)
        self.assertNotIn("axios", service)
        self.assertNotIn("/backend/v3/api", service)

        self.assertIn("export function SkillAdmin", page)
        self.assertIn("Skill Packages", page)
        self.assertIn("PackageModal", page)
        self.assertIn("name=\"packageId\"", page)
        self.assertIn("BusinessStateTableRow", page)
        self.assertIn("ConfirmDialog", page)
        self.assertIn("sdkwork-clawrouter-pc-admin-skill", app)
        self.assertIn('path="skill"', app)
        self.assertIn("/admin/skill", admin_layout)
        self.assertIn("admin skill service calls generated backend SDK paths", runtime_test)
        self.assertIn("/backend/v3/api/ecosystem/skills/package?q=agent&enabled=true", runtime_test)
        self.assertIn("/backend/v3/api/ecosystem/skills/8101/assets", runtime_test)
        self.assertIn("/backend/v3/api/ecosystem/skills/8101/artifacts", runtime_test)
        self.assertIn("createSkillPackageInputFromForm", runtime_test)
        self.assertIn("BROWSER_SMOKE_ADMIN_SKILL_PACKAGE", browser_smoke)
        self.assertIn("GET /backend/v3/api/ecosystem/skills/package", browser_smoke)

    def test_agent_skill_source_enums_are_java_standard_across_runtime_surfaces(self) -> None:
        skill_surface_paths = [
            ROOT / "data" / "skills" / "skills.json",
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "admin_skill.rs",
            ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "skills_seed.rs",
            ROOT / "services" / "sdkwork-claw-product" / "tests" / "database_installer.rs",
            ROOT / "services" / "sdkwork-claw-product" / "tests" / "admin_skill_api.rs",
            ROOT / "services" / "sdkwork-claw-product" / "tests" / "sqlite_admin_skill_store.rs",
            ROOT / "services" / "sdkwork-claw-product" / "tests" / "sqlite_app_skills_read_store.rs",
            PORTAL_PACKAGE_ROOT / "src" / "skillService.ts",
            PORTAL_PACKAGE_ROOT / "src" / "index.tsx",
            ROOT / "apps" / "sdkwork-clawrouter-pc" / "admin-skill-runtime.test.ts",
            ROOT / "apps" / "sdkwork-clawrouter-pc" / "scripts" / "smoke-production-browser.mjs",
        ]

        for path in skill_surface_paths:
            with self.subTest(path=str(path.relative_to(ROOT))):
                self.assertTrue(path.exists(), str(path))
                source = path.read_text(encoding="utf-8")
                self.assertNotIn('"sourceType": "MARKET"', source)
                self.assertNotIn('"sourceType": "BUILTIN"', source)
                self.assertNotIn("sourceType: 'MARKET'", source)
                self.assertNotIn('sourceType: "MARKET"', source)
                self.assertNotIn("sourceType: 'BUILTIN'", source)
                self.assertNotIn('sourceType: "BUILTIN"', source)

        seed_skills = json.loads((ROOT / "data" / "skills" / "skills.json").read_text(encoding="utf-8"))
        seed_categories = json.loads((ROOT / "data" / "skills" / "categories.json").read_text(encoding="utf-8"))
        category_by_id = {category["id"]: category for category in seed_categories}
        self.assertEqual("sdkwork-official", seed_categories[0]["code"])
        self.assertEqual("SDKWork Official", seed_categories[0]["name"])
        self.assertTrue(seed_categories[0]["visible"])
        self.assertEqual(1, seed_categories[0]["status"])
        self.assertGreaterEqual(len(seed_skills), 3)
        official_count = 0
        clawhub_count = 0
        for skill in seed_skills:
            with self.subTest(skill=skill["skillKey"]):
                self.assertEqual("PUBLISHED", skill["marketStatus"])
                self.assertEqual("PUBLIC", skill["visibility"])
                self.assertEqual("APPROVED", skill["reviewStatus"])
                self.assertTrue(skill["enabled"])
                self.assertGreater(skill["installCount"], 0)
                self.assertGreater(skill["ratingCount"], 0)
                category = category_by_id[skill["categoryId"]]
                self.assertTrue(category["visible"])
                self.assertEqual(1, category["status"])
                if skill["sourceType"] == "OFFICIAL":
                    official_count += 1
                    self.assertEqual("SDKWork", skill["provider"])
                    self.assertEqual(seed_categories[0]["id"], skill["categoryId"])
                    self.assertTrue(skill["builtin"])
                    self.assertTrue(skill["isBuiltin"])
                    self.assertIn("official", skill["tags"])
                elif skill["sourceType"] == "COMMUNITY":
                    clawhub_count += 1
                    self.assertEqual("ClawHub", skill["provider"])
                    self.assertFalse(skill["builtin"])
                    self.assertFalse(skill["isBuiltin"])
                    self.assertEqual("clawhub", skill["source"]["vendor"])
                else:
                    self.fail(f"unsupported bundled skill sourceType: {skill['sourceType']}")
        self.assertGreaterEqual(official_count, 3)
        self.assertGreaterEqual(clawhub_count, 3)


if __name__ == "__main__":
    unittest.main()
