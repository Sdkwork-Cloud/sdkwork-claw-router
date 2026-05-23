import {
  describe,
  expect,
  it,
} from "vitest";
import {
  createCanonicalUserCenterRuntimeBridge,
} from "../src/domain/userCenterRuntimeBridge.ts";

describe("canonical user-center runtime bridge", () => {
  it("creates a runtime client for builtin-local providers", () => {
    const bridge = createCanonicalUserCenterRuntimeBridge({
      namespace: "sdkwork-test",
      provider: {
        kind: "builtin-local",
      },
      storage: {
        dialect: "sqlite",
        sqlitePath: "app://sdkwork-test/user-center.db",
      },
    });

    expect(bridge.apiBaseUrl).toBeNull();
    expect(bridge.runtimeConfig.provider.kind).toBe("builtin-local");
    expect(bridge.runtimeClient).not.toBeNull();
    expect(typeof bridge.runtimeClient?.getProfile).toBe("function");
    expect(typeof bridge.runtimeClient?.updateMembership).toBe("function");
  });
});
