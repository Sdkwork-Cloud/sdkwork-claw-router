import { describe, expect, it, vi } from "vitest";

import { createSdkworkCommerceService } from "../src/index";

describe("SDKWork commerce service", () => {
  it("delegates wallet, points, vip, and billing calls through injected SDK resources", async () => {
    const calls: string[] = [];
    const service = createSdkworkCommerceService({
      appClient: createClient(calls),
    });

    await service.wallet.overview.retrieve();
    await service.account.points.recharge.create({ points: "100", requestNo: "REQ-100" });
    await service.vip.purchase.upgrade({ targetLevelId: "vip-level-pro" });
    await service.preflight.preholds.create({ requestNo: "REQ-HOLD", usageType: "CHAT_COMPLETION" });

    expect(calls).toEqual([
      "billing.wallet.overview.retrieve",
      "billing.account.points.recharge.create",
      "billing.vip.purchase.upgrade",
      "billing.preflight.preholds.create",
    ]);
  });

  it("unwraps standard envelopes and rejects failed API envelopes", async () => {
    const service = createSdkworkCommerceService({
      appClient: createClient([], {
        billing: {
          wallet: {
            overview: {
              retrieve: vi.fn(async () => ({ code: 0, data: { snapshotAt: "2026-05-13T00:00:00Z" } })),
            },
          },
          account: {
            summary: {
              retrieve: vi.fn(async () => ({ code: 400, message: "bad account" })),
            },
          },
        },
      }),
    });

    await expect(service.wallet.overview.retrieve()).resolves.toEqual({ snapshotAt: "2026-05-13T00:00:00Z" });
    await expect(service.account.summary.retrieve()).rejects.toThrow("bad account");
  });

  it("fails loudly when the injected SDK lacks a required resource", async () => {
    const service = createSdkworkCommerceService({
      appClient: { billing: { wallet: {} } } as any,
    });

    await expect(service.wallet.topups.create({ amount: "10.00" })).rejects.toThrow("billing.wallet.topups.create");
  });
});

function createClient(calls: string[], overrides: any = {}): any {
  const method = (name: string) => async () => {
    calls.push(name);
    return { code: 0, data: { name } };
  };
  const base = {
    billing: {
      account: {
        summary: { retrieve: method("billing.account.summary.retrieve") },
        points: {
          retrieve: method("billing.account.points.retrieve"),
          history: { list: method("billing.account.points.history.list") },
          exchangeRate: { retrieve: method("billing.account.points.exchangeRate.retrieve") },
          recharge: { create: method("billing.account.points.recharge.create") },
          transfer: { create: method("billing.account.points.transfer.create") },
          exchange: { create: method("billing.account.points.exchange.create") },
        },
        tokens: {
          retrieve: method("billing.account.tokens.retrieve"),
          deduct: { create: method("billing.account.tokens.deduct.create") },
        },
      },
      wallet: {
        overview: { retrieve: method("billing.wallet.overview.retrieve") },
        accounts: { list: method("billing.wallet.accounts.list") },
        transactions: {
          list: method("billing.wallet.transactions.list"),
          retrieve: method("billing.wallet.transactions.retrieve"),
        },
        operations: { retrieve: method("billing.wallet.operations.retrieve") },
        topups: { create: method("billing.wallet.topups.create") },
        withdrawals: { create: method("billing.wallet.withdrawals.create") },
        transfers: { create: method("billing.wallet.transfers.create") },
        exchanges: { create: method("billing.wallet.exchanges.create") },
      },
      vip: {
        info: { retrieve: method("billing.vip.info.retrieve") },
        levels: { list: method("billing.vip.levels.list") },
        benefits: { list: method("billing.vip.benefits.list") },
        status: { retrieve: method("billing.vip.status.retrieve") },
        packGroups: {
          list: method("billing.vip.packGroups.list"),
          retrieve: method("billing.vip.packGroups.retrieve"),
          packs: { list: method("billing.vip.packGroups.packs.list") },
        },
        packs: {
          list: method("billing.vip.packs.list"),
          retrieve: method("billing.vip.packs.retrieve"),
        },
        purchase: {
          create: method("billing.vip.purchase.create"),
          renew: method("billing.vip.purchase.renew"),
          upgrade: method("billing.vip.purchase.upgrade"),
        },
        points: {
          balance: { retrieve: method("billing.vip.points.balance.retrieve") },
          history: { list: method("billing.vip.points.history.list") },
          dailyRewards: {
            create: method("billing.vip.points.dailyRewards.create"),
            status: { retrieve: method("billing.vip.points.dailyRewards.status.retrieve") },
          },
        },
        privileges: {
          usage: { retrieve: method("billing.vip.privileges.usage.retrieve") },
          speedUps: { create: method("billing.vip.privileges.speedUps.create") },
        },
      },
      preflight: {
        estimates: { create: method("billing.preflight.estimates.create") },
        prechecks: { create: method("billing.preflight.prechecks.create") },
        preholds: { create: method("billing.preflight.preholds.create") },
        settlements: { create: method("billing.preflight.settlements.create") },
        releases: { create: method("billing.preflight.releases.create") },
      },
    },
  };
  return deepMerge(base, overrides);
}

function deepMerge(left: any, right: any): any {
  if (!right || typeof right !== "object") {
    return left;
  }
  const result = { ...left };
  for (const [key, value] of Object.entries(right)) {
    result[key] = value && typeof value === "object" && !Array.isArray(value)
      ? deepMerge(result[key] ?? {}, value)
      : value;
  }
  return result;
}
