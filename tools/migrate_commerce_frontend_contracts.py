from __future__ import annotations

from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]
FIELD_CONTRACTS = ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
ROUTE_CLASSIFICATION = ROOT / "docs" / "schema-registry" / "frontend-route-classification.yaml"
TABLE_REGISTRY = ROOT / "docs" / "schema-registry" / "sdkwork-claw-router.tables.yaml"

CONSOLE_SERVICE = (
    "apps/sdkwork-claw-router-portal/packages/"
    "sdkwork-claw-router-commons/src/commerce-console-service.ts"
)
COMMERCE_RUNTIME = (
    "apps/sdkwork-claw-router-portal/packages/"
    "sdkwork-claw-router-commons/src/commerce-runtime.ts"
)

CONSOLE_OPERATION_ROUTES = {
    "listCatalogCategories": "/console/recharge",
    "listCatalogProducts": "/console/recharge",
    "retrieveCatalogProduct": "/console/recharge",
    "retrieveCatalogSku": "/console/recharge",
    "appAccountsCurrentSummaryRetrieve": "/console/account",
    "fetchAccountDetails": "/console/account",
    "appCartCurrentRetrieve": "/console/checkout",
    "appCartItemsCreate": "/console/checkout",
    "appCartItemsUpdate": "/console/checkout",
    "appCartItemsDelete": "/console/checkout",
    "appAddressesList": "/console/checkout",
    "appAddressesCreate": "/console/checkout",
    "appAddressesUpdate": "/console/checkout",
    "appAddressesDelete": "/console/checkout",
    "appAddressesDefaultSelectionCreate": "/console/checkout",
    "appCheckoutSessionsCreate": "/console/checkout",
    "appCheckoutSessionsRetrieve": "/console/checkout",
    "appCheckoutSessionsQuotesCreate": "/console/checkout",
    "appCheckoutSessionsOrdersCreate": "/console/checkout",
    "appOrdersList": "/console/checkout",
    "appOrdersRetrieve": "/console/checkout",
    "appOrdersEventsList": "/console/checkout",
    "appOrdersCancellationsCreate": "/console/checkout",
    "appWalletLedgerEntriesList": "/console/wallet",
    "appWalletLedgerEntriesRetrieve": "/console/wallet",
    "appWalletExchangesCreate": "/console/wallet",
    "appCouponsList": "/console/wallet",
    "appCouponsClaimsCreate": "/console/wallet",
    "appCouponsRedemptionsCreate": "/console/wallet",
    "fetchRedeemHistory": "/console/wallet",
    "fetchRechargeHistory": "/console/wallet",
    "redeemCode": "/console/wallet",
    "appRechargesPackagesList": "/console/recharge",
    "appRechargesOrdersCreate": "/console/recharge",
    "appRechargesOrdersRetrieve": "/console/checkout",
    "fetchRechargePackages": "/console/recharge",
    "submitRecharge": "/console/recharge",
    "fetchCheckoutStatus": "/console/checkout",
    "appPaymentsMethodsList": "/console/checkout",
    "appPaymentsIntentsCreate": "/console/checkout",
    "appPaymentsIntentsRetrieve": "/console/checkout",
    "appPaymentsIntentsAttemptsCreate": "/console/checkout",
    "appPaymentsAttemptsRetrieve": "/console/checkout",
    "appRefundsCreate": "/console/checkout",
    "appRefundsList": "/console/checkout",
    "appRefundsRetrieve": "/console/checkout",
    "appFulfillmentsList": "/console/checkout",
    "appFulfillmentsRetrieve": "/console/checkout",
    "appShipmentsRetrieve": "/console/checkout",
    "appMembershipsCurrentRetrieve": "/console/memberships",
    "appMembershipsPackagesList": "/console/memberships",
    "appMembershipsPurchasesCreate": "/console/memberships",
    "fetchMembershipSummary": "/console/memberships",
    "fetchMembershipPackages": "/console/memberships",
    "purchaseMembership": "/console/memberships",
    "appInvoicesList": "/console/settlements",
    "appInvoicesRetrieve": "/console/settlements",
    "appInvoicesCreate": "/console/settlements",
    "appWalletAccountsList": "/console/wallet",
    "fetchSettlementDashboard": "/console/settlements",
}

RUNTIME_CONSOLE_OPERATIONS = {
    operation
    for operation in CONSOLE_OPERATION_ROUTES
    if operation.startswith("app")
    or operation.startswith("listCatalog")
    or operation.startswith("retrieveCatalog")
}

