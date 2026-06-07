import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
APPBASE_ROOT = ROOT / ".sdkwork" / "dependencies" / "sdkwork-appbase"


class ConsoleAccountBackendRuntimeStandardTest(unittest.TestCase):
    def test_console_account_ui_has_retryable_load_state(self) -> None:
        account_view = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-console-account"
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

    def test_console_account_product_states_are_localized(self) -> None:
        account_view = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-console-account"
            / "src"
            / "AccountView.tsx"
        ).read_text(encoding="utf-8")
        account_service = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-console-account"
            / "src"
            / "accountService.ts"
        ).read_text(encoding="utf-8")
        i18n = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-i18n"
            / "src"
            / "resources"
            / "console"
            / "account.ts"
        ).read_text(encoding="utf-8")

        for marker in [
            "console.account.states.loading",
            "console.account.states.loadErrorTitle",
            "console.account.states.loadErrorFallback",
            "console.account.states.emptyTitle",
            "console.account.states.emptyDescription",
            "console.account.securitySummary",
        ]:
            self.assertIn(marker, account_view + account_service + i18n)
            self.assertGreaterEqual(i18n.count(f'"{marker}"'), 2)

        for hardcoded_copy in [
            "Loading account details...",
            "Account details could not be loaded",
            "Failed to load account details.",
            "Account details are unavailable",
            "The account summary API returned no displayable account data.",
            "Security status summary",
            "Failed to fetch account details",
        ]:
            self.assertNotIn(hardcoded_copy, account_view)
            self.assertNotIn(hardcoded_copy, account_service)

    def test_console_account_ui_is_read_only_until_command_contract_exists(self) -> None:
        account_view = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-console-account"
            / "src"
            / "AccountView.tsx"
        ).read_text(encoding="utf-8")
        account_service = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-console-account"
            / "src"
            / "accountService.ts"
        ).read_text(encoding="utf-8")
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")
        account_operation_contract = contract.split("operation: fetchAccountDetails", 1)[1].split("- route:", 1)[0]

        self.assertIn("AccountService.fetchAccountDetails()", account_view)
        self.assertNotIn("readOnlyAccountActions", account_view)
        self.assertNotIn("Read-only", account_view)
        self.assertNotIn("read-only", account_view)
        self.assertNotIn("command contract", account_view)
        self.assertIn("BusinessStatePanel", account_view)
        self.assertIn("CopyButton", account_view)
        self.assertNotIn("<button", account_view)
        unsupported_label_codepoints = [
            (0x6DC7, 0xE1BD, 0x657C, 0x6D7C, 0x4F77, 0x7B1F, 0x74A7, 0x52EE, 0x5DDD),
            (0x7039, 0x590A, 0x53CF, 0x7EDB, 0x682B, 0x6690, 0x6D93, 0x5EA4, 0xE196, 0x95C2, 0xE1BD, 0x5E36, 0x9352, 0x003F),
        ]
        unsupported_labels = [
            *(
                "".join(chr(codepoint) for codepoint in label)
                for label in unsupported_label_codepoints
            ),
            "Edit",
            "Save",
            "Update",
            "Security settings",
            "Invoice settings",
        ]
        for unsupported_label in unsupported_labels:
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
        self.assertIn("route: /console/account", contract)
        self.assertIn("source: apps/sdkwork-clawrouter-pc/packages/sdkwork-clawrouter-pc-console-account/src/accountService.ts", contract)
        self.assertIn("operation: fetchAccountDetails", contract)
        self.assertIn("operation_id: console.accountDetails.retrieve", account_operation_contract)
        self.assertIn("api_path: /app/v3/api/accounts/current/summary", account_operation_contract)
        self.assertIn("openapi_exposed: false", account_operation_contract)
        self.assertNotIn("operation: updateInvoice", account_operation_contract)
        self.assertNotIn("operation: updateSecurity", account_operation_contract)
        self.assertNotIn("operation: updateAccount", account_operation_contract)

    def test_console_account_operation_is_backed_by_real_app_api_router(self) -> None:
        product_api_mod = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "mod.rs"
        ).read_text(encoding="utf-8")
        product_sql_mod = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "mod.rs"
        ).read_text(encoding="utf-8")
        app_api = (ROOT / "services" / "sdkwork-claw-app-api" / "src" / "lib.rs").read_text(
            encoding="utf-8"
        )
        appbase_account_router = (
            APPBASE_ROOT
            / "packages"
            / "native-rust"
            / "commerce"
            / "sdkwork-commerce-http-rust"
            / "src"
            / "account_router.rs"
        ).read_text(encoding="utf-8")
        appbase_storage = (
            APPBASE_ROOT
            / "packages"
            / "native-rust"
            / "commerce"
            / "sdkwork-commerce-storage-sqlx-rust"
            / "src"
            / "sqlite_account.rs"
        ).read_text(encoding="utf-8")
        product_account_path = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_account.rs"
        )
        product_read_model_path = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "read_model.rs"
        )

        self.assertFalse(product_account_path.exists())
        self.assertFalse(product_read_model_path.exists())
        self.assertNotIn("mod app_account;", product_api_mod)
        self.assertNotIn("app_account_summary_router", product_api_mod)
        self.assertNotIn("mod read_model;", product_sql_mod)
        self.assertNotIn("AccountSummaryReadStore", app_api)
        self.assertNotIn("SqliteAccountSummaryReadStore", app_api)
        self.assertNotIn("PostgresAccountSummaryReadStore", app_api)
        self.assertIn("fetch_account_summary", appbase_account_router)
        self.assertIn("AccountSummaryQuery", appbase_account_router)
        self.assertIn("AccountSummarySnapshot", appbase_account_router)
        self.assertIn('AppWalletApiResult::error("4010"', appbase_account_router)
        self.assertIn("account summary read model is unavailable", appbase_account_router)
        self.assertIn("retrieve_account_summary_snapshot", appbase_storage)
        self.assertIn("app_account_wallet_router_with_sqlite_pool", app_api)
        self.assertIn("app_account_wallet_router_with_postgres_pool", app_api)
        self.assertIn("app_request_subject_boundary", app_api)

    def test_console_account_port_exposes_only_safe_frontend_fields(self) -> None:
        account_domain = (
            APPBASE_ROOT
            / "packages"
            / "native-rust"
            / "commerce"
            / "sdkwork-commerce-account-rust"
            / "src"
            / "domain"
            / "mod.rs"
        ).read_text(encoding="utf-8")
        product_port_path = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "ports" / "account_summary_read_store.rs"
        )
        summary_start = account_domain.index("pub struct AccountSummarySnapshot")
        summary_end = account_domain.index("#[derive(Clone, Debug, Eq, PartialEq)]", summary_start)
        account_summary_contract = account_domain[summary_start:summary_end]

        self.assertFalse(product_port_path.exists())

        for export_name in [
            "AccountConsumptionItem",
            "AccountInvoiceSettings",
            "AccountLoginLog",
            "AccountSecuritySummary",
            "AccountSummarySnapshot",
        ]:
            self.assertIn(export_name, account_domain)

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
            self.assertIn(field_name, account_summary_contract)

        self.assertIn("pub id: String,", account_summary_contract)
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
            self.assertNotIn(sensitive_field, account_summary_contract.lower())
        self.assertNotIn("mock", account_summary_contract.lower())

    def test_console_account_sql_read_stores_use_scope_and_do_not_expose_raw_bank_details(self) -> None:
        for relative, store_name in [
            (
                ".sdkwork/dependencies/sdkwork-appbase/packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/sqlite_account.rs",
                "SqliteCommerceAccountStore",
            ),
            (
                ".sdkwork/dependencies/sdkwork-appbase/packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/postgres_account.rs",
                "PostgresCommerceAccountStore",
            ),
        ]:
            store_path = ROOT / relative
            self.assertTrue(store_path.exists())
            store = store_path.read_text(encoding="utf-8")

            self.assertIn(store_name, store)
            for table in [
                "iam_user",
                "commerce_account",
                "iam_organization",
                "commerce_invoice_title",
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

            self.assertIn("retrieve_account_summary_snapshot", store)
            self.assertIn("CAST(u.id AS TEXT) AS user_id", store)
            self.assertIn("LIMIT", store)
            self.assertIn("SELECT", store)
            self.assertNotIn("SELECT *", store)
            self.assertNotIn("bank_account", store)
            self.assertNotIn("plus_account", store)
            self.assertNotIn("plus_invoice", store)
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
            ".sdkwork/dependencies/sdkwork-appbase/packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/sqlite_account.rs",
            ".sdkwork/dependencies/sdkwork-appbase/packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/postgres_account.rs",
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
            ".sdkwork/dependencies/sdkwork-appbase/packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/sqlite_account.rs",
            ".sdkwork/dependencies/sdkwork-appbase/packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/postgres_account.rs",
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
        self.assertIn("operation_id: console.accountDetails.retrieve", contract)
        self.assertIn("api_path: /app/v3/api/accounts/current/summary", contract)
        self.assertIn("openapi_exposed: false", contract)
        self.assertIn("operation_scope: app_shell", contract)
        self.assertIn("kind: read", contract)
        self.assertIn("api_surface: app", contract)
        self.assertIn("api_method: GET", contract)
        self.assertIn("file_targets: []", contract)
        self.assertIn("read_sources:", contract)
        self.assertIn("- iam_user", contract)
        self.assertIn("- commerce_account", contract)

    def test_console_account_generated_sdk_and_frontend_use_precise_account_type(self) -> None:
        package_root = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-console-account"
        )
        package = __import__("json").loads((package_root / "package.json").read_text(encoding="utf-8"))
        openapi = (
            ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json"
        ).read_text(encoding="utf-8")
        sdk_commerce = (
            ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "api" / "commerce.ts"
        ).read_text(encoding="utf-8")
        account_response_path = (
            ROOT
            / "sdks"
            / "clawrouter-app-sdk"
            / "clawrouter-app-sdk-typescript"
            / "src"
            / "types"
            / "accounts-current-summary-retrieve-result.ts"
        )
        standard_resource_path = (
            ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "types" / "commerce-standard-resource-response.ts"
        )
        frontend = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-console-account"
            / "src"
            / "accountService.ts"
        ).read_text(encoding="utf-8")

        self.assertEqual(package["type"], "module")
        self.assertEqual(package["scripts"]["typecheck"], "tsc --noEmit")
        self.assertIn('"AccountsCurrentSummaryRetrieveResult"', openapi)
        self.assertIn('"$ref": "#/components/schemas/AccountsCurrentSummaryRetrieveResult"', openapi)
        self.assertTrue(account_response_path.exists())
        self.assertTrue(standard_resource_path.exists())
        self.assertFalse(
            (
                ROOT
                / "sdks"
                / "clawrouter-app-sdk"
                / "clawrouter-app-sdk-typescript"
                / "src"
                / "api"
                / "account.ts"
            ).exists()
        )

        account_response = account_response_path.read_text(encoding="utf-8")
        standard_resource = standard_resource_path.read_text(encoding="utf-8")
        self.assertIn("export interface AccountsCurrentSummaryRetrieveResult", account_response)
        self.assertIn("data?: CommerceStandardResourceResponse;", account_response)
        self.assertIn("export interface CommerceStandardResourceResponse", standard_resource)
        self.assertIn("item: Record<string, unknown>;", standard_resource)
        self.assertIn(
            "async retrieve(): Promise<AccountsCurrentSummaryRetrieveResult>",
            sdk_commerce,
        )
        self.assertIn("public readonly summary: CommerceAccountsCurrentSummaryApi;", sdk_commerce)

        self.assertIn("export interface AccountStats", frontend)
        self.assertIn("id: string;", frontend)
        self.assertIn("name: string;", frontend)
        self.assertIn("availableCredits: number;", frontend)
        self.assertIn("paymentMethod: string;", frontend)
        self.assertIn("mfaEnabled: boolean;", frontend)
        self.assertIn("status: 'success' | 'warning';", frontend)
        self.assertIn("getClawRouterAppSdkClient().commerce.accounts.current.summary.retrieve()", frontend)
        self.assertNotIn("type SdkworkCommerceAppAccountSummary", frontend)
        self.assertNotIn("SdkworkCommerceAppAccountSummary['id']", frontend)
        self.assertNotIn("SdkworkCommerceAppAccountSummary['consumptionByService'][number]['name']", frontend)
        self.assertNotIn("SdkworkCommerceAppAccountSummary['invoiceSettings']['paymentMethod']", frontend)
        self.assertNotIn("SdkworkCommerceAppAccountSummary['security']['mfaEnabled']", frontend)
        self.assertNotIn("SdkworkCommerceAppAccountSummary['loginLogs'][number]['status']", frontend)
        self.assertNotIn("@sdkwork/clawrouter-app-sdk", frontend)
        self.assertIn("Promise<AccountStats>", frontend)
        self.assertIn("normalizeAccountStats", frontend)
        self.assertIn("normalizeConsumptionItem", frontend)
        self.assertIn("normalizeInvoiceSettings", frontend)
        self.assertIn("normalizeSecuritySummary", frontend)
        self.assertIn("normalizeLoginLog", frontend)
        self.assertIn("readRequiredApiItem(result, 'console.account.states.loadErrorFallback')", frontend)
        self.assertNotIn("as unknown as AccountStats", frontend)


if __name__ == "__main__":
    unittest.main()
