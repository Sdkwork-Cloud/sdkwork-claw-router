import {
  APP_COMMERCE_METHOD_TREE,
  BACKEND_COMMERCE_METHOD_TREE,
  type CommerceAppSdkClient,
  type CommerceBackendSdkClient,
  type CommerceRequestParams,
  type CommerceSdkMethod,
} from "@sdkwork/commerce-sdk-ports";

type SdkworkCommerceServiceMethod = (...args: Parameters<CommerceSdkMethod>) => Promise<unknown>;

export interface CreateSdkworkCommerceServiceInput {
  appClient: CommerceAppSdkClient;
  backendClient?: CommerceBackendSdkClient;
}

export type SdkworkCommerceServiceProvider = () => SdkworkCommerceService;

let sdkworkCommerceServiceProvider: SdkworkCommerceServiceProvider | null = null;

export interface SdkworkCommerceSessionTokens {
  accessToken?: string;
  authToken?: string;
  refreshToken?: string;
}

export type SdkworkCommerceSessionTokenProvider = () => SdkworkCommerceSessionTokens;

let sdkworkCommerceSessionTokenProvider: SdkworkCommerceSessionTokenProvider = () => ({});

type ServiceTemplate = {
  readonly [key: string]: true | ServiceTemplate;
};

interface OpenServiceResourceOptions {
  aliases?: ReadonlyMap<string, string>;
  facadePathPrefix?: readonly string[];
}

type ServiceFromTemplate<TTree extends ServiceTemplate> = {
  readonly [TKey in keyof TTree]: TTree[TKey] extends true
    ? SdkworkCommerceServiceMethod
    : TTree[TKey] extends ServiceTemplate
      ? ServiceFromTemplate<TTree[TKey]>
      : never;
};

export type SdkworkCommerceAppService = ServiceFromTemplate<typeof APP_COMMERCE_METHOD_TREE>;
export type SdkworkCommerceAdminBaseService = ServiceFromTemplate<typeof BACKEND_COMMERCE_METHOD_TREE>;

export type SdkworkCommerceOpenResource = {
  readonly [key: string]: SdkworkCommerceOpenResource | SdkworkCommerceServiceMethod;
};

type SdkworkCommerceOpenProxyResource = SdkworkCommerceServiceMethod & {
  readonly [key: string]: SdkworkCommerceOpenProxyResource;
};

export interface SdkworkCommerceAccountFacade {
  summary: { retrieve: SdkworkCommerceServiceMethod };
  points: {
    retrieve: SdkworkCommerceServiceMethod;
    history: { list: SdkworkCommerceServiceMethod };
    exchangeRate: { retrieve: SdkworkCommerceServiceMethod };
    recharges: {
      packages: { list: SdkworkCommerceServiceMethod };
      records: { list: SdkworkCommerceServiceMethod };
      orders: {
        retrieve: SdkworkCommerceServiceMethod;
        cancel: SdkworkCommerceServiceMethod;
      };
      create: SdkworkCommerceServiceMethod;
    };
    transfers: { create: SdkworkCommerceServiceMethod };
    exchanges: {
      rules: { list: SdkworkCommerceServiceMethod };
      create: SdkworkCommerceServiceMethod;
      retrieve: SdkworkCommerceServiceMethod;
    };
  };
  tokens: {
    retrieve: SdkworkCommerceServiceMethod;
    deductions: { create: SdkworkCommerceServiceMethod };
  };
}

export interface SdkworkCommerceCouponFacade {
  catalog: {
    list: SdkworkCommerceServiceMethod;
    retrieve: SdkworkCommerceServiceMethod;
  };
  claims: { create: SdkworkCommerceServiceMethod };
  redeem: { create: SdkworkCommerceServiceMethod };
  usage: {
    create: SdkworkCommerceServiceMethod;
    rollback: SdkworkCommerceServiceMethod;
  };
}

export interface SdkworkCommerceUsersFacade {
  current: {
    coupons: {
      list: SdkworkCommerceServiceMethod;
      retrieve: SdkworkCommerceServiceMethod;
    };
  };
}

