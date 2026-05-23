export type CommerceEnvironment = "development" | "test" | "staging" | "production";
export type CommerceDeploymentMode = "saas" | "local" | "private";
export type CommerceOperationMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
export type CommerceOperationSecurity = "dualToken" | "public";

export type CommerceSdkNamespace =
  | "accounts"
  | "catalog"
  | "cart"
  | "addresses"
  | "checkout"
  | "orders"
  | "payments"
  | "refunds"
  | "fulfillments"
  | "shipments"
  | "memberships"
  | "recharges"
  | "wallet"
  | "coupons"
  | "invoices"
  | "inventory"
  | "commerceReports"
  | "reports"
  | "audit";

export type CommerceCapabilityName = CommerceSdkNamespace;

export const SDKWORK_COMMERCE_TABLES = {
  productCategory: "commerce_product_category",
  productSpu: "commerce_product_spu",
  productSku: "commerce_product_sku",
  productAttribute: "commerce_product_attribute",
  productAttributeValue: "commerce_product_attribute_value",
  productSkuAttribute: "commerce_product_sku_attribute",
  productMedia: "commerce_product_media",
  priceList: "commerce_price_list",
  priceListItem: "commerce_price_list_item",
  inventoryStock: "commerce_inventory_stock",
  inventoryReservation: "commerce_inventory_reservation",
  inventoryLedger: "commerce_inventory_ledger",
  cart: "commerce_cart",
  cartItem: "commerce_cart_item",
  userAddress: "commerce_user_address",
  orderAddressSnapshot: "commerce_order_address_snapshot",
  checkoutSession: "commerce_checkout_session",
  checkoutLine: "commerce_checkout_line",
  checkoutQuote: "commerce_checkout_quote",
  order: "commerce_order",
  orderItem: "commerce_order_item",
  orderAmountBreakdown: "commerce_order_amount_breakdown",
  orderEvent: "commerce_order_event",
  orderCancellation: "commerce_order_cancellation",
  fulfillmentOrder: "commerce_fulfillment_order",
  fulfillmentItem: "commerce_fulfillment_item",
  shipment: "commerce_shipment",
  shipmentTrackingEvent: "commerce_shipment_tracking_event",
  digitalDelivery: "commerce_digital_delivery",
  paymentProvider: "commerce_payment_provider",
  paymentProviderAccount: "commerce_payment_provider_account",
  paymentMethod: "commerce_payment_method",
  paymentChannel: "commerce_payment_channel",
  paymentRouteRule: "commerce_payment_route_rule",
  paymentIntent: "commerce_payment_intent",
  paymentAttempt: "commerce_payment_attempt",
  paymentWebhookEvent: "commerce_payment_webhook_event",
  paymentReconciliationRun: "commerce_payment_reconciliation_run",
  paymentDispute: "commerce_payment_dispute",
  refund: "commerce_refund",
  refundItem: "commerce_refund_item",
  refundAttempt: "commerce_refund_attempt",
  membershipPlan: "commerce_membership_plan",
  membershipPackage: "commerce_membership_package",
  membership: "commerce_membership",
  membershipEntitlement: "commerce_membership_entitlement",
  membershipEntitlementUsage: "commerce_membership_entitlement_usage",
  rechargePackage: "commerce_recharge_package",
  rechargeOrder: "commerce_recharge_order",
  account: "commerce_account",
  accountHold: "commerce_account_hold",
  accountLedgerEntry: "commerce_account_ledger_entry",
  exchangeRule: "commerce_exchange_rule",
  exchangeTransaction: "commerce_exchange_transaction",
  couponTemplate: "commerce_coupon_template",
  couponCampaign: "commerce_coupon_campaign",
  couponCode: "commerce_coupon_code",
  couponClaim: "commerce_coupon_claim",
  couponRedemption: "commerce_coupon_redemption",
  couponRedemptionEvent: "commerce_coupon_redemption_event",
  invoiceTitle: "commerce_invoice_title",
  invoice: "commerce_invoice",
  invoiceItem: "commerce_invoice_item",
  invoiceEvent: "commerce_invoice_event",
  invoiceProviderAttempt: "commerce_invoice_provider_attempt",
  usageStatement: "commerce_usage_statement",
  idempotencyKey: "commerce_idempotency_key",
  auditLog: "commerce_audit_log",
  outboxEvent: "commerce_outbox_event",
} as const;

export type CommerceDomainModelName = keyof typeof SDKWORK_COMMERCE_TABLES;

export interface CommerceOperationContract {
  apiSurface: "app" | "backend";
  method: CommerceOperationMethod;
  operationKey: string;
  operationId: string;
  path: string;
  queryParameters?: readonly string[];
  security: CommerceOperationSecurity;
  tag: CommerceSdkNamespace;
}

export interface CommerceDomainModelContract {
  capabilities: readonly CommerceCapabilityName[];
  domain: "commerce";
  fields: readonly string[];
  name: CommerceDomainModelName;
  table: (typeof SDKWORK_COMMERCE_TABLES)[CommerceDomainModelName];
}

export interface CommerceCapabilityContract {
  domain: "commerce";
  models: readonly CommerceDomainModelName[];
  name: CommerceCapabilityName;
  operations: readonly string[];
  sdkNamespaces: readonly CommerceSdkNamespace[];
}

export interface CommerceLedgerPolicy {
  amountScale: number;
  moneyScale: number;
  optimisticLocking: boolean;
  requireIdempotencyKey: boolean;
  requireImmutableLedger: boolean;
}

export const SDKWORK_COMMERCE_STANDARD = {
  api: {
    appPrefix: "/app/v3/api",
    backendPrefix: "/backend/v3/api",
    openapi: "3.1.2",
  },
  databasePrefix: "commerce",
  domain: "commerce",
  sdkNamespaces: [
    "accounts",
    "catalog",
    "cart",
    "addresses",
    "checkout",
    "orders",
    "payments",
    "refunds",
    "fulfillments",
    "shipments",
    "memberships",
    "recharges",
    "wallet",
    "coupons",
    "invoices",
    "inventory",
    "commerceReports",
    "reports",
    "audit",
  ],
} as const;

const app = SDKWORK_COMMERCE_STANDARD.api.appPrefix;
const backend = SDKWORK_COMMERCE_STANDARD.api.backendPrefix;

