import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class BillingRuntimeStandardTest(unittest.TestCase):
    def test_billing_backend_money_uses_exact_decimal_strings(self) -> None:
        billing_port = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "ports" / "billing_store.rs"
        ).read_text(encoding="utf-8")
        sqlite_store = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "sqlite"
            / "billing_store.rs"
        ).read_text(encoding="utf-8")
        postgres_store = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "postgres"
            / "billing_store.rs"
        ).read_text(encoding="utf-8")

        self.assertIn("pub amount: String", billing_port)
        self.assertNotIn("pub amount: f64", billing_port)

        for store in [sqlite_store, postgres_store]:
            self.assertIn("DecimalValue", store)
            self.assertIn(
                'decimal_string_cell(row, "amount", "billing redeem amount")?',
                store,
            )
            self.assertIn(
                'decimal_string_cell(row, "amount", "billing recharge amount")?',
                store,
            )
            self.assertIn(
                "fn decimal_value_string(value: &str, field_name: &str) -> Result<String, DomainError>",
                store,
            )
            self.assertIn('format!("invalid {field_name}: {value}")', store)
            self.assertIn("points_to_money_string(credited_points)", store)
            self.assertNotIn("amount: decimal_cell(row, \"amount\")", store)
            self.assertNotIn("amount: credited_points as f64", store)
            self.assertNotIn('decimal_string_cell(row, "amount").unwrap', store)
            self.assertNotIn('unwrap_or_else(|_| "0.00".to_owned())', store)
            self.assertNotIn("fn decimal_cell", store)
            self.assertNotIn("parse::<f64>()", store)

    def test_billing_rust_stores_fail_closed_for_unknown_status_codes(self) -> None:
        for relative in [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/billing_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/billing_store.rs",
        ]:
            store = (ROOT / relative).read_text(encoding="utf-8")

            for signature in [
                "fn coupon_status_label(value: i64) -> Result<&'static str, DomainError>",
                "fn payment_status_label(value: i64) -> Result<&'static str, DomainError>",
            ]:
                self.assertIn(signature, store, relative)

            for fragment in [
                'coupon_status_label(required_status_cell(row, "status", "redeem")?)?.to_owned();',
                "let status = recharge_history_status(row)?.to_owned();",
                "unsupported billing coupon status",
                "unsupported billing payment status",
                "status => Err(DomainError::new(format!(",
            ]:
                self.assertIn(fragment, store, relative)

            for forbidden in [
                "fn coupon_status_label(value: i64) -> &'static str",
                "fn payment_status_label(value: i64) -> &'static str",
                '_ => "success"',
                '_ => "pending"',
                'unwrap_or_else(|_| "0.00".to_owned())',
            ]:
                self.assertNotIn(forbidden, store, relative)

    def test_billing_redeem_history_requires_coupon_status_without_database_default(self) -> None:
        for relative in [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/billing_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/billing_store.rs",
        ]:
            store = (ROOT / relative).read_text(encoding="utf-8")
            compact_store = " ".join(store.split())

            with self.subTest(store=relative):
                self.assertNotIn("COALESCE(uc.status, 0) AS status", store)
                self.assertNotIn("CAST(COALESCE(uc.status, 0) AS TEXT) AS status", store)
                self.assertIn("uc.status AS status", store)
                self.assertIn(
                    'let status = coupon_status_label(required_status_cell(row, "status", "redeem")?)?.to_owned();',
                    compact_store,
                )
                self.assertIn("missing billing redeem status from database row", store)

    def test_billing_recharge_history_statuses_are_source_aware_and_fail_closed(self) -> None:
        for relative in [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/billing_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/billing_store.rs",
        ]:
            store = (ROOT / relative).read_text(encoding="utf-8")
            compact_store = " ".join(store.split())

            with self.subTest(store=relative):
                self.assertNotIn("COALESCE(p.status, o.status, vr.status, 0) AS status", store)
                self.assertNotIn('let status = payment_status_label(integer_cell(row, "status"))?.to_owned();', store)
                self.assertIn("p.id AS payment_id", store)
                self.assertIn("vr.id AS recharge_id", store)
                self.assertIn("o.status AS order_status", store)
                self.assertIn("p.status AS payment_status", store)
                self.assertIn("vr.status AS recharge_status", store)
                self.assertIn(
                    'let order_status = order_recharge_status_label(required_status_cell(row, "order_status", "order")?)?;',
                    compact_store,
                )
                self.assertIn(
                    'let payment_status = related_status_cell(row, "payment_id", "payment_status", "payment")? .map(payment_status_label) .transpose()? .unwrap_or("pending");',
                    compact_store,
                )
                self.assertIn(
                    'let recharge_status = related_status_cell(row, "recharge_id", "recharge_status", "recharge")? .map(vip_recharge_status_label) .transpose()? .unwrap_or("pending");',
                    compact_store,
                )
                self.assertIn("fn recharge_history_status_label(", store)
                self.assertIn("fn order_recharge_status_label(value: i64) -> Result<&'static str, DomainError>", store)
                self.assertIn("fn vip_recharge_status_label(value: i64) -> Result<&'static str, DomainError>", store)
                self.assertIn("missing billing recharge order status from database row", store)
                self.assertIn("missing billing recharge payment status from database row", store)
                self.assertIn("missing billing recharge recharge status from database row", store)
                self.assertIn("unsupported billing order status", store)
                self.assertIn("unsupported billing vip recharge status", store)

    def test_console_billing_money_uses_exact_decimal_strings(self) -> None:
        billing_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-billing"
            / "src"
            / "billingService.ts"
        ).read_text(encoding="utf-8")
        billing_view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-billing"
            / "src"
            / "BillingView.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("amount: string", billing_service)
        self.assertIn("amount?: string", billing_service)
        self.assertIn("readRequiredMoneyString", billing_service)
        self.assertIn("readOptionalMoneyString(data, 'amount', 'Redeem amount must be a money string')", billing_service)
        self.assertIn("'Redeem history amount must be a money string'", billing_service)
        self.assertIn("'Recharge history amount must be a money string'", billing_service)
        self.assertIn("readRequiredString(item, 'date', 'Redeem history date is required')", billing_service)
        self.assertIn("readRequiredString(item, 'method', 'Recharge history payment method is required')", billing_service)
        self.assertIn("throw new Error(`Unsupported billing status: ${status}`)", billing_service)
        self.assertNotIn("amount: number", billing_service)
        self.assertNotIn("amount?: number", billing_service)
        self.assertNotIn("readNumber(data, 'amount')", billing_service)
        self.assertNotIn("readNumber(item, 'amount')", billing_service)
        self.assertNotIn("function readMoneyString", billing_service)
        self.assertNotIn("amount: readMoneyString(item, 'amount')", billing_service)
        self.assertNotIn("date: readString(item, 'date')", billing_service)
        self.assertNotIn("return 'success';", billing_service)

        self.assertIn("useState<string>('')", billing_view)
        self.assertIn("selectedAmount, setSelectedAmount] = useState<string | null>", billing_view)
        self.assertIn("moneyCents(", billing_view)
        self.assertIn("pointsForAmount(", billing_view)
        self.assertIn("formatMoneyAmount(", billing_view)
        self.assertNotIn("useState<number | ''>", billing_view)
        self.assertNotIn("Number(rechargeAmount)", billing_view)
        self.assertNotIn("item.amount.toFixed", billing_view)
        self.assertNotIn("amt * 10", billing_view)

    def test_console_billing_ui_has_retryable_load_states_without_fake_finance_data(self) -> None:
        billing_view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-billing"
            / "src"
            / "BillingView.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("BusinessStateTableRow", billing_view)
        self.assertIn("loadError", billing_view)
        self.assertIn("accountLoadError", billing_view)
        self.assertIn("historyLoadError", billing_view)
        self.assertIn("loadAccountSummary", billing_view)
        self.assertIn("loadHistory", billing_view)
        self.assertIn("onRetry={() => { void loadHistory(); }}", billing_view)
        self.assertIn("onRetry={() => { void loadAccountSummary(); }}", billing_view)
        self.assertIn("await AccountService.fetchAccountDetails()", billing_view)
        self.assertIn("await BillingService.fetchRedeemHistory()", billing_view)
        self.assertIn("await BillingService.fetchRechargeHistory()", billing_view)
        self.assertNotIn("console.error", billing_view)
        self.assertNotIn("emptyAccountStats", billing_view)
        self.assertNotIn("setAccountSummary(emptyAccountStats())", billing_view)
        self.assertNotIn('<Loader2 className="w-6 h-6 animate-spin', billing_view)

    def test_console_billing_hides_unsupported_download_actions_until_contract_exists(self) -> None:
        billing_view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-billing"
            / "src"
            / "BillingView.tsx"
        ).read_text(encoding="utf-8")
        billing_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-billing"
            / "src"
            / "billingService.ts"
        ).read_text(encoding="utf-8")
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")
        redeem_history_marker = (
            "  - route: /console/billing\n"
            "    source: apps/sdkwork-claw-router-portal/packages/"
            "sdkwork-claw-router-console-billing/src/billingService.ts\n"
            "    operation: fetchRedeemHistory"
        )
        redeem_history_start = contract.index(redeem_history_marker)
        checkout_contract_start = contract.index("  - route: /console/checkout", redeem_history_start + 1)
        billing_read_contract = contract[redeem_history_start:checkout_contract_start]
        redeem_code_marker = (
            "  - route: /console/billing\n"
            "    source: apps/sdkwork-claw-router-portal/packages/"
            "sdkwork-claw-router-console-billing/src/billingService.ts\n"
            "    operation: redeemCode"
        )
        redeem_code_start = contract.index(redeem_code_marker)
        next_operation_start = contract.index("\n  - route:", redeem_code_start + 1)
        billing_redeem_contract = contract[redeem_code_start:next_operation_start]
        billing_contract = billing_read_contract + billing_redeem_contract

        self.assertIn("readOnlyBillingDownloads", billing_view)
        self.assertNotIn("<Download", billing_view)
        self.assertNotIn("download poster", billing_view.lower())
        for unsupported_action in [
            "downloadPromotionPoster",
            "downloadPoster",
            "exportBilling",
            "downloadInvoice",
            "handleDownload",
            "static async download",
            "static async export",
        ]:
            self.assertNotIn(unsupported_action, billing_view)
            self.assertNotIn(unsupported_action, billing_service)
        self.assertIn("operation: fetchRedeemHistory", billing_contract)
        self.assertIn("operation: fetchRechargeHistory", billing_contract)
        self.assertNotIn("operation: download", billing_contract)
        self.assertNotIn("operation: downloadPromotionPoster", billing_contract)
        self.assertNotIn("operation: exportBilling", billing_contract)

    def test_console_redeem_standalone_fake_entry_is_removed_in_favor_of_billing_contract(self) -> None:
        portal_package = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "package.json"
        ).read_text(encoding="utf-8")
        portal_app = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "src"
            / "App.tsx"
        ).read_text(encoding="utf-8")
        pnpm_lock = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "pnpm-lock.yaml"
        ).read_text(encoding="utf-8")
        billing_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-billing"
            / "src"
            / "billingService.ts"
        ).read_text(encoding="utf-8")
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")
        standalone_redeem_package = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-redeem"
        )
        standalone_source_files = [
            path
            for path in standalone_redeem_package.glob("src/**/*")
            if path.is_file()
        ]
        standalone_source = "\n".join(
            path.read_text(encoding="utf-8") for path in standalone_source_files
        )

        self.assertIn("getClawRouterAppSdkClient().coupon.redeemCode", billing_service)
        self.assertIn("getClawRouterAppSdkClient().coupon.fetchRedeemHistory", billing_service)
        self.assertNotIn("getClawRouterAppSdkClient().coupons.", billing_service)
        self.assertIn("route: /console/billing", contract)
        self.assertIn("operation: redeemCode", contract)
        self.assertIn("operation: fetchRedeemHistory", contract)

        for forbidden in [
            "sdkwork-claw-router-console-redeem",
            "console/redeem",
            "RedeemView",
        ]:
            self.assertNotIn(forbidden, portal_package)
            self.assertNotIn(forbidden, portal_app)
            self.assertNotIn(forbidden, pnpm_lock)

        for forbidden_fake_runtime in [
            "Mock API call",
            "setTimeout(",
            "GIFT-2026-TEST",
            "setSuccessMessage",
            "setErrorMessage",
        ]:
            self.assertNotIn(forbidden_fake_runtime, standalone_source)

    def test_admin_finance_money_uses_exact_decimal_strings(self) -> None:
        sqlite_store = (
            ROOT / "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/admin_finance_store.rs"
        ).read_text(encoding="utf-8")
        postgres_store = (
            ROOT / "services/sdkwork-claw-product/src/infrastructure/sql/postgres/admin_finance_store.rs"
        ).read_text(encoding="utf-8")
        finance_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-admin-finance"
            / "src"
            / "financeService.ts"
        ).read_text(encoding="utf-8")
        finance_view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-admin-finance"
            / "src"
            / "index.tsx"
        ).read_text(encoding="utf-8")

        for field in ["amount", "balance", "totalCost"]:
            self.assertIn(f"{field}: string", finance_service)
            self.assertNotIn(f"{field}: number", finance_service)
            self.assertNotIn(f"readNumber(item, '{field}')", finance_service)

        for store in [sqlite_store, postgres_store]:
            compact_store = " ".join(store.split())
            self.assertIn("DecimalValue", store)
            self.assertIn(
                'amount: decimal_string_cell(&row, "amount", 2, "admin finance transaction amount")?,',
                store,
            )
            self.assertIn(
                'balance: decimal_string_cell(&row, "balance", 2, "admin finance transaction balance")?,',
                store,
            )
            self.assertIn(
                'total_cost: decimal_string_cell(&row, "total_cost", 2, "admin finance billing total cost")?,',
                store,
            )
            self.assertIn('let status_source = string_cell(&row, "status_source");', store)
            self.assertIn(
                'let status_code = transaction_status_cell(&row, &status_source)?;',
                store,
            )
            self.assertIn(
                'status: transaction_status_label(&status_source, status_code)?.to_owned(),',
                compact_store,
            )
            for forbidden_transaction_status_projection in [
                "COALESCE(h.status, p.status, r.status, o.status, 0) AS status_code",
                "COALESCE(r.status, p.status, o.status, 2) AS status_code",
                'integer_cell(&row, "status_code")',
                "SELECT id, occurred_at, user_id, normalized_type, amount, balance, description, status_source, status_code, normalized_status",
            ]:
                self.assertNotIn(forbidden_transaction_status_projection, store)
            for required_transaction_status_projection in [
                "h.status AS transaction_status_code",
                "p.status AS payment_status_code",
                "r.status AS refund_status_code",
                "o.status AS order_status_code",
                "status_source, transaction_status_code, payment_status_code, refund_status_code, order_status_code, normalized_status",
                "fn transaction_status_cell(",
                "missing admin finance transaction status",
            ]:
                self.assertIn(required_transaction_status_projection, store)
            self.assertIn(
                'status: billing_status_label(',
                store,
            )
            self.assertNotIn("COALESCE(s.payment_status, 0) AS payment_status_code", store)
            self.assertNotIn("COALESCE(s.statement_status, 0) AS statement_status_code", store)
            self.assertNotIn("COALESCE(pi.status, 0) AS invoice_status_code", store)
            self.assertIn("s.payment_status AS payment_status_code", store)
            self.assertIn("s.statement_status AS statement_status_code", store)
            self.assertIn("pi.id AS invoice_id", store)
            self.assertIn("pi.status AS invoice_status_code", store)
            self.assertIn(
                'required_billing_status_cell(&row, "payment_status_code", "payment")?',
                compact_store,
            )
            self.assertIn(
                'required_billing_status_cell(&row, "statement_status_code", "statement")?',
                compact_store,
            )
            self.assertIn(
                'related_billing_status_cell(&row, "invoice_id", "invoice_status_code", "invoice")?',
                compact_store,
            )
            self.assertIn("missing admin finance billing status payment", store)
            self.assertIn("missing admin finance billing status statement", store)
            self.assertIn("missing admin finance billing status invoice", store)
            self.assertIn("fn transaction_status_label(", store)
            self.assertIn("source: &str,", store)
            self.assertIn("status: Option<i64>,", store)
            self.assertIn(") -> Result<&'static str, DomainError>", store)
            self.assertIn("fn billing_status_label(", store)
            self.assertIn("unsupported admin finance transaction status", store)
            self.assertIn("unsupported admin finance billing status", store)
            self.assertIn(
                "fn decimal_value_string(",
                store,
            )
            self.assertIn("value: &str,", store)
            self.assertIn("digits: u32,", store)
            self.assertIn("field_name: &str,", store)
            self.assertIn(") -> Result<String, DomainError>", store)
            self.assertIn('format!("invalid {field_name}: {value}")', store)
            self.assertNotIn("DecimalValue::ZERO.to_fixed_string(digits)", store)
            self.assertNotIn("ELSE 'success'", store)
            self.assertNotIn("ELSE 'unpaid'", store)
            self.assertNotIn("row_to_transaction(row: sqlx::sqlite::SqliteRow) -> AdminTransactionRecordItem", store)
            self.assertNotIn("row_to_transaction(row: sqlx::postgres::PgRow) -> AdminTransactionRecordItem", store)

        self.assertIn("readMoneyString", finance_service)
        self.assertIn("formatCurrency = (amount: string)", finance_view)
        self.assertIn("isPositiveMoney(t.amount)", finance_view)
        self.assertIn("moneyCents(", finance_view)
        self.assertNotIn("formatCurrency = (amount: number)", finance_view)
        self.assertNotIn("t.amount > 0", finance_view)

    def test_console_billing_uses_precise_app_sdk_response_contracts(self) -> None:
        contract = (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(
            encoding="utf-8"
        )
        openapi = (ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json").read_text(
            encoding="utf-8"
        )
        coupons_api = (ROOT / "sdks" / "clawrouter-app-sdk" / "src" / "api" / "coupon.ts").read_text(
            encoding="utf-8"
        )
        payments_api = (ROOT / "sdks" / "clawrouter-app-sdk" / "src" / "api" / "payment.ts").read_text(
            encoding="utf-8"
        )
        billing_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-billing"
            / "src"
            / "billingService.ts"
        ).read_text(encoding="utf-8")

        for schema_name in [
            "BillingRedeemHistoryResponse",
            "BillingRechargeHistoryResponse",
            "RedeemCodeResponse",
        ]:
            self.assertIn(f"name: {schema_name}", contract)
            self.assertIn(f'"{schema_name}"', openapi)

        self.assertIn('"FetchRedeemHistoryResult"', openapi)
        self.assertIn('"FetchRechargeHistoryResult"', openapi)
        self.assertIn('"RedeemCodeResult"', openapi)
        self.assertIn('"$ref": "#/components/schemas/BillingRedeemHistoryResponse"', openapi)
        self.assertIn('"$ref": "#/components/schemas/BillingRechargeHistoryResponse"', openapi)
        self.assertIn('"$ref": "#/components/schemas/RedeemCodeResponse"', openapi)

        self.assertIn(
            "async fetchRedeemHistory(params?: QueryParams): Promise<FetchRedeemHistoryResult>",
            coupons_api,
        )
        self.assertIn("get<FetchRedeemHistoryResult>", coupons_api)
        self.assertIn("async redeemCode(body: RedeemCodeRequest): Promise<RedeemCodeResult>", coupons_api)
        self.assertIn("post<RedeemCodeResult>", coupons_api)
        self.assertIn(
            "async fetchRechargeHistory(params?: QueryParams): Promise<FetchRechargeHistoryResult>",
            payments_api,
        )
        self.assertIn("get<FetchRechargeHistoryResult>", payments_api)
        self.assertNotIn("fetchRedeemHistory(params?: QueryParams): Promise<PlusApiResult>", coupons_api)
        self.assertNotIn("redeemCode(body?: OperationRequest): Promise<PlusApiResult>", coupons_api)
        self.assertNotIn("fetchRechargeHistory(params?: QueryParams): Promise<PlusApiResult>", payments_api)

        result_checks = {
            "fetch-redeem-history-result.ts": "data?: BillingRedeemHistoryResponse;",
            "fetch-recharge-history-result.ts": "data?: BillingRechargeHistoryResponse;",
            "redeem-code-result.ts": "data?: RedeemCodeResponse;",
        }
        for file_name, expected in result_checks.items():
            result_path = ROOT / "sdks" / "clawrouter-app-sdk" / "src" / "types" / file_name
            self.assertTrue(result_path.exists(), file_name)
            self.assertIn(expected, result_path.read_text(encoding="utf-8"))

        self.assertIn("BillingRedeemHistoryResponse as SdkBillingRedeemHistoryResponse", billing_service)
        self.assertIn("BillingRechargeHistoryResponse as SdkBillingRechargeHistoryResponse", billing_service)
        self.assertIn("RedeemCodeResponse as SdkRedeemCodeResponse", billing_service)
        self.assertIn("id: SdkBillingRedeemHistoryResponse[number]['id'];", billing_service)
        self.assertIn("orderNo: SdkBillingRechargeHistoryResponse[number]['orderNo'];", billing_service)
        self.assertIn("amount?: SdkRedeemCodeResponse['amount'];", billing_service)


if __name__ == "__main__":
    unittest.main()
