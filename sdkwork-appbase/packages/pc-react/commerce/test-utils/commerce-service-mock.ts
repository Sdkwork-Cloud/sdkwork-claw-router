import {
  configureSdkworkCommerceSessionTokenProvider,
  type SdkworkCommerceService,
  type SdkworkCommerceSessionTokens,
} from "@sdkwork/commerce-service";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (...args: infer TArgs) => infer TReturn ? (...args: TArgs) => TReturn : DeepPartial<T[K]>;
};

export function createCommerceServiceMock(
  overrides: DeepPartial<SdkworkCommerceService> = {},
): SdkworkCommerceService {
  return mergeCommerceService(createDefaultCommerceServiceMock(), overrides);
}

export function configureCommerceServiceMockSession(
  tokens: SdkworkCommerceSessionTokens = { authToken: "commerce-auth-token" },
): void {
  configureSdkworkCommerceSessionTokenProvider(() => tokens);
}

export function resetCommerceServiceMockSession(): void {
  configureSdkworkCommerceSessionTokenProvider(null);
}

function createDefaultCommerceServiceMock(): SdkworkCommerceService {
  const service: Partial<Record<keyof SdkworkCommerceService, unknown>> = {
    account: {
      summary: { retrieve: missing("account.summary.retrieve") },
      points: {
        retrieve: missing("account.points.retrieve"),
        history: { list: missing("account.points.history.list") },
        exchangeRate: { retrieve: missing("account.points.exchangeRate.retrieve") },
        recharges: {
          packages: { list: missing("account.points.recharges.packages.list") },
          records: { list: missing("account.points.recharges.records.list") },
          orders: {
            retrieve: missing("account.points.recharges.orders.retrieve"),
            cancel: missing("account.points.recharges.orders.cancel"),
          },
          create: missing("account.points.recharges.create"),
        },
        transfers: { create: missing("account.points.transfers.create") },
        exchanges: {
          rules: { list: missing("account.points.exchanges.rules.list") },
          create: missing("account.points.exchanges.create"),
          retrieve: missing("account.points.exchanges.retrieve"),
        },
      },
      tokens: {
        retrieve: missing("account.tokens.retrieve"),
        deductions: { create: missing("account.tokens.deductions.create") },
      },
    },
    wallet: {
      overview: { retrieve: missing("wallet.overview.retrieve") },
      accounts: { list: missing("wallet.accounts.list") },
      transactions: {
        list: missing("wallet.transactions.list"),
        retrieve: missing("wallet.transactions.retrieve"),
      },
      operations: { retrieve: missing("wallet.operations.retrieve") },
      topups: { create: missing("wallet.topups.create") },
      withdrawals: { create: missing("wallet.withdrawals.create") },
      transfers: { create: missing("wallet.transfers.create") },
      exchanges: { create: missing("wallet.exchanges.create") },
    },
    coupons: {
      catalog: {
        list: missing("coupons.catalog.list"),
        retrieve: missing("coupons.catalog.retrieve"),
      },
      claims: { create: missing("coupons.claims.create") },
      redeem: { create: missing("coupons.redeem.create") },
      usage: {
        create: missing("coupons.usage.create"),
        rollback: missing("coupons.usage.rollback"),
      },
    },
    users: {
      current: {
        coupons: {
          list: missing("users.current.coupons.list"),
          retrieve: missing("users.current.coupons.retrieve"),
        },
      },
    },
    orders: {
      list: missing("orders.list"),
      create: missing("orders.create"),
      pay: missing("orders.pay"),
      cancel: missing("orders.cancel"),
      retrieve: missing("orders.retrieve"),
      status: { retrieve: missing("orders.status.retrieve") },
      paymentSuccess: { retrieve: missing("orders.paymentSuccess.retrieve") },
      statistics: { retrieve: missing("orders.statistics.retrieve") },
    },
    payments: {
      close: missing("payments.close"),
      create: missing("payments.create"),
      checkout: { retrieve: missing("payments.checkout.retrieve") },
      methods: { list: missing("payments.methods.list") },
      orderPayments: { list: missing("payments.orderPayments.list") },
      records: {
        list: missing("payments.records.list"),
        retrieve: missing("payments.records.retrieve"),
      },
      reconcile: missing("payments.reconcile"),
      statistics: { retrieve: missing("payments.statistics.retrieve") },
      status: {
        retrieve: missing("payments.status.retrieve"),
        retrieveByOutTradeNo: missing("payments.status.retrieveByOutTradeNo"),
      },
    },
    settlements: {
      dashboard: { list: missing("settlements.dashboard.list") },
    },
    invoices: {
      mine: { list: missing("invoices.mine.list") },
      statistics: { retrieve: missing("invoices.statistics.retrieve") },
      retrieve: missing("invoices.retrieve"),
      items: { list: missing("invoices.items.list") },
      create: missing("invoices.create"),
      update: missing("invoices.update"),
      submit: missing("invoices.submit"),
      cancel: missing("invoices.cancel"),
    },
    vip: {
      info: { retrieve: missing("vip.info.retrieve") },
      levels: { list: missing("vip.levels.list") },
      benefits: { list: missing("vip.benefits.list") },
      status: { retrieve: missing("vip.status.retrieve") },
      packageGroups: {
        list: missing("vip.packageGroups.list"),
        retrieve: missing("vip.packageGroups.retrieve"),
        packages: { list: missing("vip.packageGroups.packages.list") },
      },
      packages: {
        list: missing("vip.packages.list"),
        retrieve: missing("vip.packages.retrieve"),
      },
      purchase: {
        create: missing("vip.purchase.create"),
        renew: missing("vip.purchase.renew"),
        upgrade: missing("vip.purchase.upgrade"),
      },
      points: {
        balance: { retrieve: missing("vip.points.balance.retrieve") },
        history: { list: missing("vip.points.history.list") },
        dailyRewards: {
          create: missing("vip.points.dailyRewards.create"),
          status: { retrieve: missing("vip.points.dailyRewards.status.retrieve") },
        },
      },
      privileges: {
        usage: { retrieve: missing("vip.privileges.usage.retrieve") },
        speedUps: { create: missing("vip.privileges.speedUps.create") },
      },
    },
    preflight: {
      estimates: { create: missing("preflight.estimates.create") },
      prechecks: { create: missing("preflight.prechecks.create") },
      preholds: { create: missing("preflight.preholds.create") },
      settlements: { create: missing("preflight.settlements.create") },
      releases: { create: missing("preflight.releases.create") },
    },
    admin: {
      coupons: {
        list: missing("admin.coupons.list"),
        create: missing("admin.coupons.create"),
        update: missing("admin.coupons.update"),
        delete: missing("admin.coupons.delete"),
      },
      couponBatches: {
        list: missing("admin.couponBatches.list"),
        create: missing("admin.couponBatches.create"),
      },
      couponCodes: {
        list: missing("admin.couponCodes.list"),
        status: { update: missing("admin.couponCodes.status.update") },
      },
      users: {
        coupons: { list: missing("admin.users.coupons.list") },
        balanceAdjustments: { create: missing("admin.users.balanceAdjustments.create") },
      },
      recharges: {
        records: {
          list: missing("admin.recharges.records.list"),
          retrieve: missing("admin.recharges.records.retrieve"),
        },
        packages: {
          list: missing("admin.recharges.packages.list"),
          create: missing("admin.recharges.packages.create"),
          update: missing("admin.recharges.packages.update"),
          delete: missing("admin.recharges.packages.delete"),
        },
      },
      exchangeRules: {
        list: missing("admin.exchangeRules.list"),
        update: missing("admin.exchangeRules.update"),
      },
      payments: {
        attempts: { list: missing("admin.payments.attempts.list") },
      },
      finance: {
        ledger: { list: missing("admin.finance.ledger.list") },
        usageStatements: { list: missing("admin.finance.usageStatements.list") },
      },
      referrals: {
        stats: { list: missing("admin.referrals.stats.list") },
      },
      vip: {
        levels: {
          list: missing("admin.vip.levels.list"),
          create: missing("admin.vip.levels.create"),
          update: missing("admin.vip.levels.update"),
          delete: missing("admin.vip.levels.delete"),
        },
        packages: {
          list: missing("admin.vip.packages.list"),
          create: missing("admin.vip.packages.create"),
          update: missing("admin.vip.packages.update"),
          delete: missing("admin.vip.packages.delete"),
        },
        packageGroups: {
          list: missing("admin.vip.packageGroups.list"),
          create: missing("admin.vip.packageGroups.create"),
          update: missing("admin.vip.packageGroups.update"),
          delete: missing("admin.vip.packageGroups.delete"),
        },
        memberships: {
          list: missing("admin.vip.memberships.list"),
          update: missing("admin.vip.memberships.update"),
        },
        entitlements: { list: missing("admin.vip.entitlements.list") },
      },
    },
  };

  return service as SdkworkCommerceService;
}

function missing(name: string) {
  return async () => {
    throw new Error(`Missing commerce service test method: ${name}`);
  };
}

function mergeCommerceService<T>(base: T, overrides: DeepPartial<T>): T {
  for (const [key, value] of Object.entries(overrides as Record<string, unknown>)) {
    if (
      value
      && typeof value === "object"
      && !Array.isArray(value)
      && typeof (base as Record<string, unknown>)[key] === "object"
    ) {
      mergeCommerceService((base as Record<string, unknown>)[key], value as DeepPartial<unknown>);
    } else {
      (base as Record<string, unknown>)[key] = value;
    }
  }

  return base;
}