PAGE_SERVICE_OPERATIONS = {
    "fetchAccountDetails",
    "fetchRechargePackages",
    "fetchMembershipSummary",
    "fetchMembershipPackages",
    "purchaseMembership",
    "submitRecharge",
    "fetchCheckoutStatus",
    "fetchSettlementDashboard",
    "fetchRedeemHistory",
    "fetchRechargeHistory",
    "redeemCode",
}

STALE_MODEL_CONTRACTS = {
    "BillingRecord",
    "TransactionRecord",
    "Batch",
    "Coupon",
    "CouponBatchGenerateInput",
    "CouponCreateInput",
    "ExchangeRule",
    "PaymentAttempt",
    "PointsExchangeRate",
    "PointsExchangeRule",
    "PromoCode",
    "RechargePackage",
    "RechargeRecord",
    "RedemptionRecord",
    "UserBalanceAdjustmentInput",
}

PAGE_SERVICE_OPERATION_ENTRIES = [
    {
        "route": "/console/account",
        "source": CONSOLE_SERVICE,
        "operation": "fetchAccountDetails",
        "operation_id": "console.accountDetails.retrieve",
        "operation_scope": "app_shell",
        "kind": "read",
        "api_surface": "app",
        "api_method": "GET",
        "api_path": "/app/v3/api/accounts/current/summary",
        "openapi_exposed": False,
        "read_sources": ["iam_user", "commerce_account", "commerce_invoice", "ai_usage_fact"],
        "write_tables": [],
        "file_targets": [],
    },
    {
        "route": "/console/recharge",
        "source": CONSOLE_SERVICE,
        "operation": "fetchRechargePackages",
        "operation_id": "console.rechargePackages.list",
        "operation_scope": "app_shell",
        "kind": "read",
        "api_surface": "app",
        "api_method": "GET",
        "api_path": "/app/v3/api/recharges/packages",
        "openapi_exposed": False,
        "read_sources": ["commerce_recharge_package", "commerce_product_spu", "commerce_product_sku"],
        "write_tables": [],
        "file_targets": [],
    },
    {
        "route": "/console/memberships",
        "source": CONSOLE_SERVICE,
        "operation": "fetchMembershipSummary",
        "operation_id": "console.membershipSummary.retrieve",
        "operation_scope": "app_shell",
        "kind": "read",
        "api_surface": "app",
        "api_method": "GET",
        "api_path": "/app/v3/api/memberships/current",
        "openapi_exposed": False,
        "read_sources": ["commerce_membership", "commerce_membership_plan", "commerce_membership_entitlement"],
        "write_tables": [],
        "file_targets": [],
    },
    {
        "route": "/console/memberships",
        "source": CONSOLE_SERVICE,
        "operation": "fetchMembershipPackages",
        "operation_id": "console.membershipPackages.list",
        "operation_scope": "app_shell",
        "kind": "read",
        "api_surface": "app",
        "api_method": "GET",
        "api_path": "/app/v3/api/memberships/packages",
        "openapi_exposed": False,
        "read_sources": ["commerce_membership_package", "commerce_membership_plan", "commerce_product_sku"],
        "write_tables": [],
        "file_targets": [],
    },
    {
        "route": "/console/memberships",
        "source": CONSOLE_SERVICE,
        "operation": "purchaseMembership",
        "operation_id": "console.membershipPurchases.create",
        "operation_scope": "app_shell",
        "kind": "create",
        "api_surface": "app",
        "api_method": "POST",
        "api_path": "/app/v3/api/memberships/purchases",
        "openapi_exposed": False,
        "read_sources": ["commerce_membership_package", "commerce_product_sku"],
        "write_tables": ["commerce_order", "commerce_order_item", "commerce_payment_intent", "ops_audit_log"],
        "file_targets": [],
    },
    {
        "route": "/console/recharge",
        "source": CONSOLE_SERVICE,
        "operation": "submitRecharge",
        "operation_id": "console.rechargeOrders.create",
        "operation_scope": "app_shell",
        "kind": "create",
        "api_surface": "app",
        "api_method": "POST",
        "api_path": "/app/v3/api/recharges/orders",
        "openapi_exposed": False,
        "read_sources": ["commerce_recharge_package", "commerce_payment_method"],
        "write_tables": ["commerce_order", "commerce_order_item", "commerce_payment_intent", "ops_audit_log"],
        "file_targets": [],
    },
    {
        "route": "/console/checkout",
        "source": CONSOLE_SERVICE,
        "operation": "fetchCheckoutStatus",
        "operation_id": "console.checkoutStatus.retrieve",
        "operation_scope": "app_shell",
        "kind": "read",
        "api_surface": "app",
        "api_method": "GET",
        "api_path": "/app/v3/api/recharges/orders/{orderId}",
        "openapi_exposed": False,
        "read_sources": ["commerce_order", "commerce_payment_intent", "commerce_payment_attempt"],
        "write_tables": [],
        "file_targets": [],
    },
    {
        "route": "/console/settlements",
        "source": CONSOLE_SERVICE,
        "operation": "fetchSettlementDashboard",
        "operation_id": "console.settlementDashboard.retrieve",
        "operation_scope": "app_shell",
        "kind": "read",
        "api_surface": "app",
        "api_method": "GET",
        "api_path": "/app/v3/api/wallet/ledger_entries",
        "openapi_exposed": False,
        "read_sources": ["commerce_account_ledger_entry", "commerce_invoice"],
        "write_tables": [],
        "file_targets": [],
    },
    {
        "route": "/console/wallet",
        "source": CONSOLE_SERVICE,
        "operation": "fetchRedeemHistory",
        "operation_id": "console.redeemHistory.list",
        "operation_scope": "app_shell",
        "kind": "read",
        "api_surface": "app",
        "api_method": "GET",
        "api_path": "/app/v3/api/coupons",
        "openapi_exposed": False,
        "read_sources": ["commerce_coupon", "commerce_coupon_redemption"],
        "write_tables": [],
        "file_targets": [],
    },
    {
        "route": "/console/wallet",
        "source": CONSOLE_SERVICE,
        "operation": "fetchRechargeHistory",
        "operation_id": "console.rechargeHistory.list",
        "operation_scope": "app_shell",
        "kind": "read",
        "api_surface": "app",
        "api_method": "GET",
        "api_path": "/app/v3/api/wallet/ledger_entries",
        "openapi_exposed": False,
        "read_sources": ["commerce_account_ledger_entry", "commerce_order", "commerce_payment_attempt"],
        "write_tables": [],
        "file_targets": [],
    },
    {
        "route": "/console/wallet",
        "source": CONSOLE_SERVICE,
        "operation": "redeemCode",
        "operation_id": "console.couponRedemptions.create",
        "operation_scope": "app_shell",
        "kind": "create",
        "api_surface": "app",
        "api_method": "POST",
        "api_path": "/app/v3/api/coupons/redemptions",
        "openapi_exposed": False,
        "read_sources": ["commerce_coupon_template", "commerce_coupon"],
        "write_tables": ["commerce_coupon_redemption", "commerce_account_ledger_entry", "ops_audit_log"],
        "file_targets": [],
    },
]

