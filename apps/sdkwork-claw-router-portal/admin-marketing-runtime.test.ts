import assert from "node:assert/strict";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import { MarketingService } from "./packages/sdkwork-claw-router-admin-marketing/src/marketingService.ts";
import {
  createCouponBatchGenerateInputFromForm,
  createCouponInputFromForm,
  createRechargePackageInputFromForm,
} from "./packages/sdkwork-claw-router-admin-marketing/src/marketingForm.ts";

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

type CapturedBackendRequest = {
  url: string;
  method: string;
};

async function withBackendSdkResponse<T>(
  responseBody: unknown,
  fn: (captured: CapturedBackendRequest[]) => Promise<T>,
): Promise<T> {
  const captured: CapturedBackendRequest[] = [];
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    enumerable: true,
    value: {},
  });
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    captured.push({
      url,
      method: init?.method ?? "GET",
    });
    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  clearStoredAppSessionToken();
  resetClawRouterSdkClients();

  try {
    return await fn(captured);
  } finally {
    clearStoredAppSessionToken();
    resetClawRouterSdkClients();
    globalThis.fetch = originalFetch;
    if (originalWindowDescriptor) {
      Object.defineProperty(globalThis, "window", originalWindowDescriptor);
    } else {
      delete (globalThis as { window?: Window }).window;
    }
  }
}

test("admin coupon create input does not reuse returned coupon view model", () => {
  const form = new FormData();
  form.set("name", " Launch Credit ");
  form.set("type", " AMOUNT ");
  form.set("value", " 8.50 ");

  const input = createCouponInputFromForm(form);

  assert.deepEqual(input, {
    name: "Launch Credit",
    type: "amount",
    value: "8.50",
  });
  for (const field of ["id", "status"]) {
    assert.equal(field in input, false);
  }
});

test("admin coupon create input defaults unsupported coupon type safely", () => {
  const form = new FormData();
  form.set("name", " Retention ");
  form.set("type", "bonus");
  form.set("value", " 15% ");

  assert.deepEqual(createCouponInputFromForm(form), {
    name: "Retention",
    type: "amount",
    value: "15%",
  });
});

test("admin coupon batch generate input normalizes form values", () => {
  const form = new FormData();
  form.set("batchName", " Launch Batch ");
  form.set("count", " 12.7 ");
  form.set("prefix", " launch-2026 ");

  assert.deepEqual(createCouponBatchGenerateInputFromForm(form, " 99 "), {
    couponId: "99",
    name: "Launch Batch",
    count: 13,
    prefix: "LAUNCH-2026",
  });
});

test("admin coupon batch generate input defaults invalid numeric count safely", () => {
  const form = new FormData();
  form.set("batchName", " ");
  form.set("count", "0");
  form.set("prefix", " ");

  assert.deepEqual(createCouponBatchGenerateInputFromForm(form, "101"), {
    couponId: "101",
    name: "Coupon batch",
    count: 1,
    prefix: "COUPON",
  });
});

test("admin recharge package input normalizes form values", () => {
  const form = new FormData();
  form.set("rmb", " 12 ");
  form.set("bonus", " 30 ");
  form.set("status", " inactive ");

  assert.deepEqual(createRechargePackageInputFromForm(form), {
    rmb: "12.00",
    bonus: 30,
    status: "inactive",
  });
});

test("admin recharge package input rejects invalid form values", () => {
  for (const [patch, message] of [
    [["rmb", "0"], /rmb must be greater than zero/],
    [["rmb", "10.001"], /rmb must be a positive money amount/],
    [["bonus", "-1"], /bonus must be a non-negative integer/],
    [["status", "archived"], /status must be active or inactive/],
  ] as const) {
    const form = new FormData();
    form.set("rmb", "10.00");
    form.set("bonus", "0");
    form.set("status", "active");
    form.set(patch[0], patch[1]);

    assert.throws(() => createRechargePackageInputFromForm(form), message);
  }
});

