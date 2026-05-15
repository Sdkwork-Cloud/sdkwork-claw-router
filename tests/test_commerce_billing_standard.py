import json
import unittest
from pathlib import Path

from tools.api_contract_manifest import ApiContractManifestGenerator


ROOT = Path(__file__).resolve().parents[1]

COMMERCE_BILLING_OPERATIONS = [
    ("GET", "/app/v3/api/billing/account/summary", "account.summary.retrieve"),
    ("GET", "/app/v3/api/billing/account/points", "account.points.retrieve"),
    ("GET", "/app/v3/api/billing/account/points/history", "account.points.history.list"),
    ("GET", "/app/v3/api/billing/account/points/exchange_rate", "account.points.exchangeRate.retrieve"),
    ("GET", "/app/v3/api/billing/account/points/recharges/packages", "account.points.recharges.packages.list"),
    ("GET", "/app/v3/api/billing/account/points/recharges/records", "account.points.recharges.records.list"),
    ("GET", "/app/v3/api/billing/account/points/recharges/orders/{orderNo}", "account.points.recharges.orders.retrieve"),
    ("POST", "/app/v3/api/billing/account/points/recharges/orders/{orderNo}/cancel", "account.points.recharges.orders.cancel"),
    ("POST", "/app/v3/api/billing/account/points/recharges", "account.points.recharges.create"),
    ("POST", "/app/v3/api/billing/account/points/transfers", "account.points.transfers.create"),
    ("GET", "/app/v3/api/billing/account/points/exchanges/rules", "account.points.exchanges.rules.list"),
    ("POST", "/app/v3/api/billing/account/points/exchanges", "account.points.exchanges.create"),
    ("GET", "/app/v3/api/billing/account/points/exchanges/{exchangeNo}", "account.points.exchanges.retrieve"),
    ("GET", "/app/v3/api/billing/account/tokens", "account.tokens.retrieve"),
    ("POST", "/app/v3/api/billing/account/tokens/deductions", "account.tokens.deductions.create"),
    ("GET", "/app/v3/api/billing/wallet/overview", "wallet.overview.retrieve"),
    ("GET", "/app/v3/api/billing/wallet/accounts", "wallet.accounts.list"),
    ("GET", "/app/v3/api/billing/wallet/transactions", "wallet.transactions.list"),
    ("GET", "/app/v3/api/billing/wallet/transactions/{transactionId}", "wallet.transactions.retrieve"),
    ("GET", "/app/v3/api/billing/wallet/operations/{requestNo}", "wallet.operations.retrieve"),
    ("POST", "/app/v3/api/billing/wallet/topups", "wallet.topups.create"),
    ("POST", "/app/v3/api/billing/wallet/withdrawals", "wallet.withdrawals.create"),
    ("POST", "/app/v3/api/billing/wallet/transfers", "wallet.transfers.create"),
    ("POST", "/app/v3/api/billing/wallet/exchanges", "wallet.exchanges.create"),
    ("GET", "/app/v3/api/billing/coupons/catalog", "coupons.catalog.list"),
    ("GET", "/app/v3/api/billing/coupons/catalog/{couponId}", "coupons.catalog.retrieve"),
    ("POST", "/app/v3/api/billing/coupons/claims", "coupons.claims.create"),
    ("POST", "/app/v3/api/billing/coupons/redeem", "coupons.redeem.create"),
    ("POST", "/app/v3/api/billing/coupons/usage", "coupons.usage.create"),
    ("POST", "/app/v3/api/billing/coupons/usage_reversals", "coupons.usageReversals.create"),
    ("GET", "/app/v3/api/billing/users/current/coupons", "users.current.coupons.list"),
    ("GET", "/app/v3/api/billing/users/current/coupons/{userCouponId}", "users.current.coupons.retrieve"),
    ("GET", "/app/v3/api/billing/payments/checkout/{orderNo}", "payments.checkout.retrieve"),
    ("GET", "/app/v3/api/billing/payments/records", "payments.records.list"),
    ("GET", "/app/v3/api/billing/payments/records/{paymentId}", "payments.records.retrieve"),
    ("GET", "/app/v3/api/billing/vip/info", "vip.info.retrieve"),
    ("GET", "/app/v3/api/billing/vip/levels", "vip.levels.list"),
    ("GET", "/app/v3/api/billing/vip/benefits", "vip.benefits.list"),
    ("GET", "/app/v3/api/billing/vip/status", "vip.status.retrieve"),
    ("GET", "/app/v3/api/billing/vip/pack_groups", "vip.packGroups.list"),
    ("GET", "/app/v3/api/billing/vip/pack_groups/{packGroupId}", "vip.packGroups.retrieve"),
    ("GET", "/app/v3/api/billing/vip/pack_groups/{packGroupId}/packs", "vip.packGroups.packs.list"),
    ("GET", "/app/v3/api/billing/vip/packs", "vip.packs.list"),
    ("GET", "/app/v3/api/billing/vip/packs/{packId}", "vip.packs.retrieve"),
    ("POST", "/app/v3/api/billing/vip/purchase", "vip.purchase.create"),
    ("POST", "/app/v3/api/billing/vip/purchase/renew", "vip.purchase.renew"),
    ("POST", "/app/v3/api/billing/vip/purchase/upgrade", "vip.purchase.upgrade"),
    ("GET", "/app/v3/api/billing/vip/points/balance", "vip.points.balance.retrieve"),
    ("GET", "/app/v3/api/billing/vip/points/history", "vip.points.history.list"),
    ("POST", "/app/v3/api/billing/vip/points/daily_rewards", "vip.points.dailyRewards.create"),
    ("GET", "/app/v3/api/billing/vip/points/daily_rewards/status", "vip.points.dailyRewards.status.retrieve"),
    ("GET", "/app/v3/api/billing/vip/privileges/usage", "vip.privileges.usage.retrieve"),
    ("POST", "/app/v3/api/billing/vip/privileges/speed_ups", "vip.privileges.speedUps.create"),
    ("POST", "/app/v3/api/billing/preflight/estimates", "preflight.estimates.create"),
    ("POST", "/app/v3/api/billing/preflight/prechecks", "preflight.prechecks.create"),
    ("POST", "/app/v3/api/billing/preflight/preholds", "preflight.preholds.create"),
    ("POST", "/app/v3/api/billing/preflight/settlements", "preflight.settlements.create"),
    ("POST", "/app/v3/api/billing/preflight/releases", "preflight.releases.create"),
]