export interface SdkworkCommerceSettlementFacade {
  dashboard: { list: SdkworkCommerceServiceMethod };
}

export interface SdkworkCommercePreflightFacade {
  estimates: { create: SdkworkCommerceServiceMethod };
  prechecks: { create: SdkworkCommerceServiceMethod };
  preholds: { create: SdkworkCommerceServiceMethod };
  settlements: { create: SdkworkCommerceServiceMethod };
  releases: { create: SdkworkCommerceServiceMethod };
}

export interface SdkworkCommerceVipFacade {
  info: { retrieve: SdkworkCommerceServiceMethod };
  levels: { list: SdkworkCommerceServiceMethod };
  benefits: { list: SdkworkCommerceServiceMethod };
  status: { retrieve: SdkworkCommerceServiceMethod };
  packageGroups: {
    list: SdkworkCommerceServiceMethod;
    retrieve: SdkworkCommerceServiceMethod;
    packages: { list: SdkworkCommerceServiceMethod };
  };
  packages: {
    list: SdkworkCommerceServiceMethod;
    retrieve: SdkworkCommerceServiceMethod;
  };
  purchase: {
    create: SdkworkCommerceServiceMethod;
    renew: SdkworkCommerceServiceMethod;
    upgrade: SdkworkCommerceServiceMethod;
  };
  points: {
    balance: { retrieve: SdkworkCommerceServiceMethod };
    history: { list: SdkworkCommerceServiceMethod };
    dailyRewards: {
      create: SdkworkCommerceServiceMethod;
      status: { retrieve: SdkworkCommerceServiceMethod };
    };
  };
  privileges: {
    usage: { retrieve: SdkworkCommerceServiceMethod };
    speedUps: { create: SdkworkCommerceServiceMethod };
  };
}

export interface SdkworkCommerceWalletFacade {
  operations: { retrieve: SdkworkCommerceServiceMethod };
  topups: { create: SdkworkCommerceServiceMethod };
  withdrawals: { create: SdkworkCommerceServiceMethod };
}

export interface SdkworkCommerceAdminCouponFacade {
  list: SdkworkCommerceServiceMethod;
  create: SdkworkCommerceServiceMethod;
  update: SdkworkCommerceServiceMethod;
  delete: SdkworkCommerceServiceMethod;
}

export interface SdkworkCommerceAdminRechargesFacade {
  records: {
    list: SdkworkCommerceServiceMethod;
    retrieve: SdkworkCommerceServiceMethod;
  };
  packages: {
    list: SdkworkCommerceServiceMethod;
    create: SdkworkCommerceServiceMethod;
    update: SdkworkCommerceServiceMethod;
    delete: SdkworkCommerceServiceMethod;
  };
}

export interface SdkworkCommerceAdminServiceFacades {
  couponBatches: {
    list: SdkworkCommerceServiceMethod;
    create: SdkworkCommerceServiceMethod;
  };
  couponCodes: {
    list: SdkworkCommerceServiceMethod;
    status: { update: SdkworkCommerceServiceMethod };
  };
  exchangeRules: {
    list: SdkworkCommerceServiceMethod;
    update: SdkworkCommerceServiceMethod;
  };
  finance: {
    ledger: { list: SdkworkCommerceServiceMethod };
    usageStatements: { list: SdkworkCommerceServiceMethod };
  };
  referrals: {
    stats: { list: SdkworkCommerceServiceMethod };
  };
  users: {
    coupons: { list: SdkworkCommerceServiceMethod };
    balanceAdjustments: { create: SdkworkCommerceServiceMethod };
  };
  vip: {
    entitlements: { list: SdkworkCommerceServiceMethod };
    levels: {
      list: SdkworkCommerceServiceMethod;
      create: SdkworkCommerceServiceMethod;
      update: SdkworkCommerceServiceMethod;
      delete: SdkworkCommerceServiceMethod;
    };
    memberships: {
      list: SdkworkCommerceServiceMethod;
      update: SdkworkCommerceServiceMethod;
    };
    packageGroups: {
      list: SdkworkCommerceServiceMethod;
      create: SdkworkCommerceServiceMethod;
      update: SdkworkCommerceServiceMethod;
      delete: SdkworkCommerceServiceMethod;
    };
    packages: {
      list: SdkworkCommerceServiceMethod;
      create: SdkworkCommerceServiceMethod;
      update: SdkworkCommerceServiceMethod;
      delete: SdkworkCommerceServiceMethod;
    };
  };
}