BACKEND_OPERATION_ROUTES = {
    "listCommerceCategories": "/admin/catalog",
    "createCommerceCategory": "/admin/catalog",
    "updateCommerceCategory": "/admin/catalog",
    "deleteCommerceCategory": "/admin/catalog",
    "listCommerceProducts": "/admin/catalog",
    "createCommerceProduct": "/admin/catalog",
    "updateCommerceProduct": "/admin/catalog",
    "listCommerceSkus": "/admin/catalog",
    "createCommerceSku": "/admin/catalog",
    "updateCommerceSku": "/admin/catalog",
    "listCommerceAttributes": "/admin/catalog",
    "createCommerceAttribute": "/admin/catalog",
    "listCommercePriceLists": "/admin/catalog",
    "createCommercePriceList": "/admin/catalog",
    "listInventoryStocks": "/admin/inventory",
    "updateInventoryStock": "/admin/inventory",
    "listInventoryReservations": "/admin/inventory",
    "listInventoryLedgerEntries": "/admin/inventory",
    "backendOrdersList": "/admin/orders",
    "backendOrdersRetrieve": "/admin/orders",
    "backendOrdersEventsList": "/admin/orders",
    "backendRefundsList": "/admin/orders",
    "backendRefundsRetrieve": "/admin/orders",
    "backendFulfillmentsList": "/admin/orders",
    "backendShipmentsList": "/admin/orders",
    "backendShipmentsTrackingEventsList": "/admin/orders",
    "backendPaymentsProvidersList": "/admin/payments",
    "backendPaymentsProviderAccountsList": "/admin/payments",
    "backendPaymentsProviderAccountsCreate": "/admin/payments",
    "backendPaymentsMethodsList": "/admin/payments",
    "backendPaymentsChannelsList": "/admin/payments",
    "backendPaymentsRouteRulesList": "/admin/payments",
    "backendPaymentsIntentsList": "/admin/payments",
    "backendPaymentsAttemptsList": "/admin/payments",
    "backendPaymentsWebhookEventsList": "/admin/payments",
    "backendPaymentsReconciliationRunsList": "/admin/payments",
    "backendMembershipsPlansList": "/admin/memberships",
    "backendMembershipsPackagesList": "/admin/memberships",
    "backendMembershipsMembersList": "/admin/memberships",
    "backendMembershipsEntitlementsList": "/admin/memberships",
    "backendRechargesPackagesList": "/admin/wallet",
    "backendRechargesOrdersList": "/admin/wallet",
    "backendWalletAccountsList": "/admin/wallet",
    "backendWalletLedgerEntriesList": "/admin/wallet",
    "backendWalletAdjustmentsCreate": "/admin/wallet",
    "backendWalletExchangeRulesList": "/admin/wallet",
    "backendCouponsTemplatesList": "/admin/finance",
    "backendCouponsCampaignsList": "/admin/finance",
    "backendCouponsCodesList": "/admin/finance",
    "backendCouponsRedemptionsList": "/admin/finance",
    "backendInvoicesTitlesList": "/admin/finance",
    "backendInvoicesList": "/admin/finance",
    "backendInvoicesRetrieve": "/admin/finance",
    "backendCommerceReportsPaymentReconciliationRetrieve": "/admin/finance",
    "backendCommerceReportsOrderRevenueList": "/admin/finance",
    "backendCommerceReportsRefundsList": "/admin/finance",
    "backendAuditCommerceEventsList": "/admin/finance",
}