export const SDKWORK_COMMERCE_API_ROUTES = {
  accounts: {
    current: {
      summary: {
        retrieve: operation("GET", `${app}/accounts/current/summary`, "accounts.current.summary.retrieve"),
      },
    },
  },
  catalog: {
    attributes: {
      list: operation("GET", `${app}/catalog/attributes`, "catalog.attributes.list", ["category_id"]),
    },
    categories: {
      list: operation("GET", `${app}/catalog/categories`, "catalog.categories.list", ["parent_id", "status", "page", "page_size"]),
      retrieve: operation("GET", `${app}/catalog/categories/{categoryId}`, "catalog.categories.retrieve"),
    },
    products: {
      list: operation("GET", `${app}/catalog/products`, "catalog.products.list", ["q", "category_id", "product_type", "status", "page", "page_size", "sort"]),
      retrieve: operation("GET", `${app}/catalog/products/{productId}`, "catalog.products.retrieve"),
    },
    skus: {
      retrieve: operation("GET", `${app}/catalog/skus/{skuId}`, "catalog.skus.retrieve"),
      prices: {
        retrieve: operation("GET", `${app}/catalog/skus/{skuId}/prices`, "catalog.skus.prices.retrieve", ["currency_code", "channel"]),
      },
    },
    spus: {
      list: operation("GET", `${app}/catalog/spus`, "catalog.spus.list", ["q", "category_id", "product_type", "page", "page_size", "cursor"]),
      retrieve: operation("GET", `${app}/catalog/spus/{spuId}`, "catalog.spus.retrieve"),
    },
  },
  cart: {
    current: {
      retrieve: operation("GET", `${app}/cart/current`, "cart.current.retrieve"),
    },
    items: {
      create: operation("POST", `${app}/cart/items`, "cart.items.create"),
      update: operation("PATCH", `${app}/cart/items/{cartItemId}`, "cart.items.update"),
      delete: operation("DELETE", `${app}/cart/items/{cartItemId}`, "cart.items.delete"),
    },
  },
  addresses: {
    list: operation("GET", `${app}/addresses`, "addresses.list", ["page", "page_size"]),
    create: operation("POST", `${app}/addresses`, "addresses.create"),
    update: operation("PATCH", `${app}/addresses/{addressId}`, "addresses.update"),
    delete: operation("DELETE", `${app}/addresses/{addressId}`, "addresses.delete"),
    defaultSelection: {
      create: operation("POST", `${app}/addresses/{addressId}/default_selection`, "addresses.defaultSelection.create"),
    },
  },
  checkout: {
    sessions: {
      create: operation("POST", `${app}/checkout/sessions`, "checkout.sessions.create"),
      retrieve: operation("GET", `${app}/checkout/sessions/{checkoutSessionId}`, "checkout.sessions.retrieve"),
      quotes: {
        create: operation("POST", `${app}/checkout/sessions/{checkoutSessionId}/quotes`, "checkout.sessions.quotes.create"),
      },
      orders: {
        create: operation("POST", `${app}/checkout/sessions/{checkoutSessionId}/orders`, "checkout.sessions.orders.create"),
      },
    },
  },
  orders: {
    list: operation("GET", `${app}/orders`, "orders.list", ["status", "page", "page_size"]),
    create: operation("POST", `${app}/orders`, "orders.create"),
    retrieve: operation("GET", `${app}/orders/{orderId}`, "orders.retrieve"),
    pay: operation("POST", `${app}/orders/{orderId}/payments`, "orders.pay"),
    cancel: operation("POST", `${app}/orders/{orderId}/cancel`, "orders.cancel"),
    events: {
      list: operation("GET", `${app}/orders/{orderId}/events`, "orders.events.list"),
    },
    cancellations: {
      create: operation("POST", `${app}/orders/{orderId}/cancellations`, "orders.cancellations.create"),
    },
    paymentSuccess: {
      retrieve: operation("GET", `${app}/orders/{orderId}/payment_success`, "orders.paymentSuccess.retrieve"),
    },
    statistics: {
      retrieve: operation("GET", `${app}/orders/statistics`, "orders.statistics.retrieve"),
    },
    status: {
      retrieve: operation("GET", `${app}/orders/{orderId}/status`, "orders.status.retrieve"),
    },
  },
  payments: {
    close: operation("POST", `${app}/payments/{paymentId}/close`, "payments.close"),
    create: operation("POST", `${app}/payments`, "payments.create"),
    checkout: {
      retrieve: operation("GET", `${app}/payments/checkout/{paymentId}`, "payments.checkout.retrieve"),
    },
    methods: {
      list: operation("GET", `${app}/payments/methods`, "payments.methods.list"),
    },
    intents: {
      create: operation("POST", `${app}/payments/intents`, "payments.intents.create"),
      retrieve: operation("GET", `${app}/payments/intents/{paymentIntentId}`, "payments.intents.retrieve"),
      cancel: operation("POST", `${app}/payments/intents/{paymentIntentId}/cancel`, "payments.intents.cancel"),
      attempts: {
        create: operation("POST", `${app}/payments/intents/{paymentIntentId}/attempts`, "payments.intents.attempts.create"),
      },
    },
    attempts: {
      retrieve: operation("GET", `${app}/payments/attempts/{paymentAttemptId}`, "payments.attempts.retrieve"),
    },
    records: {
      list: operation("GET", `${app}/payments/records`, "payments.records.list", ["status", "page", "page_size", "cursor"]),
      retrieve: operation("GET", `${app}/payments/records/{paymentId}`, "payments.records.retrieve"),
    },
    orderPayments: {
      list: operation("GET", `${app}/orders/{orderId}/payments`, "payments.orderPayments.list"),
    },
    reconcile: operation("POST", `${app}/payments/reconciliations`, "payments.reconcile"),
    statistics: {
      retrieve: operation("GET", `${app}/payments/statistics`, "payments.statistics.retrieve"),
    },
    status: {
      retrieve: operation("GET", `${app}/payments/status/{paymentId}`, "payments.status.retrieve"),
      retrieveByOutTradeNo: operation("GET", `${app}/payments/status/out_trade_no/{outTradeNo}`, "payments.status.retrieveByOutTradeNo"),
    },
  },
  refunds: {
    create: operation("POST", `${app}/refunds`, "refunds.create"),
    list: operation("GET", `${app}/refunds`, "refunds.list", ["status", "page", "page_size"]),
    retrieve: operation("GET", `${app}/refunds/{refundId}`, "refunds.retrieve"),
  },
  fulfillments: {
    list: operation("GET", `${app}/fulfillments`, "fulfillments.list", ["status", "page", "page_size"]),
    retrieve: operation("GET", `${app}/fulfillments/{fulfillmentId}`, "fulfillments.retrieve"),
  },
  shipments: {
    retrieve: operation("GET", `${app}/shipments/{shipmentId}`, "shipments.retrieve"),
  },
  memberships: {
    current: {
      retrieve: operation("GET", `${app}/memberships/current`, "memberships.current.retrieve"),
      status: {
        retrieve: operation("GET", `${app}/memberships/current/status`, "memberships.current.status.retrieve"),
      },
    },
    benefits: {
      list: operation("GET", `${app}/memberships/benefits`, "memberships.benefits.list"),
    },
    plans: {
      list: operation("GET", `${app}/memberships/plans`, "memberships.plans.list", ["status"]),
    },
    packageGroups: {
      list: operation("GET", `${app}/memberships/package_groups`, "memberships.packageGroups.list", ["status"]),
      retrieve: operation("GET", `${app}/memberships/package_groups/{packageGroupId}`, "memberships.packageGroups.retrieve"),
      packages: {
        list: operation("GET", `${app}/memberships/package_groups/{packageGroupId}/packages`, "memberships.packageGroups.packages.list", ["status"]),
      },
    },
    packages: {
      list: operation("GET", `${app}/memberships/packages`, "memberships.packages.list", ["status"]),
      retrieve: operation("GET", `${app}/memberships/packages/{packageId}`, "memberships.packages.retrieve"),
    },
    purchases: {
      create: operation("POST", `${app}/memberships/purchases`, "memberships.purchases.create"),
      renew: operation("POST", `${app}/memberships/purchases/renew`, "memberships.purchases.renew"),
      upgrade: operation("POST", `${app}/memberships/purchases/upgrade`, "memberships.purchases.upgrade"),
    },
    points: {
      balance: {
        retrieve: operation("GET", `${app}/memberships/points/balance`, "memberships.points.balance.retrieve"),
      },
      history: {
        list: operation("GET", `${app}/memberships/points/history`, "memberships.points.history.list", ["page", "page_size", "cursor"]),
      },
      dailyRewards: {
        create: operation("POST", `${app}/memberships/points/daily_rewards`, "memberships.points.dailyRewards.create"),
        status: {
          retrieve: operation("GET", `${app}/memberships/points/daily_rewards/status`, "memberships.points.dailyRewards.status.retrieve"),
        },
      },
    },
    privileges: {
      usage: {
        retrieve: operation("GET", `${app}/memberships/privileges/usage`, "memberships.privileges.usage.retrieve"),
      },
      speedUps: {
        create: operation("POST", `${app}/memberships/privileges/speed_ups`, "memberships.privileges.speedUps.create"),
      },
    },
  },
  recharges: {
    packages: {
      list: operation("GET", `${app}/recharges/packages`, "recharges.packages.list", ["status"]),
    },
    orders: {
      create: operation("POST", `${app}/recharges/orders`, "recharges.orders.create"),
      list: operation("GET", `${app}/recharges/orders`, "recharges.orders.list", ["page", "page_size", "cursor"]),
      retrieve: operation("GET", `${app}/recharges/orders/{orderId}`, "recharges.orders.retrieve"),
      cancel: operation("POST", `${app}/recharges/orders/{orderId}/cancellations`, "recharges.orders.cancel"),
    },
  },
  wallet: {
    overview: {
      retrieve: operation("GET", `${app}/wallet/overview`, "wallet.overview.retrieve"),
    },
    accounts: {
      list: operation("GET", `${app}/wallet/accounts`, "wallet.accounts.list", ["asset_type"]),
      retrieve: operation("GET", `${app}/wallet/accounts/{accountId}`, "wallet.accounts.retrieve"),
      overview: {
        retrieve: operation("GET", `${app}/wallet/accounts/overview`, "wallet.accounts.overview.retrieve"),
      },
      points: {
        retrieve: operation("GET", `${app}/wallet/accounts/points`, "wallet.accounts.points.retrieve"),
      },
      tokens: {
        retrieve: operation("GET", `${app}/wallet/accounts/tokens`, "wallet.accounts.tokens.retrieve"),
      },
    },
    ledgerEntries: {
      list: operation("GET", `${app}/wallet/ledger_entries`, "wallet.ledgerEntries.list", ["page", "page_size", "cursor"]),
      retrieve: operation("GET", `${app}/wallet/ledger_entries/{ledgerEntryId}`, "wallet.ledgerEntries.retrieve"),
      points: {
        list: operation("GET", `${app}/wallet/ledger_entries/points`, "wallet.ledgerEntries.points.list", ["page", "page_size", "cursor"]),
      },
    },
    holds: {
      create: operation("POST", `${app}/wallet/holds`, "wallet.holds.create"),
      releases: {
        create: operation("POST", `${app}/wallet/holds/releases`, "wallet.holds.releases.create"),
      },
      settlements: {
        create: operation("POST", `${app}/wallet/holds/settlements`, "wallet.holds.settlements.create"),
      },
    },
    exchangeRate: {
      retrieve: operation("GET", `${app}/wallet/exchange_rate`, "wallet.exchangeRate.retrieve"),
    },
    exchangeRules: {
      list: operation("GET", `${app}/wallet/exchange_rules`, "wallet.exchangeRules.list", ["source_asset_type", "target_asset_type"]),
    },
    points: {
      exchangeRules: {
        list: operation("GET", `${app}/wallet/points/exchanges/rules`, "wallet.points.exchangeRules.list"),
      },
    },
    tokens: {
      retrieve: operation("GET", `${app}/wallet/tokens`, "wallet.tokens.retrieve"),
    },
    exchanges: {
      create: operation("POST", `${app}/wallet/exchanges`, "wallet.exchanges.create"),
    },
    pointTransfers: {
      create: operation("POST", `${app}/wallet/point_transfers`, "wallet.pointTransfers.create"),
    },
    pointExchanges: {
      create: operation("POST", `${app}/wallet/point_exchanges`, "wallet.pointExchanges.create"),
      retrieve: operation("GET", `${app}/wallet/point_exchanges/{exchangeNo}`, "wallet.pointExchanges.retrieve"),
    },
    transfers: {
      create: operation("POST", `${app}/wallet/transfers`, "wallet.transfers.create"),
    },
    topupTransfers: {
      create: operation("POST", `${app}/wallet/topup_transfers`, "wallet.topupTransfers.create"),
    },
    withdrawalTransfers: {
      create: operation("POST", `${app}/wallet/withdrawal_transfers`, "wallet.withdrawalTransfers.create"),
    },
    requests: {
      retrieve: operation("GET", `${app}/wallet/requests/{requestNo}`, "wallet.requests.retrieve"),
    },
    adjustments: {
      create: operation("POST", `${app}/wallet/adjustments`, "wallet.adjustments.create"),
    },
    transactions: {
      list: operation("GET", `${app}/wallet/transactions`, "wallet.transactions.list", ["asset_type", "page", "page_size", "cursor"]),
      retrieve: operation("GET", `${app}/wallet/transactions/{transactionId}`, "wallet.transactions.retrieve"),
    },
  },
  coupons: {
    list: operation("GET", `${app}/coupons`, "coupons.list", ["status", "page", "page_size"]),
    retrieve: operation("GET", `${app}/coupons/{couponId}`, "coupons.retrieve"),
    claims: {
      create: operation("POST", `${app}/coupons/claims`, "coupons.claims.create"),
    },
    codeClaims: {
      create: operation("POST", `${app}/coupons/code_claims`, "coupons.codeClaims.create"),
    },
    redemptions: {
      create: operation("POST", `${app}/coupons/redemptions`, "coupons.redemptions.create"),
      rollback: operation("POST", `${app}/coupons/redemptions/{couponRedemptionId}/rollback`, "coupons.redemptions.rollback"),
      reversals: {
        create: operation("POST", `${app}/coupons/redemptions/reversals`, "coupons.redemptions.reversals.create"),
      },
    },
    wallet: {
      list: operation("GET", `${app}/coupons/wallet`, "coupons.wallet.list", ["status", "page", "page_size"]),
      retrieve: operation("GET", `${app}/coupons/wallet/{couponId}`, "coupons.wallet.retrieve"),
    },
    templates: {
      list: operation("GET", `${app}/coupons/templates`, "coupons.templates.list", ["status"]),
      retrieve: operation("GET", `${app}/coupons/templates/{templateId}`, "coupons.templates.retrieve"),
    },
  },
  invoices: {
    list: operation("GET", `${app}/invoices`, "invoices.list", ["status", "page", "page_size"]),
    retrieve: operation("GET", `${app}/invoices/{invoiceId}`, "invoices.retrieve"),
    create: operation("POST", `${app}/invoices`, "invoices.create"),
    update: operation("PATCH", `${app}/invoices/{invoiceId}`, "invoices.update"),
    submit: operation("POST", `${app}/invoices/{invoiceId}/submissions`, "invoices.submit"),
    cancel: operation("POST", `${app}/invoices/{invoiceId}/cancellations`, "invoices.cancel"),
    items: {
      list: operation("GET", `${app}/invoices/{invoiceId}/items`, "invoices.items.list"),
    },
    mine: {
      list: operation("GET", `${app}/invoices/mine`, "invoices.mine.list", ["status", "page", "page_size"]),
    },
    statistics: {
      retrieve: operation("GET", `${app}/invoices/statistics`, "invoices.statistics.retrieve"),
    },
    submissions: {
      create: operation("POST", `${app}/invoices/{invoiceId}/submissions`, "invoices.submissions.create"),
    },
    cancellations: {
      create: operation("POST", `${app}/invoices/{invoiceId}/cancellations`, "invoices.cancellations.create"),
    },
  },
  backend: {
    catalog: {
      categories: {
        list: operation("GET", `${backend}/catalog/categories`, "catalog.categories.list", ["parent_id", "status", "page", "page_size"]),
        create: operation("POST", `${backend}/catalog/categories`, "catalog.categories.create"),
        update: operation("PATCH", `${backend}/catalog/categories/{categoryId}`, "catalog.categories.update"),
        delete: operation("DELETE", `${backend}/catalog/categories/{categoryId}`, "catalog.categories.delete"),
      },
      products: {
        list: operation("GET", `${backend}/catalog/products`, "catalog.products.list", ["q", "category_id", "product_type", "status", "page", "page_size", "sort"]),
        create: operation("POST", `${backend}/catalog/products`, "catalog.products.create"),
        update: operation("PATCH", `${backend}/catalog/products/{productId}`, "catalog.products.update"),
      },
      spus: {
        list: operation("GET", `${backend}/catalog/spus`, "catalog.spus.management.list", ["q", "status", "page", "page_size", "cursor"]),
        create: operation("POST", `${backend}/catalog/spus`, "catalog.spus.create"),
        update: operation("PATCH", `${backend}/catalog/spus/{spuId}`, "catalog.spus.update"),
        publish: operation("POST", `${backend}/catalog/spus/{spuId}/publish`, "catalog.spus.publish"),
        archive: operation("POST", `${backend}/catalog/spus/{spuId}/archive`, "catalog.spus.archive"),
      },
      skus: {
        list: operation("GET", `${backend}/catalog/skus`, "catalog.skus.list", ["product_id", "status", "page", "page_size"]),
        create: operation("POST", `${backend}/catalog/skus`, "catalog.skus.create"),
        update: operation("PATCH", `${backend}/catalog/skus/{skuId}`, "catalog.skus.update"),
      },
      attributes: {
        list: operation("GET", `${backend}/catalog/attributes`, "catalog.attributes.list", ["scope", "status", "page", "page_size"]),
        create: operation("POST", `${backend}/catalog/attributes`, "catalog.attributes.create"),
      },
      priceLists: {
        list: operation("GET", `${backend}/catalog/price_lists`, "catalog.priceLists.list", ["currency_code", "market_code", "status", "page", "page_size"]),
        create: operation("POST", `${backend}/catalog/price_lists`, "catalog.priceLists.create"),
        update: operation("PATCH", `${backend}/catalog/price_lists/{priceListId}`, "catalog.priceLists.update"),
      },
    },
    inventory: {
      stocks: {
        list: operation("GET", `${backend}/inventory/stocks`, "inventory.stocks.list", ["sku_id", "warehouse_id", "status", "page", "page_size"]),
        update: operation("PATCH", `${backend}/inventory/stocks/{stockId}`, "inventory.stocks.update"),
      },
      reservations: {
        list: operation("GET", `${backend}/inventory/reservations`, "inventory.reservations.list", ["sku_id", "order_id", "checkout_session_id", "status", "page", "page_size"]),
      },
      ledgerEntries: {
        list: operation("GET", `${backend}/inventory/ledger_entries`, "inventory.ledgerEntries.list", ["sku_id", "warehouse_id", "source_type", "source_id", "page", "page_size"]),
      },
    },
    orders: {
      list: operation("GET", `${backend}/orders`, "orders.list", ["status", "page", "page_size", "q"]),
      retrieve: operation("GET", `${backend}/orders/{orderId}`, "orders.retrieve"),
      events: {
        list: operation("GET", `${backend}/orders/{orderId}/events`, "orders.events.list", ["page", "page_size"]),
      },
      cancellations: {
        list: operation("GET", `${backend}/orders/cancellations`, "orders.cancellations.list", ["status", "page", "page_size"]),
      },
    },
    payments: {
      providers: {
        list: operation("GET", `${backend}/payments/providers`, "payments.providers.list", ["status"]),
        update: operation("PATCH", `${backend}/payments/providers/{providerCode}`, "payments.providers.update"),
      },
      providerAccounts: {
        list: operation("GET", `${backend}/payments/provider_accounts`, "payments.providerAccounts.list", ["provider_code", "status", "page", "page_size"]),
        create: operation("POST", `${backend}/payments/provider_accounts`, "payments.providerAccounts.create"),
        update: operation("PATCH", `${backend}/payments/provider_accounts/{providerAccountId}`, "payments.providerAccounts.update"),
        delete: operation("DELETE", `${backend}/payments/provider_accounts/{providerAccountId}`, "payments.providerAccounts.delete"),
      },
      methods: {
        list: operation("GET", `${backend}/payments/methods`, "payments.methods.list", ["status"]),
        create: operation("POST", `${backend}/payments/methods`, "payments.methods.create"),
        update: operation("PATCH", `${backend}/payments/methods/{methodId}`, "payments.methods.update"),
      },
      channels: {
        list: operation("GET", `${backend}/payments/channels`, "payments.channels.list", ["provider_account_id", "method_id", "status"]),
        create: operation("POST", `${backend}/payments/channels`, "payments.channels.create"),
        update: operation("PATCH", `${backend}/payments/channels/{channelId}`, "payments.channels.update"),
      },
      routeRules: {
        list: operation("GET", `${backend}/payments/route_rules`, "payments.routeRules.list", ["status"]),
        create: operation("POST", `${backend}/payments/route_rules`, "payments.routeRules.create"),
        update: operation("PATCH", `${backend}/payments/route_rules/{routeRuleId}`, "payments.routeRules.update"),
      },
      intents: {
        list: operation("GET", `${backend}/payments/intents`, "payments.intents.list", ["status", "page", "page_size"]),
        retrieve: operation("GET", `${backend}/payments/intents/{paymentIntentId}`, "payments.intents.retrieve"),
      },
      attempts: {
        list: operation("GET", `${backend}/payments/attempts`, "payments.attempts.list", ["provider", "status", "page", "page_size", "cursor"]),
      },
      webhookEvents: {
        list: operation("GET", `${backend}/payments/webhook_events`, "payments.webhookEvents.list", ["provider", "status", "page", "page_size"]),
        replays: {
          create: operation("POST", `${backend}/payments/webhook_events/{eventId}/replays`, "payments.webhookEvents.replays.create"),
        },
      },
      reconciliationRuns: {
        list: operation("GET", `${backend}/payments/reconciliation_runs`, "payments.reconciliationRuns.list", ["provider", "status", "page", "page_size"]),
        create: operation("POST", `${backend}/payments/reconciliation_runs`, "payments.reconciliationRuns.create"),
      },
      disputes: {
        list: operation("GET", `${backend}/payments/disputes`, "payments.disputes.list", ["status", "page", "page_size"]),
      },
    },
    refunds: {
      list: operation("GET", `${backend}/refunds`, "refunds.list", ["status", "page", "page_size"]),
      retrieve: operation("GET", `${backend}/refunds/{refundId}`, "refunds.retrieve"),
      attempts: {
        list: operation("GET", `${backend}/refunds/{refundId}/attempts`, "refunds.attempts.list"),
      },
    },
    fulfillments: {
      list: operation("GET", `${backend}/fulfillments`, "fulfillments.list", ["status", "page", "page_size"]),
      retrieve: operation("GET", `${backend}/fulfillments/{fulfillmentId}`, "fulfillments.retrieve"),
      update: operation("PATCH", `${backend}/fulfillments/{fulfillmentId}`, "fulfillments.update"),
    },
    shipments: {
      list: operation("GET", `${backend}/shipments`, "shipments.list", ["status", "page", "page_size"]),
      retrieve: operation("GET", `${backend}/shipments/{shipmentId}`, "shipments.retrieve"),
      trackingEvents: {
        list: operation("GET", `${backend}/shipments/{shipmentId}/tracking_events`, "shipments.trackingEvents.list"),
      },
    },
    memberships: {
      plans: {
        list: operation("GET", `${backend}/memberships/plans`, "memberships.plans.list", ["status"]),
        create: operation("POST", `${backend}/memberships/plans`, "memberships.plans.create"),
        update: operation("PATCH", `${backend}/memberships/plans/{planId}`, "memberships.plans.update"),
      },
      packages: {
        list: operation("GET", `${backend}/memberships/packages`, "memberships.packages.list", ["plan_id", "status"]),
        create: operation("POST", `${backend}/memberships/packages`, "memberships.packages.create"),
        update: operation("PATCH", `${backend}/memberships/packages/{packageId}`, "memberships.packages.update"),
        delete: operation("DELETE", `${backend}/memberships/packages/{packageId}`, "memberships.packages.delete"),
      },
      members: {
        list: operation("GET", `${backend}/memberships/members`, "memberships.members.list", ["user_id", "plan_id", "status", "page", "page_size"]),
        update: operation("PATCH", `${backend}/memberships/members/{membershipId}`, "memberships.members.update"),
      },
      entitlements: {
        list: operation("GET", `${backend}/memberships/entitlements`, "memberships.entitlements.list", ["plan_id", "membership_id", "status"]),
      },
    },
    recharges: {
      packages: {
        list: operation("GET", `${backend}/recharges/packages`, "recharges.packages.list", ["status"]),
        create: operation("POST", `${backend}/recharges/packages`, "recharges.packages.create"),
        update: operation("PATCH", `${backend}/recharges/packages/{packageId}`, "recharges.packages.update"),
        delete: operation("DELETE", `${backend}/recharges/packages/{packageId}`, "recharges.packages.delete"),
      },
      orders: {
        list: operation("GET", `${backend}/recharges/orders`, "recharges.orders.list", ["user_id", "status", "page", "page_size", "cursor"]),
        retrieve: operation("GET", `${backend}/recharges/orders/{orderId}`, "recharges.orders.retrieve"),
      },
    },
    wallet: {
      accounts: {
        list: operation("GET", `${backend}/wallet/accounts`, "wallet.accounts.list", ["user_id", "asset_type", "status", "page", "page_size"]),
      },
      ledgerEntries: {
        list: operation("GET", `${backend}/wallet/ledger_entries`, "wallet.ledgerEntries.list", ["page", "page_size", "q", "status", "start_time", "end_time"]),
      },
      adjustments: {
        create: operation("POST", `${backend}/wallet/adjustments`, "wallet.adjustments.create"),
      },
      holds: {
        list: operation("GET", `${backend}/wallet/holds`, "wallet.holds.list", ["status", "page", "page_size"]),
      },
      exchangeRules: {
        list: operation("GET", `${backend}/wallet/exchange_rules`, "wallet.exchangeRules.list", ["source_asset_type", "target_asset_type", "status"]),
        update: operation("PUT", `${backend}/wallet/exchange_rules`, "wallet.exchangeRules.update"),
      },
    },
    coupons: {
      templates: {
        list: operation("GET", `${backend}/coupons/templates`, "coupons.templates.list", ["status", "page", "page_size", "cursor"]),
        create: operation("POST", `${backend}/coupons/templates`, "coupons.templates.create"),
        update: operation("PATCH", `${backend}/coupons/templates/{couponTemplateId}`, "coupons.templates.update"),
        delete: operation("DELETE", `${backend}/coupons/templates/{couponTemplateId}`, "coupons.templates.delete"),
      },
      campaigns: {
        list: operation("GET", `${backend}/coupons/campaigns`, "coupons.campaigns.list", ["status", "page", "page_size"]),
        create: operation("POST", `${backend}/coupons/campaigns`, "coupons.campaigns.create"),
      },
      codes: {
        list: operation("GET", `${backend}/coupons/codes`, "coupons.codes.list", ["template_id", "campaign_id", "status", "page", "page_size"]),
        status: {
          update: operation("PATCH", `${backend}/coupons/codes/{codeId}/status`, "coupons.codes.status.update"),
        },
      },
      redemptions: {
        list: operation("GET", `${backend}/coupons/redemptions`, "coupons.redemptions.list", ["user_id", "status", "page", "page_size", "cursor"]),
      },
    },
    invoices: {
      titles: {
        list: operation("GET", `${backend}/invoices/titles`, "invoices.titles.list", ["user_id", "status", "page", "page_size"]),
      },
      list: operation("GET", `${backend}/invoices`, "invoices.list", ["status", "page", "page_size"]),
      retrieve: operation("GET", `${backend}/invoices/{invoiceId}`, "invoices.retrieve"),
      issuances: {
        create: operation("POST", `${backend}/invoices/{invoiceId}/issuances`, "invoices.issuances.create"),
      },
      voids: {
        create: operation("POST", `${backend}/invoices/{invoiceId}/voids`, "invoices.voids.create"),
      },
    },
    commerceReports: {
      usageStatements: {
        list: operation("GET", `${backend}/commerce_reports/usage_statements`, "commerceReports.usageStatements.list", ["user_id", "period_start", "period_end", "page", "page_size"]),
      },
      paymentReconciliation: {
        retrieve: operation("GET", `${backend}/commerce_reports/payment_reconciliation`, "commerceReports.paymentReconciliation.retrieve", ["provider", "start_time", "end_time"]),
      },
      orderRevenue: {
        list: operation("GET", `${backend}/commerce_reports/order_revenue`, "commerceReports.orderRevenue.list", ["start_time", "end_time", "page", "page_size"]),
      },
      refunds: {
        list: operation("GET", `${backend}/commerce_reports/refunds`, "commerceReports.refunds.list", ["start_time", "end_time", "page", "page_size"]),
      },
    },
    reports: {
      commerceOverview: {
        retrieve: operation("GET", `${backend}/reports/commerce_overview`, "reports.commerceOverview.retrieve", ["period_start", "period_end"]),
      },
      sales: {
        list: operation("GET", `${backend}/reports/sales`, "reports.sales.list", ["period_start", "period_end", "currency_code"]),
      },
      paymentReconciliation: {
        list: operation("GET", `${backend}/reports/payment_reconciliation`, "reports.paymentReconciliation.list", ["provider", "period_start", "period_end"]),
      },
    },
    audit: {
      commerceEvents: {
        list: operation("GET", `${backend}/audit/commerce_events`, "audit.commerceEvents.list", ["actor_id", "source_type", "page", "page_size"]),
      },
    },
  },
} as const;

