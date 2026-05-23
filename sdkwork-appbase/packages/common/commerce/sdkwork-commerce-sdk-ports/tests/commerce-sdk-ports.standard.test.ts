import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it, vi } from "vitest";

import {
  SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS,
  SDKWORK_COMMERCE_BACKEND_SDK_REQUIRED_METHODS,
  assertCommerceAppSdkClient,
  assertCommerceBackendSdkClient,
  getCommerceSdkSurface,
} from "../src/index";

describe("SDKWork commerce SDK port contracts", () => {
  it("defines app and backend SDK ports as commerce-root appbase capabilities", () => {
    const source = readFileSync(
      resolve(process.cwd(), "packages/common/commerce/sdkwork-commerce-sdk-ports/src/index.ts"),
      "utf8",
    );

    expect(source).toContain("APP_COMMERCE_METHOD_TREE");
    expect(source).toContain("BACKEND_COMMERCE_METHOD_TREE");
    expect(source).toContain("APP_SDK_METHOD_TREE");
    expect(source).toContain("BACKEND_SDK_METHOD_TREE");
    expect(source).toContain("CommerceAppResourceClient");
    expect(source).toContain("CommerceBackendResourceClient");
    expect(source).not.toContain("APP_BILLING_METHOD_TREE");
    expect(source).not.toContain("BACKEND_BILLING_METHOD_TREE");
    expect(source).not.toContain("CommerceBillingResourceClient");
    expect(source).not.toContain("CommerceBackendBillingResourceClient");
  });

  it("publishes required app SDK methods through commerce root", () => {
    for (const method of [
      "commerce.accounts.current.summary.retrieve",
      "commerce.cart.current.retrieve",
      "commerce.cart.items.create",
      "commerce.addresses.defaultSelection.create",
      "commerce.checkout.sessions.orders.create",
      "commerce.orders.cancellations.create",
      "commerce.payments.intents.attempts.create",
      "commerce.refunds.create",
      "commerce.fulfillments.retrieve",
      "commerce.shipments.retrieve",
      "commerce.memberships.purchases.create",
      "commerce.recharges.orders.create",
      "commerce.wallet.ledgerEntries.retrieve",
      "commerce.coupons.redemptions.create",
      "commerce.invoices.create",
    ]) {
      expect(SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS).toContain(method);
    }

    for (const retired of [
      "billing.account.summary.retrieve",
      "billing.wallet.transactions.retrieve",
      "billing.coupons.redeem.create",
      "billing.payments.checkout.retrieve",
      "billing.vip.purchase.create",
      "billing.preflight.preholds.create",
      "vip.purchase.create",
      "preflight.preholds.create",
    ]) {
      expect(SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS).not.toContain(retired);
    }
  });

  it("publishes required backend SDK methods through commerce root", () => {
    for (const method of [
      "commerce.catalog.products.create",
      "commerce.inventory.stocks.update",
      "commerce.orders.events.list",
      "commerce.payments.providerAccounts.create",
      "commerce.payments.reconciliationRuns.list",
      "commerce.refunds.retrieve",
      "commerce.memberships.entitlements.list",
      "commerce.recharges.orders.list",
      "commerce.wallet.adjustments.create",
      "commerce.coupons.redemptions.list",
      "commerce.invoices.titles.list",
      "commerce.commerceReports.paymentReconciliation.retrieve",
      "commerce.audit.commerceEvents.list",
    ]) {
      expect(SDKWORK_COMMERCE_BACKEND_SDK_REQUIRED_METHODS).toContain(method);
    }

    for (const retired of [
      "billing.coupons.list",
      "billing.finance.usageStatements.list",
      "billing.vip.levels.create",
      "finance.usageStatements.list",
      "vip.levels.create",
    ]) {
      expect(SDKWORK_COMMERCE_BACKEND_SDK_REQUIRED_METHODS).not.toContain(retired);
    }
  });

  it("accepts generated SDK clients mounted at commerce root", () => {
    const appClient = createClient(SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS);
    const backendClient = createClient(SDKWORK_COMMERCE_BACKEND_SDK_REQUIRED_METHODS);

    expect(() => assertCommerceAppSdkClient(appClient)).not.toThrow();
    expect(() => assertCommerceBackendSdkClient(backendClient)).not.toThrow();
    expect(getCommerceSdkSurface(appClient)).toContain("commerce.memberships.purchases.create");
    expect(getCommerceSdkSurface(backendClient)).toContain("commerce.payments.providerAccounts.create");
  });

  it("rejects billing roots and incomplete commerce clients", () => {
    expect(() =>
      assertCommerceAppSdkClient({
        ...createClient(SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS),
        billing: { account: { summary: { retrieve: vi.fn() } } },
      }),
    ).toThrow(/retired.*billing/i);

    expect(() =>
      assertCommerceBackendSdkClient({
        ...createClient(SDKWORK_COMMERCE_BACKEND_SDK_REQUIRED_METHODS),
        billing: { finance: { usageStatements: { list: vi.fn() } } },
      }),
    ).toThrow(/retired.*billing/i);

    expect(() =>
      assertCommerceAppSdkClient({
        commerce: {
          accounts: {
            current: {
              summary: { retrieve: vi.fn() },
            },
          },
        },
      }),
    ).toThrow(/commerce\.coupons\.redemptions\.create/);
  });
});

function createClient(methods: readonly string[]) {
  const root: Record<string, any> = {};
  for (const method of methods) {
    let node = root;
    const segments = method.split(".");
    for (const segment of segments.slice(0, -1)) {
      node[segment] ??= {};
      node = node[segment];
    }
    node[segments.at(-1)!] = vi.fn();
  }
  return root;
}