export type SdkworkCommerceAdminService = SdkworkCommerceAdminBaseService & {
  couponBatches: SdkworkCommerceAdminServiceFacades["couponBatches"];
  couponCodes: SdkworkCommerceAdminServiceFacades["couponCodes"];
  coupons: SdkworkCommerceAdminBaseService["coupons"] & SdkworkCommerceAdminCouponFacade;
  exchangeRules: SdkworkCommerceAdminServiceFacades["exchangeRules"];
  finance: SdkworkCommerceAdminServiceFacades["finance"];
  payments: SdkworkCommerceAdminBaseService["payments"] & {
    attempts: { list: SdkworkCommerceServiceMethod };
  };
  referrals: SdkworkCommerceAdminServiceFacades["referrals"];
  recharges: SdkworkCommerceAdminBaseService["recharges"] & SdkworkCommerceAdminRechargesFacade;
  users: SdkworkCommerceAdminServiceFacades["users"];
  vip: SdkworkCommerceAdminServiceFacades["vip"];
};

export type SdkworkCommerceService = Omit<
  SdkworkCommerceAppService,
  "coupons" | "invoices" | "orders" | "payments" | "wallet"
> & {
  admin: SdkworkCommerceAdminService;
  account: SdkworkCommerceAccountFacade;
  coupons: SdkworkCommerceAppService["coupons"] & SdkworkCommerceCouponFacade;
  invoices: SdkworkCommerceAppService["invoices"];
  orders: SdkworkCommerceAppService["orders"];
  payments: SdkworkCommerceAppService["payments"];
  preflight: SdkworkCommercePreflightFacade;
  settlements: SdkworkCommerceSettlementFacade;
  users: SdkworkCommerceUsersFacade;
  vip: SdkworkCommerceVipFacade;
  wallet: SdkworkCommerceAppService["wallet"] & SdkworkCommerceWalletFacade;
};

export type SdkworkCommerceVipStatus = "active" | "disabled" | "inactive" | "suspended" | string;

export interface SdkworkCommerceVipLevel {
  benefits?: readonly string[];
  code: string;
  id: string;
  name: string;
  rank: number;
  status: SdkworkCommerceVipStatus;
}

export type SdkworkCommerceVipLevelUpdateRequest = Omit<SdkworkCommerceVipLevel, "id">;
export type SdkworkCommerceVipLevelsListParams = CommerceRequestParams;
export interface SdkworkCommerceVipLevelDeleteResult {
  deleted?: boolean;
  levelId?: string;
}

export interface SdkworkCommerceVipBenefit {
  id: string;
}

export interface SdkworkCommerceVipPackage {
  code: string;
  currencyCode: string;
  durationDays: number;
  groupId: string;
  id: string;
  levelId: string;
  name: string;
  priceAmount: string;
  status: SdkworkCommerceVipStatus;
}

export type SdkworkCommerceVipPackageUpdateRequest = Omit<SdkworkCommerceVipPackage, "id">;
export type SdkworkCommerceVipPackagesListParams = CommerceRequestParams;
export interface SdkworkCommerceVipPackageDeleteResult {
  deleted?: boolean;
  packageId?: string;
}

export interface SdkworkCommerceVipPackageGroup {
  billingCycle: string;
  code: string;
  description?: string | null;
  durationDays: number;
  id: string;
  name: string;
  sortWeight: number;
  status: SdkworkCommerceVipStatus;
}

export type SdkworkCommerceVipPackageGroupMutationRequest = Omit<SdkworkCommerceVipPackageGroup, "id">;
export type SdkworkCommerceVipPackageGroupsListParams = CommerceRequestParams;
export interface SdkworkCommerceVipPackageGroupDeleteResult {
  deleted?: boolean;
  packageGroupId?: string;
}