export const SDKWORK_COMMERCE_OPERATION_IDS = flattenOperations(SDKWORK_COMMERCE_API_ROUTES);

export const SDKWORK_COMMERCE_DOMAIN_MODELS = [
  model("productCategory", ["catalog"], ["id", "tenant_id", "organization_id", "category_no", "parent_id", "path", "level_no", "name", "status", "sort_order", "created_at", "updated_at"]),
  model("productSpu", ["catalog"], ["id", "tenant_id", "organization_id", "spu_no", "product_type", "title", "category_id", "status", "published_at", "created_at", "updated_at"]),
  model("productSku", ["catalog"], ["id", "tenant_id", "organization_id", "sku_no", "spu_id", "fulfillment_type", "status", "published_at", "created_at", "updated_at"]),
  model("productAttribute", ["catalog"], ["id", "tenant_id", "organization_id", "attribute_no", "name", "value_type", "scope", "status", "created_at", "updated_at"]),
  model("productAttributeValue", ["catalog"], ["id", "tenant_id", "organization_id", "attribute_id", "value_code", "display_value", "status", "created_at", "updated_at"]),
  model("productSkuAttribute", ["catalog"], ["id", "tenant_id", "organization_id", "sku_id", "attribute_id", "attribute_value_id", "custom_value", "created_at", "updated_at"]),
  model("productMedia", ["catalog"], ["id", "tenant_id", "organization_id", "owner_type", "owner_id", "media_type", "url", "status", "created_at", "updated_at"]),
  model("priceList", ["catalog"], ["id", "tenant_id", "organization_id", "price_list_no", "currency_code", "market_code", "status", "starts_at", "ends_at", "created_at", "updated_at"]),
  model("priceListItem", ["catalog"], ["id", "tenant_id", "organization_id", "price_list_id", "sku_id", "price_amount", "currency_code", "created_at", "updated_at"]),
  model("inventoryStock", ["inventory"], ["id", "tenant_id", "organization_id", "sku_id", "warehouse_id", "available_quantity", "reserved_quantity", "sold_quantity", "version", "status", "created_at", "updated_at"]),
  model("inventoryReservation", ["inventory", "checkout", "orders"], ["id", "tenant_id", "organization_id", "reservation_no", "checkout_session_id", "order_id", "sku_id", "quantity", "status", "expires_at", "idempotency_key", "created_at", "updated_at"]),
  model("inventoryLedger", ["inventory"], ["id", "tenant_id", "organization_id", "movement_no", "sku_id", "warehouse_id", "direction", "quantity", "balance_after", "source_type", "source_id", "idempotency_key", "created_at"]),
  model("cart", ["cart"], ["id", "tenant_id", "organization_id", "owner_user_id", "status", "currency_code", "version", "created_at", "updated_at"]),
  model("cartItem", ["cart"], ["id", "tenant_id", "organization_id", "cart_id", "sku_id", "quantity", "selected", "created_at", "updated_at"]),
  model("userAddress", ["addresses"], ["id", "tenant_id", "organization_id", "owner_user_id", "recipient_name", "country_code", "region_code", "city", "status", "created_at", "updated_at"]),
  model("orderAddressSnapshot", ["addresses", "orders"], ["id", "tenant_id", "organization_id", "order_id", "snapshot_version", "country_code", "region_code", "city", "captured_at", "created_at"]),
  model("checkoutSession", ["checkout"], ["id", "tenant_id", "organization_id", "checkout_session_no", "owner_user_id", "source_type", "status", "currency_code", "expires_at", "idempotency_key", "request_hash", "created_at", "updated_at"]),
  model("checkoutLine", ["checkout"], ["id", "tenant_id", "organization_id", "checkout_session_id", "sku_id", "quantity", "purchase_type", "fulfillment_type", "created_at", "updated_at"]),
  model("checkoutQuote", ["checkout"], ["id", "tenant_id", "organization_id", "checkout_session_id", "quote_no", "original_amount", "discount_amount", "payable_amount", "currency_code", "expires_at", "created_at"]),
  model("order", ["orders"], ["id", "tenant_id", "organization_id", "order_no", "owner_user_id", "purchase_type", "status", "currency_code", "payable_amount", "paid_amount", "refunded_amount", "payment_intent_id", "idempotency_key", "created_at", "updated_at"]),
  model("orderItem", ["orders"], ["id", "tenant_id", "organization_id", "order_id", "order_item_no", "spu_id", "sku_id", "purchase_type", "fulfillment_type", "quantity", "payable_amount", "created_at", "updated_at"]),
  model("orderAmountBreakdown", ["orders", "coupons", "refunds"], ["id", "tenant_id", "organization_id", "order_id", "order_item_id", "allocation_type", "source_type", "source_id", "amount", "currency_code", "created_at"]),
  model("orderEvent", ["orders", "audit"], ["id", "tenant_id", "organization_id", "event_no", "order_id", "event_type", "from_status", "to_status", "actor_type", "actor_id", "idempotency_key", "created_at"]),
  model("orderCancellation", ["orders"], ["id", "tenant_id", "organization_id", "cancellation_no", "order_id", "status", "reason_code", "idempotency_key", "created_at", "updated_at"]),
  model("fulfillmentOrder", ["fulfillments"], ["id", "tenant_id", "organization_id", "fulfillment_no", "order_id", "fulfillment_type", "status", "created_at", "updated_at"]),
  model("fulfillmentItem", ["fulfillments"], ["id", "tenant_id", "organization_id", "fulfillment_id", "order_item_id", "quantity", "status", "created_at", "updated_at"]),
  model("shipment", ["shipments", "fulfillments"], ["id", "tenant_id", "organization_id", "shipment_no", "fulfillment_id", "carrier_code", "tracking_no", "status", "created_at", "updated_at"]),
  model("shipmentTrackingEvent", ["shipments"], ["id", "tenant_id", "organization_id", "shipment_id", "event_type", "event_time", "payload_json", "created_at"]),
  model("digitalDelivery", ["fulfillments"], ["id", "tenant_id", "organization_id", "delivery_no", "fulfillment_id", "asset_ref", "status", "created_at", "updated_at"]),
  model("paymentProvider", ["payments"], ["id", "tenant_id", "organization_id", "provider_code", "display_name", "provider_type", "status", "created_at", "updated_at"]),
  model("paymentProviderAccount", ["payments"], ["id", "tenant_id", "organization_id", "account_no", "provider_code", "merchant_id", "environment", "secret_ref", "webhook_secret_ref", "certificate_ref", "status", "created_at", "updated_at"]),
  model("paymentMethod", ["payments"], ["id", "tenant_id", "organization_id", "method_code", "method_type", "display_name", "status", "sort_order", "created_at", "updated_at"]),
  model("paymentChannel", ["payments"], ["id", "tenant_id", "organization_id", "channel_no", "provider_account_id", "method_id", "scene_code", "currency_code", "country_code", "status", "created_at", "updated_at"]),
  model("paymentRouteRule", ["payments"], ["id", "tenant_id", "organization_id", "rule_no", "priority", "purchase_type", "country_code", "currency_code", "client_platform", "status", "created_at", "updated_at"]),
  model("paymentIntent", ["payments", "orders"], ["id", "tenant_id", "organization_id", "payment_intent_no", "order_id", "amount", "currency_code", "status", "idempotency_key", "created_at", "updated_at"]),
  model("paymentAttempt", ["payments"], ["id", "tenant_id", "organization_id", "payment_attempt_no", "payment_intent_id", "provider_account_id", "channel_id", "amount", "currency_code", "status", "created_at", "updated_at"]),
  model("paymentWebhookEvent", ["payments", "audit"], ["id", "tenant_id", "organization_id", "provider_code", "provider_event_id", "payload_digest", "verification_status", "processing_status", "created_at", "updated_at"]),
  model("paymentReconciliationRun", ["payments", "commerceReports"], ["id", "tenant_id", "organization_id", "run_no", "provider_code", "status", "started_at", "completed_at", "created_at", "updated_at"]),
  model("paymentDispute", ["payments"], ["id", "tenant_id", "organization_id", "dispute_no", "payment_attempt_id", "status", "amount", "currency_code", "created_at", "updated_at"]),
  model("refund", ["refunds"], ["id", "tenant_id", "organization_id", "refund_no", "order_id", "payment_intent_id", "amount", "currency_code", "status", "idempotency_key", "created_at", "updated_at"]),
  model("refundItem", ["refunds"], ["id", "tenant_id", "organization_id", "refund_id", "order_item_id", "quantity", "amount", "currency_code", "created_at", "updated_at"]),
  model("refundAttempt", ["refunds", "payments"], ["id", "tenant_id", "organization_id", "refund_attempt_no", "refund_id", "provider_account_id", "amount", "currency_code", "status", "created_at", "updated_at"]),
  model("membershipPlan", ["memberships"], ["id", "tenant_id", "organization_id", "plan_no", "name", "level_code", "status", "sort_order", "created_at", "updated_at"]),
  model("membershipPackage", ["memberships", "catalog"], ["id", "tenant_id", "organization_id", "package_no", "plan_id", "sku_id", "duration_days", "price_amount", "currency_code", "status", "created_at", "updated_at"]),
  model("membership", ["memberships"], ["id", "tenant_id", "organization_id", "membership_no", "owner_user_id", "plan_id", "source_order_id", "status", "starts_at", "expires_at", "created_at", "updated_at"]),
  model("membershipEntitlement", ["memberships"], ["id", "tenant_id", "organization_id", "entitlement_no", "plan_id", "code", "quota", "status", "created_at", "updated_at"]),
  model("membershipEntitlementUsage", ["memberships"], ["id", "tenant_id", "organization_id", "membership_id", "entitlement_id", "period_key", "used_count", "created_at", "updated_at"]),
  model("rechargePackage", ["recharges", "catalog"], ["id", "tenant_id", "organization_id", "package_no", "sku_id", "asset_type", "amount", "bonus_amount", "price_amount", "currency_code", "status", "created_at", "updated_at"]),
  model("rechargeOrder", ["recharges", "orders", "payments"], ["id", "tenant_id", "organization_id", "order_no", "owner_user_id", "package_id", "asset_type", "amount", "pay_amount", "currency_code", "status", "idempotency_key", "created_at", "updated_at"]),
  model("account", ["accounts", "wallet"], ["id", "tenant_id", "organization_id", "account_no", "owner_user_id", "asset_type", "currency_code", "available_amount", "frozen_amount", "version", "status", "created_at", "updated_at"]),
  model("accountHold", ["wallet"], ["id", "tenant_id", "organization_id", "hold_no", "account_id", "owner_user_id", "asset_type", "amount", "status", "expires_at", "idempotency_key", "created_at", "updated_at"]),
  model("accountLedgerEntry", ["wallet", "accounts", "recharges"], ["id", "tenant_id", "organization_id", "ledger_entry_no", "account_id", "owner_user_id", "asset_type", "direction", "amount", "balance_after", "source_type", "source_id", "idempotency_key", "created_at"]),
  model("exchangeRule", ["wallet"], ["id", "tenant_id", "organization_id", "source_asset_type", "target_asset_type", "rate_numerator", "rate_denominator", "status", "starts_at", "ends_at", "created_at", "updated_at"]),
  model("exchangeTransaction", ["wallet"], ["id", "tenant_id", "organization_id", "exchange_no", "owner_user_id", "source_account_id", "target_account_id", "source_amount", "target_amount", "status", "idempotency_key", "created_at", "updated_at"]),
  model("couponTemplate", ["coupons"], ["id", "tenant_id", "organization_id", "template_no", "name", "discount_type", "discount_value", "status", "created_at", "updated_at"]),
  model("couponCampaign", ["coupons"], ["id", "tenant_id", "organization_id", "campaign_no", "template_id", "name", "status", "starts_at", "ends_at", "created_at", "updated_at"]),
  model("couponCode", ["coupons"], ["id", "tenant_id", "organization_id", "campaign_id", "template_id", "code", "owner_user_id", "status", "created_at", "updated_at"]),
  model("couponClaim", ["coupons"], ["id", "tenant_id", "organization_id", "claim_no", "owner_user_id", "coupon_code_id", "status", "idempotency_key", "created_at", "updated_at"]),
  model("couponRedemption", ["coupons", "orders"], ["id", "tenant_id", "organization_id", "redemption_no", "owner_user_id", "coupon_code_id", "order_id", "discount_amount", "currency_code", "status", "idempotency_key", "created_at", "updated_at"]),
  model("couponRedemptionEvent", ["coupons", "audit"], ["id", "tenant_id", "organization_id", "redemption_id", "event_type", "payload_json", "created_at"]),
  model("invoiceTitle", ["invoices"], ["id", "tenant_id", "organization_id", "owner_user_id", "title_type", "name", "tax_no", "status", "created_at", "updated_at"]),
  model("invoice", ["invoices"], ["id", "tenant_id", "organization_id", "invoice_no", "owner_user_id", "order_id", "amount", "currency_code", "status", "created_at", "updated_at"]),
  model("invoiceItem", ["invoices"], ["id", "tenant_id", "organization_id", "invoice_id", "order_item_id", "amount", "currency_code", "created_at", "updated_at"]),
  model("invoiceEvent", ["invoices", "audit"], ["id", "tenant_id", "organization_id", "invoice_id", "event_type", "from_status", "to_status", "created_at"]),
  model("invoiceProviderAttempt", ["invoices"], ["id", "tenant_id", "organization_id", "invoice_id", "provider_code", "status", "created_at", "updated_at"]),
  model("usageStatement", ["commerceReports"], ["id", "tenant_id", "organization_id", "statement_no", "owner_user_id", "period_start", "period_end", "total_credit", "total_debit", "closing_balance", "status", "created_at", "updated_at"]),
  model("idempotencyKey", ["checkout", "orders", "payments", "refunds", "wallet", "coupons", "invoices"], ["id", "tenant_id", "organization_id", "scope", "operation_id", "idempotency_key", "request_hash", "response_json", "status", "expires_at", "created_at", "updated_at"]),
  model("auditLog", ["audit"], ["id", "tenant_id", "organization_id", "audit_no", "actor_type", "actor_id", "operation_id", "source_type", "source_id", "created_at"]),
  model("outboxEvent", ["audit"], ["id", "tenant_id", "organization_id", "event_no", "aggregate_type", "aggregate_id", "event_type", "payload_json", "published_at", "created_at"]),
] as const satisfies readonly CommerceDomainModelContract[];

