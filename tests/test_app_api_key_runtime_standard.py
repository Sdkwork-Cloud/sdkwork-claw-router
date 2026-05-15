import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class AppApiKeyRuntimeStandardTest(unittest.TestCase):
    def test_app_api_key_creation_does_not_use_in_memory_command_store(self) -> None:
        api_key_route = ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_api_keys.rs"
        source = api_key_route.read_text(encoding="utf-8")

        self.assertNotIn("InMemoryGatewayApiKeyCommandStore", source)
        self.assertNotIn("app_api_key_router_with_optional_api_key_hasher", source)
        self.assertNotIn("app_api_key_router_with_api_key_hasher", source)

    def test_app_api_service_exposes_creation_only_with_command_store_and_hasher(self) -> None:
        service = ROOT / "services" / "sdkwork-claw-app-api" / "src" / "lib.rs"
        source = service.read_text(encoding="utf-8")

        self.assertNotIn("router_with_product_catalog_and_api_key_security_config", source)
        self.assertNotIn("router_with_product_catalog_api_key_hasher_and_database_status", source)
        self.assertIn("router_with_api_key_management_store_and_database_status", source)
        self.assertIn("api_key_hasher,", source)
        self.assertIn("command_store,", source)

    def test_app_api_key_creation_uses_refreshable_read_store_not_overlay(self) -> None:
        api_key_route = ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_api_keys.rs"
        source = api_key_route.read_text(encoding="utf-8")

        self.assertNotIn("AppApiKeyOverlay", source)
        self.assertNotIn("Mutex<", source)
        self.assertNotIn("overlay", source)
        self.assertIn("GatewayApiKeyManagementReadStore", source)
        self.assertIn("app_api_key_router_with_read_store_and_command_store", source)

    def test_database_api_key_routes_reload_sql_read_model(self) -> None:
        service = ROOT / "services" / "sdkwork-claw-app-api" / "src" / "lib.rs"
        source = service.read_text(encoding="utf-8")

        self.assertIn("router_with_api_key_management_store_and_database_status", source)
        self.assertIn("SqlitePricingCatalogLoader::new(pool.clone())", source)
        self.assertIn("PostgresPricingCatalogLoader::new(pool.clone())", source)
        self.assertNotIn("router_with_product_catalog_api_key_command_store_and_database_status", source)

    def test_sql_api_key_command_store_persists_application_created_at(self) -> None:
        store_paths = [
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "sqlite"
            / "api_key_command_store.rs",
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "postgres"
            / "api_key_command_store.rs",
        ]

        for path in store_paths:
            source = path.read_text(encoding="utf-8")
            with self.subTest(path=path):
                self.assertIn("created_at, updated_at", source)
                self.assertIn(".bind(&command.created_at)", source)

    def test_app_api_key_creation_has_contract_level_idempotency(self) -> None:
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")
        openapi = (
            ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json"
        ).read_text(encoding="utf-8")
        sdk = (
            ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "api" / "iam.ts"
        ).read_text(encoding="utf-8")
        frontend = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-api-keys"
            / "src"
            / "apiKeyService.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("idempotency_required: true", contract)
        self.assertIn('"name": "Idempotency-Key"', openapi)
        self.assertIn('"required": true', openapi)
        self.assertIn('"name": "X-Request-Id"', openapi)
        self.assertIn("CreateApiKeyRequest", sdk)
        self.assertIn("ApiKeysCreateResult", sdk)
        self.assertIn("create(body: CreateApiKeyRequest, params: IamApiKeysCreateParams)", sdk)
        self.assertIn("post<ApiKeysCreateResult>", sdk)
        self.assertIn("createRequestToken", frontend)
        self.assertIn("from 'sdkwork-claw-router-commons/runtime'", frontend)
        self.assertNotIn("function createRequestToken", frontend)
        self.assertIn("const idempotencyKey = createRequestToken('create-api-key');", frontend)
        self.assertIn("const requestId = createRequestToken('request');", frontend)
        self.assertIn("{ idempotencyKey, xRequestId: requestId }", frontend)
        self.assertNotIn("x-sdkwork-tenant-id", frontend.lower())
        self.assertNotIn("x-sdkwork-organization-id", frontend.lower())
        self.assertNotIn("x-sdkwork-user-id", frontend.lower())

    def test_app_api_key_frontend_consumes_precise_create_key_sdk_types(self) -> None:
        frontend = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-api-keys"
            / "src"
            / "apiKeyService.ts"
        ).read_text(encoding="utf-8")
        create_key_body = frontend.split("static async createKey", 1)[1]

        self.assertIn("import type { CreateApiKeyRequest } from '@sdkwork/clawrouter-app-sdk'", frontend)
        self.assertIn("type ApiKeyModality = NonNullable<CreateApiKeyRequest['modalities']>[number]", frontend)
        self.assertIn("toApiKeyModalities(input.modalities)", frontend)
        self.assertIn("const data = readApiRecord(result)", create_key_body)
        self.assertIn(
            "readRequiredApiItem(result, 'API key creation response is missing key data', ['item'])",
            create_key_body,
        )
        self.assertNotIn("normalizeApiKey(data.item)", create_key_body)
        self.assertNotIn("const data = result.data", create_key_body)
        self.assertNotIn("const data = isRecord(result.data) ? result.data : {}", create_key_body)

    def test_app_api_key_fetch_uses_standard_success_and_list_read_helpers(self) -> None:
        frontend = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-api-keys"
            / "src"
            / "apiKeyService.ts"
        ).read_text(encoding="utf-8")
        fetch_body = frontend.split("static async fetchKeys", 1)[1].split("static async createKey", 1)[0]

        self.assertIn("ensurePlusApiSuccess(result, 'Failed to fetch API keys')", fetch_body)
        self.assertIn("readRequiredApiItems(result, 'Failed to fetch API keys')", fetch_body)
        self.assertIn("readRequiredApiItems(result, 'Failed to fetch API key groups', ['groups'])", fetch_body)
        self.assertNotIn("Array.isArray(data.items)", fetch_body)
        self.assertNotIn("Array.isArray(data.groups)", fetch_body)

    def test_app_api_key_fetch_uses_precise_sdk_response_contract(self) -> None:
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")
        openapi = (
            ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json"
        ).read_text(encoding="utf-8")
        sdk_iam = (
            ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "api" / "iam.ts"
        ).read_text(encoding="utf-8")
        frontend = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-api-keys"
            / "src"
            / "apiKeyService.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("name: AppApiKeyListResponse", contract)
        self.assertIn('"AppApiKeyListResponse"', openapi)
        self.assertIn('"ApiKeysListResult"', openapi)
        self.assertIn('"$ref": "#/components/schemas/AppApiKeyListResponse"', openapi)
        self.assertIn("async list(): Promise<ApiKeysListResult>", sdk_iam)
        self.assertIn("appApiPath(`/iam/api_keys`)", sdk_iam)
        self.assertIn("get<ApiKeysListResult>", sdk_iam)

        response_path = ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "types" / "app-api-key-list-response.ts"
        result_path = ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "types" / "api-keys-list-result.ts"
        group_path = ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "types" / "app-api-key-group.ts"
        self.assertTrue(response_path.exists())
        self.assertTrue(result_path.exists())
        self.assertTrue(group_path.exists())
        self.assertIn("items: AppApiKeyItem[];", response_path.read_text(encoding="utf-8"))
        self.assertIn("groups: AppApiKeyGroup[];", response_path.read_text(encoding="utf-8"))
        self.assertIn("data?: AppApiKeyListResponse;", result_path.read_text(encoding="utf-8"))

        self.assertIn("AppApiKeyListResponse as SdkAppApiKeyListResponse", frontend)
        self.assertIn("id: SdkAppApiKeyListResponse['items'][number]['id'];", frontend)
        self.assertIn("groups: SdkAppApiKeyListResponse['groups'];", frontend)

    def test_console_api_key_frontend_uses_pure_create_command_form_adapter(self) -> None:
        package = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-api-keys"
            / "package.json"
        ).read_text(encoding="utf-8")
        form_path = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-api-keys"
            / "src"
            / "apiKeyForm.ts"
        )
        view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-api-keys"
            / "src"
            / "ApiKeysView.tsx"
        ).read_text(encoding="utf-8")
        drawer = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-api-keys"
            / "src"
            / "CreateKeyDrawer.tsx"
        ).read_text(encoding="utf-8")
        verifier = (ROOT / "scripts" / "verify-claw-router-product.mjs").read_text(encoding="utf-8")
        product_tests = (ROOT / "scripts" / "run-claw-router-product.test.mjs").read_text(encoding="utf-8")

        self.assertIn('"type": "module"', package)
        self.assertIn('"typecheck": "tsc --noEmit"', package)
        self.assertTrue(form_path.exists())
        form = form_path.read_text(encoding="utf-8")
        self.assertIn("export type ApiKeyFormValues", form)
        self.assertIn("export function createApiKeyInputFromForm", form)
        self.assertIn("export function createApiKeyInputsFromForm", form)
        self.assertIn("DEFAULT_API_KEY_MODALITIES", form)
        self.assertNotIn("FormData", form)

        self.assertIn("createApiKeyInputsFromForm", view)
        self.assertIn("type ApiKeyFormValues", view)
        self.assertIn("CreateKeyDrawer, type ApiKeyFormValues", view)
        self.assertIn("for (const input of createApiKeyInputsFromForm(data))", view)
        self.assertIn("ApiKeyService.createKey(input)", view)
        self.assertNotIn("data.createCount > 1 ? `${data.name} ${index + 1}` : data.name", view)
        self.assertNotIn("modalities: data.modalities", view)
        self.assertNotIn("quota: data.quota", view)
        self.assertNotIn("ipLimit: data.ipLimit", view)
        self.assertNotIn("expires: data.expires", view)

        self.assertIn("export type ApiKeyFormValues", drawer)
        self.assertNotIn("export interface CreateKeyFormData", drawer)
        self.assertIn("onSubmit?: (data: ApiKeyFormValues) => void | Promise<void>", drawer)

        self.assertIn("portal api key runtime tests", verifier)
        self.assertIn("api-key-runtime.test.ts", verifier)
        self.assertIn("verification plan includes portal api key runtime tests before broad suites", product_tests)

    def test_app_api_key_list_exposes_only_masked_key_material(self) -> None:
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")
        api_key_route = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_api_keys.rs"
        ).read_text(encoding="utf-8")
        route_test = (
            ROOT / "services" / "sdkwork-claw-app-api" / "tests" / "api_key_route.rs"
        ).read_text(encoding="utf-8")
        database_route_test = (
            ROOT / "services" / "sdkwork-claw-app-api" / "tests" / "database_config_router.rs"
        ).read_text(encoding="utf-8")
        service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-api-keys"
            / "src"
            / "apiKeyService.ts"
        ).read_text(encoding="utf-8")
        view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-api-keys"
            / "src"
            / "ApiKeysView.tsx"
        ).read_text(encoding="utf-8")
        drawer = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-api-keys"
            / "src"
            / "CreateKeyDrawer.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn(
            "fields: [id, name, maskedKey, group, rate, quota, usedQuota, modalities, ipLimit, created, expires, status]",
            contract,
        )
        self.assertNotIn("fields: [id, name, keyVal, fullKey", contract)
        self.assertIn("description: One-time raw API key secret. It is never returned by list/read APIs.", contract)

        self.assertIn("masked_key: String", api_key_route)
        self.assertIn("let masked_key = api_key.masked_key();", api_key_route)
        self.assertNotIn("key_val: String", api_key_route)
        self.assertNotIn("full_key: String", api_key_route)
        self.assertNotIn("key_val: masked_key", api_key_route)
        self.assertNotIn("full_key: masked_key", api_key_route)

        self.assertIn('item["maskedKey"]', route_test)
        self.assertIn('item.get("keyVal").is_none()', route_test)
        self.assertIn('item.get("fullKey").is_none()', route_test)
        self.assertIn('payload["data"]["item"]["maskedKey"]', route_test)
        self.assertIn('payload["data"]["item"].get("keyVal").is_none()', route_test)
        self.assertIn('payload["data"]["item"].get("fullKey").is_none()', route_test)
        self.assertIn('items[0]["maskedKey"]', database_route_test)
        self.assertIn('items[0].get("keyVal").is_none()', database_route_test)
        self.assertIn('items[0].get("fullKey").is_none()', database_route_test)

        self.assertIn("maskedKey: string", service)
        self.assertIn("readRequiredString(value, 'id', 'API key id is required')", service)
        self.assertIn(
            "readRequiredString(value, 'maskedKey', 'API key masked value is required')",
            service,
        )
        self.assertNotIn("keyVal: string", service)
        self.assertNotIn("fullKey: string", service)
        self.assertNotIn("readString(value, 'keyVal')", service)
        self.assertNotIn("fullKey: keyVal", service)

        self.assertIn("key.maskedKey", view)
        self.assertIn("Copy key", view)
        self.assertNotIn("visibleKeys", view)
        self.assertNotIn("toggleVisibility", view)
        self.assertNotIn("Eye,", view)
        self.assertNotIn("EyeOff", view)
        self.assertNotIn("Copy token", view)
        self.assertNotIn("Show token", view)
        self.assertNotIn("Hide token", view)
        self.assertNotIn("text={key.", view)

        self.assertIn('ReadOnlyRow label="Masked token" value={initialData.maskedKey}', drawer)
        self.assertNotIn("initialData.fullKey", drawer)
        self.assertNotIn("initialData.keyVal", drawer)

    def test_app_api_key_creation_persists_idempotency_and_audit_request_id(self) -> None:
        schema = (
            ROOT / "docs" / "schema-registry" / "sdkwork-claw-router.tables.yaml"
        ).read_text(encoding="utf-8")
        postgres_schema = (
            ROOT / "generated" / "schema" / "postgres" / "schema.sql"
        ).read_text(encoding="utf-8")
        api_key_route = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_api_keys.rs"
        ).read_text(encoding="utf-8")

        self.assertIn("idempotency_key: string(128)", schema)
        self.assertIn("required_columns: [tenant_id, organization_id, user_id, idempotency_key]", schema)
        self.assertIn("idempotency_key VARCHAR(128) NOT NULL", postgres_schema)
        self.assertIn("tenant_id BIGINT NOT NULL", postgres_schema)
        self.assertIn("organization_id BIGINT NOT NULL", postgres_schema)
        self.assertIn("user_id BIGINT NOT NULL", postgres_schema)
        self.assertIn("uk_iam_gateway_api_key_idempotency", schema)
        self.assertIn("columns: [tenant_id, idempotency_key]", schema)
        self.assertIn(
            "uk_iam_gateway_api_key_idempotency ON iam_gateway_api_key (tenant_id, idempotency_key)",
            postgres_schema,
        )
        self.assertIn("HeaderMap", api_key_route)
        self.assertIn("TrustedRequestSubject", api_key_route)
        self.assertIn("normalize_idempotency_key", api_key_route)
        self.assertIn("normalize_request_id", api_key_route)

        for relative_path in [
            "services/sdkwork-claw-product/src/ports/api_key_command_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/api_key_command_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/api_key_command_store.rs",
        ]:
            source = (ROOT / relative_path).read_text(encoding="utf-8")
            with self.subTest(path=relative_path):
                self.assertIn("tenant_id", source)
                self.assertIn("organization_id", source)
                self.assertIn("user_id", source)
                self.assertIn("operator_id", source)
                self.assertIn("operator_type", source)
                self.assertIn("idempotency_key", source)
                self.assertIn("request_id", source)

    def test_app_api_key_creation_uses_signed_trusted_subject_boundary(self) -> None:
        service = ROOT / "services" / "sdkwork-claw-app-api" / "src" / "lib.rs"
        service_source = service.read_text(encoding="utf-8")
        route_test = ROOT / "services" / "sdkwork-claw-app-api" / "tests" / "api_key_route.rs"
        route_test_source = route_test.read_text(encoding="utf-8")
        http_auth = ROOT / "crates" / "sdkwork-claw-http" / "src" / "auth.rs"
        http_auth_source = http_auth.read_text(encoding="utf-8")
        config_lib = ROOT / "crates" / "sdkwork-claw-config" / "src" / "lib.rs"
        config_source = config_lib.read_text(encoding="utf-8")

        self.assertIn("TrustedSubjectConfig", config_source)
        self.assertIn("TrustedSubjectConfig", service_source)
        self.assertIn("AppSubjectBoundaryConfig", service_source)
        self.assertIn("app_request_subject_boundary", service_source)
        self.assertIn("from_fn_with_state", service_source)
        self.assertIn("trusted_request_subject_boundary", http_auth_source)
        self.assertIn("sign_trusted_request_subject", http_auth_source)
        self.assertIn("inject_verified_trusted_request_subject", http_auth_source)
        self.assertIn("signed_subject_headers", route_test_source)
        self.assertIn("app_api_key_create_rejects_direct_trusted_subject_headers", route_test_source)
        self.assertNotIn('header("x-sdkwork-tenant-id", "10")', route_test_source)

    def test_app_api_key_creation_accepts_app_session_boundary_not_frontend_tenant_claims(self) -> None:
        config_lib = ROOT / "crates" / "sdkwork-claw-config" / "src" / "lib.rs"
        config_source = config_lib.read_text(encoding="utf-8")
        http_auth = ROOT / "crates" / "sdkwork-claw-http" / "src" / "auth.rs"
        http_auth_source = http_auth.read_text(encoding="utf-8")
        service = ROOT / "services" / "sdkwork-claw-app-api" / "src" / "lib.rs"
        service_source = service.read_text(encoding="utf-8")
        route_test = ROOT / "services" / "sdkwork-claw-app-api" / "tests" / "api_key_route.rs"
        route_test_source = route_test.read_text(encoding="utf-8")
        sdk_clients = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-commons"
            / "src"
            / "sdk-clients.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("AppSessionConfig", config_source)
        self.assertIn("AppSubjectBoundaryConfig", http_auth_source)
        self.assertIn("sign_app_session_token", http_auth_source)
        self.assertIn("verify_app_session_token", http_auth_source)
        self.assertIn("parse_app_session_authorization_bearer", http_auth_source)
        self.assertIn("app_request_subject_boundary", http_auth_source)
        self.assertIn("split_whitespace()", http_auth_source)
        self.assertIn('eq_ignore_ascii_case("bearer")', http_auth_source)
        self.assertIn("headers.remove(AUTHORIZATION);", http_auth_source)
        self.assertIn("AppSessionConfig", service_source)
        self.assertIn("app_request_subject_boundary", service_source)
        self.assertIn("session_authorization_header", route_test_source)
        self.assertIn("app_api_key_create_accepts_app_session_token_subject", route_test_source)
        self.assertNotIn("tenantId?:", sdk_clients)
        self.assertNotIn("organizationId?:", sdk_clients)
        self.assertNotIn("tenantId: options.tenantId", sdk_clients)
        self.assertNotIn("organizationId: options.organizationId", sdk_clients)


if __name__ == "__main__":
    unittest.main()