MODEL_SOURCE_REPLACEMENTS = {
    "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-finance/src/financeService.ts": (
        "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-finance/src/index.tsx"
    ),
    "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-account/src/accountService.ts": CONSOLE_SERVICE,
    "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-recharge/src/rechargeService.ts": CONSOLE_SERVICE,
    "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-settlements/src/settlementsService.ts": CONSOLE_SERVICE,
    "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-commerce/src/checkoutService.ts": CONSOLE_SERVICE,
    "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-commerce/src/commerceService.ts": CONSOLE_SERVICE,
    "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-commerce/src/commerceFoundationService.ts": CONSOLE_SERVICE,
}

MODEL_ROUTE_BY_INTERFACE = {
    "AccountStats": "/console/account",
    "RechargePackage": "/console/recharge",
    "MembershipSummary": "/console/memberships",
    "MembershipPackage": "/console/memberships",
    "CommerceHistoryItem": "/console/wallet",
    "RedeemHistoryItem": "/console/wallet",
    "RechargeHistoryItem": "/console/wallet",
    "CheckoutStatus": "/console/checkout",
    "SettlementChartData": "/console/settlements",
    "BillBreakdownItem": "/console/settlements",
    "Bill": "/console/settlements",
    "SettlementDashboardData": "/console/settlements",
}

