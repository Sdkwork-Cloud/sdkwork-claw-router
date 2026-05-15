import { describe, expect, it } from "vitest";

import {
  SDKWORK_COMMERCE_API_ROUTES,
  SDKWORK_COMMERCE_CAPABILITIES,
  SDKWORK_COMMERCE_DOMAIN_MODELS,
  SDKWORK_COMMERCE_OPERATION_IDS,
  SDKWORK_COMMERCE_STANDARD,
  SDKWORK_COMMERCE_TABLES,
  createCommerceLedgerPolicy,
  isCommerceMoneyAmount,
  isCommercePointAmount,
} from "../src/index";

describe("SDKWork commerce standard contracts", () => {
  it("keeps app API prefixes and billing SDK namespace standard for SaaS and private deployments", () => {
    expect(SDKWORK_COMMERCE_STANDARD.api.appPrefix).toBe("/app/v3/api");
    expect(SDKWORK_COMMERCE_STANDARD.api.backendPrefix).toBe("/backend/v3/api");
    expect(SDKWORK_COMMERCE_STANDARD.api.openapi).toBe("3.1.2");
    expect(SDKWORK_COMMERCE_STANDARD.domain).toBe("commerce");
    expect(SDKWORK_COMMERCE_STANDARD.sdkNamespaces).toEqual(["billing"]);

    expect(SDKWORK_COMMERCE_API_ROUTES.billing.wallet.overview.retrieve.path).toBe("/app/v3/api/billing/wallet/overview");
    expect(SDKWORK_COMMERCE_API_ROUTES.billing.account.points.recharge.create.path).toBe("/app/v3/api/billing/account/points/recharges");
    expect(SDKWORK_COMMERCE_API_ROUTES.billing.vip.packGroups.packs.list.path).toBe("/app/v3/api/billing/vip/pack_groups/{packGroupId}/packs");
  });

  it("uses resource-oriented operationIds and lower_snake_case paths", () => {
    const operationIds = Object.values(SDKWORK_COMMERCE_OPERATION_IDS).map((operation) => operation.operationId);
    const paths = Object.values(SDKWORK_COMMERCE_OPERATION_IDS).map((operation) => operation.path);

    expect(new Set(operationIds).size).toBe(operationIds.length);
    expect(operationIds).toEqual(expect.arrayContaining([
      "account.summary.retrieve",
      "wallet.overview.retrieve",
      "wallet.topups.create",
      "account.points.recharge.create",
      "account.tokens.deduct.create",
      "vip.purchase.upgrade",
      "preflight.preholds.create",
    ]));

    for (const operationId of operationIds) {
      expect(operationId).toMatch(/^[a-z][a-zA-Z0-9]*(\.[a-z][a-zA-Z0-9]*)+$/);
      expect(operationId).not.toMatch(/(^billing\.|[_\-/{}:\s])/);
    }

    for (const path of paths) {
      expect(path).toMatch(/^\/app\/v3\/api\/billing\/[a-z0-9_/{}/-]+$/);
      expect(path).not.toContain("__");
      expect(path).not.toContain("/vip/purchase");
      expect(path).not.toContain("/account/points/recharge");
    }
  });

  it("defines standard commerce tables with tenant isolation, ledger facts, and idempotency", () => {
    expect(SDKWORK_COMMERCE_TABLES).toMatchObject({
      account: "commerce_account",
      accountLedgerEntry: "commerce_account_ledger_entry",
      idempotencyKey: "commerce_idempotency_key",
      vipMembership: "commerce_vip_membership",
      vipPack: "commerce_vip_pack",
      vipPrivilegeUsage: "commerce_vip_privilege_usage",
      billingPrehold: "commerce_billing_prehold",
    });

    for (const tableName of Object.values(SDKWORK_COMMERCE_TABLES)) {
      expect(tableName).toMatch(/^commerce_[a-z0-9_]+$/);
      expect(tableName).not.toContain("__");
    }

    const account = SDKWORK_COMMERCE_DOMAIN_MODELS.find((model) => model.name === "account");
    expect(account?.fields).toEqual(expect.arrayContaining([
      "tenant_id",
      "organization_id",
      "owner_user_id",
      "asset_type",
      "available_amount",
      "frozen_amount",
      "version",
    ]));

    const ledger = SDKWORK_COMMERCE_DOMAIN_MODELS.find((model) => model.name === "accountLedgerEntry");
    expect(ledger?.fields).toEqual(expect.arrayContaining([
      "account_id",
      "direction",
      "amount",
      "balance_after",
      "transaction_no",
      "request_no",
      "idempotency_key",
      "trace_id",
    ]));
  });

  it("assigns every operation to exactly one capability", () => {
    const operationIds = Object.keys(SDKWORK_COMMERCE_OPERATION_IDS).sort();
    const capabilityOperationIds = SDKWORK_COMMERCE_CAPABILITIES.flatMap((capability) => capability.operations).sort();

    expect(capabilityOperationIds).toEqual(operationIds);
    expect(new Set(capabilityOperationIds).size).toBe(operationIds.length);
  });

  it("normalizes monetary and point amounts for cross-language API safety", () => {
    expect(isCommerceMoneyAmount("0")).toBe(true);
    expect(isCommerceMoneyAmount("19.99")).toBe(true);
    expect(isCommerceMoneyAmount("19.999")).toBe(false);
    expect(isCommerceMoneyAmount("-1")).toBe(false);

    expect(isCommercePointAmount("0")).toBe(true);
    expect(isCommercePointAmount("100000")).toBe(true);
    expect(isCommercePointAmount("1.5")).toBe(false);
    expect(isCommercePointAmount("-1")).toBe(false);

    expect(createCommerceLedgerPolicy()).toMatchObject({
      amountScale: 6,
      moneyScale: 2,
      optimisticLocking: true,
      requireIdempotencyKey: true,
      requireImmutableLedger: true,
    });
  });
});
