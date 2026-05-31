import json
import re
import unittest
from pathlib import Path

try:
    import yaml
except ImportError:  # pragma: no cover
    yaml = None

from tools.schema_registry_loader import load_schema_registry, render_schema_registry


ROOT = Path(__file__).resolve().parents[1]
REGISTRY_PATH = ROOT / "docs" / "schema-registry" / "sdkwork-claw-router.tables.yaml"
GENERATED_SCHEMA_PATH = ROOT / "generated" / "schema" / "postgres" / "schema.sql"
BACKEND_OPENAPI_PATH = ROOT / "generated" / "openapi" / "clawrouter-backend-openapi.json"
APP_OPENAPI_PATH = ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json"
SCHEMA_COMPONENTS_PATH = ROOT / "generated" / "openapi" / "schema-components.yaml"
API_MANIFEST_PATH = ROOT / "generated" / "api" / "api-contract-manifest.json"
RUST_DOMAIN_PATH = ROOT / "generated" / "types" / "rust" / "domain.rs"
JAVA_BILLING_METER_PATH = ROOT / "generated" / "types" / "java" / "com" / "sdkwork" / "claw" / "router" / "domain" / "enums" / "BillingMeter.java"
TS_DOMAIN_PATH = ROOT / "generated" / "types" / "typescript" / "domain-types.ts"
RUST_TEST_SUPPORT_PATH = ROOT / "crates" / "sdkwork-claw-test-support" / "src" / "lib.rs"
RUST_INSTALLER_PATH = ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "installer.rs"
RUST_INSTALLER_CLI_PATH = ROOT / "services" / "sdkwork-claw-installer" / "src" / "main.rs"
AI_CHANNEL_ROUTE_CONTRACT_PATHS = (
    ROOT / "docs" / "schema-registry" / "frontend-field-contracts" / "models" / "admin-channel.yaml",
    ROOT / "docs" / "schema-registry" / "frontend-field-contracts" / "models" / "admin-group.yaml",
    ROOT / "docs" / "schema-registry" / "frontend-field-contracts" / "models" / "console-api-keys.yaml",
    ROOT / "docs" / "schema-registry" / "frontend-field-contracts" / "operations" / "app-ai.yaml",
    ROOT / "docs" / "schema-registry" / "frontend-field-contracts" / "operations" / "app-iam.yaml",
    ROOT / "docs" / "schema-registry" / "frontend-field-contracts" / "operations" / "backend-ai.yaml",
    ROOT / "docs" / "schema-registry" / "frontend-field-contracts" / "operations" / "backend-integration.yaml",
    ROOT / "docs" / "schema-registry" / "frontend-field-contracts" / "operations" / "backend-router.yaml",
    ROOT / "docs" / "schema-registry" / "frontend-route-classification.yaml",
    ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "queries" / "snapshot.rs",
    ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "queries" / "lookup.rs",
    ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "sqlite" / "queries.rs",
    ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "postgres" / "app_routing_read_store.rs",
    ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "sqlite" / "app_routing_read_store.rs",
    ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "postgres" / "admin_access_group_store.rs",
    ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "sqlite" / "admin_access_group_store.rs",
    ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "postgres" / "admin_channel_store.rs",
    ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "sqlite" / "admin_channel_store.rs",
    ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "postgres" / "admin_ai_resource_store.rs",
    ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "sqlite" / "admin_ai_resource_store.rs",
    ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "postgres" / "admin_channel_endpoint_store.rs",
    ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "sqlite" / "admin_channel_endpoint_store.rs",
)
AI_CHANNEL_ROUTE_REQUIRED_TABLES = (
    "ai_provider",
    "ai_channel",
    "ai_channel_vendor",
    "ai_channel_endpoint",
    "ai_channel_resource",
    "ai_channel_group",
    "ai_channel_group_member",
    "ai_channel_group_resource",
    "ai_channel_group_metric_snapshot",
    "ai_route_candidate",
    "ai_resource",
    "ai_resource_group",
    "ai_resource_group_item",
)
RUNTIME_MODEL_IDENTITY_FIXTURE_PATHS = (
    ROOT / "services" / "sdkwork-claw-product" / "tests" / "openai_chat_adapter_api.rs",
    ROOT / "services" / "sdkwork-claw-product" / "tests" / "openai_embeddings_adapter_api.rs",
    ROOT / "services" / "sdkwork-claw-product" / "tests" / "openai_responses_adapter_api.rs",
    ROOT / "services" / "sdkwork-claw-product" / "tests" / "sqlite_admin_access_group_store.rs",
    ROOT / "services" / "sdkwork-claw-product" / "tests" / "sqlite_openai_invocation_telemetry.rs",
)
AI_CHANNEL_ROUTE_RUNTIME_ROOTS = (
    ROOT / "services" / "sdkwork-claw-product" / "src",
    ROOT / "services" / "sdkwork-claw-gateway" / "src",
    ROOT / "services" / "sdkwork-claw-app-api" / "src",
)
SERVER_RESOURCES = ROOT.parents[1] / "spring-ai-plus-server-application" / "src" / "main" / "resources"
POSTGRES_MIGRATION_DIR = SERVER_RESOURCES / "database" / "postgresql"
DATA_DIR = SERVER_RESOURCES / "data"
BOOTSTRAP_DIR = DATA_DIR / "bootstrap"
FRONTEND_GENERATED_DIR = ROOT / "generated" / "schema" / "frontend"

SYSTEM_TABLES = {
    "system_installation_state",
    "system_schema_migration",
}

CANONICAL_TABLES = {
    "ai_provider",
    "ai_channel",
    "ai_channel_vendor",
    "ai_channel_endpoint",
    "ai_channel_resource",
    "ai_channel_group",
    "ai_channel_group_member",
    "ai_channel_group_resource",
    "ai_channel_group_metric_snapshot",
    "ai_route_candidate",
    "ai_model_vendor",
    "ai_modality",
    "ai_api_endpoint",
    "ai_vendor_modality",
    "ai_vendor_api_endpoint",
    "ai_modality_api_endpoint",
    "ai_model_family",
    "ai_model",
    "ai_model_capability",
    "ai_model_modality",
    "ai_model_api_endpoint",
    "ai_resource",
    "ai_resource_group",
    "ai_resource_group_item",
    "ai_model_catalog_source",
    "ai_model_catalog_sync_run",
    "ai_billing_meter",
    "ai_model_pricing",
    "ai_pricing_plan",
    "ai_pricing_plan_binding",
    "ai_pricing_rule",
    "ai_pricing_tier",
    "ai_pricing_import_snapshot",
    "ai_model_rank_snapshot",
}