ROUTE_TABLES = {
    "/console/account": [
        "iam_user",
        "commerce_account",
        "iam_organization",
        "commerce_invoice",
        "iam_user_security_setting",
        "iam_user_login_event",
        "ai_usage_fact",
    ],
    "/console/wallet": [
        "commerce_account",
        "commerce_account_ledger_entry",
        "commerce_coupon_template",
        "commerce_coupon",
        "commerce_coupon_redemption",
        "commerce_order",
        "commerce_payment_attempt",
    ],
    "/console/recharge": [
        "commerce_recharge_package",
        "commerce_payment_method",
        "commerce_order",
        "commerce_order_item",
        "commerce_order_amount_breakdown",
        "commerce_payment_intent",
        "commerce_payment_attempt",
        "commerce_product_spu",
        "commerce_product_sku",
    ],
    "/console/checkout": [
        "commerce_order",
        "commerce_order_item",
        "commerce_order_amount_breakdown",
        "commerce_payment_method",
        "commerce_payment_intent",
        "commerce_payment_attempt",
    ],
    "/console/memberships": [
        "commerce_product_spu",
        "commerce_product_sku",
        "commerce_order",
        "commerce_order_item",
        "commerce_order_amount_breakdown",
        "commerce_payment_intent",
        "commerce_payment_attempt",
        "commerce_membership_plan",
        "commerce_membership_package",
        "commerce_membership_package_group",
        "commerce_membership",
        "commerce_membership_entitlement",
        "commerce_membership_entitlement_usage",
    ],
    "/console/settlements": [
        "ai_usage_fact",
        "commerce_account_ledger_entry",
        "commerce_invoice",
        "commerce_invoice_item",
        "commerce_invoice_event",
        "commerce_usage_statement",
        "commerce_usage_statement_item",
        "commerce_usage_settlement",
        "commerce_settlement_export",
    ],
    "/admin/catalog": [
        "commerce_product_category",
        "commerce_product_spu",
        "commerce_product_sku",
        "commerce_product_attribute",
        "commerce_product_attribute_value",
        "commerce_product_sku_attribute",
        "commerce_product_media",
        "commerce_price_list",
        "commerce_price_list_item",
        "ops_audit_log",
    ],
    "/admin/inventory": [
        "commerce_inventory_stock",
        "commerce_inventory_reservation",
        "commerce_inventory_ledger",
        "commerce_product_sku",
        "commerce_checkout_session",
        "commerce_order",
        "ops_audit_log",
    ],
    "/admin/orders": [
        "commerce_order",
        "commerce_order_item",
        "commerce_order_amount_breakdown",
        "commerce_order_address_snapshot",
        "commerce_order_event",
        "commerce_order_cancellation",
        "commerce_refund",
        "commerce_refund_item",
        "commerce_refund_attempt",
        "commerce_refund_event",
        "commerce_fulfillment_order",
        "commerce_fulfillment_item",
        "commerce_shipment",
        "commerce_shipment_tracking_event",
        "commerce_digital_delivery",
        "ops_audit_log",
    ],
    "/admin/payments": [
        "commerce_payment_provider",
        "commerce_payment_provider_account",
        "commerce_payment_method",
        "commerce_payment_channel",
        "commerce_payment_route_rule",
        "commerce_payment_intent",
        "commerce_payment_attempt",
        "commerce_payment_webhook_event",
        "commerce_payment_reconciliation_run",
        "ops_audit_log",
    ],
    "/admin/memberships": [
        "commerce_membership_plan",
        "commerce_membership_package",
        "commerce_membership_package_group",
        "commerce_membership",
        "commerce_membership_entitlement",
        "commerce_membership_entitlement_usage",
        "commerce_product_spu",
        "commerce_product_sku",
        "ops_audit_log",
    ],
    "/admin/wallet": [
        "commerce_account",
        "commerce_account_ledger_entry",
        "commerce_account_hold",
        "commerce_recharge_package",
        "commerce_order",
        "commerce_payment_intent",
        "commerce_payment_attempt",
        "commerce_exchange_rule",
        "ops_audit_log",
    ],
    "/admin/finance": [
        "commerce_coupon_template",
        "commerce_coupon_issue_batch",
        "commerce_coupon",
        "commerce_coupon_redemption",
        "commerce_invoice_title",
        "commerce_invoice",
        "commerce_invoice_item",
        "commerce_invoice_event",
        "commerce_order",
        "commerce_payment_attempt",
        "commerce_refund",
        "commerce_refund_item",
        "commerce_refund_attempt",
        "ops_audit_log",
    ],
}

