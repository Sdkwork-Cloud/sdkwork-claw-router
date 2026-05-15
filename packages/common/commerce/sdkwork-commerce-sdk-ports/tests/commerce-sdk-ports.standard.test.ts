import { describe, expect, it } from "vitest";

import {
  SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS,
  assertCommerceAppSdkClient,
  getCommerceSdkSurface,
} from "../src/index";

describe("SDKWork commerce SDK ports", () => {
  it("requires the generated app SDK to expose the complete billing resource tree", () => {
    const client = createCompleteBillingClient();

    expect(() => assertCommerceAppSdkClient(client)).not.toThrow();
    expect(SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS).toContain("billing.wallet.overview.retrieve");
    expect(SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS).toContain("billing.account.points.recharge.create");
    expect(SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS).toContain("billing.vip.purchase.upgrade");
  });

  it("rejects legacy top-level account wallet or vip SDK namespaces", () => {
    expect(() => assertCommerceAppSdkClient({
      account: { summary: { retrieve: async () => ({}) } },
      billing: createCompleteBillingClient().billing,
    })).toThrow(/top-level account, wallet, points, or vip namespaces/i);
  });

  it("reports missing generated SDK methods by full resource path", () => {
    const client = createCompleteBillingClient();
    delete client.billing.wallet.topups.create;

    expect(() => assertCommerceAppSdkClient(client)).toThrow(/billing\.wallet\.topups\.create/);
  });

  it("can inspect generated SDK method surfaces deterministically", () => {
    expect(getCommerceSdkSurface(createCompleteBillingClient())).toEqual(expect.arrayContaining([
      "billing.account.summary.retrieve",
      "billing.account.points.recharge.create",
      "billing.wallet.accounts.list",
      "billing.vip.packGroups.packs.list",
    ]));
  });
});

function createCompleteBillingClient(): any {
  const method = async () => ({ code: 0, data: {} });
  return {
    billing: {
      account: {
        summary: { retrieve: method },
        points: {
          retrieve: method,
          history: { list: method },
          exchangeRate: { retrieve: method },
          recharge: { create: method },
          transfer: { create: method },
          exchange: { create: method },
        },
        tokens: {
          retrieve: method,
          deduct: { create: method },
        },
      },
      wallet: {
        overview: { retrieve: method },
        accounts: { list: method },
        transactions: { list: method, retrieve: method },
        operations: { retrieve: method },
        topups: { create: method },
        withdrawals: { create: method },
        transfers: { create: method },
        exchanges: { create: method },
      },
      vip: {
        info: { retrieve: method },
        levels: { list: method },
        benefits: { list: method },
        status: { retrieve: method },
        packGroups: {
          list: method,
          retrieve: method,
          packs: { list: method },
        },
        packs: { list: method, retrieve: method },
        purchase: {
          create: method,
          renew: method,
          upgrade: method,
        },
        points: {
          balance: { retrieve: method },
          history: { list: method },
          dailyRewards: {
            create: method,
            status: { retrieve: method },
          },
        },
        privileges: {
          usage: { retrieve: method },
          speedUps: { create: method },
        },
      },
      preflight: {
        estimates: { create: method },
        prechecks: { create: method },
        preholds: { create: method },
        settlements: { create: method },
        releases: { create: method },
      },
    },
  };
}