export interface SdkworkCommerceVipMembership {
  expiresAt: string;
  id: string;
  levelCode: string;
  ownerUserId: string;
  startedAt: string;
  status: SdkworkCommerceVipStatus;
}

export type SdkworkCommerceVipMembershipsListParams = CommerceRequestParams;
export interface SdkworkCommerceVipMembershipStatusUpdateInput {
  status: SdkworkCommerceVipStatus;
}

export interface SdkworkCommerceVipEntitlement {
  code: string;
  id: string;
  levelId: string;
  membershipId: string;
  quota: string;
  status: SdkworkCommerceVipStatus;
}

export type SdkworkCommerceVipEntitlementsListParams = CommerceRequestParams;

const APP_FACADE_METHOD_ALIASES = new Map<string, string>([
  ["account.summary.retrieve", "accounts.current.summary.retrieve"],
  ["account.points.retrieve", "wallet.accounts.points.retrieve"],
  ["account.points.history.list", "wallet.ledgerEntries.points.list"],
  ["account.points.exchangeRate.retrieve", "wallet.exchangeRate.retrieve"],
  ["account.points.recharges.packages.list", "recharges.packages.list"],
  ["account.points.recharges.records.list", "recharges.orders.list"],
  ["account.points.recharges.orders.retrieve", "recharges.orders.retrieve"],
  ["account.points.recharges.orders.cancel", "recharges.orders.cancel"],
  ["account.points.recharges.create", "recharges.orders.create"],
  ["account.points.transfers.create", "wallet.pointTransfers.create"],
  ["account.points.exchanges.rules.list", "wallet.exchangeRules.list"],
  ["account.points.exchanges.create", "wallet.pointExchanges.create"],
  ["account.points.exchanges.retrieve", "wallet.pointExchanges.retrieve"],
  ["account.tokens.retrieve", "wallet.accounts.tokens.retrieve"],
  ["account.tokens.deductions.create", "wallet.withdrawalTransfers.create"],
  ["coupons.catalog.list", "coupons.templates.list"],
  ["coupons.catalog.retrieve", "coupons.templates.retrieve"],
  ["coupons.redeem.create", "coupons.codeClaims.create"],
  ["coupons.usage.create", "coupons.redemptions.create"],
  ["coupons.usage.rollback", "coupons.redemptions.rollback"],
  ["settlements.dashboard.list", "wallet.ledgerEntries.list"],
  ["users.current.coupons.list", "coupons.wallet.list"],
  ["users.current.coupons.retrieve", "coupons.wallet.retrieve"],
  ["vip.info.retrieve", "memberships.current.retrieve"],
  ["vip.status.retrieve", "memberships.current.status.retrieve"],
  ["vip.levels.list", "memberships.plans.list"],
  ["vip.benefits.list", "memberships.benefits.list"],
  ["vip.packageGroups.list", "memberships.packageGroups.list"],
  ["vip.packageGroups.retrieve", "memberships.packageGroups.retrieve"],
  ["vip.packageGroups.packages.list", "memberships.packageGroups.packages.list"],
  ["vip.packages.list", "memberships.packages.list"],
  ["vip.packages.retrieve", "memberships.packages.retrieve"],
  ["vip.purchase.create", "memberships.purchases.create"],
  ["vip.purchase.renew", "memberships.purchases.renew"],
  ["vip.purchase.upgrade", "memberships.purchases.upgrade"],
  ["vip.points.balance.retrieve", "memberships.points.balance.retrieve"],
  ["vip.points.history.list", "memberships.points.history.list"],
  ["vip.points.dailyRewards.create", "memberships.points.dailyRewards.create"],
  ["vip.points.dailyRewards.status.retrieve", "memberships.points.dailyRewards.status.retrieve"],
  ["vip.privileges.usage.retrieve", "memberships.privileges.usage.retrieve"],
  ["vip.privileges.speedUps.create", "memberships.privileges.speedUps.create"],
  ["wallet.operations.retrieve", "wallet.requests.retrieve"],
  ["wallet.topups.create", "wallet.topupTransfers.create"],
  ["wallet.withdrawals.create", "wallet.withdrawalTransfers.create"],
]);

