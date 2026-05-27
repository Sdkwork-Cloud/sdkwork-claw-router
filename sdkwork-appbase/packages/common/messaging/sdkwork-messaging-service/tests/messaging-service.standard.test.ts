import { describe, expect, it } from "vitest";

import { createSdkworkMessagingService } from "../src/index";

describe("SDKWork messaging service", () => {
  it("composes generated SDK clients through ports", async () => {
    const service = createSdkworkMessagingService({
      appClient: { auth: { verificationCodes: { create: async () => ({ data: { id: "code_1" } }), verify: async () => ({ data: { verified: true } }) } } },
      backendClient: {
        messaging: {
          providerAccounts: { list: async () => ({ data: { items: [] } }), create: async () => ({ data: { id: "acct_1" } }) },
          suppressions: { list: async () => ({ data: { items: [] } }), create: async () => ({ data: { id: "suppression_1" } }) },
          rateLimitBuckets: { list: async () => ({ data: { items: [] } }) },
        } as any,
      },
    });

    await expect(service.verificationCodes.create({})).resolves.toEqual({ data: { id: "code_1" } });
    await expect(service.admin.providerAccounts.list()).resolves.toEqual({ data: { items: [] } });
    await expect(service.admin.suppressions.create({})).resolves.toEqual({ data: { id: "suppression_1" } });
    await expect(service.admin.rateLimitBuckets.list()).resolves.toEqual({ data: { items: [] } });
  });
});
