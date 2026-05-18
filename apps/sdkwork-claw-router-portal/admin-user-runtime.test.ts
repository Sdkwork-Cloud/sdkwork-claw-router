import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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
  createUserStatusUpdateInput,
} from "./packages/sdkwork-claw-router-admin-user/src/userForm.ts";

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

type CapturedBackendRequest = {
  url: string;
  method: string;
  body: string;
  headers: Record<string, string>;
};

async function withBackendSdkResponse<T>(
  responseBody: unknown,
  fn: (captured: CapturedBackendRequest[]) => Promise<T>,
): Promise<T> {
  const captured: CapturedBackendRequest[] = [];
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    enumerable: true,
    value: { dispatchEvent: () => true },
  });
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    captured.push({
      url,
      method: init?.method ?? "GET",
      body: typeof init?.body === "string" ? init.body : "",
      headers: Object.fromEntries(new Headers(init?.headers).entries()),
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

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

test("admin user create input rejects invalid balances instead of defaulting to zero", () => {
  const form = new FormData();
  form.set("email", "billing@example.com");
  form.set("username", " ");
  form.set("balance", "not-a-number");

  assert.throws(() => createUserInputFromForm(form), /balance must be a non-negative money amount/);

  const blankBalance = new FormData();
  blankBalance.set("email", "billing@example.com");
  assert.deepEqual(createUserInputFromForm(blankBalance), {
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
  recharge.set("remark", "ignored because backend has no remark field");

  assert.deepEqual(createUserBalanceAdjustmentInputFromForm(recharge, "recharge"), {
    amount: 1234.57,
    type: "recharge",
  });

  const invalidRefund = new FormData();
  invalidRefund.set("amount", "-10");

  assert.throws(
    () => createUserBalanceAdjustmentInputFromForm(invalidRefund, "refund"),
    /amount must be greater than zero/,
  );

  const missingAmount = new FormData();
  assert.throws(
    () => createUserBalanceAdjustmentInputFromForm(missingAmount, "recharge"),
    /amount is required/,
  );
});

test("admin user balance adjustment modals do not expose unsupported remark fields", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-user/src/index.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(source, /name="remark"/);
  assert.doesNotMatch(source, />备注<\/label>/);
});

test("admin user records modal does not render static fake success rows", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-user/src/index.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(source, /<td className="px-4 py-3 font-mono text-xs">Unavailable<\/td>/);
  assert.doesNotMatch(source, /text-emerald-600 bg-emerald-50[^>]+>.*鎴愬姛/);
  assert.match(source, /Records are available from the billing history and recharge records modules/);
});

test("admin user modals do not expose password controls without a backend password command", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-user/src/index.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(source, /name="password"/);
  assert.doesNotMatch(source, /generatedPassword/);
  assert.doesNotMatch(source, /generateRandomPassword/);
  assert.match(source, /Password setup is managed by IAM registration and reset flows/);
});

test("admin user create modal does not expose unsupported concurrency controls", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-user/src/index.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(source, /name="concurrency"/);
  assert.doesNotMatch(source, />并发数<\/label>/);
  assert.doesNotMatch(source, />Concurrency<\/label>/);
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

test("admin user status update input uses the backend supported status enum", () => {
  assert.deepEqual(createUserStatusUpdateInput("active"), {
    status: "active",
  });
  assert.deepEqual(createUserStatusUpdateInput("banned"), {
    status: "banned",
  });
  assert.throws(
    () => createUserStatusUpdateInput("disabled"),
    /status must be active or banned/,
  );
});

test("admin user table exposes backend-backed status toggle actions", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-user/src/index.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /handleStatusToggle/);
  assert.match(source, /createUserStatusUpdateInput\(nextStatus\)/);
  assert.match(source, /u\.status === 'active' \? t\("admin\.user\.index\.text\.1dcdrxo", "禁用"\) : t\("admin\.marketing\.index\.text\.5pm2ma", "启用"\)/);
});

test("admin user group selector preserves backend custom groups", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-user/src/index.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /createDefaultUserGroupOptions\(t\)/);
  assert.match(source, /defaultUserGroupOptions\.some\(\(group\) => group\.value === groupsTarget\.group\)/);
  assert.match(
    source,
    /t\('admin\.user\.groups\.current', '\{\{group\}\} \(current\)', \{ group: groupsTarget\.group \}\)/,
  );
});