test("admin marketing service reads generated batch data returned by the generated backend SDK", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        batch: {
          id: "batch-1",
          couponId: "9",
          name: "Launch Batch",
          count: 2,
          prefix: "LAUNCH",
          createdAt: "2026-05-05T09:00:00Z",
        },
        codes: [
          {
            id: "promo-1",
            batchId: "batch-1",
            code: "LAUNCH-001",
            status: "available",
          },
        ],
      },
    },
    async (captured) => {
      const result = await MarketingService.generateBatch({
        couponId: "9",
        name: "Launch Batch",
        count: 2,
        prefix: "LAUNCH",
      });

      assert.equal(captured[0].url, "/backend/v3/api/billing/coupon_batches");
      assert.equal(captured[0].method, "POST");
      assert.equal(result.batch.id, "batch-1");
      assert.deepEqual(result.codes.map((item) => item.code), ["LAUNCH-001"]);
    },
  );
});

test("admin marketing service reads recharge packages returned by the generated backend SDK", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: [
        {
          id: "pkg-10",
          rmb: "10",
          bonus: 25,
          points: 125,
        },
      ],
    },
    async (captured) => {
      const packages = await MarketingService.listRechargePackages();

      assert.equal(captured[0].url, "/backend/v3/api/billing/recharges/packages");
      assert.equal(captured[0].method, "GET");
      assert.deepEqual(packages, [
        {
          id: "pkg-10",
          rmb: "10.00",
          bonus: 25,
          points: 125,
          status: "active",
        },
      ]);
    },
  );
});

test("admin marketing service creates and updates recharge packages through generated backend SDK", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        item: {
          id: "pkg-12",
          rmb: "12.00",
          bonus: 30,
          points: 150,
          status: "inactive",
        },
      },
    },
    async (captured) => {
      const created = await MarketingService.createRechargePackage({
        rmb: "12.00",
        bonus: 30,
        status: "inactive",
      });

      assert.equal(captured[0].url, "/backend/v3/api/billing/recharges/packages");
      assert.equal(captured[0].method, "POST");
      assert.deepEqual(created, {
        id: "pkg-12",
        rmb: "12.00",
        bonus: 30,
        points: 150,
        status: "inactive",
      });
    },
  );

  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        item: {
          id: "pkg-12",
          rmb: "20.00",
          bonus: 50,
          points: 250,
        },
      },
    },
    async (captured) => {
      const updated = await MarketingService.updateRechargePackage("pkg-12", {
        rmb: "20.00",
        bonus: 50,
        status: "active",
      });

      assert.equal(captured[0].url, "/backend/v3/api/billing/recharges/packages/pkg-12");
      assert.equal(captured[0].method, "PUT");
      assert.equal(updated.points, 250);
      assert.equal(updated.status, "active");
    },
  );
});

test("admin marketing service rejects unsafe SDK path ids before calling generated backend SDK", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: { deleted: true },
    },
    async (captured) => {
      await assert.rejects(
        () => MarketingService.deleteCoupon("coupon/9"),
        /couponId must be a safe path segment/,
      );
      await assert.rejects(
        () => MarketingService.updatePromoCodeStatus("promo?debug=true", "voided"),
        /codeId must be a safe path segment/,
      );
      await assert.rejects(
        () => MarketingService.updateRechargePackage("package/9", { rmb: "10.00", bonus: 0 }),
        /packageId must be a safe path segment/,
      );
      await assert.rejects(
        () => MarketingService.deleteRechargePackage("package?debug=true"),
        /packageId must be a safe path segment/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("admin coupon list fails closed when backend omits stable coupon ids", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            name: "Missing Id Coupon",
            type: "amount",
            value: "8.50",
            status: "active",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => MarketingService.fetchCoupons(),
        /Coupon id is required/,
      );
    },
  );
});

test("admin coupon list fails closed when backend returns malformed rows", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "coupon-1",
            name: "Launch Credit",
            type: "amount",
            value: "8.50",
            status: "active",
          },
          "malformed-coupon-row",
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => MarketingService.fetchCoupons(),
        /Coupon record is required/,
      );
    },
  );
});

test("admin coupon list fails closed when backend omits coupon value", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "coupon-1",
            name: "Launch Credit",
            type: "amount",
            status: "active",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => MarketingService.fetchCoupons(),
        /Coupon value is required/,
      );
    },
  );
});

