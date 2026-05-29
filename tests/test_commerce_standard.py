import json
import re
import unittest
from collections import Counter
from pathlib import Path

import yaml

from tools.schema_registry_loader import load_schema_registry, render_schema_registry


ROOT = Path(__file__).resolve().parents[1]
FIELD_CONTRACTS_PATH = ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
ROUTE_CLASSIFICATION_PATH = ROOT / "docs" / "schema-registry" / "frontend-route-classification.yaml"
TABLE_REGISTRY_PATH = ROOT / "docs" / "schema-registry" / "sdkwork-claw-router.tables.yaml"
APPBASE_CAPABILITY_PATH = ROOT / "sdkwork-appbase" / "specs" / "appbase-capabilities.yaml"
PORTAL_PATH = ROOT / "apps" / "sdkwork-claw-router-portal"
APP_OPENAPI_PATH = ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json"
BACKEND_OPENAPI_PATH = ROOT / "generated" / "openapi" / "clawrouter-backend-openapi.json"
APP_SDK_TYPES_PATH = ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "types"
BACKEND_SDK_TYPES_PATH = ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "types"

STANDARD_PAYMENT_PROVIDER_CODES = {
    "wechat_pay",
    "alipay",
    "paypal",
    "stripe",
    "apple_pay",
    "google_pay",
}
STANDARD_PAYMENT_METHOD_CODES = {
    "wechat_pay",
    "alipay",
    "paypal",
    "card",
    "apple_pay",
    "google_pay",
    "wallet_balance",
}


CANONICAL_COMMERCE_PRODUCT_CENTER_API_OPERATIONS: tuple[tuple[str, str, str, str], ...] = (
    ("backend", "POST", "/backend/v3/api/catalog/attributes", "catalog.attributes.create"),
    ("backend", "POST", "/backend/v3/api/catalog/categories", "catalog.categories.create"),
    ("backend", "POST", "/backend/v3/api/catalog/price_lists", "catalog.priceLists.create"),
    ("backend", "POST", "/backend/v3/api/catalog/products", "catalog.products.create"),
    ("backend", "POST", "/backend/v3/api/catalog/skus", "catalog.skus.create"),
    ("backend", "DELETE", "/backend/v3/api/catalog/categories/{categoryId}", "catalog.categories.delete"),
    ("app", "GET", "/app/v3/api/catalog/categories", "catalog.categories.list"),
    ("app", "GET", "/app/v3/api/catalog/products", "catalog.products.list"),
    ("backend", "GET", "/backend/v3/api/catalog/attributes", "catalog.attributes.list"),
    ("backend", "GET", "/backend/v3/api/catalog/categories", "catalog.categories.list"),
    ("backend", "GET", "/backend/v3/api/catalog/price_lists", "catalog.priceLists.list"),
    ("backend", "GET", "/backend/v3/api/catalog/products", "catalog.products.list"),
    ("backend", "GET", "/backend/v3/api/catalog/skus", "catalog.skus.list"),
    ("backend", "GET", "/backend/v3/api/inventory/ledger_entries", "inventory.ledgerEntries.list"),
    ("backend", "GET", "/backend/v3/api/inventory/reservations", "inventory.reservations.list"),
    ("backend", "GET", "/backend/v3/api/inventory/stocks", "inventory.stocks.list"),
    ("app", "GET", "/app/v3/api/catalog/products/{productId}", "catalog.products.retrieve"),
    ("app", "GET", "/app/v3/api/catalog/skus/{skuId}", "catalog.skus.retrieve"),
    ("backend", "PATCH", "/backend/v3/api/catalog/categories/{categoryId}", "catalog.categories.update"),
    ("backend", "PATCH", "/backend/v3/api/catalog/products/{productId}", "catalog.products.update"),
    ("backend", "PATCH", "/backend/v3/api/catalog/skus/{skuId}", "catalog.skus.update"),
    ("backend", "PATCH", "/backend/v3/api/inventory/stocks/{stockId}", "inventory.stocks.update"),
)