TABLE_ROUTE_MAP = {
    "commerce_account": ["/console/account", "/console/wallet", "/admin/wallet"],
    "commerce_account_ledger_entry": ["/console/wallet", "/console/settlements", "/admin/wallet"],
    "commerce_account_hold": ["/console/checkout", "/admin/wallet"],
    "commerce_cart": ["/console/checkout"],
    "commerce_cart_item": ["/console/checkout"],
    "commerce_user_address": ["/console/checkout"],
    "commerce_checkout_session": ["/console/checkout", "/admin/inventory"],
    "commerce_checkout_line": ["/console/checkout"],
    "commerce_checkout_quote": ["/console/checkout"],
    "commerce_product_category": ["/admin/catalog"],
    "commerce_product_spu": ["/console/recharge", "/console/memberships", "/admin/catalog", "/admin/memberships"],
    "commerce_product_sku": ["/console/recharge", "/console/memberships", "/admin/catalog", "/admin/memberships", "/admin/inventory"],
    "commerce_product_attribute": ["/admin/catalog"],
    "commerce_product_attribute_value": ["/admin/catalog"],
    "commerce_product_sku_attribute": ["/admin/catalog"],
    "commerce_product_media": ["/admin/catalog"],
    "commerce_price_list": ["/admin/catalog"],
    "commerce_price_list_item": ["/admin/catalog"],
    "commerce_inventory_stock": ["/admin/inventory"],
    "commerce_inventory_reservation": ["/admin/inventory"],
    "commerce_inventory_ledger": ["/admin/inventory"],
    "commerce_membership_plan": ["/console/memberships", "/admin/memberships"],
    "commerce_membership_package_group": ["/console/memberships", "/admin/memberships"],
    "commerce_membership_package": ["/console/memberships", "/admin/memberships"],
    "commerce_membership": ["/console/memberships", "/admin/memberships"],
    "commerce_membership_entitlement": ["/console/memberships", "/admin/memberships"],
    "commerce_membership_entitlement_usage": ["/console/memberships", "/admin/memberships"],
    "commerce_recharge_package": ["/console/recharge", "/admin/wallet"],
    "commerce_order": ["/console/recharge", "/console/checkout", "/console/memberships", "/admin/orders", "/admin/wallet", "/admin/finance"],
    "commerce_order_item": ["/console/recharge", "/console/checkout", "/console/memberships", "/admin/orders"],
    "commerce_order_amount_breakdown": ["/console/recharge", "/console/checkout", "/console/memberships", "/admin/orders"],
    "commerce_order_address_snapshot": ["/console/checkout", "/admin/orders"],
    "commerce_order_event": ["/admin/orders"],
    "commerce_order_cancellation": ["/admin/orders"],
    "commerce_payment_provider": ["/admin/payments"],
    "commerce_payment_provider_account": ["/admin/payments"],
    "commerce_payment_channel": ["/admin/payments"],
    "commerce_payment_route_rule": ["/admin/payments"],
    "commerce_payment_intent": ["/console/recharge", "/console/checkout", "/console/memberships", "/admin/payments", "/admin/wallet"],
    "commerce_payment_attempt": ["/console/recharge", "/console/checkout", "/console/memberships", "/admin/payments", "/admin/orders", "/admin/wallet", "/admin/finance"],
    "commerce_payment_webhook_event": ["/admin/payments"],
    "commerce_payment_reconciliation_run": ["/admin/payments"],
    "commerce_payment_method": ["/console/recharge", "/console/checkout", "/admin/payments"],
    "commerce_refund": ["/admin/orders", "/admin/finance"],
    "commerce_refund_item": ["/admin/orders", "/admin/finance"],
    "commerce_refund_attempt": ["/admin/orders", "/admin/finance"],
    "commerce_refund_event": ["/admin/orders", "/admin/finance"],
    "commerce_fulfillment_order": ["/admin/orders"],
    "commerce_fulfillment_item": ["/admin/orders"],
    "commerce_shipment": ["/admin/orders"],
    "commerce_shipment_tracking_event": ["/admin/orders"],
    "commerce_digital_delivery": ["/admin/orders"],
    "commerce_exchange_rule": ["/console/wallet", "/admin/wallet"],
    "commerce_coupon_template": ["/console/wallet", "/admin/finance"],
    "commerce_coupon_issue_batch": ["/admin/finance"],
    "commerce_coupon": ["/console/wallet", "/admin/finance"],
    "commerce_coupon_redemption": ["/console/wallet", "/admin/finance"],
    "commerce_invoice_title": ["/console/account", "/console/settlements", "/admin/finance"],
    "commerce_invoice": ["/console/account", "/console/settlements", "/admin/finance"],
    "commerce_invoice_item": ["/console/settlements", "/admin/finance"],
    "commerce_invoice_event": ["/console/settlements", "/admin/finance"],
    "commerce_invoice_provider_attempt": ["/admin/finance"],
    "commerce_usage_statement": ["/console/settlements"],
    "commerce_usage_statement_item": ["/console/settlements"],
    "commerce_usage_settlement": ["/console/settlements"],
    "commerce_settlement_export": ["/console/settlements"],
}


def main() -> int:
    migrate_field_contracts()
    migrate_route_classification()
    migrate_table_registry()
    return 0


def migrate_field_contracts() -> None:
    contract = yaml.safe_load(FIELD_CONTRACTS.read_text(encoding="utf-8"))
    remove_routes = {"/admin/vip"}
    contract["frontend_models"] = [
        migrate_model(item)
        for item in contract.get("frontend_models", [])
        if item.get("route") not in remove_routes and item.get("interface") not in STALE_MODEL_CONTRACTS
    ]
    operations = [
        migrate_operation(item)
        for item in contract.get("frontend_operations", [])
        if item.get("route") not in remove_routes
    ]
    operations = deduplicate_operations(operations)
    indexed_operations = {
        (item.get("source"), item.get("operation"))
        for item in operations
    }
    for item in PAGE_SERVICE_OPERATION_ENTRIES:
        if (item["source"], item["operation"]) not in indexed_operations:
            operations.append(item)
            indexed_operations.add((item["source"], item["operation"]))
    contract["frontend_operations"] = operations
    route_tables = required_tables_by_route(operations)
    contract["routes"] = [
        item
        for item in contract.get("routes", [])
        if item.get("route") not in {"/console/commerce", "/admin/commerce", *remove_routes, *ROUTE_TABLES}
    ]
    for route, tables in route_tables.items():
        contract["routes"].append({"route": route, "required_tables": tables})
    FIELD_CONTRACTS.write_text(
        yaml.safe_dump(contract, allow_unicode=True, sort_keys=False, width=240),
        encoding="utf-8",
    )