const BACKEND_FACADE_METHOD_ALIASES = new Map<string, string>([
  ["admin.couponBatches.list", "coupons.campaigns.list"],
  ["admin.couponBatches.create", "coupons.campaigns.create"],
  ["admin.couponCodes.list", "coupons.codes.list"],
  ["admin.couponCodes.status.update", "coupons.codes.status.update"],
  ["admin.exchangeRules.list", "wallet.exchangeRules.list"],
  ["admin.exchangeRules.update", "wallet.exchangeRules.update"],
  ["admin.finance.ledger.list", "wallet.ledgerEntries.list"],
  ["admin.finance.usageStatements.list", "commerceReports.usageStatements.list"],
  ["admin.referrals.stats.list", "reports.sales.list"],
  ["admin.users.balanceAdjustments.create", "wallet.adjustments.create"],
  ["admin.vip.entitlements.list", "memberships.entitlements.list"],
  ["admin.vip.levels.create", "memberships.plans.create"],
  ["admin.vip.levels.delete", "memberships.plans.delete"],
  ["admin.vip.levels.list", "memberships.plans.list"],
  ["admin.vip.levels.update", "memberships.plans.update"],
  ["admin.vip.memberships.list", "memberships.members.list"],
  ["admin.vip.memberships.update", "memberships.members.update"],
  ["admin.vip.packageGroups.create", "memberships.packageGroups.create"],
  ["admin.vip.packageGroups.delete", "memberships.packageGroups.delete"],
  ["admin.vip.packageGroups.list", "memberships.packageGroups.list"],
  ["admin.vip.packageGroups.update", "memberships.packageGroups.update"],
  ["admin.vip.packages.create", "memberships.packages.create"],
  ["admin.vip.packages.delete", "memberships.packages.delete"],
  ["admin.vip.packages.list", "memberships.packages.list"],
  ["admin.vip.packages.update", "memberships.packages.update"],
  ["settlements.dashboard.list", "reports.sales.list"],
]);

export interface SdkworkCommerceResponseEnvelope<T> {
  code?: number | string;
  data?: T;
  message?: string;
  msg?: string;
}

export function configureSdkworkCommerceServiceProvider(provider: SdkworkCommerceServiceProvider | null): void {
  sdkworkCommerceServiceProvider = provider;
}

export function configureSdkworkCommerceSessionTokenProvider(
  provider: SdkworkCommerceSessionTokenProvider | null,
): void {
  sdkworkCommerceSessionTokenProvider = provider ?? (() => ({}));
}

export function getSdkworkCommerceService(): SdkworkCommerceService {
  if (!sdkworkCommerceServiceProvider) {
    throw new Error(
      "SDKWork commerce service provider is not configured. Pass commerceService to the feature service or call configureSdkworkCommerceServiceProvider().",
    );
  }

  return sdkworkCommerceServiceProvider();
}

export function getSdkworkCommerceSessionTokens(): SdkworkCommerceSessionTokens {
  const tokens = sdkworkCommerceSessionTokenProvider();
  return {
    accessToken: normalizeSessionToken(tokens.accessToken),
    authToken: normalizeSessionToken(tokens.authToken),
    refreshToken: normalizeSessionToken(tokens.refreshToken),
  };
}

export function hasSdkworkCommerceSession(): boolean {
  const tokens = getSdkworkCommerceSessionTokens();
  return Boolean(normalizeSessionToken(tokens.authToken) || normalizeSessionToken(tokens.accessToken));
}

export function requireSdkworkCommerceSession(message = "Authentication required"): void {
  if (!hasSdkworkCommerceSession()) {
    throw new Error(message);
  }
}

