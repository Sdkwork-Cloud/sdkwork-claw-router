import { describe, expect, it } from "vitest";

import { APP_MESSAGING_METHOD_TREE, BACKEND_MESSAGING_METHOD_TREE } from "../src/index";

describe("SDKWork messaging SDK ports", () => {
  it("keeps app verification and backend operations behind generated SDK ports", () => {
    expect(APP_MESSAGING_METHOD_TREE).toHaveProperty("verificationCodes");
    expect(BACKEND_MESSAGING_METHOD_TREE).toHaveProperty("providerAccounts");
    expect(BACKEND_MESSAGING_METHOD_TREE).toHaveProperty("templates");
    expect(BACKEND_MESSAGING_METHOD_TREE).toHaveProperty("templateSends");
    expect(BACKEND_MESSAGING_METHOD_TREE).toHaveProperty("suppressions");
    expect(BACKEND_MESSAGING_METHOD_TREE).toHaveProperty("rateLimitBuckets");
    expect(BACKEND_MESSAGING_METHOD_TREE).toHaveProperty("verificationPolicies");
  });
});