CANONICAL_COMMERCE_TRANSACTION_API_OPERATIONS: tuple[tuple[str, str, str, str], ...] = (
    ("app", "GET", "/app/v3/api/accounts/current/summary", "accounts.current.summary.retrieve"),
    ("app", "GET", "/app/v3/api/cart/current", "cart.current.retrieve"),
    ("app", "POST", "/app/v3/api/cart/items", "cart.items.create"),
    ("app", "PATCH", "/app/v3/api/cart/items/{cartItemId}", "cart.items.update"),
    ("app", "DELETE", "/app/v3/api/cart/items/{cartItemId}", "cart.items.delete"),
    ("app", "GET", "/app/v3/api/addresses", "addresses.list"),
    ("app", "POST", "/app/v3/api/addresses", "addresses.create"),
    ("app", "PATCH", "/app/v3/api/addresses/{addressId}", "addresses.update"),
    ("app", "DELETE", "/app/v3/api/addresses/{addressId}", "addresses.delete"),
    ("app", "POST", "/app/v3/api/addresses/{addressId}/default_selection", "addresses.defaultSelection.create"),
    ("app", "POST", "/app/v3/api/checkout/sessions", "checkout.sessions.create"),
    ("app", "GET", "/app/v3/api/checkout/sessions/{checkoutSessionId}", "checkout.sessions.retrieve"),
    ("app", "POST", "/app/v3/api/checkout/sessions/{checkoutSessionId}/quotes", "checkout.sessions.quotes.create"),
    ("app", "POST", "/app/v3/api/checkout/sessions/{checkoutSessionId}/orders", "checkout.sessions.orders.create"),
    ("app", "GET", "/app/v3/api/orders", "orders.list"),
    ("app", "GET", "/app/v3/api/orders/{orderId}", "orders.retrieve"),
    ("app", "GET", "/app/v3/api/orders/{orderId}/events", "orders.events.list"),
    ("app", "POST", "/app/v3/api/orders/{orderId}/cancellations", "orders.cancellations.create"),
    ("app", "GET", "/app/v3/api/payments/methods", "payments.methods.list"),
    ("app", "POST", "/app/v3/api/payments/intents", "payments.intents.create"),
    ("app", "GET", "/app/v3/api/payments/intents/{paymentIntentId}", "payments.intents.retrieve"),
    ("app", "POST", "/app/v3/api/payments/intents/{paymentIntentId}/attempts", "payments.intents.attempts.create"),
    ("app", "GET", "/app/v3/api/payments/attempts/{paymentAttemptId}", "payments.attempts.retrieve"),
    ("app", "POST", "/app/v3/api/refunds", "refunds.create"),
    ("app", "GET", "/app/v3/api/refunds", "refunds.list"),
    ("app", "GET", "/app/v3/api/refunds/{refundId}", "refunds.retrieve"),
    ("app", "GET", "/app/v3/api/fulfillments", "fulfillments.list"),
    ("app", "GET", "/app/v3/api/fulfillments/{fulfillmentId}", "fulfillments.retrieve"),
    ("app", "GET", "/app/v3/api/shipments/{shipmentId}", "shipments.retrieve"),
    ("app", "GET", "/app/v3/api/memberships/current", "memberships.current.retrieve"),
    ("app", "GET", "/app/v3/api/memberships/current/status", "memberships.current.status.retrieve"),
    ("app", "GET", "/app/v3/api/memberships/plans", "memberships.plans.list"),
    ("app", "GET", "/app/v3/api/memberships/benefits", "memberships.benefits.list"),
    ("app", "GET", "/app/v3/api/memberships/package_groups", "memberships.packageGroups.list"),
    ("app", "GET", "/app/v3/api/memberships/package_groups/{packageGroupId}", "memberships.packageGroups.retrieve"),
    ("app", "GET", "/app/v3/api/memberships/package_groups/{packageGroupId}/packages", "memberships.packageGroups.packages.list"),
    ("app", "GET", "/app/v3/api/memberships/packages", "memberships.packages.list"),
    ("app", "GET", "/app/v3/api/memberships/packages/{packageId}", "memberships.packages.retrieve"),
    ("app", "POST", "/app/v3/api/memberships/purchases", "memberships.purchases.create"),
    ("app", "POST", "/app/v3/api/memberships/purchases/renew", "memberships.purchases.renew"),
    ("app", "POST", "/app/v3/api/memberships/purchases/upgrade", "memberships.purchases.upgrade"),
    ("app", "GET", "/app/v3/api/memberships/points/balance", "memberships.points.balance.retrieve"),
    ("app", "GET", "/app/v3/api/memberships/points/history", "memberships.points.history.list"),
    ("app", "POST", "/app/v3/api/memberships/points/daily_rewards", "memberships.points.dailyRewards.create"),
    ("app", "GET", "/app/v3/api/memberships/points/daily_rewards/status", "memberships.points.dailyRewards.status.retrieve"),
    ("app", "GET", "/app/v3/api/memberships/privileges/usage", "memberships.privileges.usage.retrieve"),
    ("app", "POST", "/app/v3/api/memberships/privileges/speed_ups", "memberships.privileges.speedUps.create"),
    ("app", "GET", "/app/v3/api/recharges/packages", "recharges.packages.list"),
    ("app", "POST", "/app/v3/api/recharges/orders", "recharges.orders.create"),
    ("app", "GET", "/app/v3/api/recharges/orders/{orderId}", "recharges.orders.retrieve"),
    ("app", "GET", "/app/v3/api/billing/history", "billing.history.list"),
    ("app", "GET", "/app/v3/api/wallet/overview", "wallet.overview.retrieve"),
    ("app", "GET", "/app/v3/api/wallet/accounts", "wallet.accounts.list"),
    ("app", "GET", "/app/v3/api/wallet/tokens", "wallet.tokens.retrieve"),
    ("app", "GET", "/app/v3/api/wallet/exchange_rate", "wallet.exchangeRate.retrieve"),
    ("app", "GET", "/app/v3/api/wallet/points/exchanges/rules", "wallet.points.exchangeRules.list"),
    ("app", "GET", "/app/v3/api/promotions/user_coupons", "promotions.userCoupons.wallet.list"),
    ("app", "POST", "/app/v3/api/promotions/user_coupon_claims", "promotions.userCoupons.claims.create"),
    ("app", "POST", "/app/v3/api/promotions/codes/redemptions", "promotions.codes.redemptions.create"),
    ("app", "POST", "/app/v3/api/promotions/discount_applications", "promotions.discountApplications.create"),
    ("app", "POST", "/app/v3/api/promotions/discount_applications/{applicationId}/settlements", "promotions.discountApplications.settle"),
    ("app", "POST", "/app/v3/api/promotions/discount_applications/{applicationId}/releases", "promotions.discountApplications.release"),
    ("app", "POST", "/app/v3/api/promotions/discount_applications/reversals", "promotions.discountApplications.reversals.create"),
    ("app", "GET", "/app/v3/api/invoices", "invoices.list"),
    ("app", "GET", "/app/v3/api/invoices/{invoiceId}", "invoices.retrieve"),
    ("app", "POST", "/app/v3/api/invoices", "invoices.create"),
    ("backend", "GET", "/backend/v3/api/orders", "orders.list"),
    ("backend", "GET", "/backend/v3/api/orders/{orderId}", "orders.retrieve"),
    ("backend", "GET", "/backend/v3/api/orders/{orderId}/events", "orders.events.list"),
    ("backend", "GET", "/backend/v3/api/payments/providers", "payments.providers.list"),
    ("backend", "GET", "/backend/v3/api/payments/provider_accounts", "payments.providerAccounts.list"),
    ("backend", "POST", "/backend/v3/api/payments/provider_accounts", "payments.providerAccounts.create"),
    ("backend", "GET", "/backend/v3/api/payments/methods", "payments.methods.list"),
    ("backend", "GET", "/backend/v3/api/payments/channels", "payments.channels.list"),
    ("backend", "GET", "/backend/v3/api/payments/route_rules", "payments.routeRules.list"),
    ("backend", "GET", "/backend/v3/api/payments/intents", "payments.intents.list"),
    ("backend", "GET", "/backend/v3/api/payments/attempts", "payments.attempts.list"),
    ("backend", "GET", "/backend/v3/api/payments/webhook_events", "payments.webhookEvents.list"),
    ("backend", "GET", "/backend/v3/api/payments/reconciliation_runs", "payments.reconciliationRuns.list"),
    ("backend", "GET", "/backend/v3/api/refunds", "refunds.list"),
    ("backend", "GET", "/backend/v3/api/refunds/{refundId}", "refunds.retrieve"),
    ("backend", "GET", "/backend/v3/api/fulfillments", "fulfillments.list"),
    ("backend", "GET", "/backend/v3/api/shipments", "shipments.list"),
    ("backend", "GET", "/backend/v3/api/shipments/{shipmentId}/tracking_events", "shipments.trackingEvents.list"),
    ("backend", "GET", "/backend/v3/api/memberships/plans", "memberships.plans.list"),
    ("backend", "POST", "/backend/v3/api/memberships/plans", "memberships.plans.create"),
    ("backend", "PUT", "/backend/v3/api/memberships/plans/{planId}", "memberships.plans.update"),
    ("backend", "DELETE", "/backend/v3/api/memberships/plans/{planId}", "memberships.plans.delete"),
    ("backend", "GET", "/backend/v3/api/memberships/packages", "memberships.packages.list"),
    ("backend", "POST", "/backend/v3/api/memberships/packages", "memberships.packages.create"),
    ("backend", "PUT", "/backend/v3/api/memberships/packages/{packageId}", "memberships.packages.update"),
    ("backend", "DELETE", "/backend/v3/api/memberships/packages/{packageId}", "memberships.packages.delete"),
    ("backend", "GET", "/backend/v3/api/memberships/package_groups", "memberships.packageGroups.list"),
    ("backend", "POST", "/backend/v3/api/memberships/package_groups", "memberships.packageGroups.create"),
    ("backend", "PUT", "/backend/v3/api/memberships/package_groups/{packageGroupId}", "memberships.packageGroups.update"),
    ("backend", "DELETE", "/backend/v3/api/memberships/package_groups/{packageGroupId}", "memberships.packageGroups.delete"),
    ("backend", "GET", "/backend/v3/api/memberships/members", "memberships.members.list"),
    ("backend", "PATCH", "/backend/v3/api/memberships/members/{membershipId}/status", "memberships.members.status.update"),
    ("backend", "GET", "/backend/v3/api/memberships/entitlements", "memberships.entitlements.list"),
    ("backend", "GET", "/backend/v3/api/recharges/packages", "recharges.packages.list"),
    ("backend", "GET", "/backend/v3/api/recharges/orders", "recharges.orders.list"),
    ("backend", "GET", "/backend/v3/api/wallet/accounts", "wallet.accounts.list"),
    ("backend", "GET", "/backend/v3/api/wallet/ledger_entries", "wallet.ledgerEntries.list"),
    ("backend", "POST", "/backend/v3/api/wallet/adjustments", "wallet.adjustments.create"),
    ("backend", "GET", "/backend/v3/api/wallet/exchange_rules", "wallet.exchangeRules.list"),
    ("backend", "GET", "/backend/v3/api/promotions/offers", "promotions.offers.management.list"),
    ("backend", "GET", "/backend/v3/api/promotions/coupon_stocks", "promotions.couponStocks.list"),
    ("backend", "GET", "/backend/v3/api/promotions/codes", "promotions.codes.list"),
    ("backend", "GET", "/backend/v3/api/promotions/discount_applications", "promotions.discountApplications.list"),
    ("backend", "GET", "/backend/v3/api/promotions/codes/redemptions", "promotions.codes.redemptions.list"),
    ("backend", "GET", "/backend/v3/api/promotions/user_coupons", "promotions.userCoupons.management.list"),
    ("backend", "GET", "/backend/v3/api/promotions/discount_allocations", "promotions.discountAllocations.list"),
    ("backend", "GET", "/backend/v3/api/promotions/coupon_ledger_entries", "promotions.couponLedgerEntries.list"),
    ("backend", "GET", "/backend/v3/api/promotions/budget_ledger_entries", "promotions.budgetLedgerEntries.list"),
    ("backend", "GET", "/backend/v3/api/promotions/external_bindings", "promotions.externalBindings.list"),
    ("backend", "GET", "/backend/v3/api/promotions/events", "promotions.events.list"),
    ("backend", "GET", "/backend/v3/api/invoices/titles", "invoices.titles.list"),
    ("backend", "GET", "/backend/v3/api/invoices", "invoices.list"),
    ("backend", "GET", "/backend/v3/api/invoices/{invoiceId}", "invoices.retrieve"),
    ("backend", "GET", "/backend/v3/api/commerce_reports/payment_reconciliation", "commerceReports.paymentReconciliation.retrieve"),
    ("backend", "GET", "/backend/v3/api/commerce_reports/order_revenue", "commerceReports.orderRevenue.list"),
    ("backend", "GET", "/backend/v3/api/commerce_reports/refunds", "commerceReports.refunds.list"),
    ("backend", "GET", "/backend/v3/api/audit/commerce_events", "audit.commerceEvents.list"),
)

CANONICAL_COMMERCE_API_OPERATIONS = (
    *CANONICAL_COMMERCE_PRODUCT_CENTER_API_OPERATIONS,
    *CANONICAL_COMMERCE_TRANSACTION_API_OPERATIONS,
)

