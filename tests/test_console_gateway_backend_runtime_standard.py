import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class ConsoleGatewayBackendRuntimeStandardTest(unittest.TestCase):
    def test_console_gateway_operation_is_backed_by_real_app_api_router(self) -> None:
        product_api_mod = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "mod.rs"
        ).read_text(encoding="utf-8")
        app_api = (ROOT / "services" / "sdkwork-claw-app-api" / "src" / "lib.rs").read_text(
            encoding="utf-8"
        )
        app_gateway_path = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_gateway.rs"
        )

        self.assertTrue(app_gateway_path.exists())
        app_gateway = app_gateway_path.read_text(encoding="utf-8")

        self.assertIn("mod app_gateway;", product_api_mod)
        self.assertIn("app_gateway_traces_router", product_api_mod)
        self.assertIn("app_gateway_traces_router_with_read_store", product_api_mod)
        self.assertIn("/app/v3/api/ai/gateway/traces", app_gateway)
        self.assertIn("TrustedRequestSubject", app_gateway)
        self.assertIn("require_subject", app_gateway)
        self.assertIn("AppGatewayTracesReadStore", app_gateway)
        self.assertIn("EmptyAppGatewayTracesReadStore", app_gateway)
        self.assertIn('PlusApiResult::error("4010"', app_gateway)
        self.assertIn("app gateway traces read model is unavailable", app_gateway)

        self.assertIn("AppGatewayTracesReadStore", app_api)
        self.assertIn("AppGatewayTracesStore", app_api)
        self.assertIn("SqliteAppGatewayTracesReadStore", app_api)
        self.assertIn("PostgresAppGatewayTracesReadStore", app_api)
        self.assertIn("app_gateway_traces_router()", app_api)
        self.assertIn("app_gateway_traces_router_with_read_store", app_api)
        self.assertIn("app_request_subject_boundary", app_api)

    def test_console_gateway_port_exposes_only_safe_trace_fields(self) -> None:
        ports_mod = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "ports" / "mod.rs"
        ).read_text(encoding="utf-8")
        port_path = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "ports"
            / "app_gateway_traces_read_store.rs"
        )

        self.assertTrue(port_path.exists())
        port = port_path.read_text(encoding="utf-8")

        self.assertIn("mod app_gateway_traces_read_store;", ports_mod)
        for export_name in [
            "AppGatewayTraceItem",
            "AppGatewayTraceItems",
            "AppGatewayTracesReadFuture",
            "AppGatewayTracesReadStore",
            "AppGatewayTracesSubject",
        ]:
            self.assertIn(export_name, ports_mod)
            self.assertIn(export_name, port)

        for field_name in ["id", "time", "ip", "endpoint", "method", "status", "duration", "channel"]:
            self.assertIn(field_name, port)

        self.assertIn("#[serde(rename_all = \"camelCase\")]", port)
        for sensitive_field in [
            "request_payload_hash",
            "response_payload_hash",
            "client_ip_hash",
            "user_agent_hash",
            "payload_hash",
            "metadata",
        ]:
            self.assertNotIn(sensitive_field, port)
        self.assertNotIn("mock", port.lower())

    def test_console_gateway_sql_read_stores_use_real_tables_scope_and_safe_columns(self) -> None:
        for relative, store_name in [
            (
                "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/app_gateway_traces_read_store.rs",
                "SqliteAppGatewayTracesReadStore",
            ),
            (
                "services/sdkwork-claw-product/src/infrastructure/sql/postgres/app_gateway_traces_read_store.rs",
                "PostgresAppGatewayTracesReadStore",
            ),
        ]:
            store_path = ROOT / relative
            self.assertTrue(store_path.exists())
            store = store_path.read_text(encoding="utf-8")

            self.assertIn(store_name, store)
            for table in ["ai_request_trace", "ops_gateway_instance"]:
                self.assertIn(table, store)

            for scope_column in ["tenant_id", "organization_id", "user_id"]:
                self.assertIn(scope_column, store)

            for safe_column in [
                "request_path",
                "endpoint",
                "http_method",
                "http_status",
                "latency_ms",
                "channel_name_snapshot",
                "client_ip_masked",
                "deployment_mode",
                "region",
                "node_name",
                "health_status",
                "last_heartbeat_at",
            ]:
                self.assertIn(safe_column, store)

            self.assertIn("load_gateway_traces", store)
            self.assertIn("latency_label", store)
            self.assertIn("gateway_channel_label", store)
            self.assertIn("LIMIT", store)
            self.assertIn("SELECT", store)
            self.assertNotIn("SELECT *", store)
            for sensitive_column in [
                "request_payload_hash",
                "response_payload_hash",
                "client_ip_hash",
                "user_agent_hash",
                "payload_hash",
                "metadata",
            ]:
                self.assertNotIn(sensitive_column, store)

    def test_console_gateway_read_models_reject_missing_trace_status_and_latency(self) -> None:
        for relative in [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/app_gateway_traces_read_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/app_gateway_traces_read_store.rs",
        ]:
            store = (ROOT / relative).read_text(encoding="utf-8")
            compact_store = " ".join(store.split())
            with self.subTest(store=relative):
                self.assertNotIn("COALESCE(t.http_status, 0) AS status", store)
                self.assertNotIn("COALESCE(t.latency_ms, 0) AS latency_ms", store)
                self.assertNotIn('status: integer_cell(&row, "status")', compact_store)
                self.assertNotIn(
                    'duration: latency_label(integer_cell(&row, "latency_ms"))',
                    compact_store,
                )
                self.assertIn('required_integer_cell(&row, "status")?', compact_store)
                self.assertIn('required_integer_cell(&row, "latency_ms")?', compact_store)
                self.assertIn("missing gateway trace {column} from database row", store)
                self.assertIn("invalid gateway trace status from database row", store)
                self.assertIn("invalid gateway trace latency_ms from database row", store)

    def test_console_gateway_selected_instance_health_status_fails_closed(self) -> None:
        for relative in [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/app_gateway_traces_read_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/app_gateway_traces_read_store.rs",
        ]:
            store = (ROOT / relative).read_text(encoding="utf-8")
            compact_store = " ".join(store.split())
            with self.subTest(store=relative):
                self.assertIn("id AS gateway_id", store)
                self.assertIn("CAST(cg.gateway_id AS TEXT) AS gateway_id", store)
                self.assertIn("cg.health_status AS health_status", store)
                self.assertIn("gateway_health_status(&row)?", store)
                self.assertIn("fn gateway_health_status", store)
                self.assertIn("missing gateway trace health_status from database row", store)
                self.assertIn("invalid gateway trace health_status from database row", store)
                self.assertNotIn("CASE WHEN COALESCE(health_status, 0) = 1", store)
                self.assertNotIn("COALESCE(cg.health_status, 0) AS health_status", store)
                self.assertNotIn('integer_cell(&row, "health_status")', compact_store)

    def test_console_gateway_selected_instance_deployment_mode_fails_closed(self) -> None:
        for relative in [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/app_gateway_traces_read_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/app_gateway_traces_read_store.rs",
        ]:
            store = (ROOT / relative).read_text(encoding="utf-8")
            compact_store = " ".join(store.split())
            with self.subTest(store=relative):
                self.assertIn("cg.deployment_mode AS deployment_mode", store)
                self.assertIn("gateway_deployment_mode(&row)?", store)
                self.assertIn("fn gateway_deployment_mode", store)
                self.assertIn("missing gateway trace deployment_mode from database row", store)
                self.assertIn("invalid gateway trace deployment_mode from database row", store)
                self.assertNotIn("COALESCE(cg.deployment_mode, 0) AS deployment_mode", store)
                self.assertNotIn('integer_cell(&row, "deployment_mode")', compact_store)

    def test_console_gateway_contract_response_schema_is_precise(self) -> None:
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")
        operation_marker = "api_path: /app/v3/api/ai/gateway/traces"
        operation_index = contract.index(operation_marker)
        schema_index = contract.index("name: GatewayTracesResponse", operation_index)
        self.assertLess(schema_index - operation_index, 1200)

        for marker in [
            "name: GatewayTrace",
            "items:",
            "enum: [GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD]",
            "description: Masked client IP address.",
            "description: HTTP latency display value, for example 128ms.",
        ]:
            self.assertIn(marker, contract[schema_index : schema_index + 2600])

    def test_console_gateway_generated_sdk_and_frontend_use_precise_trace_type(self) -> None:
        openapi = (
            ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json"
        ).read_text(encoding="utf-8")
        sdk_ai = (
            ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "api" / "ai.ts"
        ).read_text(encoding="utf-8")
        gateway_response_path = (
            ROOT
            / "sdks"
            / "clawrouter-app-sdk"
            / "clawrouter-app-sdk-typescript"
            / "src"
            / "types"
            / "gateway-traces-response.ts"
        )
        gateway_trace_path = (
            ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "types" / "gateway-trace.ts"
        )
        frontend = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-gateway"
            / "src"
            / "gatewayService.ts"
        ).read_text(encoding="utf-8")

        self.assertIn('"GatewayTrace"', openapi)
        self.assertIn('"$ref": "#/components/schemas/GatewayTrace"', openapi)
        self.assertTrue(gateway_response_path.exists())
        self.assertTrue(gateway_trace_path.exists())

        gateway_response = gateway_response_path.read_text(encoding="utf-8")
        gateway_trace = gateway_trace_path.read_text(encoding="utf-8")
        self.assertIn("import type { GatewayTrace } from './gateway-trace';", gateway_response)
        self.assertIn("items: GatewayTrace[];", gateway_response)
        self.assertIn("export interface GatewayTrace", gateway_trace)
        self.assertIn("method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';", gateway_trace)
        self.assertIn("status: number;", gateway_trace)
        self.assertIn("async list(): Promise<GatewayTracesListResult>", sdk_ai)
        self.assertIn("appApiPath(`/ai/gateway/traces`)", sdk_ai)
        self.assertIn("getClawRouterAppSdkClient().ai.gateway.traces.list()", frontend)

        self.assertIn("GatewayTrace as SdkGatewayTrace", frontend)
        self.assertIn("export interface GatewayTrace", frontend)
        self.assertIn("id: SdkGatewayTrace['id'];", frontend)
        self.assertIn("method: SdkGatewayTrace['method'];", frontend)
        self.assertIn("Promise<GatewayTrace[]>", frontend)
        self.assertNotIn("normalizeGatewayTrace", frontend)

    def test_console_gateway_ui_is_read_only_until_command_contract_exists(self) -> None:
        gateway_view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-gateway"
            / "src"
            / "GatewayView.tsx"
        ).read_text(encoding="utf-8")
        gateway_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-gateway"
            / "src"
            / "gatewayService.ts"
        ).read_text(encoding="utf-8")
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")
        gateway_operation_marker = (
            "  - route: /console/gateway\n"
            "    source: apps/sdkwork-claw-router-portal/packages/"
            "sdkwork-claw-router-console-gateway/src/gatewayService.ts\n"
            "    operation: fetchTraces"
        )
        gateway_operation_start = contract.index(gateway_operation_marker)
        next_operation_start = contract.index("\n  - route:", gateway_operation_start + 1)
        gateway_operation_contract = contract[gateway_operation_start:next_operation_start]

        self.assertIn("GatewayService.fetchTraces()", gateway_view)
        self.assertIn("readOnlyGatewayActions", gateway_view)
        self.assertIn("Read-only", gateway_view)
        self.assertIn("BusinessStatePanel", gateway_view)
        self.assertIn("onRetry={() => void loadTraces()}", gateway_view)
        self.assertNotIn("GatewayService.fetchTraces().then", gateway_view)
        for unsupported_label in [
            "Auto-refreshing",
            "View Payload",
            "Save Limits",
            "Request Playback",
            "Security & Limits",
            "Compatibility",
            "Gateway Status",
            "Current QPS",
            "Blocked Reqs",
            "P99 Latency",
        ]:
            self.assertNotIn(unsupported_label, gateway_view)
        for element in [
            "<input",
            "defaultValue={600}",
            "defaultValue={50}",
            "defaultChecked",
            "<PlayCircle",
            "<Eye",
            "<Settings2",
            "<Shield",
            "<AlertCircle",
        ]:
            self.assertNotIn(element, gateway_view)

        self.assertNotIn("static async updateLimits", gateway_service)
        self.assertNotIn("static async updateCompatibility", gateway_service)
        self.assertNotIn("static async fetchPayload", gateway_service)
        self.assertIn("operation: fetchTraces", gateway_operation_contract)
        self.assertNotIn("operation: updateLimits", gateway_operation_contract)
        self.assertNotIn("operation: updateCompatibility", gateway_operation_contract)
        self.assertNotIn("operation: replayTrace", gateway_operation_contract)
        self.assertNotIn("operation: fetchPayload", gateway_operation_contract)


if __name__ == "__main__":
    unittest.main()