export function createSdkworkCommerceService(input: CreateSdkworkCommerceServiceInput): SdkworkCommerceService {
  const appCommerce = input.appClient.commerce;
  const backendCommerce = input.backendClient?.commerce;
  const appService = buildServiceTree<SdkworkCommerceAppService>(APP_COMMERCE_METHOD_TREE, appCommerce, ["commerce"]);
  const adminService = buildServiceTree<SdkworkCommerceAdminBaseService>(
    BACKEND_COMMERCE_METHOD_TREE,
    backendCommerce,
    ["commerce"],
  );

  return {
    ...appService,
    account: createOpenServiceResource<SdkworkCommerceAccountFacade>(appCommerce, ["wallet"], ["commerce", "wallet"], {
      aliases: APP_FACADE_METHOD_ALIASES,
      facadePathPrefix: ["account"],
    }),
    admin: {
      ...adminService,
      couponBatches: createOpenServiceResource<SdkworkCommerceAdminServiceFacades["couponBatches"]>(
        backendCommerce,
        ["coupons", "campaigns"],
        ["commerce", "coupons", "campaigns"],
        {
          aliases: BACKEND_FACADE_METHOD_ALIASES,
          facadePathPrefix: ["admin", "couponBatches"],
        },
      ),
      couponCodes: createOpenServiceResource<SdkworkCommerceAdminServiceFacades["couponCodes"]>(
        backendCommerce,
        ["coupons", "codes"],
        ["commerce", "coupons", "codes"],
        {
          aliases: BACKEND_FACADE_METHOD_ALIASES,
          facadePathPrefix: ["admin", "couponCodes"],
        },
      ),
      coupons: createMergedOpenServiceResource<SdkworkCommerceAdminBaseService["coupons"], SdkworkCommerceAdminCouponFacade>(
        adminService.coupons,
        backendCommerce,
        ["coupons"],
        ["commerce", "coupons"],
      ),
      exchangeRules: createOpenServiceResource<SdkworkCommerceAdminServiceFacades["exchangeRules"]>(
        backendCommerce,
        ["wallet", "exchangeRules"],
        ["commerce", "wallet", "exchangeRules"],
        {
          aliases: BACKEND_FACADE_METHOD_ALIASES,
          facadePathPrefix: ["admin", "exchangeRules"],
        },
      ),
      finance: createOpenServiceResource<SdkworkCommerceAdminServiceFacades["finance"]>(backendCommerce, ["reports"], ["commerce", "reports"], {
        aliases: BACKEND_FACADE_METHOD_ALIASES,
        facadePathPrefix: ["admin", "finance"],
      }),
      referrals: createOpenServiceResource<SdkworkCommerceAdminServiceFacades["referrals"]>(
        backendCommerce,
        ["memberships", "referrals"],
        ["commerce", "memberships", "referrals"],
        {
          aliases: BACKEND_FACADE_METHOD_ALIASES,
          facadePathPrefix: ["admin", "referrals"],
        },
      ),
      recharges: createMergedOpenServiceResource<SdkworkCommerceAdminBaseService["recharges"], SdkworkCommerceAdminRechargesFacade>(
        adminService.recharges,
        backendCommerce,
        ["recharges"],
        ["commerce", "recharges"],
      ),
      users: createOpenServiceResource<SdkworkCommerceAdminServiceFacades["users"]>(backendCommerce, ["users"], ["commerce", "users"], {
        aliases: BACKEND_FACADE_METHOD_ALIASES,
        facadePathPrefix: ["admin", "users"],
      }),
      vip: createOpenServiceResource<SdkworkCommerceAdminServiceFacades["vip"]>(backendCommerce, ["memberships"], ["commerce", "memberships"], {
        aliases: BACKEND_FACADE_METHOD_ALIASES,
        facadePathPrefix: ["admin", "vip"],
      }),
    },
    coupons: {
      ...appService.coupons,
      catalog: createOpenServiceResource<SdkworkCommerceCouponFacade["catalog"]>(appCommerce, ["coupons", "templates"], ["commerce", "coupons", "templates"], {
        aliases: APP_FACADE_METHOD_ALIASES,
        facadePathPrefix: ["coupons", "catalog"],
      }),
      redeem: createOpenServiceResource<SdkworkCommerceCouponFacade["redeem"]>(appCommerce, ["coupons", "codeClaims"], ["commerce", "coupons", "codeClaims"], {
        aliases: APP_FACADE_METHOD_ALIASES,
        facadePathPrefix: ["coupons", "redeem"],
      }),
      usage: createOpenServiceResource<SdkworkCommerceCouponFacade["usage"]>(appCommerce, ["coupons", "redemptions"], ["commerce", "coupons", "redemptions"], {
        aliases: APP_FACADE_METHOD_ALIASES,
        facadePathPrefix: ["coupons", "usage"],
      }),
    },
    invoices: createMergedOpenServiceResource(appService.invoices, appCommerce, ["invoices"], ["commerce", "invoices"]),
    orders: createMergedOpenServiceResource(appService.orders, appCommerce, ["orders"], ["commerce", "orders"]),
    payments: createMergedOpenServiceResource(appService.payments, appCommerce, ["payments"], ["commerce", "payments"]),
    preflight: createOpenServiceResource<SdkworkCommercePreflightFacade>(appCommerce, ["checkout"], ["commerce", "checkout"]),
    settlements: createOpenServiceResource<SdkworkCommerceSettlementFacade>(backendCommerce, ["reports"], ["commerce", "reports"], {
      aliases: BACKEND_FACADE_METHOD_ALIASES,
      facadePathPrefix: ["settlements"],
    }),
    users: createOpenServiceResource<SdkworkCommerceUsersFacade>(appCommerce, ["coupons"], ["commerce", "coupons"], {
      aliases: APP_FACADE_METHOD_ALIASES,
      facadePathPrefix: ["users"],
    }),
    vip: createOpenServiceResource<SdkworkCommerceVipFacade>(appCommerce, ["memberships"], ["commerce", "memberships"], {
      aliases: APP_FACADE_METHOD_ALIASES,
      facadePathPrefix: ["vip"],
    }),
    wallet: createMergedOpenServiceResource<SdkworkCommerceAppService["wallet"], SdkworkCommerceWalletFacade>(
      appService.wallet,
      appCommerce,
      ["wallet"],
      ["commerce", "wallet"],
    ),
  };
}

