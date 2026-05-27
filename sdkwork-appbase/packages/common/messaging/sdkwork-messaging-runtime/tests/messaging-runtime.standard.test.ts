import { describe, expect, it } from "vitest";

import { createMessagingRuntime } from "../src/index";

describe("SDKWork messaging runtime", () => {
  it("requires generated SDK-shaped app and backend clients", () => {
    const runtime = createMessagingRuntime({
      clients: {
        app: { auth: { verificationCodes: { create: async () => ({}), verify: async () => ({}) } } },
        backend: { messaging: { providerAccounts: { list: async () => ({}), create: async () => ({}) } } as any },
      },
      config: { appId: "default", enabledChannels: ["sms", "email"], environment: "test" },
    });

    expect(runtime.config.enabledChannels).toEqual(["sms", "email"]);
    expect(runtime.service).toHaveProperty("admin");
  });
});
