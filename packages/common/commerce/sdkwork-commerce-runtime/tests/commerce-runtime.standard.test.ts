import { describe, expect, it } from "vitest";

import { createCommerceRuntime, createMemoryCommerceFeatureFlagStore } from "../src/index";

describe("SDKWork commerce runtime", () => {
  it("creates a deployment-aware commerce runtime over an injected app SDK client", async () => {
    const runtime = createCommerceRuntime({
      clients: { app: createCompleteBillingClient() },
      config: {
        appId: "sdkwork-router",
        deploymentMode: "private",
        environment: "production",
      },
      featureFlagStore: createMemoryCommerceFeatureFlagStore({
        enableWallet: true,
        enableVip: true,
      }),
    });

    expect(runtime.config).toEqual({
      appId: "sdkwork-router",
      deploymentMode: "private",
      environment: "production",
    });
    expect(await runtime.featureFlagStore.isEnabled("enableWallet")).toBe(true);
    await expect(runtime.service.wallet.accounts.list()).resolves.toEqual({ ok: true });
  });

  it("rejects runtimes whose app SDK does not expose the commerce standard surface", () => {
    expect(() => createCommerceRuntime({
      clients: { app: { billing: { wallet: {} } } as any },
      config: {
        appId: "sdkwork-router",
        deploymentMode: "saas",
        environment: "production",
      },
    })).toThrow(/Generated app SDK client is missing standard commerce methods/);
  });
});

function createCompleteBillingClient(): any {
  const method = async () => ({ code: 0, data: { ok: true } });
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
