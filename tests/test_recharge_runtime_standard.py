import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
APPBASE = ROOT / ".sdkwork" / "dependencies" / "sdkwork-appbase"


class RechargeRuntimeStandardTest(unittest.TestCase):
    def test_recharge_contracts_are_backed_by_appbase_router_not_product_local_code(self) -> None:
        contract = (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(
            encoding="utf-8"
        )
        product_api_mod = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "mod.rs"
        ).read_text(encoding="utf-8")
        product_ports_mod = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "ports" / "mod.rs"
        ).read_text(encoding="utf-8")
        app_api = (ROOT / "services" / "sdkwork-claw-app-api" / "src" / "lib.rs").read_text(
            encoding="utf-8"
        )
        appbase_http = (
            APPBASE
            / "packages/native-rust/commerce/sdkwork-commerce-http-rust/src/recharge_router.rs"
        ).read_text(encoding="utf-8")

        self.assertIn("operation: fetchRechargePackages", contract)
        self.assertIn("operation_id: console.rechargePackages.list", contract)
        self.assertIn("api_path: /app/v3/api/recharges/packages", contract)
        self.assertIn("operation: submitRecharge", contract)
        self.assertIn("operation_id: console.rechargeOrders.create", contract)
        self.assertIn("api_path: /app/v3/api/recharges/orders", contract)
        submit_operation_start = contract.index("operation: submitRecharge")
        submit_recharge_start = contract.rfind("- route: /console/recharge", 0, submit_operation_start)
        next_route_start = contract.index("\n- route:", submit_operation_start + 1)
        submit_recharge_contract = contract[submit_recharge_start:next_route_start]
        for table_name in [
            "- commerce_order",
            "- commerce_order_item",
            "- commerce_payment_intent",
            "- ops_audit_log",
        ]:
            self.assertIn(table_name, submit_recharge_contract)

        self.assertFalse(
            (ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_recharge.rs").exists()
        )
        self.assertFalse(
            (ROOT / "services" / "sdkwork-claw-product" / "src" / "ports" / "recharge_store.rs").exists()
        )
        self.assertFalse(
            (
                ROOT
                / "services"
                / "sdkwork-claw-product"
                / "src"
                / "infrastructure"
                / "sql"
                / "sqlite"
                / "recharge_store.rs"
            ).exists()
        )
        self.assertFalse(
            (
                ROOT
                / "services"
                / "sdkwork-claw-product"
                / "src"
                / "infrastructure"
                / "sql"
                / "postgres"
                / "recharge_store.rs"
            ).exists()
        )
        self.assertNotIn("app_recharge_router", product_api_mod)
        self.assertNotIn("RechargeStore", product_ports_mod)
        self.assertNotIn("RechargeStore", app_api)
        self.assertNotIn("app_recharge_router()", app_api)
        self.assertIn("app_recharge_checkout_router_with_sqlite_pool", app_api)
        self.assertIn("app_recharge_checkout_router_with_postgres_pool", app_api)
        self.assertIn("validate_recharge_amount", appbase_http)
        self.assertIn("validate_payment_method", appbase_http)
        self.assertIn("AppbaseRechargeCheckoutStore", appbase_http)

    def test_recharge_sql_write_path_is_defined_in_appbase_storage(self) -> None:
        for relative in [
            "packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/sqlite_recharge.rs",
            "packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/src/postgres_recharge.rs",
        ]:
            store = (APPBASE / relative).read_text(encoding="utf-8")
            compact_store = " ".join(store.split())

            self.assertIn("commerce_recharge_package", store)
            self.assertIn("commerce_payment_method", store)
            self.assertIn("commerce_product", store)
            self.assertIn("commerce_sku", store)
            self.assertIn("commerce_order", store)
            self.assertIn("commerce_order_item", store)
            self.assertIn("commerce_order_amount_breakdown", store)
            self.assertIn("commerce_payment_intent", store)
            self.assertIn("commerce_payment_attempt", store)
            self.assertIn("list_recharge_packages", store)
            self.assertIn("create_points_recharge_order", store)
            self.assertIn("insert_order", store)
            self.assertIn("insert_order_item", store)
            self.assertIn("insert_order_amount_breakdown", store)
            self.assertIn("insert_payment", store)
            self.assertIn("command.tenant_id", store)
            self.assertIn("command.organization_id", store)
            self.assertIn("command.owner_user_id", store)
            self.assertIn("CommercePaymentStatus::Pending.as_str()", store)
            self.assertIn(
                "let bonus_points = pack.as_ref().map(|item| item.bonus_points).unwrap_or(0);",
                compact_store,
            )
            self.assertNotIn("plus_vip_recharge_pack", store)
            self.assertNotIn("plus_vip_recharge_method", store)
            self.assertNotIn("plus_order", store)
            self.assertNotIn("plus_payment", store)
            self.assertNotIn("insert_vip_recharge", store)

    def test_console_recharge_uses_generated_sdk_service_adapter(self) -> None:
        recharge_view = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-console-recharge"
            / "src"
            / "RechargeView.tsx"
        ).read_text(encoding="utf-8")
        recharge_service = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-console-recharge"
            / "src"
            / "rechargeService.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("getClawRouterAppSdkClient().commerce.recharges.packages.list({ page: 1, pageSize: 100, status: 'active' })", recharge_service)
        self.assertIn("getClawRouterAppSdkClient().commerce.recharges.orders.create(", recharge_service)
        self.assertIn("createCommerceRequestNo('recharge')", recharge_service)
        self.assertIn("moneyAmount(amount, 'amount')", recharge_service)
        self.assertIn("formatMoneyString", recharge_service)
        self.assertIn("readOptionalNonNegativeNumber(item, 'bonus')", recharge_service)
        self.assertIn("readRequiredBoolean(data, 'success', 'Recharge success flag is required')", recharge_service)
        self.assertNotIn("fetch('/app/v3/api", recharge_service)
        self.assertNotIn("axios", recharge_service)
        self.assertNotIn("Number(normalized)", recharge_service)
        self.assertIn("RechargeService.submitRecharge", recharge_view)
        self.assertIn("navigate(`/console/checkout?orderNo=${encodeURIComponent(res.orderNo)}`)", recharge_view)
        self.assertNotIn("fetchRechargeHistory", recharge_view)


if __name__ == "__main__":
    unittest.main()
