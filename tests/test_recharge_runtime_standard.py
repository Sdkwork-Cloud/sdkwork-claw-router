import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class RechargeRuntimeStandardTest(unittest.TestCase):
    def test_console_recharge_contracts_are_backed_by_real_app_routes(self) -> None:
        contract = (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(
            encoding="utf-8"
        )
        product_api_mod = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "mod.rs"
        ).read_text(encoding="utf-8")
        app_api = (ROOT / "services" / "sdkwork-claw-app-api" / "src" / "lib.rs").read_text(
            encoding="utf-8"
        )

        self.assertIn("operation: fetchPackages", contract)
        self.assertIn("api_path: /app/v3/api/billing/account/points/recharges/packages", contract)
        self.assertIn("operation_id: consoleRecharge.packages.fetch", contract)
        self.assertIn("openapi_exposed: false", contract)
        self.assertIn("operation: submitRecharge", contract)
        self.assertIn("api_path: /app/v3/api/billing/account/points/recharges", contract)
        self.assertIn("operation_id: account.points.recharges.create", contract)
        self.assertIn("idempotency_required: true", contract)
        self.assertIn("write_tables: [plus_vip_recharge, plus_order, plus_order_item, plus_payment]", contract)

        self.assertTrue(
            (ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_recharge.rs").exists()
        )
        self.assertIn("app_recharge_router", product_api_mod)
        self.assertIn("app_recharge_router_with_store", product_api_mod)
        self.assertIn("app_recharge_router()", app_api)
        self.assertIn("app_recharge_router_with_store", app_api)
        self.assertIn("RechargeStore", app_api)
        self.assertIn("SqliteRechargeStore", app_api)
        self.assertIn("PostgresRechargeStore", app_api)
        self.assertIn("app_request_subject_boundary", app_api)

    def test_recharge_port_and_api_define_runtime_contracts(self) -> None:
        ports_mod = (ROOT / "services" / "sdkwork-claw-product" / "src" / "ports" / "mod.rs").read_text(
            encoding="utf-8"
        )
        recharge_port = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "ports" / "recharge_store.rs"
        ).read_text(encoding="utf-8")
        app_recharge = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_recharge.rs"
        ).read_text(encoding="utf-8")

        self.assertIn("RechargeStore", ports_mod)
        self.assertIn("RechargeReadFuture", ports_mod)
        self.assertIn("RechargeCommandFuture", ports_mod)
        self.assertIn("RechargePackage", recharge_port)
        self.assertIn("RechargeSubject", recharge_port)
        self.assertIn("SubmitRechargeCommand", recharge_port)
        self.assertIn("SubmitRechargeOutcome", recharge_port)

        self.assertIn('"/app/v3/api/billing/account/points/recharges/packages"', app_recharge)
        self.assertIn('"/app/v3/api/billing/account/points/recharges"', app_recharge)
        self.assertIn("EmptyRechargeStore", app_recharge)
        self.assertIn("validate_submit_recharge_request", app_recharge)
        self.assertIn("recharge amount must be greater than zero", app_recharge)
        self.assertIn("recharge amount must not exceed", app_recharge)
        self.assertIn("payment method must not be empty", app_recharge)
        self.assertIn('PlusApiResult::error("4001"', app_recharge)
        self.assertIn('PlusApiResult::error("4090"', app_recharge)
        self.assertIn('PlusApiResult::error("5000"', app_recharge)

    def test_recharge_amount_uses_exact_decimal_contract_not_binary_float(self) -> None:
        recharge_port = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "ports" / "recharge_store.rs"
        ).read_text(encoding="utf-8")
        checkout_port = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "ports" / "checkout_store.rs"
        ).read_text(encoding="utf-8")
        app_recharge = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_recharge.rs"
        ).read_text(encoding="utf-8")
        sqlite_store = (
            ROOT / "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/recharge_store.rs"
        ).read_text(encoding="utf-8")
        postgres_store = (
            ROOT / "services/sdkwork-claw-product/src/infrastructure/sql/postgres/recharge_store.rs"
        ).read_text(encoding="utf-8")
        sqlite_checkout_store = (
            ROOT / "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/checkout_store.rs"
        ).read_text(encoding="utf-8")
        postgres_checkout_store = (
            ROOT / "services/sdkwork-claw-product/src/infrastructure/sql/postgres/checkout_store.rs"
        ).read_text(encoding="utf-8")
        recharge_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-recharge"
            / "src"
            / "rechargeService.ts"
        ).read_text(encoding="utf-8")
        recharge_view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-recharge"
            / "src"
            / "RechargeView.tsx"
        ).read_text(encoding="utf-8")
        checkout_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-billing"
            / "src"
            / "checkoutService.ts"
        ).read_text(encoding="utf-8")
        checkout_view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-billing"
            / "src"
            / "CheckoutView.tsx"
        ).read_text(encoding="utf-8")
        runtime_doc = (ROOT / "docs" / "27-rust-runtime-and-sdk-integration-standard.md").read_text(
            encoding="utf-8"
        )
        module_doc = (ROOT / "docs" / "29-rust-backend-module-standard.md").read_text(
            encoding="utf-8"
        )

        self.assertIn("pub amount: String", recharge_port)
        self.assertIn("pub rmb: String", recharge_port)
        self.assertNotIn("pub amount: f64", recharge_port)
        self.assertNotIn("pub rmb: f64", recharge_port)
        self.assertIn("pub amount: String", checkout_port)
        self.assertNotIn("pub amount: f64", checkout_port)

        self.assertIn("amount: Option<serde_json::Value>", app_recharge)
        self.assertIn("parse_recharge_money_amount", app_recharge)
        self.assertIn("DecimalValue::parse", app_recharge)
        self.assertIn("recharge amount must not contain sub-cent precision", app_recharge)
        self.assertNotIn("amount: Option<f64>", app_recharge)
        self.assertNotIn("fn round_money", app_recharge)
        self.assertNotIn("MAX_RECHARGE_AMOUNT: f64", app_recharge)

        for store in [sqlite_store, postgres_store]:
            compact_store = " ".join(store.split())
            self.assertIn("DecimalValue", store)
            self.assertIn(
                'let rmb = decimal_string_cell(row, "rmb", "recharge package rmb")?;',
                compact_store,
            )
            self.assertIn("rmb,", store)
            self.assertIn(
                "fn decimal_value_string(value: &str, field_name: &str) -> Result<String, DomainError>",
                store,
            )
            self.assertIn('format!("invalid {field_name}: {value}")', store)
            self.assertIn(".bind(&command.amount)", store)
            self.assertIn("recharge_base_points(&command.amount)", store)
            self.assertIn("DecimalValue::parse(amount)", store)
            self.assertIn("if parsed_amount <= DecimalValue::ZERO", store)
            self.assertNotIn('rmb: decimal_string_cell(row, "rmb"),', store)
            self.assertNotIn('unwrap_or_else(|_| "0.00".to_owned())', store)
            self.assertNotIn("recharge_base_points(command.amount)", store)
            self.assertNotIn(".bind(command.amount)", store)
            self.assertNotIn("ABS(CAST(price AS REAL)", store)
            self.assertNotIn("ABS(CAST(price AS DOUBLE PRECISION)", store)
            self.assertNotIn("fn recharge_base_points(amount: f64)", store)
            self.assertNotIn("fn decimal_cell", store)

        self.assertIn("decimal_sql_match_keys(&command.amount)", sqlite_store)
        self.assertIn("CAST(price AS TEXT) IN (?3, ?4, ?5)", sqlite_store)
        self.assertIn("price = $3::numeric", postgres_store)

        for checkout_store in [sqlite_checkout_store, postgres_checkout_store]:
            self.assertIn("DecimalValue", checkout_store)
            self.assertIn(
                'decimal_string_cell(row, "amount", "checkout amount")?',
                checkout_store,
            )
            self.assertNotIn('amount: decimal_string_cell(row, "amount"),', checkout_store)
            self.assertNotIn("fn decimal_cell", checkout_store)
            self.assertNotIn("parse::<f64>()", checkout_store)

        self.assertIn("rmb: string", recharge_service)
        self.assertIn("submitRecharge(amount: string", recharge_service)
        self.assertIn("readRequiredMoneyString", recharge_service)
        self.assertIn("getClawRouterAppSdkClient().billing.account.points.recharges.create", recharge_service)
        self.assertIn("createRequestParams('commerce-points-recharge')", recharge_service)
        self.assertIn("amount: moneyAmount(amount, 'amount')", recharge_service)
        self.assertIn("method: requiredText(method, 'method')", recharge_service)
        self.assertIn("function isPositiveMoneyString", recharge_service)
        self.assertIn("'Recharge package money amount must be a money string'", recharge_service)
        self.assertIn("readRequiredNonNegativeNumber(item, 'bonus', 'Recharge package bonus is required')", recharge_service)
        self.assertIn("readRequiredBoolean(data, 'success', 'Recharge success flag is required')", recharge_service)
        self.assertIn("throw new Error('Recharge submission was not accepted')", recharge_service)
        self.assertIn("readRequiredMoneyString(data, 'amount', 'Recharge amount is required', 'Recharge amount must be a money string')", recharge_service)
        self.assertIn("readRequiredNonNegativeNumber(data, 'points', 'Recharge points are required')", recharge_service)
        self.assertNotIn("Number(normalized)", recharge_service)
        self.assertNotIn("rmb: number", recharge_service)
        self.assertNotIn("submitRecharge(amount: number", recharge_service)
        self.assertNotIn("readNumber(item, 'rmb')", recharge_service)
        self.assertNotIn("function readMoneyString", recharge_service)
        self.assertNotIn("rmb: readMoneyString(item, 'rmb')", recharge_service)
        self.assertNotIn("bonus: readNumber(item, 'bonus')", recharge_service)
        self.assertNotIn("success: readBoolean(data, 'success', true)", recharge_service)
        self.assertIn("const creditsReceived = selectedPackage?.points;", recharge_view)
        self.assertIn("pkg.points.toLocaleString()", recharge_view)
        self.assertIn("formatMoneyAmount(", recharge_view)
        self.assertNotIn("pkg.rmb * EXCHANGE_RATE", recharge_view)
        self.assertNotIn("currentSelectionAmount * EXCHANGE_RATE", recharge_view)
        self.assertIn("amount: string", checkout_service)
        self.assertIn("readRequiredMoneyString", checkout_service)
        self.assertIn("Checkout amount must be a money string", checkout_service)
        self.assertNotIn("amount: number", checkout_service)
        self.assertIn("formatMoneyAmount(", checkout_view)
        self.assertIn("const points = checkoutStatus?.points;", checkout_view)
        self.assertIn("points.toLocaleString()", checkout_view)
        self.assertNotIn("payableAmount * EXCHANGE_RATE", checkout_view)
        self.assertNotIn("payableAmount.toFixed", checkout_view)
        self.assertNotIn("checkoutStatus.amount.toFixed", checkout_view)

        for doc in [runtime_doc, module_doc]:
            self.assertIn("Recharge amounts must use the same exact decimal contract", doc)
            self.assertIn("binary floating-point arithmetic is forbidden", doc)
            self.assertIn("sub-cent recharge precision must be rejected", doc)

    def test_sql_recharge_stores_use_contract_sources_with_subject_scope_and_atomic_submit(self) -> None:
        for relative in [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/recharge_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/recharge_store.rs",
        ]:
            store = (ROOT / relative).read_text(encoding="utf-8")
            self.assertIn("plus_vip_recharge_pack", store)
            self.assertIn("plus_vip_recharge_method", store)
            self.assertIn("plus_product", store)
            self.assertIn("plus_sku", store)
            self.assertIn("plus_vip_recharge", store)
            self.assertIn("plus_order", store)
            self.assertIn("plus_order_item", store)
            self.assertIn("plus_payment", store)
            self.assertIn("BEGIN", store.upper())
            self.assertIn("COMMIT", store.upper())
            self.assertIn("subject.tenant_id", store)
            self.assertIn("subject.organization_id", store)
            self.assertIn("subject.user_id", store)
            self.assertIn("load_recharge_packages", store)
            self.assertIn("submit_recharge", store)
            self.assertIn("insert_order", store)
            self.assertIn("insert_order_item", store)
            self.assertIn("insert_payment", store)
            self.assertIn("insert_vip_recharge", store)

    def test_sql_recharge_stores_fail_closed_for_recharge_type_when_package_matches(self) -> None:
        for relative in [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/recharge_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/recharge_store.rs",
        ]:
            store = (ROOT / relative).read_text(encoding="utf-8")
            compact_store = " ".join(store.split())
            with self.subTest(store=relative):
                self.assertNotIn("COALESCE(recharge_type, 2) AS recharge_type", store)
                self.assertNotIn("CAST(COALESCE(recharge_type, 2) AS TEXT) AS recharge_type", store)
                self.assertTrue(
                    "recharge_type AS recharge_type" in store
                    or "CAST(recharge_type AS TEXT) AS recharge_type" in store
                )
                self.assertIn("const CUSTOM_RECHARGE_TYPE: i64 = 1;", store)
                self.assertIn("const PACK_RECHARGE_TYPE: i64 = 2;", store)
                self.assertIn("let recharge_type = pack", compact_store)
                self.assertIn(".as_ref()", compact_store)
                self.assertIn(".map(|item| item.recharge_type)", compact_store)
                self.assertIn(".unwrap_or(CUSTOM_RECHARGE_TYPE);", compact_store)
                self.assertIn(
                    'recharge_type: validate_recharge_type(required_integer_cell(',
                    compact_store,
                )
                self.assertIn('&row, "recharge_type", "recharge package",', compact_store)
                self.assertIn(')?)?', compact_store)
                self.assertNotIn('integer_cell(&row, "recharge_type").max(1)', compact_store)
                self.assertIn("fn validate_recharge_type(value: i64) -> Result<i64, DomainError>", store)
                self.assertIn("missing recharge package recharge_type from database row", store)
                self.assertIn("invalid recharge package recharge_type from database row", store)

    def test_console_recharge_uses_real_packages_submit_and_account_balance(self) -> None:
        recharge_view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-recharge"
            / "src"
            / "RechargeView.tsx"
        ).read_text(encoding="utf-8")
        service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-recharge"
            / "src"
            / "rechargeService.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("getClawRouterAppSdkClient().billing.account.points.recharges.packages.list()", service)
        self.assertIn("getClawRouterAppSdkClient().billing.account.points.recharges.create", service)
        self.assertNotIn("fetch('/app/v3/api", service)
        self.assertNotIn("axios", service)

        self.assertIn("AccountService.fetchAccountDetails()", recharge_view)
        self.assertIn("AccountStats", recharge_view)
        self.assertIn("accountSummary.availableCredits", recharge_view)
        self.assertNotIn("1,795.12", recharge_view)
        self.assertNotIn("useState(1795", recharge_view)

    def test_console_recharge_hides_unsupported_history_actions_until_contract_exists(self) -> None:
        contract = (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(
            encoding="utf-8"
        )
        recharge_view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-recharge"
            / "src"
            / "RechargeView.tsx"
        ).read_text(encoding="utf-8")
        recharge_contract_start = contract.index(
            "  - route: /console/recharge\n"
            "    source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-recharge/src/rechargeService.ts\n"
            "    operation: fetchPackages"
        )
        recharge_contract_end = contract.index("  - route: /console/routing", recharge_contract_start)
        recharge_contract = contract[recharge_contract_start:recharge_contract_end]

        self.assertIn("operation: fetchPackages", recharge_contract)
        self.assertIn("operation: submitRecharge", recharge_contract)
        self.assertNotIn("operation: fetchRechargeHistory", recharge_contract)
        self.assertNotIn("api_path: /app/v3/api/payments/records", recharge_contract)
        self.assertNotIn("download", recharge_contract.lower())
        self.assertNotIn("export", recharge_contract.lower())

        self.assertIn("readOnlyRechargeHistory", recharge_view)
        self.assertIn("RechargeService.submitRecharge", recharge_view)
        self.assertIn("navigate(`/console/checkout?orderNo=${encodeURIComponent(res.orderNo)}`)", recharge_view)
        self.assertNotIn("<History", recharge_view)
        self.assertNotIn("History,", recharge_view)
        self.assertNotIn("handleHistory", recharge_view)
        self.assertNotIn("fetchRechargeHistory", recharge_view)
        self.assertNotIn("download", recharge_view.lower())

    def test_console_recharge_ui_has_retryable_business_states_without_console_only_errors(self) -> None:
        recharge_view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-recharge"
            / "src"
            / "RechargeView.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("BusinessStatePanel", recharge_view)
        self.assertIn("getRechargeErrorMessage", recharge_view)
        self.assertIn("packagesLoading", recharge_view)
        self.assertIn("packagesLoadError", recharge_view)
        self.assertIn("accountLoading", recharge_view)
        self.assertIn("accountLoadError", recharge_view)
        self.assertIn("submitError", recharge_view)
        self.assertIn("loadRechargePackages", recharge_view)
        self.assertIn("loadAccountSummary", recharge_view)
        self.assertIn("useCallback", recharge_view)
        self.assertIn("isActive: () => boolean", recharge_view)
        self.assertIn("return () =>", recharge_view)
        self.assertIn("await RechargeService.fetchPackages()", recharge_view)
        self.assertIn("await AccountService.fetchAccountDetails()", recharge_view)
        self.assertIn("setPackagesLoadError(getRechargeErrorMessage", recharge_view)
        self.assertIn("setAccountLoadError(getRechargeErrorMessage", recharge_view)
        self.assertIn("setSubmitError(getRechargeErrorMessage", recharge_view)
        self.assertIn("onRetry={() => { void loadRechargePackages(); }}", recharge_view)
        self.assertIn("onRetry={() => { void loadAccountSummary(); }}", recharge_view)
        self.assertIn("data-business-state={loadError ? 'error' : undefined}", recharge_view)
        self.assertNotIn("console.error", recharge_view)
        self.assertNotIn("AccountService.fetchAccountDetails().then", recharge_view)

    def test_console_recharge_sdk_uses_operation_specific_payloads(self) -> None:
        billing_api = (ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "api" / "billing.ts").read_text(
            encoding="utf-8"
        )
        type_exports = (
            ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "types" / "index.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("SubmitRechargeRequest", billing_api)
        self.assertIn("AccountPointsRechargesCreateResult", billing_api)
        self.assertIn(
            "async create(body: SubmitRechargeRequest, params: BillingAccountPointsRechargesCreateParams): Promise<AccountPointsRechargesCreateResult>",
            billing_api,
        )
        self.assertIn("this.client.post<AccountPointsRechargesCreateResult>", billing_api)
        self.assertNotIn("async submitRecharge(body?: OperationRequest): Promise<PlusApiResult>", billing_api)
        self.assertIn("export type { SubmitRechargeRequest }", type_exports)
        self.assertIn("export type { SubmitRechargeResponse }", type_exports)
        self.assertIn("export type { AccountPointsRechargesCreateResult }", type_exports)

    def test_console_recharge_fetch_packages_uses_precise_app_sdk_response_contract(self) -> None:
        contract = (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(
            encoding="utf-8"
        )
        openapi = (ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json").read_text(
            encoding="utf-8"
        )
        billing_api = (ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "api" / "billing.ts").read_text(
            encoding="utf-8"
        )
        recharge_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-recharge"
            / "src"
            / "rechargeService.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("name: RechargePackagesResponse", contract)
        self.assertIn('"RechargePackagesResponse"', openapi)
        self.assertIn('"VipPacksListResult"', openapi)
        self.assertIn('"$ref": "#/components/schemas/RechargePackagesResponse"', openapi)
        self.assertIn("async list(): Promise<VipPacksListResult>", billing_api)
        self.assertIn("get<VipPacksListResult>", billing_api)
        self.assertNotIn("fetchPackages(params?: QueryParams): Promise<PlusApiResult>", billing_api)

        response_path = ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "types" / "recharge-packages-response.ts"
        result_path = ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "types" / "vip-packs-list-result.ts"
        self.assertTrue(response_path.exists())
        self.assertTrue(result_path.exists())
        self.assertIn("export type RechargePackagesResponse", response_path.read_text(encoding="utf-8"))
        self.assertIn("data?: RechargePackagesResponse;", result_path.read_text(encoding="utf-8"))

        self.assertIn("RechargePackagesResponse as SdkRechargePackagesResponse", recharge_service)
        self.assertIn("id: SdkRechargePackagesResponse[number]['id'];", recharge_service)
        self.assertIn("rmb: string & SdkRechargePackagesResponse[number]['rmb'];", recharge_service)
        self.assertIn("bonus: SdkRechargePackagesResponse[number]['bonus'];", recharge_service)


if __name__ == "__main__":
    unittest.main()
