import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class DashboardOverviewRuntimeStandardTest(unittest.TestCase):
    def test_console_dashboard_declares_single_app_overview_contract_and_sdk_method(self) -> None:
        contract = (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(
            encoding="utf-8"
        )
        manifest = json.loads(
            (ROOT / "generated" / "api" / "api-contract-manifest.json").read_text(encoding="utf-8")
        )
        openapi = json.loads(
            (ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json").read_text(encoding="utf-8")
        )
        sdk_router = (ROOT / "sdks" / "clawrouter-app-sdk" / "src" / "api" / "router.ts").read_text(
            encoding="utf-8"
        )
        frontend = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-dashboard"
            / "src"
            / "dashboardService.ts"
        ).read_text(encoding="utf-8")

        operation_key = (
            "apps/sdkwork-claw-router-portal/packages/"
            "sdkwork-claw-router-console-dashboard/src/dashboardService.ts#fetchDashboardOverview"
        )
        operations = {operation["key"]: operation for operation in manifest["operations"]}

        self.assertIn("operation: fetchDashboardOverview", contract)
        self.assertIn("api_path: /app/v3/api/router/dashboard/overview", contract)
        self.assertIn(operation_key, operations)
        self.assertEqual("app", operations[operation_key]["api_surface"])
        self.assertEqual("GET", operations[operation_key]["api_method"])
        self.assertEqual("/app/v3/api/router/dashboard/overview", operations[operation_key]["api_path"])
        self.assertIn("/app/v3/api/router/dashboard/overview", openapi["paths"])
        self.assertIn("async fetchDashboardOverview(params?: QueryParams): Promise<FetchDashboardOverviewResult>", sdk_router)
        self.assertIn("static async fetchDashboardOverview", frontend)
        self.assertIn("client.router.fetchDashboardOverview(params)", frontend)
        self.assertNotIn("client.account.fetchAccountDetails", frontend)
        self.assertNotIn("client.router.fetchUsageData", frontend)
        self.assertNotIn("client.router.fetchDashboardData", frontend)
        self.assertNotIn("client.notification.fetchMessages", frontend)

    def test_console_dashboard_contract_response_schema_is_precise(self) -> None:
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")
        operation_marker = "api_path: /app/v3/api/router/dashboard/overview"
        operation_index = contract.index(operation_marker)
        schema_index = contract.index("name: DashboardOverviewResponse", operation_index)
        self.assertLess(schema_index - operation_index, 1200)

        for marker in [
            "name: DashboardOverviewSummary",
            "name: DashboardSparklinePoint",
            "name: DashboardChartPoint",
            "name: DashboardTopModel",
            "name: DashboardAnnouncement",
            "required: [summary, requestSparkline, multimodalSparkline, performanceSparkline, chartData, topModels, announcements, warnings]",
            "type: { type: string, enum: [success, info, warning, error, unknown] }",
            "modality: { type: string, enum: [text, image, video, audio, music, unknown] }",
        ]:
            self.assertIn(marker, contract[schema_index : schema_index + 6200])

    def test_console_dashboard_generated_sdk_and_frontend_use_precise_overview_type(self) -> None:
        openapi = (
            ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json"
        ).read_text(encoding="utf-8")
        sdk_router = (
            ROOT / "sdks" / "clawrouter-app-sdk" / "src" / "api" / "router.ts"
        ).read_text(encoding="utf-8")
        overview_response_path = (
            ROOT
            / "sdks"
            / "clawrouter-app-sdk"
            / "src"
            / "types"
            / "dashboard-overview-response.ts"
        )
        fetch_result_path = (
            ROOT
            / "sdks"
            / "clawrouter-app-sdk"
            / "src"
            / "types"
            / "fetch-dashboard-overview-result.ts"
        )
        top_model_path = (
            ROOT
            / "sdks"
            / "clawrouter-app-sdk"
            / "src"
            / "types"
            / "dashboard-top-model.ts"
        )
        announcement_path = (
            ROOT
            / "sdks"
            / "clawrouter-app-sdk"
            / "src"
            / "types"
            / "dashboard-announcement.ts"
        )
        frontend = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-dashboard"
            / "src"
            / "dashboardService.ts"
        ).read_text(encoding="utf-8")

        self.assertIn('"DashboardOverviewResponse"', openapi)
        self.assertIn('"$ref": "#/components/schemas/DashboardOverviewResponse"', openapi)
        self.assertTrue(overview_response_path.exists())
        self.assertTrue(fetch_result_path.exists())
        self.assertTrue(top_model_path.exists())
        self.assertTrue(announcement_path.exists())

        overview_response = overview_response_path.read_text(encoding="utf-8")
        fetch_result = fetch_result_path.read_text(encoding="utf-8")
        top_model = top_model_path.read_text(encoding="utf-8")
        announcement = announcement_path.read_text(encoding="utf-8")
        self.assertIn("export interface DashboardOverviewResponse", overview_response)
        self.assertIn("data?: DashboardOverviewResponse;", fetch_result)
        self.assertIn("modality: 'text' | 'image' | 'video' | 'audio' | 'music' | 'unknown';", top_model)
        self.assertIn("type: 'success' | 'info' | 'warning' | 'error' | 'unknown';", announcement)
        self.assertIn("async fetchDashboardOverview(params?: QueryParams): Promise<FetchDashboardOverviewResult>", sdk_router)

        self.assertIn("DashboardOverviewResponse as SdkDashboardOverviewResponse", frontend)
        self.assertIn("summary: SdkDashboardOverviewResponse['summary'];", frontend)
        self.assertIn("topModels: SdkDashboardOverviewResponse['topModels'];", frontend)
        self.assertIn("Promise<DashboardSnapshot>", frontend)

    def test_console_dashboard_ui_has_retryable_load_state(self) -> None:
        view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-dashboard"
            / "src"
            / "DashboardView.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("BusinessStatePanel", view)
        self.assertIn("loadDashboard", view)
        self.assertIn("loadError", view)
        self.assertIn("onRetry={() => void loadDashboard()}", view)
        self.assertIn("await DashboardService.fetchDashboardOverview", view)
        self.assertNotIn("DashboardService.fetchDashboardOverview(timeRange).then", view)

    def test_console_dashboard_ui_is_read_only_until_command_contract_exists(self) -> None:
        view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-dashboard"
            / "src"
            / "DashboardView.tsx"
        ).read_text(encoding="utf-8")
        service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-dashboard"
            / "src"
            / "dashboardService.ts"
        ).read_text(encoding="utf-8")
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")
        dashboard_operation_marker = (
            "  - route: /console/dashboard\n"
            "    source: apps/sdkwork-claw-router-portal/packages/"
            "sdkwork-claw-router-console-dashboard/src/dashboardService.ts\n"
            "    operation: fetchDashboardOverview"
        )
        dashboard_operation_start = contract.index(dashboard_operation_marker)
        next_operation_start = contract.index("\n  - route:", dashboard_operation_start + 1)
        dashboard_operation_contract = contract[dashboard_operation_start:next_operation_start]

        self.assertIn("DashboardService.fetchDashboardOverview(timeRange)", view)
        self.assertIn("readOnlyDashboardActions", view)
        self.assertIn("Read-only", view)
        self.assertIn("BusinessStatePanel", view)
        self.assertNotIn("<Search", view)
        self.assertNotIn("actionLabel=\"", view)
        self.assertNotIn("onAction={() => navigate('/console/billing?tab=recharge')}", view)
        self.assertNotIn("onAction?: () => void", view)
        for unsupported_action in [
            "exportDashboard",
            "downloadDashboard",
            "searchResources",
            "handleExport",
            "handleDownload",
            "handleSearch",
            "static async export",
            "static async download",
        ]:
            self.assertNotIn(unsupported_action, view)
            self.assertNotIn(unsupported_action, service)
        self.assertIn("operation: fetchDashboardOverview", dashboard_operation_contract)
        self.assertNotIn("operation: export", dashboard_operation_contract)
        self.assertNotIn("operation: downloadDashboard", dashboard_operation_contract)
        self.assertNotIn("operation: searchResources", dashboard_operation_contract)

    def test_backend_app_router_exposes_real_dashboard_overview_route(self) -> None:
        product_api = (ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "mod.rs").read_text(
            encoding="utf-8"
        )
        app_api = (ROOT / "services" / "sdkwork-claw-app-api" / "src" / "lib.rs").read_text(encoding="utf-8")

        self.assertIn("app_dashboard_overview_router", product_api)
        self.assertIn("app_dashboard_overview_router_with_read_store", product_api)
        self.assertIn("app_dashboard_overview_router()", app_api)
        self.assertIn("SqliteDashboardOverviewReadStore::new(pool.clone())", app_api)
        self.assertIn("PostgresDashboardOverviewReadStore::new(pool.clone())", app_api)
        self.assertIn("app_dashboard_overview_router_with_read_store", app_api)
        self.assertNotIn("/app/v3/api/router/dashboard/overview\", \"fetchDashboardOverview", app_api)

    def test_dashboard_overview_validates_query_before_read_store_access(self) -> None:
        contract = (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(
            encoding="utf-8"
        )
        app_dashboard = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_dashboard.rs"
        ).read_text(encoding="utf-8")
        postgres_store = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "postgres"
            / "dashboard_overview_read_store.rs"
        ).read_text(encoding="utf-8")

        self.assertIn("MAX_DASHBOARD_RANGE_DAYS", app_dashboard)
        self.assertIn("SUPPORTED_DASHBOARD_KEYWORDS", app_dashboard)
        self.assertIn("DashboardOverviewQueryValidationError", app_dashboard)
        self.assertIn("validate_dashboard_overview_query", app_dashboard)
        self.assertIn("parse_dashboard_timestamp", app_dashboard)
        self.assertIn("format_dashboard_timestamp_for_query", app_dashboard)
        self.assertIn("dashboard overview keyword must be one of hourly, daily, monthly, yearly", app_dashboard)
        self.assertIn("dashboard overview startTime must be a valid UTC timestamp", app_dashboard)
        self.assertIn("dashboard overview endTime must be greater than or equal to startTime", app_dashboard)
        self.assertIn("dashboard overview time range must not exceed", app_dashboard)
        self.assertIn('StatusCode::BAD_REQUEST', app_dashboard)
        self.assertIn('PlusApiResult::error("4001"', app_dashboard)
        self.assertIn("let validated_query = match validate_dashboard_overview_query(query)", app_dashboard)
        self.assertIn("validated_query.query", app_dashboard)
        self.assertIn("start_time: parsed_start", app_dashboard)
        self.assertIn("end_time: parsed_end", app_dashboard)
        self.assertGreaterEqual(app_dashboard.count(".map(format_dashboard_timestamp_for_query)"), 2)
        self.assertIn("AT TIME ZONE 'UTC'", postgres_store)
        self.assertNotIn("$4::timestamptz", postgres_store)
        self.assertNotIn("$5::timestamptz", postgres_store)
        self.assertIn(
            "read_sources: [ai_usage_fact, ai_request_trace, ai_model_rank_snapshot, content_announcement, ops_metric_snapshot]",
            contract,
        )
        self.assertIn(
            "required_tables: [ai_usage_fact, ai_request_trace, ai_model_rank_snapshot, content_announcement, ops_metric_snapshot]",
            contract,
        )
        self.assertIn(
            "ai_request_trace: [request_id, http_status, error_type, provider_error_code, started_at]",
            contract,
        )

    def test_dashboard_overview_summary_rates_are_derived_from_time_window(self) -> None:
        metrics = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "dashboard_overview_metrics.rs"
        ).read_text(encoding="utf-8")
        postgres_store = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "postgres"
            / "dashboard_overview_read_store.rs"
        ).read_text(encoding="utf-8")
        sqlite_store = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "sqlite"
            / "dashboard_overview_read_store.rs"
        ).read_text(encoding="utf-8")
        sql_mod = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "mod.rs"
        ).read_text(encoding="utf-8")

        self.assertIn("mod dashboard_overview_metrics;", sql_mod)
        self.assertIn("derive_dashboard_summary_rates", metrics)
        self.assertIn("parse_dashboard_query_timestamp", metrics)
        self.assertIn("seconds_between", metrics)
        self.assertIn("let minutes = duration_seconds / 60.0", metrics)
        self.assertIn("request_count as f64 / minutes", metrics)
        self.assertIn("total_tokens / minutes", metrics)

        for store in (postgres_store, sqlite_store):
            self.assertIn("derive_dashboard_summary_rates", store)
            self.assertIn("let total_tokens = decimal_cell(&row, \"total_tokens\")", store)
            self.assertIn("let (rpm, tpm) = derive_dashboard_summary_rates", store)
            self.assertIn("rpm,", store)
            self.assertIn("tpm,", store)
            self.assertNotIn("rpm: 0.0", store)
            self.assertNotIn("tpm: decimal_cell(&row, \"total_tokens\")", store)

    def test_dashboard_overview_error_count_is_read_from_request_trace(self) -> None:
        postgres_store = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "postgres"
            / "dashboard_overview_read_store.rs"
        ).read_text(encoding="utf-8")
        sqlite_store = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "sqlite"
            / "dashboard_overview_read_store.rs"
        ).read_text(encoding="utf-8")

        for store in (postgres_store, sqlite_store):
            self.assertIn("LOAD_ERROR_COUNT", store)
            self.assertIn("FROM ai_request_trace", store)
            self.assertIn("COUNT(DISTINCT", store)
            self.assertIn("COALESCE(NULLIF(request_id, ''), CAST(id AS TEXT))", store)
            self.assertIn("http_status >= 400", store)
            self.assertIn("error_type IS NOT NULL", store)
            self.assertIn("provider_error_code", store)
            self.assertIn("started_at", store)
            self.assertIn("load_error_count", store)
            self.assertIn("let error_count = load_error_count", store)
            self.assertIn("error_count,", store)
            self.assertNotIn("error_count: 0", store)

    def test_dashboard_overview_top_model_modality_preserves_unknown_values(self) -> None:
        dashboard_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-dashboard"
            / "src"
            / "dashboardService.ts"
        ).read_text(encoding="utf-8")

        for relative in [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/dashboard_overview_read_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/dashboard_overview_read_store.rs",
        ]:
            store = (ROOT / relative).read_text(encoding="utf-8")
            with self.subTest(store=relative):
                self.assertIn("None => \"unknown\"", store)
                self.assertIn("Some(_) => \"unknown\"", store)
                self.assertNotIn("_ => \"text\"", store)

        self.assertIn("normalized === 'unknown'", dashboard_service)
        self.assertIn("return 'unknown';", dashboard_service)
        self.assertNotIn("Unsupported dashboard top model modality: ${value}", dashboard_service)

    def test_dashboard_overview_announcement_type_preserves_unknown_values(self) -> None:
        dashboard_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-dashboard"
            / "src"
            / "dashboardService.ts"
        ).read_text(encoding="utf-8")

        for relative in [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/dashboard_overview_read_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/dashboard_overview_read_store.rs",
        ]:
            store = (ROOT / relative).read_text(encoding="utf-8")
            with self.subTest(store=relative):
                self.assertIn('Some(1) => "info"', store)
                self.assertIn("None => \"unknown\"", store)
                self.assertIn("Some(_) => \"unknown\"", store)
                self.assertNotIn("_ => \"info\"", store)

        self.assertIn("type: 'success' | 'info' | 'warning' | 'error' | 'unknown';", dashboard_service)
        self.assertIn("normalized === 'unknown'", dashboard_service)
        self.assertIn("return 'unknown';", dashboard_service)
        self.assertNotIn("Unsupported dashboard announcement type: ${value}", dashboard_service)


if __name__ == "__main__":
    unittest.main()