COMMERCE_BACKEND_BILLING_OPERATIONS = [
    ("GET", "/backend/v3/api/billing/coupons", "coupons.list"),
    ("POST", "/backend/v3/api/billing/coupons", "coupons.create"),
    ("PUT", "/backend/v3/api/billing/coupons/{couponId}", "coupons.update"),
    ("DELETE", "/backend/v3/api/billing/coupons/{couponId}", "coupons.delete"),
    ("GET", "/backend/v3/api/billing/coupon_batches", "couponBatches.list"),
    ("POST", "/backend/v3/api/billing/coupon_batches", "couponBatches.create"),
    ("GET", "/backend/v3/api/billing/coupon_codes", "couponCodes.list"),
    ("PATCH", "/backend/v3/api/billing/coupon_codes/{codeId}/status", "couponCodes.status.update"),
    ("GET", "/backend/v3/api/billing/users/coupons", "users.coupons.list"),
    ("POST", "/backend/v3/api/billing/users/{userId}/balance_adjustments", "users.balanceAdjustments.create"),
    ("GET", "/backend/v3/api/billing/recharges/records", "recharges.records.list"),
    ("GET", "/backend/v3/api/billing/recharges/records/{orderNo}", "recharges.records.retrieve"),
    ("GET", "/backend/v3/api/billing/recharges/packages", "recharges.packages.list"),
    ("POST", "/backend/v3/api/billing/recharges/packages", "recharges.packages.create"),
    ("PUT", "/backend/v3/api/billing/recharges/packages/{packageId}", "recharges.packages.update"),
    ("DELETE", "/backend/v3/api/billing/recharges/packages/{packageId}", "recharges.packages.delete"),
    ("GET", "/backend/v3/api/billing/exchange_rules", "exchangeRules.list"),
    ("PUT", "/backend/v3/api/billing/exchange_rules", "exchangeRules.update"),
    ("GET", "/backend/v3/api/billing/payments/attempts", "payments.attempts.list"),
    ("GET", "/backend/v3/api/billing/finance/ledger", "finance.ledger.list"),
    ("GET", "/backend/v3/api/billing/finance/usage_statements", "finance.usageStatements.list"),
]