test("admin coupon list fails closed when backend returns unsupported coupon type or status", async () => {
  for (const [patch, message] of [
    [{ type: "bonus" }, /Unsupported coupon type: bonus/],
    [{ status: "archived" }, /Unsupported coupon status: archived/],
  ] as const) {
    await withBackendSdkResponse(
      {
        code: "2000",
        data: {
          items: [
            {
              id: "coupon-1",
              name: "Launch Credit",
              type: "amount",
              value: "$8.50",
              status: "active",
              ...patch,
            },
          ],
        },
      },
      async () => {
        await assert.rejects(
          () => MarketingService.fetchCoupons(),
          message,
        );
      },
    );
  }
});

test("admin coupon list fails closed when backend returns invalid coupon values", async () => {
  for (const [patch, message] of [
    [{ type: "amount", value: "free" }, /Coupon amount value must be a money string/],
    [{ type: "discount", value: "120%" }, /Coupon discount value must be a percentage string/],
  ] as const) {
    await withBackendSdkResponse(
      {
        code: "2000",
        data: {
          items: [
            {
              id: "coupon-1",
              name: "Launch Credit",
              status: "active",
              ...patch,
            },
          ],
        },
      },
      async () => {
        await assert.rejects(
          () => MarketingService.fetchCoupons(),
          message,
        );
      },
    );
  }
});

test("admin coupon batch list fails closed when backend returns malformed rows", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        items: ["malformed-batch-row"],
      },
    },
    async () => {
      await assert.rejects(
        () => MarketingService.fetchBatches(),
        /Coupon batch record is required/,
      );
    },
  );
});

test("admin coupon batch list fails closed when backend omits generated count", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "batch-1",
            couponId: "9",
            name: "Launch Batch",
            prefix: "LAUNCH",
            createdAt: "2026-05-05T09:00:00Z",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => MarketingService.fetchBatches(),
        /Coupon batch count is required/,
      );
    },
  );
});

test("admin coupon batch list fails closed when backend returns negative generated counts", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "batch-1",
            couponId: "9",
            name: "Launch Batch",
            count: -1,
            prefix: "LAUNCH",
            createdAt: "2026-05-05T09:00:00Z",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => MarketingService.fetchBatches(),
        /Coupon batch count is required/,
      );
    },
  );
});

test("admin promo code list fails closed when backend returns malformed rows", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        items: ["malformed-promo-code-row"],
      },
    },
    async () => {
      await assert.rejects(
        () => MarketingService.fetchPromoCodes(),
        /Promo code record is required/,
      );
    },
  );
});

test("admin promo code list fails closed when backend omits code values", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "promo-1",
            batchId: "batch-1",
            status: "available",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => MarketingService.fetchPromoCodes(),
        /Promo code value is required/,
      );
    },
  );
});

test("admin promo code list fails closed when backend returns unsupported status", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "promo-1",
            batchId: "batch-1",
            code: "LAUNCH-001",
            status: "expired",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => MarketingService.fetchPromoCodes(),
        /Unsupported promo code status: expired/,
      );
    },
  );
});

test("admin marketing redemption records fail closed when backend returns malformed rows", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        items: ["malformed-redemption-row"],
      },
    },
    async () => {
      await assert.rejects(
        () => MarketingService.fetchRedemptionRecords(),
        /Redemption record is required/,
      );
    },
  );
});

test("admin marketing redemption records fail closed when backend returns invalid amounts", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "redeem-1",
            userId: "user-1",
            user: "Acme",
            code: "WELCOME-001",
            amount: "not-money",
            time: "2026-05-05T09:00:00Z",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => MarketingService.fetchRedemptionRecords(),
        /Redemption amount must be a money string/,
      );
    },
  );
});

test("admin marketing recharge records fail closed when backend omits trade numbers", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "recharge-1",
            userId: "user-1",
            user: "Acme",
            amount: "100.00",
            usd_credited: "15.00",
            method: "wechat",
            status: "success",
            time: "2026-05-05T09:00:00Z",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => MarketingService.fetchRechargeRecords(),
        /Recharge trade number is required/,
      );
    },
  );
});