CANONICAL_TABLE_PROFILES = {
    "ai_provider": "tenant_entity",
    "ai_channel": "tenant_entity",
    "ai_channel_vendor": "tenant_entity",
    "ai_channel_endpoint": "tenant_entity",
    "ai_channel_resource": "tenant_entity",
    "ai_channel_group": "tenant_entity",
    "ai_channel_group_member": "tenant_entity",
    "ai_channel_group_resource": "tenant_entity",
    "ai_channel_group_metric_snapshot": "projection",
    "ai_route_candidate": "projection",
    "ai_model_vendor": "tenant_entity",
    "ai_modality": "tenant_entity",
    "ai_api_endpoint": "tenant_entity",
    "ai_vendor_modality": "tenant_entity",
    "ai_vendor_api_endpoint": "tenant_entity",
    "ai_modality_api_endpoint": "tenant_entity",
    "ai_model_family": "tenant_entity",
    "ai_model": "tenant_entity",
    "ai_model_capability": "tenant_entity",
    "ai_model_modality": "tenant_entity",
    "ai_model_api_endpoint": "tenant_entity",
    "ai_resource": "tenant_entity",
    "ai_resource_group": "tenant_entity",
    "ai_resource_group_item": "tenant_entity",
    "ai_model_catalog_source": "tenant_entity",
    "ai_model_catalog_sync_run": "event_log",
    "ai_billing_meter": "tenant_entity",
    "ai_model_pricing": "tenant_entity",
    "ai_pricing_plan": "tenant_entity",
    "ai_pricing_plan_binding": "tenant_entity",
    "ai_pricing_rule": "tenant_entity",
    "ai_pricing_tier": "tenant_entity",
    "ai_pricing_import_snapshot": "event_log",
    "ai_model_rank_snapshot": "projection",
}

FINANCIAL_TABLES = {
    "ai_model_pricing",
    "ai_pricing_plan",
    "ai_pricing_plan_binding",
    "ai_pricing_rule",
    "ai_pricing_tier",
}

REQUIRED_PROFILE_COLUMNS = {
    "tenant_entity": {
        "id",
        "uuid",
        "tenant_id",
        "organization_id",
        "data_scope",
        "status",
        "created_at",
        "updated_at",
        "version",
        "deleted_at",
        "deleted_by",
        "metadata",
    },
    "event_log": {
        "id",
        "uuid",
        "tenant_id",
        "organization_id",
        "request_id",
        "trace_id",
        "payload_hash",
        "status",
        "created_at",
        "retention_until",
        "legal_hold",
        "metadata",
    },
    "projection": {
        "id",
        "uuid",
        "tenant_id",
        "organization_id",
        "source_type",
        "source_id",
        "source_version",
        "status",
        "created_at",
        "updated_at",
        "rebuild_version",
        "metadata",
    },
}

BASE_DATABASE_SPEC_COLUMNS = {
    "id",
    "uuid",
    "tenant_id",
    "organization_id",
    "status",
    "created_at",
    "metadata",
}

REQUIRED_BILLING_METERS = {
    "llm_input_token",
    "llm_output_token",
    "llm_reasoning_token",
    "llm_cache_write_token",
    "llm_cache_read_token",
    "llm_cache_storage_token_hour",
    "embedding_input_token",
    "embedding_image",
    "image_input_token",
    "image_output_token",
    "image_result",
    "image_pixel",
    "image_megapixel",
    "audio_input_second",
    "audio_output_second",
    "audio_input_minute",
    "audio_output_minute",
    "tts_input_character",
    "speech_character",
    "stt_audio_minute",
    "video_input_second",
    "video_output_second",
    "video_result",
    "music_output_second",
    "sfx_result",
    "rerank_search",
    "rerank_document",
    "api_request",
    "api_result",
    "api_item",
    "tool_call",
    "web_search_call",
    "file_search_call",
    "code_interpreter_session",
    "container_session",
    "storage_gb_day",
    "bandwidth_gb",
    "unknown",
}

FORBIDDEN_MODEL_VENDOR_CODES = {
    "alibaba_qwen",
    "alibaba_qwen_cn",
    "alibaba_cn",
    "baidu_cn",
    "baidu_qianfan",
    "baidu_qianfan_cn",
    "bytedance_cn",
    "bytedance_global",
    "bytedance_seed",
    "bytedance_seed_global",
    "bytedance_volcengine_cn",
    "cohere",
    "deepseek_cn",
    "deepseek_global",
    "kuaishou_cn",
    "kuaishou_global",
    "kuaishou_kling",
    "kuaishou_kling_global",
    "meta",
    "minimax_cn",
    "minimax_global",
    "mistral",
    "moonshot_cn",
    "moonshot_global",
    "open_source",
    "tencent_cn",
    "tencent_hunyuan",
    "tencent_hunyuan_cn",
    "zero_one_ai",
    "zhipu_cn",
    "zhipu_bigmodel",
    "zhipu_bigmodel_cn",
}

REQUIRED_MODEL_VENDOR_CODES = {
    "alibaba",
    "anthropic",
    "baidu",
    "black_forest_labs",
    "bytedance",
    "deepseek",
    "elevenlabs",
    "google",
    "kuaishou",
    "minimax",
    "moonshot",
    "openai",
    "stability_ai",
    "suno",
    "tencent",
    "xai",
    "zhipu",
    "custom",
    "unknown",
}

REQUIRED_MODEL_REGION_CODES = {
    "global",
    "cn",
}

LEGACY_MODEL_PATTERNS = (
    "plus_ai_model_info",
    "plus_ai_model_price",
    "plus_ai_model_availability",
    "plus_ai_model_compliance_profile",
    "plus_ai_model_price_metric",
    "plus_ai_model_taxonomy",
    "plus_ai_model_taxonomy_rel",
    "plus_ai_tenant_model_policy",
    "PlusAiModelInfo",
    "PlusAiModelPrice",
    "PlusAiModelAvailability",
    "PlusAiModelComplianceProfile",
    "PlusAiModelPriceMetric",
    "PlusAiModelTaxonomy",
    "PlusAiTenantModelPolicy",
)

LEGACY_GATEWAY_MODEL_TABLE = "ai_gateway_model"
LEGACY_GATEWAY_MODEL_TYPE_PATTERNS = (
    "GatewayModel",
    "AiGatewayModel",
    "AdminGatewayModel",
    "ai-gateway-model",
    "admin-gateway-model",
)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def load_registry() -> dict:
    if yaml is None:
        raise RuntimeError("PyYAML is required for schema registry tests")
    return load_schema_registry(REGISTRY_PATH)


def load_generated_openapi(path: Path) -> dict:
    return json.loads(read_text(path))


def migration_text() -> str:
    return "\n".join(read_text(path) for path in sorted(POSTGRES_MIGRATION_DIR.glob("V*.sql")))


