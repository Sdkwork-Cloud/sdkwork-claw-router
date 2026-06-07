export {};

declare module '@sdkwork/clawrouter-backend-sdk' {
  interface SdkworkClawrouterSdkResult {
    data?: any;
    item?: any;
    items?: any[];
    nextCursor?: string;
    requestId?: string;
    [key: string]: any;
  }

  type SdkworkClawrouterSdkOperation = (...args: any[]) => Promise<SdkworkClawrouterSdkResult>;

  interface SdkworkClawrouterCrudResource {
    create: SdkworkClawrouterSdkOperation;
    delete: SdkworkClawrouterSdkOperation;
    list: SdkworkClawrouterSdkOperation;
    retrieve: SdkworkClawrouterSdkOperation;
    update: SdkworkClawrouterSdkOperation;
  }

  interface SdkworkClawrouterNestedResource extends SdkworkClawrouterCrudResource {
    accounts: SdkworkClawrouterNestedResource;
    adjustments: SdkworkClawrouterNestedResource;
    commerceEvents: SdkworkClawrouterNestedResource;
    exchangeRules: SdkworkClawrouterNestedResource;
    ledgerEntries: SdkworkClawrouterNestedResource;
    management: SdkworkClawrouterNestedResource;
    orderRevenue: SdkworkClawrouterNestedResource;
    paymentReconciliation: SdkworkClawrouterNestedResource;
    refunds: SdkworkClawrouterNestedResource;
    status: SdkworkClawrouterNestedResource;
    titles: SdkworkClawrouterNestedResource;
  }

  export interface CommerceApi {
    audit: SdkworkClawrouterNestedResource;
    commerceReports: SdkworkClawrouterNestedResource;
    fulfillments: SdkworkClawrouterNestedResource;
    invoices: SdkworkClawrouterNestedResource;
    refunds: SdkworkClawrouterNestedResource;
    wallet: SdkworkClawrouterNestedResource;
  }

  export interface CommerceCatalogApi {
    attributes: SdkworkClawrouterNestedResource;
    categories: SdkworkClawrouterNestedResource;
    priceLists: SdkworkClawrouterNestedResource;
  }

  export interface CommerceCatalogProductsApi {
    create: SdkworkClawrouterSdkOperation;
    list: SdkworkClawrouterSdkOperation;
    update: SdkworkClawrouterSdkOperation;
  }

  export interface CommerceCatalogSkusApi {
    create: SdkworkClawrouterSdkOperation;
    list: SdkworkClawrouterSdkOperation;
    update: SdkworkClawrouterSdkOperation;
  }

  export interface CommerceInventoryApi {
    ledgerEntries: SdkworkClawrouterNestedResource;
    reservations: SdkworkClawrouterNestedResource;
  }

  export interface CommerceInventoryStocksApi {
    list: SdkworkClawrouterSdkOperation;
  }

  export interface CommerceMembershipsApi {
    entitlements: SdkworkClawrouterNestedResource;
  }

  export interface CommerceMembershipsMembersApi {
    list: SdkworkClawrouterSdkOperation;
  }

  export interface CommerceMembershipsPackageGroupsApi {
    create: SdkworkClawrouterSdkOperation;
    delete: SdkworkClawrouterSdkOperation;
    list: SdkworkClawrouterSdkOperation;
    update: SdkworkClawrouterSdkOperation;
  }

  export interface CommerceMembershipsPackagesApi {
    create: SdkworkClawrouterSdkOperation;
    delete: SdkworkClawrouterSdkOperation;
    list: SdkworkClawrouterSdkOperation;
    update: SdkworkClawrouterSdkOperation;
  }

  export interface CommerceMembershipsPlansApi {
    create: SdkworkClawrouterSdkOperation;
    delete: SdkworkClawrouterSdkOperation;
    list: SdkworkClawrouterSdkOperation;
    update: SdkworkClawrouterSdkOperation;
  }

  export interface CommerceOrdersApi {
    events: SdkworkClawrouterNestedResource;
    list: SdkworkClawrouterSdkOperation;
  }

  export interface CommercePaymentsApi {
    attempts: SdkworkClawrouterNestedResource;
    channels: SdkworkClawrouterNestedResource;
    intents: SdkworkClawrouterNestedResource;
    methods: SdkworkClawrouterNestedResource;
    reconciliationRuns: SdkworkClawrouterNestedResource;
    routeRules: SdkworkClawrouterNestedResource;
    webhookEvents: SdkworkClawrouterNestedResource;
  }

  export interface CommercePaymentsProviderAccountsApi {
    create: SdkworkClawrouterSdkOperation;
    list: SdkworkClawrouterSdkOperation;
    update: SdkworkClawrouterSdkOperation;
  }

  export interface CommerceRechargesApi {
    orders: SdkworkClawrouterNestedResource;
  }

  export interface CommerceRechargesPackagesApi {
    create: SdkworkClawrouterSdkOperation;
    list: SdkworkClawrouterSdkOperation;
    update: SdkworkClawrouterSdkOperation;
  }

