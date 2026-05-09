import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class CheckoutRuntimeStandardTest(unittest.TestCase):
    def test_console_checkout_contract_is_backed_by_real_app_route(self) -> None:
        contract = (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(
            encoding="utf-8"
        )
        product_api_mod = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "mod.rs"
        ).read_text(encoding="utf-8")
        app_api = (ROOT / "services" / "sdkwork-claw-app-api" / "src" / "lib.rs").read_text(
            encoding="utf-8"
        )

        self.assertIn("operation: fetchCheckoutStatus", contract)
        self.assertIn("api_path: /app/v3/api/payments/checkout/{orderNo}", contract)
        self.assertIn("read_sources: [plus_order, plus_payment, plus_vip_recharge]", contract)

        self.assertTrue(
            (ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_checkout.rs").exists()
        )
        self.assertIn("app_checkout_router", product_api_mod)
        self.assertIn("app_checkout_router_with_store", product_api_mod)
        self.assertIn("app_checkout_router()", app_api)
        self.assertIn("app_checkout_router_with_store", app_api)
        self.assertIn("CheckoutStore", app_api)
        self.assertIn("SqliteCheckoutStore", app_api)
        self.assertIn("PostgresCheckoutStore", app_api)
        self.assertIn("app_request_subject_boundary", app_api)

    def test_checkout_port_and_api_define_read_only_status_contract(self) -> None:
        ports_mod = (ROOT / "services" / "sdkwork-claw-product" / "src" / "ports" / "mod.rs").read_text(
            encoding="utf-8"
        )
        checkout_port = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "ports" / "checkout_store.rs"
        ).read_text(encoding="utf-8")
        app_checkout = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_checkout.rs"
        ).read_text(encoding="utf-8")

        self.assertIn("CheckoutStore", ports_mod)
        self.assertIn("CheckoutReadFuture", ports_mod)
        self.assertIn("CheckoutSubject", checkout_port)
        self.assertIn("CheckoutStatusSnapshot", checkout_port)
        self.assertIn("load_checkout_status", checkout_port)

        self.assertIn('"/app/v3/api/payments/checkout/{order_no}"', app_checkout)
        self.assertIn("Path(order_no): Path<String>", app_checkout)
        self.assertIn("validate_checkout_order_no", app_checkout)
        self.assertIn("checkout order number must not be empty", app_checkout)
        self.assertIn("checkout order number length must not exceed", app_checkout)
        self.assertIn('PlusApiResult::error("4001"', app_checkout)
        self.assertIn('PlusApiResult::error("4010"', app_checkout)
        self.assertIn('PlusApiResult::error("4090"', app_checkout)
        self.assertIn('PlusApiResult::error("5000"', app_checkout)

    def test_sql_checkout_stores_read_payment_facts_with_subject_scope(self) -> None:
        for relative in [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/checkout_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/checkout_store.rs",
        ]:
            store = (ROOT / relative).read_text(encoding="utf-8")
            self.assertIn("plus_order", store)
            self.assertIn("plus_payment", store)
            self.assertIn("plus_vip_recharge", store)
            self.assertIn("subject.tenant_id", store)
            self.assertIn("subject.organization_id", store)
            self.assertIn("subject.user_id", store)
            self.assertIn("o.order_sn", store)
            self.assertIn("o.out_trade_no", store)
            self.assertIn("p.out_trade_no", store)
            self.assertIn("load_checkout_status", store)
            self.assertIn("payment_status_label", store)
            self.assertIn("checkout_status_label", store)
            self.assertIn('1 => Ok("success")', store)
            self.assertIn('2 => Ok("failed")', store)
            self.assertIn('0 | 3 => Ok("pending")', store)
            self.assertIn("unsupported checkout order status", store)
            self.assertIn("unsupported checkout payment status", store)
            self.assertIn("unsupported checkout recharge status", store)
            self.assertIn(
                'amount: decimal_string_cell(row, "amount", "checkout amount")?',
                store,
            )
            self.assertIn(
                "fn decimal_value_string(value: &str, field_name: &str) -> Result<String, DomainError>",
                store,
            )
            self.assertIn('format!("invalid {field_name}: {value}")', store)
            self.assertNotIn('_ => "pending"', store)
            self.assertNotIn('amount: decimal_string_cell(row, "amount"),', store)
            self.assertNotIn('unwrap_or_else(|_| "0.00".to_owned())', store)
            self.assertNotIn("INSERT INTO", store.upper())
            self.assertNotIn("UPDATE ", store.upper())
            self.assertNotIn("DELETE FROM", store.upper())

    def test_checkout_status_mapping_matches_java_trade_enums(self) -> None:
        order_enum = (
            ROOT.parent.parent
            / "spring-ai-plus-business-entity"
            / "src/main/java/com/sdkwork/spring/ai/plus/enums/trade/OrderStatus.java"
        ).read_text(encoding="utf-8")
        payment_enum = (
            ROOT.parent.parent
            / "spring-ai-plus-business-entity"
            / "src/main/java/com/sdkwork/spring/ai/plus/enums/trade/PaymentStatus.java"
        ).read_text(encoding="utf-8")
        recharge_entity = (
            ROOT.parent.parent
            / "spring-ai-plus-business-entity"
            / "src/main/java/com/sdkwork/spring/ai/plus/entity/vip/PlusVipRecharge.java"
        ).read_text(encoding="utf-8")

        self.assertIn('PAID(2, "trade.status.order.paid"', order_enum)
        self.assertIn('DELIVERED(3, "trade.status.order.delivered"', order_enum)
        self.assertIn('COMPLETED(4, "trade.status.order.completed"', order_enum)
        self.assertIn('CANCELLED(5, "trade.status.order.cancelled"', order_enum)
        self.assertIn('REFUNDING(6, "trade.status.order.refunding"', order_enum)
        self.assertIn('PARTIAL_REFUND(7, "trade.status.order.partial_refund"', order_enum)
        self.assertIn('FULL_REFUND(8, "trade.status.order.full_refund"', order_enum)
        self.assertIn('SUCCESS(2, "trade.status.payment.success"', payment_enum)
        self.assertIn('FAILED(3, "trade.status.payment.failed"', payment_enum)
        self.assertIn('TIMEOUT(4, "trade.status.payment.timeout"', payment_enum)
        self.assertIn('CLOSED(5, "trade.status.payment.closed"', payment_enum)
        self.assertIn("Recharge status (1-Success 2-Failed 3-Processing)", recharge_entity)

        for relative in [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/checkout_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/checkout_store.rs",
        ]:
            store = (ROOT / relative).read_text(encoding="utf-8")
            self.assertIn('2 | 3 | 4 => Ok("success")', store)
            self.assertIn('5 => Ok("expired")', store)
            self.assertIn('6 => Ok("refunding")', store)
            self.assertIn('7 | 8 => Ok("refunded")', store)
            self.assertIn('3 => Ok("failed")', store)
            self.assertIn('4 | 5 => Ok("expired")', store)
            self.assertIn('1 => Ok("success")', store)
            self.assertIn('2 => Ok("failed")', store)
            self.assertIn('order_status == "refunded"', store)
            self.assertIn('order_status == "refunding"', store)
            self.assertIn('recharge_status == "success"', store)
            self.assertLess(
                store.index('order_status == "refunded"'),
                store.index('recharge_status == "success"'),
            )

    def test_checkout_rust_stores_fail_closed_for_unknown_status_codes(self) -> None:
        for relative in [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/checkout_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/checkout_store.rs",
        ]:
            store = (ROOT / relative).read_text(encoding="utf-8")
            compact_store = " ".join(store.split())

            for signature in [
                "fn map_checkout_status",
                ") -> Result<CheckoutStatusSnapshot, DomainError>",
                "fn order_status_label(value: i64) -> Result<&'static str, DomainError>",
                "fn payment_status_label(value: i64) -> Result<&'static str, DomainError>",
                "fn recharge_status_label(value: i64) -> Result<&'static str, DomainError>",
            ]:
                self.assertIn(signature, store, relative)

            for fragment in [
                "row.as_ref().map(map_checkout_status).transpose()",
                "unsupported checkout order status",
                "unsupported checkout payment status",
                "unsupported checkout recharge status",
                "status => Err(DomainError::new(format!(",
            ]:
                self.assertIn(fragment, store, relative)

            for fragment in [
                'let order_status = order_status_label(required_status_cell(row, "order_status", "order")?)?.to_owned();',
                'let payment_status = payment_status_label(related_status_cell( row, "payment_id", "payment_status", "payment", )?)? .to_owned();',
                'let recharge_status = recharge_status_label(related_status_cell( row, "recharge_id", "recharge_status", "recharge", )?)? .to_owned();',
            ]:
                self.assertIn(fragment, compact_store, relative)

            for forbidden in [
                "fn map_checkout_status(row: &sqlx::sqlite::SqliteRow) -> CheckoutStatusSnapshot",
                "fn map_checkout_status(row: &sqlx::postgres::PgRow) -> CheckoutStatusSnapshot",
                "fn order_status_label(value: i64) -> &'static str",
                "fn payment_status_label(value: i64) -> &'static str",
                "fn recharge_status_label(value: i64) -> &'static str",
                '_ => "pending"',
            ]:
                self.assertNotIn(forbidden, store, relative)

    def test_checkout_rust_stores_fail_closed_for_missing_related_status_codes(self) -> None:
        for relative in [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/checkout_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/checkout_store.rs",
        ]:
            store = (ROOT / relative).read_text(encoding="utf-8")
            compact_store = " ".join(store.split())

            with self.subTest(store=relative):
                self.assertNotIn("COALESCE(o.status, 0) AS order_status", store)
                self.assertNotIn("COALESCE(p.status, 0) AS payment_status", store)
                self.assertNotIn("COALESCE(vr.status, 0) AS recharge_status", store)
                self.assertIn("p.id AS payment_id", store)
                self.assertIn("vr.id AS recharge_id", store)
                self.assertIn("o.status AS order_status", store)
                self.assertIn("p.status AS payment_status", store)
                self.assertIn("vr.status AS recharge_status", store)
                self.assertIn(
                    'let order_status = order_status_label(required_status_cell(row, "order_status", "order")?)?.to_owned();',
                    compact_store,
                )
                self.assertIn(
                    'related_status_cell( row, "payment_id", "payment_status", "payment", )?',
                    compact_store,
                )
                self.assertIn(
                    'related_status_cell( row, "recharge_id", "recharge_status", "recharge", )?',
                    compact_store,
                )
                self.assertIn("missing checkout order status from database row", store)
                self.assertIn("missing checkout payment status from database row", store)
                self.assertIn("missing checkout recharge status from database row", store)

    def test_console_checkout_uses_sdk_status_and_has_no_fake_success_branch(self) -> None:
        checkout_view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-billing"
            / "src"
            / "CheckoutView.tsx"
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
        recharge_index = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-recharge"
            / "src"
            / "index.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("getClawRouterAppSdkClient().payment.fetchCheckoutStatus", checkout_service)
        self.assertIn("requiredSafePathSegment(orderNo, 'orderNo')", checkout_service)
        self.assertIn(".payment.fetchCheckoutStatus(normalizedOrderNo)", checkout_service)
        self.assertIn("readRequiredString(item, 'orderNo', 'Checkout order number is required')", checkout_service)
        self.assertIn("readRequiredMoneyString(item, 'amount', 'Checkout amount is required', 'Checkout amount must be a money string')", checkout_service)
        self.assertIn("readRequiredNonNegativeNumber(item, 'points', 'Checkout points are required')", checkout_service)
        self.assertIn("readRequiredStringAllowEmpty(item, 'outTradeNo', 'Checkout outer trade number is required')", checkout_service)
        self.assertIn("throw new Error(`Unsupported checkout ${label}: ${status}`)", checkout_service)
        self.assertNotIn("fetch('/app/v3/api", checkout_service)
        self.assertNotIn("axios", checkout_service)
        self.assertNotIn(".payment.fetchCheckoutStatus(orderNo)", checkout_service)
        self.assertNotIn(".payments.fetchCheckoutStatus", checkout_service)
        self.assertNotIn("amount: readMoneyString(item, 'amount')", checkout_service)
        self.assertNotIn("points: readNumber(item, 'points')", checkout_service)
        self.assertNotIn("return 'pending';", checkout_service)

        self.assertIn("CheckoutService.fetchCheckoutStatus", checkout_view)
        self.assertIn("RechargeService.submitRecharge", checkout_view)
        self.assertIn("export * from './rechargeService'", recharge_index)
        self.assertIn("'refunding' | 'refunded'", checkout_service)
        self.assertIn("CHECKOUT_PAYMENT_STATUSES", checkout_service)
        self.assertIn("'refunding', 'refunded'", checkout_service)
        self.assertIn("checkoutStatusNotice(status)", checkout_view)
        self.assertIn("isTerminalCheckoutStatus(status)", checkout_view)
        self.assertIn("orderNo", checkout_view)
        self.assertNotIn("handleSimulatePayment", checkout_view)
        self.assertNotIn("setTimeout", checkout_view)
        self.assertNotIn("setIsSuccess(true)", checkout_view)
        self.assertNotIn("isSuccess", checkout_view)

    def test_console_checkout_ui_has_retryable_business_states_without_console_only_errors(self) -> None:
        checkout_view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-billing"
            / "src"
            / "CheckoutView.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("BusinessStatePanel", checkout_view)
        self.assertIn("getCheckoutErrorMessage", checkout_view)
        self.assertIn("loadError", checkout_view)
        self.assertIn("checkoutError", checkout_view)
        self.assertIn("loadCheckoutStatus", checkout_view)
        self.assertIn("handleCreateCheckoutOrder", checkout_view)
        self.assertIn("useCallback", checkout_view)
        self.assertIn("isActive: () => boolean", checkout_view)
        self.assertIn("return () =>", checkout_view)
        self.assertIn("setLoadError(getCheckoutErrorMessage", checkout_view)
        self.assertIn("setCheckoutError(getCheckoutErrorMessage", checkout_view)
        self.assertIn("onRetry={() => { void loadCheckoutStatus(orderNo); }}", checkout_view)
        self.assertIn("void loadCheckoutStatus(orderNo);", checkout_view)
        self.assertIn("void handleCreateCheckoutOrder();", checkout_view)
        self.assertIn("await CheckoutService.fetchCheckoutStatus", checkout_view)
        self.assertIn("await RechargeService.submitRecharge", checkout_view)
        self.assertIn("data-business-state={loadError ? 'error' : undefined}", checkout_view)
        self.assertNotIn("console.error", checkout_view)
        self.assertNotIn("setErrorMsg", checkout_view)

    def test_console_checkout_uses_precise_app_sdk_response_contract(self) -> None:
        contract = (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(
            encoding="utf-8"
        )
        openapi = (ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json").read_text(
            encoding="utf-8"
        )
        payments_api = (ROOT / "sdks" / "clawrouter-app-sdk" / "src" / "api" / "payment.ts").read_text(
            encoding="utf-8"
        )
        checkout_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-billing"
            / "src"
            / "checkoutService.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("name: CheckoutStatusResponse", contract)
        self.assertIn('"CheckoutStatusResponse"', openapi)
        self.assertIn('"FetchCheckoutStatusResult"', openapi)
        self.assertIn('"$ref": "#/components/schemas/CheckoutStatusResponse"', openapi)
        self.assertIn(
            "async fetchCheckoutStatus(orderNo: string | number, params?: QueryParams): Promise<FetchCheckoutStatusResult>",
            payments_api,
        )
        self.assertIn("get<FetchCheckoutStatusResult>", payments_api)
        self.assertNotIn("fetchCheckoutStatus(orderNo: string | number, params?: QueryParams): Promise<PlusApiResult>", payments_api)

        result_path = ROOT / "sdks" / "clawrouter-app-sdk" / "src" / "types" / "fetch-checkout-status-result.ts"
        self.assertTrue(result_path.exists())
        self.assertIn("data?: CheckoutStatusResponse;", result_path.read_text(encoding="utf-8"))

        self.assertIn("CheckoutStatusResponse as SdkCheckoutStatusResponse", checkout_service)
        self.assertIn("orderNo: SdkCheckoutStatusResponse['orderNo'];", checkout_service)
        self.assertIn("amount: string & SdkCheckoutStatusResponse['amount'];", checkout_service)
        self.assertIn("paymentStatus: SdkCheckoutStatusResponse['paymentStatus'];", checkout_service)


if __name__ == "__main__":
    unittest.main()