test("admin marketing recharge records fail closed when backend returns invalid money or status values", async () => {
  for (const [patch, message] of [
    [{ amount: "not-money" }, /Recharge amount must be a money string/],
    [{ usd_credited: "-1" }, /Recharge credited points must be a non-negative integer string/],
    [{ status: "settled" }, /Unsupported recharge status: settled/],
  ] as const) {
    await withBackendSdkResponse(
      {
        code: "2000",
        data: {
          items: [
            {
              id: "recharge-1",
              tradeNo: "trade-1",
              userId: "user-1",
              user: "Acme",
              amount: "$100.00",
              usd_credited: "1000",
              method: "wechat",
              status: "success",
              time: "2026-05-05T09:00:00Z",
              ...patch,
            },
          ],
        },
      },
      async () => {
        await assert.rejects(
          () => MarketingService.fetchRechargeRecords(),
          message,
        );
      },
    );
  }
});

test("admin marketing recharge packages fail closed when backend returns malformed package rows", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        items: ["malformed-package-row"],
      },
    },
    async () => {
      await assert.rejects(
        () => MarketingService.listRechargePackages(),
        /Recharge package record is required/,
      );
    },
  );
});

test("admin marketing recharge packages fail closed when backend omits credited points", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "pkg-10",
            rmb: "10.00",
            bonus: 25,
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => MarketingService.listRechargePackages(),
        /Recharge package credited points are required/,
      );
    },
  );
});

test("admin marketing recharge package mutations fail closed when backend omits item data", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        updated: true,
      },
    },
    async () => {
      await assert.rejects(
        () => MarketingService.createRechargePackage({ rmb: "10.00", bonus: 0 }),
        /Created recharge package response is missing data/,
      );
    },
  );
});

test("admin marketing recharge package mutations validate request data before SDK calls", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        item: {
          id: "pkg-10",
          rmb: "10.00",
          bonus: 0,
          points: 100,
        },
      },
    },
    async (captured) => {
      await assert.rejects(
        () => MarketingService.createRechargePackage({ rmb: "0", bonus: 0 }),
        /rmb must be greater than zero/,
      );
      await assert.rejects(
        () => MarketingService.createRechargePackage({ rmb: "10.001", bonus: 0 }),
        /rmb must be a positive money amount/,
      );
      await assert.rejects(
        () => MarketingService.createRechargePackage({ rmb: "10.00", bonus: -1 }),
        /bonus must be a non-negative integer/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("admin marketing referral stats fail closed when backend omits invited totals", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "referral-1",
            inviter: "Acme",
            total_revenue: "120.00",
            bonus_awarded: "12.00",
            link: "https://example.test/invite/acme",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => MarketingService.fetchReferralStats(),
        /Referral invited total is required/,
      );
    },
  );
});

test("admin marketing referral stats fail closed when backend returns invalid revenue values", async () => {
  for (const [patch, message] of [
    [{ total_revenue: "not-money" }, /Referral revenue must be a money string/],
    [{ bonus_awarded: "12.345" }, /Referral bonus must be a money string/],
  ] as const) {
    await withBackendSdkResponse(
      {
        code: "2000",
        data: {
          items: [
            {
              id: "referral-1",
              inviter: "Acme",
              total_invited: 3,
              total_revenue: "$120.00",
              bonus_awarded: "$12.00",
              link: "https://example.test/invite/acme",
              ...patch,
            },
          ],
        },
      },
      async () => {
        await assert.rejects(
          () => MarketingService.fetchReferralStats(),
          message,
        );
      },
    );
  }
});

test("admin coupon batch generation fails closed when backend returns malformed generated codes", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        batch: {
          id: "batch-1",
          couponId: "9",
          name: "Launch Batch",
          count: 2,
          prefix: "LAUNCH",
          createdAt: "2026-05-05T09:00:00Z",
        },
        codes: ["malformed-promo-code-row"],
      },
    },
    async () => {
      await assert.rejects(
        () =>
          MarketingService.generateBatch({
            couponId: "9",
            name: "Launch Batch",
            count: 2,
            prefix: "LAUNCH",
          }),
        /Promo code record is required/,
      );
    },
  );
});

test("admin coupon batch generation fails closed when backend omits stable batch ids", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        batch: {
          couponId: "9",
          name: "Launch Batch",
          count: 2,
          prefix: "LAUNCH",
          createdAt: "2026-05-05T09:00:00Z",
        },
        codes: [],
      },
    },
    async () => {
      await assert.rejects(
        () =>
          MarketingService.generateBatch({
            couponId: "9",
            name: "Launch Batch",
            count: 2,
            prefix: "LAUNCH",
          }),
        /Coupon batch id is required/,
      );
    },
  );
});