  export interface CommerceShipmentsApi {
    list: SdkworkClawrouterSdkOperation;
  }

  export interface SystemPromotionsApi {
    couponStocks: SdkworkClawrouterNestedResource;
    discountAllocations: SdkworkClawrouterNestedResource;
    discountApplications: SdkworkClawrouterNestedResource;
    offers: SdkworkClawrouterNestedResource;
    userCoupons: SdkworkClawrouterNestedResource;
  }

  export interface SystemPromotionsCodesApi {
    list: SdkworkClawrouterSdkOperation;
  }
}

declare module '@sdkwork/clawrouter-app-sdk' {
  interface SdkworkClawrouterSdkResult {
    data?: any;
    item?: any;
    items?: any[];
    nextCursor?: string;
    requestId?: string;
    [key: string]: any;
  }

  type SdkworkClawrouterSdkOperation = (...args: any[]) => Promise<SdkworkClawrouterSdkResult>;

  interface SdkworkClawrouterCrudResource {
    create: SdkworkClawrouterSdkOperation;
    delete: SdkworkClawrouterSdkOperation;
    list: SdkworkClawrouterSdkOperation;
    retrieve: SdkworkClawrouterSdkOperation;
    update: SdkworkClawrouterSdkOperation;
  }

  interface SdkworkClawrouterNestedResource extends SdkworkClawrouterCrudResource {
    accounts: SdkworkClawrouterNestedResource;
    attempts: SdkworkClawrouterNestedResource;
    balance: SdkworkClawrouterNestedResource;
    benefits: SdkworkClawrouterNestedResource;
    cancellations: SdkworkClawrouterNestedResource;
    categories: SdkworkClawrouterNestedResource;
    claims: SdkworkClawrouterNestedResource;
    current: SdkworkClawrouterNestedResource;
    dailyRewards: SdkworkClawrouterNestedResource;
    defaultSelection: SdkworkClawrouterNestedResource;
    exchangeRate: SdkworkClawrouterNestedResource;
    exchangeRules: SdkworkClawrouterNestedResource;
    events: SdkworkClawrouterNestedResource;
    history: SdkworkClawrouterNestedResource;
    intents: SdkworkClawrouterNestedResource;
    items: SdkworkClawrouterNestedResource;
    ledgerEntries: SdkworkClawrouterNestedResource;
    methods: SdkworkClawrouterNestedResource;
    overview: SdkworkClawrouterNestedResource;
    orders: SdkworkClawrouterNestedResource;
    packageGroups: SdkworkClawrouterNestedResource;
    packages: SdkworkClawrouterNestedResource;
    payments: SdkworkClawrouterNestedResource;
    plans: SdkworkClawrouterNestedResource;
    points: SdkworkClawrouterNestedResource;
    privileges: SdkworkClawrouterNestedResource;
    products: SdkworkClawrouterNestedResource;
    purchases: SdkworkClawrouterNestedResource;
    quotes: SdkworkClawrouterNestedResource;
    redemptions: SdkworkClawrouterNestedResource;
    renew: SdkworkClawrouterSdkOperation;
    reversals: SdkworkClawrouterNestedResource;
    sessions: SdkworkClawrouterNestedResource;
    settings: SdkworkClawrouterNestedResource;
    skus: SdkworkClawrouterNestedResource;
    speedUps: SdkworkClawrouterNestedResource;
    status: SdkworkClawrouterNestedResource;
    summary: SdkworkClawrouterNestedResource;
    tokens: SdkworkClawrouterNestedResource;
    upgrade: SdkworkClawrouterSdkOperation;
    usage: SdkworkClawrouterNestedResource;
    wallet: SdkworkClawrouterNestedResource;
  }

  export interface CommerceApi {
    accounts: SdkworkClawrouterNestedResource;
    addresses: SdkworkClawrouterNestedResource;
    billing: SdkworkClawrouterNestedResource;
    cart: SdkworkClawrouterNestedResource;
    catalog: SdkworkClawrouterNestedResource;
    checkout: SdkworkClawrouterNestedResource;
    fulfillments: SdkworkClawrouterNestedResource;
    invoices: SdkworkClawrouterNestedResource;
    memberships: SdkworkClawrouterNestedResource;
    orders: SdkworkClawrouterNestedResource;
    payments: SdkworkClawrouterNestedResource;
    refunds: SdkworkClawrouterNestedResource;
    shipments: SdkworkClawrouterNestedResource;
    wallet: SdkworkClawrouterNestedResource;
  }

  export interface CommerceRechargesApi {
    orders: SdkworkClawrouterNestedResource;
    packages: SdkworkClawrouterNestedResource;
  }

  export interface SystemPromotionsApi {
    codes: SdkworkClawrouterNestedResource;
    userCoupons: SdkworkClawrouterNestedResource;
  }

  export interface SystemPromotionsDiscountApplicationsApi {
    create: SdkworkClawrouterSdkOperation;
    release: SdkworkClawrouterSdkOperation;
    settle: SdkworkClawrouterSdkOperation;
  }
}
