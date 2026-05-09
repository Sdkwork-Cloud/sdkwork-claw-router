import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class ConsoleAccountBackendRuntimeStandardTest(unittest.TestCase):
    def test_console_account_ui_has_retryable_load_state(self) -> None:
        account_view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-account"
            / "src"
            / "AccountView.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("BusinessStatePanel", account_view)
        self.assertIn("loadAccountDetails", account_view)
        self.assertIn("loadError", account_view)
        self.assertIn("onRetry={() => void loadAccountDetails()}", account_view)
        self.assertIn("await AccountService.fetchAccountDetails()", account_view)
        self.assertNotIn("AccountService.fetchAccountDetails().then", account_view)
        self.assertNotIn('<Loader2 className="w-8 h-8', account_view)

    def test_console_account_ui_is_read_only_until_command_contract_exists(self) -> None:
        account_view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-account"
            / "src"
            / "AccountView.tsx"
        ).read_text(encoding="utf-8")
        account_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-account"
            / "src"
            / "accountService.ts"
        ).read_text(encoding="utf-8")
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")
        account_operation_marker = (
            "  - route: /console/account\n"
            "    source: apps/sdkwork-claw-router-portal/packages/"
            "sdkwork-claw-router-console-account/src/accountService.ts\n"
            "    operation: fetchAccountDetails"
        )
        account_operation_start = contract.index(account_operation_marker)
        next_operation_start = contract.index("\n  - route:", account_operation_start + 1)
        account_operation_contract = contract[account_operation_start:next_operation_start]

        self.assertIn("AccountService.fetchAccountDetails()", account_view)
        self.assertIn("readOnlyAccountActions", account_view)
        self.assertIn("Read-only", account_view)
        self.assertIn("BusinessStatePanel", account_view)
        self.assertIn("CopyButton", account_view)
        self.assertNotIn("<button", account_view)
        for unsupported_label in [
            "修改企业资质",
            "安全策略与访问控制",
            "Edit",
            "Save",
            "Update",
            "Security settings",
            "Invoice settings",
        ]:
            self.assertNotIn(unsupported_label, account_view)
        for unsupported_handler in [
            "handleEditInvoice",
            "handleSaveInvoice",
            "handleUpdateSecurity",
            "handleSecuritySettings",
            "setData(current =>",
        ]:
            self.assertNotIn(unsupported_handler, account_view)

        self.assertNotIn("static async updateInvoice", account_service)
        self.assertNotIn("static async updateSecurity", account_service)
        self.assertNotIn("static async updateAccount", account_service)
        self.assertIn("operation: fetchAccountDetails", account_operation_contract)
        self.assertNotIn("operation: updateInvoice", account_operation_contract)
        self.assertNotIn("operation: updateSecurity", account_operation_contract)
        self.assertNotIn("operation: updateAccount", account_operation_contract)

    def test_console_account_operation_is_backed_by_real_app_api_router(self) -> None:
        product_api_mod = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "mod.rs"
        ).read_text(encoding="utf-8")
        app_api = (ROOT / "services" / "sdkwork-claw-app-api" / "src" / "lib.rs").read_text(
            encoding="utf-8"
        )
        app_account_path = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_account.rs"
        )

        self.assertTrue(app_account_path.exists())
        app_account = app_account_path.read_text(encoding="utf-8")

        self.assertIn("mod app_account;", product_api_mod)
        self.assertIn("app_account_summary_router", product_api_mod)
        self.assertIn("app_account_summary_router_with_read_store", product_api_mod)
        self.assertIn("/app/v3/api/account/summary", app_account)
        self.assertIn("TrustedRequestSubject", app_account)
        self.assertIn("require_subject", app_account)
        self.assertIn("AccountSummaryReadStore", app_account)
        self.assertIn("EmptyAccountSummaryReadStore", app_account)
        self.assertIn('PlusApiResult::error("4010"', app_account)
        self.assertIn("account summary read model is unavailable", app_account)

        self.assertIn("AccountSummaryReadStore", app_api)
        self.assertIn("AccountSummaryStore", app_api)
        self.assertIn("SqliteAccountSummaryReadStore", app_api)
        self.assertIn("PostgresAccountSummaryReadStore", app_api)
        self.assertIn("app_account_summary_router()", app_api)
        self.assertIn("app_account_summary_router_with_read_store", app_api)
        self.assertIn("app_request_subject_boundary", app_api)

    def test_console_account_port_exposes_only_safe_frontend_fields(self) -> None:
        ports_mod = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "ports" / "mod.rs"
        ).read_text(encoding="utf-8")
        port_path = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "ports"
            / "account_summary_read_store.rs"
        )

        self.assertTrue(port_path.exists())
        port = port_path.read_text(encoding="utf-8")

        self.assertIn("mod account_summary_read_store;", ports_mod)
        for export_name in [
            "AccountConsumptionItem",
            "AccountInvoiceSettings",
            "AccountLoginLog",
            "AccountSecuritySummary",
            "AccountSummaryReadFuture",
            "AccountSummaryReadStore",
            "AccountSummarySnapshot",
            "AccountSummarySubject",
        ]:
            self.assertIn(export_name, ports_mod)
            self.assertIn(export_name, port)

        for field_name in [
            "id",
            "name",
            "email",
            "is_verified",
            "tier",
            "organization",
            "available_credits",
            "est_days_remaining",
            "monthly_consumption",
            "consumption_by_service",
            "invoice_settings",
            "security",
            "login_logs",
        ]:
            self.assertIn(field_name, port)

        self.assertIn("pub id: String,", port)
        self.assertIn("#[serde(rename_all = \"camelCase\")]", port)
        for sensitive_field in [
            "password",
            "password_hash",
            "salt",
            "secret",
            "token",
            "raw_key",
            "client_ip_hash",
            "session_hash",
        ]:
            self.assertNotIn(sensitive_field, port.lower())
        self.assertNotIn("mock", port.lower())

    def test_console_account_sql_read_stores_use_scope_and_do_not_expose_raw_bank_details(self) -> None:
        for relative, store_name in [
            (
                "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/account_summary_read_store.rs",
                "SqliteAccountSummaryReadStore",
            ),
            (
                "services/sdkwork-claw-product/src/infrastructure/sql/postgres/account_summary_read_store.rs",
                "PostgresAccountSummaryReadStore",
            ),
        ]:
            store_path = ROOT / relative
            self.assertTrue(store_path.exists())
            store = store_path.read_text(encoding="utf-8")

            self.assertIn(store_name, store)
            for table in [
                "plus_user",
                "plus_account",
                "plus_organization",
                "plus_invoice",
                "iam_user_security_setting",
                "iam_user_login_event",
                "ai_usage_fact",
            ]:
                self.assertIn(table, store)

            for scope_column in ["tenant_id", "organization_id", "user_id"]:
                self.assertIn(scope_column, store)

            for safe_column in [
                "client_ip_masked",
                "client_ip_region",
                "device_label",
                "mfa_enabled",
                "trusted_device_count",
                "available_points",
                "customer_charge_amount",
                "cost_amount",
            ]:
                self.assertIn(safe_column, store)

            self.assertIn("load_account_summary", store)
            self.assertIn("CAST(u.id AS TEXT) AS user_id", store)
            self.assertIn("LIMIT", store)
            self.assertIn("SELECT", store)
            self.assertNotIn("SELECT *", store)
            self.assertNotIn("bank_account", store)
            for sensitive_column in [
                "password",
                "password_hash",
                "salt",
                "secret",
                "client_ip_hash",
                "session_hash",
            ]:
                self.assertNotIn(sensitive_column, store.lower())

    def test_console_account_consumption_modality_preserves_unknown_values(self) -> None:
        for relative in [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/account_summary_read_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/account_summary_read_store.rs",
        ]:
            store = (ROOT / relative).read_text(encoding="utf-8")
            compact_store = " ".join(store.split())
            with self.subTest(store=relative):
                self.assertIn('let modality = optional_integer_cell(row, "modality");', compact_store)
                self.assertIn("None => \"Unknown\"", store)
                self.assertIn("Some(_) => \"Unknown\"", store)
                self.assertIn("None => \"bg-slate-500\"", store)
                self.assertIn("Some(_) => \"bg-slate-500\"", store)
                self.assertNotIn("optional_integer_cell(row, \"modality\").unwrap_or(0)", store)
                self.assertNotIn("_ => \"Text\"", store)
                self.assertNotIn("_ => \"bg-emerald-500\"", store)

    def test_console_account_login_status_fails_closed_for_missing_or_unknown_values(self) -> None:
        for relative in [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/account_summary_read_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/account_summary_read_store.rs",
        ]:
            store = (ROOT / relative).read_text(encoding="utf-8")
            compact_store = " ".join(store.split())
            with self.subTest(store=relative):
                self.assertIn("login_result,", store)
                self.assertIn("risk_level", store)
                self.assertNotIn("COALESCE(login_result, 0) AS login_result", store)
                self.assertNotIn("COALESCE(risk_level, 0) AS risk_level", store)
                self.assertIn('optional_integer_cell(row, "login_result")', compact_store)
                self.assertIn('optional_integer_cell(row, "risk_level")', compact_store)
                self.assertIn("fn login_status(login_result: Option<i64>, risk_level: Option<i64>)", store)
                self.assertIn("(Some(1), Some(0..=2)) => \"success\"", store)
                self.assertIn("_ => \"warning\"", store)

    def test_console_account_contract_response_schema_is_precise(self) -> None:
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")
        operation_marker = "api_path: /app/v3/api/account/summary"
        operation_index = contract.index(operation_marker)
        schema_index = contract.index("name: AccountSummaryResponse", operation_index)
        self.assertLess(schema_index - operation_index, 1200)

        for marker in [
            "name: AccountConsumptionItem",
            "name: AccountInvoiceSettings",
            "name: AccountSecuritySummary",
            "name: AccountLoginLog",
            "required: [id, name, email, isVerified, tier, organization, availableCredits, estDaysRemaining, monthlyConsumption, consumptionByService, invoiceSettings, security, loginLogs]",
            "id: { type: string }",
            "status: { type: string, enum: [success, warning] }",
            "description: Masked client IP address.",
            "description: Safe invoice payment method display label without raw bank account number.",
        ]:
            self.assertIn(marker, contract[schema_index : schema_index + 5200])

    def test_console_account_generated_sdk_and_frontend_use_precise_account_type(self) -> None:
        package_root = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-account"
        )
        package = __import__("json").loads((package_root / "package.json").read_text(encoding="utf-8"))
        openapi = (
            ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json"
        ).read_text(encoding="utf-8")
        sdk_account = (
            ROOT / "sdks" / "clawrouter-app-sdk" / "src" / "api" / "account.ts"
        ).read_text(encoding="utf-8")
        account_response_path = (
            ROOT
            / "sdks"
            / "clawrouter-app-sdk"
            / "src"
            / "types"
            / "account-summary-response.ts"
        )
        login_log_path = (
            ROOT / "sdks" / "clawrouter-app-sdk" / "src" / "types" / "account-login-log.ts"
        )
        frontend = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-account"
            / "src"
            / "accountService.ts"
        ).read_text(encoding="utf-8")

        self.assertEqual(package["type"], "module")
        self.assertEqual(package["scripts"]["typecheck"], "tsc --noEmit")
        self.assertTrue((package_root / "tsconfig.json").exists())
        self.assertIn('"AccountSummaryResponse"', openapi)
        self.assertIn('"$ref": "#/components/schemas/AccountSummaryResponse"', openapi)
        self.assertTrue(account_response_path.exists())
        self.assertTrue(login_log_path.exists())

        account_response = account_response_path.read_text(encoding="utf-8")
        login_log = login_log_path.read_text(encoding="utf-8")
        self.assertIn("export interface AccountSummaryResponse", account_response)
        self.assertIn("loginLogs: AccountLoginLog[];", account_response)
        self.assertIn("export interface AccountLoginLog", login_log)
        self.assertIn("ip: string;", login_log)
        self.assertIn("status: 'success' | 'warning';", login_log)
        self.assertIn(
            "async fetchAccountDetails(params?: QueryParams): Promise<FetchAccountDetailsResult>",
            sdk_account,
        )

        self.assertIn("AccountSummaryResponse as SdkAccountSummaryResponse", frontend)
        self.assertIn("export interface AccountStats", frontend)
        self.assertIn("id: SdkAccountSummaryResponse['id'];", frontend)
        self.assertIn("name: SdkAccountSummaryResponse['consumptionByService'][number]['name'];", frontend)
        self.assertIn("paymentMethod: SdkAccountSummaryResponse['invoiceSettings']['paymentMethod'];", frontend)
        self.assertIn("mfaEnabled: SdkAccountSummaryResponse['security']['mfaEnabled'];", frontend)
        self.assertIn("status: SdkAccountSummaryResponse['loginLogs'][number]['status'];", frontend)
        self.assertIn("Promise<AccountStats>", frontend)
        self.assertIn("normalizeAccountStats", frontend)
        self.assertIn("normalizeConsumptionItem", frontend)
        self.assertIn("normalizeInvoiceSettings", frontend)
        self.assertIn("normalizeSecuritySummary", frontend)
        self.assertIn("normalizeLoginLog", frontend)
        self.assertIn("readRequiredString(data, 'id', 'Account summary response missing data')", frontend)
        self.assertNotIn("as unknown as AccountStats", frontend)


if __name__ == "__main__":
    unittest.main()