RETIRED_COMMERCE_OPERATION_ID_PATTERNS = tuple(
    re.compile(pattern)
    for pattern in [
        r"^account\.",
        r"^couponBatches\.",
        r"^couponCodes\.",
        r"^exchangeRules\.",
        r"^finance\.",
        r"^payments\.(?:checkout|records)\.",
        r"^preflight\.",
        r"^recharges\.records\.",
        r"^settlements\.",
        r"^users\.(?:balanceAdjustments|coupons|current\.coupons)\.",
        r"^vip\.",
        r"^wallet\.(?:ledger|operations|topups|transactions|withdrawals)\.",
        r"^coupons\.",
    ]
)


def load_frontend_operations() -> list[dict[str, object]]:
    contract = yaml.safe_load(FIELD_CONTRACTS_PATH.read_text(encoding="utf-8"))
    return [
        operation
        for operation in contract.get("frontend_operations", [])
        if isinstance(operation, dict)
    ]


def load_table_registry() -> dict[str, object]:
    return load_schema_registry(TABLE_REGISTRY_PATH)


def render_table_registry() -> str:
    return render_schema_registry(TABLE_REGISTRY_PATH)


class CommerceStandardTest(unittest.TestCase):
    def test_portal_no_longer_mounts_retired_commerce_modules(self) -> None:
        retired_tokens = [
            '"@sdkwork/vip-admin-pc-react"',
            '"@sdkwork/vip-pc-react"',
            '"@sdkwork/vip-purchase-pc-react"',
            '"sdkwork-claw-router-admin-commerce"',
            '"sdkwork-claw-router-admin-vip"',
            '"sdkwork-claw-router-console-commerce"',
            "/admin/commerce",
            "/admin/vip",
            "/console/commerce",
            "sdkwork-appbase/packages/pc-react/commerce/sdkwork-vip",
        ]
        checked_files = [
            PORTAL_PATH / "package.json",
            PORTAL_PATH / "pnpm-workspace.yaml",
            PORTAL_PATH / "pnpm-lock.yaml",
            PORTAL_PATH / "tsconfig.json",
            PORTAL_PATH / "tsconfig.typecheck.json",
            PORTAL_PATH / "vite.config.ts",
            ROUTE_CLASSIFICATION_PATH,
        ]

        violations = [
            f"{path.relative_to(ROOT)} contains {token}"
            for path in checked_files
            for token in retired_tokens
            if token in path.read_text(encoding="utf-8")
        ]

        self.assertEqual([], violations)

    def test_retired_frontend_aggregate_package_directories_are_removed(self) -> None:
        retired_package_names = [
            "sdkwork-claw-router-admin-billing",
            "sdkwork-claw-router-admin-commerce",
            "sdkwork-claw-router-admin-vip",
            "sdkwork-claw-router-console-billing",
            "sdkwork-claw-router-console-commerce",
        ]

        violations = [
            f"{package_name} still exists under portal packages"
            for package_name in retired_package_names
            if (PORTAL_PATH / "packages" / package_name).exists()
        ]

        self.assertEqual([], violations)

    def test_vip_purchase_page_remains_dedicated_product_module(self) -> None:
        app = (PORTAL_PATH / "src" / "App.tsx").read_text(encoding="utf-8")
        navbar = (
            PORTAL_PATH
            / "packages"
            / "sdkwork-claw-router-commons"
            / "src"
            / "components"
            / "Navbar.tsx"
        ).read_text(encoding="utf-8")
        package_json = (PORTAL_PATH / "package.json").read_text(encoding="utf-8")
        tsconfig = (PORTAL_PATH / "tsconfig.typecheck.json").read_text(encoding="utf-8")
        route_classification = ROUTE_CLASSIFICATION_PATH.read_text(encoding="utf-8")
        vip_package = PORTAL_PATH / "packages" / "sdkwork-claw-router-vip"

        self.assertTrue(vip_package.exists(), "sdkwork-claw-router-vip owns the public /vip purchase page")
        self.assertTrue((vip_package / "src" / "VipView.tsx").exists())
        self.assertTrue((vip_package / "src" / "vipService.ts").exists())
        self.assertIn("import('sdkwork-claw-router-vip')", app)
        self.assertIn('<Route path="/vip" element={<VipView />} />', app)
        self.assertIn("href: '/vip'", navbar)
        self.assertIn('"sdkwork-claw-router-vip": "workspace:*"', package_json)
        self.assertIn('"sdkwork-claw-router-vip"', tsconfig)
        self.assertRegex(route_classification, r"route: /vip[\s\S]*package: sdkwork-claw-router-vip")

    def test_appbase_integration_verification_uses_standard_commerce_module(self) -> None:
        manifest = (ROOT / "specs" / "appbase-integration.yaml").read_text(encoding="utf-8")

        self.assertIn("tests.test_commerce_standard", manifest)
        self.assertIn("tests.test_payment_callback_runtime_standard", manifest)
        self.assertNotIn("tests.test_commerce_billing_standard", manifest)
        self.assertNotIn("tests.test_billing_runtime_standard", manifest)

    def test_schema_registry_uses_standard_commerce_routes(self) -> None:
        field_contracts = FIELD_CONTRACTS_PATH.read_text(encoding="utf-8")
        route_classification = ROUTE_CLASSIFICATION_PATH.read_text(encoding="utf-8")
        for source in [field_contracts, route_classification]:
            self.assertNotIn("/console/billing", source)
            self.assertNotIn("/backend/v3/api/billing", source)
            self.assertNotRegex(source, r"/app/v3/api/billing(?!/history\b)(?:/|$)")
            self.assertNotRegex(source, r"commerce_billing_(?!history\b)[A-Za-z0-9_]*")

        retired_exact_path_patterns = [
            r"api_path:\s*/app/v3/api/payments/checkout(?:/|\s*$)",
            r"api_path:\s*/app/v3/api/router/settlements/dashboard\s*$",
            r"api_path:\s*/backend/v3/api/wallet/ledger(?:/|\s*$)",
            r"api_path:\s*/backend/v3/api/commerce/reports(?:/|\s*$)",
        ]
        for forbidden_pattern in retired_exact_path_patterns:
            self.assertNotRegex(field_contracts, forbidden_pattern)

        for standard_path in [
            "/app/v3/api/accounts/current/summary",
            "/app/v3/api/catalog/products",
            "/app/v3/api/cart/current",
            "/app/v3/api/checkout/sessions",
            "/app/v3/api/orders",
            "/app/v3/api/payments/intents",
            "/app/v3/api/memberships/current",
            "/app/v3/api/memberships/current/status",
            "/app/v3/api/memberships/package_groups",
            "/app/v3/api/memberships/points/balance",
            "/app/v3/api/memberships/privileges/usage",
            "/app/v3/api/recharges/packages",
            "/app/v3/api/billing/history",
            "/app/v3/api/wallet/overview",
            "/app/v3/api/wallet/accounts",
            "/app/v3/api/wallet/tokens",
            "/app/v3/api/wallet/exchange_rate",
            "/app/v3/api/wallet/points/exchanges/rules",
            "/app/v3/api/promotions/user_coupon_claims",
            "/app/v3/api/promotions/codes/redemptions",
            "/backend/v3/api/catalog/products",
            "/backend/v3/api/inventory/stocks",
            "/backend/v3/api/payments/provider_accounts",
            "/backend/v3/api/payments/route_rules",
            "/backend/v3/api/wallet/ledger_entries",
            "/backend/v3/api/promotions/offers",
            "/backend/v3/api/memberships/plans",
            "/backend/v3/api/memberships/package_groups",
            "/backend/v3/api/commerce_reports/payment_reconciliation",
        ]:
            self.assertIn(standard_path, field_contracts)

    def test_no_retired_direct_commerce_paths_or_operation_ids(self) -> None:
        violations: list[str] = []
        retired_path_patterns = (
            re.compile(r"^/app/v3/api/billing(?!/history(?:/|$))(?:/|$)"),
            re.compile(r"^/backend/v3/api/billing(?:/|$)"),
            re.compile(r"^/app/v3/api/payments/checkout(?:/|$)"),
            re.compile(r"^/app/v3/api/coupons(?:/|$)"),
            re.compile(r"^/backend/v3/api/coupons(?:/|$)"),
            re.compile(r"^/app/v3/api/router/settlements/dashboard$"),
            re.compile(r"^/backend/v3/api/wallet/ledger(?:/|$)"),
            re.compile(r"^/backend/v3/api/commerce/reports(?:/|$)"),
        )
        for operation in load_frontend_operations():
            api_path = str(operation.get("api_path") or "")
            operation_id = str(operation.get("operation_id") or "")

            if any(pattern.search(api_path) for pattern in retired_path_patterns):
                violations.append(f"{operation_id}: {api_path}")

            for pattern in RETIRED_COMMERCE_OPERATION_ID_PATTERNS:
                if pattern.search(operation_id):
                    violations.append(f"{operation_id}: {api_path}")
                    break

        self.assertEqual([], violations)

    def test_commerce_routes_are_unique_per_surface_method_path(self) -> None:
        operations = load_frontend_operations()
        commerce_prefixes = (
            "/app/v3/api/accounts/",
            "/app/v3/api/catalog/",
            "/app/v3/api/cart",
            "/app/v3/api/addresses",
            "/app/v3/api/checkout",
            "/app/v3/api/orders",
            "/app/v3/api/payments/",
            "/app/v3/api/refunds",
            "/app/v3/api/fulfillments",
            "/app/v3/api/shipments",
            "/app/v3/api/memberships",
            "/app/v3/api/recharges",
            "/app/v3/api/billing",
            "/app/v3/api/wallet",
            "/app/v3/api/promotions",
            "/app/v3/api/invoices",
            "/backend/v3/api/catalog/",
            "/backend/v3/api/inventory/",
            "/backend/v3/api/orders",
            "/backend/v3/api/payments/",
            "/backend/v3/api/refunds",
            "/backend/v3/api/fulfillments",
            "/backend/v3/api/shipments",
            "/backend/v3/api/memberships",
            "/backend/v3/api/recharges",
            "/backend/v3/api/wallet",
            "/backend/v3/api/promotions",
            "/backend/v3/api/invoices",
            "/backend/v3/api/commerce_reports",
            "/backend/v3/api/audit/commerce_events",
        )
        operations = [
            operation
            for operation in operations
            if operation.get("openapi_exposed", True) is not False
            and str(operation.get("api_path") or "").startswith(commerce_prefixes)
        ]
        route_keys = [
            (
                str(operation.get("api_surface") or ""),
                str(operation.get("api_method") or ""),
                str(operation.get("api_path") or ""),
            )
            for operation in operations
        ]
        duplicate_routes = [route for route, count in Counter(route_keys).items() if count > 1]

        operation_keys = [
            (
                str(operation.get("api_surface") or ""),
                str(operation.get("operation_id") or ""),
            )
            for operation in operations
        ]
        duplicate_operation_ids = [operation_id for operation_id, count in Counter(operation_keys).items() if count > 1]

        self.assertEqual([], duplicate_routes)
        self.assertEqual([], duplicate_operation_ids)

    def test_canonical_design_defines_product_order_and_payment_centers(self) -> None:
        design = (
            ROOT
            / "docs"
            / "superpowers"
            / "specs"
            / "2026-05-21-appbase-commerce-standard-design.md"
        ).read_text(encoding="utf-8")

        for required in [
            "Unified Product Center",
            "Catalog",
            "Unified Order Center",
            "Unified Payment Center",
            "SPU",
            "SKU",
            "category",
            "attributes",
            "payment provider",
            "checkout",
            "fulfillment",
        ]:
            self.assertIn(required, design)

    def test_product_center_uses_unified_standard_tables(self) -> None:
        capability = APPBASE_CAPABILITY_PATH.read_text(encoding="utf-8")
        table_registry = render_table_registry()
        field_contracts = FIELD_CONTRACTS_PATH.read_text(encoding="utf-8")

        for scope in [
            "product-center",
            "catalog",
            "spu",
            "sku",
            "category",
            "attribute",
            "price-list",
            "inventory",
        ]:
            self.assertIn(f"- {scope}", capability)

        for table in [
            "commerce_product_category",
            "commerce_product_spu",
            "commerce_product_sku",
            "commerce_product_attribute",
            "commerce_product_attribute_value",
            "commerce_product_sku_attribute",
            "commerce_product_media",
            "commerce_price_list",
            "commerce_price_list_item",
            "commerce_inventory_stock",
            "commerce_inventory_reservation",
            "commerce_inventory_ledger",
        ]:
            self.assertIn(f"- table: {table}", table_registry)

        self.assertNotIn("\n- table: commerce_product\n", table_registry)
        self.assertNotIn("\n- table: commerce_sku\n", table_registry)
        self.assertNotIn("commerce_product, commerce_sku", field_contracts)

    def test_transaction_loop_uses_complete_standard_tables(self) -> None:
        table_registry = render_table_registry()
        field_contracts = FIELD_CONTRACTS_PATH.read_text(encoding="utf-8")

        for table in [
            "commerce_cart",
            "commerce_cart_item",
            "commerce_user_address",
            "commerce_order_address_snapshot",
            "commerce_checkout_session",
            "commerce_checkout_line",
            "commerce_checkout_quote",
            "commerce_payment_provider",
            "commerce_payment_provider_account",
            "commerce_payment_route_rule",
            "commerce_refund_item",
            "commerce_refund_attempt",
            "commerce_fulfillment_order",
            "commerce_fulfillment_item",
            "commerce_shipment",
            "commerce_digital_delivery",
            "commerce_invoice_event",
            "commerce_membership_plan",
            "commerce_membership_package",
            "commerce_membership_package_group",
            "commerce_membership",
            "commerce_membership_entitlement",
            "commerce_membership_entitlement_usage",
        ]:
            self.assertIn(f"- table: {table}", table_registry)

        self.assertNotIn("commerce_vip_", table_registry)
        self.assertNotIn("commerce_vip_", field_contracts)

    def test_payment_center_exposes_standard_provider_method_contracts_to_openapi_and_sdks(self) -> None:
        backend_schemas = json.loads(BACKEND_OPENAPI_PATH.read_text(encoding="utf-8"))["components"]["schemas"]
        app_schemas = json.loads(APP_OPENAPI_PATH.read_text(encoding="utf-8"))["components"]["schemas"]

        provider_schema = backend_schemas.get("CommercePaymentProviderItem", {})
        provider_code_schema = provider_schema.get("properties", {}).get("providerCode", {})
        self.assertGreaterEqual(set(provider_code_schema.get("enum", [])), STANDARD_PAYMENT_PROVIDER_CODES)

        account_request_schema = backend_schemas.get("CommercePaymentProviderAccountMutationRequest", {})
        self.assertEqual(
            [
                "accountNo",
                "providerCode",
                "merchantId",
                "environment",
                "countryCode",
                "settlementCurrency",
                "secretRef",
                "status",
            ],
            account_request_schema.get("required"),
        )
        self.assertNotIn("metadata", account_request_schema.get("properties", {}))

        for schemas in (backend_schemas, app_schemas):
            method_schema = schemas.get("CommercePaymentMethodItem", {})
            method_code_schema = method_schema.get("properties", {}).get("methodCode", {})
            self.assertGreaterEqual(set(method_code_schema.get("enum", [])), STANDARD_PAYMENT_METHOD_CODES)

        for types_dir in (APP_SDK_TYPES_PATH, BACKEND_SDK_TYPES_PATH):
            method_source = (types_dir / "commerce-payment-method-item.ts").read_text(encoding="utf-8")
            self.assertIn("wechat_pay", method_source)
            self.assertIn("alipay", method_source)

        backend_provider_source = (BACKEND_SDK_TYPES_PATH / "commerce-payment-provider-item.ts").read_text(
            encoding="utf-8"
        )
        backend_account_request_source = (
            BACKEND_SDK_TYPES_PATH / "commerce-payment-provider-account-mutation-request.ts"
        ).read_text(encoding="utf-8")
        for provider_code in STANDARD_PAYMENT_PROVIDER_CODES:
            self.assertIn(provider_code, backend_provider_source)
            self.assertIn(provider_code, backend_account_request_source)

    def test_admin_payments_frontend_uses_strong_payment_center_sdk_contracts(self) -> None:
        service = (
            PORTAL_PATH
            / "packages"
            / "sdkwork-claw-router-admin-payments"
            / "src"
            / "paymentsService.ts"
        ).read_text(encoding="utf-8")
        view = (
            PORTAL_PATH
            / "packages"
            / "sdkwork-claw-router-admin-payments"
            / "src"
            / "index.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("PaymentProviderAccountMutationInput", service)
        self.assertIn("Parameters<BackendCommerce['payments']['providerAccounts']['create']>[0]", service)
        self.assertNotIn("PaymentProviderAccountMetadata", service)
        self.assertNotIn("metadata", service)

        self.assertIn("toPaymentProviderAccountRequest", view)
        self.assertIn("accountNo: requiredText(form.accountNo, 'accountNo')", view)
        self.assertIn("providerCode: requiredPaymentProviderCode(form.providerCode)", view)
        self.assertIn("environment: requiredPaymentEnvironment(form.environment)", view)
        self.assertIn("status: requiredPaymentStatus(form.status)", view)

        for required_column_key in [
            "providerCode",
            "displayName",
            "providerType",
            "updatedAt",
            "accountNo",
            "merchantId",
            "settlementCurrency",
            "countryCode",
            "methodCode",
            "channelNo",
            "providerAccountId",
            "currencyCode",
            "sceneCode",
            "ruleNo",
            "intentNo",
            "orderId",
            "createdAt",
            "attemptNo",
            "intentId",
            "externalTradeNo",
            "eventNo",
            "eventType",
            "processStatus",
            "receivedAt",
            "runNo",
            "businessDate",
            "finishedAt",
        ]:
            self.assertIn(f"'{required_column_key}'", view)

        for retired_wire_field in [
            "provider_code",
            "display_name",
            "provider_type",
            "updated_at",
            "account_no",
            "merchant_id",
            "country_code",
            "settlement_currency",
            "method_key",
            "channel_no",
            "provider_account_id",
            "currency_code",
            "scene_code",
            "rule_no",
            "intent_no",
            "order_id",
            "created_at",
            "attempt_no",
            "intent_id",
            "external_trade_no",
            "event_no",
            "event_type",
            "process_status",
            "received_at",
            "run_no",
            "business_date",
            "finished_at",
        ]:
            self.assertNotIn(f"'{retired_wire_field}'", view)

    def test_product_and_inventory_operations_are_integrated_with_standard_tables(self) -> None:
        operations = {
            (
                operation.get("api_surface"),
                operation.get("api_method"),
                operation.get("api_path"),
                operation.get("operation_id"),
            ): operation
            for operation in load_frontend_operations()
            if operation.get("openapi_exposed", True) is not False
        }

        product_list = operations[("app", "GET", "/app/v3/api/catalog/products", "catalog.products.list")]
        self.assertGreaterEqual(
            set(product_list.get("read_sources", [])),
            {
                "commerce_product_spu",
                "commerce_product_sku",
                "commerce_product_category",
                "commerce_product_media",
                "commerce_price_list",
                "commerce_price_list_item",
            },
        )

        sku_create = operations[("backend", "POST", "/backend/v3/api/catalog/skus", "catalog.skus.create")]
        self.assertTrue(sku_create.get("idempotency_required"))
        self.assertGreaterEqual(
            set(sku_create.get("write_tables", [])),
            {"commerce_product_sku", "commerce_product_sku_attribute", "ops_audit_log"},
        )

        stock_update = operations[
            ("backend", "PATCH", "/backend/v3/api/inventory/stocks/{stockId}", "inventory.stocks.update")
        ]
        self.assertTrue(stock_update.get("idempotency_required"))
        self.assertGreaterEqual(
            set(stock_update.get("write_tables", [])),
            {"commerce_inventory_stock", "commerce_inventory_ledger", "ops_audit_log"},
        )

        reservation_list = operations[
            ("backend", "GET", "/backend/v3/api/inventory/reservations", "inventory.reservations.list")
        ]
        self.assertGreaterEqual(
            set(reservation_list.get("read_sources", [])),
            {
                "commerce_inventory_reservation",
                "commerce_inventory_stock",
                "commerce_product_sku",
                "commerce_checkout_session",
                "commerce_order",
            },
        )

    def test_promotion_coupon_currency_is_first_class_across_lifecycle(self) -> None:
        registry = load_table_registry()
        tables = {
            table.get("table"): table
            for table in registry.get("tables", [])
            if isinstance(table, dict) and isinstance(table.get("table"), str)
        }

        expected_currency_columns = {
            "promotion_offer_version": "currency_code",
            "promotion_budget_account": "currency_code",
            "promotion_budget_ledger_entry": "currency_code",
            "promotion_coupon_stock": "currency_code",
            "promotion_user_coupon": "currency_code",
            "promotion_discount_application": "currency_code",
            "promotion_discount_allocation": "currency_code",
            "promotion_external_binding": "external_currency_code",
        }
        missing = [
            f"{table}.{column}"
            for table, column in expected_currency_columns.items()
            if column not in tables.get(table, {}).get("columns", {})
        ]
        self.assertEqual([], missing)

        offer_version_columns = tables["promotion_offer_version"]["columns"]
        self.assertIn("discount_amount_minor", offer_version_columns)
        self.assertIn("fixed_price_minor", offer_version_columns)
        self.assertIn("maximum_discount_amount_minor", offer_version_columns)
        self.assertIn("minimum_order_amount_minor", offer_version_columns)

        user_coupon_columns = tables["promotion_user_coupon"]["columns"]
        for snapshot_column in [
            "face_value_minor",
            "maximum_discount_amount_minor",
            "minimum_order_amount_minor",
            "discount_percent_bps",
            "currency_code",
        ]:
            self.assertIn(snapshot_column, user_coupon_columns)

        for table in [
            "promotion_discount_application",
            "promotion_discount_allocation",
        ]:
            self.assertIn("currency_code", tables[table].get("not_null_columns", []))

    def test_promotion_coupon_industry_platform_capabilities_are_first_class(self) -> None:
        registry = load_table_registry()
        tables = {
            table.get("table"): table
            for table in registry.get("tables", [])
            if isinstance(table, dict) and isinstance(table.get("table"), str)
        }

        for table in [
            "promotion_offer_presentation",
            "promotion_code_redemption",
            "promotion_external_operation",
        ]:
            self.assertIn(table, tables)

        presentation_columns = tables["promotion_offer_presentation"]["columns"]
        for column in [
            "offer_version_id",
            "display_name",
            "merchant_display_name",
            "brand_name",
            "logo_asset_id",
            "cover_asset_id",
            "primary_color",
            "terms_json",
            "customer_action_json",
            "style_snapshot_json",
        ]:
            self.assertIn(column, presentation_columns)

        offer_version_columns = tables["promotion_offer_version"]["columns"]
        for column in [
            "validity_type",
            "validity_duration_seconds",
            "return_policy",
            "settlement_policy",
            "customer_visible",
        ]:
            self.assertIn(column, offer_version_columns)

        stock_columns = tables["promotion_coupon_stock"]["columns"]
        for column in [
            "issue_channel",
            "stock_creator_merchant_id",
            "budget_warning_threshold_bps",
            "budget_stop_threshold_bps",
            "overspend_policy",
        ]:
            self.assertIn(column, stock_columns)

        code_columns = tables["promotion_code"]["columns"]
        self.assertIn("currency_code", code_columns)
        self.assertIn("currency_code", tables["promotion_code"].get("not_null_columns", []))

        redemption_columns = tables["promotion_code_redemption"]["columns"]
        for column in [
            "redemption_no",
            "submitted_code_hash",
            "submitted_code_suffix",
            "code_id",
            "stock_id",
            "user_coupon_id",
            "subject_type",
            "subject_id",
            "currency_code",
            "result_status",
            "failure_code",
            "redemption_channel",
            "request_no",
            "idempotency_key",
        ]:
            self.assertIn(column, redemption_columns)
        self.assertNotIn("plain_code", redemption_columns)
        self.assertNotIn("submitted_code", redemption_columns)

        external_operation_columns = tables["promotion_external_operation"]["columns"]
        for column in [
            "operation_no",
            "binding_id",
            "platform",
            "operation_type",
            "external_request_no",
            "external_operation_id",
            "external_status",
            "request_hash",
            "response_hash",
            "sanitized_request_json",
            "sanitized_response_json",
            "retry_count",
            "next_retry_at",
            "idempotency_key",
        ]:
            self.assertIn(column, external_operation_columns)

        operations = {
            operation.get("operation_id"): operation
            for operation in load_frontend_operations()
            if operation.get("operation_id")
        }
        self.assertIn(
            "promotion_code_redemption",
            operations["promotions.codes.redemptions.create"].get("write_tables", []),
        )
        self.assertIn(
            "promotion_code_redemption",
            operations["promotions.codes.redemptions.list"].get("read_sources", []),
        )
        self.assertIn(
            "promotion_external_operation",
            operations["promotions.externalBindings.list"].get("read_sources", []),
        )

    def test_promotion_coupon_external_platform_interface_details_are_first_class(self) -> None:
        registry = load_table_registry()
        tables = {
            table.get("table"): table
            for table in registry.get("tables", [])
            if isinstance(table, dict) and isinstance(table.get("table"), str)
        }

        offer_version_columns = tables["promotion_offer_version"]["columns"]
        for column in [
            "benefit_kind",
            "face_value_minor",
            "liability_policy",
            "breakage_policy",
            "tax_treatment",
        ]:
            self.assertIn(column, offer_version_columns)
        self.assertNotIn("stored_value_amount_minor", offer_version_columns)
        self.assertNotIn("issuer_liability_policy", offer_version_columns)

        presentation_columns = tables["promotion_offer_presentation"]["columns"]
        for column in [
            "param_schema_json",
            "field_schema_json",
            "verify_method",
            "recognition_type",
            "recognition_hash",
        ]:
            self.assertIn(column, presentation_columns)
        for retired_column in [
            "template_param_schema_json",
            "dynamic_field_schema_json",
            "verification_method",
            "recognition_payload_hash",
        ]:
            self.assertNotIn(retired_column, presentation_columns)

        budget_columns = tables["promotion_budget_account"]["columns"]
        for column in [
            "planned_amount_minor",
            "overrun_amount_minor",
            "lock_mode",
        ]:
            self.assertIn(column, budget_columns)
        for retired_column in [
            "estimated_spend_amount_minor",
            "actual_spend_amount_minor",
            "overspend_amount_minor",
            "budget_lock_mode",
        ]:
            self.assertNotIn(retired_column, budget_columns)

        stock_columns = tables["promotion_coupon_stock"]["columns"]
        for column in [
            "code_mode",
            "activation_status",
            "cancel_until",
            "can_resend",
        ]:
            self.assertIn(column, stock_columns)
        self.assertNotIn("code_batch_no", stock_columns)
        self.assertNotIn("batch_no", stock_columns)
        self.assertNotIn("preloaded_code_batch_no", stock_columns)
        self.assertNotIn("cancelable_until", stock_columns)
        self.assertNotIn("resend_eligible", stock_columns)

        code_columns = tables["promotion_code"]["columns"]
        for column in [
            "claim_code_hash",
            "claim_code_suffix",
            "activation_status",
            "activated_at",
            "canceled_at",
            "cancel_until",
            "can_resend",
        ]:
            self.assertIn(column, code_columns)
        self.assertNotIn("code_batch_no", code_columns)
        self.assertNotIn("external_claim_code", code_columns)
        self.assertNotIn("external_claim_code_hash", code_columns)
        self.assertNotIn("preloaded_code_batch_no", code_columns)
        self.assertNotIn("cancelable_until", code_columns)
        self.assertNotIn("resend_eligible", code_columns)

        user_coupon_columns = tables["promotion_user_coupon"]["columns"]
        for column in [
            "verify_method",
            "recognition_type",
            "recognition_hash",
            "claim_code_hash",
            "claim_code_suffix",
            "activation_status",
            "cancel_until",
            "can_resend",
        ]:
            self.assertIn(column, user_coupon_columns)
        self.assertNotIn("external_claim_code", user_coupon_columns)
        self.assertNotIn("recognition_payload_hash", user_coupon_columns)
        self.assertNotIn("verification_method", user_coupon_columns)
        self.assertNotIn("cancelable_until", user_coupon_columns)
        self.assertNotIn("resend_eligible", user_coupon_columns)

        external_binding_columns = tables["promotion_external_binding"]["columns"]
        for column in [
            "platform_template_id",
            "platform_stock_id",
            "platform_card_id",
            "platform_coupon_id",
            "claim_code_hash",
            "claim_code_suffix",
        ]:
            self.assertIn(column, external_binding_columns)
        self.assertNotIn("external_claim_code", external_binding_columns)
        self.assertNotIn("external_template_id", external_binding_columns)
        self.assertNotIn("external_stock_id", external_binding_columns)
        self.assertNotIn("external_card_id", external_binding_columns)
        self.assertNotIn("external_coupon_id", external_binding_columns)

        external_operation_columns = tables["promotion_external_operation"]["columns"]
        for column in [
            "provider_request_id",
            "provider_code",
            "callback_id",
            "callback_sig_hash",
            "callback_at",
            "cancel_until",
            "replay_op_id",
        ]:
            self.assertIn(column, external_operation_columns)
        self.assertNotIn("raw_request_json", external_operation_columns)
        self.assertNotIn("raw_response_json", external_operation_columns)
        self.assertNotIn("claim_code", external_operation_columns)
        for retired_column in [
            "provider_response_code",
            "callback_event_id",
            "callback_signature_hash",
            "callback_received_at",
            "cancelable_until",
            "replay_of_operation_id",
        ]:
            self.assertNotIn(retired_column, external_operation_columns)

        for column in [
            "face_value_minor",
            "liability_policy",
            "param_schema_json",
            "field_schema_json",
            "recognition_hash",
            "planned_amount_minor",
            "overrun_amount_minor",
            "claim_code_hash",
            "platform_template_id",
            "callback_sig_hash",
        ]:
            self.assertLessEqual(len(column), 24)

        for openapi_path in [APP_OPENAPI_PATH, BACKEND_OPENAPI_PATH]:
            schemas = json.loads(openapi_path.read_text(encoding="utf-8"))["components"]["schemas"]
            self.assertIn(
                "face_value_minor",
                schemas["PromotionOfferVersionRecord"]["properties"],
            )
            self.assertIn(
                "planned_amount_minor",
                schemas["PromotionBudgetAccountRecord"]["properties"],
            )
            self.assertIn(
                "can_resend",
                schemas["PromotionCouponStockRecord"]["properties"],
            )

        for types_dir in [APP_SDK_TYPES_PATH, BACKEND_SDK_TYPES_PATH]:
            self.assertIn(
                "face_value_minor",
                (types_dir / "promotion-offer-version-record.ts").read_text(encoding="utf-8"),
            )
            self.assertIn(
                "planned_amount_minor",
                (types_dir / "promotion-budget-account-record.ts").read_text(encoding="utf-8"),
            )
            self.assertIn(
                "can_resend",
                (types_dir / "promotion-coupon-stock-record.ts").read_text(encoding="utf-8"),
            )

    def test_commerce_api_contracts_are_first_class(self) -> None:
        operations = {
            (
                operation.get("api_surface"),
                operation.get("api_method"),
                operation.get("api_path"),
                operation.get("operation_id"),
            )
            for operation in load_frontend_operations()
            if operation.get("openapi_exposed", True) is not False
        }

        missing = set(CANONICAL_COMMERCE_API_OPERATIONS) - operations
        self.assertEqual(set(), missing)

    def test_frontend_business_packages_and_paths_are_business_scoped(self) -> None:
        app = (PORTAL_PATH / "src" / "App.tsx").read_text(encoding="utf-8")
        admin_layout = (PORTAL_PATH / "src" / "AdminLayout.tsx").read_text(encoding="utf-8")
        console_layout = (
            PORTAL_PATH
            / "packages"
            / "sdkwork-claw-router-console-core"
            / "src"
            / "ConsoleLayout.tsx"
        ).read_text(encoding="utf-8")
        portal_package = (PORTAL_PATH / "package.json").read_text(encoding="utf-8")
        tsconfig = (PORTAL_PATH / "tsconfig.typecheck.json").read_text(encoding="utf-8")

        console_packages = [
            ("sdkwork-claw-router-console-account", "/console/account"),
            ("sdkwork-claw-router-console-wallet", "/console/wallet"),
            ("sdkwork-claw-router-console-recharge", "/console/recharge"),
            ("sdkwork-claw-router-console-checkout", "/console/checkout"),
            ("sdkwork-claw-router-console-memberships", "/console/memberships"),
            ("sdkwork-claw-router-console-settlements", "/console/settlements"),
        ]
        hidden_console_routes = {
            "/console/recharge",
            "/console/checkout",
        }
        admin_packages = [
            ("sdkwork-claw-router-admin-catalog", "/admin/catalog"),
            ("sdkwork-claw-router-admin-inventory", "/admin/inventory"),
            ("sdkwork-claw-router-admin-orders", "/admin/orders"),
            ("sdkwork-claw-router-admin-payments", "/admin/payments"),
            ("sdkwork-claw-router-admin-memberships", "/admin/memberships"),
            ("sdkwork-claw-router-admin-wallet", "/admin/wallet"),
            ("sdkwork-claw-router-admin-finance", "/admin/finance"),
        ]

        for package_name, route_path in [*console_packages, *admin_packages]:
            package_dir = PORTAL_PATH / "packages" / package_name
            self.assertTrue(package_dir.exists(), f"{package_name} package should exist")
            self.assertIn(f'"{package_name}": "workspace:*"', portal_package)
            self.assertIn(f'"{package_name}"', tsconfig)
            self.assertIn(f"import('{package_name}')", app)
            self.assertIn(route_path, app)

        for route_path in [route for _, route in console_packages if route not in hidden_console_routes]:
            self.assertIn(route_path, console_layout)
        for route_path in hidden_console_routes:
            self.assertNotIn(route_path, console_layout)
        for route_path in [route for _, route in admin_packages]:
            self.assertIn(route_path, admin_layout)

        for forbidden in [
            "sdkwork-claw-router-console-commerce",
            "sdkwork-claw-router-admin-commerce",
            'path="commerce"',
            "/console/commerce",
            "/admin/commerce",
            "/console/billing",
            'path="billing"',
        ]:
            self.assertNotIn(forbidden, app)
            self.assertNotIn(forbidden, portal_package)
            self.assertNotIn(forbidden, tsconfig)
            self.assertNotIn(forbidden, console_layout)
            self.assertNotIn(forbidden, admin_layout)

    def test_console_memberships_rehomes_membership_purchase_without_legacy_vip_route(self) -> None:
        view = (
            PORTAL_PATH
            / "packages"
            / "sdkwork-claw-router-console-memberships"
            / "src"
            / "MembershipsView.tsx"
        ).read_text(encoding="utf-8")
        service = (
            PORTAL_PATH
            / "packages"
            / "sdkwork-claw-router-console-memberships"
            / "src"
            / "membershipService.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("handleMembershipPurchase", view)
        self.assertIn("MembershipService.fetchMembershipSummary", view)
        self.assertIn("MembershipService.fetchMembershipPackages", view)
        self.assertIn("MembershipService.purchaseMembership", view)
        self.assertIn("getClawRouterAppSdkClient().commerce.memberships.current.retrieve", service)
        self.assertIn("getClawRouterAppSdkClient().commerce.memberships.packages.list", service)
        self.assertIn("getClawRouterAppSdkClient().commerce.memberships.purchases.create", service)
        self.assertIn("packageId: requiredPositiveIntegerId(packageId, 'packageId')", service)
        self.assertIn("paymentMethod: 'wechat'", service)
        self.assertNotIn("createClientOperationToken('membership-purchase')", service)
        self.assertNotIn("metadata:", service)
        self.assertNotIn('"/vip"', view)
        self.assertNotIn("'/vip'", view)
        self.assertNotIn("from './commerceService'", view)
        self.assertNotIn('from "./commerceService"', view)
        self.assertNotIn("ConsoleCommerceService", view)
        self.assertNotIn("ConsoleCommerceService", service)
        self.assertNotIn("console-commerce", service)

    def test_commons_does_not_own_concrete_commerce_business_runtime(self) -> None:
        commons_dir = PORTAL_PATH / "packages" / "sdkwork-claw-router-commons"
        runtime = (commons_dir / "src" / "runtime.ts").read_text(encoding="utf-8")
        package_json = (commons_dir / "package.json").read_text(encoding="utf-8")
        index = (commons_dir / "src" / "index.ts").read_text(encoding="utf-8")

        self.assertFalse(
            (commons_dir / "src" / "commerce-runtime.ts").exists(),
            "commons must not own concrete commerce/catalog/inventory/order/payment runtime wrappers",
        )
        self.assertNotIn("commerce-runtime", runtime)
        self.assertNotIn("commerce-runtime", index)
        self.assertNotIn("@sdkwork/commerce-service", package_json)
        self.assertNotIn("@sdkwork/commerce-sdk-ports", package_json)

        business_services = {
            "sdkwork-claw-router-console-account/src/accountService.ts": "getClawRouterAppSdkClient().commerce.accounts.current.summary.retrieve",
            "sdkwork-claw-router-console-recharge/src/rechargeService.ts": "getClawRouterAppSdkClient().commerce.recharges.orders.create",
            "sdkwork-claw-router-console-checkout/src/checkoutService.ts": "getClawRouterAppSdkClient().commerce.recharges.orders.retrieve",
            "sdkwork-claw-router-console-memberships/src/membershipService.ts": "getClawRouterAppSdkClient().commerce.memberships.purchases.create",
            "sdkwork-claw-router-console-wallet/src/walletService.ts": "getClawRouterAppSdkClient().commerce.wallet.overview.retrieve",
            "sdkwork-claw-router-console-settlements/src/settlementsService.ts": "getClawRouterAppSdkClient().commerce.invoices.list",
            "sdkwork-claw-router-admin-catalog/src/catalogService.ts": "getClawRouterBackendSdkClient().commerce.catalog.products.list",
            "sdkwork-claw-router-admin-inventory/src/inventoryService.ts": "getClawRouterBackendSdkClient().commerce.inventory.stocks.list",
            "sdkwork-claw-router-admin-orders/src/ordersService.ts": "getClawRouterBackendSdkClient().commerce.orders.list",
            "sdkwork-claw-router-admin-payments/src/paymentsService.ts": "getClawRouterBackendSdkClient().commerce.payments.providers.list",
            "sdkwork-claw-router-admin-memberships/src/membershipsService.ts": "getClawRouterBackendSdkClient().commerce.memberships.plans.list",
            "sdkwork-claw-router-admin-wallet/src/walletService.ts": "getClawRouterBackendSdkClient().commerce.wallet.accounts.list",
            "sdkwork-claw-router-admin-finance/src/financeService.ts": "getClawRouterBackendSdkClient().commerce.invoices.list",
        }

        for relative_path, required_token in business_services.items():
            service = PORTAL_PATH / "packages" / relative_path
            self.assertTrue(service.exists(), f"{relative_path} should own its business service")
            content = service.read_text(encoding="utf-8")
            self.assertIn(required_token, content, f"{relative_path} should call its SDK surface directly")
            self.assertNotIn("getClawRouterCommerceService", content)

    def test_console_business_packages_move_existing_pages_without_legacy_billing_route(self) -> None:
        migrated_files = {
            "sdkwork-claw-router-console-account/src/AccountView.tsx": [
                "AccountView",
                "AccountStats",
                "/console/recharge",
            ],
            "sdkwork-claw-router-console-wallet/src/WalletView.tsx": [
                "WalletView",
                "RechargeRecordsTabs",
                "recordsRefreshSeed",
            ],
            "sdkwork-claw-router-console-recharge/src/RechargeView.tsx": [
                "RechargeView",
                "RechargePackage",
                "RechargeRecordsTabs",
                "RechargeService.fetchBillingHistory",
                "/console/checkout",
            ],
            "sdkwork-claw-router-console-checkout/src/CheckoutView.tsx": [
                "CheckoutView",
                "CheckoutStatus",
                "fetchCheckoutStatus",
                "/console/recharge",
            ],
            "sdkwork-claw-router-console-settlements/src/SettlementsView.tsx": [
                "SettlementsView",
                "SettlementChartData",
                "loadSettlementDashboard",
            ],
        }

        for relative_path, required_tokens in migrated_files.items():
            content = (PORTAL_PATH / "packages" / relative_path).read_text(encoding="utf-8")
            for token in required_tokens:
                self.assertIn(token, content, f"{relative_path} should preserve migrated UI token {token!r}")
            self.assertNotIn("/console/billing", content)
            self.assertNotIn("/console/commerce", content)
            self.assertNotIn("./commerceService", content)
            self.assertNotIn("./billingService", content)
            if relative_path == "sdkwork-claw-router-console-wallet/src/WalletView.tsx":
                self.assertNotIn("RedeemHistoryTable", content)
                self.assertNotIn("BusinessStateTableRow", content)
                self.assertNotIn("fetchRedeemHistory", content)
                self.assertNotIn("fetchRechargeHistory", content)

    def test_admin_business_packages_are_split_by_transaction_capability(self) -> None:
        package_requirements = {
            "sdkwork-claw-router-admin-catalog": (
                "catalogService.ts",
                "CatalogAdmin",
                [
                    "listCommerceProducts",
                    "listCommerceSkus",
                    "listCommerceCategories",
                    "listCommerceAttributes",
                    "listCommercePriceLists",
                ],
            ),
            "sdkwork-claw-router-admin-inventory": (
                "inventoryService.ts",
                "InventoryAdmin",
                [
                    "listInventoryStocks",
                    "listInventoryReservations",
                    "listInventoryLedgerEntries",
                ],
            ),
            "sdkwork-claw-router-admin-orders": (
                "ordersService.ts",
                "OrdersAdmin",
                [
                    "backendOrdersList",
                    "backendRefundsList",
                    "backendFulfillmentsList",
                    "backendShipmentsList",
                ],
            ),
            "sdkwork-claw-router-admin-payments": (
                "paymentsService.ts",
                "PaymentsAdmin",
                [
                    "backendPaymentsProvidersList",
                    "backendPaymentsProviderAccountsList",
                    "backendPaymentsMethodsList",
                    "backendPaymentsChannelsList",
                    "backendPaymentsRouteRulesList",
                    "backendPaymentsIntentsList",
                    "backendPaymentsAttemptsList",
                    "backendPaymentsWebhookEventsList",
                    "backendPaymentsReconciliationRunsList",
                    "backendPaymentsProviderAccountsCreate",
                ],
            ),
            "sdkwork-claw-router-admin-memberships": (
                "membershipsService.ts",
                "MembershipsAdmin",
                [
                    "backendMembershipsPlansList",
                    "backendMembershipsPackagesList",
                    "backendMembershipsMembersList",
                    "backendMembershipsEntitlementsList",
                    "backendMembershipsRechargePackagesList",
                    "backendMembershipsRechargePackagesCreate",
                    "backendMembershipsRechargePackagesUpdate",
                    "backendMembershipsRechargePackagesDelete",
                ],
            ),
            "sdkwork-claw-router-admin-wallet": (
                "walletService.ts",
                "WalletAdmin",
                [
                    "backendRechargesOrdersList",
                    "backendWalletAccountsList",
                    "backendWalletLedgerEntriesList",
                    "backendWalletExchangeRulesList",
                ],
            ),
            "sdkwork-claw-router-admin-finance": (
                "financeService.ts",
                "FinanceAdmin",
                [
                    "backendInvoicesTitlesList",
                    "backendInvoicesList",
                    "backendCommerceReportsPaymentReconciliationRetrieve",
                    "backendCommerceReportsOrderRevenueList",
                    "backendCommerceReportsRefundsList",
                    "backendAuditCommerceEventsList",
                ],
            ),
        }

        for package_name, (service_file_name, admin_component, required_service_tokens) in package_requirements.items():
            view_content = (PORTAL_PATH / "packages" / package_name / "src" / "index.tsx").read_text(encoding="utf-8")
            service_content = (
                PORTAL_PATH / "packages" / package_name / "src" / service_file_name
            ).read_text(encoding="utf-8")
            self.assertIn(admin_component, view_content, f"{package_name} should own {admin_component}")
            for token in required_service_tokens:
                self.assertIn(token, service_content, f"{package_name} should own {token}")
            self.assertNotIn("billing.finance", view_content)
            self.assertNotIn("billing.finance", service_content)
            self.assertNotIn("sdkwork-claw-router-admin-commerce", view_content)
            self.assertNotIn("sdkwork-claw-router-admin-commerce", service_content)
            if package_name == "sdkwork-claw-router-admin-wallet":
                self.assertNotIn("backendRechargesPackagesList", service_content)
                self.assertNotIn("recharges.packages.list", service_content)
                self.assertNotIn("rechargePackages", view_content)

        route_classification = ROUTE_CLASSIFICATION_PATH.read_text(encoding="utf-8")
        self.assertIn("/admin/memberships/recharge-packages", route_classification)
        self.assertNotIn("/admin/wallet/recharge-packages", route_classification)

        admin_marketing_service = (
            PORTAL_PATH
            / "packages"
            / "sdkwork-claw-router-admin-marketing"
            / "src"
            / "marketingService.ts"
        ).read_text(encoding="utf-8")
        self.assertIn("getClawRouterBackendSdkClient().system.marketing.referralStats.list", admin_marketing_service)
        self.assertNotIn("getClawRouterCommerceService().admin.coupons", admin_marketing_service)
        self.assertNotIn("getClawRouterCommerceService().admin.recharges", admin_marketing_service)
        self.assertNotIn("getClawRouterCommerceService().admin.payments", admin_marketing_service)

    @unittest.skip("retired commerce aggregate test replaced by business-scoped package and path tests")
    def test_console_commerce_rehomes_membership_purchase_without_legacy_vip_route(self) -> None:
        view = (
            PORTAL_PATH
            / "packages"
            / "sdkwork-claw-router-console-commerce"
            / "src"
            / "CommerceView.tsx"
        ).read_text(encoding="utf-8")
        service = (
            PORTAL_PATH
            / "packages"
            / "sdkwork-claw-router-console-commerce"
            / "src"
            / "commerceService.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("'memberships'", view)
        self.assertIn("handleMembershipPurchase", view)
        self.assertIn("CommerceService.fetchMembershipSummary", view)
        self.assertIn("CommerceService.fetchMembershipPackages", view)
        self.assertIn("CommerceService.purchaseMembership", view)
        self.assertIn("appMembershipsCurrentRetrieve", service)
        self.assertIn("appMembershipsPackagesList", service)
        self.assertIn("appMembershipsPurchasesCreate", service)
        self.assertNotIn('"/vip"', view)
        self.assertNotIn("'/vip'", view)

    @unittest.skip("retired commerce aggregate test replaced by business-scoped package and path tests")
    def test_console_commerce_moves_existing_commerce_pages_without_legacy_routes(self) -> None:
        console_commerce = PORTAL_PATH / "packages" / "sdkwork-claw-router-console-commerce" / "src"
        migrated_files = {
            "AccountOverviewView.tsx": [
                "AccountOverviewView",
                "/console/commerce?tab=recharge",
            ],
            "CommerceRechargeView.tsx": [
                "CommerceRechargeView",
                "/console/commerce?tab=checkout",
            ],
            "CommerceCheckoutView.tsx": [
                "CommerceCheckoutView",
                "CommerceService.fetchCheckoutStatus",
            ],
            "CommerceSettlementsView.tsx": [
                "CommerceSettlementsView",
                "CommerceService.fetchSettlementDashboard",
            ],
        }

        for filename, required_tokens in migrated_files.items():
            content = (console_commerce / filename).read_text(encoding="utf-8")
            for token in required_tokens:
                self.assertIn(token, content, f"{filename} should preserve migrated UI token {token!r}")
            self.assertNotIn("/console/billing", content)
            self.assertNotIn("/console/checkout", content)
            self.assertNotIn("sdkwork-claw-router-console-account", content)
            self.assertNotIn("sdkwork-claw-router-console-recharge", content)
            self.assertNotIn("sdkwork-claw-router-console-billing", content)
            self.assertNotIn("sdkwork-claw-router-console-settlements", content)

        commerce_view = (console_commerce / "CommerceView.tsx").read_text(encoding="utf-8")
        self.assertIn("<AccountOverviewView />", commerce_view)
        self.assertIn("<CommerceRechargeView />", commerce_view)
        self.assertIn("<CommerceCheckoutView />", commerce_view)
        self.assertIn("<CommerceSettlementsView />", commerce_view)

    @unittest.skip("retired commerce aggregate test replaced by business-scoped package and path tests")
    def test_admin_commerce_rehomes_transaction_management_sections(self) -> None:
        admin_commerce = (
            PORTAL_PATH
            / "packages"
            / "sdkwork-claw-router-admin-commerce"
            / "src"
            / "index.tsx"
        ).read_text(encoding="utf-8")
        admin_marketing_service = (
            PORTAL_PATH
            / "packages"
            / "sdkwork-claw-router-admin-marketing"
            / "src"
            / "marketingService.ts"
        ).read_text(encoding="utf-8")

        for required in [
            "backendOrdersList",
            "backendPaymentsProvidersList",
            "backendPaymentsProviderAccountsList",
            "backendPaymentsMethodsList",
            "backendPaymentsChannelsList",
            "backendPaymentsRouteRulesList",
            "backendPaymentsIntentsList",
            "backendPaymentsAttemptsList",
            "backendPaymentsWebhookEventsList",
            "backendPaymentsReconciliationRunsList",
            "backendRefundsList",
            "backendFulfillmentsList",
            "backendShipmentsList",
            "backendMembershipsPlansList",
            "backendMembershipsPackagesList",
            "backendMembershipsMembersList",
            "backendMembershipsEntitlementsList",
            "backendMembershipsRechargePackagesList",
            "backendRechargesOrdersList",
            "backendWalletAccountsList",
            "backendWalletLedgerEntriesList",
            "backendWalletExchangeRulesList",
            "backendPromotionOffersList",
            "backendPromotionCouponStocksList",
            "backendPromotionCodesList",
            "backendPromotionCodeRedemptionsList",
            "backendInvoicesTitlesList",
            "backendInvoicesList",
            "backendCommerceReportsPaymentReconciliationRetrieve",
            "backendCommerceReportsOrderRevenueList",
            "backendCommerceReportsRefundsList",
            "backendAuditCommerceEventsList",
        ]:
            self.assertIn(required, admin_commerce)

        self.assertIn("getClawRouterBackendSdkClient().system.marketing.referralStats.list", admin_marketing_service)
        self.assertNotIn("getClawRouterCommerceService().admin.coupons", admin_marketing_service)
        self.assertNotIn("getClawRouterCommerceService().admin.recharges", admin_marketing_service)
        self.assertNotIn("getClawRouterCommerceService().admin.payments", admin_marketing_service)

    @unittest.skip("retired commerce aggregate test replaced by business-scoped package and path tests")
    def test_admin_commerce_moves_finance_management_without_old_finance_package(self) -> None:
        admin_commerce = PORTAL_PATH / "packages" / "sdkwork-claw-router-admin-commerce" / "src"
        finance_panel = (admin_commerce / "AdminFinancePanel.tsx").read_text(encoding="utf-8")
        finance_service = (admin_commerce / "adminFinanceService.ts").read_text(encoding="utf-8")
        commerce_admin = (admin_commerce / "index.tsx").read_text(encoding="utf-8")

        for token in [
            "AdminFinancePanel",
        ]:
            self.assertIn(token, finance_panel)

        for token in [
            "backendWalletLedgerEntriesList",
            "backendInvoicesList",
        ]:
            self.assertIn(token, finance_service)

        self.assertIn("financeCenter", commerce_admin)
        self.assertIn("<AdminFinancePanel />", commerce_admin)
        self.assertNotIn("sdkwork-claw-router-admin-finance", finance_panel)
        self.assertNotIn("billing.finance", finance_service)


if __name__ == "__main__":
    unittest.main()