export const SDKWORK_COMMERCE_CAPABILITIES = [
  capability("accounts", ["account", "accountLedgerEntry"], operationsForRoot("accounts")),
  capability("catalog", ["productCategory", "productSpu", "productSku", "productAttribute", "productAttributeValue", "productSkuAttribute", "productMedia", "priceList", "priceListItem"], operationsForRoot("catalog")),
  capability("inventory", ["inventoryStock", "inventoryReservation", "inventoryLedger"], operationsForRoot("inventory")),
  capability("cart", ["cart", "cartItem"], operationsForRoot("cart")),
  capability("addresses", ["userAddress", "orderAddressSnapshot"], operationsForRoot("addresses")),
  capability("checkout", ["checkoutSession", "checkoutLine", "checkoutQuote", "inventoryReservation", "idempotencyKey"], operationsForRoot("checkout")),
  capability("orders", ["order", "orderItem", "orderAmountBreakdown", "orderEvent", "orderCancellation", "idempotencyKey"], operationsForRoot("orders")),
  capability("payments", ["paymentProvider", "paymentProviderAccount", "paymentMethod", "paymentChannel", "paymentRouteRule", "paymentIntent", "paymentAttempt", "paymentWebhookEvent", "paymentReconciliationRun", "paymentDispute", "idempotencyKey"], operationsForRoot("payments")),
  capability("refunds", ["refund", "refundItem", "refundAttempt", "idempotencyKey"], operationsForRoot("refunds")),
  capability("fulfillments", ["fulfillmentOrder", "fulfillmentItem", "digitalDelivery"], operationsForRoot("fulfillments")),
  capability("shipments", ["shipment", "shipmentTrackingEvent"], operationsForRoot("shipments")),
  capability("memberships", ["membershipPlan", "membershipPackage", "membership", "membershipEntitlement", "membershipEntitlementUsage"], operationsForRoot("memberships")),
  capability("recharges", ["rechargePackage", "rechargeOrder", "accountLedgerEntry"], operationsForRoot("recharges")),
  capability("wallet", ["account", "accountHold", "accountLedgerEntry", "exchangeRule", "exchangeTransaction", "idempotencyKey"], operationsForRoot("wallet")),
  capability("coupons", ["couponTemplate", "couponCampaign", "couponCode", "couponClaim", "couponRedemption", "couponRedemptionEvent"], operationsForRoot("coupons")),
  capability("invoices", ["invoiceTitle", "invoice", "invoiceItem", "invoiceEvent", "invoiceProviderAttempt", "idempotencyKey"], operationsForRoot("invoices")),
  capability("commerceReports", ["usageStatement", "paymentReconciliationRun"], operationsForRoot("commerceReports")),
  capability("reports", ["usageStatement", "paymentReconciliationRun"], operationsForRoot("reports")),
  capability("audit", ["auditLog", "outboxEvent", "orderEvent", "paymentWebhookEvent"], operationsForRoot("audit")),
] as const satisfies readonly CommerceCapabilityContract[];

