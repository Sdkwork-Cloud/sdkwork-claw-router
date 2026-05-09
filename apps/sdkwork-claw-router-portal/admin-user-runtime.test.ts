import assert from "node:assert/strict";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import { UserService } from "./packages/sdkwork-claw-router-admin-user/src/userService.ts";
import {
  createApiKeyInputFromForm,
  createUserBalanceAdjustmentInputFromForm,
  createUserGroupUpdateInputFromForm,
  createUserInputFromForm,
  createUserProfileUpdateInputFromForm,
} from "./packages/sdkwork-claw-router-admin-user/src/userForm.ts";

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

test("admin user create input does not reuse the returned user view model", () => {
  const form = new FormData();
  form.set("email", " admin@example.com ");
  form.set("username", " Root User ");
  form.set("balance", "42.5");
  form.set("password", "ignored-password");
  form.set("concurrency", "99");

  const input = createUserInputFromForm(form);

  assert.deepEqual(input, {
    email: "admin@example.com",
    username: "Root User",
    balance: "42.50",
  });
  for (const field of ["id", "role", "group", "status", "lastActive", "lastUsed", "createdAt"]) {
    assert.equal(field in input, false);
  }
});

test("admin user create input defaults invalid balances to a decimal command value", () => {
  const form = new FormData();
  form.set("email", "billing@example.com");
  form.set("username", " ");
  form.set("balance", "not-a-number");

  assert.deepEqual(createUserInputFromForm(form), {
    email: "billing@example.com",
    balance: "0.00",
  });
});

test("admin API key create input uses stable command naming without clock drift", () => {
  const named = new FormData();
  named.set("keyName", " Production Key ");

  assert.deepEqual(createApiKeyInputFromForm(named, 42), {
    userId: 42,
    name: "Production Key",
  });

  const unnamed = new FormData();
  assert.deepEqual(createApiKeyInputFromForm(unnamed, 42), {
    userId: 42,
    name: "Default API Key",
  });
});

test("admin user balance adjustment input is parsed as an explicit command", () => {
  const recharge = new FormData();
  recharge.set("amount", " 1,234.567 ");
  recharge.set("id", "99");
  recharge.set("balance", "999999");

  assert.deepEqual(createUserBalanceAdjustmentInputFromForm(recharge, "recharge"), {
    amount: 1234.57,
    type: "recharge",
  });

  const invalidRefund = new FormData();
  invalidRefund.set("amount", "-10");

  assert.deepEqual(createUserBalanceAdjustmentInputFromForm(invalidRefund, "refund"), {
    amount: 0,
    type: "refund",
  });
});

test("admin user profile update input does not reuse returned user fields", () => {
  const form = new FormData();
  form.set("username", " Billing Owner ");
  form.set("password", "ignored-password");
  form.set("email", "ignored@example.com");
  form.set("status", "banned");

  const input = createUserProfileUpdateInputFromForm(form);

  assert.deepEqual(input, {
    username: "Billing Owner",
  });
  for (const field of ["id", "email", "role", "group", "balance", "status", "lastActive", "lastUsed", "createdAt"]) {
    assert.equal(field in input, false);
  }

  const blank = new FormData();
  blank.set("username", " ");
  assert.deepEqual(createUserProfileUpdateInputFromForm(blank), {});
});

test("admin user group update input is isolated from the user view model", () => {
  const form = new FormData();
  form.set("group", " vip ");
  form.set("role", "admin");
  form.set("balance", "100");

  assert.deepEqual(createUserGroupUpdateInputFromForm(form), {
    group: "vip",
  });
});

test("admin user service reads created API key data returned by the generated backend SDK", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        key: {
          id: "admin-key-1",
          name: "Production Key",
          key: "sk-****1234",
          used: "0",
          status: "active",
        },
        rawKey: "sk-admin-secret",
      },
    },
    async (captured) => {
      const result = await UserService.createApiKey({ userId: 42, name: "Production Key" });

      assert.equal(captured[0].url, "/backend/v3/api/apikey");
      assert.equal(captured[0].method, "POST");
      assert.equal(result.key.id, "admin-key-1");
      assert.equal(result.rawKey, "sk-admin-secret");
    },
  );
});

test("admin user service rejects unsafe API key path ids before calling generated backend SDK", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: { deleted: true },
    },
    async (captured) => {
      await assert.rejects(
        () => UserService.deleteApiKey(42, "key/1"),
        /apiKeyId must be a safe path segment/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("admin user list fails closed when backend omits stable user ids", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            email: "missing-id@example.com",
            username: "Missing Id",
            role: "user",
            group: "default",
            balance: "0.00",
            status: "active",
            lastActive: "2026-05-05T09:00:00Z",
            lastUsed: "2026-05-05T09:00:00Z",
            createdAt: "2026-05-05T08:00:00Z",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => UserService.fetchUsers(),
        /User id is required/,
      );
    },
  );
});

test("admin user list fails closed when backend returns malformed user rows", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: 42,
            email: "admin@example.com",
            username: "Admin",
            role: "admin",
            group: "default",
            balance: "0.00",
            status: "active",
            lastActive: "2026-05-05T09:00:00Z",
            lastUsed: "2026-05-05T09:00:00Z",
            createdAt: "2026-05-05T08:00:00Z",
          },
          "malformed-user-row",
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => UserService.fetchUsers(),
        /User record is required/,
      );
    },
  );
});

test("admin user list fails closed when backend omits user email", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: 42,
            username: "Admin",
            role: "admin",
            group: "default",
            balance: "0.00",
            status: "active",
            lastActive: "2026-05-05T09:00:00Z",
            lastUsed: "2026-05-05T09:00:00Z",
            createdAt: "2026-05-05T08:00:00Z",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => UserService.fetchUsers(),
        /User email is required/,
      );
    },
  );
});

test("admin user list fails closed when backend returns unsupported user status", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: 42,
            email: "admin@example.com",
            username: "Admin",
            role: "admin",
            group: "default",
            balance: "0.00",
            status: "deleted",
            lastActive: "2026-05-05T09:00:00Z",
            lastUsed: "2026-05-05T09:00:00Z",
            createdAt: "2026-05-05T08:00:00Z",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => UserService.fetchUsers(),
        /Unsupported user status: deleted/,
      );
    },
  );
});

test("admin API key map fails closed when backend returns malformed key rows", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        42: ["malformed-api-key-row"],
      },
    },
    async () => {
      await assert.rejects(
        () => UserService.fetchApiKeysMap(),
        /API key record is required/,
      );
    },
  );
});

test("admin API key map fails closed when backend omits stable key ids", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        42: [
          {
            name: "Production Key",
            key: "sk-****1234",
            used: "0",
            status: "active",
          },
        ],
      },
    },
    async () => {
      await assert.rejects(
        () => UserService.fetchApiKeysMap(),
        /API key id is required/,
      );
    },
  );
});

test("admin API key creation fails closed when backend omits stable key ids", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        key: {
          name: "Production Key",
          key: "sk-****1234",
          used: "0",
          status: "active",
        },
        rawKey: "sk-admin-secret",
      },
    },
    async () => {
      await assert.rejects(
        () => UserService.createApiKey({ userId: 42, name: "Production Key" }),
        /API key id is required/,
      );
    },
  );
});

test("admin API key creation fails closed when backend omits key material", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        key: {
          id: "admin-key-1",
          name: "Production Key",
          used: "0",
          status: "active",
        },
        rawKey: "sk-admin-secret",
      },
    },
    async () => {
      await assert.rejects(
        () => UserService.createApiKey({ userId: 42, name: "Production Key" }),
        /API key value is required/,
      );
    },
  );
});
