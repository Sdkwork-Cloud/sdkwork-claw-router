import json
import unittest
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]
CONTRACT_PATH = ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
BACKEND_OPENAPI_PATH = ROOT / "generated" / "openapi" / "clawrouter-backend-openapi.json"
BACKEND_SKILL_API_PATH = ROOT / "sdks" / "clawrouter-backend-sdk" / "src" / "api" / "skill.ts"
BACKEND_SDK_PATH = ROOT / "sdks" / "clawrouter-backend-sdk" / "src" / "sdk.ts"
PORTAL_PACKAGE_ROOT = (
    ROOT
    / "apps"
    / "sdkwork-claw-router-portal"
    / "packages"
    / "sdkwork-claw-router-admin-skill"
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
            "fetchSkillCategories": ("GET", "/backend/v3/api/skill/categories"),
            "createSkillCategory": ("POST", "/backend/v3/api/skill/categories"),
            "fetchSkillPackages": ("POST", "/backend/v3/api/skill/package/list"),
            "getSkillPackage": ("GET", "/backend/v3/api/skill/package/{package_id}"),
            "createSkillPackage": ("POST", "/backend/v3/api/skill/package"),
            "updateSkillPackage": ("PUT", "/backend/v3/api/skill/package/{package_id}"),
            "deleteSkillPackage": ("DELETE", "/backend/v3/api/skill/package/{package_id}"),
            "enableSkillPackage": ("POST", "/backend/v3/api/skill/package/{package_id}/enable"),
            "disableSkillPackage": ("POST", "/backend/v3/api/skill/package/{package_id}/disable"),
            "fetchSkills": ("POST", "/backend/v3/api/skill/list"),
            "getSkill": ("GET", "/backend/v3/api/skill/{skill_id}"),
            "createSkill": ("POST", "/backend/v3/api/skill"),
            "updateSkill": ("PUT", "/backend/v3/api/skill/{skill_id}"),
            "deleteSkill": ("DELETE", "/backend/v3/api/skill/{skill_id}"),
            "enableSkill": ("POST", "/backend/v3/api/skill/{skill_id}/enable"),
            "disableSkill": ("POST", "/backend/v3/api/skill/{skill_id}/disable"),
            "publishSkill": ("POST", "/backend/v3/api/skill/{skill_id}/publish"),
            "offlineSkill": ("POST", "/backend/v3/api/skill/{skill_id}/offline"),
            "approveSkill": ("POST", "/backend/v3/api/skill/{skill_id}/review/approve"),
            "rejectSkill": ("POST", "/backend/v3/api/skill/{skill_id}/review/reject"),
            "fetchSkillAssets": ("GET", "/backend/v3/api/skill/{skill_id}/assets"),
            "getSkillAsset": ("GET", "/backend/v3/api/skill/{skill_id}/assets/{asset_id}"),
            "createSkillAsset": ("POST", "/backend/v3/api/skill/{skill_id}/assets"),
            "updateSkillAsset": ("PUT", "/backend/v3/api/skill/{skill_id}/assets/{asset_id}"),
            "deleteSkillAsset": ("DELETE", "/backend/v3/api/skill/{skill_id}/assets/{asset_id}"),
            "fetchSkillArtifacts": ("GET", "/backend/v3/api/skill/{skill_id}/artifacts"),
            "getSkillArtifact": ("GET", "/backend/v3/api/skill/{skill_id}/artifacts/{artifact_id}"),
            "createSkillArtifact": ("POST", "/backend/v3/api/skill/{skill_id}/artifacts"),
            "updateSkillArtifact": ("PUT", "/backend/v3/api/skill/{skill_id}/artifacts/{artifact_id}"),
            "deleteSkillArtifact": ("DELETE", "/backend/v3/api/skill/{skill_id}/artifacts/{artifact_id}"),
        }

        self.assertEqual(set(expected), set(operations))
        for operation_name, (method, path) in expected.items():
            with self.subTest(operation=operation_name):
                operation = operations[operation_name]
                self.assertEqual("backend", operation["api_surface"])
                self.assertEqual(method, operation["api_method"])
                self.assertEqual(path, operation["api_path"])
                if operation_name in {"fetchSkillCategories", "createSkillCategory"}:
                    self.assertIn("plus_category", operation["read_sources"])
                elif "SkillPackage" in operation_name:
                    self.assertIn("plus_agent_skill_package", operation["read_sources"])
                else:
                    self.assertIn("plus_agent_skill", operation["read_sources"])
                if method in {"POST", "PUT", "DELETE"} and operation_name not in {"fetchSkills", "fetchSkillPackages"}:
                    self.assertIn("ops_audit_log", operation.get("write_tables", []))

        self.assertEqual("AdminSkillCategoryListResponse", operations["fetchSkillCategories"]["response_schema"]["name"])
        self.assertEqual("AdminSkillCategoryCreateRequest", operations["createSkillCategory"]["request_schema"]["name"])
        self.assertEqual("AdminSkillPackageListRequest", operations["fetchSkillPackages"]["request_schema"]["name"])
        self.assertEqual("AdminSkillPackageListResponse", operations["fetchSkillPackages"]["response_schema"]["name"])
        self.assertEqual("AdminSkillPackageCreateRequest", operations["createSkillPackage"]["request_schema"]["name"])
        self.assertEqual("AdminSkillPackageUpdateRequest", operations["updateSkillPackage"]["request_schema"]["name"])
        self.assertEqual("AdminSkillPackageDeleteResponse", operations["deleteSkillPackage"]["response_schema"]["name"])
        self.assertEqual("AdminSkillListRequest", operations["fetchSkills"]["request_schema"]["name"])
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
            self.assertTrue(operations[operation_name]["request_id_header"])

    def test_backend_skill_openapi_and_sdk_expose_generated_skill_client(self) -> None:
        openapi = json.loads(BACKEND_OPENAPI_PATH.read_text(encoding="utf-8"))

        for path, method, operation_id in [
            ("/backend/v3/api/skill/categories", "get", "fetchSkillCategories"),
            ("/backend/v3/api/skill/categories", "post", "createSkillCategory"),
            ("/backend/v3/api/skill/package/list", "post", "fetchSkillPackages"),
            ("/backend/v3/api/skill/package/{package_id}", "get", "getSkillPackage"),
            ("/backend/v3/api/skill/package", "post", "createSkillPackage"),
            ("/backend/v3/api/skill/package/{package_id}", "put", "updateSkillPackage"),
            ("/backend/v3/api/skill/package/{package_id}", "delete", "deleteSkillPackage"),
            ("/backend/v3/api/skill/package/{package_id}/enable", "post", "enableSkillPackage"),
            ("/backend/v3/api/skill/package/{package_id}/disable", "post", "disableSkillPackage"),
            ("/backend/v3/api/skill/list", "post", "fetchSkills"),
            ("/backend/v3/api/skill/{skill_id}", "get", "getSkill"),
            ("/backend/v3/api/skill/{skill_id}", "put", "updateSkill"),
            ("/backend/v3/api/skill/{skill_id}", "delete", "deleteSkill"),
            ("/backend/v3/api/skill/{skill_id}/enable", "post", "enableSkill"),
            ("/backend/v3/api/skill/{skill_id}/disable", "post", "disableSkill"),
            ("/backend/v3/api/skill/{skill_id}/publish", "post", "publishSkill"),
            ("/backend/v3/api/skill/{skill_id}/offline", "post", "offlineSkill"),
            ("/backend/v3/api/skill/{skill_id}/review/approve", "post", "approveSkill"),
            ("/backend/v3/api/skill/{skill_id}/review/reject", "post", "rejectSkill"),
            ("/backend/v3/api/skill/{skill_id}/assets", "get", "fetchSkillAssets"),
            ("/backend/v3/api/skill/{skill_id}/assets/{asset_id}", "get", "getSkillAsset"),
            ("/backend/v3/api/skill/{skill_id}/assets", "post", "createSkillAsset"),
            ("/backend/v3/api/skill/{skill_id}/assets/{asset_id}", "put", "updateSkillAsset"),
            ("/backend/v3/api/skill/{skill_id}/assets/{asset_id}", "delete", "deleteSkillAsset"),
            ("/backend/v3/api/skill/{skill_id}/artifacts", "get", "fetchSkillArtifacts"),
            ("/backend/v3/api/skill/{skill_id}/artifacts/{artifact_id}", "get", "getSkillArtifact"),
            ("/backend/v3/api/skill/{skill_id}/artifacts", "post", "createSkillArtifact"),
            ("/backend/v3/api/skill/{skill_id}/artifacts/{artifact_id}", "put", "updateSkillArtifact"),
            ("/backend/v3/api/skill/{skill_id}/artifacts/{artifact_id}", "delete", "deleteSkillArtifact"),
        ]:
            with self.subTest(path=path, method=method):
                operation = openapi["paths"][path][method]
                self.assertEqual(operation_id, operation["operationId"])
                self.assertEqual(["skill"], operation["tags"])

        for schema_name in [
            "AdminSkillItem",
            "AdminSkillCategoryItem",
            "AdminSkillPackageItem",
            "AdminSkillPackageListRequest",
            "AdminSkillPackageCreateRequest",
            "AdminSkillPackageUpdateRequest",
            "AdminSkillPackageMutationResponse",
            "AdminSkillPackageDeleteResponse",
            "AdminSkillListRequest",
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
        item_type = (ROOT / "sdks" / "clawrouter-backend-sdk" / "src" / "types" / "admin-skill-item.ts").read_text(
            encoding="utf-8"
        )
        create_type = (
            ROOT / "sdks" / "clawrouter-backend-sdk" / "src" / "types" / "admin-skill-create-request.ts"
        ).read_text(encoding="utf-8")
        package_type = (
            ROOT / "sdks" / "clawrouter-backend-sdk" / "src" / "types" / "admin-skill-package-item.ts"
        ).read_text(encoding="utf-8")
        asset_type = (
            ROOT / "sdks" / "clawrouter-backend-sdk" / "src" / "types" / "admin-skill-asset-item.ts"
        ).read_text(encoding="utf-8")
        artifact_type = (
            ROOT / "sdks" / "clawrouter-backend-sdk" / "src" / "types" / "admin-skill-artifact-item.ts"
        ).read_text(encoding="utf-8")

        for method in [
            "fetchSkillCategories",
            "createSkillCategory",
            "fetchSkillPackages",
            "getSkillPackage",
            "createSkillPackage",
            "updateSkillPackage",
            "deleteSkillPackage",
            "enableSkillPackage",
            "disableSkillPackage",
            "fetchSkills",
            "getSkill",
            "createSkill",
            "updateSkill",
            "deleteSkill",
            "enableSkill",
            "disableSkill",
            "publishSkill",
            "offlineSkill",
            "approveSkill",
            "rejectSkill",
            "fetchSkillAssets",
            "getSkillAsset",
            "createSkillAsset",
            "updateSkillAsset",
            "deleteSkillAsset",
            "fetchSkillArtifacts",
            "getSkillArtifact",
            "createSkillArtifact",
            "updateSkillArtifact",
            "deleteSkillArtifact",
        ]:
            self.assertIn(f"async {method}(", skill_api)

        self.assertIn("public readonly skill: SkillApi;", sdk)
        self.assertIn("this.skill = createSkillApi(this.httpClient);", sdk)
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
        app_path = ROOT / "apps" / "sdkwork-claw-router-portal" / "src" / "App.tsx"
        admin_layout_path = ROOT / "apps" / "sdkwork-claw-router-portal" / "src" / "AdminLayout.tsx"
        runtime_test_path = ROOT / "apps" / "sdkwork-claw-router-portal" / "admin-skill-runtime.test.ts"
        browser_smoke_path = ROOT / "apps" / "sdkwork-claw-router-portal" / "scripts" / "smoke-production-browser.mjs"

        for path in [service_path, page_path, package_path, runtime_test_path, browser_smoke_path]:
            self.assertTrue(path.exists(), str(path))

        service = service_path.read_text(encoding="utf-8")
        page = page_path.read_text(encoding="utf-8")
        app = app_path.read_text(encoding="utf-8")
        admin_layout = admin_layout_path.read_text(encoding="utf-8")
        runtime_test = runtime_test_path.read_text(encoding="utf-8")
        browser_smoke = browser_smoke_path.read_text(encoding="utf-8")

        self.assertIn("getClawRouterBackendSdkClient().skill.fetchSkills", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.fetchSkillCategories", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.fetchSkillPackages", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.getSkillPackage", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.createSkillPackage", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.updateSkillPackage", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.deleteSkillPackage", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.enableSkillPackage", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.disableSkillPackage", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.createSkill", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.updateSkill", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.approveSkill", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.rejectSkill", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.publishSkill", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.offlineSkill", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.enableSkill", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.disableSkill", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.fetchSkillAssets", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.getSkillAsset", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.createSkillAsset", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.updateSkillAsset", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.deleteSkillAsset", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.fetchSkillArtifacts", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.getSkillArtifact", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.createSkillArtifact", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.updateSkillArtifact", service)
        self.assertIn("getClawRouterBackendSdkClient().skill.deleteSkillArtifact", service)
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
        self.assertIn("sdkwork-claw-router-admin-skill", app)
        self.assertIn('path="skill"', app)
        self.assertIn("/admin/skill", admin_layout)
        self.assertIn("admin skill service calls generated backend SDK paths", runtime_test)
        self.assertIn("/backend/v3/api/skill/package/list", runtime_test)
        self.assertIn("/backend/v3/api/skill/8101/assets", runtime_test)
        self.assertIn("/backend/v3/api/skill/8101/artifacts", runtime_test)
        self.assertIn("createSkillPackageInputFromForm", runtime_test)
        self.assertIn("BROWSER_SMOKE_ADMIN_SKILL_PACKAGE", browser_smoke)
        self.assertIn("POST /backend/v3/api/skill/package/list", browser_smoke)

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
            ROOT / "apps" / "sdkwork-claw-router-portal" / "admin-skill-runtime.test.ts",
            ROOT / "apps" / "sdkwork-claw-router-portal" / "scripts" / "smoke-production-browser.mjs",
        ]

        for path in skill_surface_paths:
            with self.subTest(path=str(path.relative_to(ROOT))):
                self.assertTrue(path.exists(), str(path))
                source = path.read_text(encoding="utf-8")
                self.assertNotIn("MARKET", source)
                self.assertNotIn("BUILTIN", source)

        seed_skills = json.loads((ROOT / "data" / "skills" / "skills.json").read_text(encoding="utf-8"))
        self.assertGreaterEqual(len(seed_skills), 3)
        for skill in seed_skills:
            with self.subTest(skill=skill["skillKey"]):
                self.assertEqual("OFFICIAL", skill["sourceType"])
                self.assertEqual("PUBLISHED", skill["marketStatus"])
                self.assertEqual("PUBLIC", skill["visibility"])
                self.assertEqual("APPROVED", skill["reviewStatus"])
                self.assertTrue(skill["enabled"])
                self.assertTrue(skill["builtin"])
                self.assertTrue(skill["isBuiltin"])
                self.assertGreater(skill["installCount"], 0)
                self.assertGreater(skill["ratingCount"], 0)
                self.assertIn("official", skill["tags"])


if __name__ == "__main__":
    unittest.main()