export function isCommerceMoneyAmount(value: string): boolean {
  return /^(0|[1-9]\d*)(\.\d{1,2})?$/.test(value);
}

export function isCommercePointAmount(value: string): boolean {
  return /^(0|[1-9]\d*)$/.test(value);
}

export function createCommerceLedgerPolicy(): CommerceLedgerPolicy {
  return {
    amountScale: 6,
    moneyScale: 2,
    optimisticLocking: true,
    requireIdempotencyKey: true,
    requireImmutableLedger: true,
  };
}

function operation(
  method: CommerceOperationMethod,
  path: string,
  operationId: string,
  queryParameters?: readonly string[],
): CommerceOperationContract {
  const apiSurface = path.startsWith(`${backend}/`) ? "backend" : "app";
  const tag = operationId.split(".")[0] as CommerceSdkNamespace;
  return {
    apiSurface,
    method,
    operationKey: `${apiSurface}.${operationId}`,
    operationId,
    ...(queryParameters ? { queryParameters } : {}),
    path,
    security: "dualToken",
    tag,
  };
}

function model(
  name: CommerceDomainModelName,
  capabilities: readonly CommerceCapabilityName[],
  fields: readonly string[],
): CommerceDomainModelContract {
  return {
    capabilities,
    domain: "commerce",
    fields,
    name,
    table: SDKWORK_COMMERCE_TABLES[name],
  };
}

function capability(
  name: CommerceCapabilityName,
  models: readonly CommerceDomainModelName[],
  operations: readonly string[],
): CommerceCapabilityContract {
  return {
    domain: "commerce",
    models,
    name,
    operations,
    sdkNamespaces: [name],
  };
}

function operationsForRoot(root: CommerceCapabilityName): string[] {
  return Object.values(SDKWORK_COMMERCE_OPERATION_IDS)
    .filter((operation) => operation.operationId.split(".")[0] === root)
    .map((operation) => operation.operationKey)
    .sort();
}

function flattenOperations(value: unknown): Record<string, CommerceOperationContract> {
  const result: Record<string, CommerceOperationContract> = {};

  function visit(node: unknown) {
    if (!node || typeof node !== "object") {
      return;
    }

    if ("operationId" in node && "path" in node) {
      const route = node as CommerceOperationContract;
      result[route.operationKey] = route;
      return;
    }

    for (const child of Object.values(node)) {
      visit(child);
    }
  }

  visit(value);
  return result;
}
