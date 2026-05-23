import { describe, expect, it, vi } from "vitest";

import {
  SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS,
  SDKWORK_COMMERCE_BACKEND_SDK_REQUIRED_METHODS,
  type CommerceAppSdkClient,
  type CommerceBackendSdkClient,
} from "@sdkwork/commerce-sdk-ports";

import {
  createCommerceRuntime,
  createMemoryCommerceFeatureFlagStore,
} from "../src/index";

describe("SDKWork commerce runtime", () => {
  it("bootstraps deployments through injected commerce-root appbase SDK clients", () => {
    const runtime = createCommerceRuntime({
      clients: {
        app: createClient<CommerceAppSdkClient>(SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS),
        backend: createClient<CommerceBackendSdkClient>(SDKWORK_COMMERCE_BACKEND_SDK_REQUIRED_METHODS),
      },
      config: {
        appApiBaseUrl: "https://commerce-api.example.com",
        appId: "sdkwork-router",
        backendApiBaseUrl: "https://commerce-admin.example.com",
        deploymentMode: "private",
        environment: "production",
      },
    });

    expect(runtime.config).toEqual({
      appApiBaseUrl: "https://commerce-api.example.com/app/v3/api",
      appId: "sdkwork-router",
      backendApiBaseUrl: "https://commerce-admin.example.com/backend/v3/api",
      deploymentMode: "private",
      environment: "production",
    });
    expect(runtime.service.accounts.current.summary.retrieve).toBeDefined();
    expect(runtime.service.catalog.products.list).toBeDefined();
    expect(runtime.service.cart.current.retrieve).toBeDefined();
    expect(runtime.service.checkout.sessions.orders.create).toBeDefined();
    expect(runtime.service.orders.cancellations.create).toBeDefined();
    expect(runtime.service.payments.intents.attempts.create).toBeDefined();
    expect(runtime.service.refunds.create).toBeDefined();
    expect(runtime.service.fulfillments.retrieve).toBeDefined();
    expect(runtime.service.shipments.retrieve).toBeDefined();
    expect(runtime.service.memberships.purchases.create).toBeDefined();
    expect(runtime.service.recharges.orders.create).toBeDefined();
    expect(runtime.service.wallet.ledgerEntries.retrieve).toBeDefined();
    expect(runtime.service.coupons.redemptions.create).toBeDefined();
    expect(runtime.service.invoices.create).toBeDefined();
    expect(runtime.service.admin.catalog.products.create).toBeDefined();
    expect(runtime.service.admin.inventory.stocks.update).toBeDefined();
    expect(runtime.service.admin.payments.providerAccounts.create).toBeDefined();
    expect(runtime.service.admin.payments.reconciliationRuns.list).toBeDefined();
    expect(runtime.service.admin.commerceReports.paymentReconciliation.retrieve).toBeDefined();
    expect(runtime.service.admin.audit.commerceEvents.list).toBeDefined();

    for (const flag of [
      "commerce.catalog",
      "commerce.inventory",
      "commerce.cart",
      "commerce.checkout",
      "commerce.orders",
      "commerce.payments",
      "commerce.refunds",
      "commerce.fulfillments",
      "commerce.shipments",
      "commerce.memberships",
      "commerce.recharges",
      "commerce.coupons",
      "commerce.wallet",
      "commerce.invoices",
      "commerce.reports",
      "commerce.audit",
      "commerce.admin",
    ]) {
      expect(runtime.featureFlagStore.isEnabled(flag)).toBe(true);
    }

    for (const retiredFlag of [
      "commerce.account",
      "commerce.preflight",
      "commerce.settlements",
      "commerce.vip",
    ]) {
      expect(runtime.featureFlagStore.isEnabled(retiredFlag)).toBe(false);
    }
  });

  it("validates generated app SDK clients during runtime bootstrap", () => {
    const appClient = createClient<CommerceAppSdkClient>(SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS);
    Object.assign(appClient, { account: {} });

    expect(() =>
      createCommerceRuntime({
        clients: { app: appClient },
        config: {
          appId: "sdkwork-router",
          deploymentMode: "saas",
          environment: "test",
        },
      }),
    ).toThrow(/retired.*account/i);
  });

  it("validates generated backend SDK clients during runtime bootstrap when admin operations are enabled", () => {
    const backendClient = createClient<CommerceBackendSdkClient>(SDKWORK_COMMERCE_BACKEND_SDK_REQUIRED_METHODS);
    Object.assign(backendClient, { vip: { levels: { create: vi.fn() } } });

    expect(() =>
      createCommerceRuntime({
        clients: {
          app: createClient<CommerceAppSdkClient>(SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS),
          backend: backendClient,
        },
        config: {
          appId: "sdkwork-router",
          deploymentMode: "private",
          environment: "test",
        },
      }),
    ).toThrow(/retired.*vip/i);
  });

  it("allows app-only runtime bootstrap for clients that do not mount admin surfaces", () => {
    const runtime = createCommerceRuntime({
      clients: {
        app: createClient<CommerceAppSdkClient>(SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS),
      },
      config: {
        appId: "sdkwork-router",
        deploymentMode: "saas",
        environment: "production",
      },
    });

    expect(runtime.service.admin).toBeDefined();
    expect(runtime.config.deploymentMode).toBe("saas");
  });

  it("keeps feature flags local to the commerce runtime boundary", () => {
    const featureFlagStore = createMemoryCommerceFeatureFlagStore({
      "commerce.memberships": true,
      "commerce.wallet.withdrawals": false,
    });

    expect(featureFlagStore.isEnabled("commerce.memberships")).toBe(true);
    expect(featureFlagStore.isEnabled("commerce.wallet.withdrawals")).toBe(false);
    expect(featureFlagStore.isEnabled("commerce.vip")).toBe(false);
    expect(featureFlagStore.isEnabled("unknown")).toBe(false);

    featureFlagStore.set("commerce.wallet.withdrawals", true);
    expect(featureFlagStore.isEnabled("commerce.wallet.withdrawals")).toBe(true);
  });
});

type MockNode = ReturnType<typeof vi.fn> | { [key: string]: MockNode };

function createClient<TClient>(methods: readonly string[]): TClient {
  const root: { [key: string]: MockNode } = {};
  for (const method of methods) {
    let node = root;
    const segments = method.split(".");
    for (const segment of segments.slice(0, -1)) {
      let child = node[segment];
      if (!child || typeof child === "function") {
        child = {};
        node[segment] = child;
      }
      node = child as { [key: string]: MockNode };
    }
    node[segments.at(-1)!] = vi.fn().mockResolvedValue({ data: {} });
  }
  return root as TClient;
}
