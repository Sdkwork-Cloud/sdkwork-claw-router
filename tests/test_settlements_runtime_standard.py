import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class SettlementsRuntimeStandardTest(unittest.TestCase):
    def test_settlements_backend_uses_exact_decimal_strings(self) -> None:
        settlements_port = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "ports"
            / "settlements_dashboard_read_store.rs"
        ).read_text(encoding="utf-8")
        sqlite_store = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "sqlite"
            / "settlements_dashboard_read_store.rs"
        ).read_text(encoding="utf-8")
        postgres_store = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "postgres"
            / "settlements_dashboard_read_store.rs"
        ).read_text(encoding="utf-8")

        for field in ["text", "image", "video", "audio", "music"]:
            self.assertIn(f"pub {field}: String", settlements_port)
            self.assertNotIn(f"pub {field}: f64", settlements_port)
        self.assertIn("pub total_cost: String", settlements_port)
        self.assertIn("pub cost: String", settlements_port)
        self.assertNotIn("pub total_cost: f64", settlements_port)
        self.assertNotIn("pub cost: f64", settlements_port)

        for store in [sqlite_store, postgres_store]:
            compact_store = " ".join(store.split())
            self.assertIn("DecimalValue", store)
            self.assertIn('decimal_string_cell(&row, "total_cost", 6, "settlement bill total cost")?', compact_store)
            self.assertIn('decimal_string_cell(&row, "cost_amount", 6, "settlement item cost")?', compact_store)
            self.assertIn('decimal_add_strings(&target.cost, &item_cost, 6)', store)
            self.assertIn('decimal_string_cell(&row, "text_cost", 6, "settlement chart text cost")?', compact_store)
            self.assertIn('decimal_string_cell(&row, "image_cost", 6, "settlement chart image cost")?', compact_store)
            self.assertIn('decimal_string_cell(&row, "video_cost", 6, "settlement chart video cost")?', compact_store)
            self.assertIn('decimal_string_cell(&row, "audio_cost", 6, "settlement chart audio cost")?', compact_store)
            self.assertIn('decimal_string_cell(&row, "music_cost", 6, "settlement chart music cost")?', compact_store)
            self.assertIn("fn decimal_value_string(", compact_store)
            self.assertIn("value: &str", compact_store)
            self.assertIn("digits: u32", compact_store)
            self.assertIn("field_name: &str", compact_store)
            self.assertIn("-> Result<String, DomainError>", compact_store)
            self.assertIn('format!("invalid {field_name}: {value}")', store)
            self.assertNotIn("DecimalValue::ZERO.to_fixed_string(digits)", store)
            self.assertNotIn("DecimalValue::parse(left).unwrap_or(DecimalValue::ZERO)", store)
            self.assertNotIn("DecimalValue::parse(right).unwrap_or(DecimalValue::ZERO)", store)
            self.assertIn("fn model_list(raw: &str, fallback: &str) -> Result<Vec<String>, DomainError>", compact_store)
            self.assertIn("invalid settlement model list json from database row", store)
            self.assertNotIn("serde_json::from_str::<Vec<String>>(raw).unwrap_or_default()", store)
            self.assertNotIn("COALESCE(s.statement_status, 0) AS statement_status", store)
            self.assertNotIn("COALESCE(s.payment_status, 0) AS payment_status", store)
            self.assertIn("s.statement_status AS statement_status", store)
            self.assertIn("s.payment_status AS payment_status", store)
            self.assertIn(
                'required_statement_status_cell(&row, "payment_status", "payment")?',
                compact_store,
            )
            self.assertIn(
                'required_statement_status_cell(&row, "statement_status", "statement")?',
                compact_store,
            )
            self.assertIn("fn statement_status_label(", compact_store)
            self.assertIn("payment_status: i64", compact_store)
            self.assertIn("statement_status: i64", compact_store)
            self.assertIn(") -> Result<String, DomainError>", compact_store)
            self.assertIn("missing settlement bill status payment", store)
            self.assertIn("missing settlement bill status statement", store)
            self.assertIn("unsupported settlement bill status", store)
            self.assertIn('required_modality_cell(&row, "modality", "settlement item")?', compact_store)
            self.assertIn("unsupported settlement item modality", store)
            self.assertIn("missing settlement item modality", store)
            self.assertNotIn("payment_status.unwrap_or(0)", store)
            self.assertNotIn("statement_status.unwrap_or(0)", store)
            self.assertNotIn('optional_integer_cell(&row, "modality").unwrap_or(MODALITY_TEXT)', store)
            self.assertNotIn("_ => &mut breakdown.text", store)
            self.assertNotIn("fn decimal_cell", store)
            self.assertNotIn("parse::<f64>()", store)
            self.assertNotIn("target.cost +=", store)

    def test_console_settlements_uses_exact_decimal_strings(self) -> None:
        service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-settlements"
            / "src"
            / "settlementsService.ts"
        ).read_text(encoding="utf-8")
        view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-settlements"
            / "src"
            / "SettlementsView.tsx"
        ).read_text(encoding="utf-8")

        for field in ["text", "image", "video", "audio", "music", "cost", "totalCost"]:
            self.assertIn(f"{field}: string", service)
            self.assertNotIn(f"{field}: number", service)
            self.assertNotIn(f"readNumber(item, '{field}')", service)
        self.assertIn("readDecimalString", service)
        self.assertIn(
            "getClawRouterAppSdkClient().router.fetchDashboardData(toSettlementDashboardQueryParams(params))",
            service,
        )
        self.assertNotIn("getClawRouterAppSdkClient().router.fetchDashboardData(params)", service)
        self.assertNotIn("fetch('/app/v3/api", service)
        self.assertNotIn("axios", service)

        self.assertIn("formatCurrency = (val: string)", view)
        self.assertIn("sumDecimalStrings(settlementBills.map(bill => bill.totalCost), 6)", view)
        self.assertIn("chartDataForRendering", view)
        self.assertIn("decimalNumber(value)", view)
        self.assertNotIn("formatCurrency = (val: number)", view)
        self.assertNotIn("sum + bill.totalCost", view)
        self.assertNotIn("sum + item.text + item.image + item.video + item.audio + item.music", view)

    def test_console_settlements_ui_has_retryable_load_state(self) -> None:
        view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-settlements"
            / "src"
            / "SettlementsView.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("BusinessStatePanel", view)
        self.assertIn("loadSettlementDashboard", view)
        self.assertIn("loadError", view)
        self.assertIn("onRetry={() => void loadSettlementDashboard()}", view)
        self.assertIn("await SettlementsService.fetchDashboardData", view)
        self.assertNotIn("SettlementsService.fetchDashboardData({ year: selectedYear }).then", view)

    def test_console_settlements_ui_is_read_only_until_command_contract_exists(self) -> None:
        view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-settlements"
            / "src"
            / "SettlementsView.tsx"
        ).read_text(encoding="utf-8")
        service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-settlements"
            / "src"
            / "settlementsService.ts"
        ).read_text(encoding="utf-8")
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")
        settlement_operation_marker = (
            "  - route: /console/settlements\n"
            "    source: apps/sdkwork-claw-router-portal/packages/"
            "sdkwork-claw-router-console-settlements/src/settlementsService.ts\n"
            "    operation: fetchDashboardData"
        )
        settlement_operation_start = contract.index(settlement_operation_marker)
        next_operation_start = contract.index("\n  - route:", settlement_operation_start + 1)
        settlement_operation_contract = contract[settlement_operation_start:next_operation_start]

        self.assertIn("SettlementsService.fetchDashboardData({ year: selectedYear })", view)
        self.assertIn("readOnlySettlementActions", view)
        self.assertIn("Read-only", view)
        self.assertIn("BusinessStatePanel", view)
        self.assertNotIn("trigger actual invoice viewing", view)
        self.assertNotIn("<Download", view)
        self.assertNotIn("<ExternalLink", view)
        for unsupported_action in [
            "exportStatements",
            "downloadStatement",
            "downloadInvoice",
            "viewInvoice",
            "handleExport",
            "handleInvoice",
            "static async export",
            "static async download",
            "static async viewInvoice",
        ]:
            self.assertNotIn(unsupported_action, view)
            self.assertNotIn(unsupported_action, service)
        self.assertIn("operation: fetchDashboardData", settlement_operation_contract)
        self.assertNotIn("operation: export", settlement_operation_contract)
        self.assertNotIn("operation: downloadStatement", settlement_operation_contract)
        self.assertNotIn("operation: viewInvoice", settlement_operation_contract)
        self.assertNotIn("operation: createSettlement", settlement_operation_contract)

    def test_console_settlements_uses_precise_sdk_response_contract(self) -> None:
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")
        openapi = (
            ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json"
        ).read_text(encoding="utf-8")
        sdk_router = (
            ROOT / "sdks" / "clawrouter-app-sdk" / "src" / "api" / "router.ts"
        ).read_text(encoding="utf-8")
        service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-settlements"
            / "src"
            / "settlementsService.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("name: SettlementDashboardResponse", contract)
        self.assertIn('"SettlementDashboardResponse"', openapi)
        self.assertIn('"FetchDashboardDataResult"', openapi)
        self.assertIn('"$ref": "#/components/schemas/SettlementDashboardResponse"', openapi)
        self.assertIn("async fetchDashboardData(params?: QueryParams): Promise<FetchDashboardDataResult>", sdk_router)
        self.assertIn("get<FetchDashboardDataResult>", sdk_router)

        response_path = ROOT / "sdks" / "clawrouter-app-sdk" / "src" / "types" / "settlement-dashboard-response.ts"
        chart_path = ROOT / "sdks" / "clawrouter-app-sdk" / "src" / "types" / "settlement-chart-point.ts"
        bill_path = ROOT / "sdks" / "clawrouter-app-sdk" / "src" / "types" / "settlement-bill.ts"
        result_path = ROOT / "sdks" / "clawrouter-app-sdk" / "src" / "types" / "fetch-dashboard-data-result.ts"
        self.assertTrue(response_path.exists())
        self.assertTrue(chart_path.exists())
        self.assertTrue(bill_path.exists())
        self.assertTrue(result_path.exists())
        self.assertIn("chartData: SettlementChartPoint[];", response_path.read_text(encoding="utf-8"))
        self.assertIn("bills: SettlementBill[];", response_path.read_text(encoding="utf-8"))
        self.assertIn("data?: SettlementDashboardResponse;", result_path.read_text(encoding="utf-8"))

        self.assertIn("SettlementDashboardResponse as SdkSettlementDashboardResponse", service)
        self.assertIn("day: SdkSettlementDashboardResponse['chartData'][number]['day'];", service)
        self.assertIn("breakdown: SdkSettlementDashboardResponse['bills'][number]['breakdown'];", service)


if __name__ == "__main__":
    unittest.main()