def create_table_block(sql: str, table: str) -> str:
    match = re.search(
        rf"CREATE TABLE IF NOT EXISTS\s+{re.escape(table)}\s*\((.*?)\);\s*",
        sql,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if not match:
        return ""
    return match.group(1)


class ModelCatalogStandardContractTest(unittest.TestCase):
    def test_registry_no_longer_declares_legacy_model_catalog_tables(self) -> None:
        registry = load_registry()
        registry_text = render_schema_registry(REGISTRY_PATH)

        for legacy in LEGACY_MODEL_PATTERNS:
            self.assertNotIn(legacy, registry_text)

        tables = {item["table"] for item in registry.get("tables", []) if isinstance(item, dict)}
        self.assertTrue(CANONICAL_TABLES.issubset(tables))
        self.assertNotIn(
            "ai_model_vendor_region",
            tables,
            "V2 model identity must not keep vendor-region as a model-catalog table",
        )

    def test_frontend_route_classification_does_not_use_vendor_region_table(self) -> None:
        classification_path = ROOT / "docs" / "schema-registry" / "frontend-route-classification.yaml"
        classification = yaml.safe_load(read_text(classification_path)) or {}
        stale_routes = [
            route.get("route")
            for route in classification.get("routes", [])
            if isinstance(route, dict)
            and "ai_model_vendor_region" in route.get("required_tables", [])
        ]

        self.assertEqual(
            [],
            stale_routes,
            "Frontend routes must depend on canonical vendor/model capability tables; "
            "region belongs to pricing, catalog source, and provider endpoint context.",
        )

    def test_canonical_tables_follow_database_spec_common_contract(self) -> None:
        registry = load_registry()
        tables = {
            item["table"]: item
            for item in registry.get("tables", [])
            if isinstance(item, dict) and item.get("table") in CANONICAL_TABLES
        }

        self.assertEqual(CANONICAL_TABLES, set(tables))
        for table_name, table in tables.items():
            with self.subTest(table=table_name):
                self.assertEqual("ai", table.get("domain"))
                self.assertIn(table.get("compliance_level"), {"L2", "L3"})
                if table_name in FINANCIAL_TABLES:
                    self.assertEqual("L3", table.get("compliance_level"))
                    self.assertTrue(table.get("security", {}).get("financial"))
                    self.assertTrue(table.get("security", {}).get("decimal_only"))
                self.assertEqual(CANONICAL_TABLE_PROFILES[table_name], table.get("common_columns"))

                unique_constraints = table.get("unique_constraints", [])
                uuid_unique = any(
                    isinstance(item, dict) and item.get("columns") == ["uuid"]
                    for item in unique_constraints
                )
                indexes = table.get("indexes", [])
                uuid_index_unique = any(
                    isinstance(item, dict)
                    and item.get("unique") is True
                    and item.get("columns") == ["uuid"]
                    for item in indexes
                )
                self.assertTrue(uuid_unique or uuid_index_unique, f"{table_name} must declare a unique uuid constraint")

                not_null_columns = set(table.get("not_null_columns", []))
                self.assertIn("uuid", not_null_columns)
                self.assertIn("tenant_id", not_null_columns)
                self.assertIn("organization_id", not_null_columns)
                self.assertIn("status", not_null_columns)

                if table_name == "ai_pricing_import_snapshot":
                    required_prefixes = (["tenant_id", "organization_id", "status"], ["tenant_id", "organization_id", "request_id"])
                elif table_name == "ai_model_catalog_sync_run":
                    required_prefixes = (["tenant_id", "organization_id", "status"], ["tenant_id", "organization_id", "source_code"])
                elif table_name == "ai_model_rank_snapshot":
                    required_prefixes = (["tenant_id", "organization_id", "status"], ["tenant_id", "organization_id", "source_type"])
                else:
                    required_prefixes = (["tenant_id", "organization_id", "status"],)
                tenant_leading_index = any(
                    isinstance(item, dict)
                    and any(item.get("columns", [])[:len(prefix)] == prefix for prefix in required_prefixes)
                    for item in indexes
                )
                self.assertTrue(tenant_leading_index, f"{table_name} must have a tenant-leading index")

    def test_catalog_refresh_tables_have_idempotent_source_and_run_audit_contract(self) -> None:
        registry = load_registry()
        tables = {
            item["table"]: item
            for item in registry.get("tables", [])
            if isinstance(item, dict)
        }

        source = tables.get("ai_model_catalog_source")
        self.assertIsNotNone(source)
        source_columns = set(source.get("columns", {}))
        for column in (
            "source_code",
            "vendor_code",
            "provider_code",
            "source_name",
            "source_url",
            "source_kind",
            "trust_level",
            "parser_kind",
            "refresh_interval_seconds",
            "last_observed_at",
            "last_success_at",
            "catalog_version",
            "source_hash",
        ):
            self.assertIn(column, source_columns)
        self.assertIn(
            {"name": "uk_ai_model_catalog_source_tenant_code", "columns": ["tenant_id", "organization_id", "source_code"]},
            [
                {"name": item.get("name"), "columns": item.get("columns")}
                for item in source.get("unique_constraints", [])
                if isinstance(item, dict)
            ],
        )

        sync_run = tables.get("ai_model_catalog_sync_run")
        self.assertIsNotNone(sync_run)
        sync_run_columns = set(sync_run.get("columns", {}))
        for column in (
            "source_type",
            "source_id",
            "source_version",
            "source_code",
            "vendor_code",
            "provider_code",
            "run_status",
            "started_at",
            "finished_at",
            "observed_at",
            "catalog_version",
            "source_hash",
            "observed_model_count",
            "accepted_count",
            "rejected_count",
            "change_summary",
        ):
            self.assertIn(column, sync_run_columns)

        generated_schema = read_text(GENERATED_SCHEMA_PATH)
        for table in ("ai_model_catalog_source", "ai_model_catalog_sync_run"):
            self.assertIn(f"CREATE TABLE IF NOT EXISTS {table}", generated_schema)
            self.assertIn(f"CREATE UNIQUE INDEX IF NOT EXISTS uk_{table}_uuid", generated_schema)

    def test_generated_postgres_schema_uses_database_spec_columns_and_decimal_precision(self) -> None:
        sql = read_text(GENERATED_SCHEMA_PATH)

        for table in CANONICAL_TABLES:
            with self.subTest(table=table):
                block = create_table_block(sql, table)
                self.assertTrue(block, f"{table} table must exist in generated schema")
                for column in REQUIRED_PROFILE_COLUMNS[CANONICAL_TABLE_PROFILES[table]]:
                    self.assertRegex(block, rf"\b{column}\b", f"{table} missing common column {column}")
                self.assertRegex(block, r"\buuid\s+VARCHAR\(64\)\s+NOT NULL\b")
                self.assertRegex(block, r"\btenant_id\s+BIGINT\s+NOT NULL\s+DEFAULT 0\b")
                self.assertRegex(block, r"\borganization_id\s+BIGINT\s+NOT NULL\s+DEFAULT 0\b")

        pricing_block = create_table_block(sql, "ai_model_pricing")
        forbidden_float = re.compile(r"\b(DOUBLE\s+PRECISION|REAL|FLOAT)\b", re.IGNORECASE)
        self.assertIsNone(forbidden_float.search(pricing_block))
        for column in (
            "unit_size",
            "minimum_quantity",
            "quantity_step",
            "included_quantity",
            "unit_price",
            "min_charge_amount",
            "reference_multiplier",
            "markup_amount",
        ):
            self.assertRegex(pricing_block, rf"\b{column}\s+NUMERIC\(38,\s*12\)")

    def test_installer_runtime_schema_uses_only_canonical_model_catalog_tables(self) -> None:
        sql = read_text(GENERATED_SCHEMA_PATH)

        for table in CANONICAL_TABLES:
            self.assertRegex(sql, rf"CREATE TABLE IF NOT EXISTS\s+{re.escape(table)}\b")

        for legacy in LEGACY_MODEL_PATTERNS:
            self.assertNotIn(legacy, sql)

        for table in CANONICAL_TABLES:
            with self.subTest(table=table):
                block = create_table_block(sql, table)
                self.assertTrue(block, f"{table} must be in runtime migration")
                for column in BASE_DATABASE_SPEC_COLUMNS:
                    self.assertRegex(block, rf"\b{column}\b", f"{table} missing database spec column {column}")
                self.assertRegex(block, r"\buuid\s+VARCHAR\(64\)\s+NOT NULL\b")
                self.assertRegex(block, r"\btenant_id\s+BIGINT\s+NOT NULL\s+DEFAULT 0\b")
                self.assertRegex(block, r"\borganization_id\s+BIGINT\s+NOT NULL\s+DEFAULT 0\b")

    def test_generated_openapi_and_manifest_do_not_expose_legacy_model_catalog_components(self) -> None:
        paths = [
            BACKEND_OPENAPI_PATH,
            APP_OPENAPI_PATH,
            SCHEMA_COMPONENTS_PATH,
            API_MANIFEST_PATH,
            ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "types" / "index.ts",
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "types" / "index.ts",
            ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-rust" / "generated" / "server-openapi" / "src" / "models" / "mod.rs",
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-rust" / "generated" / "server-openapi" / "src" / "models" / "mod.rs",
            ROOT
            / "sdks"
            / "clawrouter-app-sdk"
            / "clawrouter-app-sdk-python"
            / "generated"
            / "server-openapi"
            / "sdkwork_clawrouter_app_sdk"
            / "models"
            / "__init__.py",
            ROOT
            / "sdks"
            / "clawrouter-backend-sdk"
            / "clawrouter-backend-sdk-python"
            / "generated"
            / "server-openapi"
            / "sdkwork_clawrouter_backend_sdk"
            / "models"
            / "__init__.py",
        ]

        for path in paths:
            text = read_text(path)
            for legacy in LEGACY_MODEL_PATTERNS:
                self.assertNotIn(legacy, text, f"{legacy} leaked into {path}")
            for legacy in LEGACY_GATEWAY_MODEL_TYPE_PATTERNS:
                self.assertNotIn(legacy, text, f"{legacy} leaked into {path}")
            self.assertNotIn("AiModelVendorRegionRecord", text, f"legacy vendor-region model leaked into {path}")
            self.assertNotIn("ai_model_vendor_region", text, f"legacy vendor-region table leaked into {path}")

        backend_spec = load_generated_openapi(BACKEND_OPENAPI_PATH)
        app_spec = load_generated_openapi(APP_OPENAPI_PATH)
        for spec in (backend_spec, app_spec):
            schemas = spec.get("components", {}).get("schemas", {})
            self.assertIn("AiModelRecord", schemas)
            self.assertIn("AiModelPricingRecord", schemas)
            self.assertNotIn("PlusAiModelInfoRecord", schemas)
            self.assertNotIn("PlusAiModelPriceRecord", schemas)

    def test_generated_frontend_contracts_and_bootstrap_do_not_reference_gateway_model_table(self) -> None:
        paths = [
            *(FRONTEND_GENERATED_DIR.glob("*.json")),
            *(BOOTSTRAP_DIR.glob("*.json")),
        ]

        for path in paths:
            text = read_text(path)
            self.assertNotIn(LEGACY_GATEWAY_MODEL_TABLE, text, f"{LEGACY_GATEWAY_MODEL_TABLE} leaked into {path}")
            self.assertNotIn("/data/model/model_info.json", text, f"legacy model seed leaked into {path}")
            self.assertNotIn("/data/model/model_price.json", text, f"legacy model pricing seed leaked into {path}")
            self.assertNotIn("MODEL_CHANNEL_KEYS", text, f"legacy model verification leaked into {path}")
            self.assertNotIn("MODEL_PRICE_RULE_KEYS", text, f"legacy model price verification leaked into {path}")

    def test_rust_runtime_uses_ai_model_domain_name_not_gateway_model(self) -> None:
        source_roots = [
            ROOT / "services",
            ROOT / "crates",
        ]
        paths = [
            path
            for source_root in source_roots
            for path in source_root.rglob("*.rs")
            if "target" not in path.parts
        ]

        for path in paths:
            text = read_text(path)
            self.assertNotIn("GatewayModel", text, f"legacy GatewayModel domain name leaked into {path}")
            self.assertNotIn("GatewayModelRow", text, f"legacy GatewayModelRow SQL row name leaked into {path}")

    def test_runtime_sources_do_not_write_legacy_vendor_region_table(self) -> None:
        source_roots = [
            ROOT / "services",
            ROOT / "crates",
        ]
        paths = [
            path
            for source_root in source_roots
            for path in source_root.rglob("*.rs")
            if "target" not in path.parts
        ]

        for path in paths:
            text = read_text(path)
            self.assertNotIn("ai_model_vendor_region", text, f"legacy vendor-region table leaked into {path}")

    def test_ai_channel_route_contracts_use_canonical_channel_resource_tables(self) -> None:
        for path in AI_CHANNEL_ROUTE_CONTRACT_PATHS:
            with self.subTest(path=path.relative_to(ROOT)):
                self.assertTrue(path.is_file(), f"AI channel route contract path is missing: {path}")
                text = read_text(path)
                self.assertRegex(
                    text,
                    r"\b(?:ai_channel|ai_channel_group|ai_resource|ai_route_candidate)\b",
                    f"{path.relative_to(ROOT)} must reference canonical AI channel/resource route tables.",
                )

    def test_ai_channel_route_runtime_uses_channel_route_vocabulary(self) -> None:
        forbidden_fragments = (
            "account" + "_pool",
            "Account" + "Pool",
        )
        paths = [
            path
            for root in AI_CHANNEL_ROUTE_RUNTIME_ROOTS
            for path in root.rglob("*.rs")
            if "target" not in path.parts
        ]
        for path in paths:
            text = read_text(path)
            for fragment in forbidden_fragments:
                self.assertNotIn(
                    fragment,
                    text,
                    f"{fragment} leaked into {path.relative_to(ROOT)}; "
                    "AI channel routing must use channel route/group/resource vocabulary.",
                )

    def test_catalog_importers_do_not_use_region_in_model_identity_uuids(self) -> None:
        importer_paths = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "sqlite"
            / "model_catalog_import.rs",
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "postgres"
            / "model_catalog_import.rs",
        )
        for path in importer_paths:
            source = read_text(path)
            for uuid_prefix in ("sdk-model", "sdk-cap"):
                self.assertIsNone(
                    re.search(
                        rf"stable_uuid\(\s*\"{uuid_prefix}\"\s*,\s*&\[[^\]]*region_code",
                        source,
                        re.DOTALL,
                    ),
                    f"{uuid_prefix} identity UUID in {path.relative_to(ROOT)} must be vendor/model based; "
                    "region belongs to pricing, ranking, and provider endpoint resources.",
                )

    def test_project_docs_use_canonical_ai_model_name(self) -> None:
        paths = [
            path
            for path in (ROOT / "docs").rglob("*.md")
            if path.is_file()
        ]

        for path in paths:
            text = read_text(path)
            for legacy in ("ai_gateway_model", "gateway_model", "GatewayModel", "plus_ai_model"):
                self.assertNotIn(legacy, text, f"{legacy} leaked into {path}")

    def test_billing_meter_domain_types_cover_multimodal_industry_pricing(self) -> None:
        sources = {
            "java": read_text(JAVA_BILLING_METER_PATH),
            "rust": read_text(RUST_DOMAIN_PATH),
            "typescript": read_text(TS_DOMAIN_PATH),
        }

        for source_name, source in sources.items():
            with self.subTest(source=source_name):
                for meter in REQUIRED_BILLING_METERS:
                    self.assertIn(meter, source)

    def test_model_vendor_domain_types_use_unique_vendor_identity_not_region_or_product_aliases(self) -> None:
        registry = load_registry()
        values = registry["domain_names"]["model_vendor"]["builtin_values"]
        vendor_codes = {
            item.get("code")
            for item in values
            if isinstance(item, dict)
        }

        self.assertTrue(REQUIRED_MODEL_VENDOR_CODES.issubset(vendor_codes))
        self.assertTrue(FORBIDDEN_MODEL_VENDOR_CODES.isdisjoint(vendor_codes))

        generated_sources = {
            "rust": {
                f'"{match}"'
                for match in re.findall(r'"([a-z][a-z0-9_]+)"', read_text(RUST_DOMAIN_PATH))
            },
            "typescript": {
                f'"{match}"'
                for match in re.findall(r'"([a-z][a-z0-9_]+)"', read_text(TS_DOMAIN_PATH))
            },
            "openapi": {
                match
                for match in re.findall(
                    r"^\s+-\s+([a-z][a-z0-9_]+)\s*$",
                    read_text(ROOT / "generated" / "types" / "openapi" / "domain-types.yaml"),
                    flags=re.MULTILINE,
                )
            },
        }
        for source_name, tokens in generated_sources.items():
            with self.subTest(source=source_name):
                for vendor_code in REQUIRED_MODEL_VENDOR_CODES:
                    expected = f'"{vendor_code}"' if source_name in {"rust", "typescript"} else vendor_code
                    self.assertIn(expected, tokens)
                for vendor_code in FORBIDDEN_MODEL_VENDOR_CODES:
                    forbidden = f'"{vendor_code}"' if source_name in {"rust", "typescript"} else vendor_code
                    self.assertNotIn(forbidden, tokens)

    def test_model_catalog_uses_vendor_model_identity_and_region_only_for_supply_context(self) -> None:
        registry = load_registry()
        tables = {item["table"]: item for item in registry.get("tables", []) if isinstance(item, dict)}
        ai_model = tables["ai_model"]
        ai_model_pricing = tables["ai_model_pricing"]
        ai_model_rank_snapshot = tables["ai_model_rank_snapshot"]
        ai_model_family = tables["ai_model_family"]

        ai_model_capability = tables["ai_model_capability"]
        self.assertNotIn("ai_model_vendor_region", tables)
        for table in (ai_model_family, ai_model, ai_model_capability):
            with self.subTest(table=table["table"]):
                self.assertNotIn("region_code", table.get("columns", {}))
                self.assertNotIn("region_code", table.get("required_columns", []))
                self.assertNotIn("region_code", table.get("not_null_columns", []))

        self.assertEqual(
            ["tenant_id", "organization_id", "vendor_code", "family_code"],
            next(
                item.get("columns")
                for item in ai_model_family.get("unique_constraints", [])
                if item.get("name") == "uk_ai_model_family_tenant_vendor_code"
            ),
        )
        self.assertEqual(
            ["tenant_id", "organization_id", "catalog_key"],
            next(
                item.get("columns")
                for item in ai_model.get("unique_constraints", [])
                if item.get("name") == "uk_ai_model_tenant_catalog_key"
            ),
        )

        self.assertIn("region_code", ai_model_pricing.get("columns", {}))
        self.assertIn("region_code", ai_model_pricing.get("required_columns", []))
        self.assertIn("region_code", ai_model_pricing.get("not_null_columns", []))
        for column in ("provider_code", "channel_id"):
            self.assertIn(column, ai_model_pricing.get("columns", {}))
        self.assertEqual(
            [
                "tenant_id",
                "organization_id",
                "snapshot_date",
                "snapshot_period",
                "rank_scope",
                "vendor_code",
                "region_code",
                "catalog_key",
            ],
            next(
                item.get("columns")
                for item in ai_model_rank_snapshot.get("unique_constraints", [])
                if item.get("name") == "uk_ai_model_rank_snapshot_scope_catalog_key"
            ),
        )

        model_indexes = {
            item["name"]: item.get("columns", [])
            for item in ai_model.get("indexes", [])
            if isinstance(item, dict)
        }
        capability_indexes = {
            item["name"]: item.get("columns", [])
            for item in ai_model_capability.get("indexes", [])
            if isinstance(item, dict)
        }
        self.assertNotIn("idx_ai_model_vendor_region_status", model_indexes)
        self.assertNotIn("idx_ai_model_capability_vendor_region_capability", capability_indexes)
        self.assertNotIn("region_code", model_indexes["idx_ai_model_vendor_status"])
        self.assertNotIn("region_code", model_indexes["idx_ai_model_catalog_search"])

        capability_tables = {
            "ai_provider",
            "ai_channel",
            "ai_channel_vendor",
            "ai_channel_endpoint",
            "ai_channel_resource",
            "ai_channel_group",
            "ai_channel_group_member",
            "ai_channel_group_resource",
            "ai_route_candidate",
            "ai_modality",
            "ai_api_endpoint",
            "ai_vendor_modality",
            "ai_vendor_api_endpoint",
            "ai_modality_api_endpoint",
            "ai_model_modality",
            "ai_model_api_endpoint",
            "ai_resource",
            "ai_resource_group",
            "ai_resource_group_item",
        }
        self.assertTrue(capability_tables.issubset(tables))

        self.assertTrue(
            set(AI_CHANNEL_ROUTE_REQUIRED_TABLES).issubset(tables),
            "AI routing schema must expose the canonical channel/resource/group route table set.",
        )

        channel = tables["ai_channel"]
        for column in (
            "channel_code",
            "channel_name",
            "channel_type",
            "provider_code",
            "protocol_code",
            "credential_ref",
            "base_url",
            "health_status",
        ):
            self.assertIn(column, channel.get("columns", {}))

        channel_group = tables["ai_channel_group"]
        for column in ("group_code", "group_name", "group_type", "routing_policy_id", "pricing_plan_code"):
            self.assertIn(column, channel_group.get("columns", {}))

        group_member = tables["ai_channel_group_member"]
        for column in ("channel_group_id", "channel_id", "priority", "weight", "effective_from", "effective_to"):
            self.assertIn(column, group_member.get("columns", {}))

        group_resource = tables["ai_channel_group_resource"]
        for column in ("channel_group_id", "resource_id", "resource_group_id", "grant_type", "priority"):
            self.assertIn(column, group_resource.get("columns", {}))

        resource = tables["ai_resource"]
        for column in (
            "resource_code",
            "resource_type",
            "vendor_code",
            "modality_code",
            "api_code",
            "model_code",
            "catalog_key",
            "provider_native_model",
        ):
            self.assertIn(column, resource.get("columns", {}))
        self.assertIn(
            {"name": "uk_ai_resource_tenant_code", "columns": ["tenant_id", "organization_id", "resource_code"]},
            [
                {"name": item.get("name"), "columns": item.get("columns")}
                for item in resource.get("unique_constraints", [])
                if isinstance(item, dict)
            ],
        )

        resource_group = tables["ai_resource_group"]
        for column in ("group_code", "group_name", "group_type", "selection_mode"):
            self.assertIn(column, resource_group.get("columns", {}))

        resource_group_item = tables["ai_resource_group_item"]
        for column in ("resource_group_id", "item_type", "resource_id", "child_resource_group_id", "item_role"):
            self.assertIn(column, resource_group_item.get("columns", {}))

        route_candidate = tables["ai_route_candidate"]
        for column in (
            "channel_group_id",
            "channel_id",
            "provider_code",
            "channel_type",
            "vendor_code",
            "api_code",
            "model_code",
            "catalog_key",
            "region_code",
            "endpoint_id",
            "health_status",
            "config_version",
        ):
            self.assertIn(column, route_candidate.get("columns", {}))

        sdkwork_models_root = ROOT / "data" / "sdkwork-models" / "models"
        self.assertTrue((sdkwork_models_root / "minimax" / "cn" / "vendor.json").is_file())
        self.assertTrue((sdkwork_models_root / "minimax" / "global" / "vendor.json").is_file())
        self.assertFalse((sdkwork_models_root / "minimax_cn").exists())
        self.assertFalse((sdkwork_models_root / "minimax_global").exists())

        for vendor_dir in sdkwork_models_root.iterdir():
            if not vendor_dir.is_dir():
                continue
            if (vendor_dir / "vendor.json").exists():
                self.fail(f"{vendor_dir.name} must use models/<vendorCode>/<regionCode>/vendor.json")
            for region_dir in vendor_dir.iterdir():
                if not region_dir.is_dir():
                    continue
                vendor_file = region_dir / "vendor.json"
                if not vendor_file.exists():
                    continue
                vendor_payload = json.loads(read_text(vendor_file))
                self.assertEqual(vendor_dir.name, vendor_payload.get("vendorCode"))
                self.assertEqual(region_dir.name, vendor_payload.get("regionCode"))
                self.assertNotRegex(vendor_payload["vendorCode"], r"_(cn|global)$")
                self.assertIn(vendor_payload["regionCode"], REQUIRED_MODEL_REGION_CODES | {"us", "eu", "apac"})
                for model_file in (region_dir / "models").glob("*.json"):
                    model_payload = json.loads(read_text(model_file))
                    expected_catalog_key = f"{vendor_dir.name}/{model_payload['modelId']}"
                    self.assertEqual(vendor_dir.name, model_payload.get("vendorCode"))
                    self.assertEqual(region_dir.name, model_payload.get("regionCode"))
                    self.assertEqual(
                        expected_catalog_key,
                        model_payload.get("catalogKey"),
                        f"{model_file.relative_to(ROOT)} must use vendor/model as model identity; "
                        "regionCode is a separate deployment/pricing dimension.",
                    )
                for pricing_file in (region_dir / "pricing").glob("*.json"):
                    pricing_payload = json.loads(read_text(pricing_file))
                    expected_catalog_key = f"{vendor_dir.name}/{pricing_payload['modelId']}"
                    self.assertEqual(vendor_dir.name, pricing_payload.get("vendorCode"))
                    self.assertEqual(region_dir.name, pricing_payload.get("regionCode"))
                    self.assertEqual(
                        expected_catalog_key,
                        pricing_payload.get("catalogKey"),
                        f"{pricing_file.relative_to(ROOT)} must use vendor/model as pricing subject; "
                        "regionCode remains the regional price dimension.",
                    )
                rankings_file = region_dir / "rankings.json"
                if rankings_file.exists():
                    rankings_payload = json.loads(read_text(rankings_file))
                    for snapshot in rankings_payload.get("snapshots", []):
                        for item in snapshot.get("items", []):
                            expected_catalog_key = f"{vendor_dir.name}/{item['modelId']}"
                            self.assertEqual(
                                expected_catalog_key,
                                item.get("catalogKey"),
                                f"{rankings_file.relative_to(ROOT)} must use vendor/model ranking identity; "
                                "regionCode remains the regional ranking context.",
                            )

        importer_source = read_text(
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "model_catalog_import.rs"
        )
        self.assertNotIn(
            "format!(\"{vendor_code}/{region_code}/{model_id}\")",
            importer_source,
            "Catalog import must not encode region into ai_model_pricing or ai_model_rank_snapshot catalog_key.",
        )

    def test_runtime_model_identity_fixtures_do_not_use_regional_catalog_keys(self) -> None:
        regional_catalog_key = r"openai/global/(?:gpt-4o-mini|text-embedding-3-small|gpt-4\.1-mini|gpt-5\.5)"
        runtime_field_patterns = (
            re.compile(rf"catalog_key:\s*\"{regional_catalog_key}\""),
            re.compile(rf"provider_model:\s*\"{regional_catalog_key}\""),
            re.compile(rf"model_scope:\s*vec!\[\s*\"{regional_catalog_key}\""),
            re.compile(rf"catalogKey\\\":\\\"{regional_catalog_key}"),
            re.compile(rf"ModelProviderRoute::new_for_catalog_key\(\s*\"{regional_catalog_key}", re.DOTALL),
            re.compile(rf"OpenAiProviderRoute\s*\{{[^}}]*catalog_key:\s*\"{regional_catalog_key}", re.DOTALL),
        )
        offenders = []
        for path in RUNTIME_MODEL_IDENTITY_FIXTURE_PATHS:
            text = read_text(path)
            for pattern in runtime_field_patterns:
                for match in pattern.finditer(text):
                    line_no = text.count("\n", 0, match.start()) + 1
                    line = text.splitlines()[line_no - 1].strip()
                    offenders.append(f"{path.relative_to(ROOT)}:{line_no}: {line}")
        self.assertEqual(
            [],
            offenders,
            "Runtime routing, access-group, and telemetry fixtures must use vendor/model catalog keys; region belongs only to pricing/ranking/supply data.",
        )

    def test_rust_test_support_uses_canonical_model_catalog_schema(self) -> None:
        source = read_text(RUST_TEST_SUPPORT_PATH)

        for table in CANONICAL_TABLES:
            self.assertIn(f"CREATE TABLE {table}", source)
        for legacy in LEGACY_MODEL_PATTERNS:
            self.assertNotIn(legacy, source)
        for meter in REQUIRED_BILLING_METERS - {"unknown"}:
            self.assertIn(meter, source)
        regional_catalog_key = re.compile(r"openai/global/(?:gpt-4o-mini|text-embedding-3-small)")
        offenders = []
        for match in regional_catalog_key.finditer(source):
            line_no = source.count("\n", 0, match.start()) + 1
            line = source.splitlines()[line_no - 1].strip()
            offenders.append(f"{RUST_TEST_SUPPORT_PATH.relative_to(ROOT)}:{line_no}: {line}")
        self.assertEqual(
            [],
            offenders,
            "Shared Rust test support seed data must use vendor/model catalog keys; "
            "region_code columns keep regional pricing and ranking context.",
        )

    def test_environment_seed_data_replaces_legacy_model_files(self) -> None:
        self.assertFalse((DATA_DIR / "model" / "model_info.json").exists())
        self.assertFalse((DATA_DIR / "model" / "model_price.json").exists())

        catalog_dir = DATA_DIR / "model-catalog"
        expected_profiles = {
            "test": catalog_dir / "model-catalog-test.json",
            "dev": catalog_dir / "model-catalog-dev.json",
            "prod": catalog_dir / "model-catalog-prod.json",
            "demo": catalog_dir / "model-catalog-demo.json",
        }
        for profile, path in expected_profiles.items():
            with self.subTest(profile=profile):
                self.assertTrue(path.exists(), f"{profile} model catalog seed file is missing")
                payload = json.loads(read_text(path))
                self.assertEqual(profile, payload.get("profile"))
                self.assertIn("schemaVersion", payload)
                self.assertTrue(payload.get("meters"), f"{profile} seed must include meters")
                self.assertTrue(payload.get("vendors"), f"{profile} seed must include vendors")
                self.assertTrue(payload.get("models"), f"{profile} seed must include models")
                self.assertTrue(payload.get("prices"), f"{profile} seed must include prices")
                for price in payload.get("prices", []):
                    self.assertIsInstance(price.get("unitPrice"), str)
                    self.assertRegex(price.get("unitPrice", ""), r"^\d+(\.\d+)?$")
                    self.assertTrue(price.get("sourceUrl"))
                    self.assertTrue(price.get("observedAt"))

        dev_payload = json.loads(read_text(expected_profiles["dev"]))
        self.assertTrue(
            any(model.get("releaseStage") == "retired" or model.get("routingState") == "disabled" for model in dev_payload.get("models", [])),
            "dev seed must include retired or disabled model examples",
        )
        self.assertTrue(
            any("image" in model.get("modalities", {}).get("input", []) or "video" in model.get("modalities", {}).get("output", []) for model in dev_payload.get("models", [])),
            "dev seed must include multimodal model examples",
        )

    def test_rust_database_installer_has_explicit_install_state_and_cli(self) -> None:
        installer_source = read_text(RUST_INSTALLER_PATH)
        cli_source = read_text(RUST_INSTALLER_CLI_PATH)
        registry_source = render_schema_registry(REGISTRY_PATH)
        generated_schema = read_text(GENERATED_SCHEMA_PATH)

        for required in (
            "system_installation_state",
            "system_schema_migration",
            "InstallationStatus",
            "ensure_installed",
            "CURRENT_SCHEMA_VERSION",
            "ENV_INSTALL_ENVIRONMENT",
            "ENV_INSTALL_SEED_PROFILE",
            "ENV_MODELS_CATALOG_ROOT",
            "DatabaseInstallOptions",
            "CatalogRefreshOptions",
            "refresh_catalog",
            "NotInstalled",
            "UpgradeRequired",
            "Corrupt",
            "load_install_model_catalog",
            "catalog_completeness_spec",
            "sdkwork_models_catalog_complete",
            "generated_schema_table_names",
            "last_catalog_refresh_status().await?",
            "sqlite_last_catalog_refresh_status",
            "postgres_last_catalog_refresh_status",
            "catalog_refresh_status_code",
            "catalog_refresh_metadata_is_dry_run",
            "record_failed_catalog_refresh",
            "try_record_failed_catalog_refresh",
            "sqlite_record_failed_catalog_refresh",
            "postgres_record_failed_catalog_refresh",
            "failed_catalog_refresh_row",
            "CATALOG_REFRESH_SEQUENCE",
            "catalog_refresh_id_with_entropy",
            "error_message_masked",
            "last_catalog_refresh_status",
            '"not_run"',
            '"success"',
            '"dry_run"',
            '"failed"',
        ):
            self.assertIn(required, installer_source)

        self.assertNotIn("CURRENT_CATALOG_VERSION", installer_source)
        self.assertNotIn("MIN_SDKWORK_MODELS_", installer_source)
        self.assertNotIn('"succeeded"', installer_source)
        self.assertNotIn('last_catalog_refresh_status: "not_run".to_owned()', installer_source)
        self.assertIn("Some(loaded_catalog_version)", installer_source)
        self.assertIn("let audit_options = options.clone();", installer_source)
        self.assertIn("&audit_options", installer_source)
        self.assertIn("options.catalog_version.as_deref()", installer_source)
        self.assertIn(".sync_catalog(command.clone())", installer_source)
        self.assertIn("return Err(error);", installer_source)
        self.assertIn("let _ = self", installer_source)
        self.assertIn(".record_failed_catalog_refresh(options, catalog_root, catalog_version, error)", installer_source)
        self.assertEqual(
            2,
            installer_source.count("ORDER BY started_at DESC, id DESC"),
            "SQLite and Postgres refresh status queries must order by timestamp and id for deterministic latest status",
        )
        self.assertRegex(
            installer_source,
            r"CATALOG_REFRESH_SEQUENCE\.fetch_add\(1,\s*Ordering::Relaxed\)",
        )
        self.assertRegex(
            installer_source,
            r"Err\(error\)\s*=>\s*\{\s*self\.try_record_failed_catalog_refresh\(",
        )
        self.assertNotIn("'ai_model_catalog_source'", installer_source)
        self.assertNotIn("'ai_model_catalog_sync_run'", installer_source)
        self.assertNotIn("COUNT(1)\n        FROM sqlite_master\n        WHERE type = 'table'\n          AND name IN", installer_source)
        for model_file in (ROOT / "data" / "sdkwork-models" / "models").glob("*/models/*.json"):
            model_payload = json.loads(read_text(model_file))
            model_id = model_payload.get("modelId")
            if model_id:
                self.assertNotIn(
                    model_id,
                    installer_source,
                    f"installer must load model facts from sdkwork-models, not hardcode {model_id}",
                )

        for command in ("status", "install", "upgrade", "ensure", "refresh-catalog"):
            self.assertIn(f"\"{command}\"", cli_source)
        for option in ("--vendor", "--catalog-root", "--catalog-version", "--dry-run", "--force"):
            self.assertIn(f"\"{option}\"", cli_source)
        for required in (
            "InstallationStatusOutput",
            "CatalogRefreshOutput",
            "InstallerErrorOutput",
            "InstallerCliError",
            "InstallerCommand",
            "parse_cli_command",
            "reject_extra_args",
            "installer_error_code",
            "MissingDatabaseUrl",
            "InvalidArgument",
            "normalize_refresh_token",
            "normalize_catalog_root",
            "normalize_catalog_version",
            "normalize_refresh_mode",
            "downcast_ref::<DatabaseInstallError>",
            "ExitCode",
            "print_json",
            "last_catalog_refresh_status",
        ):
            self.assertIn(required, cli_source)
        self.assertIn("serde_json::to_string", cli_source)
        self.assertLess(
            cli_source.index("let command = parse_cli_command"),
            cli_source.index("DatabaseConfig::from_env_or_initialize()"),
            "installer CLI must validate command syntax before requiring database environment",
        )
        run_body = cli_source[
            cli_source.index("async fn run()") : cli_source.index("async fn run_sqlite")
        ]
        self.assertIn("let command = parse_cli_command", run_body)
        self.assertLess(
            run_body.index("let command = parse_cli_command"),
            run_body.index("DatabaseConfig::from_env_or_initialize()"),
            "installer CLI must validate command syntax before requiring database environment",
        )
        self.assertIn(
            '"refresh-catalog" => InstallerCommand::RefreshCatalog(parse_refresh_options(args)?)',
            cli_source,
        )
        for command in ("status", "install", "upgrade", "ensure"):
            self.assertIn(
                f'reject_extra_args("{command}", args)?;',
                cli_source,
                f"{command} must reject unexpected CLI arguments before database initialization",
            )
        self.assertIn("does not accept extra arguments", cli_source)
        self.assertIn(
            'options.source =\n                    normalize_refresh_token(next_arg(&mut args, "--source")?, "source", 64)?',
            cli_source,
        )
        self.assertRegex(cli_source, r'"--catalog-root"[\s\S]*normalize_catalog_root\(next_arg\(')
        self.assertRegex(
            cli_source,
            r'"--catalog-version"[\s\S]*normalize_catalog_version\(next_arg\(',
        )
        self.assertIn(
            '{name} must contain only letters, numbers, -, and _',
            cli_source,
        )
        self.assertIn(
            "catalog version must contain only letters, numbers, ., -, and _",
            cli_source,
        )
        self.assertIn("options.vendor_codes.len() > 32", cli_source)
        self.assertIn(
            "vendor codes must contain 32 items or fewer",
            cli_source,
        )
        self.assertNotIn("std::env::args().skip(2)", cli_source)
        self.assertIn("last_catalog_refresh_status: status_report.last_catalog_refresh_status", cli_source)
        self.assertIn('"missing_database_url"', cli_source)
        self.assertIn('"invalid_argument"', cli_source)
        self.assertIn('"invalid_state"', cli_source)
        self.assertIn('"database_error"', cli_source)
        self.assertIn('"catalog_error"', cli_source)
        self.assertIn('"commerce_error"', cli_source)
        self.assertNotIn("changed={}", cli_source)
        self.assertNotIn("catalog_version={}", cli_source)

        for service_runtime in (
            ROOT / "services" / "sdkwork-claw-gateway" / "src" / "runtime.rs",
            ROOT / "services" / "sdkwork-claw-app-api" / "src" / "lib.rs",
            ROOT / "services" / "sdkwork-claw-admin-api" / "src" / "lib.rs",
        ):
            source = read_text(service_runtime)
            self.assertIn("DatabaseInstaller", source)
            self.assertIn(".with_env_options()?", source)
            self.assertIn(".ensure_installed()", source)

        workspace_launcher = read_text(ROOT / "scripts" / "dev" / "start-workspace.mjs")
        for required in (
            "DEFAULT_MODELS_CATALOG_RELATIVE_PATH",
            "defaultModelsCatalogRoot",
            "resolveModelsCatalogRoot",
            "SDKWORK_MODELS_CATALOG_ROOT",
            "settings.modelsCatalogRoot",
            "modelsCatalogRoot: settings.modelsCatalogRoot",
            "SDKWORK_MODELS_CATALOG_ROOT=${settings.modelsCatalogRoot}",
            "model-catalog-refresh",
            "'refresh-catalog'",
            "'--catalog-root'",
            "'--force'",
        ):
            self.assertIn(required, workspace_launcher)
        self.assertIn(
            "settings.modelsCatalogRoot = resolveModelsCatalogRoot(settings, workspaceRoot)",
            workspace_launcher,
        )
        self.assertLess(
            workspace_launcher.index("name: 'installer'"),
            workspace_launcher.index("name: 'model-catalog-refresh'"),
            "dev startup must install schema before refreshing model catalog data",
        )
        self.assertLess(
            workspace_launcher.index("name: 'model-catalog-refresh'"),
            workspace_launcher.index("name: 'gateway'"),
            "dev startup must refresh model catalog data before starting Rust services",
        )

        for table in SYSTEM_TABLES:
            self.assertIn(f"- table: {table}", registry_source)
            self.assertIn(f"CREATE TABLE IF NOT EXISTS {table}", generated_schema)
            self.assertRegex(
                generated_schema,
                rf"CREATE TABLE IF NOT EXISTS {table} \(\n\s+id BIGINT PRIMARY KEY,",
            )


if __name__ == "__main__":
    unittest.main()
