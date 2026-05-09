import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class ConsoleProvidersBackendRuntimeStandardTest(unittest.TestCase):
    def test_console_providers_operation_is_backed_by_real_app_api_router(self) -> None:
        product_api_mod = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "mod.rs"
        ).read_text(encoding="utf-8")
        app_api = (ROOT / "services" / "sdkwork-claw-app-api" / "src" / "lib.rs").read_text(
            encoding="utf-8"
        )
        app_providers_path = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_providers.rs"
        )

        self.assertTrue(app_providers_path.exists())
        app_providers = app_providers_path.read_text(encoding="utf-8")

        self.assertIn("mod app_providers;", product_api_mod)
        self.assertIn("app_providers_router", product_api_mod)
        self.assertIn("app_providers_router_with_read_store", product_api_mod)
        self.assertIn("/app/v3/api/router/providers", app_providers)
        self.assertIn("TrustedRequestSubject", app_providers)
        self.assertIn("require_subject", app_providers)
        self.assertIn("AppProvidersReadStore", app_providers)
        self.assertIn("EmptyAppProvidersReadStore", app_providers)
        self.assertIn('PlusApiResult::error("4010"', app_providers)
        self.assertIn("app providers read model is unavailable", app_providers)

        self.assertIn("AppProvidersReadStore", app_api)
        self.assertIn("AppProvidersStore", app_api)
        self.assertIn("SqliteAppProvidersReadStore", app_api)
        self.assertIn("PostgresAppProvidersReadStore", app_api)
        self.assertIn("app_providers_router()", app_api)
        self.assertIn("app_providers_router_with_read_store", app_api)
        self.assertIn("app_request_subject_boundary", app_api)

    def test_console_providers_port_exposes_only_safe_frontend_fields(self) -> None:
        ports_mod = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "ports" / "mod.rs"
        ).read_text(encoding="utf-8")
        port_path = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "ports"
            / "app_providers_read_store.rs"
        )

        self.assertTrue(port_path.exists())
        port = port_path.read_text(encoding="utf-8")

        self.assertIn("mod app_providers_read_store;", ports_mod)
        for export_name in [
            "AppProvidersReadFuture",
            "AppProvidersReadStore",
            "AppProvidersSubject",
            "AppProviderItem",
            "AppProvidersItems",
        ]:
            self.assertIn(export_name, ports_mod)
            self.assertIn(export_name, port)

        for field_name in [
            "id",
            "provider_family",
            "integration_type",
            "name",
            "description",
            "url",
            "status",
        ]:
            self.assertIn(field_name, port)

        self.assertNotIn("provider_type", port)
        self.assertNotIn('#[serde(rename = "type")]', port)
        self.assertIn("#[serde(rename_all = \"camelCase\")]", port)
        for secret_field in ["secret_ref", "secret_hash", "auth_config", "credential_profile"]:
            self.assertNotIn(secret_field, port)
        self.assertNotIn("mock", port.lower())

    def test_console_providers_sql_read_stores_use_real_tables_scope_and_secret_exclusions(self) -> None:
        for relative, store_name in [
            (
                "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/app_providers_read_store.rs",
                "SqliteAppProvidersReadStore",
            ),
            (
                "services/sdkwork-claw-product/src/infrastructure/sql/postgres/app_providers_read_store.rs",
                "PostgresAppProvidersReadStore",
            ),
        ]:
            store_path = ROOT / relative
            self.assertTrue(store_path.exists())
            store = store_path.read_text(encoding="utf-8")

            self.assertIn(store_name, store)
            for table in [
                "integration_provider",
                "integration_channel",
                "integration_channel_model",
                "integration_provider_account",
                "integration_proxy",
                "ops_config_snapshot",
            ]:
                self.assertIn(table, store)

            for scope_column in ["tenant_id", "organization_id", "user_id"]:
                self.assertIn(scope_column, store)

            self.assertIn("load_providers", store)
            self.assertIn("p.integration_type AS integration_type", store)
            self.assertNotIn("p.provider_type", store)
            self.assertIn("provider_family_code", store)
            self.assertIn("provider_classification::provider_family_code", store)
            self.assertIn("integration_type_code", store)
            self.assertNotIn("provider_type_label", store)
            self.assertIn("provider_status_label", store)
            self.assertIn("LIMIT", store)
            self.assertIn("SELECT", store)
            self.assertNotIn("SELECT *", store)
            for secret_field in ["secret_ref", "secret_hash", "auth_config", "credential_profile"]:
                self.assertNotIn(secret_field, store)

    def test_console_providers_read_models_reject_missing_or_unknown_status_codes(self) -> None:
        for relative in [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/app_providers_read_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/app_providers_read_store.rs",
        ]:
            store = (ROOT / relative).read_text(encoding="utf-8")
            compact_store = " ".join(store.split())

            with self.subTest(store=relative):
                for unsafe_default in [
                    "COALESCE(c.status, 0) AS channel_status",
                    "COALESCE(c.health_status, 0) AS channel_health_status",
                    "COALESCE(a.status, 1) AS account_status",
                    "COALESCE(px.status, 1) AS proxy_status",
                    "COALESCE(px.health_status, 1) AS proxy_health_status",
                    "COALESCE(p.status, 0) AS provider_status",
                ]:
                    self.assertNotIn(unsafe_default, store)

                for required_projection in [
                    "c.id AS channel_id",
                    "c.account_id AS account_id",
                    "c.proxy_id AS proxy_id",
                    "c.status AS channel_status",
                    "c.health_status AS channel_health_status",
                    "a.status AS account_status",
                    "px.status AS proxy_status",
                    "px.health_status AS proxy_health_status",
                    "p.status AS provider_status",
                    "rc.channel_id AS channel_id",
                    "rc.account_id AS account_id",
                    "rc.proxy_id AS proxy_id",
                ]:
                    self.assertIn(required_projection, store)

                self.assertNotIn(
                    'provider_status_label( integer_cell(&row, "provider_status"),',
                    compact_store,
                )
                self.assertIn('required_integer_cell(&row, "provider_status")?', compact_store)
                self.assertIn(
                    'related_integer_cell(&row, "channel_status", channel_required)?',
                    compact_store,
                )
                self.assertIn(
                    'provider_status_label( provider_status, channel_status, '
                    'channel_health_status, account_status, proxy_status, '
                    'proxy_health_status, )?',
                    compact_store,
                )
                self.assertIn("missing provider {column} from database row", store)
                self.assertIn("invalid provider {column} from database row", store)

    def test_console_providers_contract_response_schema_is_precise(self) -> None:
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")
        operation_marker = "api_path: /app/v3/api/router/providers"
        operation_index = contract.index(operation_marker)
        schema_index = contract.index("name: ProvidersResponse", operation_index)
        self.assertLess(schema_index - operation_index, 1200)

        for marker in [
            "name: ProviderConfig",
            "required: [id, providerFamily, integrationType, name, description, url, status]",
            "providerFamily: { type: string, enum: [claude, codex, gemini, opencode] }",
            "integrationType: { type: string, enum: [model_vendor_direct, cloud_platform, relay_aggregator, self_hosted_gateway, local_runtime, custom, unknown] }",
            "enum: [active, inactive]",
            "items:",
            "description: Provider public endpoint URL or safe proxy endpoint.",
        ]:
            self.assertIn(marker, contract[schema_index : schema_index + 2200])

    def test_console_providers_frontend_names_provider_family_separately_from_integration_type(self) -> None:
        provider_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-providers"
            / "src"
            / "providerService.ts"
        ).read_text(encoding="utf-8")
        providers_view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-providers"
            / "src"
            / "ProvidersView.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("export type ProviderFamily = 'claude' | 'codex' | 'gemini' | 'opencode';", provider_service)
        self.assertIn("providerFamily: ProviderFamily;", provider_service)
        self.assertIn("function readProviderFamily(item: ApiRecord): ProviderFamily", provider_service)
        self.assertIn("selectedProviderFamily", providers_view)
        self.assertIn("const matchesFamily = provider.providerFamily === selectedProviderFamily;", providers_view)
        self.assertIn("providerFamily: ProviderFamily;", providers_view)
        self.assertNotIn("export type ProviderType", provider_service)
        self.assertNotIn("type ProviderType", providers_view)
        self.assertNotIn("selectedType", providers_view)
        self.assertNotIn("matchesType", providers_view)

    def test_console_providers_generated_sdk_uses_precise_provider_item_type(self) -> None:
        openapi = (
            ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json"
        ).read_text(encoding="utf-8")
        provider_response = (
            ROOT
            / "sdks"
            / "clawrouter-app-sdk"
            / "src"
            / "types"
            / "providers-response.ts"
        ).read_text(encoding="utf-8")
        provider_config_path = (
            ROOT
            / "sdks"
            / "clawrouter-app-sdk"
            / "src"
            / "types"
            / "provider-config.ts"
        )

        self.assertIn('"ProviderConfig"', openapi)
        self.assertIn('"$ref": "#/components/schemas/ProviderConfig"', openapi)
        self.assertTrue(provider_config_path.exists())
        provider_config = provider_config_path.read_text(encoding="utf-8")
        self.assertIn("export interface ProviderConfig", provider_config)
        self.assertIn("providerFamily: 'claude' | 'codex' | 'gemini' | 'opencode';", provider_config)
        self.assertIn(
            "integrationType: 'model_vendor_direct' | 'cloud_platform' | 'relay_aggregator' | 'self_hosted_gateway' | 'local_runtime' | 'custom' | 'unknown';",
            provider_config,
        )
        self.assertIn("status: 'active' | 'inactive';", provider_config)
        self.assertIn("import type { ProviderConfig } from './provider-config';", provider_response)
        self.assertIn("items: ProviderConfig[];", provider_response)

    def test_integration_provider_database_contract_uses_integration_type_column(self) -> None:
        registry = (
            ROOT / "docs" / "schema-registry" / "sdkwork-claw-router.tables.yaml"
        ).read_text(encoding="utf-8")
        schema_sql = (
            ROOT / "generated" / "schema" / "postgres" / "schema.sql"
        ).read_text(encoding="utf-8")
        manifest = (
            ROOT / "generated" / "schema" / "manifest" / "schema-manifest.json"
        ).read_text(encoding="utf-8")

        provider_table_start = registry.index("  - table: integration_provider")
        provider_table_end = registry.index("\n  - table: integration_channel", provider_table_start)
        provider_table = registry[provider_table_start:provider_table_end]

        self.assertIn("code_column: integration_type", registry)
        self.assertIn("integration_type: enum_int32", provider_table)
        self.assertNotIn("provider_type: enum_int32", provider_table)
        self.assertIn("integration_type INTEGER", schema_sql)
        self.assertNotIn("provider_type INTEGER", schema_sql)
        self.assertIn('"name": "integration_type"', manifest)
        self.assertNotIn('"name": "provider_type"', manifest)

    def test_console_providers_ui_is_read_only_until_command_contract_exists(self) -> None:
        providers_view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-providers"
            / "src"
            / "ProvidersView.tsx"
        ).read_text(encoding="utf-8")
        provider_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-providers"
            / "src"
            / "providerService.ts"
        ).read_text(encoding="utf-8")
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")
        provider_operation_marker = (
            "  - route: /console/providers\n"
            "    source: apps/sdkwork-claw-router-portal/packages/"
            "sdkwork-claw-router-console-providers/src/providerService.ts\n"
            "    operation: fetchProviders"
        )
        provider_operation_start = contract.index(provider_operation_marker)
        next_operation_start = contract.index("\n  - route:", provider_operation_start + 1)
        provider_operation_contract = contract[provider_operation_start:next_operation_start]

        self.assertIn("ProviderService.fetchProviders()", providers_view)
        self.assertIn("readOnlyProviderActions", providers_view)
        self.assertIn("Read-only", providers_view)
        self.assertIn("BusinessStatePanel", providers_view)
        self.assertNotIn("ProviderDrawer", providers_view)
        self.assertNotIn("handleOpenAdd", providers_view)
        self.assertNotIn("handleOpenEdit", providers_view)
        self.assertNotIn("handleDuplicate", providers_view)
        self.assertNotIn("handleDelete", providers_view)
        self.assertNotIn("handleSetActive", providers_view)
        self.assertNotIn("handleDrawerSave", providers_view)
        self.assertNotIn("setProviders(current => [...current", providers_view)
        self.assertNotIn("setProviders(current => current.filter", providers_view)
        self.assertNotIn("setProviders(current => current.map", providers_view)
        for icon in ["<Plus", "<Pencil", "<FilePlus2", "<Trash2", "<Power", "<BarChart2", "<Terminal"]:
            self.assertNotIn(icon, providers_view)

        self.assertNotIn("static async createProvider", provider_service)
        self.assertNotIn("static async updateProvider", provider_service)
        self.assertNotIn("static async deleteProvider", provider_service)
        self.assertNotIn("static async setProviderStatus", provider_service)
        self.assertIn("operation: fetchProviders", provider_operation_contract)
        self.assertNotIn("operation: createProvider", provider_operation_contract)
        self.assertNotIn("operation: updateProvider", provider_operation_contract)
        self.assertNotIn("operation: deleteProvider", provider_operation_contract)
        self.assertNotIn("operation: setProviderStatus", provider_operation_contract)


if __name__ == "__main__":
    unittest.main()