def migrate_model(item: dict) -> dict:
    item = dict(item)
    source = item.get("source")
    if source in MODEL_SOURCE_REPLACEMENTS:
        item["source"] = MODEL_SOURCE_REPLACEMENTS[source]
    interface = item.get("interface")
    if interface in MODEL_ROUTE_BY_INTERFACE:
        item["route"] = MODEL_ROUTE_BY_INTERFACE[interface]
    if item.get("interface") == "UserCreateInput" and "fields" in item:
        item["fields"] = [field for field in item["fields"] if field != "balance"]
    return item


def migrate_operation(item: dict) -> dict:
    item = dict(item)
    operation = item.get("operation")
    api_surface = item.get("api_surface")
    if item.get("source") in MODEL_SOURCE_REPLACEMENTS:
        item["source"] = MODEL_SOURCE_REPLACEMENTS[item["source"]]
    if item.get("source") == CONSOLE_SERVICE and operation in PAGE_SERVICE_OPERATIONS:
        item["openapi_exposed"] = False
    if item.get("source") == CONSOLE_SERVICE and operation in RUNTIME_CONSOLE_OPERATIONS:
        item["source"] = COMMERCE_RUNTIME
    if operation in CONSOLE_OPERATION_ROUTES:
        item["route"] = CONSOLE_OPERATION_ROUTES[operation]
        if operation in RUNTIME_CONSOLE_OPERATIONS:
            item["source"] = COMMERCE_RUNTIME
    elif operation in BACKEND_OPERATION_ROUTES:
        item["route"] = BACKEND_OPERATION_ROUTES[operation]
    elif item.get("route") == "/console/commerce":
        item["route"] = fallback_console_route(item)
        if item.get("operation") in RUNTIME_CONSOLE_OPERATIONS:
            item["source"] = COMMERCE_RUNTIME
    elif item.get("route") == "/admin/commerce":
        item["route"] = fallback_admin_route(item)
    return item


def deduplicate_operations(operations: list[dict]) -> list[dict]:
    normalized: dict[tuple[object, object], dict] = {}
    for item in operations:
        key = (item.get("source"), item.get("operation"))
        if key in normalized:
            normalized[key].update({field: value for field, value in item.items() if value is not None})
            continue
        normalized[key] = item
    return list(normalized.values())


def required_tables_by_route(operations: list[dict]) -> dict[str, list[str]]:
    route_tables = {route: list(tables) for route, tables in ROUTE_TABLES.items()}
    for item in operations:
        route = item.get("route")
        if not isinstance(route, str) or route not in route_tables:
            continue
        for field in ("read_sources", "write_tables"):
            for table in item.get(field) or []:
                if isinstance(table, str) and table not in route_tables[route]:
                    route_tables[route].append(table)
    return route_tables


def fallback_console_route(item: dict) -> str:
    path = item.get("api_path", "")
    operation_id = item.get("operation_id", "")
    if "/memberships" in path or operation_id.startswith("memberships."):
        return "/console/memberships"
    if "/recharges/orders/" in path:
        return "/console/checkout"
    if "/recharges" in path:
        return "/console/recharge"
    if "/wallet" in path or "/coupons" in path:
        return "/console/wallet"
    if "/invoices" in path:
        return "/console/settlements"
    if "/payments" in path or "/checkout" in path or "/orders" in path:
        return "/console/checkout"
    if "/accounts/current" in path:
        return "/console/account"
    return "/console/recharge"


def fallback_admin_route(item: dict) -> str:
    path = item.get("api_path", "")
    operation_id = item.get("operation_id", "")
    if "/catalog" in path or operation_id.startswith("catalog."):
        return "/admin/catalog"
    if "/inventory" in path or operation_id.startswith("inventory."):
        return "/admin/inventory"
    if "/payments" in path or operation_id.startswith("payments."):
        return "/admin/payments"
    if "/memberships" in path or operation_id.startswith("memberships."):
        return "/admin/memberships"
    if "/recharges" in path or "/wallet" in path or operation_id.startswith(("recharges.", "wallet.")):
        return "/admin/wallet"
    if (
        "/coupons" in path
        or "/invoices" in path
        or "/commerce_reports" in path
        or "/audit/commerce_events" in path
        or operation_id.startswith(("coupons.", "invoices.", "commerceReports.", "audit."))
    ):
        return "/admin/finance"
    return "/admin/orders"