export function unwrapSdkworkCommerceResponse<T>(value: unknown, fallbackMessage = "Request failed."): T {
  if (!value || typeof value !== "object") {
    return value as T;
  }

  if (!("data" in value) && !("code" in value)) {
    return value as T;
  }

  const envelope = value as SdkworkCommerceResponseEnvelope<T>;
  if (!isSuccessCode(envelope.code)) {
    throw new Error(String(envelope.message || envelope.msg || fallbackMessage).trim());
  }

  return (envelope.data ?? null) as T;
}

export function toSdkworkCommerceOptionalString(value: unknown): string | undefined {
  const normalized = typeof value === "string" ? value.trim() : String(value ?? "").trim();
  return normalized || undefined;
}

export function toNullableSdkworkCommerceNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function toSdkworkCommerceNumber(value: unknown, fallback = 0): number {
  return toNullableSdkworkCommerceNumber(value) ?? fallback;
}

export type SdkworkCommerceMutationStatus = "completed" | "failed" | "pending";

export function toSdkworkCommerceMutationStatus(status: unknown): SdkworkCommerceMutationStatus {
  const normalized = String(status ?? "").trim().toUpperCase();
  if (normalized === "SUCCESS" || normalized === "COMPLETED" || normalized === "PAID") {
    return "completed";
  }

  if (normalized === "FAILED" || normalized === "REJECTED") {
    return "failed";
  }

  return "pending";
}

export function formatSdkworkCommercePoints(value: number, language = "en-US"): string {
  return new Intl.NumberFormat(language).format(value);
}