class CommerceBillingStandardTest(unittest.TestCase):
    def test_app_contract_exposes_appbase_billing_foundation_surface(self) -> None:
        manifest = ApiContractManifestGenerator(root=ROOT).generate()
        operations = [
            operation
            for operation in manifest["operations"]
            if operation["api_surface"] == "app"
            and operation["tag"] == "billing"
            and operation["operation_id"] in {item[2] for item in COMMERCE_BILLING_OPERATIONS}
        ]
        actual = {
            (operation["api_method"], operation["api_path"], operation["operation_id"])
            for operation in operations
        }

        self.assertEqual(set(COMMERCE_BILLING_OPERATIONS), actual)
        self.assertEqual(len(COMMERCE_BILLING_OPERATIONS), len(operations))
        for operation in operations:
            self.assertEqual("commerce", operation["sdk_domain"])
            self.assertEqual("SdkworkAppClient", operation["sdk_client"])
            self.assertFalse(operation["operation_id"].startswith("billing."))
            if operation["api_method"] == "POST" and operation["operation_id"] not in {
                "preflight.estimates.create",
                "preflight.prechecks.create",
            }:
                self.assertTrue(operation["idempotency_required"], operation["operation_id"])

    def test_backend_contract_exposes_appbase_billing_admin_surface(self) -> None:
        manifest = ApiContractManifestGenerator(root=ROOT).generate()
        operations = [
            operation
            for operation in manifest["operations"]
            if operation["api_surface"] == "backend"
            and operation["tag"] == "billing"
            and operation["operation_id"] in {item[2] for item in COMMERCE_BACKEND_BILLING_OPERATIONS}
        ]
        actual = {
            (operation["api_method"], operation["api_path"], operation["operation_id"])
            for operation in operations
        }

        self.assertEqual(set(COMMERCE_BACKEND_BILLING_OPERATIONS), actual)
        self.assertEqual(len(COMMERCE_BACKEND_BILLING_OPERATIONS), len(operations))
        for operation in operations:
            self.assertEqual("commerce", operation["sdk_domain"])
            self.assertEqual("SdkworkBackendClient", operation["sdk_client"])
            self.assertFalse(operation["operation_id"].startswith("billing."))

    def test_generated_openapi_and_app_sdk_keep_single_billing_namespace(self) -> None:
        openapi = json.loads((ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json").read_text(encoding="utf-8"))
        paths = openapi["paths"]
        billing_api = (
            ROOT
            / "sdks"
            / "clawrouter-app-sdk"
            / "clawrouter-app-sdk-typescript"
            / "src"
            / "api"
            / "billing.ts"
        ).read_text(encoding="utf-8")
        sdk_root = (
            ROOT
            / "sdks"
            / "clawrouter-app-sdk"
            / "clawrouter-app-sdk-typescript"
            / "src"
            / "sdk.ts"
        ).read_text(encoding="utf-8")

        for method, path, operation_id in COMMERCE_BILLING_OPERATIONS:
            with self.subTest(operation_id=operation_id):
                self.assertIn(path, paths)
                self.assertIn(method.lower(), paths[path])
                self.assertEqual(operation_id, paths[path][method.lower()]["operationId"])

        for old_path in [
            "/app/v3/api/account/summary",
            "/app/v3/api/account/points/recharge",
            "/app/v3/api/billing/account/points/recharge",
            "/app/v3/api/vip/pack_groups/packs",
            "/app/v3/api/billing/vip/pack_groups/packs",
            "/app/v3/api/coupons/my",
            "/app/v3/api/payments/records",
        ]:
            self.assertNotIn(old_path, paths)

        for sdk_snippet in [
            "public readonly billing: BillingApi;",
            "this.billing = createBillingApi(this.httpClient);",
            "public readonly wallet: BillingWalletApi;",
            "public readonly preflight: BillingPreflightApi;",
            "public readonly recharges: BillingAccountPointsRechargesApi;",
            "public readonly packs: BillingVipPacksApi;",
            "public readonly dailyRewards: BillingVipPointsDailyRewardsApi;",
            "async create(body: SubmitRechargeRequest, params: BillingAccountPointsRechargesCreateParams): Promise<AccountPointsRechargesCreateResult>",
            "async list(params?: BillingAccountPointsRechargesPackagesListParams): Promise<AccountPointsRechargesPackagesListResult>",
            "async retrieve(orderNo: string): Promise<AccountPointsRechargesOrdersRetrieveResult>",
            "async cancel(orderNo: string, body: CommerceRechargeOrderCancelRequest, params: BillingAccountPointsRechargesOrdersCancelParams): Promise<AccountPointsRechargesOrdersCancelResult>",
            "async list(params?: BillingCouponsCatalogListParams): Promise<CouponsCatalogListResult>",
            "async create(body: RedeemCodeRequest, params: BillingCouponsRedeemCreateParams): Promise<CouponsRedeemCreateResult>",
            "async retrieve(userCouponId: string): Promise<UsersCurrentCouponsRetrieveResult>",
            "async retrieve(paymentId: string): Promise<PaymentsRecordsRetrieveResult>",
            "async list(packGroupId: string): Promise<VipPackGroupsPacksListResult>",
        ]:
            source = sdk_root if sdk_snippet.startswith("public readonly billing") or sdk_snippet.startswith("this.billing") else billing_api
            self.assertIn(sdk_snippet, source)

    def test_generated_backend_openapi_and_sdk_keep_canonical_billing_admin_namespace(self) -> None:
        openapi = json.loads((ROOT / "generated" / "openapi" / "clawrouter-backend-openapi.json").read_text(encoding="utf-8"))
        paths = openapi["paths"]
        billing_api = (
            ROOT
            / "sdks"
            / "clawrouter-backend-sdk"
            / "clawrouter-backend-sdk-typescript"
            / "src"
            / "api"
            / "billing.ts"
        ).read_text(encoding="utf-8")

        for method, path, operation_id in COMMERCE_BACKEND_BILLING_OPERATIONS:
            with self.subTest(operation_id=operation_id):
                self.assertIn(path, paths)
                self.assertIn(method.lower(), paths[path])
                self.assertEqual(operation_id, paths[path][method.lower()]["operationId"])

        for old_path in [
            "/backend/v3/api/router/coupon_batches",
            "/backend/v3/api/router/coupon_codes",
            "/backend/v3/api/router/users/{userId}/balance_adjustments",
            "/backend/v3/api/billing/finance/admin/ledger",
            "/backend/v3/api/billing/vip/recharge",
            "/backend/v3/api/billing/coupon_batches/generate",
        ]:
            self.assertNotIn(old_path, paths)

        for sdk_snippet in [
            "public readonly couponBatches: BillingCouponBatchesApi;",
            "public readonly recharges: BillingRechargesApi;",
            "public readonly exchangeRules: BillingExchangeRulesApi;",
            "async create(body: AdminCouponBatchGenerateRequest, params?: BillingCouponBatchesCreateParams): Promise<CouponBatchesCreateResult>",
            "async update(codeId: string, body: AdminPromoCodeStatusUpdateRequest, params?: BillingCouponCodesStatusUpdateParams): Promise<CouponCodesStatusUpdateResult>",
            "async list(params?: BillingRechargesRecordsListParams): Promise<RechargesRecordsListResult>",
            "async retrieve(orderNo: string): Promise<RechargesRecordsRetrieveResult>",
            "async list(params?: BillingPaymentsAttemptsListParams): Promise<PaymentsAttemptsListResult>",
            "async list(params?: BillingFinanceLedgerListParams): Promise<FinanceLedgerListResult>",
            "async list(params?: BillingExchangeRulesListParams): Promise<ExchangeRulesListResult>",
            "async update(body: CommerceExchangeRuleUpsertRequest, params?: BillingExchangeRulesUpdateParams): Promise<ExchangeRulesUpdateResult>",
        ]:
            self.assertIn(sdk_snippet, billing_api)

    def test_private_rust_app_api_mounts_canonical_billing_routes_without_legacy_leaks(self) -> None:
        product_api_mod = (ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "mod.rs").read_text(
            encoding="utf-8"
        )
        app_api = (ROOT / "services" / "sdkwork-claw-app-api" / "src" / "lib.rs").read_text(encoding="utf-8")
        account_api = (ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_account.rs").read_text(
            encoding="utf-8"
        )
        recharge_api = (ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_recharge.rs").read_text(
            encoding="utf-8"
        )
        commerce_api = (ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_commerce.rs").read_text(
            encoding="utf-8"
        )

        self.assertIn("mod app_commerce;", product_api_mod)
        self.assertIn("app_commerce_foundation_router", product_api_mod)
        self.assertIn("merge_commerce_foundation_router", app_api)
        self.assertIn("app_commerce_foundation_router()", app_api)
        self.assertIn('"/app/v3/api/billing/account/summary"', account_api)
        self.assertIn('"/app/v3/api/billing/account/points/recharges/packages"', recharge_api)
        self.assertIn('"/app/v3/api/billing/account/points/recharges"', recharge_api)

        route_sources = "\n".join([account_api, recharge_api, commerce_api])
        route_sources += (ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_billing.rs").read_text(
            encoding="utf-8"
        )
        route_sources += (ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_checkout.rs").read_text(
            encoding="utf-8"
        )

        for _, path, operation_id in COMMERCE_BILLING_OPERATIONS:
            rust_path = path.replace("{orderNo}", "{order_no}")
            with self.subTest(operation_id=operation_id):
                self.assertIn(f'"{rust_path}"', route_sources)

        for source in [account_api, recharge_api, commerce_api]:
            self.assertNotIn('"/app/v3/api/account/summary"', source)
            self.assertNotIn('"/app/v3/api/account/points/recharge"', source)
            self.assertNotIn('"/app/v3/api/vip/pack_groups/packs"', source)

    def test_private_rust_backend_api_mounts_canonical_billing_admin_routes_without_legacy_leaks(self) -> None:
        marketing_api = (ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "admin_marketing.rs").read_text(
            encoding="utf-8"
        )
        user_api = (ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "admin_user.rs").read_text(
            encoding="utf-8"
        )
        finance_api = (ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "admin_finance.rs").read_text(
            encoding="utf-8"
        )
        route_sources = "\n".join([marketing_api, user_api, finance_api])

        for _, path, operation_id in COMMERCE_BACKEND_BILLING_OPERATIONS:
            rust_path = path.replace("{couponId}", "{coupon_id}").replace("{codeId}", "{code_id}").replace("{userId}", "{user_id}")
            rust_path = rust_path.replace("{orderNo}", "{order_no}").replace("{packageId}", "{package_id}")
            with self.subTest(operation_id=operation_id):
                self.assertIn(f'"{rust_path}"', route_sources)

        for legacy_path in [
            '"/backend/v3/api/router/coupon_batches"',
            '"/backend/v3/api/router/coupon_batches/generate"',
            '"/backend/v3/api/router/coupon_codes"',
            '"/backend/v3/api/router/users/{user_id}/balance_adjustments"',
            '"/backend/v3/api/billing/finance/admin/ledger"',
            '"/backend/v3/api/billing/vip/recharge"',
        ]:
            self.assertNotIn(legacy_path, route_sources)

    def test_console_recharge_uses_generated_billing_sdk_methods(self) -> None:
        recharge_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-recharge"
            / "src"
            / "rechargeService.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("getClawRouterAppSdkClient().billing.account.points.recharges.packages.list()", recharge_service)
        self.assertIn("getClawRouterAppSdkClient().billing.account.points.recharges.create", recharge_service)
        self.assertIn("createRequestParams('commerce-points-recharge')", recharge_service)
        self.assertNotIn("getClawRouterAppSdkClient().vip", recharge_service)
        self.assertNotIn("getClawRouterAppSdkClient().account", recharge_service)
        self.assertNotIn(".billing.account.points.recharge.create", recharge_service)
        self.assertNotIn(".billing.vip.packGroups.packs.list()", recharge_service)
        self.assertNotIn("fetch('/app/v3/api", recharge_service)
        self.assertNotIn("axios", recharge_service)

    def test_schema_manifest_maps_console_billing_to_foundation_tables(self) -> None:
        manifest = json.loads(
            (ROOT / "generated" / "schema" / "manifest" / "schema-manifest.json").read_text(
                encoding="utf-8"
            )
        )
        billing_route = manifest["routes"]["/console/billing"]
        billing_tables = set(billing_route["tables"])

        for table in [
            "plus_account_exchange_config",
            "plus_vip_user",
            "plus_vip_level",
            "plus_vip_benefit",
            "plus_vip_level_benefit",
            "plus_vip_benefit_usage",
        ]:
            self.assertIn(table, billing_tables)


if __name__ == "__main__":
    unittest.main()