def migrate_route_classification() -> None:
    classification = yaml.safe_load(ROUTE_CLASSIFICATION.read_text(encoding="utf-8"))
    classification["routes"] = [
        item
        for item in classification.get("routes", [])
        if item.get("route") not in {"/console/commerce", "/admin/commerce", "/admin/vip", *ROUTE_TABLES}
    ]
    for route, package, evidence in [
        ("/vip", "sdkwork-claw-router-vip", "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-vip/src/VipView.tsx"),
        ("/console/account", "sdkwork-claw-router-console-account", "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-account/src/AccountView.tsx"),
        ("/console/wallet", "sdkwork-claw-router-console-wallet", "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-wallet/src/WalletView.tsx"),
        ("/console/recharge", "sdkwork-claw-router-console-recharge", "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-recharge/src/RechargeView.tsx"),
        ("/console/checkout", "sdkwork-claw-router-console-checkout", "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-checkout/src/CheckoutView.tsx"),
        ("/console/memberships", "sdkwork-claw-router-console-memberships", "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-memberships/src/MembershipsView.tsx"),
        ("/console/settlements", "sdkwork-claw-router-console-settlements", "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-settlements/src/SettlementsView.tsx"),
    ]:
        classification["routes"].append(route_entry(route, package, "customer-console", "console", "app", evidence))
    for route, package, evidence in [
        ("/admin/catalog", "sdkwork-claw-router-admin-catalog", "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-catalog/src/index.tsx"),
        ("/admin/inventory", "sdkwork-claw-router-admin-inventory", "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-inventory/src/index.tsx"),
        ("/admin/orders", "sdkwork-claw-router-admin-orders", "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-orders/src/index.tsx"),
        ("/admin/payments", "sdkwork-claw-router-admin-payments", "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-payments/src/index.tsx"),
        ("/admin/memberships", "sdkwork-claw-router-admin-memberships", "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-memberships/src/index.tsx"),
        ("/admin/wallet", "sdkwork-claw-router-admin-wallet", "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-wallet/src/index.tsx"),
        ("/admin/finance", "sdkwork-claw-router-admin-finance", "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-finance/src/index.tsx"),
    ]:
        classification["routes"].append(route_entry(route, package, "admin-control-plane", "admin", "backend", evidence))
    ROUTE_CLASSIFICATION.write_text(
        yaml.safe_dump(classification, allow_unicode=True, sort_keys=False, width=240),
        encoding="utf-8",
    )


def route_entry(route: str, package: str, owner: str, scope: str, surface: str, evidence: str) -> dict:
    return {
        "route": route,
        "package": package,
        "owner": owner,
        "route_scope": scope,
        "delivery_kind": "sdk_backed_business_runtime",
        "api_surface": surface,
        "evidence": [
            evidence,
            CONSOLE_SERVICE if route.startswith("/console") else COMMERCE_RUNTIME,
            "docs/schema-registry/frontend-field-contracts.yaml",
        ],
    }


def migrate_table_registry() -> None:
    registry = yaml.safe_load(TABLE_REGISTRY.read_text(encoding="utf-8"))
    route_table_map = frontend_routes_by_table()
    for table in registry.get("tables", []):
        table_name = table.get("table")
        if table_name in route_table_map:
            table["frontend_routes"] = route_table_map[table_name]
        elif table_name in TABLE_ROUTE_MAP:
            table["frontend_routes"] = TABLE_ROUTE_MAP[table_name]
        elif isinstance(table.get("frontend_routes"), list):
            table["frontend_routes"] = [
                route
                for route in table["frontend_routes"]
                if route not in {"/console/commerce", "/admin/commerce", "/admin/vip"}
            ]
    TABLE_REGISTRY.write_text(
        yaml.safe_dump(registry, allow_unicode=True, sort_keys=False, width=240),
        encoding="utf-8",
    )


def frontend_routes_by_table() -> dict[str, list[str]]:
    contract = yaml.safe_load(FIELD_CONTRACTS.read_text(encoding="utf-8"))
    route_map: dict[str, list[str]] = {}
    for route_entry in contract.get("routes", []):
        if not isinstance(route_entry, dict):
            continue
        route = route_entry.get("route")
        if not isinstance(route, str):
            continue
        for table in route_entry.get("required_tables") or []:
            if isinstance(table, str):
                route_map.setdefault(table, []).append(route)
    for table, routes in TABLE_ROUTE_MAP.items():
        existing = route_map.setdefault(table, [])
        for route in routes:
            if route not in existing:
                existing.append(route)
    return {table: routes for table, routes in sorted(route_map.items())}


if __name__ == "__main__":
    raise SystemExit(main())