export function formatSdkworkCommerceCurrencyCny(value: number | null | undefined, language = "en-US"): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "--";
  }

  return new Intl.NumberFormat(language, {
    currency: "CNY",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export function formatSdkworkCommercePointsRate(points: number, language = "en-US"): string {
  return language === "zh-CN"
    ? `${formatSdkworkCommercePoints(points, language)} \u79ef\u5206 / 1 \u5143`
    : `${formatSdkworkCommercePoints(points, language)} pts / CNY 1`;
}

export function formatSdkworkCommercePointsDelta(value: number, language = "en-US"): string {
  const formatted = formatSdkworkCommercePoints(Math.abs(value), language);
  if (value > 0) {
    return `+${formatted}`;
  }
  if (value < 0) {
    return `-${formatted}`;
  }
  return "0";
}

function buildServiceTree<TService>(
  template: ServiceTemplate,
  client: unknown,
  missingPathPrefix: readonly string[],
  servicePath: readonly string[] = [],
): TService {
  const service: Record<string, unknown> = {};

  for (const [key, marker] of Object.entries(template)) {
    const nextServicePath = [...servicePath, key];
    if (marker === true) {
      const missingPath = [...missingPathPrefix, ...nextServicePath].join(".");
      service[key] = (...args: Parameters<CommerceSdkMethod>) =>
        callCommerce(readMethod(client, nextServicePath), missingPath, ...args);
    } else {
      service[key] = buildServiceTree<Record<string, unknown>>(
        marker,
        client,
        missingPathPrefix,
        nextServicePath,
      );
    }
  }

  return service as TService;
}

function createMergedOpenServiceResource<TBase extends object, TOpen extends object = SdkworkCommerceOpenResource>(
  base: TBase,
  client: unknown,
  clientPathPrefix: readonly string[],
  missingPathPrefix: readonly string[],
): TBase & TOpen {
  return Object.assign(
    createOpenServiceResource(client, clientPathPrefix, missingPathPrefix),
    base,
  ) as TBase & TOpen;
}

function createOpenServiceResource<TResource extends object = SdkworkCommerceOpenResource>(
  client: unknown,
  clientPathPrefix: readonly string[],
  missingPathPrefix: readonly string[],
  options: OpenServiceResourceOptions = {},
): TResource {
  const callable = ((...args: Parameters<CommerceSdkMethod>) => {
    const resolvedPath = resolveOpenResourcePath(clientPathPrefix, missingPathPrefix, options);
    return callCommerce(readMethod(client, resolvedPath.clientPath), resolvedPath.missingPath, ...args);
  }) as SdkworkCommerceOpenProxyResource;

  return new Proxy(callable, {
    get(target, property, receiver) {
      if (typeof property !== "string" || property in target) {
        return Reflect.get(target, property, receiver);
      }

      return createOpenServiceResource<SdkworkCommerceOpenProxyResource>(
        client,
        [...clientPathPrefix, property],
        [...missingPathPrefix, property],
        {
          ...options,
          facadePathPrefix: [...(options.facadePathPrefix ?? []), property],
        },
      );
    },
  }) as TResource;
}

function resolveOpenResourcePath(
  clientPathPrefix: readonly string[],
  missingPathPrefix: readonly string[],
  options: OpenServiceResourceOptions,
): { clientPath: readonly string[]; missingPath: string } {
  const facadePath = options.facadePathPrefix?.join(".");
  const aliasPath = facadePath ? options.aliases?.get(facadePath) : undefined;
  if (!aliasPath) {
    return {
      clientPath: clientPathPrefix,
      missingPath: missingPathPrefix.join("."),
    };
  }

  const clientPath = aliasPath.split(".");
  return {
    clientPath,
    missingPath: ["commerce", ...clientPath].join("."),
  };
}

function readMethod(root: unknown, path: readonly string[]): CommerceSdkMethod | undefined {
  let node: unknown = root;
  for (const segment of path) {
    if (!node || typeof node !== "object") {
      return undefined;
    }
    node = (node as Record<string, unknown>)[segment];
  }

  return typeof node === "function" ? (node as CommerceSdkMethod) : undefined;
}

async function callCommerce(
  method: CommerceSdkMethod | undefined,
  name: string,
  ...args: Parameters<CommerceSdkMethod>
): Promise<unknown> {
  if (!method) {
    throw new Error(`Missing SDKWork commerce SDK resource: ${name}`);
  }

  return unwrapSdkworkCommerceResponse(await method(...args), `${name} failed`);
}

function normalizeSessionToken(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function isSuccessCode(code: number | string | undefined): boolean {
  if (code === undefined || code === null) {
    return true;
  }

  const normalized = String(code).trim();
  return normalized === "0" || normalized === "200" || normalized === "2000";
}

export type {
  CommerceAppSdkClient,
  CommerceBackendSdkClient,
  CommerceRequestParams as SdkworkCommerceRequestParams,
};