test("admin user static copy is translated through i18n keys", () => {
  const service = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-user/src/userService.ts", import.meta.url),
    "utf8",
  );
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-user/src/index.tsx", import.meta.url),
    "utf8",
  );

  for (const token of [
    "admin.user.errors.fetchUsersFallback",
    "admin.user.errors.fetchApiKeysFallback",
    "admin.user.errors.addUserFallback",
    "admin.user.errors.updateBalanceFallback",
    "admin.user.errors.updateUserFallback",
    "admin.user.errors.createApiKeyFallback",
  ]) {
    assert.match(service, new RegExp(escapeRegExp(token)));
  }

  for (const token of [
    "t('admin.user.groups.default', 'default (Default group)')",
    "t('admin.user.groups.vip', 'VIP (Advanced users)')",
    "t('admin.user.groups.svip', 'SVIP (Premium users)')",
    "t('admin.user.index.text.passwordSetupCreate', 'Password setup is handled through registration and reset flows. This form creates the account profile.')",
    "t('admin.user.index.text.passwordSetupEdit', 'Password setup is managed by IAM registration and reset flows. No password update is sent from this profile dialog.')",
    "t('admin.user.index.text.recordsEmptyRecharge', 'No recharge records loaded')",
    "t('admin.user.index.text.recordsEmptyExchange', 'No exchange records loaded')",
    "t('admin.user.index.text.loadingUsers', 'Loading users...')",
    "t('admin.user.index.text.usersLoadError', 'Users could not be loaded')",
    "t('admin.user.index.text.usersEmpty', 'No users found')",
    "t('admin.user.index.text.usersEmptyDescription', 'Create a user before assigning groups, balances, or API keys.')",
    "t('admin.user.index.text.usersRetry', 'Retry')",
  ]) {
    assert.match(source, new RegExp(escapeRegExp(token)));
  }

  assert.match(
    source,
    /t\(\s*'admin\.user\.index\.text\.recordsEmptyDescription',\s*'Records are available from the billing history and recharge records modules; this user dialog does not synthesize transaction rows\.'\s*,?\s*\)/s,
  );
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

      assert.equal(captured[0].url, "/backend/v3/api/iam/api_keys");
      assert.equal(captured[0].method, "POST");
      assert.equal(result.key.id, "admin-key-1");
      assert.equal(result.rawKey, "sk-admin-secret");
    },
  );
});

test("admin user create and update use generated IAM users SDK commands", async () => {
  await withBackendSdkResponse(
    {
      code: "2000",
      data: {
        item: {
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
      },
    },
    async (captured) => {
      await UserService.addUser({ email: " admin@example.com ", username: " Admin " });
      await UserService.updateUser(42, { username: " Owner ", group: " vip " });

      assert.equal(captured[0].url, "/backend/v3/api/iam/users");
      assert.equal(captured[0].method, "POST");
      assert.deepEqual(JSON.parse(captured[0].body), {
        email: "admin@example.com",
        username: "Admin",
      });
      assert.equal(captured[1].url, "/backend/v3/api/iam/users");
      assert.equal(captured[1].method, "PUT");
      assert.deepEqual(JSON.parse(captured[1].body), {
        id: 42,
        username: "Owner",
        group: "vip",
      });
      assert.ok(captured[0].headers["x-request-id"]);
      assert.ok(captured[1].headers["x-request-id"]);
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

test("admin API key delete fails closed unless backend confirms deletion", async () => {
  for (const response of [{}, { deleted: false }]) {
    await withBackendSdkResponse(
      {
        code: "2000",
        data: response,
      },
      async () => {
        await assert.rejects(
          () => UserService.deleteApiKey(42, "admin-key-1"),
          /admin\.user\.errors\.deleteApiKeyFallback/,
        );
      },
    );
  }
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

test("admin API key map fails closed when backend returns malformed map shape", async () => {
  for (const [data, message] of [
    [{ 42: { id: "key-1" } }, /API key list for user 42 is required/],
    [{ guest: [] }, /API key map user id must be a positive integer/],
    [{ 0: [] }, /API key map user id must be a positive integer/],
    [{ "42.5": [] }, /API key map user id must be a positive integer/],
  ] as const) {
    await withBackendSdkResponse(
      {
        code: "2000",
        data,
      },
      async () => {
        await assert.rejects(
          () => UserService.fetchApiKeysMap(),
          message,
        );
      },
    );
  }
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
