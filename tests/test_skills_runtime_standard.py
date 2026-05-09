import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILLS_PACKAGE = (
    ROOT
    / "apps"
    / "sdkwork-claw-router-portal"
    / "packages"
    / "sdkwork-claw-router-skills-hub"
)


class SkillsRuntimeStandardTest(unittest.TestCase):
    def test_skills_runtime_uses_generated_app_sdk_boundary(self) -> None:
        runtime_path = SKILLS_PACKAGE / "src" / "skillRuntime.ts"
        service_path = SKILLS_PACKAGE / "src" / "services" / "skillService.ts"
        list_path = SKILLS_PACKAGE / "src" / "pages" / "SkillsHub.tsx"
        detail_path = SKILLS_PACKAGE / "src" / "pages" / "SkillDetails.tsx"
        runtime_test_path = ROOT / "apps" / "sdkwork-claw-router-portal" / "skills-runtime.test.ts"
        verifier_path = ROOT / "scripts" / "verify-claw-router-product.mjs"
        tsconfig_path = SKILLS_PACKAGE / "tsconfig.json"

        self.assertTrue(runtime_path.exists(), "Skills runtime mapping must live in a pure module.")
        self.assertTrue(runtime_test_path.exists(), "Skills runtime behavior must have executable Node tests.")
        self.assertTrue(tsconfig_path.exists(), "Skills hub package must own an isolated tsconfig.json.")

        runtime_source = runtime_path.read_text(encoding="utf-8")
        service_source = service_path.read_text(encoding="utf-8")
        list_source = list_path.read_text(encoding="utf-8")
        detail_source = detail_path.read_text(encoding="utf-8")
        runtime_test_source = runtime_test_path.read_text(encoding="utf-8")
        verifier_source = verifier_path.read_text(encoding="utf-8")
        tsconfig_source = tsconfig_path.read_text(encoding="utf-8")

        self.assertIn("export type Skill", runtime_source)
        self.assertIn("export type SkillPackage", runtime_source)
        self.assertIn("export function normalizeSkillApiRecord", runtime_source)
        self.assertIn("export function filterSkillsForCatalog", runtime_source)
        self.assertIn("export function deriveSkillCatalogViewModel", runtime_source)
        self.assertIn("export function deriveSkillDetailView", runtime_source)
        self.assertIn("export function deriveSkillInstallationState", runtime_source)
        self.assertIn("export function buildSkillInstallCommand", runtime_source)
        self.assertIn("export function formatSkillConfigEditorValue", runtime_source)
        self.assertIn("export function parseSkillConfigEditorValue", runtime_source)
        self.assertIn("export function formatSkillDateLabel", runtime_source)
        self.assertIn("skill.packages?.[0]?.artifactRef", runtime_source)
        self.assertIn("installedSkills?: readonly InstalledSkill[]", runtime_source)
        self.assertIn("installationLabel: installation.label", runtime_source)
        self.assertIn("installed: installation.installed", runtime_source)
        self.assertIn("enabled: installation.enabled", runtime_source)

        self.assertIn("getClawRouterAppSdkClient().skill.getSkills", service_source)
        self.assertIn("getClawRouterAppSdkClient().skill.getSkillById", service_source)
        self.assertIn("getClawRouterAppSdkClient().skill.skillsGetCategories", service_source)
        self.assertNotIn("getClawRouterAppSdkClient().skills.", service_source)
        self.assertIn("normalizeSkillApiRecord", service_source)
        self.assertIn("filterSkillsForCatalog", service_source)

        self.assertNotIn("from '../data/skills'", list_source)
        self.assertNotIn("from '../data/skills'", detail_source)
        self.assertIn("deriveSkillCatalogViewModel", list_source)
        self.assertIn("skillService.getMySkills", list_source)
        self.assertIn("loadInstalledSkills", list_source)
        self.assertIn("installedSkills", list_source)
        self.assertIn("installedLoadError", list_source)
        self.assertIn("installationLabel", list_source)
        self.assertIn("deriveSkillDetailView", detail_source)
        self.assertIn("buildSkillInstallCommand", detail_source)
        self.assertIn("skills runtime normalizes app SDK records", runtime_test_source)
        self.assertIn("portal skills runtime tests", verifier_source)
        self.assertIn("apps/sdkwork-claw-router-portal/skills-runtime.test.ts", verifier_source)
        self.assertIn('"include"', tsconfig_source)
        self.assertIn('"src"', tsconfig_source)
        self.assertNotIn("sdkwork-claw-router-admin-skill", tsconfig_source)

    def test_skills_command_router_is_public_api_entrypoint(self) -> None:
        api_mod_source = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "mod.rs"
        ).read_text(encoding="utf-8")
        api_source = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_skills.rs"
        ).read_text(encoding="utf-8")

        self.assertIn("pub fn app_skills_router_with_store", api_source)
        self.assertIn("pub use app_skills::app_skills_router_with_store;", api_mod_source)

    def test_skills_hub_uses_precise_app_sdk_response_contracts(self) -> None:
        contract = (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(
            encoding="utf-8"
        )
        openapi = (ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json").read_text(
            encoding="utf-8"
        )
        openapi_payload = json.loads(openapi)
        skills_api = (ROOT / "sdks" / "clawrouter-app-sdk" / "src" / "api" / "skill.ts").read_text(
            encoding="utf-8"
        )
        skill_config_request_type = (
            ROOT / "sdks" / "clawrouter-app-sdk" / "src" / "types" / "app-skill-config-request.ts"
        ).read_text(encoding="utf-8")
        skill_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-skills-hub"
            / "src"
            / "services"
            / "skillService.ts"
        ).read_text(encoding="utf-8")
        runtime_source = (SKILLS_PACKAGE / "src" / "skillRuntime.ts").read_text(encoding="utf-8")

        for schema_name in [
            "SkillsCatalogResponse",
            "SkillCatalogItem",
            "SkillPackageItem",
            "SkillDetailResponse",
            "SkillCategoriesResponse",
        ]:
            self.assertIn(f"name: {schema_name}", contract)
        self.assertIn(f'"{schema_name}"', openapi)

        self.assertIn("packages:", contract)
        self.assertIn("items: *skill_package_item", contract)
        self.assertIn("packages?: SkillPackage[]", runtime_source)

        for result_name in [
            "GetSkillsResult",
            "GetSkillByIdResult",
            "SkillsGetCategoriesResult",
        ]:
            self.assertIn(f'"{result_name}"', openapi)

        self.assertIn('"$ref": "#/components/schemas/SkillsCatalogResponse"', openapi)
        self.assertIn('"$ref": "#/components/schemas/SkillDetailResponse"', openapi)
        self.assertIn('"$ref": "#/components/schemas/SkillCategoriesResponse"', openapi)

        self.assertIn("async getSkills(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<GetSkillsResult>", skills_api)
        self.assertIn("get<GetSkillsResult>", skills_api)
        self.assertIn("async getSkillById(skillId: string | number, pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<GetSkillByIdResult>", skills_api)
        self.assertIn("get<GetSkillByIdResult>", skills_api)
        self.assertIn("async skillsGetCategories(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<SkillsGetCategoriesResult>", skills_api)
        self.assertIn("get<SkillsGetCategoriesResult>", skills_api)
        self.assertIn("async getMySkills(pageNo?: number, pageSize?: number, keyword?: string, status?: string, startTime?: string, endTime?: string): Promise<GetMySkillsResult>", skills_api)
        self.assertIn("async enableSkill(skillId: string | number, body: AppSkillConfigRequest, xRequestId?: string): Promise<EnableSkillResult>", skills_api)
        self.assertIn("async disableSkill(skillId: string | number, body?: OperationRequest, xRequestId?: string): Promise<DisableSkillResult>", skills_api)
        self.assertIn("async updateSkillConfig(skillId: string | number, body: AppSkillConfigRequest, xRequestId?: string): Promise<UpdateSkillConfigResult>", skills_api)
        self.assertIn("buildQueryString", skills_api)
        self.assertIn("appendQueryString(appApiPath(`/skills`), query)", skills_api)
        self.assertIn("appendQueryString(appApiPath(`/skills/${skillId}`), query)", skills_api)
        self.assertIn("appendQueryString(appApiPath(`/skills/categories`), query)", skills_api)
        self.assertIn("appendQueryString(appApiPath(`/skills/my`), query)", skills_api)
        self.assertNotIn("getSkills(params?: QueryParams): Promise<PlusApiResult>", skills_api)
        self.assertNotIn("getSkillById(skillId: string | number, params?: QueryParams): Promise<PlusApiResult>", skills_api)

        result_checks = {
            "get-skills-result.ts": "data?: SkillsCatalogResponse;",
            "get-skill-by-id-result.ts": "data?: SkillDetailResponse;",
            "skills-get-categories-result.ts": "data?: SkillCategoriesResponse;",
        }
        for file_name, expected in result_checks.items():
            result_path = ROOT / "sdks" / "clawrouter-app-sdk" / "src" / "types" / file_name
            self.assertTrue(result_path.exists(), file_name)
            self.assertIn(expected, result_path.read_text(encoding="utf-8"))

        self.assertIn("SkillsCatalogResponse as SdkSkillsCatalogResponse", skill_service)
        self.assertIn("SkillDetailResponse as SdkSkillDetailResponse", skill_service)
        self.assertIn("SkillCategoriesResponse as SdkSkillCategoriesResponse", skill_service)
        self.assertIn("AppInstalledSkillsResponse as SdkAppInstalledSkillsResponse", skill_service)
        self.assertIn("AppInstalledSkillResponse as SdkAppInstalledSkillResponse", skill_service)
        self.assertIn("AppSkillConfigRequest as SdkAppSkillConfigRequest", skill_service)
        self.assertIn("const items: SdkSkillsCatalogResponse['items']", skill_service)
        self.assertIn("const item: SdkSkillDetailResponse", skill_service)
        self.assertIn("const items: SdkSkillCategoriesResponse['items']", skill_service)
        self.assertIn("const items: SdkAppInstalledSkillsResponse['items']", skill_service)
        self.assertIn("getClawRouterAppSdkClient().skill.enableSkill", skill_service)
        self.assertIn("getClawRouterAppSdkClient().skill.disableSkill", skill_service)
        self.assertIn("getClawRouterAppSdkClient().skill.updateSkillConfig", skill_service)
        self.assertIn("standardListQueryArguments", skill_service)
        self.assertIn("config.portal is reserved portal metadata", contract)
        request_schema = openapi_payload["components"]["schemas"]["AppSkillConfigRequest"]
        self.assertEqual(["portal"], request_schema["not"]["required"])
        self.assertEqual(["portal"], request_schema["properties"]["config"]["not"]["required"])
        self.assertIn("config.portal is reserved portal metadata", skill_config_request_type)
        self.assertIn("config.portal is reserved portal metadata", runtime_source)

    def test_skills_sdk_routes_have_retryable_error_states(self) -> None:
        list_source = (SKILLS_PACKAGE / "src" / "pages" / "SkillsHub.tsx").read_text(encoding="utf-8")
        detail_source = (SKILLS_PACKAGE / "src" / "pages" / "SkillDetails.tsx").read_text(encoding="utf-8")
        commons_runtime_test = (
            ROOT / "apps" / "sdkwork-claw-router-portal" / "commons-runtime.test.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("getLoadErrorMessage returns Error messages", commons_runtime_test)

        required_sources = {
            "SkillsHub.tsx": list_source,
            "SkillDetails.tsx": detail_source,
        }

        for name, source in required_sources.items():
            with self.subTest(component=name):
                self.assertIn("BusinessStatePanel", source)
                self.assertIn("getLoadErrorMessage", source)
                self.assertIn("loadError", source)
                self.assertIn("catch", source)
                self.assertIn("finally", source)
                self.assertIn("onRetry", source)
                self.assertIn("Failed to load", source)
                self.assertNotIn("console.error", source)

        self.assertIn("loadCategories", list_source)
        self.assertIn("categoryLoadError", list_source)
        self.assertIn("loadSkills", list_source)
        self.assertIn("loadInstalledSkills", list_source)
        self.assertIn("installedLoadError", list_source)
        self.assertIn("skillService.getMySkills", list_source)
        self.assertIn("installationLabel", list_source)
        self.assertIn("data-business-state={loadError ? 'error' : undefined}", list_source)
        self.assertIn("loadSkillDetails", detail_source)
        self.assertIn("loadInstalledSkills", detail_source)
        self.assertIn("handleInstallToggle", detail_source)
        self.assertIn("handleConfigSave", detail_source)
        self.assertIn("skillService.getMySkills", detail_source)
        self.assertIn("skillService.enableSkill", detail_source)
        self.assertIn("skillService.disableSkill", detail_source)
        self.assertIn("skillService.updateSkillConfig", detail_source)
        self.assertIn("parseSkillConfigEditorValue", detail_source)
        self.assertIn("formatSkillConfigEditorValue", detail_source)
        self.assertIn("deriveSkillInstallationState", detail_source)
        self.assertIn("installActionError", detail_source)
        self.assertIn("configActionError", detail_source)

    def test_skills_config_validation_is_aligned_between_frontend_and_app_api(self) -> None:
        runtime_source = (SKILLS_PACKAGE / "src" / "skillRuntime.ts").read_text(encoding="utf-8")
        api_source = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_skills.rs"
        ).read_text(encoding="utf-8")
        api_test_source = (
            ROOT / "services" / "sdkwork-claw-product" / "tests" / "app_skills_api.rs"
        ).read_text(encoding="utf-8")

        self.assertIn("MAX_SKILL_CONFIG_BYTES = 64 * 1024", runtime_source)
        self.assertIn("MAX_SKILL_CONFIG_BYTES: usize = 64 * 1024", api_source)
        for token in [
            "config.portal is reserved portal metadata",
            "config nesting depth must be at most",
            "config arrays must contain at most",
            "config string values must be at most",
        ]:
            with self.subTest(token=token):
                self.assertIn(token, runtime_source)
                self.assertIn(token, api_source)

        self.assertIn("rejectOversizedSkillConfigRequestBody", runtime_source)
        self.assertIn("JSON.stringify({ config })", runtime_source)
        self.assertIn("reject_nested_config_value", api_source)
        self.assertIn("for item in items", api_source)
        self.assertIn("app_skills_config_route_rejects_reserved_portal_metadata_inside_arrays", api_test_source)

    def test_skills_runtime_has_no_browser_drift_or_fake_static_fallback(self) -> None:
        list_source = (SKILLS_PACKAGE / "src" / "pages" / "SkillsHub.tsx").read_text(encoding="utf-8")
        detail_source = (SKILLS_PACKAGE / "src" / "pages" / "SkillDetails.tsx").read_text(encoding="utf-8")
        service_source = (SKILLS_PACKAGE / "src" / "services" / "skillService.ts").read_text(encoding="utf-8")
        runtime_source = (SKILLS_PACKAGE / "src" / "skillRuntime.ts").read_text(encoding="utf-8")
        combined_components = f"{list_source}\n{detail_source}"

        for forbidden_component_token in [
            "new Date(",
            "toLocaleDateString",
            "toLocaleString",
            "Math.random",
            "setTimeout(",
            "setInterval(",
            "SKILLS",
            "../data/skills",
        ]:
            self.assertNotIn(forbidden_component_token, combined_components)

        for forbidden_service_token in [
            "fetch(",
            "axios",
            "/app/v3/api",
            "Authorization",
            "SKILLS",
            "new Date(",
        ]:
            self.assertNotIn(forbidden_service_token, service_source)

        self.assertNotIn("toLocaleDateString", runtime_source)
        self.assertNotIn("toLocaleString", runtime_source)
        self.assertNotIn("Math.random", runtime_source)
        self.assertNotIn("setTimeout(", runtime_source)

    def test_skills_contract_evidence_points_to_runtime_shape_not_seed_data(self) -> None:
        contracts = (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(encoding="utf-8")
        field_audit = (ROOT / "generated" / "schema" / "frontend" / "frontend-field-audit.json").read_text(encoding="utf-8")
        operation_audit = (ROOT / "generated" / "schema" / "frontend" / "frontend-operation-audit.json").read_text(encoding="utf-8")
        route_classification = (ROOT / "docs" / "schema-registry" / "frontend-route-classification.yaml").read_text(encoding="utf-8")

        expected_source = "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-skills-hub/src/skillRuntime.ts"
        old_source = "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-skills-hub/src/data/skills.ts"

        self.assertIn("route: /skills-hub", contracts)
        self.assertIn(f"source: {expected_source}", contracts)
        self.assertNotIn(f"source: {old_source}", contracts)
        self.assertIn('"source": "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-skills-hub/src/skillRuntime.ts"', field_audit)
        self.assertIn("/app/v3/api/skills", operation_audit)
        self.assertIn("/app/v3/api/skills/{skillId}", operation_audit)
        self.assertIn("delivery_kind: sdk_backed_business_runtime", route_classification)
        self.assertIn("/skills-hub/:id", route_classification)

    def test_skills_production_smoke_covers_route_and_runtime_chunk_semantics(self) -> None:
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
            / "sdkwork-claw-router-skills-hub"
            / "src"
            / "services"
            / "skillService.ts"
        ).read_text(encoding="utf-8")
        runtime_source = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-skills-hub"
            / "src"
            / "skillRuntime.ts"
        ).read_text(encoding="utf-8")

        self.assertIn('pathName: "/skills-hub"', smoke_source)
        self.assertIn('pathName: "/skills-hub/skill-1"', smoke_source)
        self.assertIn('pathName: "/skills-hub/__browser-smoke-success"', smoke_source)
        self.assertIn('pathName: "/skills-hub?__browser-smoke-empty=1"', smoke_source)
        self.assertIn('pathName: "/skills-hub?__browser-smoke-filter=1"', smoke_source)
        self.assertIn('pathName: "/skills-hub?__browser-smoke-categories=1"', smoke_source)
        self.assertIn('pathName: "/skills-hub?__browser-smoke-retry=1"', smoke_source)
        self.assertIn("APP_SDK_FIXTURE_MODE", smoke_source)
        self.assertIn("APP_SDK_FAILURE_FIXTURE_MODE", smoke_source)
        self.assertIn("BROWSER_SMOKE_SKILL_RECORD", smoke_source)
        self.assertIn("BROWSER_SMOKE_INSTALLED_SKILL_RECORD", smoke_source)
        self.assertIn("/app/v3/api/skills", smoke_source)
        self.assertIn("/app/v3/api/skills/my", smoke_source)
        self.assertIn("Browser Smoke Skill", smoke_source)
        self.assertIn("npx clawhub@latest install clawhub.io/sdkwork/browser-smoke-skill:v1.0.0", smoke_source)
        self.assertNotIn("npx clawhub@latest install browser-smoke-skill", smoke_source)
        self.assertIn("Browser smoke skills unavailable", smoke_source)
        self.assertIn("Browser smoke skill details unavailable", smoke_source)
        self.assertIn("Browser smoke skills transient failure", smoke_source)
        self.assertIn("Skills could not be loaded", smoke_source)
        self.assertIn("Skill details could not be loaded", smoke_source)
        self.assertNotIn("server responded with a status of 502 (Bad Gateway)", smoke_source)

        self.assertIn("getClawRouterAppSdkClient().skill.getSkills", service_source)
        self.assertIn("getClawRouterAppSdkClient().skill.getSkillById", service_source)
        self.assertIn("getClawRouterAppSdkClient().skill.skillsGetCategories", service_source)
        self.assertNotIn("getClawRouterAppSdkClient().skills.", service_source)
        self.assertIn("normalizeSkillApiRecord", runtime_source)
        self.assertIn("deriveSkillCatalogViewModel", runtime_source)
        self.assertIn("deriveSkillDetailView", runtime_source)
        self.assertIn("buildSkillInstallCommand", runtime_source)

        self.assertIn("portal production browser DOM smoke", product_test_source)
        self.assertIn(r"/skills-hub\?__browser-smoke-retry", product_test_source)

    def test_skills_auxiliary_scripts_do_not_depend_on_removed_seed_data(self) -> None:
        extractor_source = (
            ROOT / "apps" / "sdkwork-claw-router-portal" / "app" / "applet" / "extract_data.mjs"
        ).read_text(encoding="utf-8")

        self.assertNotIn("packages/sdkwork-claw-router-skills-hub/src/data/skills.ts", extractor_source)
        self.assertNotIn("require(", extractor_source)

    def test_skills_runtime_fields_are_not_overridden_by_static_sample_translations(self) -> None:
        list_source = (SKILLS_PACKAGE / "src" / "pages" / "SkillsHub.tsx").read_text(encoding="utf-8")
        detail_source = (SKILLS_PACKAGE / "src" / "pages" / "SkillDetails.tsx").read_text(encoding="utf-8")
        i18n_source = (
            ROOT / "apps" / "sdkwork-claw-router-portal" / "packages" / "sdkwork-claw-router-i18n" / "src" / "index.ts"
        ).read_text(encoding="utf-8")
        apply_translations_source = (
            ROOT / "apps" / "sdkwork-claw-router-portal" / "app" / "applet" / "apply_translations.mjs"
        ).read_text(encoding="utf-8")

        combined_components = f"{list_source}\n{detail_source}"
        self.assertNotIn("skills.data.${", combined_components)
        self.assertNotIn("skills.data.skill-", i18n_source)
        self.assertNotIn("skills.data.skill-", apply_translations_source)


if __name__ == "__main__":
    unittest.main()
